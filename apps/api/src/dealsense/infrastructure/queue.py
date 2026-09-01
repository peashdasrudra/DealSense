"""DealSense API — Queue Infrastructure.

Redis Streams-based event queue for asynchronous webhook processing.
Supports consumer groups, acknowledgment, DLQ routing, and retry tracking.
"""

import json
import time
from typing import Any
from uuid import uuid4

import structlog

from dealsense.infrastructure.redis_client import get_redis

logger = structlog.get_logger(__name__)

# Stream and consumer group names
DEFAULT_STREAM = "dealsense:events"
DEFAULT_GROUP = "dealsense-workers"
DEFAULT_DLQ_STREAM = "dealsense:events:dlq"
MAX_RETRIES = 5


async def ensure_consumer_group(
    stream: str = DEFAULT_STREAM, group: str = DEFAULT_GROUP
) -> None:
    """Create the consumer group if it doesn't exist."""
    client = get_redis()
    try:
        await client.xgroup_create(stream, group, id="0", mkstream=True)
    except Exception:
        # Group already exists
        pass


async def publish_event(
    event_type: str,
    payload: dict[str, Any],
    stream: str = DEFAULT_STREAM,
) -> str:
    """Publish an event to the Redis Stream.

    Returns the message ID assigned by Redis.
    """
    client = get_redis()
    message = {
        "event_id": str(uuid4()),
        "event_type": event_type,
        "payload": json.dumps(payload),
        "published_at": str(time.time()),
        "retry_count": "0",
    }
    msg_id: str = await client.xadd(stream, message)
    logger.info(
        "event_published",
        event_type=event_type,
        stream=stream,
        message_id=msg_id,
    )
    return msg_id


async def consume_events(
    consumer_name: str,
    count: int = 10,
    block_ms: int = 5000,
    stream: str = DEFAULT_STREAM,
    group: str = DEFAULT_GROUP,
) -> list[tuple[str, dict[str, str]]]:
    """Read pending events from the consumer group.

    Returns a list of (message_id, fields) tuples.
    """
    client = get_redis()
    results = await client.xreadgroup(
        groupname=group,
        consumername=consumer_name,
        streams={stream: ">"},
        count=count,
        block=block_ms,
    )
    messages: list[tuple[str, dict[str, str]]] = []
    if results:
        for _stream_name, stream_messages in results:
            for msg_id, fields in stream_messages:
                messages.append((msg_id, fields))
    return messages


async def acknowledge_event(
    message_id: str,
    stream: str = DEFAULT_STREAM,
    group: str = DEFAULT_GROUP,
) -> None:
    """Acknowledge a successfully processed event."""
    client = get_redis()
    await client.xack(stream, group, message_id)
    logger.debug("event_acknowledged", message_id=message_id)


async def route_to_dlq(
    message_id: str,
    original_fields: dict[str, str],
    error_message: str,
    stream: str = DEFAULT_STREAM,
    group: str = DEFAULT_GROUP,
    dlq_stream: str = DEFAULT_DLQ_STREAM,
) -> None:
    """Route a failed message to the dead-letter queue."""
    client = get_redis()
    dlq_message = {
        **original_fields,
        "original_message_id": message_id,
        "error_message": error_message,
        "dlq_at": str(time.time()),
    }
    await client.xadd(dlq_stream, dlq_message)
    await client.xack(stream, group, message_id)
    logger.warning(
        "event_dead_lettered",
        message_id=message_id,
        error=error_message,
    )


async def get_stream_info(stream: str = DEFAULT_STREAM) -> dict[str, Any]:
    """Get stream length and consumer group info for monitoring."""
    client = get_redis()
    length = await client.xlen(stream)
    try:
        groups = await client.xinfo_groups(stream)
    except Exception:
        groups = []
    return {"stream": stream, "length": length, "groups": groups}
