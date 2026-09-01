# DealSense — Task Tracker

## Batch 1: Foundation — Monorepo, FastAPI, Database, Docker ✅
- `[x]` Root project files (README, Makefile, pyproject.toml, .gitignore, .env.example)
- `[x]` Docker infrastructure (docker-compose.yml, Dockerfiles, init-db.sql)
- `[x]` FastAPI application skeleton (main.py, config.py, deps, middleware)
- `[x]` Domain models (SQLAlchemy ORM — all 14 core tables)
- `[x]` Domain enums, events, exceptions
- `[x]` Infrastructure layer (database.py, redis_client.py, queue.py, encryption.py, observability.py)
- `[x]` API v1 router + health check endpoint + common schemas
- `[x]` Alembic migrations setup (env.py, script template, alembic.ini)
- `[x]` Architecture Decision Records (5 ADRs)
- `[x]` CI Pipeline (.github/workflows/ci.yml)
- `[x]` Tests (health check, config, enums, exceptions, encryption, domain events)
- `[x]` Verify: 17/17 tests passing ✅

## Batch 2: OAuth, Tenant Model, Token Security ✅
- `[x]` Token manager (encryption, caching, distributed lock, refresh, failure circuit breaker)
- `[x]` Webhook signature verification (v1 SHA256, v3 HMAC-SHA256, replay protection)
- `[x]` Tenant guard middleware (mandatory isolation, exempt paths, status validation)
- `[x]` RBAC roles and permissions (23 permissions, 6 roles, dependency guards)
- `[x]` Audit logging service (`record_audit_event`)
- `[x]` OAuth service (state generation, callback code exchange, tenant upsert, token storage, disconnect)
- `[x]` OAuth endpoints (authorize, callback GET/POST, status, refresh, disconnect)
- `[x]` Tests (token storage/encryption, cache hit, invalidation, signature v1/v3, replay detection, RBAC, tenant guard)
- `[x]` Verify: 29/29 tests passing ✅

## Batch 3: Webhook Gateway + Event Pipeline ✅
- `[x]` HubSpot API client (async CRM v3, automatic token resolution, exponential backoff retries on 429/5xx)
- `[x]` Webhook schemas (`HubSpotWebhookEvent`, `WebhookIngestResponse`)
- `[x]` Webhook service (signature verification, 24h Redis idempotency deduplication, tenant lookup, database persistence, Redis Streams queue publication)
- `[x]` Webhook endpoint (`POST /api/v1/webhooks/hubspot` fast ACK)
- `[x]` Worker ingestion task (`process_stream_event` normalizing deals, persons, activities, stage transitions)
- `[x]` Worker event processing loop (`dealsense_worker.app` with Redis Streams consumer groups, retries, and DLQ routing)
- `[x]` Tests (webhook ingestion 200, duplicate skipping, stage transition history tracking, contact normalization, client token injection)
- `[x]` Verify: 34/34 tests passing ✅

## Batch 4: CRM Data Model + Deterministic Risk Scoring ✅
- `[x]` Scoring engine with 7 signals in `packages/scoring` (Stage aging, Engagement decay, Stakeholder gap, Commitment quality, Date slippage, CRM hygiene, Historical similarity)
- `[x]` 100% deterministic scoring logic (0-100 score range, 5 risk bands, top signals ranking)
- `[x]` Snapshot/scoring service (`dealsense.services.scoring_service` with delta tracking and active snapshot management)
- `[x]` Deals & Snapshot API endpoints (`GET /deals/{id}`, `GET /deals/{id}/snapshot`, `POST /deals/{id}/score`, `GET /deals/{id}/signals`)
- `[x]` Evaluation dataset seed (`packages/evals/datasets/scoring/deal_scenarios.jsonl`)
- `[x]` Tests (7 signal rules, 100x determinism invariance, benchmark dataset validation, snapshot persistence & REST endpoints)
- `[x]` Verify: 41/41 tests passing ✅

## Batch 5: Hybrid RAG + LLM Extraction + Recommendations ✅
- `[x]` Text chunking & vector embedding pipeline (`dealsense.services.embedding_service`)
- `[x]` Hybrid retrieval service (`dealsense.services.retrieval_service` with pgvector cosine distance, keyword search, Reciprocal Rank Fusion, and strict tenant isolation)
- `[x]` Versioned prompt templates in `packages/prompts` (MEDDICC extraction, risk explanation, recommendation generation)
- `[x]` Structured LLM extraction service (`dealsense.services.llm_service` with MEDDICC parsing and evidence-based abstention policy)
- `[x]` Next-best-action recommendation engine (`dealsense.services.recommendation_service` with action tiers 1-4 and heuristic fallbacks)
- `[x]` Evaluation datasets (`meddicc_samples.jsonl`, `action_samples.jsonl`)
- `[x]` Tests (chunking, hybrid RRF search, MEDDICC abstention on empty evidence, tiered action generation)
- `[x]` Verify: 46/46 tests passing ✅

## Batch 6: LangGraph Analysis Workflow ✅
- `[x]` LangGraph analysis state schema (`DealAnalysisState`)
- `[x]` Analysis workflow engine (`dealsense_worker.workflows.deal_analysis` with 7 sequential graph nodes)
- `[x]` Snapshot, signal, and `ActionProposal` persistence
- `[x]` Worker analysis task (`run_deal_analysis`) with `analysis.completed` event publication
- `[x]` Trigger analysis endpoint (`POST /api/v1/deals/{deal_id}/analyze`)
- `[x]` Tests (end-to-end 7-node graph execution, state transitions, proposal generation, REST trigger)
- `[x]` Verify: 48/48 tests passing ✅

## Batch 7: HubSpot UI Extension (Deal Sidebar Card) ✅
- `[x]` Shared TypeScript contracts (`@dealsense/contracts`)
- `[x]` HubSpot Developer Project setup (`app.json`, `vite.config.ts`)
- `[x]` Premium CSS design system (`global.css` with glassmorphism)
- `[x]` React Components (HealthGauge, MeddiccMatrix, RiskSignals, ActionCards, SkeletonLoader, ErrorState)
- `[x]` Orchestration (`DealSenseCard.tsx`)

## Batch 8: Agency Command Center + Write-Backs ✅
- `[x]` Shared TypeScript contracts integration
- `[x]` Write-Back API implementation (`POST /actions/{id}/execute`, `POST /actions/{id}/rollback`, `POST /actions/{id}/decision`)
- `[x]` Dashboard Vite setup (`vite.config.ts`)
- `[x]` Premium Dashboard CSS (`index.css` with ambient glows and animations)
- `[x]` React Pages (App Shell, Portfolio Overview, Client Health, Risk Heatmap, Action Queue)
- `[x]` Recharts integration for data visualization
