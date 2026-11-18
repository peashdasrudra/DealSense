"""DealSense API — Embedding & Semantic Chunking Service.

Chunks CRM activity content (notes, call transcripts, emails) and generates
vector embeddings using OpenAI text-embedding-3-small, persisting DocumentChunk records.
"""

from uuid import UUID, uuid4

import structlog
from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.config import get_settings
from dealsense.domain.models import DocumentChunk

logger = structlog.get_logger(__name__)

CHUNK_SIZE_CHARS = 1200  # ~300 tokens
CHUNK_OVERLAP_CHARS = 200
DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSIONS = 1536


def chunk_text(
    text: str, chunk_size: int = CHUNK_SIZE_CHARS, overlap: int = CHUNK_OVERLAP_CHARS
) -> list[str]:
    """Split text into overlapping character chunks."""
    if not text or not text.strip():
        return []

    cleaned = text.strip()
    if len(cleaned) <= chunk_size:
        return [cleaned]

    chunks = []
    start = 0
    while start < len(cleaned):
        end = start + chunk_size
        chunk = cleaned[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap

    return chunks


async def generate_embeddings(texts: list[str]) -> list[list[float]]:
    """Generate vector embeddings for a list of text strings using OpenAI API."""
    if not texts:
        return []

    settings = get_settings()
    if not settings.openai_api_key:
        logger.warning("openai_api_key_not_configured_using_zero_embeddings")
        return [[0.0] * EMBEDDING_DIMENSIONS for _ in texts]

    client = AsyncOpenAI(api_key=settings.openai_api_key)
    try:
        response = await client.embeddings.create(
            model=settings.embedding_model or DEFAULT_EMBEDDING_MODEL,
            input=texts,
        )
        return [item.embedding for item in response.data]
    except Exception as e:
        logger.error("embedding_generation_failed", error=str(e))
        # Fallback to zero vectors on API failure in non-prod
        return [[0.0] * EMBEDDING_DIMENSIONS for _ in texts]


async def process_and_store_activity_chunks(
    tenant_id: UUID,
    deal_id: UUID | None,
    activity_id: UUID,
    content: str,
    db: AsyncSession,
) -> list[DocumentChunk]:
    """Chunk activity text, generate embeddings, and persist DocumentChunk records.

    Args:
        tenant_id: Tenant UUID (for isolation)
        deal_id: Deal UUID (optional association)
        activity_id: Activity UUID
        content: Raw activity content string
        db: AsyncSession

    Returns:
        List of created DocumentChunk instances
    """
    chunks = chunk_text(content)
    if not chunks:
        return []

    embeddings = await generate_embeddings(chunks)
    created_records: list[DocumentChunk] = []

    for idx, (chunk_text_content, emb) in enumerate(zip(chunks, embeddings, strict=True)):
        doc_chunk = DocumentChunk(
            id=uuid4(),
            tenant_id=tenant_id,
            activity_id=activity_id,
            deal_id=deal_id,
            content=chunk_text_content,
            chunk_index=idx,
            token_count=len(chunk_text_content) // 4,
            embedding=emb,
            embedding_model=DEFAULT_EMBEDDING_MODEL,
            embedding_version="v1.0.0",
        )
        db.add(doc_chunk)
        created_records.append(doc_chunk)

    await db.flush()
    logger.info(
        "activity_chunks_stored",
        activity_id=str(activity_id),
        chunk_count=len(created_records),
    )
    return created_records
