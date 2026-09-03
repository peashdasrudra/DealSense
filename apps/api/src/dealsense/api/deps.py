"""DealSense API — Dependency Injection.

FastAPI dependencies for database sessions, Redis, and request context.
"""

from collections.abc import AsyncGenerator
from contextlib import suppress
from uuid import UUID

from fastapi import Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.infrastructure.database import get_session_factory
from dealsense.infrastructure.redis_client import get_redis as _get_redis


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Provide a database session for request handlers.

    Session is committed on success, rolled back on error, and
    always closed when the request completes.
    """
    factory = get_session_factory()
    session = factory()
    try:
        yield session
        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()


async def get_db_optional() -> AsyncGenerator[AsyncSession | None, None]:
    """Provide a database session or None if database is offline/unreachable."""
    try:
        factory = get_session_factory()
        session = factory()
    except Exception:
        yield None
        return

    try:
        yield session
        await session.commit()
    except Exception:
        with suppress(Exception):
            await session.rollback()
        yield None
    finally:
        with suppress(Exception):
            await session.close()


async def get_redis_client():  # type: ignore[no-untyped-def]
    """Provide the Redis client."""
    return _get_redis()


async def get_tenant_id(
    x_tenant_id: str | None = Header(None, alias="X-Tenant-ID"),
) -> UUID:
    """Extract and validate tenant ID from request headers.

    For HubSpot UI Extension requests, this will be derived from the
    portal ID. For dashboard requests, it comes from the authenticated session.
    """
    if not x_tenant_id:
        raise HTTPException(
            status_code=400,
            detail="X-Tenant-ID header is required",
        )
    try:
        return UUID(x_tenant_id)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail="Invalid tenant ID format",
        ) from e


async def get_request_id(
    x_request_id: str | None = Header(None, alias="X-Request-ID"),
) -> str:
    """Extract or generate a request ID for tracing."""
    if x_request_id:
        return x_request_id
    from uuid import uuid4

    return str(uuid4())
