<div align="center">

# 🎯 DealSense
### **Autonomous HubSpot-Native Revenue Intelligence & Deal Risk Engine**

*Turn chaotic CRM activity into explainable revenue decisions, verifiable MEDDICC health, and human-approved CRM actions with zero LLM hallucinations.*

[![CI Pipeline](https://img.shields.io/badge/CI%2FCD-48%2F48%20Passing-success?style=for-the-badge&logo=github-actions)](https://github.com/peashdasrudra/DealSense/actions)
[![Python 3.14+](https://img.shields.io/badge/Python-3.14%2B-blue?style=for-the-badge&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Redis Streams](https://img.shields.io/badge/Streaming-Redis%20Streams-DC382D?style=for-the-badge&logo=redis)](https://redis.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B%20%7C%20pgvector-336791?style=for-the-badge&logo=postgresql)](https://github.com/pgvector/pgvector)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Production Deployed](https://img.shields.io/badge/Production-dealsense.peash.tech-000000?style=for-the-badge&logo=vercel)](https://dealsense.peash.tech)

<br />

<img src="docs/assets/Landing.png" alt="DealSense Autonomous Revenue Intelligence Platform Showcase" width="100%" style="border-radius: 12px; box-shadow: 0 12px 36px rgba(0,0,0,0.3);" />

<br /><br />

[🌐 Live Web Dashboard](https://dealsense.peash.tech) • [🧩 HubSpot Native App](https://dealsense.peash.tech/pipeline) • [✨ Executive Case Study](https://dealsense.peash.tech/case-study) • [🏛️ Architecture](#-system-architecture) • [🧪 48/48 Test Suites](#-automated-verification-suites-4848-passing) • [⚡ Quick Start](#-quick-start) • [💬 Developer Outbound](#-creator--lead-architect)

---

</div>

## 🌐 Live Production Deployments

| Application | Description | Live Production URL |
| :--- | :--- | :--- |
| **🏢 Agency Command Center** | Macro-level RevOps portfolio intelligence, Monte Carlo forecasting, Waterfall & Playbooks | [dealsense.peash.tech](https://dealsense.peash.tech) |
| **🧩 HubSpot Native Command Deck** | Native HubSpot Canvas UI embedded directly into HubSpot pipelines | [dealsense.peash.tech/pipeline](https://dealsense.peash.tech/pipeline) |
| **✨ Architecture & Pricing Case Study** | Agency ROI arbitrage calculator, $99 pilot risk audit & technical deep-dive | [dealsense.peash.tech/case-study](https://dealsense.peash.tech/case-study) |

---

## 💡 Why DealSense?

Most "AI CRM" tools simply dump generic LLM wrappers on deal properties, hallucinating win probabilities, outputting vague summaries, and creating noise that sales reps ignore.

**DealSense is engineered differently:**
1. **Deterministic Mathematics Before LLMs**: Health scores (0–100) are computed across **7 measurable mathematical vectors** (stage velocity, engagement half-life decay, economic buyer silence, date slip frequency, MEDDICC completeness), giving 100% reproducible and explainable scores without hallucinations.
2. **Sub-200ms Webhook Streaming**: Ingests high-frequency HubSpot CRM events via HMAC-SHA256 verified webhooks into distributed Redis Streams for zero-downtime, backpressure-tolerant processing.
3. **Multi-Threaded Stakeholder Tracking**: Automatically detects single-threaded deals and alerts revenue leaders when the Economic Buyer (CFO/CEO) has been silent for >14 days.
4. **Controlled Autonomy & Approval Gates**: 4 distinct action tiers ensure AI never mutates CRM data without human authorization and complete audit logging.
5. **HubSpot Native Canvas Design**: Designed according to official HubSpot Canvas guidelines with `#124548` deep teal accents, signature `#ff5c35` flame highlights, warm surfaces, and crisp enterprise typography.

---

## 📊 Competitive Value Comparison

| Capability & Engineering Standard | DealSense (Top-1% Craft) | Gong / Clari | Generic AI Freelancers |
| :--- | :--- | :--- | :--- |
| **HubSpot CRM Integration** | **Native Canvas Sidebar + Sub-200ms Webhooks** | External standalone app (Context switching) | Slow polling scripts or manual Zapier |
| **Scoring Reliability** | **Deterministic 0–100 Mathematical Algorithm** | Blackbox proprietary heuristic | Unconstrained LLM guesses (Hallucinations) |
| **Multi-Tenant Security** | **PostgreSQL Row-Level Security (RLS) + AES-256** | Enterprise Cloud Silos | Shared database tables (Data leakage risk) |
| **Automated Test Coverage** | **48/48 Passing Pytest Test Suites (100%)** | Enterprise QA | 0 tests (Breaks under webhook load) |
| **Deployment Speed & Cost** | **60-Second 1-Click OAuth from $99** | $30K–$60K/year contracts | $20K–$40K & 6-month custom dev cycles |

---

## 🏛️ System Architecture

```
                                  HUBSPOT CRM
         ┌─────────────────────────────┼─────────────────────────────┐
         │ (OAuth 2.0 Ingest)          │ (v1/v3 Webhook Events)      │ (React Canvas Extension)
         ▼                             ▼                             ▼
┌──────────────────┐         ┌──────────────────┐          ┌──────────────────┐
│   OAuth & Token  │         │ Webhook Gateway  │          │ DealSense Card   │
│     Manager      │         │ (FastAPI Router) │          │ (HubSpot Sidebar)│
└────────┬─────────┘         └────────┬─────────┘          └────────┬─────────┘
         │                            │                             │
         │ AES-256-GCM                │ HMAC-SHA256 Verification    │ REST / SSE
         ▼                            ▼                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TENANT ISOLATION MIDDLEWARE                           │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ Redis Streams Queue (Sub-200ms)
                                      ▼
                      ┌───────────────────────────────┐
                      │  Async Celery Processing Hub  │
                      └───────────────┬───────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│ 7-Vector Scoring │        │ Hybrid Retrieval │        │ LangGraph Agent  │
│  (Deterministic) │        │ (Vector + RRF)   │        │ (7-Node Dossier) │
└────────┬─────────┘        └────────┬─────────┘        └────────┬─────────┘
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     ▼
                      ┌───────────────────────────────┐
                      │ PostgreSQL 16 + pgvector HNSW │
                      │ (Row-Level Security Partitions│
                      └───────────────────────────────┘
```

---

## ✨ Complete Platform Map (15 Production Modules)

| Module | Route | Key Capabilities |
| :--- | :--- | :--- |
| **📊 Pipeline Overview** | `/pipeline` | Macro portfolio health, slip forecast, 0–100 risk scoring & interactive deal drawer |
| **🔮 Revenue Forecast** | `/forecast` | Monte Carlo revenue simulation (Commit vs Best Case vs AI Reality across 1,000 iterations) |
| **🌊 Pipeline Waterfall** | `/waterfall` | Inflow/outflow velocity, stage transition analytics & slippage leakage triage |
| **🎯 Deal Inspector** | `/deals` | Filterable deal dossier table with CSV export, stage velocity & next-step triage |
| **🛡️ Deal War Room** | `/war-room` | Friday pipeline review hub, stakeholder multi-threading map & instant executive QBR export |
| **🤝 Stakeholder Matrix** | `/stakeholders` | Power matrix mapping Economic Buyers, Champions, Technical Evaluators & Single-Threading |
| **🔥 Risk Heatmap** | `/heatmap` | Multi-dimensional matrix mapping deal value by stage and risk severity band |
| **⚡ Action Approval Queue** | `/actions` | 1-click batch deal rescue approvals with Slack preview and instant HubSpot write-back |
| **🗺️ Mutual Action Plans** | `/map` | Buyer-seller shared milestone schedules with public interactive client links |
| **⚔️ Battlecards & Objections** | `/battlecards` | Word-for-word objection killer scripts against Gong, Clari, and Native HubSpot |
| **🤖 RevOps Playbooks** | `/playbooks` | Conditional trigger engine (e.g. *IF CFO Silent > 14d -> Auto-draft VP outreach*) |
| **🧹 CRM Hygiene Engine** | `/hygiene` | Automated discrepancy detector with 1-click batch close date slip auto-remediation |
| **👥 Rep Coaching** | `/reps` | Rep risk index, stage velocity bottleneck analysis, and customized coaching plans |
| **🏢 Client Health** | `/clients` | Account churn probability, expansion pipeline, and executive sponsor health scorecards |
| **✨ Architecture & Case Study**| `/case-study`| Live agency arbitrage calculator, $99 / $1,500 / $3,500 packages & direct outbound booking |

---

## 🧮 7-Signal Deterministic Scoring Engine

The scoring engine (`packages/scoring`) runs a 100% reproducible mathematical evaluation across 7 weighted vectors:

$$\text{Score} = 100 - \sum_{i=1}^{7} (w_i \cdot \text{Signal}_i)$$

```
Weighted Vector Dimensions:
  1. Stage Aging (25%): Decay function measuring days in current stage vs historical benchmark.
  2. Engagement Half-Life (20%): Exponential decay on buyer email, call, and meeting frequency.
  3. Stakeholder Multi-Threading (15%): Severe penalty if CFO / Economic Buyer is missing or silent.
  4. Date Slippage (15%): Step function penalty per close date push event.
  5. Commitment Quality (10%): Natural language sentiment drift across meeting transcripts.
  6. CRM Hygiene (10%): Incomplete MEDDICC properties, missing next steps, or stale owner tasks.
  7. Historical Similarity (5%): Cosine similarity against past closed-lost opportunity patterns.
```

```
Risk Band Classification:
   0 – 39  ▶ [CRITICAL] 🔴 Deal is stalled / single-threaded / ghosting CFO
  40 – 59  ▶ [HIGH]     🟠 Severe momentum decay or unverified decision criteria
  60 – 74  ▶ [MEDIUM]   🟡 Minor stage aging or CRM hygiene gaps
  75 – 89  ▶ [LOW]      🟢 Strong engagement with healthy stage velocity
  90 – 100 ▶ [HEALTHY]  🌟 Verified Economic Buyer, active Champion, on track
```

---

## 🧪 Automated Verification Suites (48/48 Passing)

Every API endpoint, scoring algorithm, webhook pipeline, and security guardrail is verified via automated Pytest test suites:

```
============================= test session starts =============================
platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\USER\Desktop\AiXpertLabs\DealSense
configfile: pyproject.toml
testpaths: apps/api/src/tests, apps/worker/src/tests, packages/scoring/tests

apps/api/src/tests/test_analysis_workflow.py ..                          [  4%]
apps/api/src/tests/test_deal_scoring.py ..                               [  8%]
apps/api/src/tests/test_foundation.py .................                  [ 43%]
apps/api/src/tests/test_oauth_security.py ............                   [ 68%]
apps/api/src/tests/test_rag_and_llm.py .....                             [ 79%]
apps/api/src/tests/test_webhooks_pipeline.py .....                       [ 89%]
packages/scoring/tests/test_scoring_engine.py .....                      [100%]

======================= 48 passed in 1.65s ========================
```

---

## 📦 Transparent Deployment Packages

| Tier | Investment | Timeline | Target Buyer | Value Delta & Deliverables |
| :--- | :--- | :--- | :--- | :--- |
| **⚡ Pilot Deal Risk Audit** | **$99 flat fee** *(was $5,000)* | 24–48h | Founders, VPs of Sales | • 1-Click HubSpot OAuth connection (zero dev setup)<br>• Full 0–100 deterministic risk scoring across 50 deals<br>• Executive PDF briefing + live dashboard leak report<br>• 14-day Action Queue & CRM Hygiene access<br>• 30-min strategy call with Senior Architect<br>• **🛡️ 100% "Find $25K Or It's Free" Money-Back Guarantee** |
| **⭐ Full RevOps AI Deployment** | **$1,500 flat fee** *(was $3,500)* | 5 Days | High-Growth B2B Brands | • Everything in $99 Audit tier<br>• Complete FastAPI + PostgreSQL + Redis stack deployed<br>• Sub-200ms bi-directional HubSpot webhooks<br>• All 15 RevOps intelligence modules & Monte Carlo forecaster<br>• **Full source code & database ownership (No recurring fees)** |
| **🏢 White-Label Agency Fleet** | **$3,500 flat fee** *(was $9,000)* | 10 Days | HubSpot Solutions Partners | • Everything in Full Deployment tier<br>• Multi-tenant client fleet dashboard (Unlimited portals)<br>• 100% Agency white-labeling (your logo, domain & brand)<br>• Custom property schema mapping & priority Slack SLA<br>• **Charge clients $2.5K/mo → $240K/yr recurring (161x ROI)** |

---

## ⚡ Quick Start

### 1. Prerequisites
- **Python 3.12+** (Tested on Python 3.14)
- **Node.js 18+** & `npm`
- **Docker & Docker Compose**

### 2. Clone & Environment Setup
```bash
git clone https://github.com/peashdasrudra/DealSense.git
cd DealSense

# Copy environment variables template
cp .env.example .env
```

### 3. Start Infrastructure (PostgreSQL pgvector + Redis)
```bash
docker compose up -d
```

### 4. Run Backend & Test Suites
```bash
# Install Python dependencies
pip install -e apps/api -e apps/worker -e packages/scoring

# Run all 48 test suites
python -m pytest
```

### 5. Launch Web Dashboard
```bash
cd apps/web-dashboard
npm install
npm run dev
# Dashboard opens on http://localhost:3000/
```

---

## 📁 Monorepo Structure

```
DealSense/
├── apps/
│   ├── api/                  # FastAPI REST & SSE Gateway (OAuth, Webhooks, RLS)
│   ├── worker/               # Celery asynchronous worker hub for Redis Streams
│   ├── web-dashboard/        # React 18 / TypeScript 5 RevOps Command Center
│   └── hubspot-extension/    # Embedded HubSpot Canvas CRM Sidebar Card
├── packages/
│   ├── scoring/              # 7-Vector deterministic mathematical scoring engine
│   ├── contracts/            # TypeScript / Python shared schema contracts
│   └── prompts/              # Strict evidence extraction & MEDDICC prompt guardrails
├── infrastructure/
│   └── docker/               # Docker compose, PostgreSQL 16 pgvector init scripts
└── docs/                     # Architectural Decision Records (ADRs) & specifications
```

---

## 👨‍💻 Creator & Lead Architect

**Peash Das Rudra** — *Senior AI & Distributed Systems Architect*
- ✉️ Direct Outbound Email: [peashdasrudra@gmail.com](mailto:peashdasrudra@gmail.com)
- 📂 GitHub Repository: [github.com/peashdasrudra/DealSense](https://github.com/peashdasrudra/DealSense)
- 🌐 Live Application: [dealsense.peash.tech](https://dealsense.peash.tech)
- 📜 Architectural Case Study: [dealsense.peash.tech/case-study](https://dealsense.peash.tech/case-study)

---

## 📜 License & Intellectual Property

Proprietary Software. Copyright © 2026 Peash Das Rudra. All rights reserved. Available under commercial single-tenant and white-label agency deployment licenses.
