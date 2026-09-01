"""DealSense API — Audit Logging Service.

Records immutable audit events for security, compliance, and activity tracking.
"""

from typing import Any
from uuid import UUID

import structlog
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.domain.models import AuditEvent

logger = structlog.get_logger(__name__)


async def record_audit_event(
    db: AsyncSession,
    tenant_id: UUID,
    actor: str,
    action: str,
    resource_type: str,
    resource_id: str = "",
    actor_type: str = "system",
    details: dict[str, Any] | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
    trace_id: str = "",
) -> AuditEvent:
    """Record an immutable audit event in the database.

    Args:
        db: AsyncSession
        tenant_id: Tenant UUID
        actor: Identifier for the entity performing the action
        action: Short action identifier (e.g., 'oauth.install', 'token.refresh')
        resource_type: Type of resource affected (e.g., 'tenant', 'deal', 'action')
        resource_id: Identifier of the resource
        actor_type: Type of actor ('system', 'user', 'webhook')
        details: Metadata dictionary
        ip_address: Optional client IP
        user_agent: Optional client user agent
        trace_id: OpenTelemetry trace ID or correlation ID

    Returns:
        The created AuditEvent model instance
    """
    event = AuditEvent(
        tenant_id=tenant_id,
        actor=actor,
        actor_type=actor_type,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        details=details or {},
        ip_address=ip_address,
        user_agent=user_agent,
        trace_id=trace_id,
    )
    db.add(event)
    await db.flush()

    logger.info(
        "audit_event_recorded",
        tenant_id=str(tenant_id),
        actor=actor,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
    )
    return event
