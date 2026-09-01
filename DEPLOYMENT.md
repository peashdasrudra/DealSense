# 🚀 DealSense 100% Free Live Demo Deployment Guide

This guide allows you to deploy the **DealSense Agency Command Center** and **HubSpot Extension Preview** live on the internet with a public URL for **100% FREE** in under 3 minutes.

---

## ⚡ Option 1: Instant 1-Click Free Frontend Deployment (Vercel) — Recommended

Both frontend applications have already been built into production bundles (`dist/`) and configured with SPA routing rules (`vercel.json`).

### Step A: Deploy the Agency Command Center (`apps/web-dashboard`)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account (free).
2. Click **"Add New..."** ➔ **"Project"** and import this repository (`DealSense`).
3. Under **Root Directory**, click **Edit** and choose:
   `apps/web-dashboard`
4. Leave Build Command as `npm run build` and Output Directory as `dist`.
5. Click **"Deploy"**.
6. 🎯 **Done!** You get an instant public live URL like `https://dealsense-dashboard.vercel.app`.

### Step B: Deploy the HubSpot Sidebar Card Preview (`apps/hubspot-extension`)
1. In Vercel, click **"Add New..."** ➔ **"Project"** again with the same repo.
2. Under **Root Directory**, click **Edit** and choose:
   `apps/hubspot-extension`
3. Click **"Deploy"**.
4. 🎯 **Done!** You get an instant public live URL like `https://dealsense-extension.vercel.app`.

---

## ⚡ Option 2: Drag-and-Drop Instant Free Hosting (Netlify Drop) — 30 Seconds, No Git Required!

If you don't even want to connect GitHub:
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop) (free).
2. Drag and drop the compiled folder:
   `C:\Users\USER\Desktop\AiXpertLabs\DealSense\apps\web-dashboard\dist`
3. 🎯 Your interactive live site is instantly published with a live HTTPS link!

---

## ⚡ Option 3: Free Live FastAPI Backend (Render.com Free Tier)

If you want the Python backend API accessible online for free:
1. Sign up at [render.com](https://render.com) (free tier).
2. Click **"New +"** ➔ **"Web Service"** and select your GitHub repository.
3. Set the following settings:
   - **Root Directory**: `apps/api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -e .`
   - **Start Command**: `uvicorn dealsense.main:app --host 0.0.0.0 --port $PORT`
4. In **Environment Variables**, add:
   - `SECRET_KEY`: `supersecretkey12345678901234567890`
5. Click **"Create Web Service"**.
6. 🎯 Your API will be live at `https://dealsense-api.onrender.com`.
