"""DealSense API — OAuth Endpoints.

Handles HubSpot OAuth 2.0 flow:
- GET /api/v1/oauth/authorize: Generates authorization URL with CSRF state
- GET /api/v1/oauth/callback: Handles OAuth redirect from HubSpot
- POST /api/v1/oauth/callback: JSON payload handler for OAuth callback
- GET /api/v1/oauth/status: Checks OAuth connection status for a tenant
- POST /api/v1/oauth/refresh: Manually trigger token refresh
- POST /api/v1/oauth/disconnect: Disconnects integration and revokes active status
"""

from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.api.deps import get_db
from dealsense.api.schemas.oauth import (
    OAuthAuthorizeResponse,
    OAuthCallbackRequest,
    OAuthCallbackResponse,
    OAuthConnectionStatusResponse,
    OAuthDisconnectResponse,
)
from dealsense.security.rbac import Permission, require_permission
from dealsense.security.token_manager import get_access_token
from dealsense.services.oauth_service import (
    disconnect_tenant,
    generate_authorize_url,
    get_tenant_oauth_status,
    handle_oauth_callback,
)

router = APIRouter(prefix="/oauth", tags=["OAuth"])


@router.get("/authorize", response_model=OAuthAuthorizeResponse)
async def authorize(
    redirect_uri: str | None = Query(None, description="Optional redirect URI override"),
) -> OAuthAuthorizeResponse:
    """Generate HubSpot OAuth authorization URL and CSRF state token."""
    auth_url, state = await generate_authorize_url(redirect_uri=redirect_uri)
    return OAuthAuthorizeResponse(authorization_url=auth_url, state=state)


@router.get("/callback", response_model=OAuthCallbackResponse)
async def oauth_callback_get(
    request: Request,
    code: str = Query(..., description="Authorization code from HubSpot"),
    state: str = Query(..., description="CSRF state parameter"),
    db: AsyncSession = Depends(get_db),
) -> OAuthCallbackResponse:
    """Handle OAuth redirect callback from HubSpot."""
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    tenant_id, portal_id = await handle_oauth_callback(
        code=code,
        state=state,
        db=db,
        ip_address=client_ip,
        user_agent=user_agent,
    )
    return OAuthCallbackResponse(
        tenant_id=tenant_id,
        hubspot_portal_id=portal_id,
        message="HubSpot integration successfully connected",
    )


@router.post("/callback", response_model=OAuthCallbackResponse)
async def oauth_callback_post(
    request: Request,
    payload: OAuthCallbackRequest,
    db: AsyncSession = Depends(get_db),
) -> OAuthCallbackResponse:
    """Handle OAuth callback via POST JSON request."""
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    tenant_id, portal_id = await handle_oauth_callback(
        code=payload.code,
        state=payload.state,
        db=db,
        ip_address=client_ip,
        user_agent=user_agent,
    )
    return OAuthCallbackResponse(
        tenant_id=tenant_id,
        hubspot_portal_id=portal_id,
        message="HubSpot integration successfully connected",
    )


@router.get("/status", response_model=OAuthConnectionStatusResponse)
async def connection_status(
    tenant_id: UUID = require_permission(Permission.OAUTH_MANAGE),
    db: AsyncSession = Depends(get_db),
) -> OAuthConnectionStatusResponse:
    """Get HubSpot connection and token health status for the tenant."""
    status_info = await get_tenant_oauth_status(tenant_id=tenant_id, db=db)
    return OAuthConnectionStatusResponse(
        connected=bool(status_info.get("connected", False)),
        is_active=bool(status_info.get("is_active", False)),
        scopes=str(status_info.get("scopes", "")),
        token_expires_at=str(status_info.get("token_expires_at")) if status_info.get("token_expires_at") else None,
        token_expired=bool(status_info.get("token_expired", False)),
        last_refresh_at=str(status_info.get("last_refresh_at")) if status_info.get("last_refresh_at") else None,
        refresh_failure_count=int(status_info.get("refresh_failure_count", 0)),
    )


@router.post("/refresh")
async def force_refresh_token(
    tenant_id: UUID = require_permission(Permission.OAUTH_MANAGE),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    """Manually force or verify access token retrieval / refresh."""
    # Calling get_access_token checks cache/db and triggers refresh if expired
    await get_access_token(tenant_id=tenant_id, db=db)
    return {"status": "refreshed", "message": "Token is valid and active"}


@router.post("/disconnect", response_model=OAuthDisconnectResponse)
async def disconnect(
    request: Request,
    tenant_id: UUID = require_permission(Permission.OAUTH_DISCONNECT),
    db: AsyncSession = Depends(get_db),
) -> OAuthDisconnectResponse:
    """Disconnect the HubSpot OAuth integration and invalidate tokens."""
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    await disconnect_tenant(
        tenant_id=tenant_id,
        db=db,
        actor=f"user:{tenant_id}",
        ip_address=client_ip,
        user_agent=user_agent,
    )
    return OAuthDisconnectResponse(
        tenant_id=tenant_id,
        message="HubSpot integration disconnected",
    )
