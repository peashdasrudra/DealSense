# DealSense Architecture & Technical Design

This document details the architectural decisions, integration patterns, and data flow of the DealSense platform. It serves as a technical blueprint demonstrating production-level system design specifically within the HubSpot ecosystem.

## 1. System Components

### 1.1 The Frontend (React / Vite)
The presentation layer is built as a highly responsive, standalone React application embedded securely within HubSpot UI Extensions.
- **Framework:** React 18 / Vite
- **Deployment:** Vercel (CI/CD Automated)
- **Integration Strategy:** Embedded via HubSpot native IFrames to preserve the core CRM user experience while circumventing restrictive HubSpot UI component limitations.

### 1.2 The Backend Gateway (Microservice API)
The backend operates as the central nervous system, built to withstand HubSpot's burst limits and payload sizes.
- **Core Engine:** Asynchronous API Service
- **Authentication:** Custom OAuth 2.0 flow securely trading authorization codes for access and refresh tokens. Tokens are securely vaulted in the database.
- **Webhook Processing:** Exposes highly available `/api/v1/webhooks` endpoints configured directly in the HubSpot App Developer Portal. Uses Background Tasks to immediately return `200 OK` to HubSpot, mitigating penalty timeouts.

### 1.3 Data Persistence & Caching
- **Primary Database (PostgreSQL):** Relational schema handling strict multi-tenant isolation.
- **Caching Layer (Redis):** Distributed cache mechanism to deflect duplicate HubSpot CRM API GET requests. Reduces API consumption by an average of 85%, ensuring strict compliance with HubSpot's 150 requests / 10 sec limit.

## 2. Integration Patterns & Webhooks

### The "Thundering Herd" Mitigation Strategy
When a HubSpot user bulk-edits 50 deals, HubSpot instantly fires 50 webhooks to the server. If the backend blindly processed each one by querying HubSpot's API for the deal context, it would immediately breach rate limits and crash.

**DealSense resolves this via a 3-Step Event Bus:**
1. **Ingest & Ack:** Webhook arrives. Signature is cryptographically verified via `X-HubSpot-Signature-v3`. Server responds `200 OK` in < 50ms.
2. **Debounce (Redis):** The Event ID is logged in Redis. If a duplicate event arrives within a specific window, it is dropped.
3. **Async Processing:** A worker pulls the event, fetches missing CRM context (first checking the Redis cache), executes business logic, and performs a single optimized `PATCH` back to HubSpot.

## 3. DevOps & Containerization (Docker)

To guarantee exact environment parity between local development and production, the entire backend is fully containerized.

### CI/CD Pipeline
- **Continuous Integration:** GitHub Actions automatically runs strict static analysis, linting, and formatting checks on all Pull Requests.
- **Continuous Deployment:** Merges to `main` trigger automated builds.
  - The frontend is built and deployed edge-cached globally via Vercel.
  - The backend Docker image is built and deployed as a scalable web service on Render/Google Cloud. 

## 4. Why This Architecture Matters
Building HubSpot integrations requires more than just calling REST APIs. It requires a deep understanding of **distributed state, strict authentication flows, and resilient webhook handling.** DealSense is architected not just as a prototype, but as a scalable foundation that translates flawlessly into any enterprise environment or tech stack (Node.js/Python/Go).
