# DealSense — System Architecture

> **AI-Native Deal Intelligence Platform for HubSpot CRM**
> Built for HubSpot App Marketplace certification • Multi-tenant SaaS • Production-grade security

---

## Executive Summary

DealSense is a **multi-tenant, event-driven backend** that plugs into HubSpot CRM via OAuth 2.0 and real-time webhooks to deliver AI-powered deal health scoring, risk signal detection, and controlled CRM write-back actions — all within a **4-tier approval governance model** designed for enterprise sales operations.

| Dimension | Implementation |
|---|---|
| **Runtime** | Python 3.12 • FastAPI (async) • Uvicorn ASGI |
| **Database** | PostgreSQL 16 + pgvector (14 ORM tables) |
| **Cache / Queue** | Redis 7 — token cache, idempotency, distributed locks, Redis Streams |
| **Auth** | HubSpot OAuth 2.0 + HMAC-signed CSRF state + JWT sessions |
| **Security** | Fernet encryption at rest • RBAC (6 roles, 22 permissions) • tenant isolation middleware |
| **HubSpot** | CRM v3 API — Deals, Contacts, Notes, Tasks, Emails, Meetings • Webhook v3 signatures |
| **Architecture Style** | Domain-Driven Design • Event Sourcing • CQRS-lite |

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph External["External Systems"]
        HS["HubSpot CRM<br/>Portal / Sandbox"]
        HSW["HubSpot Webhooks<br/>v3 HMAC Signed"]
        HSUI["HubSpot UI Extension<br/>Sidebar Card"]
    end

    subgraph DealSense["DealSense Platform"]
        subgraph API["FastAPI Application"]
            GW["API Gateway<br/>CORS + Security Headers<br/>+ Rate Limit Headers"]
            TG["Tenant Guard<br/>Middleware"]
            RBAC["RBAC Engine<br/>6 Roles • 22 Permissions"]
            
            subgraph Routes["API Routes"]
                OA["OAuth Router<br/>/api/v1/oauth/*"]
                WH["Webhook Router<br/>/api/v1/webhooks/*"]
                DL["Deals Router<br/>/api/v1/deals/*"]
                AC["Actions Router<br/>/api/v1/actions/*"]
                LC["Lifecycle Router<br/>/api/v1/lifecycle/*"]
                PR["Integration Proof<br/>/api/v1/proof/*"]
            end

            subgraph Services["Service Layer"]
                OS["OAuth Service<br/>Code Exchange<br/>Token Provisioning"]
                WS["Webhook Service<br/>Validation + Dedup<br/>+ Queue Publish"]
                SS["Scoring Service<br/>7-Signal Engine"]
                AS["Audit Service<br/>Immutable Log"]
            end
        end

        subgraph Security["Security Layer"]
            TM["Token Manager<br/>Encrypted Storage<br/>Auto-Refresh<br/>Distributed Lock"]
            SIG["Webhook Signature<br/>HMAC-SHA256 v3<br/>Replay Protection"]
            ENC["Fernet Encryption<br/>Tokens at Rest"]
        end

        subgraph Infra["Infrastructure"]
            PG["PostgreSQL 16<br/>14 Tables<br/>pgvector"]
            RD["Redis 7<br/>Cache • Locks<br/>Streams • Idempotency"]
            HSC["HubSpot Client<br/>Rate Limit Backoff<br/>Retry with Jitter"]
        end

        subgraph Worker["Async Worker"]
            WK["Event Consumer<br/>Redis Streams<br/>Consumer Group"]
            DLQ["Dead Letter Queue<br/>Failed Event Routing"]
        end
    end

    HS -->|"OAuth 2.0<br/>Auth Code Flow"| OA
    HSW -->|"POST /webhooks/hubspot<br/>HMAC-SHA256 v3"| WH
    HSUI -->|"GET /deals/{id}/snapshot"| DL

    GW --> TG --> RBAC --> Routes
    OA --> OS --> TM --> ENC
    WH --> WS --> SIG
    WS -->|"XADD"| RD
    DL --> SS
    DL --> HSC --> HS
    AC --> HSC
    
    TM --> PG
    TM --> RD
    OS --> PG
    WS --> PG
    SS --> PG
    AS --> PG

    WK -->|"XREADGROUP"| RD
    WK -->|"Process"| PG
    WK -->|"Fail 5x"| DLQ
```

---

## 2. HubSpot Integration — Complete OAuth 2.0 Flow

This is the centerpiece. The OAuth flow handles **HubSpot App Marketplace installs**, **direct developer portal installs**, and **React 18 double-mount deduplication** — all battle-tested for certification.

```mermaid
sequenceDiagram
    participant U as Customer
    participant HS as HubSpot Portal
    participant API as DealSense API
    participant DB as PostgreSQL
    participant R as Redis
    
    Note over U,R: Phase 1 — Authorization
    U->>API: GET /api/v1/oauth/authorize
    API->>API: Generate HMAC-SHA256 signed state token
    API->>R: Cache state (30min TTL)
    API-->>U: authorization_url + state

    U->>HS: Redirect → HubSpot OAuth consent screen
    HS-->>API: GET /api/v1/oauth/callback?code=xxx&state=yyy

    Note over API,R: Phase 2 — Token Exchange
    API->>API: Validate HMAC state signature + timestamp
    API->>R: Acquire distributed lock (code dedup)
    API->>HS: POST /oauth/v1/token (code exchange)
    HS-->>API: access_token + refresh_token (30min TTL)
    
    API->>HS: GET /oauth/v1/access-tokens/{token}
    HS-->>API: portal_id, scopes, hub_domain

    Note over API,DB: Phase 3 — Tenant Provisioning
    API->>API: Deterministic UUID5 from portal_id
    API->>DB: Upsert Tenant (portal_id → tenant)
    API->>API: Fernet.encrypt(access_token, refresh_token)
    API->>DB: Upsert HubSpotConnection (encrypted tokens)
    API->>R: Cache access_token (25min TTL)
    
    Note over API,U: Phase 4 — Session Issuance
    API->>API: Sign JWT (tenant_id, portal_id, role, 14d expiry)
    API->>DB: Record AuditEvent (tenant.installed)
    API-->>U: Set-Cookie: dealsense_session (HttpOnly, Secure)
    API-->>U: Redirect → /pipeline?auth=success
```

### Token Lifecycle Management

```mermaid
stateDiagram-v2
    [*] --> Cached: OAuth Install
    Cached --> Valid: cache_get() hit
    Cached --> DBLookup: cache miss
    DBLookup --> Valid: token_expires_at > now + 5min
    DBLookup --> NearExpiry: token_expires_at ≤ now + 5min
    NearExpiry --> AcquireLock: Distributed Lock
    AcquireLock --> Refresh: Lock acquired
    AcquireLock --> WaitRetry: Lock contention
    Refresh --> Cached: Store new tokens (encrypted)
    Refresh --> FailureTrack: HTTP error
    FailureTrack --> Refresh: failures < 3
    FailureTrack --> Deactivated: failures ≥ 3
    WaitRetry --> Cached: Check cache again
    Valid --> [*]: Return access_token
    Deactivated --> [*]: OAuthTokenExpiredError
```

**Key design decisions:**
- **Deterministic tenant IDs** — `uuid5(NAMESPACE_DNS, "hubspot:{portal_id}")` ensures idempotent re-installs
- **Distributed lock on refresh** — prevents thundering herd when multiple requests hit an expired token simultaneously
- **Fernet encryption at rest** — tokens are never stored in plaintext in PostgreSQL
- **5-minute safety buffer** — proactive refresh before actual expiry to eliminate race conditions

---

## 3. Webhook Pipeline — Real-time Event Processing

```mermaid
flowchart LR
    HS["HubSpot<br/>Webhook"]
    
    subgraph Validation["1. Signature Verification"]
        V1["v3: HMAC-SHA256<br/>(Method+URL+Body+TS)"]
        V2["Replay Protection<br/>(300s window)"]
    end
    
    subgraph Dedup["2. Idempotency"]
        ID["Redis Key<br/>hubspot:event:{portal}:{eventId}<br/>24h TTL"]
    end
    
    subgraph Resolve["3. Tenant Resolution"]
        TR["portal_id → Tenant<br/>(batch-cached per request)"]
    end
    
    subgraph Lifecycle["4. Lifecycle Events"]
        UN["app.uninstalled<br/>→ disconnect_tenant()"]
        GD["contact.privacyDeletion<br/>→ GDPR purge"]
    end
    
    subgraph Persist["5. Durable Storage"]
        DB["WebhookEvent<br/>(PostgreSQL)"]
    end
    
    subgraph Queue["6. Async Processing"]
        RS["Redis Streams<br/>XADD"]
        WK["Worker Consumer<br/>XREADGROUP"]
        DLQ["DLQ after 5 retries"]
    end
    
    HS --> V1 --> V2 --> ID --> Resolve --> Lifecycle
    Resolve --> Persist --> Queue
    RS --> WK --> DLQ
```

**HubSpot webhook guarantees met:**
- ✅ Returns `200 OK` within 5 seconds (async queue offload)
- ✅ HMAC-SHA256 v3 signature verification with replay protection
- ✅ Idempotent processing (24h Redis deduplication)
- ✅ Graceful degradation — returns 200 even on partial failures
- ✅ Handles `app.uninstalled`, `app.deactivated`, and GDPR `contact.privacyDeletion`

---

## 4. Data Architecture — 14 Core Tables

```mermaid
erDiagram
    tenants ||--o| hubspot_connections : "1:1 encrypted tokens"
    tenants ||--o{ deals : "1:N tenant-scoped"
    tenants ||--o{ audit_events : "1:N immutable log"
    tenants ||--o{ webhook_events : "1:N event store"
    
    deals ||--o{ deal_snapshots : "1:N point-in-time scores"
    deals ||--o{ deal_signals : "1:N risk signals"
    deals ||--o{ deal_stage_history : "1:N stage transitions"
    deals ||--o{ activities : "1:N CRM activities"
    deals ||--o{ deal_participants : "N:M via persons"
    deals ||--o{ action_proposals : "1:N AI recommendations"
    
    deal_participants }o--|| persons : "M:1 contacts"
    
    deal_snapshots ||--o{ deal_signals : "1:N per snapshot"
    
    action_proposals ||--o{ action_executions : "1:N write-back records"
    
    activities ||--o{ document_chunks : "1:N + pgvector"
```

### Table Inventory

| # | Table | Purpose | Key Indexes |
|---|---|---|---|
| 1 | `tenants` | Multi-tenant root entity | `hubspot_portal_id` (unique) |
| 2 | `hubspot_connections` | Encrypted OAuth tokens | `tenant_id` (unique FK) |
| 3 | `deals` | Normalized CRM deals | `(tenant_id, hubspot_deal_id)` unique |
| 4 | `deal_stage_history` | Immutable stage transitions | `deal_id`, `tenant_id` |
| 5 | `persons` | Contacts from HubSpot | `(tenant_id, hubspot_contact_id)` unique |
| 6 | `deal_participants` | Deal ↔ Person junction with role | `(deal_id, person_id)` unique |
| 7 | `activities` | Notes, calls, meetings, emails, tasks | `(tenant_id, deal_id)`, `occurred_at` |
| 8 | `document_chunks` | Chunked text + pgvector embeddings | `(tenant_id, deal_id)` |
| 9 | `deal_signals` | Deterministic risk signals | `deal_id`, `snapshot_id` |
| 10 | `deal_snapshots` | Point-in-time health scores | `(tenant_id, deal_id, is_current)` |
| 11 | `action_proposals` | AI-recommended CRM actions | `tenant_id`, `deal_id`, `idempotency_key` |
| 12 | `action_executions` | Write-back execution records | `proposal_id`, `tenant_id` |
| 13 | `webhook_events` | Durable webhook event store | `(tenant_id, status)`, `idempotency_key` |
| 14 | `audit_events` | Immutable compliance audit trail | `(tenant_id, action)`, `created_at` |

**Every table includes `tenant_id`** — enforcing data isolation at the query level, not just application level.

---

## 5. Security Architecture

```mermaid
flowchart TB
    subgraph Request["Incoming Request"]
        REQ["HTTP Request"]
    end

    subgraph Layer1["L1: Transport Security"]
        CORS["CORS Whitelist"]
        HSTS["HSTS + X-Frame-Options<br/>+ X-Content-Type-Options"]
        RATE["Rate Limit Headers<br/>(120 req/min)"]
    end

    subgraph Layer2["L2: Tenant Isolation"]
        TG["TenantGuardMiddleware<br/>Extract → Validate → Bind"]
        JWT["JWT Session Decode<br/>HS256 signed"]
        PORTAL["Portal ID → Tenant<br/>UUID5 Resolution"]
    end

    subgraph Layer3["L3: Authorization"]
        RBAC["RBAC Engine"]
        PERM["22 Granular Permissions"]
        ROLE["6 Hierarchical Roles"]
    end

    subgraph Layer4["L4: Data Protection"]
        ENC["Fernet AES-128-CBC<br/>Tokens encrypted at rest"]
        HMAC["HMAC-SHA256<br/>OAuth state + webhook sigs"]
        AUDIT["Immutable Audit Trail<br/>Every mutation logged"]
    end

    REQ --> Layer1 --> Layer2 --> Layer3 --> Layer4
```

### RBAC Permission Matrix

| Role | Deals | Actions | OAuth | Audit | Portfolio |
|---|---|---|---|---|---|
| **Agency Owner** | Full CRUD + Analyze | Approve + Execute + Rollback | Manage + Disconnect | Read + Export | Manage |
| **Agency Operator** | Full CRUD + Analyze | Approve + Execute | Manage | Read | Read |
| **Client Admin** | Full CRUD + Analyze | Approve + Execute | Manage + Disconnect | Read | — |
| **Sales Manager** | Read + Update + Analyze | Read + Approve | — | Read | — |
| **Sales Rep** | Read + Update + Analyze | Read + Approve (own) | — | — | — |
| **Auditor** | Read-only | Read-only | — | Read + Export | Read |

---

## 6. HubSpot CRUD Operations — Complete Coverage

```mermaid
flowchart LR
    subgraph DealsCRUD["Deals CRUD"]
        C["POST /deals<br/>→ HubSpot POST /crm/v3/objects/deals"]
        R["GET /deals<br/>→ HubSpot GET /crm/v3/objects/deals"]
        U["PATCH /deals/{id}<br/>→ HubSpot PATCH /crm/v3/objects/deals/{id}"]
        D["DELETE /deals/{id}<br/>→ HubSpot DELETE /crm/v3/objects/deals/{id}"]
        B["Batch Update<br/>→ /crm/v3/objects/deals/batch/update<br/>(100-item chunking)"]
    end

    subgraph Engagements["Engagement Write-Back"]
        N["POST /deals/{id}/notes<br/>→ Create Note + Association"]
        T["POST /deals/{id}/tasks<br/>→ Create Task + Association"]
        E["POST /deals/{id}/emails<br/>→ Create Email + Association"]
        M["POST /deals/{id}/meetings<br/>→ Create Meeting + Association"]
    end

    subgraph ReadOps["Read Operations"]
        GD["GET /deals/{id}<br/>→ Get Deal + Associations"]
        GC["Get Contact<br/>→ /crm/v3/objects/contacts/{id}"]
        GE["Get Engagements<br/>→ /crm/v3/objects/deals/{id}/associations/notes"]
    end
```

### HubSpot Client Resilience Pattern

```python
# Rate limit backoff with exponential retry (actual implementation)
for attempt in range(1, MAX_RETRIES + 1):
    response = await client.request(method, url, headers, params, json)
    
    if response.status_code in (429, 502, 503, 504) and attempt < MAX_RETRIES:
        retry_after = float(response.headers.get("Retry-After", 2**attempt))
        await asyncio.sleep(retry_after)  # Exponential backoff
        continue
    
    if response.status_code >= 400:
        raise HubSpotClientError(...)
```

---

## 7. Action Governance — 4-Tier Approval Model

```mermaid
stateDiagram-v2
    [*] --> Proposed: AI generates recommendation
    
    state Tier1 {
        Proposed --> Surfaced: Tier 1 (Observe)
        note right of Surfaced: Read-only insight\nNo CRM mutation
    }
    
    state Tier2 {
        Proposed --> Notified: Tier 2 (Notify)
        note right of Notified: Alert to deal owner
    }
    
    state Tier3 {
        Proposed --> PendingApproval: Tier 3 (Assist)
        PendingApproval --> Approved: Human approves
        PendingApproval --> Rejected: Human rejects
        Approved --> Executing: Execute write-back
    }
    
    state Tier4 {
        Proposed --> AutoQueued: Tier 4 (Act)
        AutoQueued --> Executing: Auto-execute
    }
    
    Executing --> Completed: HubSpot API success
    Executing --> Failed: HubSpot API error
    Completed --> RolledBack: Rollback requested
    
    Rejected --> [*]
    Completed --> [*]
    RolledBack --> [*]
```

**Every CRM mutation is:**
1. **Proposed** with rationale and impact estimate
2. **Approved** by a human with sufficient RBAC permissions
3. **Executed** with full audit trail and rollback payload
4. **Reversible** — rollback endpoint restores previous state

---

## 8. Request Lifecycle — End-to-End Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant CORS as CORS Middleware
    participant SEC as Security Headers
    participant TG as Tenant Guard
    participant RBAC as RBAC Check
    participant Route as Route Handler
    participant HSC as HubSpot Client
    participant DB as PostgreSQL
    participant R as Redis

    C->>CORS: Request with Origin header
    CORS->>SEC: Add HSTS, X-Frame-Options, CSP
    SEC->>TG: Extract tenant from JWT/header
    TG->>TG: Validate tenant status (active/suspended)
    TG->>RBAC: Bind tenant_id to request.state
    RBAC->>RBAC: Decode JWT → extract role → check permission
    RBAC->>Route: tenant_id injected via Depends()
    
    Route->>R: Check deal cache (30s TTL)
    alt Cache Hit
        R-->>Route: Cached deal data
    else Cache Miss
        Route->>HSC: HubSpotClient(tenant_id, db)
        HSC->>HSC: get_access_token() → decrypt + auto-refresh
        HSC->>HSC: Rate limit backoff (429 → retry)
        HSC-->>Route: HubSpot API response
        Route->>R: Cache result (30s TTL)
    end
    
    Route->>DB: Persist/query local state
    Route-->>C: ORJSONResponse (fast serialization)
```

---

## 9. Production Deployment

```mermaid
graph LR
    subgraph Render["Render.com"]
        WEB["Web Service<br/>uvicorn main:app<br/>--host 0.0.0.0 --port 8000"]
    end
    
    subgraph Managed["Managed Services"]
        NDB["Neon PostgreSQL<br/>(or Render Postgres)"]
        UPS["Upstash Redis<br/>(or Render Redis)"]
    end
    
    subgraph HubSpot["HubSpot"]
        APP["Developer App<br/>App ID + Client Secret"]
        MKT["App Marketplace<br/>(Certification Ready)"]
    end
    
    WEB --> NDB
    WEB --> UPS
    WEB <--> APP
    APP --> MKT
```

### Health Check Endpoints

| Endpoint | Purpose | Response |
|---|---|---|
| `GET /` | Load balancer probe | `{"status": "healthy"}` |
| `GET /health` | Liveness probe | `{"status": "healthy"}` |
| `GET /ready` | Readiness probe | DB + Redis connectivity check |
| `GET /api/v1/status` | API version status | `{"api": "v1", "status": "operational"}` |

---

## 10. API Endpoint Inventory

### OAuth & Authentication
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/oauth/install` | One-click install URL for customers |
| `GET` | `/api/v1/oauth/authorize` | Generate OAuth URL + CSRF state |
| `GET` | `/api/v1/oauth/callback` | Browser redirect callback |
| `POST` | `/api/v1/oauth/callback` | JSON API callback |
| `GET` | `/api/v1/oauth/status` | Token health status |
| `POST` | `/api/v1/oauth/refresh` | Force token refresh |
| `POST` | `/api/v1/oauth/disconnect` | Disconnect integration |

### Deals CRUD (HubSpot ↔ DealSense)
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/deals` | List all deals (live HubSpot + DB + demo) |
| `POST` | `/api/v1/deals` | Create deal in HubSpot + local DB |
| `PATCH` | `/api/v1/deals/{id}` | Update deal in HubSpot + local |
| `DELETE` | `/api/v1/deals/{id}` | Archive deal in HubSpot + local |
| `GET` | `/api/v1/deals/{id}` | Get deal detail |
| `GET` | `/api/v1/deals/{id}/snapshot` | AI health score snapshot |
| `POST` | `/api/v1/deals/{id}/score` | Trigger scoring |
| `POST` | `/api/v1/deals/{id}/analyze` | Full analysis pipeline |
| `GET` | `/api/v1/deals/{id}/signals` | Risk signals |
| `POST` | `/api/v1/deals/sync-hubspot` | Force sync from HubSpot |

### Engagement Write-Back
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/deals/{id}/notes` | Create note in HubSpot |
| `POST` | `/api/v1/deals/{id}/tasks` | Create task in HubSpot |
| `POST` | `/api/v1/deals/{id}/emails` | Create email in HubSpot |
| `POST` | `/api/v1/deals/{id}/meetings` | Create meeting in HubSpot |

### Actions & Approval Workflow
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/actions` | List pending action proposals |
| `POST` | `/api/v1/actions/{id}/decision` | Approve or reject |
| `POST` | `/api/v1/actions/{id}/execute` | Execute approved write-back |
| `POST` | `/api/v1/actions/{id}/rollback` | Rollback executed action |

### Webhooks & Lifecycle
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/webhooks/hubspot` | Receive HubSpot webhook events |
| `DELETE` | `/api/v1/lifecycle/uninstall` | Handle app uninstallation |
| `POST` | `/api/v1/lifecycle/gdpr-delete` | GDPR contact deletion |

---

## 11. Why This Architecture Matters

### For a Technical CTO evaluating this:

**1. It's not a toy.** This is a production multi-tenant SaaS backend with real security (encrypted tokens, RBAC, audit trails), not a CRUD tutorial.

**2. HubSpot-native, not bolted on.** The OAuth flow handles marketplace certification edge cases (direct installs, React 18 double-mounts, enterprise MFA timeouts). Webhook processing meets HubSpot's 5-second SLA with async queue offload.

**3. The hard problems are solved:**
- Token refresh thundering herd → distributed Redis locks
- Webhook idempotency → 24h Redis deduplication + DB unique constraints
- Tenant data isolation → middleware + per-query scoping + cross-tenant exception hierarchy
- AI action safety → 4-tier approval governance with rollback

**4. It's observable.** Structured logging via structlog, OpenTelemetry traces, health/readiness probes, audit events for every mutation.

**5. It degrades gracefully.** Every external dependency (Redis, PostgreSQL, HubSpot API) has fallback paths — in-memory caches, demo data, retry with backoff.

---

## 12. Running the Backend

```bash
# Install dependencies
cd apps/api && pip install -e ".[dev]"

# Start the API server
uvicorn dealsense.main:app --reload --host 0.0.0.0 --port 8000

# View interactive API docs
open http://localhost:8000/docs

# Health check
curl http://localhost:8000/health
```

### Environment Variables (minimum for demo)

```bash
SECRET_KEY=change-me-to-a-random-secret-key-min-32-chars
HUBSPOT_CLIENT_ID=your-app-client-id
HUBSPOT_CLIENT_SECRET=your-app-client-secret
HUBSPOT_REDIRECT_URI=http://localhost:3000/oauth/callback
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/dealsense
REDIS_URL=redis://localhost:6379/0
```

---

<div align="center">

**Built by [Peash Rudra](https://github.com/peashdasrudra) — AiXpertLabs**

*DealSense: Where AI meets revenue intelligence.*

</div>
