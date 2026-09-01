# DealSense

> White-label, HubSpot-native AI Deal Intelligence and Revenue Risk platform for B2B agencies and RevOps consultancies.

DealSense analyzes messy CRM activity—meeting notes, stage aging, emails, and contacts—to score deal health, ground every risk in verifiable evidence, and recommend human-approved CRM actions.

## Architecture Overview

```
HubSpot CRM
├── OAuth installation + tenant configuration
├── Webhooks: deal/contact/task/note/activity changes
├── UI Extension: native DealSense deal sidebar card
└── HubSpot workflows / API actions
        │
        ▼
Webhook Gateway (FastAPI)
├── Signature verification
├── Idempotency check
├── Event persistence
└── Queue publication (Redis Streams)
        │
        ▼
Async Processing Layer (Worker)
├── CRM data hydration
├── Normalization + data quality checks
├── Semantic chunking + embedding
└── LangGraph analysis workflow
        │
        ▼
Intelligence Layer
├── Deterministic risk signals (7 measurable signals)
├── Hybrid retrieval (keyword + vector)
├── LLM extraction (MEDDICC, commitments, stakeholders)
├── Evidence-grounded recommendations
└── Confidence / abstention policy
        │
        ▼
Experience Layer
├── HubSpot React UI Extension (deal sidebar card)
├── Next.js Agency Command Center
└── White-label settings
```

## Quick Start

### Prerequisites

- Python 3.12+
- Docker Desktop
- Node.js 18+
- Make

### Local Development

```bash
# Clone and enter repository
git clone <repo-url>
cd dealsense

# Copy environment configuration
cp .env.example .env

# Start the full stack (PostgreSQL + pgvector, Redis, API, Worker)
make dev

# Run tests
make test

# Run linting + type checks
make lint

# Apply database migrations
make migrate
```

### Environment Variables

See [.env.example](.env.example) for all required configuration.

## Project Structure

```
dealsense/
├── apps/
│   ├── api/                    # FastAPI Backend
│   ├── worker/                 # Background Worker
│   ├── hubspot-extension/      # HubSpot UI Extensions
│   └── web-dashboard/          # Next.js Agency Command Center
├── packages/
│   ├── contracts/              # Shared type contracts
│   ├── scoring/                # Deterministic scoring engine
│   ├── prompts/                # Versioned prompt templates
│   └── evals/                  # Evaluation framework
├── infrastructure/
│   ├── docker/                 # Docker Compose + Dockerfiles
│   └── terraform/              # IaC for AWS
├── docs/
│   ├── adr/                    # Architecture Decision Records
│   ├── threat-model/
│   └── runbooks/
└── .github/workflows/          # CI/CD pipelines
```

## Key Design Principles

1. **Deterministic scoring precedes predictive ML** — Every risk score comes from measurable signals, not opaque LLM opinions
2. **Evidence-backed everything** — Every claim, score, and recommendation cites its source
3. **Approval gates before autonomy** — CRM writes require explicit human approval per tier
4. **Tenant isolation from day one** — Every query, search, and cache key is tenant-scoped
5. **Native HubSpot experience** — Insights live where reps already work, not in another dashboard

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API | FastAPI + Pydantic v2 + SQLAlchemy 2.0 |
| Database | PostgreSQL 16 + pgvector (HNSW) |
| Cache | Redis 7 |
| Queue | Redis Streams |
| AI Orchestration | LangGraph |
| HubSpot Extension | React + TypeScript UI Extensions |
| Dashboard | Next.js App Router + Tailwind + shadcn/ui |
| Observability | OpenTelemetry + structured logging |
| Infrastructure | Docker Compose (dev) / Terraform + AWS (prod) |

## Architecture Decision Records

- [ADR-001: Agency white-label as market wedge](docs/adr/001-agency-white-label-wedge.md)
- [ADR-002: Deterministic scoring before predictive ML](docs/adr/002-deterministic-before-predictive.md)
- [ADR-003: PostgreSQL + pgvector over separate vector DB](docs/adr/003-postgresql-pgvector.md)
- [ADR-004: Approval gates before autonomous actions](docs/adr/004-approval-gates-before-autonomy.md)
- [ADR-005: Tenant-isolated retrieval boundaries](docs/adr/005-tenant-isolated-retrieval.md)

## License

Proprietary — All rights reserved.
