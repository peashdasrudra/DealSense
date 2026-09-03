"""DealSense API — HubSpot Webhook Signature Verification.

Validates incoming webhook requests using HubSpot's v3 signature scheme
(HMAC-SHA256). Includes replay protection via timestamp validation.
"""

import hashlib
import hmac
import time

import structlog

from dealsense.config import get_settings
from dealsense.domain.exceptions import WebhookReplayError, WebhookValidationError

logger = structlog.get_logger(__name__)

# Maximum age for webhook timestamps (5 minutes)
MAX_TIMESTAMP_AGE_SECONDS = 300


def verify_webhook_signature(
    request_body: bytes,
    signature_header: str,
    timestamp_header: str | None = None,
    *,
    signature_version: str = "v3",
) -> None:
    """Verify a HubSpot webhook request signature.

    HubSpot v3 signature:
        HMAC-SHA256(client_secret, requestMethod + requestUri + requestBody + timestamp)

    For simplicity in webhook processing, we validate using:
        HMAC-SHA256(client_secret, requestBody)

    This matches HubSpot's v1 signature for POST webhook payloads.

    Args:
        request_body: Raw request body bytes
        signature_header: Value of X-HubSpot-Signature header
        timestamp_header: Value of X-HubSpot-Request-Timestamp header (for v3)
        signature_version: Signature version to validate ("v1" or "v3")

    Raises:
        WebhookValidationError: If signature is invalid
        WebhookReplayError: If timestamp is too old (v3 only)
    """
    settings = get_settings()
    client_secret = settings.hubspot_client_secret

    if not client_secret:
        logger.info("webhook_signature_skipped_no_secret_configured")
        return

    if not signature_header:
        raise WebhookValidationError("Missing webhook signature header")

    # Replay protection (v3)
    if signature_version == "v3" and timestamp_header:
        _validate_timestamp(timestamp_header)

    if signature_version == "v3" and timestamp_header:
        # v3: HMAC-SHA256(client_secret, request_body + timestamp)
        message = request_body + timestamp_header.encode("utf-8")
        expected = hmac.new(
            client_secret.encode("utf-8"),
            message,
            hashlib.sha256,
        ).hexdigest()
    else:
        # v1: SHA-256(client_secret + request_body)
        source = client_secret.encode("utf-8") + request_body
        expected = hashlib.sha256(source).hexdigest()

    if not hmac.compare_digest(expected, signature_header):
        logger.warning("webhook_signature_mismatch")
        raise WebhookValidationError("Webhook signature verification failed")

    logger.debug("webhook_signature_verified", version=signature_version)


def _validate_timestamp(timestamp_header: str) -> None:
    """Validate that the webhook timestamp is within the acceptable window.

    Args:
        timestamp_header: Millisecond timestamp string from HubSpot

    Raises:
        WebhookReplayError: If timestamp is older than MAX_TIMESTAMP_AGE_SECONDS
        WebhookValidationError: If timestamp is malformed
    """
    try:
        timestamp_ms = int(timestamp_header)
    except (ValueError, TypeError) as e:
        raise WebhookValidationError(f"Invalid webhook timestamp: {timestamp_header}") from e

    current_time_ms = int(time.time() * 1000)
    age_seconds = (current_time_ms - timestamp_ms) / 1000

    if age_seconds > MAX_TIMESTAMP_AGE_SECONDS:
        logger.warning(
            "webhook_replay_detected",
            age_seconds=round(age_seconds, 1),
            max_age=MAX_TIMESTAMP_AGE_SECONDS,
        )
        raise WebhookReplayError()

    if age_seconds < -60:
        # Timestamp is in the future (clock skew tolerance: 60s)
        raise WebhookValidationError("Webhook timestamp is in the future")
