# Changelog

All notable changes to the **DealSense** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-09-08

### Added
- **Luxury Minimalist Sign In Screen (`AuthPage.tsx`):**
  - Atmospheric 28px dot matrix grid with radial mask falloff (`mask-image: radial-gradient(...)`).
  - Warm coral and teal ambient radial glows behind the central card.
  - Frosted glassmorphism card container (`backdrop-filter: blur(24px)`) with layered specular borders.
  - Jewel-grade lock security icon badge with subtle inner specular highlight.
  - High-definition HubSpot Coral OAuth button with dynamic spinning loader state.
  - Discrete enterprise trust indicators (256-Bit TLS, SOC2 Ready, Official HubSpot App Partner).
  - Minimalist top bar navigation with live ingestion status beacon and overview link.
- **Frosted Glass Segmented Control Tabs:**
  - Modern segmented control navigation in [`Settings.tsx`](file:///apps/web-dashboard/src/pages/Settings.tsx) and [`CaseStudy.tsx`](file:///apps/web-dashboard/src/pages/CaseStudy.tsx) with custom per-tab accent glows and subtle elevation shadows.
- **Real Avatar Profile Integration:**
  - Integrated high-resolution profile asset (`public/peash_avatar.jpg`) across desktop and mobile top bars with active presence beacons.
- **Mobile Bottom Navigation Telemetry:**
  - Synchronized red alert badges for Action Approval Queue and CRM Hygiene.
  - Thumb-friendly card reordering on mobile (e.g., swapping risk distribution with 12-month health diagnostics).

### Changed
- **Unified Enterprise Header Cards:**
  - Removed cluttering `.page-header-context` subtitles across all 19 pages for a sleek, uniform header presentation.
  - Configured `index.css` to hide `.page-header-context` across desktop and mobile breakpoints.
- **CTA Optimization:**
  - Streamlined hero buttons across Landing and Case Study pages to the 2 primary actions: **Install Free in HubSpot →** and **Claim Agency Discount**.
  - Updated Claim Agency Discount routing to land directly at the top of `/agency`.
- **Build & Dependency Verification:**
  - Verified full production build passing with 0 TypeScript or bundling errors (`tsc && vite build`).

---

## [1.1.0] - 2026-09-07

### Added
- **19 Enterprise RevOps Workspaces:**
  - **Deal War Room (`DealWarRoom.tsx`):** Executive closing command center with QBR decision matrix and single-threaded deal intervention triggers.
  - **CRM Hygiene Engine (`CrmHygiene.tsx`):** Automated data remediation for past-due close dates, missing economic buyers, and ghosted deals.
  - **Mutual Action Plans (`MutualActionPlan.tsx`):** Milestone alignment, legal/security sign-offs, and buyer commitments.
  - **Action Approval Queue (`ActionQueue.tsx` & `HubSpotNativeActionQueue.tsx`):** Human-in-the-loop review board for automated batch actions.
  - **Autonomous RevOps Playbooks (`RevOpsPlaybooks.tsx` & `HubSpotNativePlaybooks.tsx`):** Conditional policy triggers for automatic deal rescue.
  - **Multi-Model Revenue Forecasting (`RevenueForecast.tsx`):** Scenario simulation engine (Conservative, Base, Aggressive) with deterministic reality checks.
  - **Competitive Intelligence (`CompetitiveIntelligence.tsx`):** Win/loss forensics, objection response engine, and battlecards.
  - **Client Health & Retention Radar (`ClientHealth.tsx`):** NRR cohort tracking, product usage health, and AI churn early warning signals.
  - **Pipeline Waterfall Diagnostic (`PipelineWaterfall.tsx`):** Funnel leak detection and stage transition velocity telemetry.
  - **AE Velocity & Coaching Dossiers (`RepPerformance.tsx`):** AE deal pacing, win rate analytics, and personalized coaching playbooks.
  - **SOC2 Governance Audit Trail (`AuditLog.tsx`):** Immutable log of telemetry runs, OAuth authentications, and HubSpot write-backs.
  - **Agency Partner Fleet Portal (`AgencyFleet.tsx`):** Multi-portal management for HubSpot Diamond and Elite agencies.
- **HubSpot App Marketplace Submission Package:**
  - App Marketplace listing description, audit checklist, data handling disclosures, demo video scripts, and setup guides in `docs/marketplace/`.

---

## [1.0.0] - 2026-09-05

### Added
- **Initial DealSense MVP Release:**
  - Custom OAuth 2.0 flow with state CSRF verification for HubSpot portal installation.
  - 7-vector deterministic deal risk scoring engine.
  - Native HubSpot CRM UI extension with React cards.
  - FastAPI asynchronous backend with multi-tenant `TenantGuardMiddleware`.
  - Redis async caching layer deflecting up to 85% of redundant HubSpot API calls.
  - PostgreSQL schema with `pgvector` for embedding support.
  - Vercel and Render deployment configurations.
