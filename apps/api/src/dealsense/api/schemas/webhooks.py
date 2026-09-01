"""DealSense API — HubSpot Webhook Schemas.

Pydantic schemas for HubSpot webhook event payloads and responses.
"""

from typing import Any
from pydantic import BaseModel, Field


class HubSpotWebhookEvent(BaseModel):
    """Single webhook event from HubSpot."""

    eventId: int | str = Field(..., description="Unique event identifier from HubSpot")
    subscriptionId: int | str | None = None
    portalId: int | str = Field(..., description="HubSpot Portal ID")
    occurredAt: int = Field(..., description="Timestamp in milliseconds")
    subscriptionType: str = Field(..., description="e.g. deal.propertyChange, deal.creation")
    attemptNumber: int = Field(default=0)
    objectId: int | str = Field(..., description="Object ID (dealId, contactId, etc.)")
    propertyName: str | None = None
    propertyValue: Any | None = None
    changeSource: str | None = None
    sourceId: str | None = None


class WebhookIngestResponse(BaseModel):
    """Response returned immediately to HubSpot upon webhook ingest."""

    status: str = "received"
    events_received: int
    events_queued: int
    events_skipped_duplicate: int
