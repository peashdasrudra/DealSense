# Technical Screenshare Walkthrough (The Proof)
*Keep this document open on your second monitor during the interview. Follow these exact steps to visually demonstrate your backend mastery.*

## Prep Checklist (Before the Call)
- [ ] Open the [DealSense GitHub Repository](https://github.com/peashdasrudra/DealSense) in a tab.
- [ ] Open your live frontend: `https://dealsense.peash.tech/deals`
- [ ] Open your live backend Swagger Docs: `https://dealsense-api-6o2h.onrender.com/docs`
- [ ] Have your code editor open to `apps/api/src/dealsense/services/webhook_service.py`

---

## Step 1: The UI & Integration Reveal
**"Before we look at the backend architecture, let me show you the product it powers."**

1. Share your screen and show **`dealsense.peash.tech/deals`**.
2. **Action:** Click around the Dashboard and the Action Queue. 
3. **Script:** 
   > *"This is DealSense. It's a React/Vite SPA hosted on Vercel. What you're seeing here isn't mock data—this is dynamically pulling from my live HubSpot Developer Portal using a two-way synchronization engine I built in FastAPI. The frontend is fully responsive and uses modern state management, but the real magic is what's happening on the server."*

---

## Step 2: The API & Schema Architecture
**"Let me show you how I structure my backend schemas and endpoints."**

1. Switch tabs to the **Live Swagger Documentation**: `https://dealsense-api-6o2h.onrender.com/docs`
2. **Action:** Expand the `GET /api/v1/deals` and `POST /api/v1/actions/{action_id}/execute` endpoints. Show them the Pydantic schemas.
3. **Script:** 
   > *"I don't just hack together endpoints. I use FastAPI with strict Pydantic data validation. You can see my `DealDashboardSchema` and `ActionProposalResponse` schemas here. By strictly typing the inputs and outputs, I eliminate an entire class of runtime errors before they ever hit the database. The API is entirely self-documenting and adheres to OpenAPI 3.0 standards, which is exactly how enterprise backend teams operate."*

---

## Step 3: Demonstrating Security & Cryptography (The Kill Shot)
**"Anyone can hit a REST API. Let me show you how I handle security and HubSpot Webhooks."**

1. Switch to your Code Editor (VS Code / Cursor).
2. **Action:** Open `apps/api/src/dealsense/services/webhook_service.py` and scroll to line ~85 (where `verify_hubspot_signature` is defined).
3. **Script:** 
   > *"This is my webhook payload verifier. When HubSpot sends a payload, we cannot blindly trust it. I implemented the HubSpot v3 HMAC-SHA256 signature verification. 
   > 
   > Notice how I extract the `X-HubSpot-Signature-v3` and `X-HubSpot-Request-Timestamp`. I concatenate the HTTP method, the URI, the raw payload body, and the timestamp, then hash it using the App Secret. If the hash doesn't match perfectly, the request is immediately dropped with a 401 Unauthorized. 
   > 
   > Also, notice this line where I check the timestamp drift: If a malicious actor captures a valid webhook and tries to replay it 5 minutes later, the backend drops it to prevent replay attacks."*

---

## Step 4: Multi-Tenancy & Token Encryption
**"Let's look at how I protect client OAuth credentials."**

1. **Action:** Open `apps/api/src/dealsense/security/tenant_guard.py` and then `apps/api/src/dealsense/infrastructure/encryption.py`.
2. **Script:** 
   > *"In an agency environment, cross-tenant data leakage is a massive liability. I built a `TenantGuardMiddleware` that intercepts every single API request, validates the JWT, and enforces the `X-Tenant-ID`.
   >
   > But more importantly, look at the encryption module. When a client authenticates via OAuth 2.0, I never store their Refresh Tokens as plain text. I use AES-256 Fernet symmetric encryption. Even if someone gained direct read-access to the Postgres database, the tokens are cryptographically useless without the master environment key."*

---

## Step 5: Rate Limiting & Resilience
**"Finally, let me show you how I handle HubSpot's API limits."**

1. **Action:** Open `apps/api/src/dealsense/infrastructure/hubspot_client.py`.
2. **Script:**
   > *"HubSpot will ban your app if you exceed 100 requests per 10 seconds. In my `HubSpotClient`, I've implemented a robust rate-limiter using Redis for distributed locking, along with full exponential backoff and jitter. If I hit a 429 Too Many Requests, the system gracefully sleeps and retries rather than crashing the worker pipeline."*

---

## The Closing Move

Stop sharing your screen. Look directly into the camera.

> *"I know my resume says < 1 year of experience. But the code I just showed you is what mid-to-senior backend engineers at top tech companies write. I understand the HubSpot ecosystem, I understand distributed backend architecture, and I can take ownership of your custom integrations on Day 1. What's the next step in the process?"*
