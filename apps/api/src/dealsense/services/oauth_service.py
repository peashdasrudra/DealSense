"""DealSense API — OAuth Service.

Handles HubSpot OAuth 2.0 authorization code flow, CSRF state management,
token exchange, tenant provisioning, and disconnect workflows.
"""

import secrets
import urllib.parse
from uuid import UUID, uuid4

import httpx
import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.config import get_settings
from dealsense.domain.enums import TenantStatus
from dealsense.domain.exceptions import OAuthError, OAuthStateValidationError
from dealsense.domain.models import Tenant
from dealsense.infrastructure.redis_client import cache_delete, cache_get, cache_set
from dealsense.security.token_manager import get_connection_status, invalidate_tokens, store_tokens
from dealsense.services.audit_service import record_audit_event

logger = structlog.get_logger(__name__)

OAUTH_STATE_PREFIX = "oauth:state:"
OAUTH_STATE_TTL = 600  # 10 minutes


async def generate_authorize_url(redirect_uri: str | None = None) -> tuple[str, str]:
    """Generate the HubSpot OAuth authorization URL with a secure state token.

    Args:
        redirect_uri: Optional override for the redirect URI.

    Returns:
        tuple[str, str]: (authorization_url, state_token)
    """
    settings = get_settings()
    state = secrets.token_urlsafe(32)

    # Store state in Redis for CSRF validation
    await cache_set(f"{OAUTH_STATE_PREFIX}{state}", "valid", ttl_seconds=OAUTH_STATE_TTL)

    effective_redirect_uri = redirect_uri or settings.hubspot_redirect_uri
    scopes_list = [s.strip() for s in settings.hubspot_scopes.split(",") if s.strip()]
    scope_param = " ".join(scopes_list)

    params = {
        "client_id": settings.hubspot_client_id,
        "redirect_uri": effective_redirect_uri,
        "scope": scope_param,
        "state": state,
    }
    query_string = urllib.parse.urlencode(params)
    auth_url = f"https://app.hubspot.com/oauth/authorize?{query_string}"

    logger.info("oauth_authorize_url_generated", state=state[:8] + "...")
    return auth_url, state


async def handle_oauth_callback(
    code: str,
    state: str,
    db: AsyncSession,
    redirect_uri: str | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> tuple[UUID, str]:
    """Validate state, exchange authorization code for tokens, and provision/update tenant.

    Args:
        code: Authorization code from HubSpot
        state: CSRF state parameter from HubSpot
        db: Database session
        redirect_uri: Optional override for redirect URI
        ip_address: Client IP
        user_agent: Client User Agent

    Returns:
        tuple[UUID, str]: (tenant_id, hubspot_portal_id)

    Raises:
        OAuthStateValidationError: If state is invalid or expired
        OAuthError: If token exchange or portal retrieval fails
    """
    # 1. Validate state token
    state_key = f"{OAUTH_STATE_PREFIX}{state}"
    stored_state = await cache_get(state_key)
    if not stored_state:
        logger.warning("oauth_state_invalid_or_expired", state=state[:8] + "..." if state else "")
        raise OAuthStateValidationError()

    # Consume state (single-use)
    await cache_delete(state_key)

    settings = get_settings()
    effective_redirect_uri = redirect_uri or settings.hubspot_redirect_uri

    # 2. Exchange code for access & refresh tokens
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
                logger.error("oauth_code_exchange_failed", status_code=token_resp.status_code)
                raise OAuthError(f"OAuth code exchange failed: HTTP {token_resp.status_code}")
            token_data = token_resp.json()
        except httpx.HTTPError as e:
            raise OAuthError(f"OAuth code exchange network error: {e}") from e

        access_token = token_data["access_token"]
        refresh_token = token_data["refresh_token"]
        expires_in = token_data.get("expires_in", 1800)

        # 3. Retrieve portal information for the token
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

    # 4. Upsert Tenant in database
    stmt = select(Tenant).where(Tenant.hubspot_portal_id == portal_id)
    result = await db.execute(stmt)
    tenant = result.scalar_one_or_none()

    is_new_tenant = False
    if tenant is None:
        is_new_tenant = True
        tenant = Tenant(
            id=uuid4(),
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

    # 5. Store encrypted tokens via token manager
    await store_tokens(
        tenant_id=tenant.id,
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
        scopes=scopes,
        db=db,
    )

    # 6. Record Audit Event
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

    logger.info(
        "oauth_installation_completed",
        tenant_id=str(tenant.id),
        portal_id=portal_id,
        is_new=is_new_tenant,
    )
    return tenant.id, portal_id


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
