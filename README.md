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
[![Vercel Deployed](https://img.shields.io/badge/Vercel-Live%20Deploy-000000?style=for-the-badge&logo=vercel)](https://web-dashboard-azure-ten.vercel.app)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](#license)

[Live Demos](#-live-deployments) • [Features](#-key-features) • [Architecture](#-system-architecture) • [Scoring Engine](#-deterministic-scoring-engine) • [Quick Start](#-quick-start) • [HubSpot Design System](#-hubspot-canvas-design-system) • [ADRs](#-architectural-decision-records)

---

</div>

## 🌐 Live Deployments

| Application | Description | Live URL |
| :--- | :--- | :--- |
| **Agency Command Center** | Macro-level RevOps portfolio intelligence & risk heatmap | [web-dashboard-azure-ten.vercel.app](https://web-dashboard-azure-ten.vercel.app) |
| **HubSpot Sidebar Card** | Native HubSpot UI Extension for deal records | [hubspot-extension-dealsense.vercel.app](https://hubspot-extension-dealsense.vercel.app) |

---

## 💡 Why DealSense?

Most "AI CRM" tools simply dump LLM wrappers on deal properties, generating vague summaries, hallucinating probability numbers, and creating noise that sales reps ignore.

**DealSense is built differently:**
- **Deterministic Math Before LLMs**: Health scores are derived from **7 measurable telemetry signals** (stage aging, engagement decay, stakeholder gaps, commitment slip), giving consistent and explainable scores without hallucinations.
- **Evidence-Grounded Intelligence**: Every risk flag and MEDDICC dimension directly quotes verbatim evidence (call notes, email threads, timestamped interactions) with strict abstention when evidence is lacking.
- **Controlled Autonomy & Approval Gates**: 4 distinct action tiers ensure AI never blindly mutates CRM data without human authorization and audit trails.
- **HubSpot Native Canvas Design**: Designed according to official HubSpot UX guidelines with `#124548` teal accents, warm surfaces, and executive editorial serif headings.

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

## 🎨 HubSpot Canvas Design System

The DealSense frontend implements the official **HubSpot Canvas Design System** ([docs/hubspot-DESIGN.md](docs/hubspot-DESIGN.md)):
- **Palette**: `#124548` (HubSpot Dark Teal), `#042729` (Deep Accent), `#ffffff` (Canvas), `#fcfcfa` (Warm Surface), and `#e5e0d3` (Borders).
- **Typography**: Editorial Serif Display (`Playfair Display`) paired with `Plus Jakarta Sans` body typography.
- **8px Baseline Grid**: Strict spacing increments avoiding cognitive clutter in all-day RevOps workflows.

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
│   ├── hubspot-DESIGN.md       # Official HubSpot Canvas Design System Specification
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
