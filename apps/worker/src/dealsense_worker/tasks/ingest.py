"""DealSense Worker — Event Ingestion & Normalization Task.

Processes raw CRM webhook events consumed from Redis Streams:
- Hydrates full deal/contact/activity data from HubSpot API
- Normalizes records into PostgreSQL domain tables (deals, persons, activities, stage history)
- Updates durable WebhookEvent tracking status
- Handles failure tracking and Dead-Letter Queue (DLQ) routing
"""

import json
from datetime import datetime, timezone
from typing import Any
from uuid import UUID, uuid4

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.domain.enums import ActivityType, WebhookEventStatus
from dealsense.domain.models import Activity, Deal, DealParticipant, DealStageHistory, Person, WebhookEvent
from dealsense.infrastructure.hubspot_client import HubSpotClient, HubSpotClientError

logger = structlog.get_logger(__name__)


async def process_stream_event(
    event_fields: dict[str, str],
    db: AsyncSession,
) -> bool:
    """Process a single event received from the Redis Stream.

    Args:
        event_fields: Raw key-value dictionary from Redis Streams
        db: AsyncSession

    Returns:
        bool: True if processed successfully, False if failed
    """
    event_type = event_fields.get("event_type", "")
    payload_raw = event_fields.get("payload", "{}")

    try:
        payload = json.loads(payload_raw)
    except Exception as e:
        logger.error("corrupted_stream_event_json", error=str(e), fields=event_fields)
        return False

    webhook_event_id_str = payload.get("webhook_event_id")
    tenant_id_str = payload.get("tenant_id")
    subscription_type = payload.get("subscription_type", "")
    object_type = payload.get("object_type", "")
    object_id = str(payload.get("object_id", ""))
    event_data = payload.get("event_data", {})

    if not tenant_id_str or not object_id:
        logger.warning("event_missing_tenant_or_object_id", payload=payload)
        return False

    tenant_id = UUID(tenant_id_str)
    webhook_event_id = UUID(webhook_event_id_str) if webhook_event_id_str else None

    # Update WebhookEvent to PROCESSING
    if webhook_event_id:
        stmt = select(WebhookEvent).where(WebhookEvent.id == webhook_event_id)
        res = await db.execute(stmt)
        record = res.scalar_one_or_none()
        if record:
            record.status = WebhookEventStatus.PROCESSING
            await db.flush()

    try:
        # Route by object type
        if "deal" in subscription_type or object_type == "deal":
            await _handle_deal_event(tenant_id, object_id, subscription_type, event_data, db)
        elif "contact" in subscription_type or object_type == "contact":
            await _handle_contact_event(tenant_id, object_id, subscription_type, event_data, db)
        elif any(act in subscription_type for act in ["note", "meeting", "call", "task", "email"]):
            await _handle_activity_event(tenant_id, object_id, subscription_type, event_data, db)
        else:
            logger.info("unhandled_event_type_acknowledged", subscription_type=subscription_type)

        # Mark WebhookEvent as PROCESSED
        if webhook_event_id:
            stmt = select(WebhookEvent).where(WebhookEvent.id == webhook_event_id)
            res = await db.execute(stmt)
            record = res.scalar_one_or_none()
            if record:
                record.status = WebhookEventStatus.PROCESSED
                record.processed_at = datetime.now(timezone.utc)
                await db.flush()

        logger.info(
            "stream_event_processed_successfully",
            tenant_id=tenant_id_str,
            subscription_type=subscription_type,
            object_id=object_id,
        )
        return True

    except Exception as e:
        logger.error(
            "stream_event_processing_failed",
            tenant_id=tenant_id_str,
            object_id=object_id,
            error=str(e),
        )
        if webhook_event_id:
            stmt = select(WebhookEvent).where(WebhookEvent.id == webhook_event_id)
            res = await db.execute(stmt)
            record = res.scalar_one_or_none()
            if record:
                record.status = WebhookEventStatus.FAILED
                record.retry_count += 1
                record.error_message = str(e)
                await db.flush()
        raise


async def _handle_deal_event(
    tenant_id: UUID,
    hubspot_deal_id: str,
    subscription_type: str,
    event_data: dict[str, Any],
    db: AsyncSession,
) -> None:
    """Hydrate and update normalized Deal record in database."""
    hubspot_client = HubSpotClient(tenant_id=tenant_id, db=db)

    # Fetch fresh deal data from HubSpot
    try:
        crm_deal = await hubspot_client.get_deal(hubspot_deal_id)
    except HubSpotClientError as e:
        logger.warning("hubspot_deal_fetch_failed_using_event_data", error=str(e), deal_id=hubspot_deal_id)
        crm_deal = {"properties": {}}

    props = crm_deal.get("properties", {})
    deal_name = props.get("dealname", event_data.get("dealname", f"Deal {hubspot_deal_id}"))
    stage = props.get("dealstage", event_data.get("propertyValue", "default"))
    pipeline = props.get("pipeline", "default")
    amount = float(props.get("amount")) if props.get("amount") else None
    owner_id = props.get("hubspot_owner_id")

    # Upsert deal
    stmt = select(Deal).where(Deal.tenant_id == tenant_id, Deal.hubspot_deal_id == hubspot_deal_id)
    result = await db.execute(stmt)
    deal = result.scalar_one_or_none()

    old_stage = None
    if not deal:
        deal = Deal(
            id=uuid4(),
            tenant_id=tenant_id,
            hubspot_deal_id=hubspot_deal_id,
            name=deal_name,
            stage=stage,
            pipeline=pipeline,
            amount=amount,
            owner_id=owner_id,
            properties=props,
        )
        db.add(deal)
        await db.flush()
    else:
        old_stage = deal.stage
        deal.name = deal_name
        deal.stage = stage
        deal.pipeline = pipeline
        deal.amount = amount
        deal.owner_id = owner_id
        deal.properties = props
        await db.flush()

    # Track Stage Transitions in DealStageHistory
    if old_stage and old_stage != stage:
        history = DealStageHistory(
            deal_id=deal.id,
            tenant_id=tenant_id,
            from_stage=old_stage,
            to_stage=stage,
            changed_at=datetime.now(timezone.utc),
        )
        db.add(history)
        await db.flush()
        logger.info(
            "deal_stage_transition_recorded",
            deal_id=str(deal.id),
            from_stage=old_stage,
            to_stage=stage,
        )


async def _handle_contact_event(
    tenant_id: UUID,
    hubspot_contact_id: str,
    subscription_type: str,
    event_data: dict[str, Any],
    db: AsyncSession,
) -> None:
    """Hydrate and update normalized Person record in database."""
    hubspot_client = HubSpotClient(tenant_id=tenant_id, db=db)

    try:
        crm_contact = await hubspot_client.get_contact(hubspot_contact_id)
    except HubSpotClientError:
        crm_contact = {"properties": {}}

    props = crm_contact.get("properties", {})
    first = props.get("firstname", "")
    last = props.get("lastname", "")
    name = f"{first} {last}".strip() or props.get("email", f"Contact {hubspot_contact_id}")
    email = props.get("email")
    title = props.get("jobtitle")
    company = props.get("company")

    stmt = select(Person).where(Person.tenant_id == tenant_id, Person.hubspot_contact_id == hubspot_contact_id)
    res = await db.execute(stmt)
    person = res.scalar_one_or_none()

    if not person:
        person = Person(
            id=uuid4(),
            tenant_id=tenant_id,
            hubspot_contact_id=hubspot_contact_id,
            name=name,
            email=email,
            title=title,
            company=company,
            properties=props,
        )
        db.add(person)
    else:
        person.name = name
        person.email = email
        person.title = title
        person.company = company
        person.properties = props

    await db.flush()


async def _handle_activity_event(
    tenant_id: UUID,
    hubspot_object_id: str,
    subscription_type: str,
    event_data: dict[str, Any],
    db: AsyncSession,
) -> None:
    """Record normalized Activity from CRM event."""
    act_type = ActivityType.NOTE
    for t in [ActivityType.MEETING, ActivityType.CALL, ActivityType.TASK, ActivityType.EMAIL]:
        if t.value in subscription_type:
            act_type = t
            break

    content = event_data.get("propertyValue", event_data.get("content", ""))

    stmt = select(Activity).where(
        Activity.tenant_id == tenant_id,
        Activity.hubspot_object_id == hubspot_object_id,
        Activity.activity_type == act_type,
    )
    res = await db.execute(stmt)
    activity = res.scalar_one_or_none()

    if not activity:
        activity = Activity(
            id=uuid4(),
            tenant_id=tenant_id,
            activity_type=act_type,
            hubspot_object_id=hubspot_object_id,
            content=str(content),
            summary=str(content)[:250] if content else "",
            metadata_json=event_data,
        )
        db.add(activity)
    else:
        activity.content = str(content)
        activity.metadata_json = event_data

    await db.flush()
