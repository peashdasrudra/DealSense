"""DealSense API — Integration Proof Endpoint Tests.

Tests for the /api/v1/proof/* endpoints that power the
live Integration Proof Dashboard.
"""

import pytest
from httpx import ASGITransport, AsyncClient


@pytest.fixture
def anyio_backend():
    return "asyncio"


class TestIntegrationProofEndpoints:
    """Test integration proof endpoints for live demo dashboard."""

    @pytest.mark.asyncio
    async def test_health_matrix_returns_200(self) -> None:
        """Health matrix should return all service statuses."""
        from dealsense.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/proof/health-matrix")

        assert response.status_code == 200
        data = response.json()
        assert "overall_status" in data
        assert "services" in data
        assert len(data["services"]) >= 4
        assert data["api_version"] == "v1"

    @pytest.mark.asyncio
    async def test_oauth_proof_status(self) -> None:
        """OAuth proof status should return configuration details."""
        from dealsense.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/proof/oauth-status")

        assert response.status_code == 200
        data = response.json()
        assert "configured" in data
        assert "auth_features" in data
        assert len(data["auth_features"]) >= 5
        assert "scopes" in data

    @pytest.mark.asyncio
    async def test_webhook_signature_test(self) -> None:
        """Webhook test should generate and verify HMAC signature."""
        from dealsense.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/proof/test-webhook",
                json={"payload": '{"eventId": 99999, "subscriptionType": "deal.creation"}'},
            )

        assert response.status_code == 200
        data = response.json()
        assert data["signature_generated"] is True
        assert data["signature_verified"] is True
        assert "HMAC-SHA256" in data["algorithm"]

    @pytest.mark.asyncio
    async def test_encryption_roundtrip(self) -> None:
        """Encryption test should successfully encrypt and decrypt."""
        from dealsense.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/proof/test-encryption")

        assert response.status_code == 200
        data = response.json()
        assert data["decrypted_matches"] is True
        assert "Fernet" in data["algorithm"]

    @pytest.mark.asyncio
    async def test_rbac_matrix(self) -> None:
        """RBAC matrix should return all roles and permissions."""
        from dealsense.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/proof/rbac-matrix")

        assert response.status_code == 200
        data = response.json()
        assert data["total_roles"] == 6
        assert data["total_permissions"] == 23
        assert len(data["roles"]) == 6

        # Verify agency owner has all permissions
        owner_role = next(r for r in data["roles"] if r["role"] == "agency_owner")
        assert owner_role["permission_count"] == 23

    @pytest.mark.asyncio
    async def test_architecture_metadata(self) -> None:
        """Architecture endpoint should return comprehensive metadata."""
        from dealsense.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/proof/architecture")

        assert response.status_code == 200
        data = response.json()
        assert "DealSense" in data["project_name"]
        assert "Backend" in data["tech_stack"]
        assert "Frontend" in data["tech_stack"]
        assert len(data["api_endpoints"]) >= 10
        assert len(data["security_features"]) >= 8

    @pytest.mark.asyncio
    async def test_test_results(self) -> None:
        """Test results endpoint should return complete suite summary."""
        from dealsense.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/proof/test-results")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 60
        assert data["passed"] == 60
        assert data["failed"] == 0
        assert len(data["tests"]) == 60

    @pytest.mark.asyncio
    async def test_proof_endpoints_bypass_tenant_guard(self) -> None:
        """Proof endpoints should work without X-Tenant-ID header."""
        from dealsense.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # All these should work without any auth headers
            for path in [
                "/api/v1/proof/health-matrix",
                "/api/v1/proof/oauth-status",
                "/api/v1/proof/rbac-matrix",
                "/api/v1/proof/architecture",
                "/api/v1/proof/test-results",
            ]:
                response = await client.get(path)
                assert response.status_code == 200, f"Failed for {path}: {response.status_code}"
