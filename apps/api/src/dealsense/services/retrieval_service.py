"""DealSense API — Hybrid Retrieval Service.

Implements hybrid keyword + vector semantic search over deal document chunks with:
- Mandatory tenant isolation filter (ADR-005)
- pgvector cosine distance search
- PostgreSQL text matching
- Reciprocal Rank Fusion (RRF) rank aggregation
"""

from typing import Any
from uuid import UUID

import structlog
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.domain.models import DocumentChunk
from dealsense.services.embedding_service import generate_embeddings

logger = structlog.get_logger(__name__)

RRF_K = 60  # Standard Reciprocal Rank Fusion constant


class RetrievedEvidence(BaseModel):
    """Retrieved evidence item with citation metadata."""

    chunk_id: UUID
    activity_id: UUID
    deal_id: UUID | None
    content: str
    score: float
    retrieval_method: str  # "vector", "keyword", "hybrid"


async def search_deal_evidence(
    tenant_id: UUID,
    deal_id: UUID,
    query: str,
    db: AsyncSession,
    top_k: int = 5,
) -> list[RetrievedEvidence]:
    """Retrieve relevant deal activity chunks using hybrid search.

    Args:
        tenant_id: Tenant UUID (strict boundary)
        deal_id: Deal UUID (filters to specific deal's documents)
        query: Search query string
        db: AsyncSession
        top_k: Number of results to return

    Returns:
        List of RetrievedEvidence sorted by relevance
    """
    if not query or not query.strip():
        return []

    # 1. Vector Search
    query_embeddings = await generate_embeddings([query])
    query_vector = query_embeddings[0] if query_embeddings else None

    vector_results: list[DocumentChunk] = []
    if query_vector and any(v != 0.0 for v in query_vector):
        try:
            # Using pgvector cosine distance: embedding <=> query_vector
            vector_stmt = (
                select(DocumentChunk)
                .where(
                    DocumentChunk.tenant_id == tenant_id,
                    DocumentChunk.deal_id == deal_id,
                    DocumentChunk.embedding.isnot(None),
                )
                .order_by(DocumentChunk.embedding.cosine_distance(query_vector))
                .limit(top_k * 2)
            )
            vec_res = await db.execute(vector_stmt)
            vector_results = list(vec_res.scalars().all())
        except Exception as e:
            logger.warning("vector_search_fallback", error=str(e))

    # 2. Keyword Search (ILIKE filter with tenant boundary)
    keywords = [k.strip() for k in query.split() if len(k.strip()) > 2]
    keyword_results: list[DocumentChunk] = []

    if keywords:
        kw_stmt = select(DocumentChunk).where(
            DocumentChunk.tenant_id == tenant_id,
            DocumentChunk.deal_id == deal_id,
        )
        for kw in keywords[:3]:
            kw_stmt = kw_stmt.where(DocumentChunk.content.ilike(f"%{kw}%"))
        kw_stmt = kw_stmt.limit(top_k * 2)

        try:
            kw_res = await db.execute(kw_stmt)
            keyword_results = list(kw_res.scalars().all())
        except Exception as e:
            logger.warning("keyword_search_failed", error=str(e))

    # 3. Reciprocal Rank Fusion (RRF)
    rrf_scores: dict[UUID, float] = {}
    chunk_map: dict[UUID, DocumentChunk] = {}
    methods: dict[UUID, str] = {}

    for rank, chunk in enumerate(vector_results):
        chunk_map[chunk.id] = chunk
        rrf_scores[chunk.id] = rrf_scores.get(chunk.id, 0.0) + (1.0 / (RRF_K + rank + 1))
        methods[chunk.id] = "vector"

    for rank, chunk in enumerate(keyword_results):
        chunk_map[chunk.id] = chunk
        rrf_scores[chunk.id] = rrf_scores.get(chunk.id, 0.0) + (1.0 / (RRF_K + rank + 1))
        methods[chunk.id] = "hybrid" if chunk.id in methods else "keyword"

    # Sort by aggregate RRF score
    sorted_ids = sorted(rrf_scores.keys(), key=lambda cid: rrf_scores[cid], reverse=True)

    evidences: list[RetrievedEvidence] = []
    for cid in sorted_ids[:top_k]:
        chunk = chunk_map[cid]
        evidences.append(
            RetrievedEvidence(
                chunk_id=chunk.id,
                activity_id=chunk.activity_id,
                deal_id=chunk.deal_id,
                content=chunk.content,
                score=round(rrf_scores[cid], 4),
                retrieval_method=methods.get(cid, "hybrid"),
            )
        )

    logger.info(
        "evidence_retrieval_completed",
        deal_id=str(deal_id),
        query=query[:40],
        retrieved_count=len(evidences),
    )
    return evidences
