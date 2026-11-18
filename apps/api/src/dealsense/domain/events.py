"""DealSense API — Domain Events.

Pydantic schemas for internal domain events used in event-driven processing.
These are distinct from webhook events — they represent domain-level state changes.
"""

from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class DomainEvent(BaseModel):
    """Base class for all domain events."""

    event_id: UUID = Field(default_factory=uuid4)
    event_type: str
    tenant_id: UUID
    occurred_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict[str, Any] = Field(default_factory=dict)


# ---- Tenant Events ----


class TenantInstalledEvent(DomainEvent):
    """Emitted when a new tenant installs DealSense."""

    event_type: str = "tenant.installed"
    portal_id: str
    scopes: list[str]


class TenantDisconnectedEvent(DomainEvent):
    """Emitted when a tenant disconnects / uninstalls."""

    event_type: str = "tenant.disconnected"
    reason: str = ""


# ---- Deal Events ----


class DealUpdatedEvent(DomainEvent):
    """Emitted when a deal's properties are updated from CRM data."""

    event_type: str = "deal.updated"
    deal_id: UUID
    hubspot_deal_id: str
    changed_properties: list[str]


class DealStageChangedEvent(DomainEvent):
    """Emitted when a deal moves to a new pipeline stage."""

    event_type: str = "deal.stage_changed"
    deal_id: UUID
    hubspot_deal_id: str
    from_stage: str
    to_stage: str


# ---- Activity Events ----


class ActivityRecordedEvent(DomainEvent):
    """Emitted when a new CRM activity is recorded (note, meeting, call, task)."""

    event_type: str = "activity.recorded"
    activity_id: UUID
    deal_id: UUID
    activity_type: str
    hubspot_object_id: str


# ---- Analysis Events ----


class AnalysisRequestedEvent(DomainEvent):
    """Emitted when a deal analysis is requested."""

    event_type: str = "analysis.requested"
    deal_id: UUID
    trigger: str  # "webhook", "manual", "scheduled"


class AnalysisCompletedEvent(DomainEvent):
    """Emitted when deal analysis completes successfully."""

    event_type: str = "analysis.completed"
    deal_id: UUID
    snapshot_id: UUID
    health_score: int
    risk_band: str
    duration_ms: int


class AnalysisFailedEvent(DomainEvent):
    """Emitted when deal analysis fails."""

    event_type: str = "analysis.failed"
    deal_id: UUID
    error_code: str
    error_message: str
    retry_count: int


# ---- Action Events ----


class ActionProposedEvent(DomainEvent):
    """Emitted when a new action is proposed by the system."""

    event_type: str = "action.proposed"
    action_id: UUID
    deal_id: UUID
    action_category: str
    action_tier: str


class ActionApprovedEvent(DomainEvent):
    """Emitted when an action is approved by a user."""

    event_type: str = "action.approved"
    action_id: UUID
    approved_by: str


class ActionExecutedEvent(DomainEvent):
    """Emitted when an approved action is executed against HubSpot."""

    event_type: str = "action.executed"
    action_id: UUID
    execution_id: UUID
    hubspot_result: dict[str, Any] = Field(default_factory=dict)


class ActionFailedEvent(DomainEvent):
    """Emitted when action execution fails."""

    event_type: str = "action.failed"
    action_id: UUID
    error_code: str
    error_message: str
