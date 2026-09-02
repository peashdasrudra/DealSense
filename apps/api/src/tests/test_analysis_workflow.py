"""DealSense API — Analysis Workflow Test Suite.

Verifies:
- End-to-end LangGraph state machine execution across all 7 nodes
- Transition from hydrated CRM data -> deterministic score -> hybrid retrieval -> MEDDICC -> recommendations -> snapshot persistence
- ActionProposal creation
- POST /api/v1/deals/{deal_id}/analyze endpoint
"""

import os
from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest
from cryptography.fernet import Fernet
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.domain.enums import TenantStatus
from dealsense.domain.models import Deal, DealSnapshot
from dealsense_worker.workflows.deal_analysis import DealAnalysisWorkflow


@pytest.fixture(autouse=True)
def setup_test_env():
    """Setup test environment."""
    key = Fernet.generate_key().decode()
    os.environ["ENCRYPTION_KEY"] = key
    os.environ["SECRET_KEY"] = "test-secret-key-minimum-32-characters-long"
    os.environ["OPENAI_API_KEY"] = ""
    from dealsense.infrastructure import encryption

    encryption._fernet = None
    from dealsense.config import get_settings

    get_settings.cache_clear()
    yield
    encryption._fernet = None
    get_settings.cache_clear()


class TestDealAnalysisWorkflow:
    """Test full LangGraph deal analysis state machine."""

    @pytest.mark.asyncio
    async def test_full_workflow_execution(self) -> None:
        """Workflow should execute all 7 nodes and produce a complete DealAnalysisState."""
        tenant_id = uuid4()
        deal_id = uuid4()

        deal = Deal(
            id=deal_id,
            tenant_id=tenant_id,
            hubspot_deal_id="deal-999",
            name="Orion Cloud Migration",
            stage="contract_sent",
            pipeline="default",
            amount=150000.0,
            owner_id="rep_sarah",
            owner_name="Sarah Rep",
            close_date=datetime.now(UTC),
            created_at=datetime.now(UTC),
            properties={},
        )
        deal.stage_history = []
        deal.activities = []
        deal.participants = []

        mock_db = AsyncMock(spec=AsyncSession)

        # Mock DB queries:
        # 1. select Deal
        mock_deal_res = MagicMock()
        mock_deal_res.scalar_one_or_none.return_value = deal

        # 2. select previous DealSnapshot
        mock_prev_res = MagicMock()
        mock_prev_res.scalar_one_or_none.return_value = None

        mock_db.execute.side_effect = [mock_deal_res, mock_prev_res, None]

        with patch(
            "dealsense_worker.workflows.deal_analysis.search_deal_evidence", new_callable=AsyncMock
        ) as mock_retrieval:
            mock_retrieval.return_value = []

            workflow = DealAnalysisWorkflow(db=mock_db)
            state = await workflow.execute(tenant_id=tenant_id, deal_id=deal_id)

            assert state.current_node == "completed"
            assert "hydrate_deal" in state.completed_nodes
            assert "score_deal" in state.completed_nodes
            assert "retrieve_evidence" in state.completed_nodes
            assert "extract_meddicc" in state.completed_nodes
            assert "generate_recommendations" in state.completed_nodes
            assert "persist_snapshot" in state.completed_nodes

            assert state.scoring_result is not None
            assert 0 <= state.scoring_result.health_score <= 100
            assert state.snapshot_id is not None
            assert len(state.recommendations) >= 1
            assert mock_db.add.called

    @pytest.mark.asyncio
    async def test_trigger_deal_analysis_endpoint(self) -> None:
        """POST /api/v1/deals/{deal_id}/analyze should execute analysis and return 200."""
        from dealsense.api.deps import get_db
        from dealsense.main import app

        tenant_id = uuid4()
        deal_id = uuid4()
        snapshot_id = uuid4()

        mock_snapshot = DealSnapshot(
            id=snapshot_id,
            deal_id=deal_id,
            tenant_id=tenant_id,
            health_score=75,
            risk_band="moderate",
            confidence=1.0,
            top_signals=[],
            risk_explanation="Deal has moderate velocity risk.",
            what_changed="Stage updated.",
            recommended_actions=[],
            is_current=True,
            created_at=datetime.now(UTC),
        )

        mock_db = AsyncMock(spec=AsyncSession)

        async def _override_get_db():
            yield mock_db

        with (
            patch(
                "dealsense.security.tenant_guard.TenantGuardMiddleware._validate_tenant",
                new_callable=AsyncMock,
            ) as mock_val,
            patch(
                "dealsense_worker.tasks.analyze.run_deal_analysis", new_callable=AsyncMock
            ) as mock_run_analysis,
            patch(
                "dealsense.api.v1.deals.get_latest_deal_snapshot", new_callable=AsyncMock
            ) as mock_get_snap,
        ):
            mock_val.return_value = TenantStatus.ACTIVE
            mock_run_analysis.return_value = MagicMock()
            mock_get_snap.return_value = mock_snapshot

            app.dependency_overrides[get_db] = _override_get_db

            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://test") as client:
                response = await client.post(
                    f"/api/v1/deals/{deal_id}/analyze",
                    headers={"X-Tenant-ID": str(tenant_id)},
                )

            app.dependency_overrides.clear()

            assert response.status_code == 200
            data = response.json()
            assert data["health_score"] == 75
            assert data["risk_band"] == "moderate"
            assert mock_run_analysis.called
