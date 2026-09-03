"""DealSense API — Webhook Ingest Service.

Handles HubSpot webhook validation, deduplication, durable database persistence,
and publishing to Redis Streams for asynchronous worker processing.
"""

from typing import Any

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.domain.enums import TenantStatus, WebhookEventStatus
from dealsense.domain.models import Tenant, WebhookEvent
from dealsense.infrastructure.queue import publish_event
from dealsense.infrastructure.redis_client import cache_get, cache_set
from dealsense.security.webhook_signature import verify_webhook_signature

logger = structlog.get_logger(__name__)

IDEMPOTENCY_TTL_SECONDS = 86400  # 24 hours


async def process_incoming_webhooks(
    raw_body: bytes,
    signature_header: str | None,
    timestamp_header: str | None,
    events_payload: list[dict[str, Any]],
    db: AsyncSession,
    *,
    http_method: str = "POST",
    request_url: str | None = None,
) -> dict[str, int]:
    """Validate, deduplicate, persist, and queue a batch of HubSpot webhook events.

    Args:
        raw_body: Raw request body bytes for signature check
        signature_header: HubSpot signature header value
        timestamp_header: HubSpot timestamp header value (v3)
        events_payload: Parsed JSON array of webhook events
        db: AsyncSession
        http_method: HTTP Method ("POST")
        request_url: Full request URL for v3 signature verification

    Returns:
        Dict with metrics (received, queued, skipped)
    """
    # 1. Validate signature if configured
    if signature_header:
        version = "v3" if timestamp_header else "v1"
        verify_webhook_signature(
            request_body=raw_body,
            signature_header=signature_header,
            timestamp_header=timestamp_header,
            signature_version=version,
            http_method=http_method,
            request_url=request_url,
        )

    events_received = len(events_payload)
    events_queued = 0
    events_skipped = 0

    # Cache portal_id -> tenant lookup for the batch
    tenant_cache: dict[str, Tenant | None] = {}

    for event in events_payload:
        event_id = str(event.get("eventId", ""))
        portal_id = str(event.get("portalId", ""))
        subscription_type = str(event.get("subscriptionType", ""))
        object_id = str(event.get("objectId", ""))

        if not event_id or not portal_id:
            logger.warning("webhook_event_missing_identifiers", event=event)
            events_skipped += 1
            continue

        # 2. Check Idempotency via Redis
        idempotency_key = f"hubspot:event:{portal_id}:{event_id}"
        try:
            cached_event = await cache_get(f"idempotency:{idempotency_key}")
            if cached_event:
                logger.info("webhook_event_duplicate_skipped", idempotency_key=idempotency_key)
                events_skipped += 1
                continue
        except Exception as e:
            logger.debug("redis_idempotency_check_skipped", error=str(e))

        # 3. Resolve Tenant
        try:
            if portal_id not in tenant_cache:
                stmt = select(Tenant).where(Tenant.hubspot_portal_id == portal_id)
                result = await db.execute(stmt)
                tenant_cache[portal_id] = result.scalar_one_or_none()

            tenant = tenant_cache[portal_id]
        except Exception as db_err:
            logger.warning("webhook_tenant_lookup_failed", error=str(db_err))
            tenant = None

        if not tenant:
            # Hubspot test events use mock portal IDs (e.g. 0 or unregistered)
            logger.info("webhook_portal_test_event_accepted", portal_id=portal_id)
            events_queued += 1
            continue

        # 3.1 Handle HubSpot App Marketplace Lifecycle & GDPR Erasure Events
        if subscription_type == "app.uninstall":
            logger.info("hubspot_app_uninstall_event_received", portal_id=portal_id, tenant_id=str(tenant.id))
            from dealsense.services.oauth_service import disconnect_tenant
            await disconnect_tenant(tenant.id, db, actor=f"hubspot:{portal_id}:uninstall")
            events_queued += 1
            continue

        if subscription_type == "contact.privacy.deletion":
            logger.info("hubspot_gdpr_contact_privacy_deletion_received", portal_id=portal_id, object_id=object_id)
            from dealsense.infrastructure.redis_client import cache_delete
            await cache_delete(f"contact:pii:{portal_id}:{object_id}")
            events_queued += 1
            continue

        if tenant.status != TenantStatus.ACTIVE:
            logger.warning(
                "webhook_tenant_inactive", tenant_id=str(tenant.id), status=tenant.status
            )
            events_skipped += 1
            continue

        # 4. Determine object type from subscriptionType (e.g. 'deal.propertyChange' -> 'deal')
        object_type = subscription_type.split(".")[0] if "." in subscription_type else "unknown"

        # 5. Persist durable WebhookEvent in PostgreSQL
        try:
            webhook_record = WebhookEvent(
                tenant_id=tenant.id,
                hubspot_event_id=event_id,
                event_type=subscription_type,
                subscription_type=subscription_type,
                object_type=object_type,
                object_id=object_id,
                raw_payload=event,
                idempotency_key=idempotency_key,
                status=WebhookEventStatus.QUEUED,
            )
            db.add(webhook_record)
            await db.flush()

            # 6. Publish to Redis Streams for Worker
            stream_payload = {
                "webhook_event_id": str(webhook_record.id),
                "tenant_id": str(tenant.id),
                "portal_id": portal_id,
                "subscription_type": subscription_type,
                "object_type": object_type,
                "object_id": object_id,
                "event_data": event,
            }
            await publish_event(event_type=subscription_type, payload=stream_payload)

            # 7. Record Idempotency in Redis (24-hour TTL)
            await cache_set(
                f"idempotency:{idempotency_key}", "processed", ttl_seconds=IDEMPOTENCY_TTL_SECONDS
            )
            events_queued += 1
        except Exception as persist_err:
            logger.warning("webhook_persist_queued_fallback", error=str(persist_err))
            events_queued += 1

    logger.info(
        "webhook_batch_processed",
        received=events_received,
        queued=events_queued,
        skipped=events_skipped,
    )
    return {
        "events_received": events_received,
        "events_queued": events_queued,
        "events_skipped_duplicate": events_skipped,
    }
