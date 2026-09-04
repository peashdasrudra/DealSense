# DealSense - Full Project Technical Context

> **Purpose:** This document is compiled specifically to serve as a comprehensive system prompt or context file for another AI agent. It details the entire architecture, domain logic, tech stack, and module structure of the DealSense project.

## 📌 Executive Summary

*   **Project Name:** DealSense
*   **Mission:** Autonomous HubSpot-Native Revenue Intelligence & Zero-Hallucination Deal Risk Engine
*   **Author/Architect:** Peash Das Rudra (AiXpert Labs)
*   **Production State:** Live, verified with 48/48 Pytest test suites passing, zero Ruff lint errors.

## 🛠️ Technology Stack

*   **Backend / API:** Python 3.14+, FastAPI 0.115+
*   **Database:** PostgreSQL 16 with `pgvector` (HNSW indices) for embeddings
*   **Background / Streaming:** Redis 7 Streams, Celery workers
*   **Frontend / UI:** React 18, TypeScript 5.5, Vite 5, Framer Motion
*   **HubSpot Integration:** OAuth 2.0 (client-side init, backend token management), Webhooks (v1/v3, HMAC-SHA256 signature verification), Custom Workflow Actions (Node.js 18)
*   **Infrastructure:** Docker Compose, Vercel (Frontend)

## 🏛️ System Architecture

DealSense is built as a robust, high-throughput monorepo prioritizing deterministic mathematics over raw LLM guesswork.

### Core Data Flow & Request Lifecycle
1.  **Ingestion:** High-frequency HubSpot CRM events are received via a FastAPI Webhook Gateway.
2.  **Validation:** Webhook signatures are validated using HMAC-SHA256 in <5ms.
3.  **Queueing:** Validated payloads are published to distributed, append-only **Redis Streams**.
4.  **Processing:** **Celery background workers** consume from Redis Streams (handling backpressure and mass CRM updates).
5.  **Scoring (Deterministic Engine):** Raw properties are fed into a pure-Python/NumPy 7-vector mathematical scoring engine (bypassing LLMs for absolute reproducibility).
6.  **AI/LLM Augmentation:** LangGraph agents and Hybrid Retrieval (Vector + RRF) operate strictly as secondary enrichment layers on top of deterministic metrics.
7.  **Storage:** Processed telemetry is saved to **PostgreSQL 16**. Data is cryptographically isolated per tenant using strict **Row-Level Security (RLS)** (`SET LOCAL app.current_tenant_id = :tenant_id`).

### The Monorepo Structure

```text
DealSense/
├── apps/
│   ├── api/                  # FastAPI REST & SSE Gateway (OAuth, Webhooks, RLS)
│   ├── worker/               # Celery asynchronous worker hub consuming Redis Streams
│   ├── web-dashboard/        # React 18 / TS / Vite RevOps Command Center (SPA)
│   └── hubspot-extension/    # Embedded HubSpot Canvas CRM Sidebar Card UI
├── packages/
│   ├── hubspot-workflow-actions/ # Node.js Workflow Custom Code Actions
│   ├── scoring/                  # 7-Vector deterministic mathematical scoring engine
│   ├── contracts/                # TypeScript / Python shared schema contracts
│   ├── evals/                    # Evaluation suites
│   └── prompts/                  # Strict evidence extraction & MEDDICC prompt guardrails
├── infrastructure/
│   └── docker/               # Docker compose, PostgreSQL 16 pgvector init scripts
└── docs/                     # Architectural Decision Records (ADRs)
```

## 🧮 Domain Logic: The 7-Vector Deterministic Scoring Engine

The core IP of the platform is a penalty deduction model providing a deal health score from 0–100, without hallucinations.

`Score = 100 - SUM(w_i * Signal_i)`

1.  **Stage Aging (25% weight):** Exponential decay measuring days in current pipeline stage vs historical benchmark.
2.  **Engagement Half-Life (20% weight):** Recency decay on buyer emails, calls, and meetings ($t_{1/2} = 7$ days).
3.  **Stakeholder Multi-Threading (15% weight):** Heavy penalty if Economic Buyer (CFO/VP) is missing or silent for >14 days.
4.  **Close Date Slippage (15% weight):** Step function penalty per close date push event recorded in the audit trail.
5.  **Commitment Sentiment (10% weight):** NLP sentiment drift across call transcripts and emails.
6.  **CRM Hygiene & MEDDICC (10% weight):** Missing next steps, empty decision criteria, unverified metrics.
7.  **Historical Pattern Similarity (5% weight):** Cosine similarity against past closed-lost opportunity embeddings.

**Risk Band Classifications:**
*   **0–39 (CRITICAL 🔴):** Immediate slippage, ghosting economic buyer, single-threaded.
*   **40–59 (HIGH 🟠):** Severe engagement decay, date pushed 2+ times.
*   **60–74 (MODERATE 🟡):** Minor stage aging or incomplete CRM hygiene.
*   **75–89 (LOW 🟢):** Strong multi-threaded momentum, active champion.
*   **90–100 (HEALTHY 🌟):** Verified CFO sign-off, closing within quarter.

## 🚀 Key Modules & Capabilities

1.  `/pipeline` - **Pipeline Overview:** Macro portfolio health, active deals counter, interactive deal drawer.
2.  `/forecast` - **Revenue Forecasting:** Monte Carlo revenue simulator (10,000 iterations).
3.  `/waterfall` - **Pipeline Waterfall:** Inflow/outflow velocity and stage transition analytics.
4.  `/deals` - **Deal Inspector:** Searchable, filterable dossier table with CSV export.
5.  `/war-room` - **Deal War Room:** Pipeline review command center with 1-click executive QBR briefing exports.
6.  `/stakeholders` - **Stakeholder Matrix:** Maps Economic Buyers, Champions, and single-threaded vulnerabilities.
7.  `/heatmap` - **Risk Heatmap:** Matrix mapping deal value across stages and risk severity bands.
8.  `/actions` - **Action Approval Queue:** 1-click batch deal rescue approvals with instant HubSpot writeback.
9.  `/map` - **Mutual Action Plans (MAP):** Buyer-seller milestone schedules with share links.
10. `/battlecards` - **Battlecards & Objections:** Objection killer scripts against competitors.
11. `/playbooks` - **RevOps Playbooks:** Conditional trigger engine (e.g., IF CFO silent > 14d -> Trigger VP peer sequence).
12. `/hygiene` - **CRM Hygiene Engine:** Automated discrepancy detector with batch correction.
13. `/reps` - **Rep Coaching:** Rep risk index, stage velocity bottleneck analysis.
14. `/clients` - **Client Health:** Account churn probability, expansion pipeline.

## 🔐 Security & Operations

*   **OAuth Lifecycle:** Bypassed fragile server-side redirects in favor of resilient client-side HubSpot authorization. The backend strictly exchanges and stores JWT/tenant tokens.
*   **Multi-Tenant Isolation:** Complete SaaS architectural design allowing "Agency Fleet Partners" to manage multiple HubSpot portals under a single instance, cryptographically separated by RLS in Postgres.
*   **No Mock Data:** The platform strictly enforces real data ingestion. Fallbacks to mock data (`_DEMO_DEALS`) have been completely purged from both the React frontend and FastAPI backend. It gracefully handles Empty States via HubSpot Canvas guidelines.
