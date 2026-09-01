"""DealSense Scoring Engine — Main Evaluator.

Orchestrates evaluation of all 7 signals, computes normalized deal health score (0-100),
assigns risk bands, and generates top signals.
"""

from scoring.models import EvaluatedSignal, ScoringDealInput, ScoringResult
from scoring.signals import (
    evaluate_commitment_quality,
    evaluate_crm_hygiene,
    evaluate_date_slippage,
    evaluate_engagement_decay,
    evaluate_historical_similarity,
    evaluate_stage_aging,
    evaluate_stakeholder_gap,
)


def score_deal(deal: ScoringDealInput) -> ScoringResult:
    """Calculate deterministic Deal Health Score from CRM metrics.

    Args:
        deal: ScoringDealInput metrics

    Returns:
        ScoringResult with score, risk band, signals, and top signals
    """
    evaluators = [
        evaluate_stage_aging,
        evaluate_engagement_decay,
        evaluate_stakeholder_gap,
        evaluate_commitment_quality,
        evaluate_date_slippage,
        evaluate_crm_hygiene,
        evaluate_historical_similarity,
    ]

    active_signals: list[EvaluatedSignal] = []
    total_penalty = 0.0

    for evaluate in evaluators:
        signal = evaluate(deal)
        if signal is not None:
            active_signals.append(signal)
            total_penalty += signal.score_penalty

    # Base starting score is 100
    raw_score = 100.0 - total_penalty
    health_score = int(max(0, min(100, round(raw_score))))

    # Map score to risk band
    if health_score >= 81:
        risk_band = "healthy"
    elif health_score >= 61:
        risk_band = "moderate"
    elif health_score >= 41:
        risk_band = "elevated"
    elif health_score >= 21:
        risk_band = "high"
    else:
        risk_band = "critical"

    # Sort signals by severity priority (critical > high > warning > info) and penalty
    severity_order = {"critical": 0, "high": 1, "warning": 2, "info": 3}
    sorted_signals = sorted(
        active_signals,
        key=lambda s: (severity_order.get(s.severity, 4), -s.score_penalty),
    )

    top_signals = sorted_signals[:3]

    # Generate summary text
    if not sorted_signals:
        summary = "Deal is in healthy standing with consistent velocity, active engagement, and complete stakeholder alignment."
    else:
        top_descriptions = [s.title for s in top_signals]
        summary = f"Deal health score is {health_score}/100 ({risk_band.upper()}). Key drivers: {', '.join(top_descriptions)}."

    return ScoringResult(
        deal_id=deal.deal_id,
        health_score=health_score,
        risk_band=risk_band,
        confidence=1.0,
        signals=sorted_signals,
        top_signals=top_signals,
        risk_summary=summary,
        scoring_version="v1.0.0",
    )
