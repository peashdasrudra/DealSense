<div align="center">
  <img src="docs/assets/logo_icon.png" width="120" alt="DealSense Logo" />
  <h1>DealSense Intelligence Platform</h1>
  <p><strong>Enterprise-Grade Autonomous Revenue Intelligence for the HubSpot Ecosystem</strong></p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/HubSpot-Marketplace_Ready-ff7a59?style=for-the-badge&logo=hubspot&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.103.1-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Redis-Async_Cache-dc382d?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/OAuth_2.0-Secure-blue?style=for-the-badge" />
</p>

---

## 🎯 Executive Overview

**DealSense** is a next-generation RevOps Copilot built specifically for the HubSpot CRM ecosystem. Designed for high-volume sales agencies and enterprise SaaS teams, it injects autonomous **MEDDICC qualification**, **pipeline velocity tracking**, and **deal health telemetry** directly into the HubSpot UI.

This repository serves as a **Top 1% architectural reference** for building scalable, multi-tenant HubSpot Marketplace applications. It demonstrates advanced integration techniques, including native CRM Cards, Iframe Modals, OAuth 2.0 flows, and robust backend isolation.

---

## 🏢 Business Value & Use Cases (Why DealSense?)

For a RevOps CTO or Sales Director, raw data isn't enough. DealSense transforms CRM data into actionable intelligence:
- **Zero-Friction Adoption:** Sales reps never leave HubSpot. Insights are served directly on the Deal Record via native CRM Extensions.
- **MEDDICC Enforcement:** Automatically grades deals against the MEDDICC framework (Metrics, Economic Buyer, Decision Process, etc.) to identify pipeline gaps early.
- **Pipeline Hygiene & Slippage Defense:** Tracks historical push counts and days-in-stage to flag at-risk revenue before the end of the quarter.
- **AI-Powered "Next Best Action":** Context-aware Copilot drafting CFO justification emails, analyzing competitor weaknesses, and suggesting meeting agendas.

---

## 🏗️ Enterprise Architecture & Technical Depth

DealSense is built on a decoupled, hyper-scalable architecture designed to handle thousands of concurrent tenant API rate limits without throttling.

### 1. The Backend (FastAPI + Redis + PostgreSQL)
- **Multi-Tenant Isolation:** Enforced via a custom `TenantGuardMiddleware`. Every API request is strictly scoped to the `X-Admin-Tenant-ID` extracted from validated JWTs, ensuring zero cross-tenant data leakage.
- **Resiliency & Caching:** Heavy HubSpot API calls (e.g., retrieving associated contacts/line items) are cached using `redis.asyncio` with strict TTLs to optimize API quota consumption and ensure sub-100ms P99 latencies.
- **Marketplace Compliance:** Full OAuth 2.0 implementation with automatic token refresh cycles and `gdpr.delete` webhook listeners for seamless Marketplace security approval.

### 2. The Frontend Dashboard (React + Vite + Fluid CSS Grid)
- **Responsive Master-Detail UI:** The standalone dashboard utilizes a fluid CSS Grid architecture that effortlessly transitions from an expansive desktop Command Center to a native-feeling mobile app layout without horizontal overflow.
- **Dual-Mode Authentication:**
  - **Demo Mock Mode:** Unauthenticated users immediately see rich, interactive mocked enterprise data—perfect for sales collateral and investor demos.
  - **Single-Server Admin Override:** Securely bypass OAuth during development using an Admin API Key (`X-Admin-Key`) to inspect live production metrics.

### 3. HubSpot CRM Native UI Extension
- **React-based UI Extensions:** Built using the new `@hubspot/ui-extensions` framework (`hs project`).
- **Native Context Modals:** Migrated away from jarring `window.open` popups to seamless, sandboxed `actions.addIframeModal` flows, keeping the user strictly within the HubSpot Canvas environment.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+ & pnpm
- Python 3.11+
- Redis Server (Running on `localhost:6379`)
- HubSpot Developer Account

### 1. Start the API Service
```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cp .env.example .env
# Configure REDIS_URL, DATABASE_URL, and HUBSPOT_CLIENT_ID in .env
uvicorn dealsense.main:app --reload
```

### 2. Start the Master-Detail Web Dashboard
```bash
cd apps/web-dashboard
pnpm install
pnpm dev
```
Navigate to `http://localhost:3000`. Use the **Admin Login** via the top-right profile avatar to authenticate with your local API key.

### 3. Deploy the HubSpot UI Extension
```bash
cd apps/hubspot-app
pnpm install
hs auth # Authenticate with your Developer Portal
hs project upload
```

---

## 🔐 Security & Marketplace Rigor

This application is strictly engineered to pass HubSpot's App Marketplace security audits:
- **No Hardcoded Secrets:** All OAuth secrets, keys, and DB credentials are securely injected via environment variables.
- **GDPR Webhook Ready:** Implements the required endpoints to handle contact deletion requests instantly.
- **State Parameter Validation:** OAuth flows utilize cryptographically secure `state` parameters to prevent CSRF attacks during portal installation.

---

## 🤝 Contributing

We maintain strict Top 1% developer standards. All PRs must pass the CI pipeline, which enforces:
- **ESLint & Prettier** for all TypeScript code.
- **Ruff & Mypy** for all Python code.
- **Conventional Commits** for clean changelog generation.

See the [Contributing Guide](./CONTRIBUTING.md) and [Architecture Docs](./docs/ARCHITECTURE.md) for more details.

## 📄 License
MIT License - See [LICENSE](./LICENSE) for details.
