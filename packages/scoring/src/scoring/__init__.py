"""DealSense Scoring Engine — Deterministic Deal Health Scoring."""

from scoring.engine import score_deal
from scoring.models import EvaluatedSignal, ScoringDealInput, ScoringResult

__all__ = [
    "score_deal",
    "ScoringDealInput",
    "ScoringResult",
    "EvaluatedSignal",
]
