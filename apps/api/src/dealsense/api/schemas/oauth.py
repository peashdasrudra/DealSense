"""DealSense API — OAuth Schemas."""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field


class OAuthAuthorizeResponse(BaseModel):
    """Response containing the HubSpot OAuth authorization URL and state."""

    authorization_url: str
    state: str


class OAuthCallbackRequest(BaseModel):
    """Request payload / query parameters for HubSpot OAuth callback."""

    code: str
    state: str


class OAuthCallbackResponse(BaseModel):
    """Response returned upon successful OAuth callback handling."""

    status: str = "connected"
    tenant_id: UUID
    hubspot_portal_id: str
    message: str = "HubSpot integration successfully connected"


class OAuthConnectionStatusResponse(BaseModel):
    """Response describing the current OAuth connection status."""

    connected: bool
    is_active: bool
    scopes: str
    token_expires_at: str | None = None
    token_expired: bool = False
    last_refresh_at: str | None = None
    refresh_failure_count: int = 0


class OAuthDisconnectResponse(BaseModel):
    """Response for OAuth disconnect."""

    status: str = "disconnected"
    tenant_id: UUID
    message: str = "HubSpot integration disconnected"
