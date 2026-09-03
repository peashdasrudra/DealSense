"""DealSense API — Redis Client Infrastructure.

Connection pool, typed helper methods, and distributed locking.
"""

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
            socket_connect_timeout=5,
            socket_timeout=5,
            retry_on_timeout=True,
        )
    return _redis_pool


async def init_redis() -> None:
    """Initialize Redis connection. Called during app startup."""
    client = get_redis()
    await client.ping()


async def close_redis() -> None:
    """Close Redis connections. Called during app shutdown."""
    global _redis_pool
    if _redis_pool is not None:
        await _redis_pool.close()
        _redis_pool = None


import time

_memory_cache: dict[str, tuple[str, float]] = {}

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
) -> redis.lock.Lock | None:
    """Acquire a distributed lock. Returns the lock if acquired, None otherwise."""
    client = get_redis()
    lock = client.lock(lock_name, timeout=timeout)
    acquired = await lock.acquire(blocking_timeout=blocking_timeout)
    if acquired:
        return lock
    return None


async def release_lock(lock: redis.lock.Lock) -> None:
    """Release a distributed lock."""
    with suppress(redis.exceptions.LockNotOwnedError):
        await lock.release()
