#!/usr/bin/env python3
"""DealSense — Live Interview Demo Orchestrator.

Single-command script that validates environment, runs the test suite,
verifies API endpoints, and generates a live integration proof report.

Usage:
    python scripts/demo/run_live_demo.py

This script is designed to be run BEFORE your interview to:
1. Verify all credentials and services are configured
2. Run the full test suite and capture results
3. Hit every API endpoint and verify responses
4. Generate a timestamped proof report
"""

import asyncio
import json
import os
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

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

# Project root
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
API_BASE = "http://localhost:8000"


def banner(text: str) -> None:
    """Print a formatted banner."""
    print(f"\n{'=' * 60}")
    print(f"  {text}")
    print(f"{'=' * 60}\n")


def check(label: str, passed: bool, detail: str = "") -> bool:
    """Print a check result."""
    icon = "✅" if passed else "❌"
    msg = f"  {icon} {label}"
    if detail:
        msg += f" — {detail}"
    print(msg)
    return passed


class DemoOrchestrator:
    """Orchestrates the complete live demo verification pipeline."""

    def __init__(self) -> None:
        self.results: dict[str, dict] = {}
        self.start_time = time.time()

    def validate_environment(self) -> bool:
        """Check all required environment variables and files."""
        banner("🔑 Environment Validation")

        all_ok = True
        # Required env vars
        checks = {
            "SECRET_KEY": os.environ.get("SECRET_KEY"),
            "HUBSPOT_CLIENT_ID": os.environ.get("HUBSPOT_CLIENT_ID"),
            "HUBSPOT_CLIENT_SECRET": os.environ.get("HUBSPOT_CLIENT_SECRET"),
            "HUBSPOT_APP_ID": os.environ.get("HUBSPOT_APP_ID"),
        }

        for key, value in checks.items():
            has_value = bool(value) and value not in ("your-hubspot-client-id", "your-hubspot-client-secret", "your-hubspot-app-id", "change-me-to-a-random-secret-key-min-32-chars")
            if not check(key, has_value, "configured" if has_value else "NOT SET or placeholder"):
                all_ok = False

        # Check .env file
        env_file = ROOT_DIR / ".env"
        check(".env file exists", env_file.exists())

        # Check API code exists
        main_py = ROOT_DIR / "apps" / "api" / "src" / "dealsense" / "main.py"
        check("API main.py exists", main_py.exists())

        # Check dashboard exists
        app_tsx = ROOT_DIR / "apps" / "web-dashboard" / "src" / "App.tsx"
        check("Dashboard App.tsx exists", app_tsx.exists())

        self.results["environment"] = {"valid": all_ok}
        return all_ok

    def run_test_suite(self) -> dict:
        """Run the complete pytest suite and capture results."""
        banner("🧪 Running Test Suite")

        api_dir = ROOT_DIR / "apps" / "api"
        start = time.time()

        try:
            result = subprocess.run(
                [sys.executable, "-m", "pytest", "src/tests/", "-v", "--tb=short", "--no-header", "-q"],
                cwd=str(api_dir),
                capture_output=True,
                text=True,
                timeout=120,
            )
            duration = time.time() - start

            output = result.stdout + result.stderr
            passed = output.count(" PASSED") + output.count(" passed")
            failed = output.count(" FAILED") + output.count(" failed")

            print(output)

            test_result = {
                "passed": passed,
                "failed": failed,
                "duration_seconds": round(duration, 2),
                "exit_code": result.returncode,
                "success": result.returncode == 0,
            }

            check(
                f"Test Suite: {passed} passed, {failed} failed",
                result.returncode == 0,
                f"in {duration:.1f}s",
            )

            self.results["test_suite"] = test_result
            return test_result

        except subprocess.TimeoutExpired:
            print("  ⏱️  Test suite timed out after 120s")
            self.results["test_suite"] = {"success": False, "error": "timeout"}
            return {"success": False}
        except Exception as e:
            print(f"  ❌ Error running tests: {e}")
            self.results["test_suite"] = {"success": False, "error": str(e)}
            return {"success": False}

    async def verify_api_endpoints(self) -> dict:
        """Hit every major API endpoint and verify responses."""
        banner("🌐 API Endpoint Verification")

        endpoints = [
            ("GET", "/", "Root Health"),
            ("GET", "/health", "Liveness Probe"),
            ("GET", "/api/v1/health", "API v1 Health"),
            ("GET", "/api/v1/status", "API Status"),
            ("GET", "/api/v1/oauth/authorize", "OAuth Authorize URL"),
            ("GET", "/api/v1/oauth/install", "OAuth Install URL"),
            ("GET", "/api/v1/proof/health-matrix", "Health Matrix (Proof)"),
            ("GET", "/api/v1/proof/oauth-status", "OAuth Status (Proof)"),
            ("GET", "/api/v1/proof/rbac-matrix", "RBAC Matrix (Proof)"),
            ("GET", "/api/v1/proof/architecture", "Architecture (Proof)"),
            ("GET", "/api/v1/proof/test-results", "Test Results (Proof)"),
        ]

        results = {}
        all_ok = True

        async with httpx.AsyncClient(base_url=API_BASE, timeout=10.0) as client:
            for method, path, label in endpoints:
                try:
                    start = time.monotonic()
                    if method == "GET":
                        response = await client.get(path)
                    else:
                        response = await client.post(path, json={})
                    latency = (time.monotonic() - start) * 1000

                    passed = response.status_code == 200
                    results[path] = {
                        "status_code": response.status_code,
                        "latency_ms": round(latency, 1),
                        "success": passed,
                    }

                    if not check(f"{method} {path}", passed, f"{response.status_code} ({latency:.0f}ms)"):
                        all_ok = False

                except Exception as e:
                    results[path] = {"error": str(e), "success": False}
                    check(f"{method} {path}", False, str(e))
                    all_ok = False

            # Test POST endpoints
            try:
                # Webhook signature test
                start = time.monotonic()
                response = await client.post(
                    "/api/v1/proof/test-webhook",
                    json={"payload": '{"eventId": 12345}'},
                )
                latency = (time.monotonic() - start) * 1000
                passed = response.status_code == 200 and response.json().get("signature_verified")
                check("POST /api/v1/proof/test-webhook", passed, f"HMAC Verified ({latency:.0f}ms)")
                results["/api/v1/proof/test-webhook"] = {
                    "status_code": response.status_code,
                    "latency_ms": round(latency, 1),
                    "success": passed,
                }
            except Exception as e:
                check("POST /api/v1/proof/test-webhook", False, str(e))

            try:
                # Encryption roundtrip test
                start = time.monotonic()
                response = await client.post("/api/v1/proof/test-encryption")
                latency = (time.monotonic() - start) * 1000
                passed = response.status_code == 200 and response.json().get("decrypted_matches")
                check("POST /api/v1/proof/test-encryption", passed, f"AES-256 Roundtrip ({latency:.0f}ms)")
                results["/api/v1/proof/test-encryption"] = {
                    "status_code": response.status_code,
                    "latency_ms": round(latency, 1),
                    "success": passed,
                }
            except Exception as e:
                check("POST /api/v1/proof/test-encryption", False, str(e))

        self.results["api_endpoints"] = results
        return results

    def generate_report(self) -> None:
        """Generate a timestamped integration proof report."""
        banner("📊 Integration Proof Report")

        report = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "project": "DealSense — Autonomous Revenue Intelligence Platform",
            "version": "0.1.0",
            "total_duration_seconds": round(time.time() - self.start_time, 2),
            "results": self.results,
        }

        # Save to file
        report_dir = ROOT_DIR / "docs" / "reports"
        report_dir.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_path = report_dir / f"integration_proof_{timestamp}.json"
        report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
        print(f"  📄 Report saved: {report_path}")

        # Print summary
        env_ok = self.results.get("environment", {}).get("valid", False)
        tests_ok = self.results.get("test_suite", {}).get("success", False)
        api_results = self.results.get("api_endpoints", {})
        api_ok = all(r.get("success", False) for r in api_results.values()) if api_results else False

        print(f"\n  {'✅' if env_ok else '❌'} Environment:  {'Valid' if env_ok else 'Issues Found'}")
        print(f"  {'✅' if tests_ok else '❌'} Test Suite:   {self.results.get('test_suite', {}).get('passed', 0)} passed")
        print(f"  {'✅' if api_ok else '⚠️'}  API Health:   {sum(1 for r in api_results.values() if r.get('success'))} / {len(api_results)} endpoints")
        print(f"\n  ⏱️  Total Duration: {time.time() - self.start_time:.1f}s")

    async def run(self) -> None:
        """Execute the full demo verification pipeline."""
        banner("🚀 DealSense — Live Interview Demo Orchestrator")
        print(f"  Timestamp: {datetime.now(timezone.utc).isoformat()}")
        print(f"  Project Root: {ROOT_DIR}")

        # 1. Validate environment
        self.validate_environment()

        # 2. Run test suite
        self.run_test_suite()

        # 3. Verify API endpoints (requires running server)
        print("\n  ℹ️  Checking if API server is running...")
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                response = await client.get(f"{API_BASE}/health")
                if response.status_code == 200:
                    print("  ✅ API server is running!")
                    await self.verify_api_endpoints()
                else:
                    print("  ⚠️  API server returned non-200. Start it with:")
                    print("      uvicorn dealsense.main:app --reload --port 8000")
        except Exception:
            print("  ⚠️  API server not running. Start it with:")
            print("      cd apps/api && uvicorn dealsense.main:app --reload --port 8000")
            print("      Then re-run this script to test endpoints.")

        # 4. Generate report
        self.generate_report()

        banner("🎯 Interview Preparation Complete!")
        print("  Next steps:")
        print("  1. Start API:       cd apps/api && uvicorn dealsense.main:app --reload --port 8000")
        print("  2. Start Dashboard: cd apps/web-dashboard && npm run dev")
        print("  3. Open:            http://localhost:3000/integration-proof")
        print("  4. Show live OAuth, API health, and test results to interviewer")
        print()


async def main() -> None:
    # Load .env if present
    env_file = ROOT_DIR / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())

    orchestrator = DemoOrchestrator()
    await orchestrator.run()


if __name__ == "__main__":
    asyncio.run(main())
