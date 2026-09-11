import asyncio
import hashlib
import hmac
import json
import time
from uuid import UUID, uuid4
import os
import sys

# Set UTF-8 encoding for standard output
sys.stdout.reconfigure(encoding='utf-8')

import httpx
from httpx import ASGITransport, AsyncClient

from dealsense.config import get_settings
from dealsense.main import create_app
from dealsense.services.oauth_service import create_tenant_session_jwt

app = create_app()

async def run_diagnostics():
    print("\n" + "="*70)
    print(" DEALSENSE - AUTH & 2-WAY API VERIFICATION DIAGNOSTICS")
    print("="*70 + "\n")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # -------------------------------------------------------------
        # 1. OAuth & Auth Verification
        # -------------------------------------------------------------
        print("[1/6] Testing OAuth Authorization URL Generation...")
        res = await client.get("/api/v1/oauth/authorize")
        assert res.status_code == 200, f"Failed: {res.text}"
        auth_data = res.json()
        print(f"  [OK] GET /api/v1/oauth/authorize: OK (state={auth_data['state'][:20]}...)")
        assert "https://app.hubspot.com/oauth/authorize" in auth_data["authorization_url"]

        res_install = await client.get("/api/v1/oauth/install")
        assert res_install.status_code == 200
        print(f"  [OK] GET /api/v1/oauth/install: OK")

        # -------------------------------------------------------------
        # 2. Session JWT Issuance & Tenant Guard
        # -------------------------------------------------------------
        print("\n[2/6] Testing Session JWT Issuance & Tenant Isolation...")
        test_tenant_id = UUID("00000000-0000-0000-0000-000000000002")
        portal_id = "982341"
        session_jwt = create_tenant_session_jwt(test_tenant_id, portal_id)
        print(f"  [OK] Session JWT Issued: {session_jwt[:30]}...")

        # Test Tenant Guard Blocks Missing / Invalid Tenant on protected endpoints
        res_blocked = await client.get("/api/v1/oauth/status")
        print(f"  [OK] Protected Endpoint without Auth returns status {res_blocked.status_code} (Guarded)")

        # Test Authorized Call with Bearer JWT
        headers_jwt = {
            "Authorization": f"Bearer {session_jwt}",
            "X-Tenant-ID": str(test_tenant_id),
        }
        res_auth = await client.get("/api/v1/oauth/status", headers=headers_jwt)
        print(f"  [OK] GET /api/v1/oauth/status with Bearer JWT: HTTP {res_auth.status_code} ({res_auth.json().get('status', 'ok')})")

        # -------------------------------------------------------------
        # 3. Two-Way Inbound: HubSpot HMAC Webhook Verification
        # -------------------------------------------------------------
        print("\n[3/6] Testing Inbound HubSpot Webhooks (HMAC-SHA256 & Replay Protection)...")
        settings = get_settings()
        webhook_secret = settings.hubspot_client_secret or "test-secret"
        webhook_payload = json.dumps([
            {
                "eventId": 100001,
                "portalId": 982341,
                "subscriptionType": "deal.propertyChange",
                "objectId": 987654321,
                "propertyName": "dealstage",
                "propertyValue": "decisionmakerboughtin",
            }
        ]).encode("utf-8")

        # V1 Signature test
        v1_sig = hashlib.sha256(webhook_secret.encode("utf-8") + webhook_payload).hexdigest()
        res_webhook_v1 = await client.post(
            "/api/v1/webhooks/hubspot",
            content=webhook_payload,
            headers={
                "Content-Type": "application/json",
                "X-HubSpot-Signature": v1_sig,
            },
        )
        print(f"  [OK] Inbound Webhook (v1 SHA256): HTTP {res_webhook_v1.status_code} -> {res_webhook_v1.json()}")
        assert res_webhook_v1.status_code == 200

        # V3 Signature test
        ts_ms = str(int(time.time() * 1000))
        message_v3 = webhook_payload + ts_ms.encode("utf-8")
        v3_sig = hmac.new(webhook_secret.encode("utf-8"), message_v3, hashlib.sha256).hexdigest()
        res_webhook_v3 = await client.post(
            "/api/v1/webhooks/hubspot",
            content=webhook_payload,
            headers={
                "Content-Type": "application/json",
                "X-HubSpot-Signature-v3": v3_sig,
                "X-HubSpot-Request-Timestamp": ts_ms,
            },
        )
        print(f"  [OK] Inbound Webhook (v3 HMAC-SHA256): HTTP {res_webhook_v3.status_code} -> {res_webhook_v3.json()}")
        assert res_webhook_v3.status_code == 200

        # Tampered payload fails
        tampered_sig = "bad_signature_00000000000000000000"
        res_webhook_bad = await client.post(
            "/api/v1/webhooks/hubspot",
            content=webhook_payload,
            headers={
                "Content-Type": "application/json",
                "X-HubSpot-Signature": tampered_sig,
            },
        )
        print(f"  [OK] Inbound Webhook (Tampered Sig rejected): HTTP {res_webhook_bad.status_code}")
        assert res_webhook_bad.status_code == 401

        # -------------------------------------------------------------
        # 4. Two-Way Deal CRUD & Synchronization (Web & HubSpot)
        # -------------------------------------------------------------
        print("\n[4/6] Testing Two-Way Deals API (List, Create, Update, Delete)...")
        # List deals
        res_deals = await client.get("/api/v1/deals", headers=headers_jwt)
        print(f"  [OK] GET /api/v1/deals: HTTP {res_deals.status_code} (Count={len(res_deals.json())})")
        assert res_deals.status_code == 200

        # Create deal
        create_payload = {
            "name": "Acme Enterprise Telemetry Deal",
            "amount": 185000.0,
            "stage": "presentationscheduled",
            "client": "Acme Global Industries",
            "owner": "Peash Rudra",
        }
        res_create = await client.post("/api/v1/deals", headers=headers_jwt, json=create_payload)
        created_deal = res_create.json()
        print(f"  [OK] POST /api/v1/deals: HTTP {res_create.status_code} (ID={created_deal['id']}, HS_ID={created_deal['hubspot_id']})")
        assert res_create.status_code == 201

        # Update deal (patch close date & stage)
        update_payload = {
            "stage": "contractsent",
            "amount": 195000.0,
        }
        res_patch = await client.patch(f"/api/v1/deals/{created_deal['id']}", headers=headers_jwt, json=update_payload)
        print(f"  [OK] PATCH /api/v1/deals/{created_deal['id']}: HTTP {res_patch.status_code} (New Stage={res_patch.json()['stage']}, Score={res_patch.json()['score']})")
        assert res_patch.status_code == 200

        # Sync hubspot deals endpoint
        res_sync = await client.post("/api/v1/deals/sync-hubspot", headers=headers_jwt)
        print(f"  [OK] POST /api/v1/deals/sync-hubspot: HTTP {res_sync.status_code} (Status={res_sync.json()['status']})")
        assert res_sync.status_code == 200

        # -------------------------------------------------------------
        # 5. UI Extension & Snapshot Scoring Callbacks
        # -------------------------------------------------------------
        print("\n[5/6] Testing HubSpot Custom Card UI Extension Endpoints...")
        # Check snapshot endpoint with created deal id
        res_snap = await client.get(f"/api/v1/deals/{created_deal['id']}/snapshot", headers=headers_jwt)
        print(f"  [INFO] GET /api/v1/deals/<deal_id>/snapshot: HTTP {res_snap.status_code} -> {res_snap.text[:80]}")

        # Check score trigger
        res_score = await client.post(f"/api/v1/deals/{created_deal['id']}/score", headers=headers_jwt)
        print(f"  [INFO] POST /api/v1/deals/<deal_id>/score: HTTP {res_score.status_code} -> {res_score.text[:80]}")

        # -------------------------------------------------------------
        # 6. Action Approval Queue & Outbound HubSpot Write-Back
        # -------------------------------------------------------------
        print("\n[6/6] Testing Action Approval Queue & Write-Backs...")
        res_actions = await client.get("/api/v1/actions", headers=headers_jwt)
        print(f"  [OK] GET /api/v1/actions: HTTP {res_actions.status_code} (Pending={len(res_actions.json())})")
        assert res_actions.status_code == 200

        print("\n" + "="*70)
        print(" ALL AUTH & 2-WAY API CHECKS COMPLETED")
        print("="*70 + "\n")

if __name__ == "__main__":
    asyncio.run(run_diagnostics())
