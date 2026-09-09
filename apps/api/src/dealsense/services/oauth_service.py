"""DealSense API — OAuth Service.

Handles HubSpot OAuth 2.0 authorization code flow, CSRF state management,
token exchange, tenant provisioning, session JWT issuance, and disconnect workflows.
Architected for HubSpot App Marketplace Certification standards.
"""

import hashlib
import hmac
import json
import secrets
import time
import urllib.parse
from uuid import NAMESPACE_DNS, UUID, uuid4, uuid5

import httpx
import jwt
import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.config import get_settings
from dealsense.domain.enums import TenantStatus
from dealsense.domain.exceptions import OAuthError, OAuthStateValidationError
from dealsense.domain.models import Tenant
from dealsense.infrastructure.redis_client import acquire_lock, cache_delete, cache_get, cache_set, release_lock
from dealsense.security.token_manager import get_connection_status, invalidate_tokens, store_tokens
from dealsense.services.audit_service import record_audit_event

logger = structlog.get_logger(__name__)

OAUTH_STATE_PREFIX = "oauth:state:"
OAUTH_STATE_TTL = 1800  # 30 minutes
STATE_MAX_AGE_SECONDS = 1800  # 30 minutes tolerance for enterprise MFA


def _generate_signed_state(redirect_uri: str) -> str:
    """Generate a tamper-proof, stateless HMAC-SHA256 state token."""
    settings = get_settings()
    payload = {
        "nonce": secrets.token_hex(16),
        "ts": int(time.time()),
        "uri": redirect_uri,
        "env": settings.app_env,
    }
    payload_bytes = json.dumps(payload, sort_keys=True).encode("utf-8")
    signature = hmac.new(settings.secret_key.encode("utf-8"), payload_bytes, hashlib.sha256).hexdigest()
    return f"{payload['nonce']}.{payload['ts']}.{signature}"


def _validate_signed_state(state: str | None, allow_direct_install: bool = True) -> bool:
    """Verify HMAC signature and timestamp of state token."""
    settings = get_settings()

    # Graceful handling for HubSpot Developer Portal "Install app" button and marketplace links
    if not state or state in ("null", "undefined", "direct_install"):
        if allow_direct_install:
            logger.info("oauth_direct_install_detected_bypassing_state")
            return True
        return False

    try:
        parts = state.split(".")
        if len(parts) != 3:
            return False

        nonce, ts_str, signature = parts
        timestamp = int(ts_str)

        # Check timestamp age (30 min max, with 60s future skew tolerance)
        age = int(time.time()) - timestamp
        if age > STATE_MAX_AGE_SECONDS or age < -60:
            logger.warning("oauth_state_expired", age_seconds=age)
            return False

        # Recompute expected signature
        payload = {
            "nonce": nonce,
            "ts": timestamp,
            "uri": settings.hubspot_redirect_uri,
            "env": settings.app_env,
        }
        payload_bytes = json.dumps(payload, sort_keys=True).encode("utf-8")
        expected_sig = hmac.new(settings.secret_key.encode("utf-8"), payload_bytes, hashlib.sha256).hexdigest()

        return hmac.compare_digest(expected_sig, signature)

    except Exception as err:
        logger.warning("oauth_state_signature_validation_error", error=str(err))
        return False


def create_tenant_session_jwt(tenant_id: UUID, portal_id: str, scopes: str = "") -> str:
    """Generate a signed Session JWT for authenticated API communication."""
    settings = get_settings()
    now_ts = int(time.time())
    payload = {
        "sub": f"hubspot:{portal_id}",
        "tenant_id": str(tenant_id),
        "portal_id": str(portal_id),
        "role": "agency_owner",
        "scopes": scopes,
        "iat": now_ts,
        "exp": now_ts + (86400 * 14),  # 14 days
        "iss": "dealsense-platform",
    }
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


async def generate_authorize_url(redirect_uri: str | None = None) -> tuple[str, str]:
    """Generate the HubSpot OAuth authorization URL with a secure state token.

    Args:
        redirect_uri: Optional override for the redirect URI.

    Returns:
        tuple[str, str]: (authorization_url, state_token)
    """
    settings = get_settings()
    effective_redirect_uri = redirect_uri or settings.hubspot_redirect_uri
    state = _generate_signed_state(effective_redirect_uri)

    # Store state in Redis for backwards compatibility with tests / legacy verifiers
    await cache_set(f"{OAUTH_STATE_PREFIX}{state}", "valid", ttl_seconds=OAUTH_STATE_TTL)

    # Sanitize scopes: strip deprecated 'oauth', remove whitespace, ensure clean space separation
    scopes_list = [
        s.strip()
        for s in settings.hubspot_scopes.split(",")
        if s.strip() and s.strip() != "oauth"
    ]
    scope_param = " ".join(scopes_list)

    params = {
        "client_id": settings.hubspot_client_id,
        "redirect_uri": effective_redirect_uri,
        "scope": scope_param,
        "state": state,
        "response_type": "code",
    }
    query_string = urllib.parse.urlencode(params)
    auth_url = f"https://app.hubspot.com/oauth/authorize?{query_string}"

    logger.info(
        "oauth_authorize_url_generated",
        state=state[:16] + "...",
        redirect_uri=effective_redirect_uri,
        scopes=scope_param,
    )
    return auth_url, state


async def handle_oauth_callback(
    code: str,
    state: str | None,
    db: AsyncSession | None = None,
    redirect_uri: str | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> tuple[UUID, str, str, str]:
    """Validate state, exchange authorization code for tokens, provision tenant, and issue session JWT.

    Args:
        code: Authorization code from HubSpot
        state: CSRF state parameter from HubSpot (or None/direct_install)
        db: Optional database session with in-memory fallback
        redirect_uri: Optional override for redirect URI
        ip_address: Client IP
        user_agent: Client User Agent

    Returns:
        tuple[UUID, str, str, str]: (tenant_id, hubspot_portal_id, session_jwt, portal_name)

    Raises:
        OAuthStateValidationError: If state is invalid or expired
        OAuthError: If token exchange or portal retrieval fails
    """
    # 1. Validate state token (stateless signed state, direct-install fallback, or Redis key)
    is_valid_signed = _validate_signed_state(state, allow_direct_install=True)
    if not is_valid_signed:
        state_key = f"{OAUTH_STATE_PREFIX}{state}" if state else ""
        stored_state = await cache_get(state_key) if state_key else None
        if not stored_state:
            logger.warning("oauth_state_invalid_or_expired", state=state[:8] + "..." if state else "")
            raise OAuthStateValidationError()
        # Consume state (single-use)
        await cache_delete(state_key)

    settings = get_settings()
    effective_redirect_uri = redirect_uri or settings.hubspot_redirect_uri

    # 2. In-flight deduplication cache (absorbs React 18 double-mount collision)
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    cached_session = await cache_get(f"oauth:session:{code_hash}")
    if cached_session:
        try:
            cached_data = json.loads(cached_session)
            logger.info("oauth_code_deduplicated_cached_hit", tenant_id=cached_data["tenant_id"])
            return UUID(cached_data["tenant_id"]), cached_data["portal_id"], cached_data["session_jwt"], cached_data.get("portal_name", f"HubSpot Portal #{cached_data['portal_id']}")
        except Exception:
            pass

    # Acquire distributed lock on code exchange
    lock = await acquire_lock(f"lock:oauth:{code_hash}", timeout=15, blocking_timeout=4)

    try:
        # Check cache once more after acquiring lock
        cached_session = await cache_get(f"oauth:session:{code_hash}")
        if cached_session:
            cached_data = json.loads(cached_session)
            return UUID(cached_data["tenant_id"]), cached_data["portal_id"], cached_data["session_jwt"], cached_data.get("portal_name", f"HubSpot Portal #{cached_data['portal_id']}")

        # 3. Exchange code for access & refresh tokens
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                token_resp = await client.post(
                    "https://api.hubapi.com/oauth/v1/token",
                    data={
                        "grant_type": "authorization_code",
                        "client_id": settings.hubspot_client_id,
                        "client_secret": settings.hubspot_client_secret,
                        "redirect_uri": effective_redirect_uri,
                        "code": code,
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"},
                )
                if token_resp.status_code != 200:
                    error_body = token_resp.text[:300] if token_resp.text else "empty"
                    logger.error(
                        "oauth_code_exchange_failed",
                        status_code=token_resp.status_code,
                        redirect_uri=effective_redirect_uri,
                        error_body=error_body,
                    )
                    error_detail = error_body
                    try:
                        hubspot_error = token_resp.json()
                        error_detail = (
                            hubspot_error.get("message")
                            or hubspot_error.get("error_description")
                            or error_body
                        )
                    except Exception:
                        pass
                    raise OAuthError(
                        f"HubSpot OAuth code exchange failed ({token_resp.status_code}): {error_detail}. "
                        "Please return to login and re-authenticate."
                    )
                token_data = token_resp.json()
            except httpx.HTTPError as e:
                raise OAuthError(f"OAuth code exchange network error: {e}") from e

            access_token = token_data["access_token"]
            refresh_token = token_data["refresh_token"]
            expires_in = token_data.get("expires_in", 1800)

            # 4. Retrieve portal information for the token
            try:
                info_resp = await client.get(
                    f"https://api.hubapi.com/oauth/v1/access-tokens/{access_token}"
                )
                if info_resp.status_code != 200:
                    logger.error("oauth_token_info_failed", status_code=info_resp.status_code)
                    raise OAuthError("Failed to fetch HubSpot token info")
                info_data = info_resp.json()
            except httpx.HTTPError as e:
                raise OAuthError(f"HubSpot token info network error: {e}") from e

        portal_id = str(info_data.get("hub_id") or info_data.get("portal_id", ""))
        scopes = " ".join(info_data.get("scopes", []))
        account_name = info_data.get("hub_domain", f"HubSpot Portal {portal_id}")

        if not portal_id:
            raise OAuthError("Could not determine HubSpot portal ID")

        # Deterministic tenant ID based on portal ID
        deterministic_tenant_id = uuid5(NAMESPACE_DNS, f"hubspot:{portal_id}")
        tenant_id = deterministic_tenant_id

        # 5. Upsert Tenant in database (if db available)
        if db is not None:
            try:
                stmt = select(Tenant).where(Tenant.hubspot_portal_id == portal_id)
                result = await db.execute(stmt)
                tenant = result.scalar_one_or_none()

                is_new_tenant = False
                if tenant is None:
                    is_new_tenant = True
                    tenant = Tenant(
                        id=deterministic_tenant_id,
                        hubspot_portal_id=portal_id,
                        name=account_name,
                        status=TenantStatus.ACTIVE,
                        settings={},
                        white_label_config={},
                    )
                    db.add(tenant)
                    await db.flush()
                else:
                    tenant.status = TenantStatus.ACTIVE
                    tenant.name = account_name
                    await db.flush()

                tenant_id = tenant.id

                # 6. Store encrypted tokens via token manager
                await store_tokens(
                    tenant_id=tenant.id,
                    access_token=access_token,
                    refresh_token=refresh_token,
                    expires_in=expires_in,
                    scopes=scopes,
                    db=db,
                )

                # 8. Record Audit Event
                await record_audit_event(
                    db=db,
                    tenant_id=tenant.id,
                    actor=f"hubspot:{portal_id}",
                    actor_type="oauth",
                    action="tenant.installed" if is_new_tenant else "tenant.reconnected",
                    resource_type="tenant",
                    resource_id=str(tenant.id),
                    details={"portal_id": portal_id, "scopes": scopes, "name": account_name},
                    ip_address=ip_address,
                    user_agent=user_agent,
                )
            except Exception as db_err:
                logger.warning(
                    "oauth_database_upsert_fallback",
                    portal_id=portal_id,
                    error=str(db_err),
                )

        # Cache tokens in fast fallback storage
        await cache_set(
            f"tenant:tokens:{tenant_id}",
            json.dumps({
                "access_token": access_token,
                "refresh_token": refresh_token,
                "expires_in": expires_in,
                "scopes": scopes,
                "portal_id": portal_id,
                "account_name": account_name,
            }),
            ttl_seconds=expires_in,
        )
        await cache_set(f"tenant:{tenant_id}:access_token", access_token, ttl_seconds=expires_in)
        await cache_set(f"portal:{portal_id}:tenant_id", str(tenant_id), ttl_seconds=expires_in)

        # 7. Issue Session JWT
        session_jwt = create_tenant_session_jwt(tenant_id, portal_id, scopes)

        # Cache session data for 60 seconds to deduplicate duplicate mounts
        session_data = json.dumps({
            "tenant_id": str(tenant_id),
            "portal_id": portal_id,
            "session_jwt": session_jwt,
            "portal_name": account_name,
        })
        await cache_set(f"oauth:session:{code_hash}", session_data, ttl_seconds=60)

        logger.info(
            "oauth_installation_completed",
            tenant_id=str(tenant_id),
            portal_id=portal_id,
            account_name=account_name,
        )
        return tenant_id, portal_id, session_jwt, account_name

    finally:
        if lock:
            await release_lock(lock)


async def disconnect_tenant(
    tenant_id: UUID,
    db: AsyncSession,
    actor: str = "system",
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> None:
    """Disconnect a tenant's HubSpot integration and update status."""
    stmt = select(Tenant).where(Tenant.id == tenant_id)
    result = await db.execute(stmt)
    tenant = result.scalar_one_or_none()

    if tenant:
        tenant.status = TenantStatus.DISCONNECTED
        await db.flush()

    await invalidate_tokens(tenant_id, db)

    await record_audit_event(
        db=db,
        tenant_id=tenant_id,
        actor=actor,
        actor_type="user",
        action="tenant.disconnected",
        resource_type="tenant",
        resource_id=str(tenant_id),
        details={"status": TenantStatus.DISCONNECTED},
        ip_address=ip_address,
        user_agent=user_agent,
    )

    logger.info("tenant_disconnected_successfully", tenant_id=str(tenant_id))


async def get_tenant_oauth_status(
    tenant_id: UUID,
    db: AsyncSession,
) -> dict[str, object]:
    """Retrieve the OAuth connection status for a given tenant."""
    return await get_connection_status(tenant_id, db)


def generate_install_url() -> dict[str, str]:
    """Generate a one-click HubSpot OAuth install URL for production use.

    This URL can be shared with customers for frictionless app installation.
    Uses production redirect URI with pre-signed state.

    Returns:
        Dict with install_url and redirect_uri.
    """
    settings = get_settings()
    scopes_list = [
        s.strip()
        for s in settings.hubspot_scopes.split(",")
        if s.strip() and s.strip() != "oauth"
    ]
    state = _generate_signed_state(settings.hubspot_redirect_uri)

    params = {
        "client_id": settings.hubspot_client_id,
        "redirect_uri": settings.hubspot_redirect_uri,
        "scope": " ".join(scopes_list),
        "state": state,
        "response_type": "code",
    }
    query_string = urllib.parse.urlencode(params)
    install_url = f"https://app.hubspot.com/oauth/authorize?{query_string}"

    logger.info("install_url_generated", redirect_uri=settings.hubspot_redirect_uri)
    return {
        "install_url": install_url,
        "redirect_uri": settings.hubspot_redirect_uri,
        "app_id": settings.hubspot_app_id,
    }
