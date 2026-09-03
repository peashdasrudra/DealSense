# 🚀 DealSense — Enterprise & Free Client Cloud Deployment Guide

This guide covers how to deploy the entire **DealSense** production ecosystem for real clients for **$0/month** on both Modern Serverless Cloud and Dedicated Linux VPS.

---

## 🗺️ Choose Your Deployment Strategy

| Strategy | Architecture | Monthly Cost | Setup Time | Best For |
|:---|:---|:---:|:---:|:---|
| **Option 1: Modern Serverless Cloud** | Vercel (UI) + Neon (Postgres pgvector) + Upstash (Redis Streams) + Render (FastAPI) | **$0.00** | ~10 min | Agency clients wanting hands-off zero server maintenance |
| **Option 2: Dedicated Cloud VPS (1-Command)** | Caddy (Auto SSL) + Nginx (UI) + FastAPI + Celery + PostgreSQL 16 + Redis 7 via Docker Compose | **$0.00** | ~5 min | Oracle Cloud Always Free (24GB RAM) or Client's Own Linux VPS |

---

# ⚡ Option 1: Modern Serverless Cloud ($0/Month)

### 1. Database: Neon.tech (PostgreSQL 16 + pgvector)
1. Sign up at [neon.tech](https://neon.tech) (Free tier: 0.5GB storage, 100% free forever).
2. Create project `dealsense-production`, select Postgres 16.
3. In Neon SQL Editor, enable extensions:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```
4. Copy the connection string:
   `postgresql+asyncpg://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?ssl=require`

### 2. Streaming Queue: Upstash Redis
1. Sign up at [upstash.com](https://upstash.com) (Free tier: 10,000 commands/day, zero sleep).
2. Create a regional Redis database named `dealsense-queue` (enable TLS).
3. Copy the `REDIS_URL`: `rediss://default:token@your-host.upstash.io:6379`.

### 3. Backend API & Celery Worker: Render.com
1. Sign up at [render.com](https://render.com) (Free Web Service).
2. Connect your GitHub repository (`peashdasrudra/DealSense`).
3. Set **Runtime** to `Python 3`.
4. Build Command: `pip install -e packages/scoring && pip install -e apps/api`
5. Start Command: `uvicorn dealsense.main:app --host 0.0.0.0 --port $PORT --workers 2`
6. Add Environment Variables:
   - `HUBSPOT_ACCESS_TOKEN`: `pat-...` (from HubSpot Developer Private App)
   - `SECRET_KEY`: `your_random_64_char_key`
   - `ENCRYPTION_KEY`: `your_fernet_key`
7. Click **Create Web Service**. Your API will be live at `https://dealsense-api-6o2h.onrender.com`.

### 4. Web Dashboard: Vercel
1. Sign up at [vercel.com](https://vercel.com).
2. Import `DealSense` repo ➔ set **Root Directory** to `apps/web-dashboard`.
3. Add Environment Variable:
   - `VITE_API_URL`: `https://dealsense-api-6o2h.onrender.com`
4. Click **Deploy**. Attach your client's custom domain (e.g. `dealsense.peash.tech`). Vercel provisions free Let's Encrypt SSL automatically.

---

## 🌐 Active Live Production Deployments

| Component | Production URL | Status | Notes |
|:---|:---|:---:|:---|
| **Web Dashboard** | [https://dealsense.peash.tech](https://dealsense.peash.tech) | 🟢 Live | Hosted on Vercel Edge with zero-CORS API rewrite |
| **API Backend** | [https://dealsense-api-6o2h.onrender.com](https://dealsense-api-6o2h.onrender.com) | 🟢 Live | Python 3 Native FastAPI on Render |
| **Health Probe** | `https://dealsense-api-6o2h.onrender.com/api/v1/health` | 🟢 HTTP 200 | Uptime monitor & load balancer probe |
| **HubSpot Webhook** | `https://dealsense-api-6o2h.onrender.com/api/v1/webhooks/hubspot` | 🟢 HTTP 200 | Verified HubSpot Deal Event Subscription |
| **Deals CRM Sync** | `https://dealsense-api-6o2h.onrender.com/api/v1/deals` | 🟢 HTTP 200 | Live Bi-directional HubSpot CRUD & Scoring |

---

# 🏢 Option 2: Dedicated Cloud VPS (1-Command Turnkey Deployment)

Use this option on your client's existing Ubuntu/Debian VPS or an **Oracle Cloud Always Free Instance** (4 ARM OCPUs, 24GB RAM, 200GB SSD for $0 forever).

### 1. Server Initialization
SSH into the server:
```bash
ssh root@your_client_server_ip
```
Install Docker & Git:
```bash
apt-get update && apt-get install -y git curl docker.io docker-compose-plugin
systemctl enable --now docker
```

### 2. Clone Repository & Configure `.env.production`
```bash
git clone https://github.com/peashdasrudra/DealSense.git /opt/dealsense
cd /opt/dealsense

cp .env.production.example .env.production
nano .env.production
```
Set your client's custom domain (e.g., `DOMAIN=dealsense.clientdomain.com`), passwords, and HubSpot credentials.

### 3. Launch the Complete Production Stack
```bash
docker compose --env-file .env.production -f infrastructure/docker/docker-compose.prod.yml up -d --build
```
This automatically boots:
- **Caddy Reverse Proxy**: Automatically procures and renews Let's Encrypt SSL certificates for your domain on port 80/443.
- **Web Dashboard**: High-performance compiled Nginx container.
- **FastAPI Backend**: Multi-worker asynchronous API on port 8000.
- **Celery Worker**: Background task and streaming worker.
- **PostgreSQL 16**: With `pgvector` and Row-Level Security.
- **Redis 7**: Password-protected streaming queue.

### 4. Run Initial Database Migrations
```bash
docker compose -f infrastructure/docker/docker-compose.prod.yml exec api alembic upgrade head
```

---

# 🔗 HubSpot Developer App & Webhook Setup

1. **Create HubSpot App**:
   - In [HubSpot Developer Portal](https://developers.hubspot.com), click **Create App** (`DealSense Revenue Intelligence`).
   - Redirect URL: `https://dealsense.clientdomain.com/api/v1/auth/hubspot/callback`
   - Scopes: `crm.objects.deals.read`, `crm.objects.deals.write`, `crm.objects.contacts.read`, `timeline`.
2. **Sub-200ms Webhooks**:
   - Webhook URL: `https://dealsense.clientdomain.com/api/v1/webhooks/hubspot`
   - Subscribe to: `deal.creation`, `deal.propertyChange`, `deal.deletion`.
3. **HubSpot Deal Record Sidebar Card**:
   - In HubSpot CRM Cards, create card with Target Object `Deals`.
   - Data Fetch URL: `https://dealsense.clientdomain.com/api/v1/hubspot/cards/deal-summary`.

---

# 🧪 Go-Live Verification Smoke Tests

```bash
# 1. Check API Health
curl -i https://dealsense.clientdomain.com/api/v1/health
# Expected: {"status":"healthy","database":"connected","redis":"connected"}

# 2. Check Database Extensions
docker compose -f infrastructure/docker/docker-compose.prod.yml exec postgres psql -U dealsense -c "\dx"
# Expected: vector and uuid-ossp listed

# 3. Run Automated Pytest Suite
pytest apps/api/src/tests
# Expected: 48 passed in 1.42s (100%)
```
