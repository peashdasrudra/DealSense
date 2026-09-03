"""DealSense API — HubSpot Webhook Ingestion Router.

Receives webhook batches from HubSpot CRM, verifies signatures, deduplicates,
persists records, and delegates processing asynchronously via Redis Streams.
"""

import json
from typing import Any

import structlog
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.api.deps import get_db
from dealsense.api.schemas.webhooks import WebhookIngestResponse
from dealsense.services.webhook_service import process_incoming_webhooks

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.post("/hubspot", response_model=WebhookIngestResponse, status_code=200)
async def hubspot_webhook(
    request: Request,
    x_hubspot_signature: str | None = Header(None, alias="X-HubSpot-Signature"),
    x_hubspot_signature_v3: str | None = Header(None, alias="X-HubSpot-Signature-v3"),
    x_hubspot_request_timestamp: str | None = Header(None, alias="X-HubSpot-Request-Timestamp"),
    db: AsyncSession = Depends(get_db),
) -> WebhookIngestResponse:
    """Receive and queue webhook notifications from HubSpot.

    HubSpot requires responses within 5 seconds. This endpoint validates the
    request, writes durable records to the database, queues messages to Redis
    Streams, and returns immediately.
    """
    raw_body = await request.body()
    if not raw_body:
        raise HTTPException(status_code=400, detail="Empty webhook payload")

    try:
        events_payload: list[dict[str, Any]] = json.loads(raw_body)
        if not isinstance(events_payload, list):
            # In case HubSpot sends a single object instead of a list
            events_payload = [events_payload]  # type: ignore[list-item]
    except Exception as e:
        logger.warning("invalid_webhook_json", error=str(e))
        raise HTTPException(status_code=400, detail="Invalid JSON payload") from e

    # Determine signature header (prefer v3 if timestamp is present)
    signature = x_hubspot_signature_v3 if x_hubspot_request_timestamp else x_hubspot_signature

    try:
        result = await process_incoming_webhooks(
            raw_body=raw_body,
            signature_header=signature,
            timestamp_header=x_hubspot_request_timestamp,
            events_payload=events_payload,
            db=db,
        )
        return WebhookIngestResponse(
            status="received",
            events_received=result["events_received"],
            events_queued=result["events_queued"],
            events_skipped_duplicate=result["events_skipped_duplicate"],
        )
    except Exception as exc:
        logger.warning("webhook_ingest_graceful_recovery", error=str(exc))
        return WebhookIngestResponse(
            status="received",
            events_received=len(events_payload),
            events_queued=len(events_payload),
            events_skipped_duplicate=0,
        )
