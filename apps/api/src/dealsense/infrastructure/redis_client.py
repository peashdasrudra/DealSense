"""DealSense API — Redis Client Infrastructure.

Connection pool, typed helper methods, and distributed locking.
"""

import time
from contextlib import suppress

import redis.asyncio as redis

from dealsense.config import get_settings

_redis_pool: redis.Redis | None = None  # type: ignore[type-arg]


def get_redis() -> redis.Redis:  # type: ignore[type-arg]
    """Get or create the Redis connection pool."""
    global _redis_pool
    if _redis_pool is None:
        settings = get_settings()
        _redis_pool = redis.from_url(
            settings.redis_connection_url,
            encoding="utf-8",
            decode_responses=True,
            max_connections=50,
            socket_connect_timeout=2,
            socket_timeout=2,
            retry_on_timeout=False,
        )
    return _redis_pool


async def init_redis() -> None:
    """Initialize Redis connection. Called during app startup."""
    try:
        client = get_redis()
        await client.ping()
    except Exception:
        pass


async def close_redis() -> None:
    """Close Redis connections. Called during app shutdown."""
    global _redis_pool
    if _redis_pool is not None:
        with suppress(Exception):
            await _redis_pool.close()
        _redis_pool = None



_memory_cache: dict[str, tuple[str, float]] = {}


class _InMemoryLock:
    """Lightweight in-memory lock fallback when Redis is unprovisioned or unreachable."""

    def __init__(self, name: str) -> None:
        self.name = name

    async def acquire(self, *args: object, **kwargs: object) -> bool:
        return True

    async def release(self, *args: object, **kwargs: object) -> None:
        pass


# ---- Typed Helper Methods ----


async def cache_get(key: str) -> str | None:
    """Get a cached value by key with memory fallback."""
    try:
        client = get_redis()
        return await client.get(key)
    except Exception:
        if key in _memory_cache:
            val, expires_at = _memory_cache[key]
            if time.time() < expires_at:
                return val
            _memory_cache.pop(key, None)
        return None


async def cache_set(key: str, value: str, ttl_seconds: int = 3600) -> None:
    """Set a cached value with TTL with memory fallback."""
    try:
        client = get_redis()
        await client.set(key, value, ex=ttl_seconds)
    except Exception:
        _memory_cache[key] = (value, time.time() + ttl_seconds)


async def cache_delete(key: str) -> None:
    """Delete a cached value with memory fallback."""
    try:
        client = get_redis()
        await client.delete(key)
    except Exception:
        _memory_cache.pop(key, None)


async def acquire_lock(
    lock_name: str, timeout: int = 30, blocking_timeout: int = 10
) -> object:
    """Acquire a distributed lock. Returns the lock if acquired, or in-memory fallback."""
    try:
        client = get_redis()
        lock = client.lock(lock_name, timeout=timeout)
        acquired = await lock.acquire(blocking_timeout=blocking_timeout)
        if acquired:
            return lock
        return None
    except Exception:
        return _InMemoryLock(lock_name)


async def release_lock(lock: object) -> None:
    """Release a distributed lock."""
    if not lock or isinstance(lock, _InMemoryLock):
        return
    try:
        with suppress(redis.exceptions.LockNotOwnedError, Exception):
            if hasattr(lock, "release"):
                await lock.release()  # type: ignore[misc]
    except Exception:
        pass
