"""DealSense Worker — Main Event Processing Daemon.

Continuously consumes events from Redis Streams, distributes tasks,
manages retries, DLQ routing, and ensures graceful shutdown.
"""

import asyncio
import os
import signal
import sys
from uuid import uuid4

import structlog

from dealsense.domain.exceptions import DealSenseError
from dealsense.infrastructure.database import close_db, get_db_session, init_db
from dealsense.infrastructure.queue import (
    DEFAULT_GROUP,
    DEFAULT_STREAM,
    MAX_RETRIES,
    acknowledge_event,
    consume_events,
    ensure_consumer_group,
    route_to_dlq,
)
from dealsense.infrastructure.redis_client import close_redis, init_redis
from dealsense_worker.tasks.ingest import process_stream_event

logger = structlog.get_logger(__name__)

_shutdown = False


def handle_signal(signum: int, frame: object) -> None:
    """Handle termination signals gracefully."""
    global _shutdown
    logger.info("shutdown_signal_received", signal=signum)
    _shutdown = True


async def run_worker() -> None:
    """Main worker event loop."""
    global _shutdown

    # Unique consumer ID
    consumer_name = f"worker-{os.getpid()}-{uuid4().hex[:6]}"
    logger.info("worker_starting", consumer_name=consumer_name)

    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)

    # Initialize storage & queue connections
    await init_db()
    await init_redis()
    await ensure_consumer_group()

    logger.info("worker_ready_listening_for_events", stream=DEFAULT_STREAM, group=DEFAULT_GROUP)

    while not _shutdown:
        try:
            # Poll Redis Streams
            messages = await consume_events(
                consumer_name=consumer_name,
                count=10,
                block_ms=2000,
            )

            if not messages:
                await asyncio.sleep(0.1)
                continue

            for message_id, fields in messages:
                if _shutdown:
                    break

                retry_count = int(fields.get("retry_count", 0))

                try:
                    async with get_db_session() as db:
                        success = await process_stream_event(event_fields=fields, db=db)

                    if success:
                        await acknowledge_event(message_id)
                    else:
                        raise DealSenseError("Stream event processing returned failure")

                except Exception as e:
                    logger.error(
                        "event_processing_error",
                        message_id=message_id,
                        retry_count=retry_count,
                        error=str(e),
                    )
                    if retry_count >= MAX_RETRIES:
                        await route_to_dlq(
                            message_id=message_id,
                            original_fields=fields,
                            error_message=str(e),
                        )
                    else:
                        # Re-publish with incremented retry count
                        # Note: message remains un-acked or will be retried
                        await asyncio.sleep(1)

        except Exception as e:
            logger.error("worker_loop_exception", error=str(e))
            await asyncio.sleep(2)

    logger.info("worker_cleaning_up_resources")
    await close_redis()
    await close_db()
    logger.info("worker_shutdown_complete")


def main() -> None:
    """Entry point."""
    try:
        asyncio.run(run_worker())
    except KeyboardInterrupt:
        logger.info("worker_interrupted")
        sys.exit(0)


if __name__ == "__main__":
    main()
