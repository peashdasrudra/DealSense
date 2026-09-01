<div align="center">

# 🎯 DealSense
### **HubSpot-Native AI Revenue Intelligence & Deal Risk Platform**

*Turn messy CRM activity into explainable revenue decisions, verifiable MEDDICC health, and human-approved CRM actions.*

[![CI Pipeline](https://img.shields.io/badge/CI-Passing-success?style=for-the-badge&logo=github-actions)](https://github.com/peashdasrudra/DealSense/actions)
[![Python 3.12+](https://img.shields.io/badge/Python-3.12%2B-blue?style=for-the-badge&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/Orchestration-LangGraph-FF4F00?style=for-the-badge)](https://langchain.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B%20%7C%20pgvector-336791?style=for-the-badge&logo=postgresql)](https://github.com/pgvector/pgvector)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](#license)

[Features](#-key-features) • [Architecture](#-system-architecture) • [Scoring Engine](#-deterministic-scoring-engine) • [Quick Start](#-quick-start) • [HubSpot Extension](#-hubspot-ui-extension) • [ADRs](#-architectural-decision-records)

---

</div>

## 💡 Why DealSense?

Most "AI CRM" tools simply dump LLM wrappers on deal properties, generating vague summaries, hallucinating probability numbers, and creating noise that sales reps ignore.

**DealSense is built differently:**
- **Deterministic Math Before LLMs**: Health scores are derived from **7 measurable telemetry signals** (stage aging, engagement decay, stakeholder gaps, commitment slip), giving consistent and explainable scores without hallucinations.
- **Evidence-Grounded Intelligence**: Every risk flag and MEDDICC dimension directly quotes verbatim evidence (call notes, email threads, timestamped interactions) with strict abstention when evidence is lacking.
- **Controlled Autonomy & Approval Gates**: 4 distinct action tiers ensure AI never blindly mutates CRM data without human authorization and audit trails.
- **Native Where Reps Work**: Operates directly inside the HubSpot Deal Sidebar (React UI Extension) and an Agency Command Center dashboard.

---

## 🏛️ System Architecture

```
                                  HUBSPOT CRM
         ┌─────────────────────────────┼─────────────────────────────┐
         │ (OAuth 2.0 Install)         │ (v1/v3 Webhook Events)      │ (UI Extension)
         ▼                             ▼                             ▼
┌──────────────────┐         ┌──────────────────┐          ┌──────────────────┐
│   OAuth & Token  │         │ Webhook Gateway  │          │ DealSense Card   │
│     Manager      │         │ (FastAPI Router) │          │ (React Sidebar)  │
└────────┬─────────┘         └────────┬─────────┘          └────────┬─────────┘
         │                            │                             │
         │ AES-256-GCM                │ Idempotency & Signature     │ REST / SSE
         ▼                            ▼                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TENANT ISOLATION MIDDLEWARE                           │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ Redis Streams Queue
                                      ▼
                      ┌───────────────────────────────┐
                      │  Async Worker Processing Hub  │
                      └───────────────┬───────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│ 7-Signal Scoring │        │ Hybrid Retrieval │        │ LangGraph Agent  │
│  (Deterministic) │        │ (Vector + RRF)   │        │ (7-Node Workflow)│
└────────┬─────────┘        └────────┬─────────┘        └────────┬─────────┘
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     ▼
                      ┌───────────────────────────────┐
                      │ PostgreSQL 16 + pgvector HNSW │
                      │ (Isolated Tenant Partitions)  │
                      └───────────────────────────────┘
```

---

## ✨ Key Features

### 📊 1. Deterministic Revenue Scoring
- **0–100 Health Score**: Evaluated across 5 risk bands (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `HEALTHY`).
- **Explainable Signals**: Ranked contributions showing exactly which variables pulled down the score.
- **Delta Tracking**: Real-time snapshot diffing against prior evaluations.

### 🧠 2. Deep MEDDICC Extraction & Abstention Guardrails
- **Continuous Audit**: Analyzes unstructured meeting notes, emails, and call transcripts against MEDDICC dimensions:
  - **M**etrics | **E**conomic Buyer | **D**ecision Criteria | **D**ecision Process | **I**dentify Pain | **C**hampion | **C**ompetition
- **Strict Evidence Citation**: Each criterion requires verbatim text evidence and timestamp citations.
- **Zero-Hallucination Policy**: If evidence is missing, status is explicitly marked as `UNKNOWN` rather than guessed.

### ⚡ 3. Tiered Action Recommendations & Write-Backs
All recommended next-best actions are governed by strict execution tiers:

| Tier | Name | Permissions Required | Execution Model | Example Actions |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | Suggestion Only | `recommendation.read` | Manual Rep Action | Suggest follow-up angle |
| **Tier 2** | Low-Risk Write-Back | `action.write_low` | Auto / One-Click | Draft email, schedule task |
| **Tier 3** | Medium-Risk Mutation | `action.write_medium` | Rep / AM Approval | Add missing stakeholder contact |
| **Tier 4** | High-Risk Mutation | `action.write_high` | RevOps / Owner Gate | Slip close date, revert stage |

*Includes instant **One-Click Rollback** on all executed CRM write-backs.*

### 🛡️ 4. Enterprise-Grade Multi-Tenancy & Security
- **Envelope Encryption**: AES-256-GCM token storage with automatic rotation and distributed locking.
- **Tenant Isolation**: Mandatory tenancy checks on all HTTP endpoints, background worker jobs, and vector similarity queries.
- **Role-Based Access Control (RBAC)**: 6 roles (`AGENCY_OWNER`, `AGENCY_ADMIN`, `REVOPS_ANALYST`, `ACCOUNT_MANAGER`, `SALES_REP`, `AUDITOR`) governing 23 granular capabilities.
- **Replay Protection**: Webhook timestamp verification preventing replay attacks on HubSpot callbacks.

---

## 🧮 Deterministic Scoring Engine

The scoring engine (`packages/scoring`) runs a 100% deterministic mathematical evaluation across 7 core signals:

```
Score = 100 - [ (w₁ · StageAging) + (w₂ · EngagementDecay) + (w₃ · StakeholderGap) 
              + (w₄ · CommitmentQuality) + (w₅ · DateSlippage) + (w₆ · CRMHygiene) 
              + (w₇ · HistoricalSimilarity) ]
```

```
Risk Bands:
  0 – 39  ▶ [CRITICAL] 🔴 Deal is stalled / single-threaded / ghosting
 40 – 59  ▶ [HIGH]     🟠 Severe momentum decay or unverified buyer
 60 – 74  ▶ [MEDIUM]   🟡 Minor stage aging or hygiene gaps
 75 – 89  ▶ [LOW]      🟢 Strong engagement with healthy pipeline velocity
 90 – 100 ▶ [HEALTHY]  🌟 Verified Economic Buyer, active Champion, on track
```

---

## 📁 Monorepo Structure

```
DealSense/
├── apps/
│   ├── api/                    # FastAPI Backend (REST API, Webhook Gateway, OAuth)
│   ├── worker/                 # Async Processing Worker (LangGraph & Redis Streams)
│   ├── hubspot-extension/      # HubSpot React Deal Sidebar Extension
│   └── web-dashboard/          # Next.js / Vite Agency Command Center
├── packages/
│   ├── contracts/              # Shared TypeScript interfaces & API schemas
│   ├── scoring/                # Deterministic 7-signal mathematical scoring package
│   ├── prompts/                # Versioned LLM prompt registry & extraction templates
│   └── evals/                  # Benchmark datasets (MEDDICC, Actions, Scenarios)
├── infrastructure/
│   ├── docker/                 # Docker Compose, PostgreSQL + pgvector, Redis
│   └── terraform/              # Cloud Infrastructure-as-Code definitions
├── docs/
│   ├── adr/                    # Architecture Decision Records (ADRs 001–005)
│   └── threat-model/           # Security & Threat modeling specifications
└── .github/workflows/          # Automated CI/CD pipelines
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.12+**
- **Docker Desktop**
- **Node.js 18+** & **npm**

### 1. Clone & Setup Environment
```bash
git clone https://github.com/peashdasrudra/DealSense.git
cd DealSense

# Copy template configurations
cp .env.example .env
```

### 2. Launch Infrastructure
Start the PostgreSQL 16 (`pgvector`), Redis 7, API backend, and Worker services:
```bash
make dev
# or: docker compose -f infrastructure/docker/docker-compose.yml up --build
```

### 3. Run Automated Database Migrations
```bash
make migrate
```

### 4. Run Test Suites
```bash
# Run API & Worker Test Suite (43 tests)
python -m pytest -v apps/api/src/tests

# Run Scoring Engine Determinism Suite (5 tests)
python -m pytest -v packages/scoring/tests
```

---

## 💻 Frontend Applications

### 🔹 HubSpot Deal Sidebar Card (`apps/hubspot-extension`)
An embedded React interface built with HubSpot UI Extensions that displays:
- **Radial Health Gauge**: Real-time score with risk level badge and delta indicators.
- **MEDDICC Radar**: Breakdown of all 7 pillars with verifiable evidence excerpts.
- **Ranked Risk Warnings**: Direct citations linking back to emails and meeting notes.
- **Action Approval Cards**: One-click execution or approval gates for RevOps write-backs.

### 🔹 Agency Command Center (`apps/web-dashboard`)
A modern web application tailored for RevOps consultants and agency leadership:
- **Portfolio Overview**: Cross-client revenue pipeline health and aggregate risk distribution.
- **Risk Heatmap**: Multi-dimensional matrix mapping deal velocity against deal value.
- **Action & Approval Queue**: Centralized review queue for pending Tier 2/3/4 write-backs with instant rollback support.

---

## 📜 Architectural Decision Records (ADRs)

DealSense is built on thoroughly documented architectural decisions:

- **[ADR-001: Agency White-Label Wedge](docs/adr/001-agency-white-label-wedge.md)** — Go-to-market architecture focusing on RevOps consultancies and agency multi-tenancy.
- **[ADR-002: Deterministic Scoring Precedes Predictive ML](docs/adr/002-deterministic-before-predictive.md)** — Mathematical invariance over LLM scoring hallucinations.
- **[ADR-003: PostgreSQL + pgvector Consolidation](docs/adr/003-postgresql-pgvector.md)** — Unifying transactional data and vector search within PostgreSQL 16 HNSW indexes.
- **[ADR-004: Approval Gates Before Autonomy](docs/adr/004-approval-gates-before-autonomy.md)** — Tiered permission model and rollback guarantees for CRM writes.
- **[ADR-005: Tenant-Isolated Retrieval Boundaries](docs/adr/005-tenant-isolated-retrieval.md)** — Multi-layer isolation preventing cross-tenant context bleeding in RAG.

---

## 🔒 Security & Compliance

- **Zero Training Guarantee**: Customer CRM activity is never used for foundation model training.
- **Data Retention & Encryption**: Encryption at rest (AES-256-GCM) and in transit (TLS 1.3).
- **HMAC Signatures**: Every incoming webhook is cryptographically verified against HubSpot's app secret.
- **Replay Protection**: Strict 5-minute request window verification to thwart replay attacks.

---

## 📄 License

Proprietary — All rights reserved. Built with precision for top-tier RevOps teams and agencies.
