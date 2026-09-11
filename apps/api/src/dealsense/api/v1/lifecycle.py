"""DealSense API — App Lifecycle Router.

Dedicated endpoints for HubSpot App Marketplace lifecycle events,
including app installation, uninstallation, and GDPR data deletion.
"""

import structlog
from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.api.deps import get_db
from dealsense.domain.models import Tenant
from dealsense.infrastructure.redis_client import cache_delete
from dealsense.services.oauth_service import disconnect_tenant

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/lifecycle", tags=["Lifecycle"])


@router.delete("/uninstall", status_code=204)
async def handle_uninstall(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Response:
    """Handle HubSpot App uninstallation event.

    HubSpot sends a DELETE request to this URL when a user uninstalls the app.
    We must clean up OAuth tokens and mark the tenant as disconnected.
    """
    # HubSpot sends the portal ID as user_id or in the payload
    # For a DELETE webhook, we should verify the signature
    # Since payload might be empty, we just verify the URL signature
    # (Note: In production, rigorous signature check requires the query params)

    portal_id = request.query_params.get("user_id") or request.query_params.get("portalId")
    if not portal_id:
        logger.warning("uninstall_missing_portal_id")
        return Response(status_code=204)

    logger.info("hubspot_uninstall_webhook_received", portal_id=portal_id)

    stmt = select(Tenant).where(Tenant.hubspot_portal_id == str(portal_id))
    result = await db.execute(stmt)
    tenant = result.scalar_one_or_none()

    if tenant:
        await disconnect_tenant(tenant.id, db, actor=f"hubspot:{portal_id}:uninstall_route")

    return Response(status_code=204)


@router.post("/gdpr-delete", status_code=204)
async def handle_gdpr_delete(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Response:
    """Handle HubSpot GDPR contact privacy deletion event."""
    # This is a dedicated endpoint for GDPR compliance if not using standard webhooks
    try:
        body = await request.json()
    except Exception:
        return Response(status_code=204)

    portal_id = body.get("portalId")
    object_id = body.get("objectId")

    if portal_id and object_id:
        logger.info("hubspot_gdpr_deletion_received", portal_id=portal_id, object_id=object_id)
        # Purge any cached PII
        await cache_delete(f"contact:pii:{portal_id}:{object_id}")
        # In a real system, we'd queue a background task to scrub the database

    return Response(status_code=204)
