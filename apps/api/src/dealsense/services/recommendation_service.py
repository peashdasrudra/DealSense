"""DealSense API — Next-Best-Action Recommendation Engine.

Synthesizes deterministic risk signals, MEDDICC qualification gaps, and recent CRM context
to generate concrete, evidence-grounded action proposals categorized by action tiers.
"""

import json
from typing import Any
from uuid import UUID, uuid4

import structlog
from openai import AsyncOpenAI
from pydantic import BaseModel, Field

from dealsense.config import get_settings
from dealsense.domain.enums import ActionCategory, ActionTier
from dealsense.services.llm_service import MEDDICCExtractionResult
from prompts import (
    RECOMMENDATION_SYSTEM_PROMPT,
    RECOMMENDATION_USER_TEMPLATE,
)

logger = structlog.get_logger(__name__)


class RecommendedActionItem(BaseModel):
    """A single recommended next-best-action."""

    id: str = Field(default_factory=lambda: uuid4().hex[:8])
    category: str  # ActionCategory value
    tier: str = ActionTier.TIER_1_SUGGESTION
    title: str
    description: str
    rationale: str
    evidence_citations: list[str] = Field(default_factory=list)
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)
    suggested_payload: dict[str, Any] = Field(default_factory=dict)


class RecommendationBatchResult(BaseModel):
    """Batch of recommended actions for a deal."""

    deal_id: str
    actions: list[RecommendedActionItem] = Field(default_factory=list)


async def generate_recommended_actions(
    deal_id: str,
    deal_name: str,
    stage: str,
    amount: float | None,
    health_score: int,
    risk_band: str,
    top_signals: list[dict[str, Any]],
    meddicc: MEDDICCExtractionResult | None,
    recent_context: str = "",
) -> list[RecommendedActionItem]:
    """Generate prioritized next-best actions for a deal.

    Args:
        deal_id: Deal identifier
        deal_name: Name of the deal
        stage: Pipeline stage
        amount: Deal value
        health_score: Calculated deal health score (0-100)
        risk_band: Risk band classification
        top_signals: List of top evaluated signals
        meddicc: MEDDICC extraction result
        recent_context: Summary of recent notes/activities

    Returns:
        List of RecommendedActionItem objects
    """
    settings = get_settings()

    # If no LLM API key, return rule-based heuristic recommendations
    if not settings.openai_api_key:
        return _generate_heuristic_recommendations(top_signals, meddicc)

    signals_summary = "\n".join(
        [f"- [{s.get('severity', 'info').upper()}] {s.get('title', '')}: {s.get('description', '')}" for s in top_signals]
    )

    meddicc_summary = (
        f"- Economic Buyer: {meddicc.economic_buyer.status} ({meddicc.economic_buyer.summary})\n"
        f"- Champion: {meddicc.champion.status} ({meddicc.champion.summary})\n"
        f"- Decision Process: {meddicc.decision_process.status} ({meddicc.decision_process.summary})\n"
        f"- Metrics: {meddicc.metrics.status} ({meddicc.metrics.summary})"
        if meddicc
        else "MEDDICC not yet evaluated"
    )

    user_prompt = RECOMMENDATION_USER_TEMPLATE.format(
        deal_name=deal_name,
        stage=stage,
        amount=f"${amount:,.0f}" if amount else "Unset",
        health_score=health_score,
        risk_band=risk_band.upper(),
        signals_summary=signals_summary or "No active risk signals",
        meddicc_summary=meddicc_summary,
        recent_context=recent_context or "No recent activity recorded",
    )

    client = AsyncOpenAI(api_key=settings.openai_api_key)

    try:
        response = await client.chat.completions.create(
            model=settings.llm_model,
            messages=[
                {"role": "system", "content": RECOMMENDATION_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=settings.llm_temperature,
            max_tokens=settings.llm_max_tokens,
        )

        content = response.choices[0].message.content or "{}"
        parsed = json.loads(content)
        actions_raw = parsed.get("actions", [])
        return [RecommendedActionItem.model_validate(a) for a in actions_raw]

    except Exception as e:
        logger.error("recommendation_generation_failed", error=str(e))
        return _generate_heuristic_recommendations(top_signals, meddicc)


def _generate_heuristic_recommendations(
    top_signals: list[dict[str, Any]],
    meddicc: MEDDICCExtractionResult | None,
) -> list[RecommendedActionItem]:
    """Fallback rule-based recommendation generator."""
    actions: list[RecommendedActionItem] = []

    # Rule 1: Check for Stakeholder Gap
    has_stakeholder_signal = any(s.get("signal_type") == "stakeholder_gap" for s in top_signals)
    if has_stakeholder_signal or (meddicc and meddicc.economic_buyer.status == "unidentified"):
        actions.append(
            RecommendedActionItem(
                category=ActionCategory.REQUEST_INTRODUCTION,
                tier=ActionTier.TIER_1_SUGGESTION,
                title="Identify & Map Economic Buyer",
                description="Ask your main contact to map out the financial decision-maker and budget approval criteria.",
                rationale="The deal is currently single-threaded without confirmed Economic Buyer access.",
                confidence=0.9,
            )
        )

    # Rule 2: Check for Engagement Decay
    has_decay_signal = any(s.get("signal_type") == "engagement_decay" for s in top_signals)
    if has_decay_signal:
        actions.append(
            RecommendedActionItem(
                category=ActionCategory.CREATE_FOLLOWUP_TASK,
                tier=ActionTier.TIER_3_CONTROLLED_WRITE,
                title="Schedule Re-engagement Outreach",
                description="Create a high-priority task to share a relevant customer case study and request a 15-minute sync.",
                rationale="Over 14 days have passed without recorded touchpoint activity.",
                confidence=0.85,
                suggested_payload={"task_subject": "Re-engage prospect with case study", "due_days": 2},
            )
        )

    # Rule 3: Check for Next Step Gap
    has_commitment_signal = any(s.get("signal_type") == "commitment_quality" for s in top_signals)
    if has_commitment_signal:
        actions.append(
            RecommendedActionItem(
                category=ActionCategory.CONFIRM_DECISION_PROCESS,
                tier=ActionTier.TIER_1_SUGGESTION,
                title="Confirm Mutual Next Step & Timeline",
                description="Align with champion on key evaluation milestones and target go-live date.",
                rationale="No forward-looking meeting or next milestone is currently scheduled on calendar.",
                confidence=0.9,
            )
        )

    return actions
