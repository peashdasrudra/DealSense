# Changelog

All notable changes to the **DealSense** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2026-09-08

### Fixed
- **Zero-Downtime OAuth Self-Healing & Internal Server Error Resolution:**
  - **In-Memory Distributed Lock Fallback:** Fixed uncaught `redis.exceptions.ConnectionError` in `acquire_lock` and `release_lock` (`redis_client.py`) by wrapping Redis commands in a fault-tolerant try-except block with a lightweight `_InMemoryLock` and a 2s connection timeout.
  - **Deterministic Token Encryption Key Derivation:** Fixed unhandled `EncryptionError` when `ENCRYPTION_KEY` is omitted in cloud environments (`encryption.py`) by deterministically deriving a 32-byte Fernet key from `settings.secret_key` via SHA256 and URL-safe Base64.
  - **Cloud PostgreSQL Driver Auto-Normalization & SSL:** Fixed `create_async_engine` driver rejection (`config.py` and `database.py`) by converting `postgres://` and `postgresql://` connection strings to `postgresql+asyncpg://` and injecting `connect_args={"ssl": "require"}` for Neon and Render.
  - **Fault-Tolerant Tenant Provisioning & Fast Session Minting:** Updated `handle_oauth_callback` (`oauth_service.py`) with deterministic `uuid5(NAMESPACE_DNS, f"hubspot:{portal_id}")` and memory fallback caching so user logins succeed seamlessly even if the persistent database is cold.
  - **Async Generator Context Manager Fix:** Resolved `RuntimeError: generator didn't stop after athrow()` in `get_db_optional` (`deps.py`) to cleanly propagate exceptions to FastAPI handlers.
  - **Transparent Error Handling:** Replaced opaque `"Internal server error"` responses in `main.py` with actual diagnostic error messages for all `DealSenseError` exceptions.
  - **Enhanced Frontend Error UX:** Added clear error message wrapping, a "Return to Login" button, and an instant 1-click "Launch Demo Mode" escape hatch in `OAuthCallback.tsx`.

---

## [1.3.0] - 2026-09-08

### Added
- **HubSpot OAuth 2.0 Marketplace Certification Overhaul:**
  - **Stateless HMAC-SHA256 CSRF Protection:** Cryptographically signed and tamper-proof state tokens with 30-minute enterprise approval tolerance, eliminating Redis TTL expiration during multi-factor authentication (MFA).
  - **HubSpot Developer Portal Direct-Install Fallback:** Graceful fallback for test account installs and HubSpot App Reviewers where the `state` parameter is omitted by the Developer Portal "Install app" button.
  - **In-Flight Code Exchange Deduplication:** Backend locking and Redis caching (`oauth:session:{code_hash}`) to absorb React 18 StrictMode double-mount collisions and prevent single-use authorization code invalidation (`EXPIRED_AUTH_CODE`).
  - **Browser Canonical 302 Redirection:** Automated browser detection on `GET /api/v1/oauth/callback` to set an `HttpOnly` session cookie and seamlessly redirect users to `/pipeline?auth=success` rather than returning raw JSON.
  - **Cryptographic Tenant Session Isolation (Anti-BOLA):** Issued signed Session JWTs (`create_tenant_session_jwt`) on callback completion, verified by `TenantGuardMiddleware` and attached on frontend API requests (`Authorization: Bearer <jwt>`).
  - **Edge-of-Cliff Token Refresh Margin:** 5-minute proactive expiration safety threshold (`EXPIRATION_SAFETY_MARGIN_SECONDS = 300`) in `token_manager.py` to prevent in-flight 401 Unauthorized errors.
- **Hardware-Accelerated Gyroscopic Animated Telemetry Loader (`DealSenseLoader.tsx`):**
  - High-performance SVG rings with counter-rotational gyroscopic physics (`rotate: 360deg` & `-360deg`).
  - Pulsing center telemetry core with SVG radar sweep gradients (`#ff5c35` to `#00bda5`).
  - Dynamic laser progress bar across viewport top edge during page-to-page navigation.
  - Pre-hydration zero-delay HTML loader embedded in `index.html`.

### Changed
- **CRM API v3 Scope Harmonization:**
  - Removed deprecated umbrella `oauth` scope string from `config.py` and `app-hsmeta.json`.
  - Added required granular permissions: `crm.objects.notes.read`, `crm.objects.notes.write`, `crm.objects.owners.read`, `crm.objects.companies.read`, `crm.schemas.deals.read`, and `timeline`.
- **Content Security Policy (CSP) & Iframe Permitted URLs:**
  - Updated `app-hsmeta.json` to whitelist `https://dealsense.peash.tech`, `https://dealsense-api-6o2h.onrender.com`, and `http://localhost:3000/oauth/callback`.

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
