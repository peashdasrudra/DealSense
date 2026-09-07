# DealSense — HubSpot App Setup Guide

Welcome to DealSense Revenue Intelligence. Follow these quick steps to install, configure, and activate AI deal scoring in your HubSpot portal.

---

## 🚀 1. One-Click OAuth Installation

1. Navigate to the DealSense App Marketplace listing page or go directly to [https://dealsense.peash.tech/install](https://dealsense.peash.tech/install).
2. Click **Install App** / **Connect to HubSpot**.
3. Select your HubSpot account/portal.
4. Review and grant the required CRM permissions:
   - `crm.objects.deals.read` & `crm.objects.deals.write`
   - `crm.objects.contacts.read`
   - `crm.objects.companies.read`
   - `crm.schemas.deals.read`
   - `timeline` (optional)
5. You will be redirected back to the DealSense Command Deck with confirmation that your portal is connected.

---

## 📊 2. Accessing Deal Intelligence in HubSpot

Once installed, DealSense is natively embedded directly inside your HubSpot deal records:

### A. Deal Record Sidebar Card ("DealSense Health")
- Located in the right-hand preview panel of any deal record.
- Displays the real-time **Health Score (0–100)**, **Risk Band** (`HEALTHY`, `MODERATE`, `ELEVATED`, `HIGH`, `CRITICAL`), and the **#1 Top Risk Signal**.

### B. Deal Record Intelligence Tab ("DealSense Intelligence")
- Click the **DealSense Intelligence** tab at the top of any deal record.
- View:
  - Complete **Health Score Progress Gauge** and score trend delta
  - Detailed **Detected Risk Signals** accordion with severity levels and weights
  - Full **MEDDICC Qualification Matrix** (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion, Competition)
  - Next-best-action playbooks with direct link to the DealSense Command Deck

---

## ⚡ 3. Initial Score & Re-Analysis

- When you open an unanalyzed deal, click **"Analyze Deal Now"** or **"Initialize AI Scoring"** to trigger immediate real-time telemetry processing.
- When new activities (emails, notes, meetings, stage updates) occur in HubSpot, DealSense webhooks automatically process and update risk scores in the background.

---

## 🛡️ 4. Support & Data Governance

- **Documentation**: [https://dealsense.peash.tech/onboarding](https://dealsense.peash.tech/onboarding)
- **Compliance & Privacy**: [https://dealsense.peash.tech/compliance](https://dealsense.peash.tech/compliance)
- **Support Contact**: `support@dealsense.ai`
