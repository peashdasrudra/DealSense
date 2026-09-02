"""DealSense Scoring Engine — Signal and Result Models.

Pydantic schemas for scoring input data, individual risk signals,
and aggregated deal health assessment.
"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ScoringDealInput(BaseModel):
    """Input payload for scoring a deal."""

    deal_id: str
    name: str = ""
    stage: str
    pipeline: str = "default"
    amount: float | None = None
    close_date: datetime | None = None
    created_at: datetime | None = None
    owner_id: str | None = None
    properties: dict[str, Any] = Field(default_factory=dict)

    # Activity & history metrics
    days_in_current_stage: float = 0.0
    stage_benchmark_days: float = 14.0
    days_since_last_activity: float = 0.0
    close_date_push_count: int = 0
    past_due_tasks_count: int = 0
    open_tasks_count: int = 0
    has_scheduled_next_step: bool = False
    next_step_text: str | None = None

    # Stakeholder metrics
    identified_roles: list[str] = Field(default_factory=list)  # e.g. ["champion", "economic_buyer"]
    total_contacts_count: int = 0


class EvaluatedSignal(BaseModel):
    """An individual evaluated risk signal."""

    signal_type: str
    severity: str  # "info", "warning", "high", "critical"
    score_penalty: float  # 0 to 100 penalty
    title: str
    description: str
    evidence: list[str] = Field(default_factory=list)
    metrics: dict[str, Any] = Field(default_factory=dict)


class ScoringResult(BaseModel):
    """Aggregated deal health score and risk classification."""

    deal_id: str
    health_score: int = Field(..., ge=0, le=100)
    risk_band: str  # "healthy", "moderate", "elevated", "high", "critical"
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    signals: list[EvaluatedSignal] = Field(default_factory=list)
    top_signals: list[EvaluatedSignal] = Field(default_factory=list)
    risk_summary: str = ""
    scoring_version: str = "v1.0.0"
