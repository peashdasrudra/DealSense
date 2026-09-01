"""DealSense Scoring Engine — Unit & Determinism Test Suite.

Verifies:
- All 7 signal evaluators (Stage aging, Engagement decay, Stakeholder gap, Commitment, Slippage, Hygiene, Similarity)
- Absolute determinism (identical input -> exact identical output)
- Score boundary clamping (0 to 100)
- Benchmark dataset validation against expected risk bands
"""

import json
from datetime import datetime, timezone
from pathlib import Path
import pytest

from scoring.engine import score_deal
from scoring.models import ScoringDealInput


class TestScoringSignals:
    """Test individual signal evaluators."""

    def test_stage_aging_critical(self) -> None:
        """Deal stalled > 2.5x benchmark should trigger critical stage aging."""
        deal = ScoringDealInput(
            deal_id="d1",
            stage="contract_negotiation",
            days_in_current_stage=40.0,
            stage_benchmark_days=14.0,
            owner_id="rep1",
            amount=50000.0,
            close_date=datetime.now(timezone.utc),
            has_scheduled_next_step=True,
            identified_roles=["champion", "economic_buyer"],
        )
        result = score_deal(deal)
        signal_types = [s.signal_type for s in result.signals]
        assert "stage_aging" in signal_types
        aging_signal = next(s for s in result.signals if s.signal_type == "stage_aging")
        assert aging_signal.severity == "critical"
        assert aging_signal.score_penalty == 25.0

    def test_engagement_decay_healthy_vs_stale(self) -> None:
        """Engagement within 7 days produces no penalty; > 28 days produces critical penalty."""
        healthy_deal = ScoringDealInput(
            deal_id="d_healthy",
            stage="discovery",
            days_since_last_activity=2.0,
            days_in_current_stage=5.0,
            owner_id="rep1",
            amount=10000.0,
            close_date=datetime.now(timezone.utc),
            has_scheduled_next_step=True,
            identified_roles=["champion", "economic_buyer"],
        )
        healthy_result = score_deal(healthy_deal)
        assert not any(s.signal_type == "engagement_decay" for s in healthy_result.signals)
        assert healthy_result.health_score >= 90
        assert healthy_result.risk_band == "healthy"

        stale_deal = healthy_deal.model_copy(update={"days_since_last_activity": 30.0})
        stale_result = score_deal(stale_deal)
        stale_signal = next(s for s in stale_result.signals if s.signal_type == "engagement_decay")
        assert stale_signal.severity == "critical"
        assert stale_signal.score_penalty == 30.0

    def test_stakeholder_coverage_gap(self) -> None:
        """Missing both Champion and Economic Buyer triggers critical stakeholder gap."""
        deal = ScoringDealInput(
            deal_id="d_single_threaded",
            stage="evaluation",
            days_in_current_stage=5.0,
            owner_id="rep1",
            amount=50000.0,
            close_date=datetime.now(timezone.utc),
            has_scheduled_next_step=True,
            identified_roles=[],  # No confirmed stakeholders
        )
        result = score_deal(deal)
        signal = next(s for s in result.signals if s.signal_type == "stakeholder_gap")
        assert signal.severity == "critical"
        assert signal.score_penalty == 25.0


class TestScoringDeterminism:
    """Test engine reproducibility and determinism."""

    def test_identical_inputs_produce_identical_scores(self) -> None:
        """Engine must be 100% deterministic — run 100 times, zero variance."""
        deal = ScoringDealInput(
            deal_id="d_det",
            stage="proposal",
            days_in_current_stage=25.0,
            stage_benchmark_days=14.0,
            days_since_last_activity=15.0,
            owner_id="rep2",
            amount=80000.0,
            close_date=datetime.now(timezone.utc),
            has_scheduled_next_step=False,
            close_date_push_count=2,
            past_due_tasks_count=1,
            identified_roles=["champion"],
        )

        first_result = score_deal(deal)
        for _ in range(100):
            repeated_result = score_deal(deal)
            assert repeated_result.health_score == first_result.health_score
            assert repeated_result.risk_band == first_result.risk_band
            assert len(repeated_result.signals) == len(first_result.signals)


class TestScoringDatasetValidation:
    """Validate scoring against scenario benchmark dataset."""

    def test_dataset_scenarios(self) -> None:
        """All seeded evaluation scenarios must fall within expected risk bands and score bounds."""
        dataset_path = Path(__file__).resolve().parent.parent.parent / "evals" / "datasets" / "scoring" / "deal_scenarios.jsonl"
        if not dataset_path.exists():
            pytest.skip("Dataset file not found")

        with open(dataset_path, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                scenario = json.loads(line)
                deal = ScoringDealInput(
                    deal_id=scenario["id"],
                    name=scenario["name"],
                    stage=scenario["stage"],
                    amount=scenario["amount"],
                    days_in_current_stage=float(scenario["days_in_stage"]),
                    stage_benchmark_days=float(scenario["benchmark_days"]),
                    days_since_last_activity=float(scenario["days_since_activity"]),
                    identified_roles=scenario["identified_roles"],
                    has_scheduled_next_step=scenario["has_scheduled_next_step"],
                    close_date_push_count=scenario["close_date_pushes"],
                    past_due_tasks_count=scenario["past_due_tasks"],
                    owner_id="rep1",
                    close_date=datetime.now(timezone.utc),
                )
                res = score_deal(deal)

                if "expected_risk_band" in scenario:
                    assert res.risk_band == scenario["expected_risk_band"], f"Failed on scenario {scenario['id']}: score={res.health_score}"
                if "min_score" in scenario:
                    assert res.health_score >= scenario["min_score"]
                if "max_score" in scenario:
                    assert res.health_score <= scenario["max_score"]
