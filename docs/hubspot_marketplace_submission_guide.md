# HubSpot App Marketplace Submission Guide
This document provides the exact, step-by-step instructions to list the DealSense MVP as a **Public App** (One-to-Many) on the HubSpot App Marketplace. This will serve as your primary lead magnet to acquire thousands of users natively inside the HubSpot ecosystem.

> [!IMPORTANT]
> To list an app on the HubSpot Marketplace, you must first become a certified **HubSpot App Partner**. Your app will undergo a review process for security, usability, and compliance.

---

## Phase 1: HubSpot Developer Setup

1. **Create a Developer Account**
   - Go to [developers.hubspot.com](https://developers.hubspot.com/) and create a free Developer Account.
2. **Create the Public App**
   - Inside your Developer Portal, click **Create App**.
   - Name it: **DealSense Revenue Intelligence**
   - Add your company logo and a short description.
3. **Configure Authentication (OAuth 2.0)**
   - Navigate to the **Auth** tab in your app settings.
   - **Scopes Required:** Select the minimum scopes needed (based on the MVP):
     - `crm.objects.contacts.read`
     - `crm.objects.deals.read`
     - `crm.objects.deals.write` (to write risk scores back)
   - **Redirect URL:** Enter the production URL where you will host the app's onboarding screen. E.g., `https://app.dealsense.ai/onboarding`
   - *Save your `Client ID` and `Client Secret`. You will need these for your production backend.*
4. **Configure Webhooks (Optional for V1 MVP)**
   - If you are listening for deal stage changes in real-time, go to the **Webhooks** tab and enter your backend target URL (e.g., `https://api.dealsense.ai/v1/webhooks/hubspot`).

---

## Phase 2: Host & Deploy the Application

Before submitting for review, your app must be fully hosted and publicly accessible.

1. **Deploy the Web Dashboard (Frontend)**
   - You can deploy the frontend (the Vite React app) easily using **Vercel** or **Netlify**.
   - Make sure your custom domain is connected (e.g., `app.dealsense.ai`).
2. **Deploy the API (Backend)**
   - Deploy the Python FastAPI backend using a provider like **Render**, **Railway**, or **AWS/GCP**.
   - Set your environment variables (the `Client ID` and `Client Secret` obtained in Phase 1).

---

## Phase 3: Prepare the Listing Assets

To get approved and rank well in the marketplace, you need high-quality listing assets. 

### Mandatory Links
HubSpot reviewers will check these specifically. DealSense already has these built-in:
- **Terms of Service URL:** `https://app.dealsense.ai/terms`
- **Privacy Policy URL:** `https://app.dealsense.ai/privacy`
- **Setup Instructions URL:** Provide a link to a support article or the `/onboarding` page showing how easy it is to connect.

### Media Requirements
- **App Logo:** 150x150 pixels minimum, PNG or JPG.
- **Demo Video:** A 1-3 minute YouTube or Vimeo video showing a user installing DealSense and looking at the Pipeline Risk Dashboard (the "Lead Magnet" flow).
- **Screenshots:** 3-5 high-quality screenshots. Show the Deal Inspector, the Pipeline Waterfall, and the ProGate up-sell screen to prove how it works.

---

## Phase 4: Submit for Review

1. **Create the App Listing**
   - Go to your Developer Portal -> Apps -> [DealSense] -> **Marketplace Listing**.
   - Fill out all the marketing copy. Focus on the pain points: *Deal Slippage, Ghosting, Stalled Pipeline.*
   - Ensure you clarify the **Pricing Model**: Mention that it is a "Freemium" app with a free Risk Overview lead magnet and paid Pro features.
2. **App Testing & Validation**
   - Install the app in a **HubSpot Test Account** (you can create one in the Developer Portal) to ensure the OAuth flow works perfectly from start to finish.
3. **Submit**
   - Click the **Submit for Review** button.
   - The HubSpot App Partner team will review your application. This usually takes **5–7 business days**. 

---

## Phase 5: Post-Approval Lead Generation Strategy

Once you are listed, your one-to-many architecture will act as an automated lead magnet:
1. A RevOps leader searches the HubSpot Marketplace and installs DealSense.
2. They are routed to your **AuthPage**, login, and pass through the **Onboarding flow**.
3. DealSense scans their pipeline and shows them exactly how much money is at risk in the **Pipeline Overview**.
4. When they attempt to use the automated solutions (e.g., Playbooks), the **ProGate** blurs the screen and pushes them to upgrade via your **Agency / Enterprise Pricing Page**.
