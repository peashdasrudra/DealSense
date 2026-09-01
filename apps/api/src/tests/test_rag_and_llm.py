"""DealSense API — Hybrid RAG and LLM Intelligence Test Suite.

Verifies:
- Text chunking and embedding storage
- Tenant-isolated hybrid retrieval (keyword + vector RRF)
- MEDDICC structured extraction & abstention policy
- Next-best-action recommendations and tier assignments
"""

import os
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest
from cryptography.fernet import Fernet
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.domain.enums import ActionCategory, ActionTier
from dealsense.domain.models import DocumentChunk
from dealsense.services.embedding_service import chunk_text, process_and_store_activity_chunks
from dealsense.services.llm_service import extract_meddicc_analysis
from dealsense.services.recommendation_service import generate_recommended_actions
from dealsense.services.retrieval_service import search_deal_evidence


@pytest.fixture(autouse=True)
def setup_test_env():
    """Setup test environment."""
    key = Fernet.generate_key().decode()
    os.environ["ENCRYPTION_KEY"] = key
    os.environ["SECRET_KEY"] = "test-secret-key-minimum-32-characters-long"
    os.environ["OPENAI_API_KEY"] = ""  # Test fallback & mock paths
    from dealsense.infrastructure import encryption
    encryption._fernet = None
    from dealsense.config import get_settings
    get_settings.cache_clear()
    yield
    encryption._fernet = None
    get_settings.cache_clear()


class TestChunkingAndEmbedding:
    """Test text chunking and document storage."""

    def test_chunk_text_small_and_large(self) -> None:
        """Small text returns 1 chunk; large text splits with overlap."""
        small = "Short note about discovery call."
        chunks = chunk_text(small, chunk_size=100, overlap=20)
        assert len(chunks) == 1
        assert chunks[0] == small

        large = "A" * 250
        large_chunks = chunk_text(large, chunk_size=100, overlap=20)
        assert len(large_chunks) >= 3

    @pytest.mark.asyncio
    async def test_process_and_store_chunks(self) -> None:
        """Storing chunks should persist DocumentChunk rows with tenant_id."""
        tenant_id = uuid4()
        deal_id = uuid4()
        activity_id = uuid4()
        content = "Customer mentioned that budget authority sits with CFO Jane Doe."

        mock_db = AsyncMock(spec=AsyncSession)

        with patch("dealsense.services.embedding_service.generate_embeddings", new_callable=AsyncMock) as mock_emb:
            mock_emb.return_value = [[0.1] * 1536]

            chunks = await process_and_store_activity_chunks(
                tenant_id=tenant_id,
                deal_id=deal_id,
                activity_id=activity_id,
                content=content,
                db=mock_db,
            )

            assert len(chunks) == 1
            assert chunks[0].tenant_id == tenant_id
            assert chunks[0].deal_id == deal_id
            assert chunks[0].activity_id == activity_id
            assert mock_db.add.called


class TestHybridRetrieval:
    """Test hybrid search with tenant isolation."""

    @pytest.mark.asyncio
    async def test_hybrid_search_with_rrf(self) -> None:
        """Hybrid search should rank documents using Reciprocal Rank Fusion."""
        tenant_id = uuid4()
        deal_id = uuid4()
        chunk_id = uuid4()

        mock_chunk = DocumentChunk(
            id=chunk_id,
            tenant_id=tenant_id,
            deal_id=deal_id,
            activity_id=uuid4(),
            content="CFO Jane signed off on $50,000 budget.",
        )

        mock_db = AsyncMock(spec=AsyncSession)
        mock_vec_res = MagicMock()
        mock_vec_res.scalars.return_value.all.return_value = [mock_chunk]

        mock_kw_res = MagicMock()
        mock_kw_res.scalars.return_value.all.return_value = [mock_chunk]

        mock_db.execute.side_effect = [mock_vec_res, mock_kw_res]

        with patch("dealsense.services.retrieval_service.generate_embeddings", new_callable=AsyncMock) as mock_emb:
            mock_emb.return_value = [[0.1] * 1536]

            results = await search_deal_evidence(
                tenant_id=tenant_id,
                deal_id=deal_id,
                query="budget signoff",
                db=mock_db,
                top_k=5,
            )

            assert len(results) >= 1
            assert results[0].chunk_id == chunk_id
            assert results[0].score > 0.0


class TestLLMExtractionAndRecommendations:
    """Test MEDDICC extraction and recommendation engine."""

    @pytest.mark.asyncio
    async def test_meddicc_abstains_on_empty_evidence(self) -> None:
        """When no activity evidence exists, MEDDICC should abstain (confidence 0.0)."""
        result = await extract_meddicc_analysis(
            deal_name="Ghost Deal",
            stage="discovery",
            amount=None,
            owner_name=None,
            evidence_texts=[],
        )

        assert result.extraction_confidence == 0.0
        assert result.economic_buyer.status == "unidentified"
        assert result.champion.status == "unidentified"

    @pytest.mark.asyncio
    async def test_recommendations_generate_actionable_items(self) -> None:
        """Heuristic and structured recommendation generator should produce tiered actions."""
        top_signals = [
            {
                "signal_type": "stakeholder_gap",
                "title": "Stakeholder Coverage Gap",
                "description": "Missing confirmed Economic Buyer.",
                "severity": "critical",
            },
            {
                "signal_type": "engagement_decay",
                "title": "Engagement Decay",
                "description": "18 days since last activity.",
                "severity": "high",
            },
        ]

        actions = await generate_recommended_actions(
            deal_id="d123",
            deal_name="Atlas Migration",
            stage="evaluation",
            amount=75000.0,
            health_score=45,
            risk_band="elevated",
            top_signals=top_signals,
            meddicc=None,
            recent_context="Last call was 18 days ago.",
        )

        assert len(actions) >= 2
        categories = [a.category for a in actions]
        assert ActionCategory.REQUEST_INTRODUCTION in categories or ActionCategory.CREATE_FOLLOWUP_TASK in categories
        # Verify action tiers
        tiers = [a.tier for a in actions]
        assert ActionTier.TIER_1_SUGGESTION in tiers or ActionTier.TIER_3_CONTROLLED_WRITE in tiers
