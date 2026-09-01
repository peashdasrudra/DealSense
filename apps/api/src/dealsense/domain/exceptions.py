"""DealSense API — Custom Exception Hierarchy.

Structured exceptions for clean error handling and API error responses.
"""


class DealSenseError(Exception):
    """Base exception for all DealSense errors."""

    def __init__(self, message: str, code: str = "INTERNAL_ERROR") -> None:
        self.message = message
        self.code = code
        super().__init__(message)


# ---- Authentication & Authorization ----


class AuthenticationError(DealSenseError):
    """Raised when authentication fails."""

    def __init__(self, message: str = "Authentication failed") -> None:
        super().__init__(message, code="AUTHENTICATION_FAILED")


class AuthorizationError(DealSenseError):
    """Raised when a user lacks required permissions."""

    def __init__(self, message: str = "Insufficient permissions") -> None:
        super().__init__(message, code="AUTHORIZATION_FAILED")


# ---- Tenant ----


class TenantNotFoundError(DealSenseError):
    """Raised when a tenant does not exist."""

    def __init__(self, tenant_id: str) -> None:
        # Do NOT include tenant secrets in error messages
        super().__init__(f"Tenant not found: {tenant_id}", code="TENANT_NOT_FOUND")


class TenantSuspendedError(DealSenseError):
    """Raised when operating on a suspended tenant."""

    def __init__(self, tenant_id: str) -> None:
        super().__init__(f"Tenant is suspended: {tenant_id}", code="TENANT_SUSPENDED")


class CrossTenantAccessError(DealSenseError):
    """Raised when a request attempts to access another tenant's data."""

    def __init__(self) -> None:
        super().__init__(
            "Cross-tenant access denied", code="CROSS_TENANT_ACCESS_DENIED"
        )


# ---- OAuth ----


class OAuthError(DealSenseError):
    """Base exception for OAuth-related errors."""

    def __init__(self, message: str = "OAuth error") -> None:
        super().__init__(message, code="OAUTH_ERROR")


class OAuthStateValidationError(OAuthError):
    """Raised when OAuth state (CSRF) validation fails."""

    def __init__(self) -> None:
        super().__init__("OAuth state validation failed — possible CSRF attack")


class OAuthTokenRefreshError(OAuthError):
    """Raised when token refresh fails."""

    def __init__(self, message: str = "Token refresh failed") -> None:
        super().__init__(message)


class OAuthTokenExpiredError(OAuthError):
    """Raised when tokens are expired and refresh is not possible."""

    def __init__(self) -> None:
        super().__init__("OAuth tokens expired — reauthorization required")


# ---- Webhook ----


class WebhookValidationError(DealSenseError):
    """Raised when webhook signature or timestamp validation fails."""

    def __init__(self, message: str = "Webhook validation failed") -> None:
        super().__init__(message, code="WEBHOOK_VALIDATION_FAILED")


class WebhookReplayError(WebhookValidationError):
    """Raised when a webhook event is detected as a replay."""

    def __init__(self) -> None:
        super().__init__("Webhook replay detected — timestamp too old")


class DuplicateWebhookError(DealSenseError):
    """Raised when a duplicate webhook event is detected."""

    def __init__(self, idempotency_key: str) -> None:
        super().__init__(
            f"Duplicate webhook event: {idempotency_key}",
            code="DUPLICATE_WEBHOOK",
        )


# ---- Deal / CRM ----


class DealNotFoundError(DealSenseError):
    """Raised when a deal does not exist."""

    def __init__(self, deal_id: str) -> None:
        super().__init__(f"Deal not found: {deal_id}", code="DEAL_NOT_FOUND")


class SnapshotNotFoundError(DealSenseError):
    """Raised when no snapshot exists for a deal."""

    def __init__(self, deal_id: str) -> None:
        super().__init__(
            f"No analysis snapshot found for deal: {deal_id}",
            code="SNAPSHOT_NOT_FOUND",
        )


# ---- Action ----


class ActionNotFoundError(DealSenseError):
    """Raised when an action proposal does not exist."""

    def __init__(self, action_id: str) -> None:
        super().__init__(f"Action not found: {action_id}", code="ACTION_NOT_FOUND")


class ActionNotApprovedError(DealSenseError):
    """Raised when attempting to execute a non-approved action."""

    def __init__(self, action_id: str) -> None:
        super().__init__(
            f"Action not approved: {action_id}", code="ACTION_NOT_APPROVED"
        )


class ActionExecutionError(DealSenseError):
    """Raised when action execution against HubSpot fails."""

    def __init__(self, message: str) -> None:
        super().__init__(message, code="ACTION_EXECUTION_FAILED")


# ---- AI / LLM ----


class LLMError(DealSenseError):
    """Base exception for LLM-related errors."""

    def __init__(self, message: str = "LLM error") -> None:
        super().__init__(message, code="LLM_ERROR")


class LLMExtractionError(LLMError):
    """Raised when structured LLM extraction fails validation."""

    def __init__(self, message: str = "LLM extraction failed schema validation") -> None:
        super().__init__(message)


class RetrievalError(DealSenseError):
    """Raised when evidence retrieval fails."""

    def __init__(self, message: str = "Evidence retrieval failed") -> None:
        super().__init__(message, code="RETRIEVAL_ERROR")


# ---- Infrastructure ----


class EncryptionError(DealSenseError):
    """Raised when encryption or decryption operations fail."""

    def __init__(self, message: str = "Encryption operation failed") -> None:
        super().__init__(message, code="ENCRYPTION_ERROR")


class QueueError(DealSenseError):
    """Raised when queue operations fail."""

    def __init__(self, message: str = "Queue operation failed") -> None:
        super().__init__(message, code="QUEUE_ERROR")
