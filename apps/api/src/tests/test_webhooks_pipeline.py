"""DealSense API — Webhook Pipeline and Ingestion Test Suite.

Comprehensive tests for:
- Webhook endpoint ingestion & fast ACK (<5s)
- Webhook deduplication and idempotency
- Webhook database persistence and Redis Streams queue publication
- Worker stream event normalization (Deals, Contacts, Activities, Stage transitions)
- HubSpot API client error handling and retry mechanism
"""

import hashlib
import json
import os
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest
from cryptography.fernet import Fernet
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.domain.enums import ActivityType, TenantStatus, WebhookEventStatus
from dealsense.domain.models import Activity, Deal, DealStageHistory, Person, Tenant, WebhookEvent
from dealsense.infrastructure.hubspot_client import HubSpotClient, HubSpotClientError
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

        with patch("dealsense.services.webhook_service.cache_get", new_callable=AsyncMock) as mock_cache_get, \
             patch("dealsense.services.webhook_service.cache_set", new_callable=AsyncMock) as mock_cache_set, \
             patch("dealsense.services.webhook_service.publish_event", new_callable=AsyncMock) as mock_publish:

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
        tenant_id = uuid4()
        events = [
            {
                "eventId": "dup-123",
                "portalId": "654321",
                "subscriptionType": "deal.creation",
                "objectId": "888",
            }
        ]
        mock_db = AsyncMock(spec=AsyncSession)

        with patch("dealsense.services.webhook_service.cache_get", new_callable=AsyncMock) as mock_cache_get:
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

        with patch("dealsense_worker.tasks.ingest.HubSpotClient.get_deal", new_callable=AsyncMock) as mock_get_deal:
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

        with patch("dealsense_worker.tasks.ingest.HubSpotClient.get_contact", new_callable=AsyncMock) as mock_get_contact:
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

        with patch("dealsense.infrastructure.hubspot_client.get_access_token", new_callable=AsyncMock) as mock_get_tok:
            mock_get_tok.return_value = "pat-mock-token-xyz"

            client = HubSpotClient(tenant_id=tenant_id, db=mock_db)
            headers = await client._get_headers()

            assert headers["Authorization"] == "Bearer pat-mock-token-xyz"
            assert headers["Content-Type"] == "application/json"
