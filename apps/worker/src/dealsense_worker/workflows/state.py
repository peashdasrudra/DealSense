"""DealSense Worker — Analysis Workflow State Schema.

Defines the typed state dictionary passed between nodes in the LangGraph
deal intelligence analysis pipeline.
"""

from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field

from dealsense.services.llm_service import MEDDICCExtractionResult
from dealsense.services.recommendation_service import RecommendedActionItem
from dealsense.services.retrieval_service import RetrievedEvidence
from scoring import ScoringResult


class DealAnalysisState(BaseModel):
    """Execution state for the deal analysis LangGraph workflow."""

    tenant_id: UUID
    deal_id: UUID
    trace_id: str = ""

    # Node 1: Hydrated CRM Data
    deal_name: str = ""
    stage: str = ""
    pipeline: str = "default"
    amount: float | None = None
    owner_id: str | None = None
    owner_name: str | None = None
    properties: dict[str, Any] = Field(default_factory=dict)
    activities: list[dict[str, Any]] = Field(default_factory=list)
    participants: list[dict[str, Any]] = Field(default_factory=list)
    stage_history: list[dict[str, Any]] = Field(default_factory=list)

    # Node 2: Deterministic Scoring
    scoring_result: ScoringResult | None = None

    # Node 3: Hybrid Retrieval
    retrieved_evidence: list[RetrievedEvidence] = Field(default_factory=list)

    # Node 4: MEDDICC Extraction
    meddicc_result: MEDDICCExtractionResult | None = None

    # Node 5: Next-Best-Action Recommendations
    recommendations: list[RecommendedActionItem] = Field(default_factory=list)

    # Node 6: Narrative Explanation
    risk_explanation: str = ""
    what_changed: str = ""

    # Node 7: Persistence
    snapshot_id: UUID | None = None

    # Workflow metadata & error handling
    current_node: str = "init"
    completed_nodes: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)
    execution_duration_ms: int = 0
