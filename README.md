<div align="center">
  <img src=docs/assets/logo_icon.png width="100" />
  <h1>DealSense Intelligence Platform</h1>
  <p><strong>Enterprise-Grade Autonomous Revenue Intelligence for the HubSpot Ecosystem</strong></p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/HubSpot-Marketplace_Ready-ff7a59?style=for-the-badge&logo=hubspot&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.103.1-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react&logoColor=black" />
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="License"></a>
  <a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome"></a>
  <a href="./CODE_OF_CONDUCT.md"><img src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=for-the-badge" alt="Contributor Covenant"></a>
</p>

---

DealSense is a Top 1% developer repository showcasing a native, multi-tenant HubSpot integration. It combines a highly scalable asynchronous FastAPI backend with a beautiful, premium glassmorphic React dashboard and a seamless native HubSpot CRM UI extension.

## 🌟 Key Features

- **Dual-Mode Authentication:**
  - **Demo Mock Mode:** Unauthenticated visitors experience a highly polished, interactive mockup of the enterprise dashboard without requiring a CRM connection.
  - **Single Server Admin:** Operators can securely bypass the OAuth flow using an Admin API Key to view live production metrics.
- **Enterprise UI/UX:** Built with Framer Motion and custom Canvas Design System aesthetics for a 100% native HubSpot feel.
- **Robust Multi-Tenancy:** A custom `TenantGuardMiddleware` enforcing strict row-level isolation across all API endpoints.
- **Marketplace Ready:** Complete with `hsmeta.json` definitions, optimized scopes, and a one-click deployment pipeline for the HubSpot App Marketplace.

## 🏗️ Architecture

For a detailed breakdown of the system components, data layers, and the dual-mode authentication flow, please read the [Architecture Documentation](./docs/ARCHITECTURE.md).

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+ & pnpm
- Python 3.11+
- PostgreSQL (with pgvector extension)
- HubSpot Developer Account

### 1. Start the API Service
```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cp .env.example .env
# Update .env with your local Postgres URL and Admin API Key
uvicorn dealsense.main:app --reload
```

### 2. Start the Web Dashboard
```bash
cd apps/web-dashboard
pnpm install
pnpm dev
```
Navigate to `http://localhost:3000` to view the Demo Mode dashboard.

### 3. Deploy the HubSpot UI Extension
```bash
cd apps/hubspot-app
pnpm install
hs auth # Authenticate with your developer portal
hs project upload
```

## 🔐 Authentication & Marketplace

DealSense uses a robust OAuth 2.0 flow for Marketplace installs. Upon installation, the API securely stores the `access_token` and `refresh_token` associated with the generated `tenant_id`.

To test the **Admin API Key** flow locally:
1. Open the Web Dashboard.
2. Click the **Admin Login (API Key)** button in the top right profile dropdown.
3. Enter your configured `ADMIN_API_KEY` from the backend `.env`.

## 🤝 Community & Contributing

We welcome contributions from the community! To maintain our top 1% developer repository standard, please review the following guidelines:

- **[Contributing Guide](./CONTRIBUTING.md)**: Instructions for local development, linting, and submitting Pull Requests.
- **[Code of Conduct](./CODE_OF_CONDUCT.md)**: Our pledge to maintain a welcoming, inclusive environment.
- **[Security Policy](./SECURITY.md)**: How to responsibly disclose security vulnerabilities.
- **[Changelog](./CHANGELOG.md)**: Track all notable changes to the DealSense platform.

This project enforces strict linting (ESLint, Prettier for TS/JS; Ruff, Mypy for Python). All PRs must pass the CI pipeline and use our standard templates before merging.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---
<div align="center">
  <i>Built for the modern RevOps architecture.</i>
</div>
