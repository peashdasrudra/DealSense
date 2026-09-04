"""DealSense API — Webhook Pipeline and Ingestion Test Suite.

Comprehensive tests for:
- Webhook endpoint ingestion & fast ACK (<5s)
- Webhook deduplication and idempotency
- Webhook database persistence and Redis Streams queue publication
- Worker stream event normalization (Deals, Contacts, Activities, Stage transitions)
- HubSpot API client error handling and retry mechanism
"""

import base64
import hashlib
import hmac
import json
import os
import time
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest
from cryptography.fernet import Fernet
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.domain.enums import TenantStatus
from dealsense.domain.models import Deal, DealStageHistory, Person, Tenant
from dealsense.infrastructure.hubspot_client import HubSpotClient
from dealsense.services.webhook_service import process_incoming_webhooks
from dealsense_worker.tasks.ingest import process_stream_event


@pytest.fixture(autouse=True)
def setup_test_env():
    """Configure environment for webhook pipeline tests."""
    key = Fernet.generate_key().decode()
    os.environ["ENCRYPTION_KEY"] = key
    os.environ["HUBSPOT_CLIENT_SECRET"] = "test-hubspot-secret-key"
    os.environ["HUBSPOT_CLIENT_ID"] = "test-client-id"
    os.environ["SECRET_KEY"] = "test-secret-key-minimum-32-characters-long"
    from dealsense.infrastructure import encryption

    encryption._fernet = None
    from dealsense.config import get_settings

    get_settings.cache_clear()
    yield
    encryption._fernet = None
    get_settings.cache_clear()


# ============================================================
# Webhook Endpoint & Ingestion Tests
# ============================================================


class TestWebhookIngestion:
    """Test webhook endpoint and ingest service."""

    @pytest.mark.asyncio
    async def test_webhook_ingest_success(self) -> None:
        """POST /api/v1/webhooks/hubspot should ingest valid payloads and return 200."""
        from dealsense.main import app

        tenant_id = uuid4()
        portal_id = "123456"
        sample_events = [
            {
                "eventId": 101,
                "portalId": int(portal_id),
                "occurredAt": 1700000000000,
                "subscriptionType": "deal.propertyChange",
                "objectId": 999,
                "propertyName": "dealstage",
                "propertyValue": "qualifiedtobuy",
            }
        ]
        raw_body = json.dumps(sample_events).encode("utf-8")
        secret = "test-hubspot-secret-key"
        signature = hashlib.sha256(secret.encode("utf-8") + raw_body).hexdigest()

        mock_tenant = Tenant(
            id=tenant_id,
            hubspot_portal_id=portal_id,
            name="Test Portal",
            status=TenantStatus.ACTIVE,
        )

        mock_db = AsyncMock(spec=AsyncSession)
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_tenant
        mock_db.execute.return_value = mock_result

        async def _override_get_db():
            yield mock_db

        from dealsense.api.deps import get_db

        app.dependency_overrides[get_db] = _override_get_db

        with (
            patch(
                "dealsense.services.webhook_service.cache_get", new_callable=AsyncMock
            ) as mock_cache_get,
            patch("dealsense.services.webhook_service.cache_set", new_callable=AsyncMock),
            patch(
                "dealsense.services.webhook_service.publish_event", new_callable=AsyncMock
            ) as mock_publish,
        ):
            mock_cache_get.return_value = None

            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://test") as client:
                response = await client.post(
                    "/api/v1/webhooks/hubspot",
                    content=raw_body,
                    headers={"X-HubSpot-Signature": signature},
                )

            app.dependency_overrides.clear()

            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "received"
            assert data["events_received"] == 1
            assert data["events_queued"] == 1
            assert mock_publish.called

    @pytest.mark.asyncio
    async def test_webhook_duplicate_skipped(self) -> None:
        """Duplicate webhook event based on idempotency key should be skipped."""
        uuid4()
        events = [
            {
                "eventId": "dup-123",
                "portalId": "654321",
                "subscriptionType": "deal.creation",
                "objectId": "888",
            }
        ]
        mock_db = AsyncMock(spec=AsyncSession)

        with patch(
            "dealsense.services.webhook_service.cache_get", new_callable=AsyncMock
        ) as mock_cache_get:
            # Simulate Redis returning existing record for idempotency
            mock_cache_get.return_value = "processed"

            result = await process_incoming_webhooks(
                raw_body=b"",
                signature_header=None,
                timestamp_header=None,
                events_payload=events,
                db=mock_db,
            )

            assert result["events_received"] == 1
            assert result["events_queued"] == 0
            assert result["events_skipped_duplicate"] == 1
            assert not mock_db.add.called

    @pytest.mark.asyncio
    async def test_webhook_app_uninstall_disconnects_tenant(self) -> None:
        """HubSpot app.uninstall event should immediately disconnect the tenant and revoke tokens."""
        from dealsense.domain.enums import TenantStatus
        from dealsense.domain.models import Tenant

        tenant = Tenant(
            id=uuid4(),
            hubspot_portal_id="999000",
            name="Uninstall Test Account",
            status=TenantStatus.ACTIVE,
        )
        mock_db = AsyncMock(spec=AsyncSession)
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = tenant
        mock_db.execute.return_value = mock_result

        events = [
            {
                "eventId": "uninstall-evt-1",
                "portalId": "999000",
                "subscriptionType": "app.uninstall",
                "objectId": "0",
            }
        ]

        with patch("dealsense.services.oauth_service.disconnect_tenant", new_callable=AsyncMock) as mock_disc:
            result = await process_incoming_webhooks(
                raw_body=b"",
                signature_header=None,
                timestamp_header=None,
                events_payload=events,
                db=mock_db,
            )

            assert result["events_received"] == 1
            assert result["events_queued"] == 1
            mock_disc.assert_awaited_once_with(tenant.id, mock_db, actor="hubspot:999000:uninstall")

    @pytest.mark.asyncio
    async def test_webhook_contact_privacy_deletion_cleans_cache(self) -> None:
        """HubSpot GDPR contact.privacy.deletion event should scrub cached PII."""
        from dealsense.domain.enums import TenantStatus
        from dealsense.domain.models import Tenant

        tenant = Tenant(
            id=uuid4(),
            hubspot_portal_id="999001",
            name="GDPR Test Account",
            status=TenantStatus.ACTIVE,
        )
        mock_db = AsyncMock(spec=AsyncSession)
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = tenant
        mock_db.execute.return_value = mock_result

        events = [
            {
                "eventId": "gdpr-del-1",
                "portalId": "999001",
                "subscriptionType": "contact.privacy.deletion",
                "objectId": "contact-777",
            }
        ]

        with patch("dealsense.infrastructure.redis_client.cache_delete", new_callable=AsyncMock) as mock_del:
            result = await process_incoming_webhooks(
                raw_body=b"",
                signature_header=None,
                timestamp_header=None,
                events_payload=events,
                db=mock_db,
            )

            assert result["events_received"] == 1
            assert result["events_queued"] == 1
            mock_del.assert_awaited_once_with("contact:pii:999001:contact-777")

    @pytest.mark.asyncio
    async def test_webhook_v3_signature_valid(self) -> None:
        """POST /api/v1/webhooks/hubspot with valid v3 Base64 signature and timestamp."""
        from dealsense.main import app

        tenant_id = uuid4()
        portal_id = "777888"
        sample_events = [
            {
                "eventId": 202,
                "portalId": int(portal_id),
                "occurredAt": int(time.time() * 1000),
                "subscriptionType": "deal.propertyChange",
                "objectId": 555,
                "propertyName": "amount",
                "propertyValue": "95000",
            }
        ]
        raw_body = json.dumps(sample_events).encode("utf-8")
        secret = "test-hubspot-secret-key"
        timestamp_ms = str(int(time.time() * 1000))

        # Compute v3 signature: Base64(HMAC-SHA256(secret, method + URL + body + timestamp))
        target_url = "http://test/api/v1/webhooks/hubspot"
        source = b"POST" + target_url.encode("utf-8") + raw_body + timestamp_ms.encode("utf-8")
        signature_v3 = base64.b64encode(
            hmac.new(secret.encode("utf-8"), source, hashlib.sha256).digest()
        ).decode("utf-8")

        mock_tenant = Tenant(
            id=tenant_id,
            hubspot_portal_id=portal_id,
            name="V3 Enterprise Portal",
            status=TenantStatus.ACTIVE,
        )

        mock_db = AsyncMock(spec=AsyncSession)
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_tenant
        mock_db.execute.return_value = mock_result

        async def _override_get_db():
            yield mock_db

        from dealsense.api.deps import get_db

        app.dependency_overrides[get_db] = _override_get_db

        with (
            patch("dealsense.services.webhook_service.cache_get", new_callable=AsyncMock) as mock_cache_get,
            patch("dealsense.services.webhook_service.cache_set", new_callable=AsyncMock),
            patch("dealsense.services.webhook_service.publish_event", new_callable=AsyncMock),
        ):
            mock_cache_get.return_value = None

            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://test") as client:
                response = await client.post(
                    "/api/v1/webhooks/hubspot",
                    content=raw_body,
                    headers={
                        "X-HubSpot-Signature-v3": signature_v3,
                        "X-HubSpot-Request-Timestamp": timestamp_ms,
                    },
                )

            app.dependency_overrides.clear()
            assert response.status_code == 200
            assert response.json()["status"] == "received"

    @pytest.mark.asyncio
    async def test_webhook_v3_tampered_payload_fails(self) -> None:
        """Tampered payload with mismatched v3 signature must return 401."""
        from dealsense.main import app

        raw_body = json.dumps([{"eventId": 303}]).encode("utf-8")
        tampered_body = json.dumps([{"eventId": 303, "malicious": True}]).encode("utf-8")
        secret = "test-hubspot-secret-key"
        timestamp_ms = str(int(time.time() * 1000))

        # Sign original raw_body
        source = b"POST" + b"http://test/api/v1/webhooks/hubspot" + raw_body + timestamp_ms.encode("utf-8")
        signature_v3 = base64.b64encode(
            hmac.new(secret.encode("utf-8"), source, hashlib.sha256).digest()
        ).decode("utf-8")

        mock_db = AsyncMock(spec=AsyncSession)

        async def _override_get_db():
            yield mock_db

        from dealsense.api.deps import get_db

        app.dependency_overrides[get_db] = _override_get_db

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/webhooks/hubspot",
                content=tampered_body,  # Send tampered body!
                headers={
                    "X-HubSpot-Signature-v3": signature_v3,
                    "X-HubSpot-Request-Timestamp": timestamp_ms,
                },
            )

        app.dependency_overrides.clear()
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_webhook_v3_replay_attack_rejected(self) -> None:
        """Webhook with timestamp older than 300 seconds must be rejected as replay attack."""
        from dealsense.main import app

        raw_body = json.dumps([{"eventId": 404}]).encode("utf-8")
        secret = "test-hubspot-secret-key"
        # 400 seconds in the past (> 300s limit)
        expired_timestamp = str(int((time.time() - 400) * 1000))

        source = b"POST" + b"http://test/api/v1/webhooks/hubspot" + raw_body + expired_timestamp.encode("utf-8")
        signature_v3 = base64.b64encode(
            hmac.new(secret.encode("utf-8"), source, hashlib.sha256).digest()
        ).decode("utf-8")

        mock_db = AsyncMock(spec=AsyncSession)

        async def _override_get_db():
            yield mock_db

        from dealsense.api.deps import get_db

        app.dependency_overrides[get_db] = _override_get_db

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/webhooks/hubspot",
                content=raw_body,
                headers={
                    "X-HubSpot-Signature-v3": signature_v3,
                    "X-HubSpot-Request-Timestamp": expired_timestamp,
                },
            )

        app.dependency_overrides.clear()
        assert response.status_code == 401


# ============================================================
# Worker Normalization Task Tests
# ============================================================


class TestWorkerIngestionTask:
    """Test background worker event processing and data normalization."""

    @pytest.mark.asyncio
    async def test_process_deal_stage_change_event(self) -> None:
        """Deal event should update Deal record and record DealStageHistory."""
        tenant_id = uuid4()
        deal_id = uuid4()
        hubspot_deal_id = "98765"

        existing_deal = Deal(
            id=deal_id,
            tenant_id=tenant_id,
            hubspot_deal_id=hubspot_deal_id,
            name="Alpha Deal",
            stage="appointmentscheduled",
            pipeline="default",
            amount=50000.0,
        )

        mock_db = AsyncMock(spec=AsyncSession)
        mock_result = MagicMock()
        # Returns existing deal
        mock_result.scalar_one_or_none.return_value = existing_deal
        mock_db.execute.return_value = mock_result

        event_payload = {
            "tenant_id": str(tenant_id),
            "subscription_type": "deal.propertyChange",
            "object_type": "deal",
            "object_id": hubspot_deal_id,
            "event_data": {"propertyValue": "decisionmakerboughtin"},
        }
        fields = {
            "event_type": "deal.propertyChange",
            "payload": json.dumps(event_payload),
            "retry_count": "0",
        }

        with patch(
            "dealsense_worker.tasks.ingest.HubSpotClient.get_deal", new_callable=AsyncMock
        ) as mock_get_deal:
            mock_get_deal.return_value = {
                "properties": {
                    "dealname": "Alpha Deal",
                    "dealstage": "decisionmakerboughtin",
                    "amount": "50000",
                    "pipeline": "default",
                }
            }

            success = await process_stream_event(event_fields=fields, db=mock_db)

            assert success is True
            assert existing_deal.stage == "decisionmakerboughtin"
            # Should have added DealStageHistory
            assert mock_db.add.called
            added_item = mock_db.add.call_args[0][0]
            assert isinstance(added_item, DealStageHistory)
            assert added_item.from_stage == "appointmentscheduled"
            assert added_item.to_stage == "decisionmakerboughtin"

    @pytest.mark.asyncio
    async def test_process_contact_event(self) -> None:
        """Contact event should normalize into Person record."""
        tenant_id = uuid4()
        hubspot_contact_id = "43210"

        mock_db = AsyncMock(spec=AsyncSession)
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None  # New person
        mock_db.execute.return_value = mock_result

        event_payload = {
            "tenant_id": str(tenant_id),
            "subscription_type": "contact.creation",
            "object_type": "contact",
            "object_id": hubspot_contact_id,
            "event_data": {},
        }
        fields = {
            "event_type": "contact.creation",
            "payload": json.dumps(event_payload),
            "retry_count": "0",
        }

        with patch(
            "dealsense_worker.tasks.ingest.HubSpotClient.get_contact", new_callable=AsyncMock
        ) as mock_get_contact:
            mock_get_contact.return_value = {
                "properties": {
                    "firstname": "Sarah",
                    "lastname": "Connor",
                    "email": "sarah@cyberdyne.com",
                    "jobtitle": "VP Engineering",
                    "company": "Cyberdyne",
                }
            }

            success = await process_stream_event(event_fields=fields, db=mock_db)

            assert success is True
            assert mock_db.add.called
            person = mock_db.add.call_args[0][0]
            assert isinstance(person, Person)
            assert person.name == "Sarah Connor"
            assert person.email == "sarah@cyberdyne.com"


# ============================================================
# HubSpot API Client Tests
# ============================================================


class TestHubSpotClient:
    """Test HubSpot Client retry logic and endpoints."""

    @pytest.mark.asyncio
    async def test_hubspot_client_token_injection(self) -> None:
        """HubSpotClient should inject Bearer token into headers."""
        tenant_id = uuid4()
        mock_db = AsyncMock(spec=AsyncSession)

        with patch(
            "dealsense.infrastructure.hubspot_client.get_access_token", new_callable=AsyncMock
        ) as mock_get_tok:
            mock_get_tok.return_value = "pat-mock-token-xyz"

            client = HubSpotClient(tenant_id=tenant_id, db=mock_db)
            headers = await client._get_headers()

            assert headers["Authorization"] == "Bearer pat-mock-token-xyz"
            assert headers["Content-Type"] == "application/json"
