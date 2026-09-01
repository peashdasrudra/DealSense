# ADR-005: Tenant-Isolated Retrieval Boundaries

## Status
Accepted

## Context
DealSense is a multi-tenant system. Every retrieval query (keyword search, vector similarity search) must respect tenant boundaries. The risk of cross-tenant data leakage is the most severe security concern.

## Decision
**Tenant ID is a mandatory filter on every database query, vector search, cache key, and queue message.** Retrieval never relies on vector similarity alone for authorization.

## Implementation
1. **Database queries**: Every SQL query includes `WHERE tenant_id = :tenant_id` as a non-optional filter. No query path exists without this filter.
2. **Vector search**: pgvector similarity queries always include a `tenant_id` pre-filter before computing cosine similarity. The vector index does not cross tenant boundaries.
3. **Cache keys**: All Redis keys are prefixed with `tenant:{tenant_id}:` — e.g., `tenant:abc123:deal:456:snapshot`.
4. **Queue messages**: Every queued event includes `tenant_id`. Workers reject messages with missing tenant context.
5. **Background jobs**: Worker tasks receive tenant_id as a required parameter and bind it to all downstream operations.
6. **API middleware**: Tenant context is extracted from the authenticated request and injected into the request scope. No endpoint can access data without a validated tenant context.

## Testing Strategy
- **Positive tests**: Verify that queries return only tenant-scoped data.
- **Negative tests**: Intentionally attempt cross-tenant access via API, direct DB query, vector search, and cache key manipulation. All must return zero results or 403.
- **Property-based tests**: Fuzz tenant IDs and verify isolation holds.

## Rationale
- **Legal/contractual**: Client data must never leak between agencies or between an agency's clients.
- **Defense in depth**: Even if one layer fails (e.g., a bug in API routing), the database-level tenant filter prevents cross-tenant reads.
- **Auditability**: Tenant isolation is verifiable through automated tests, not just hoped-for.

## Consequences
- Every new query, search, or cache operation must include tenant scoping — this is a development discipline, not a feature toggle.
- Slightly more complex queries, but the security guarantee is non-negotiable.
- Admin/support access must use explicit, audited, time-bound tenant impersonation — never a "see all tenants" mode.

## Alternatives Rejected
- **Separate databases per tenant**: Operationally expensive at scale and complicates shared schema migrations. Can be reconsidered for enterprise tier.
- **Row-level security only**: Helpful as defense-in-depth but not sufficient as the sole mechanism — application-level filtering is the primary control.
