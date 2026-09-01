# ADR-003: PostgreSQL + pgvector Over Separate Vector Database

## Status
Accepted

## Context
DealSense requires both relational data storage (tenants, deals, activities, audit events) and vector similarity search (semantic retrieval for RAG). Options:
1. PostgreSQL + pgvector (unified)
2. PostgreSQL + Pinecone/Weaviate/Qdrant (separate vector DB)
3. PostgreSQL + Elasticsearch/OpenSearch (separate search)

## Decision
We will use **PostgreSQL with pgvector** for both relational and vector storage initially, with HNSW indexing for approximate nearest neighbor search.

## Rationale
- **Operational simplicity**: One database to manage, back up, monitor, and scale. Critical for a small team.
- **Transactional consistency**: Embeddings are stored alongside their source activities in the same transaction. No cross-system consistency issues.
- **Tenant isolation**: PostgreSQL's mature row-level security and query-level tenant filtering apply uniformly to both relational and vector data. A separate vector DB would need its own tenant isolation mechanism.
- **Sufficient scale**: Our initial corpus is deal-specific (notes, meetings, calls per deal), not millions of documents. pgvector with HNSW handles thousands to low millions of vectors well.
- **Cost**: No additional service fees or infrastructure for a separate vector database.
- **Hybrid retrieval**: We combine keyword search (PostgreSQL full-text search) and vector search in the same database, simplifying the retrieval pipeline.

## Consequences
- Vector search performance is bounded by PostgreSQL's capabilities — fine for our scale but may need revisiting at >10M vectors.
- We must maintain embedding model version metadata per chunk for reprocessing.
- If we outgrow pgvector, migration to a dedicated vector DB is straightforward since our retrieval service abstracts the storage layer.

## Alternatives Rejected
- **Separate vector DB**: Premature infrastructure complexity, additional tenant isolation surface, higher cost, and cross-system consistency risk.
- **Elasticsearch**: Overkill for our initial retrieval needs and adds significant operational burden.
