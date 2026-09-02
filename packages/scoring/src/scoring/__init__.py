"""DealSense Scoring Engine — Deterministic Deal Health Scoring."""

from scoring.engine import score_deal
from scoring.models import EvaluatedSignal, ScoringDealInput, ScoringResult

__all__ = [
    "EvaluatedSignal",
    "ScoringDealInput",
    "ScoringResult",
    "score_deal",
]
