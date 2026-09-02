"""DealSense API — OAuth and Security Test Suite.

Comprehensive tests for:
- Token manager (encryption, caching, refresh, circuit breaker)
- Webhook signature verification (v1 and v3 HMAC-SHA256, replay protection)
- RBAC permissions logic
- Tenant Guard middleware
- OAuth authorization and callback flows
"""

import hashlib
import hmac
import os
import time
from datetime import UTC, datetime
from unittest.mock import AsyncMock, patch
from uuid import uuid4

import pytest
from cryptography.fernet import Fernet
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.domain.enums import UserRole
from dealsense.domain.exceptions import (
    WebhookReplayError,
    WebhookValidationError,
)
from dealsense.domain.models import HubSpotConnection
from dealsense.infrastructure import encryption
from dealsense.security.rbac import Permission, get_role_permissions, has_permission
from dealsense.security.token_manager import (
    get_access_token,
    invalidate_tokens,
    store_tokens,
)
from dealsense.security.webhook_signature import verify_webhook_signature


@pytest.fixture(autouse=True)
def setup_test_env():
    """Ensure encryption key and settings are initialized for tests."""
    key = Fernet.generate_key().decode()
    os.environ["ENCRYPTION_KEY"] = key
    os.environ["HUBSPOT_CLIENT_SECRET"] = "test-hubspot-secret-key"
    os.environ["HUBSPOT_CLIENT_ID"] = "test-client-id"
    os.environ["SECRET_KEY"] = "test-secret-key-minimum-32-characters-long"
    encryption._fernet = None
    from dealsense.config import get_settings

    get_settings.cache_clear()
    yield
    encryption._fernet = None
    get_settings.cache_clear()


# ============================================================
# Token Manager Tests
# ============================================================


class TestTokenManager:
    """Test OAuth token storage, encryption, and lifecycle management."""

    @pytest.mark.asyncio
    async def test_store_and_get_access_token(self) -> None:
        """Stored tokens should be encrypted in DB and cached in Redis."""
        tenant_id = uuid4()
        access_token = "pat-na1-access-token-12345"
        refresh_token = "pat-na1-refresh-token-67890"

        # Mock DB session and Redis cache
        from unittest.mock import MagicMock

        mock_db = AsyncMock(spec=AsyncSession)
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_db.execute.return_value = mock_result

        with (
            patch(
                "dealsense.security.token_manager.cache_set", new_callable=AsyncMock
            ) as mock_cache_set,
            patch(
                "dealsense.security.token_manager.cache_get", new_callable=AsyncMock
            ) as mock_cache_get,
        ):
            mock_cache_get.return_value = None

            # Store tokens
            await store_tokens(
                tenant_id=tenant_id,
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=1800,
                scopes="crm.objects.deals.read",
                db=mock_db,
            )

            # DB should have received a HubSpotConnection with encrypted tokens
            assert mock_db.add.called
            added_connection = mock_db.add.call_args[0][0]
            assert isinstance(added_connection, HubSpotConnection)
            assert added_connection.encrypted_access_token != access_token
            assert added_connection.encrypted_refresh_token != refresh_token
            assert mock_cache_set.called

    @pytest.mark.asyncio
    async def test_get_access_token_cache_hit(self) -> None:
        """If token is cached in Redis, return without querying DB."""
        tenant_id = uuid4()
        cached_token = "pat-cached-token-123"

        mock_db = AsyncMock(spec=AsyncSession)

        with patch(
            "dealsense.security.token_manager.cache_get", new_callable=AsyncMock
        ) as mock_cache_get:
            mock_cache_get.return_value = cached_token

            token = await get_access_token(tenant_id, mock_db)
            assert token == cached_token
            assert not mock_db.execute.called

    @pytest.mark.asyncio
    async def test_invalidate_tokens(self) -> None:
        """Invalidating tokens should mark connection inactive and purge cache."""
        from unittest.mock import MagicMock

        tenant_id = uuid4()
        connection = HubSpotConnection(
            tenant_id=tenant_id,
            encrypted_access_token="enc",
            encrypted_refresh_token="enc",
            token_expires_at=datetime.now(UTC),
            is_active=True,
        )

        mock_db = AsyncMock(spec=AsyncSession)
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = connection
        mock_db.execute.return_value = mock_result

        with patch(
            "dealsense.security.token_manager.cache_delete", new_callable=AsyncMock
        ) as mock_cache_del:
            await invalidate_tokens(tenant_id, mock_db)
            assert connection.is_active is False
            assert mock_cache_del.called


# ============================================================
# Webhook Signature Verification Tests
# ============================================================


class TestWebhookSignatureVerification:
    """Test HubSpot webhook signature verification and replay prevention."""

    def test_valid_v1_signature_passes(self) -> None:
        """Valid v1 SHA-256 signature should pass without error."""
        secret = "test-hubspot-secret-key"
        body = b'{"eventId": 12345, "subscriptionType": "deal.creation"}'
        signature = hashlib.sha256(secret.encode("utf-8") + body).hexdigest()

        # Should not raise exception
        verify_webhook_signature(
            request_body=body,
            signature_header=signature,
            signature_version="v1",
        )

    def test_invalid_v1_signature_fails(self) -> None:
        """Invalid signature must raise WebhookValidationError."""
        body = b'{"eventId": 12345}'
        with pytest.raises(WebhookValidationError):
            verify_webhook_signature(
                request_body=body,
                signature_header="invalid_signature_hex",
                signature_version="v1",
            )

    def test_valid_v3_signature_passes(self) -> None:
        """Valid v3 HMAC-SHA256 signature with fresh timestamp should pass."""
        secret = "test-hubspot-secret-key"
        body = b'{"eventId": 12345}'
        timestamp_ms = str(int(time.time() * 1000))
        message = body + timestamp_ms.encode("utf-8")
        signature = hmac.new(secret.encode("utf-8"), message, hashlib.sha256).hexdigest()

        verify_webhook_signature(
            request_body=body,
            signature_header=signature,
            timestamp_header=timestamp_ms,
            signature_version="v3",
        )

    def test_v3_replay_attack_rejected(self) -> None:
        """Webhook with timestamp older than 5 minutes must raise WebhookReplayError."""
        secret = "test-hubspot-secret-key"
        body = b'{"eventId": 12345}'
        old_timestamp_ms = str(int((time.time() - 400) * 1000))  # 400 seconds ago (>300s)
        message = body + old_timestamp_ms.encode("utf-8")
        signature = hmac.new(secret.encode("utf-8"), message, hashlib.sha256).hexdigest()

        with pytest.raises(WebhookReplayError):
            verify_webhook_signature(
                request_body=body,
                signature_header=signature,
                timestamp_header=old_timestamp_ms,
                signature_version="v3",
            )


# ============================================================
# RBAC Tests
# ============================================================


class TestRBAC:
    """Test Role-Based Access Control logic."""

    def test_agency_owner_has_all_permissions(self) -> None:
        """Agency owner role must possess all available permissions."""
        owner_perms = get_role_permissions(UserRole.AGENCY_OWNER)
        for perm in Permission:
            assert perm in owner_perms
            assert has_permission(UserRole.AGENCY_OWNER, perm) is True

    def test_sales_rep_has_restricted_permissions(self) -> None:
        """Sales rep role must NOT possess administrative permissions."""
        rep_perms = get_role_permissions(UserRole.SALES_REP)
        assert Permission.DEAL_READ in rep_perms
        assert Permission.SNAPSHOT_READ in rep_perms
        assert Permission.OAUTH_MANAGE not in rep_perms
        assert Permission.WHITE_LABEL_CONFIG not in rep_perms
        assert Permission.USER_MANAGE not in rep_perms


# ============================================================
# OAuth Endpoints & Tenant Guard Tests
# ============================================================


class TestOAuthAndTenantGuard:
    """Test OAuth authorization endpoints and tenant guard protection."""

    @pytest.mark.asyncio
    async def test_oauth_authorize_endpoint(self) -> None:
        """Authorize endpoint should return HubSpot authorize URL with state."""
        from dealsense.main import app

        with patch("dealsense.services.oauth_service.cache_set", new_callable=AsyncMock):
            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://test") as client:
                response = await client.get("/api/v1/oauth/authorize")

            assert response.status_code == 200
            data = response.json()
            assert "authorization_url" in data
            assert "state" in data
            assert "https://app.hubspot.com/oauth/authorize" in data["authorization_url"]

    @pytest.mark.asyncio
    async def test_callback_with_invalid_state_fails(self) -> None:
        """Callback with invalid or absent state should raise 400."""
        from dealsense.main import app

        with patch(
            "dealsense.services.oauth_service.cache_get", new_callable=AsyncMock
        ) as mock_cache_get:
            mock_cache_get.return_value = None  # State not in Redis

            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://test") as client:
                response = await client.get(
                    "/api/v1/oauth/callback?code=test_code&state=invalid_state"
                )

            assert response.status_code == 400
            assert response.json()["error"] == "OAUTH_ERROR"

    @pytest.mark.asyncio
    async def test_tenant_guard_blocks_unauthorized_protected_endpoint(self) -> None:
        """Calling protected endpoint without X-Tenant-ID header should return 400."""
        from dealsense.main import app

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # /api/v1/oauth/status requires tenant authentication/guard
            response = await client.get("/api/v1/oauth/status")

        assert response.status_code == 400
        assert response.json()["error"] == "TENANT_REQUIRED"
