"""DealSense API — Deal and Snapshot Schemas."""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class DealSignalSchema(BaseModel):
    """Deal signal schema for API responses."""

    id: UUID
    signal_type: str
    severity: str
    impact_score: float
    details: dict[str, Any]
    evidence_ids: list[str] = Field(default_factory=list)
    created_at: datetime

    model_config = {"from_attributes": True}


class DealSnapshotSchema(BaseModel):
    """Deal snapshot response for UI Extension and API callers."""

    id: UUID
    deal_id: UUID
    health_score: int
    risk_band: str
    confidence: float
    previous_health_score: int | None = None
    score_delta: int | None = None
    top_signals: list[dict[str, Any]] = Field(default_factory=list)
    risk_explanation: str = ""
    what_changed: str | None = ""
    recommended_actions: list[dict[str, Any]] | None = Field(default_factory=list)
    is_current: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}


class DealDetailSchema(BaseModel):
    """Normalized deal detail."""

    id: UUID
    tenant_id: UUID
    hubspot_deal_id: str
    name: str
    pipeline: str
    stage: str
    amount: float | None = None
    currency: str = "USD"
    close_date: datetime | None = None
    owner_id: str | None = None
    is_closed: bool = False
    is_won: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class DealDashboardSchema(BaseModel):
    """Aggregated deal data for the dashboard."""

    id: UUID
    name: str
    client: str
    score: int
    value: float
    owner: str
    stage: str
    band: str

    model_config = {"from_attributes": True}
