#!/usr/bin/env python3
"""DealSense — Cloud API Keep-Alive & Warm-Up Sentinel.

Pings the live Render API health probe periodically to prevent the free-tier
instance from sleeping (Render spins down after 15 minutes of inactivity).
Ensures instant sub-100ms response times during live interview calls.

Usage:
    # Run once to warm up before an interview:
    python scripts/demo/keep_alive.py --once

    # Run continuously (pings every 10 minutes):
    python scripts/demo/keep_alive.py

    # Custom interval (e.g. 5 minutes):
    python scripts/demo/keep_alive.py --interval 300
"""

import argparse
import asyncio
import sys
import time
from datetime import datetime, timezone

# Ensure UTF-8 output encoding on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

try:
    import httpx
except ImportError:
    print("ERROR: httpx is required. Install with: pip install httpx")
    sys.exit(1)

DEFAULT_URL = "https://dealsense-api-6o2h.onrender.com/api/v1/health"


async def ping(url: str, timeout: float = 30.0) -> tuple[bool, int, float, str]:
    """Ping health endpoint and measure latency."""
    start = time.monotonic()
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.get(url)
            elapsed = (time.monotonic() - start) * 1000
            return (resp.status_code == 200, resp.status_code, elapsed, resp.text)
    except httpx.TimeoutException:
        elapsed = (time.monotonic() - start) * 1000
        return (False, 408, elapsed, "Timeout (Cold Start in progress)")
    except Exception as e:
        elapsed = (time.monotonic() - start) * 1000
        return (False, 0, elapsed, str(e))


async def main() -> None:
    parser = argparse.ArgumentParser(description="DealSense Cloud API Keep-Alive Sentinel")
    parser.add_argument("--url", default=DEFAULT_URL, help=f"Health probe URL (default: {DEFAULT_URL})")
    parser.add_argument("--interval", type=int, default=600, help="Interval in seconds between pings (default: 600s / 10 min)")
    parser.add_argument("--once", action="store_true", help="Ping once to warm up and exit")
    args = parser.parse_args()

    print("=" * 65)
    print("  🌐 DealSense Cloud API Warm-Up & Keep-Alive Sentinel")
    print(f"  🎯 Target: {args.url}")
    print(f"  ⏰ Mode:   {'One-shot Warm-up' if args.once else f'Continuous (every {args.interval}s)'}")
    print("=" * 65)

    iteration = 0
    success_count = 0

    while True:
        iteration += 1
        now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        print(f"\n[{now}] Ping #{iteration}...", end=" ", flush=True)

        ok, status, elapsed, body = await ping(args.url)

        if ok:
            success_count += 1
            print(f"🟢 {status} OK — {elapsed:.1f}ms (WARM)")
        else:
            print(f"🔴 Status {status} — {elapsed:.1f}ms — {body}")

        if args.once:
            print("\n" + "=" * 65)
            if ok:
                print(f"  ✅ Cloud API is warm and ready for interview demo! ({elapsed:.1f}ms)")
            else:
                print("  ⚠️  Cloud API did not respond with 200. Please check Render status.")
            print("=" * 65)
            break

        await asyncio.sleep(args.interval)


if __name__ == "__main__":
    asyncio.run(main())
