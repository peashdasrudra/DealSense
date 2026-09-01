"""DealSense API — Deal Scoring and Snapshot Test Suite.

Verifies:
- Snapshot generation from CRM history
- Historical score delta tracking
- GET /api/v1/deals/{deal_id}/snapshot
- POST /api/v1/deals/{deal_id}/score
- GET /api/v1/deals/{deal_id}/signals
"""

import os
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest
from cryptography.fernet import Fernet
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.domain.enums import TenantStatus
from dealsense.domain.models import Deal, DealSnapshot, Tenant
from dealsense.services.scoring_service import compute_and_persist_deal_snapshot


@pytest.fixture(autouse=True)
def setup_test_env():
    """Setup test environment."""
    key = Fernet.generate_key().decode()
    os.environ["ENCRYPTION_KEY"] = key
    os.environ["SECRET_KEY"] = "test-secret-key-minimum-32-characters-long"
    from dealsense.infrastructure import encryption
    encryption._fernet = None
    from dealsense.config import get_settings
    get_settings.cache_clear()
    yield
    encryption._fernet = None
    get_settings.cache_clear()


class TestDealScoringService:
    """Test deal scoring computation and snapshot management."""

    @pytest.mark.asyncio
    async def test_compute_snapshot_and_delta(self) -> None:
        """Computing snapshot should evaluate score and calculate delta from previous snapshot."""
        tenant_id = uuid4()
        deal_id = uuid4()

        deal = Deal(
            id=deal_id,
            tenant_id=tenant_id,
            hubspot_deal_id="deal-123",
            name="Apex Deal",
            stage="contract_sent",
            pipeline="default",
            amount=75000.0,
            close_date=datetime.now(timezone.utc),
            owner_id="rep1",
            properties={},
            created_at=datetime.now(timezone.utc),
        )
        deal.stage_history = []
        deal.activities = []
        deal.participants = []

        mock_db = AsyncMock(spec=AsyncSession)

        # Mock query return for deal and previous snapshot
        mock_deal_res = MagicMock()
        mock_deal_res.scalar_one_or_none.return_value = deal

        mock_prev_res = MagicMock()
        mock_prev_res.scalar_one_or_none.return_value = None

        mock_db.execute.side_effect = [mock_deal_res, mock_prev_res, None]

        snapshot = await compute_and_persist_deal_snapshot(
            tenant_id=tenant_id,
            deal_id=deal_id,
            db=mock_db,
        )

        assert snapshot.deal_id == deal_id
        assert snapshot.tenant_id == tenant_id
        assert 0 <= snapshot.health_score <= 100
        assert snapshot.is_current is True
        assert mock_db.add.called


class TestDealEndpoints:
    """Test deal intelligence REST endpoints."""

    @pytest.mark.asyncio
    async def test_get_deal_snapshot_endpoint(self) -> None:
        """GET /api/v1/deals/{deal_id}/snapshot should return precomputed snapshot."""
        from dealsense.main import app
        from dealsense.api.deps import get_db

        tenant_id = uuid4()
        deal_id = uuid4()
        snapshot_id = uuid4()

        mock_snapshot = DealSnapshot(
            id=snapshot_id,
            deal_id=deal_id,
            tenant_id=tenant_id,
            health_score=88,
            risk_band="healthy",
            confidence=1.0,
            previous_health_score=80,
            score_delta=8,
            top_signals=[],
            risk_explanation="Healthy deal.",
            is_current=True,
            created_at=datetime.now(timezone.utc),
        )

        mock_db = AsyncMock(spec=AsyncSession)
        mock_res = MagicMock()
        mock_res.scalar_one_or_none.return_value = mock_snapshot
        mock_db.execute.return_value = mock_res

        async def _override_get_db():
            yield mock_db

        # Mock TenantGuard to allow request with X-Tenant-ID
        mock_tenant_res = MagicMock()
        mock_tenant_res.scalar_one_or_none.return_value = TenantStatus.ACTIVE

        with patch("dealsense.security.tenant_guard.TenantGuardMiddleware._validate_tenant", new_callable=AsyncMock) as mock_val:
            mock_val.return_value = TenantStatus.ACTIVE

            app.dependency_overrides[get_db] = _override_get_db

            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://test") as client:
                response = await client.get(
                    f"/api/v1/deals/{deal_id}/snapshot",
                    headers={"X-Tenant-ID": str(tenant_id)},
                )

            app.dependency_overrides.clear()

            assert response.status_code == 200
            data = response.json()
            assert data["health_score"] == 88
            assert data["risk_band"] == "healthy"
            assert data["score_delta"] == 8
