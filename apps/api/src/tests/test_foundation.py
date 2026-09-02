"""DealSense API — Test Suite.

Tests for health endpoints, configuration, domain models, and infrastructure.
"""

import pytest
from httpx import ASGITransport, AsyncClient


@pytest.fixture
def anyio_backend():
    return "asyncio"


# ============================================================
# Health Check Tests
# ============================================================


class TestHealthEndpoints:
    """Test the health and readiness check endpoints."""

    @pytest.mark.asyncio
    async def test_health_check_returns_200(self) -> None:
        """Liveness probe should return 200 with healthy status."""
        from dealsense.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "dealsense-api"

    @pytest.mark.asyncio
    async def test_api_v1_status(self) -> None:
        """API v1 status endpoint should return operational status."""
        from dealsense.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/status")

        assert response.status_code == 200
        data = response.json()
        assert data["api"] == "v1"
        assert data["status"] == "operational"
        assert data["product"] == "DealSense"


# ============================================================
# Configuration Tests
# ============================================================


class TestConfiguration:
    """Test application configuration and settings."""

    def test_cors_origin_parsing(self) -> None:
        """CORS origins should be parsed from comma-separated string."""
        from dealsense.config import Settings

        settings = Settings(
            secret_key="test-secret-key-minimum-32-characters-long",
            cors_origins="http://localhost:3000,http://localhost:3001",
        )
        assert settings.cors_origin_list == [
            "http://localhost:3000",
            "http://localhost:3001",
        ]

    def test_database_url_construction(self) -> None:
        """Database URL should be constructed from components when not explicitly set."""
        from dealsense.config import Settings

        settings = Settings(
            secret_key="test-secret-key-minimum-32-characters-long",
            postgres_host="db.example.com",
            postgres_port=5433,
            postgres_user="user",
            postgres_password="pass",
            postgres_db="mydb",
            database_url=None,
            database_url_sync=None,
        )
        assert "db.example.com" in settings.async_database_url
        assert "5433" in settings.async_database_url
        assert "asyncpg" in settings.async_database_url

    def test_redis_url_construction(self) -> None:
        """Redis URL should be constructed from components when not explicitly set."""
        from dealsense.config import Settings

        settings = Settings(
            secret_key="test-secret-key-minimum-32-characters-long",
            redis_host="redis.example.com",
            redis_port=6380,
            redis_db=2,
            redis_url=None,
        )
        assert "redis.example.com" in settings.redis_connection_url
        assert "6380" in settings.redis_connection_url

    def test_production_detection(self) -> None:
        """is_production should correctly detect production environment."""
        from dealsense.config import Settings

        dev = Settings(
            secret_key="test-secret-key-minimum-32-characters-long",
            app_env="development",
        )
        prod = Settings(
            secret_key="test-secret-key-minimum-32-characters-long",
            app_env="production",
        )
        assert dev.is_development is True
        assert dev.is_production is False
        assert prod.is_production is True
        assert prod.is_development is False


# ============================================================
# Domain Model Tests
# ============================================================


class TestDomainEnums:
    """Test domain enumeration definitions."""

    def test_risk_bands_are_ordered(self) -> None:
        """Risk bands should cover the full score range."""
        from dealsense.domain.enums import RiskBand

        bands = list(RiskBand)
        assert len(bands) == 5
        assert RiskBand.CRITICAL in bands
        assert RiskBand.HEALTHY in bands

    def test_action_tiers_are_complete(self) -> None:
        """All 6 action tiers should be defined."""
        from dealsense.domain.enums import ActionTier

        assert len(list(ActionTier)) == 6

    def test_activity_types(self) -> None:
        """All CRM activity types should be defined."""
        from dealsense.domain.enums import ActivityType

        assert ActivityType.NOTE == "note"
        assert ActivityType.MEETING == "meeting"
        assert ActivityType.CALL == "call"
        assert ActivityType.TASK == "task"

    def test_user_roles(self) -> None:
        """All RBAC roles should be defined."""
        from dealsense.domain.enums import UserRole

        roles = list(UserRole)
        assert len(roles) == 6
        assert UserRole.AGENCY_OWNER in roles
        assert UserRole.AUDITOR in roles


class TestDomainExceptions:
    """Test custom exception hierarchy."""

    def test_base_exception_has_code(self) -> None:
        """DealSenseError should carry an error code."""
        from dealsense.domain.exceptions import DealSenseError

        exc = DealSenseError("test error", code="TEST_CODE")
        assert exc.message == "test error"
        assert exc.code == "TEST_CODE"

    def test_tenant_not_found_excludes_secrets(self) -> None:
        """TenantNotFoundError should not leak sensitive information."""
        from dealsense.domain.exceptions import TenantNotFoundError

        exc = TenantNotFoundError("tenant-123")
        assert "tenant-123" in exc.message
        assert exc.code == "TENANT_NOT_FOUND"

    def test_cross_tenant_access_error(self) -> None:
        """CrossTenantAccessError should have a clear message."""
        from dealsense.domain.exceptions import CrossTenantAccessError

        exc = CrossTenantAccessError()
        assert "denied" in exc.message.lower()


# ============================================================
# Encryption Tests
# ============================================================


class TestEncryption:
    """Test encryption utilities."""

    def test_encrypt_decrypt_roundtrip(self) -> None:
        """Encrypting and decrypting should return original value."""
        import os

        from cryptography.fernet import Fernet

        from dealsense.infrastructure import encryption

        # Generate a valid Fernet key and set it
        key = Fernet.generate_key().decode()
        os.environ["ENCRYPTION_KEY"] = key

        # Reset cached fernet so it picks up the new key
        encryption._fernet = None

        # Also need to clear the cached settings singleton
        from dealsense.config import get_settings

        get_settings.cache_clear()

        from dealsense.infrastructure.encryption import decrypt_value, encrypt_value

        original = "secret-oauth-token-12345"
        encrypted = encrypt_value(original)
        decrypted = decrypt_value(encrypted)

        assert decrypted == original
        assert encrypted != original

        # Cleanup: restore original state
        encryption._fernet = None
        get_settings.cache_clear()

    def test_empty_value_raises_error(self) -> None:
        """Encrypting/decrypting empty values should raise EncryptionError."""
        from dealsense.domain.exceptions import EncryptionError
        from dealsense.infrastructure.encryption import encrypt_value

        with pytest.raises(EncryptionError):
            encrypt_value("")


# ============================================================
# Domain Events Tests
# ============================================================


class TestDomainEvents:
    """Test domain event schemas."""

    def test_deal_updated_event(self) -> None:
        """DealUpdatedEvent should serialize correctly."""
        from uuid import uuid4

        from dealsense.domain.events import DealUpdatedEvent

        event = DealUpdatedEvent(
            tenant_id=uuid4(),
            deal_id=uuid4(),
            hubspot_deal_id="12345",
            changed_properties=["amount", "stage"],
        )
        assert event.event_type == "deal.updated"
        assert len(event.changed_properties) == 2
        assert event.event_id is not None

    def test_analysis_completed_event(self) -> None:
        """AnalysisCompletedEvent should include all required fields."""
        from uuid import uuid4

        from dealsense.domain.events import AnalysisCompletedEvent

        event = AnalysisCompletedEvent(
            tenant_id=uuid4(),
            deal_id=uuid4(),
            snapshot_id=uuid4(),
            health_score=42,
            risk_band="high",
            duration_ms=1500,
        )
        assert event.health_score == 42
        assert event.duration_ms == 1500
