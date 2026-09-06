# DealSense Data Handling & Security Disclosure

**For HubSpot App Marketplace Security Review**

## 1. Authentication & Authorization
DealSense uses OAuth 2.0 exclusively for all HubSpot authentication. 
- **Token Storage**: OAuth access and refresh tokens are encrypted at rest in our PostgreSQL database using AES-256-GCM.
- **Tenant Isolation**: Row-Level Security (RLS) is enforced at the database level ensuring strict portal-to-portal data isolation.

## 2. Scopes Requested
- `crm.objects.deals.read` / `write`: To ingest deal telemetry and execute approved CRM write-backs (like creating follow-up tasks).
- `crm.objects.contacts.read` / `crm.objects.companies.read`: To analyze stakeholder coverage and engagement.
- `crm.schemas.deals.read`: To dynamically adapt to custom pipeline stages.
- `timeline` (optional): To insert custom timeline events for risk alerts.

## 3. Data Processing & Storage
- **What we store**: We store deal IDs, stage information, timestamp metadata, and computed health scores in PostgreSQL.
- **PII Handling**: Contact data (names/emails) is only processed in memory to compute "engagement frequency" and is not persisted in our long-term logs unless explicitly required for a recommended action payload (which is ephemeral).
- **Webhooks**: We subscribe to deal creation/deletion/property changes. Incoming webhooks are verified using `X-HubSpot-Signature-v3`, deduplicated via Redis, and processed asynchronously.

## 4. App Lifecycle & GDPR
- **app.deactivated**: Handled via standard webhook and our `/api/v1/lifecycle/uninstall` endpoint. Upon receipt, we revoke OAuth tokens and mark the tenant as disconnected.
- **contact.privacyDeletion**: Handled via our `/api/v1/lifecycle/gdpr-delete` endpoint. This triggers an immediate purge of any cached PII for the specified contact ID across our Redis cache and PostgreSQL records.

## 5. Security & Rate Limiting
- The backend API (`https://dealsense-api-6o2h.onrender.com`) operates strictly over HTTPS (TLS 1.2+).
- Rate limits are actively communicated via standard `X-RateLimit-*` HTTP response headers.
- Security headers (`Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`) are applied to all API responses.
