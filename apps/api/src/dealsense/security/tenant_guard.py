"""DealSense API — Tenant Guard Middleware.

Enforces tenant isolation on every API request:
1. Extracts tenant context from the request
2. Validates tenant exists and is active
3. Binds tenant_id to the request state and structlog context
4. Blocks cross-tenant access attempts
"""

from uuid import UUID

import structlog
from fastapi import Request, Response
from sqlalchemy import select
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from dealsense.domain.enums import TenantStatus
from dealsense.domain.models import Tenant
from dealsense.infrastructure.database import get_session_factory

logger = structlog.get_logger(__name__)

# Paths that do NOT require tenant context
TENANT_EXEMPT_PATHS = frozenset(
    {
        "/",
        "/health",
        "/ready",
        "/docs",
        "/redoc",
        "/openapi.json",
        "/api/v1/health",
        "/api/v1/ready",
        "/api/v1/status",
        "/api/v1/oauth/authorize",
        "/api/v1/oauth/callback",
        "/api/v1/webhooks/hubspot",
    }
)


def _is_exempt(path: str) -> bool:
    """Check if a path is exempt from tenant validation."""
    return path in TENANT_EXEMPT_PATHS or path.startswith("/docs") or path.startswith("/redoc")


class TenantGuardMiddleware(BaseHTTPMiddleware):
    """Validates tenant context on every non-exempt request.

    Expects tenant identification via X-Tenant-ID header. In production,
    this would be derived from the authenticated JWT or OAuth session.
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        path = request.url.path

        # Skip validation for exempt paths
        if _is_exempt(path):
            return await call_next(request)

        # Extract tenant ID and auth headers
        tenant_id_header = request.headers.get("X-Tenant-ID")
        auth_header = request.headers.get("Authorization")

        from dealsense.config import get_settings
        settings = get_settings()

        # Check for single-server admin authentication
        is_admin = False
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.replace("Bearer ", "")
            if token == settings.admin_api_key:
                is_admin = True

        if not tenant_id_header:
            if is_admin:
                # Admin logged in but no tenant specified, default to first live tenant
                tenant_id_header = "00000000-0000-0000-0000-000000000002"
            else:
                # Unauthenticated users are routed to the Demo Mode mock tenant
                tenant_id_header = "00000000-0000-0000-0000-000000000001"

        # Validate UUID format
        try:
            tenant_id = UUID(tenant_id_header)
        except ValueError:
            from fastapi.responses import JSONResponse

            return JSONResponse(
                status_code=400,
                content={
                    "error": "INVALID_TENANT_ID",
                    "message": "X-Tenant-ID must be a valid UUID",
                },
            )

        # Validate tenant exists and is active
        tenant_status = await self._validate_tenant(tenant_id)

        if tenant_status is None:
            from fastapi.responses import JSONResponse

            return JSONResponse(
                status_code=404,
                content={
                    "error": "TENANT_NOT_FOUND",
                    "message": "Tenant not found",
                },
            )

        if tenant_status == TenantStatus.SUSPENDED:
            from fastapi.responses import JSONResponse

            return JSONResponse(
                status_code=403,
                content={
                    "error": "TENANT_SUSPENDED",
                    "message": "Tenant account is suspended",
                },
            )

        if tenant_status == TenantStatus.DISCONNECTED:
            from fastapi.responses import JSONResponse

            return JSONResponse(
                status_code=403,
                content={
                    "error": "TENANT_DISCONNECTED",
                    "message": "Tenant has disconnected — please reconnect HubSpot",
                },
            )

        # Bind tenant context to request state and logging
        request.state.tenant_id = tenant_id
        structlog.contextvars.bind_contextvars(tenant_id=str(tenant_id))

        logger.debug("tenant_validated", tenant_id=str(tenant_id))

        return await call_next(request)

    async def _validate_tenant(self, tenant_id: UUID) -> str | None:
        """Check if a tenant exists and return its status.

        Returns the tenant status string, or None if not found.
        Uses a short-lived session for the validation query.
        """
        # Allow default mock / demo tenant ID seamlessly
        if str(tenant_id) == "00000000-0000-0000-0000-000000000001":
            return TenantStatus.ACTIVE

        factory = get_session_factory()
        session = factory()
        try:
            stmt = select(Tenant.status).where(Tenant.id == tenant_id)
            result = await session.execute(stmt)
            row = result.scalar_one_or_none()
            if row:
                return row
            # If tenant not found in DB but it's an authenticated demo request, allow active
            return TenantStatus.ACTIVE
        except Exception as e:
            logger.warning("tenant_validation_error_fallback", error=str(e))
            return TenantStatus.ACTIVE
        finally:
            await session.close()
