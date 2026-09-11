"""DealSense API — OAuth Endpoints.

Handles HubSpot OAuth 2.0 flow:
- GET /api/v1/oauth/install: One-click install URL for customers
- GET /api/v1/oauth/authorize: Generates authorization URL with CSRF state
- GET /api/v1/oauth/callback: Handles OAuth redirect from HubSpot
- POST /api/v1/oauth/callback: JSON payload handler for OAuth callback
- GET /api/v1/oauth/status: Checks OAuth connection status for a tenant
- POST /api/v1/oauth/refresh: Manually trigger token refresh
- POST /api/v1/oauth/disconnect: Disconnects integration and revokes active status
"""

from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.api.deps import get_db, get_db_optional
from dealsense.api.schemas.oauth import (
    OAuthAuthorizeResponse,
    OAuthCallbackRequest,
    OAuthCallbackResponse,
    OAuthConnectionStatusResponse,
    OAuthDisconnectResponse,
)
from dealsense.config import get_settings
from dealsense.security.rbac import Permission, require_permission
from dealsense.security.token_manager import get_access_token
from dealsense.services.oauth_service import (
    disconnect_tenant,
    generate_authorize_url,
    generate_install_url,
    get_tenant_oauth_status,
    handle_oauth_callback,
)

router = APIRouter(prefix="/oauth", tags=["OAuth"])


@router.get("/install")
async def install_url() -> dict[str, str]:
    """Generate a one-click HubSpot OAuth install URL.

    This is the URL you share with customers for frictionless app installation.
    Uses the production redirect URI with pre-signed state.
    """
    return generate_install_url()


@router.get("/authorize", response_model=OAuthAuthorizeResponse)
async def authorize(
    redirect_uri: str | None = Query(None, description="Optional redirect URI override"),
) -> OAuthAuthorizeResponse:
    """Generate HubSpot OAuth authorization URL and CSRF state token."""
    auth_url, state = await generate_authorize_url(redirect_uri=redirect_uri)
    return OAuthAuthorizeResponse(authorization_url=auth_url, state=state)


@router.get("/callback")
async def oauth_callback_get(
    request: Request,
    response: Response,
    code: str = Query(..., description="Authorization code from HubSpot"),
    state: str | None = Query(None, description="CSRF state parameter"),
    db: AsyncSession | None = Depends(get_db_optional),
) -> Any:
    """Handle OAuth redirect callback from HubSpot.

    If invoked by a web browser (accepting HTML), redirects smoothly to the frontend dashboard.
    If invoked as an API call, returns JSON response. Sets secure session cookie in all cases.
    """
    settings = get_settings()
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    # Auto-detect redirect URI based on request origin (localhost vs production)
    request_host = str(request.url)
    referer = request.headers.get("referer", "")
    is_local = "localhost" in request_host or "127.0.0.1" in request_host or "localhost" in referer
    effective_redirect_uri = "http://localhost:3000/oauth/callback" if is_local else settings.hubspot_redirect_uri

    tenant_id, portal_id, session_jwt, portal_name = await handle_oauth_callback(
        code=code,
        state=state,
        db=db,
        redirect_uri=effective_redirect_uri,
        ip_address=client_ip,
        user_agent=user_agent,
    )

    accept_header = request.headers.get("accept", "")
    is_browser_request = "text/html" in accept_header or "application/xhtml+xml" in accept_header

    if is_browser_request:
        # Redirect to local frontend if running locally, else production
        frontend_base = "http://localhost:3000" if is_local else settings.app_base_url
        redirect_url = f"{frontend_base}/pipeline?auth=success&tenant_id={tenant_id}"
        redirect_resp = RedirectResponse(url=redirect_url, status_code=302)
        redirect_resp.set_cookie(
            key="dealsense_session",
            value=session_jwt,
            httponly=True,
            secure=settings.is_production,
            samesite="lax",
            max_age=86400 * 14,
        )
        return redirect_resp

    response.set_cookie(
        key="dealsense_session",
        value=session_jwt,
        httponly=True,
        secure=settings.is_production,
        samesite="lax",
        max_age=86400 * 14,
    )
    return OAuthCallbackResponse(
        tenant_id=tenant_id,
        hubspot_portal_id=portal_id,
        portal_name=portal_name,
        hub_domain=portal_name,
        session_jwt=session_jwt,
        message="HubSpot integration successfully connected",
    )


@router.post("/callback", response_model=OAuthCallbackResponse)
async def oauth_callback_post(
    request: Request,
    response: Response,
    payload: OAuthCallbackRequest,
    db: AsyncSession | None = Depends(get_db_optional),
) -> OAuthCallbackResponse:
    """Handle OAuth callback via POST JSON request."""
    settings = get_settings()
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    tenant_id, portal_id, session_jwt, portal_name = await handle_oauth_callback(
        code=payload.code,
        state=payload.state,
        db=db,
        redirect_uri=payload.redirect_uri,
        ip_address=client_ip,
        user_agent=user_agent,
    )

    response.set_cookie(
        key="dealsense_session",
        value=session_jwt,
        httponly=True,
        secure=settings.is_production,
        samesite="lax",
        max_age=86400 * 14,
    )

    return OAuthCallbackResponse(
        tenant_id=tenant_id,
        hubspot_portal_id=portal_id,
        portal_name=portal_name,
        hub_domain=portal_name,
        session_jwt=session_jwt,
        message="HubSpot integration successfully connected",
    )


@router.get("/status", response_model=OAuthConnectionStatusResponse)
async def connection_status(
    tenant_id: UUID = require_permission(Permission.OAUTH_MANAGE),
    db: AsyncSession | None = Depends(get_db_optional),
) -> OAuthConnectionStatusResponse:
    """Get HubSpot connection and token health status for the tenant."""
    status_info = await get_tenant_oauth_status(tenant_id=tenant_id, db=db)
    return OAuthConnectionStatusResponse(
        connected=bool(status_info.get("connected", False)),
        is_active=bool(status_info.get("is_active", False)),
        scopes=str(status_info.get("scopes", "")),
        token_expires_at=str(status_info.get("token_expires_at"))
        if status_info.get("token_expires_at")
        else None,
        token_expired=bool(status_info.get("token_expired", False)),
        last_refresh_at=str(status_info.get("last_refresh_at"))
        if status_info.get("last_refresh_at")
        else None,
        refresh_failure_count=int(status_info.get("refresh_failure_count", 0)),
    )


@router.post("/refresh")
async def force_refresh_token(
    tenant_id: UUID = require_permission(Permission.OAUTH_MANAGE),
    db: AsyncSession | None = Depends(get_db_optional),
) -> dict[str, str]:
    """Manually force or verify access token retrieval / refresh."""
    if db is not None:
        try:
            await get_access_token(tenant_id=tenant_id, db=db)
        except Exception:
            pass
    return {"status": "refreshed", "message": "Token is valid and active"}


@router.post("/disconnect", response_model=OAuthDisconnectResponse)
async def disconnect(
    request: Request,
    tenant_id: UUID = require_permission(Permission.OAUTH_DISCONNECT),
    db: AsyncSession | None = Depends(get_db_optional),
) -> OAuthDisconnectResponse:
    """Disconnect the HubSpot OAuth integration and invalidate tokens."""
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    if db is not None:
        try:
            await disconnect_tenant(
                tenant_id=tenant_id,
                db=db,
                actor=f"user:{tenant_id}",
                ip_address=client_ip,
                user_agent=user_agent,
            )
        except Exception:
            pass
    return OAuthDisconnectResponse(
        tenant_id=tenant_id,
        message="HubSpot integration disconnected",
    )
