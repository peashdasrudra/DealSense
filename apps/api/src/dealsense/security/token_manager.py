"""DealSense API — Token Manager.

Manages HubSpot OAuth tokens with:
- Fernet encryption at rest (database)
- Redis caching for hot reads
- Distributed locking for concurrent refresh prevention
- Automatic refresh when tokens expire
- Audit logging for all token operations
"""

import time
from datetime import UTC, datetime
from uuid import UUID

import httpx
import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.config import get_settings
from dealsense.domain.exceptions import (
    OAuthTokenExpiredError,
    OAuthTokenRefreshError,
    TenantNotFoundError,
)
from dealsense.domain.models import HubSpotConnection
from dealsense.infrastructure.encryption import decrypt_value, encrypt_value
from dealsense.infrastructure.redis_client import (
    acquire_lock,
    cache_delete,
    cache_get,
    cache_set,
    release_lock,
)

logger = structlog.get_logger(__name__)

# Cache TTL: slightly less than token expiry (30 min for HubSpot tokens)
ACCESS_TOKEN_CACHE_TTL = 25 * 60  # 25 minutes
REFRESH_LOCK_TTL = 30  # 30 seconds max lock hold time
REFRESH_LOCK_WAIT = 10  # 10 seconds max wait for lock


def _cache_key(tenant_id: UUID) -> str:
    """Build a tenant-scoped cache key for access tokens."""
    return f"tenant:{tenant_id}:access_token"


def _refresh_lock_key(tenant_id: UUID) -> str:
    """Build a tenant-scoped lock key for token refresh."""
    return f"tenant:{tenant_id}:token_refresh_lock"


async def get_access_token(
    tenant_id: UUID,
    db: AsyncSession,
) -> str:
    """Get a valid HubSpot access token for a tenant.

    Flow:
    1. Check Redis cache for a valid token
    2. If cached, return immediately
    3. If not cached, load from DB, check expiry
    4. If expired, refresh the token
    5. Cache the new token and return

    Args:
        tenant_id: The tenant's UUID
        db: Active database session

    Returns:
        A valid HubSpot access token string

    Raises:
        TenantNotFoundError: If no connection exists for the tenant
        OAuthTokenRefreshError: If token refresh fails
        OAuthTokenExpiredError: If tokens cannot be refreshed
    """
    # 1. Check cache first
    cached = await cache_get(_cache_key(tenant_id))
    if cached:
        logger.debug("token_cache_hit", tenant_id=str(tenant_id))
        return cached

    logger.debug("token_cache_miss", tenant_id=str(tenant_id))

    # 2. Load connection from database
    connection = await _get_connection(tenant_id, db)

    # 3. Check if token is still valid
    now = datetime.now(UTC)
    if connection.token_expires_at.replace(tzinfo=UTC) > now:
        # Token is still valid — decrypt and cache
        access_token = decrypt_value(connection.encrypted_access_token)
        await cache_set(
            _cache_key(tenant_id),
            access_token,
            ttl_seconds=ACCESS_TOKEN_CACHE_TTL,
        )
        logger.debug("token_loaded_from_db", tenant_id=str(tenant_id))
        return access_token

    # 4. Token is expired — refresh with distributed lock
    logger.info("token_expired_refreshing", tenant_id=str(tenant_id))
    return await _refresh_token_with_lock(tenant_id, connection, db)


async def store_tokens(
    tenant_id: UUID,
    access_token: str,
    refresh_token: str,
    expires_in: int,
    scopes: str,
    db: AsyncSession,
) -> None:
    """Store new OAuth tokens for a tenant (initial install or refresh).

    Encrypts tokens before database storage and caches the access token.

    Args:
        tenant_id: The tenant's UUID
        access_token: HubSpot access token (plaintext)
        refresh_token: HubSpot refresh token (plaintext)
        expires_in: Token validity in seconds
        scopes: Granted OAuth scopes
        db: Active database session
    """
    expires_at = datetime.fromtimestamp(time.time() + expires_in, tz=UTC)

    # Encrypt tokens
    encrypted_access = encrypt_value(access_token)
    encrypted_refresh = encrypt_value(refresh_token)

    # Check if connection already exists
    stmt = select(HubSpotConnection).where(HubSpotConnection.tenant_id == tenant_id)
    result = await db.execute(stmt)
    connection = result.scalar_one_or_none()

    if connection:
        # Update existing connection
        connection.encrypted_access_token = encrypted_access
        connection.encrypted_refresh_token = encrypted_refresh
        connection.token_expires_at = expires_at
        connection.scopes = scopes
        connection.is_active = True
        connection.refresh_failure_count = 0
        connection.last_refresh_at = datetime.now(UTC)
    else:
        # Create new connection
        connection = HubSpotConnection(
            tenant_id=tenant_id,
            encrypted_access_token=encrypted_access,
            encrypted_refresh_token=encrypted_refresh,
            token_expires_at=expires_at,
            scopes=scopes,
            is_active=True,
        )
        db.add(connection)

    await db.flush()

    # Cache the access token
    cache_ttl = min(expires_in - 300, ACCESS_TOKEN_CACHE_TTL)  # 5 min buffer
    if cache_ttl > 0:
        await cache_set(_cache_key(tenant_id), access_token, ttl_seconds=cache_ttl)

    logger.info(
        "tokens_stored",
        tenant_id=str(tenant_id),
        expires_in=expires_in,
        scopes=scopes,
    )


async def invalidate_tokens(tenant_id: UUID, db: AsyncSession) -> None:
    """Invalidate all tokens for a tenant (disconnect / uninstall).

    Marks the connection as inactive and purges cache.

    Args:
        tenant_id: The tenant's UUID
        db: Active database session
    """
    connection = await _get_connection(tenant_id, db)
    connection.is_active = False
    await db.flush()

    # Purge from cache
    await cache_delete(_cache_key(tenant_id))

    logger.info("tokens_invalidated", tenant_id=str(tenant_id))


async def get_connection_status(tenant_id: UUID, db: AsyncSession) -> dict[str, object]:
    """Get the OAuth connection status for a tenant.

    Returns:
        Dict with connection health information.
    """
    try:
        connection = await _get_connection(tenant_id, db)
    except TenantNotFoundError:
        return {
            "connected": False,
            "is_active": False,
            "scopes": "",
        }

    now = datetime.now(UTC)
    expires_at = connection.token_expires_at.replace(tzinfo=UTC)

    return {
        "connected": True,
        "is_active": connection.is_active,
        "token_expires_at": connection.token_expires_at.isoformat(),
        "token_expired": expires_at <= now,
        "scopes": connection.scopes,
        "last_refresh_at": (
            connection.last_refresh_at.isoformat() if connection.last_refresh_at else None
        ),
        "refresh_failure_count": connection.refresh_failure_count,
    }


# ---- Internal Helpers ----


async def _get_connection(tenant_id: UUID, db: AsyncSession) -> HubSpotConnection:
    """Load a tenant's HubSpot connection or raise."""
    stmt = select(HubSpotConnection).where(HubSpotConnection.tenant_id == tenant_id)
    result = await db.execute(stmt)
    connection = result.scalar_one_or_none()

    if not connection:
        raise TenantNotFoundError(str(tenant_id))

    return connection


async def _refresh_token_with_lock(
    tenant_id: UUID,
    connection: HubSpotConnection,
    db: AsyncSession,
) -> str:
    """Refresh the OAuth token using a distributed lock.

    Prevents multiple concurrent refresh requests (thundering herd) by
    acquiring a Redis lock before calling the HubSpot token endpoint.
    """
    lock = await acquire_lock(
        _refresh_lock_key(tenant_id),
        timeout=REFRESH_LOCK_TTL,
        blocking_timeout=REFRESH_LOCK_WAIT,
    )

    if not lock:
        # Another process is refreshing — wait and try cache again
        logger.info("refresh_lock_contention", tenant_id=str(tenant_id))
        cached = await cache_get(_cache_key(tenant_id))
        if cached:
            return cached
        raise OAuthTokenRefreshError(
            "Token refresh in progress by another process — try again shortly"
        )

    try:
        # Double-check cache (another process may have just refreshed)
        cached = await cache_get(_cache_key(tenant_id))
        if cached:
            return cached

        # Decrypt the refresh token
        refresh_token = decrypt_value(connection.encrypted_refresh_token)

        # Call HubSpot token endpoint
        settings = get_settings()
        new_tokens = await _call_hubspot_refresh(
            refresh_token=refresh_token,
            client_id=settings.hubspot_client_id,
            client_secret=settings.hubspot_client_secret,
        )

        # Store the refreshed tokens
        await store_tokens(
            tenant_id=tenant_id,
            access_token=new_tokens["access_token"],
            refresh_token=new_tokens["refresh_token"],
            expires_in=new_tokens["expires_in"],
            scopes=connection.scopes,
            db=db,
        )

        # Reset failure count
        connection.refresh_failure_count = 0
        await db.flush()

        logger.info("token_refreshed", tenant_id=str(tenant_id))
        return new_tokens["access_token"]

    except OAuthTokenRefreshError as err:
        # Track failures
        connection.refresh_failure_count += 1
        await db.flush()

        if connection.refresh_failure_count >= 3:
            logger.error(
                "token_refresh_max_failures",
                tenant_id=str(tenant_id),
                failures=connection.refresh_failure_count,
            )
            connection.is_active = False
            await db.flush()
            raise OAuthTokenExpiredError() from err

        raise

    finally:
        await release_lock(lock)


async def _call_hubspot_refresh(
    refresh_token: str,
    client_id: str,
    client_secret: str,
) -> dict[str, object]:
    """Call HubSpot's OAuth token endpoint to refresh tokens.

    Returns:
        Dict with access_token, refresh_token, and expires_in.

    Raises:
        OAuthTokenRefreshError: If the API call fails.
    """
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.post(
                "https://api.hubapi.com/oauth/v1/token",
                data={
                    "grant_type": "refresh_token",
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "refresh_token": refresh_token,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )

            if response.status_code != 200:
                logger.error(
                    "hubspot_token_refresh_failed",
                    status_code=response.status_code,
                    # Never log tokens or response body with secrets
                )
                raise OAuthTokenRefreshError(
                    f"HubSpot token refresh failed: HTTP {response.status_code}"
                )

            data = response.json()
            return {
                "access_token": data["access_token"],
                "refresh_token": data["refresh_token"],
                "expires_in": data.get("expires_in", 1800),
            }

        except httpx.HTTPError as e:
            raise OAuthTokenRefreshError(f"HubSpot token refresh network error: {e}") from e
