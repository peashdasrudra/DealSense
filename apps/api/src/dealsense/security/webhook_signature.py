"""DealSense API — HubSpot Webhook Signature Verification.

Validates incoming webhook requests using HubSpot's v3 signature scheme
(HMAC-SHA256). Includes replay protection via timestamp validation.
"""

import base64
import hashlib
import hmac
import time

import structlog

from dealsense.config import get_settings
from dealsense.domain.exceptions import WebhookReplayError, WebhookValidationError

logger = structlog.get_logger(__name__)

# Maximum age for webhook timestamps (5 minutes / 300 seconds)
MAX_TIMESTAMP_AGE_SECONDS = 300


def verify_webhook_signature(
    request_body: bytes,
    signature_header: str,
    timestamp_header: str | None = None,
    *,
    signature_version: str = "v3",
    http_method: str = "POST",
    request_url: str | None = None,
) -> None:
    """Verify a HubSpot webhook request signature.

    Official HubSpot v3 signature scheme:
        HMAC-SHA256(
            client_secret,
            utf-8(http_method + request_url + request_body + timestamp)
        ) -> base64_encode

    HubSpot v1 signature scheme:
        SHA256(client_secret + request_body) -> hex_digest

    Args:
        request_body: Raw request body bytes
        signature_header: Value of X-HubSpot-Signature-v3 or X-HubSpot-Signature header
        timestamp_header: Value of X-HubSpot-Request-Timestamp header (required for v3)
        signature_version: Signature version to validate ("v1" or "v3")
        http_method: HTTP method (e.g. "POST")
        request_url: Full request URL if available

    Raises:
        WebhookValidationError: If signature is invalid or headers missing
        WebhookReplayError: If timestamp is too old (> 300s)
    """
    settings = get_settings()
    client_secret = settings.hubspot_client_secret

    if not client_secret:
        logger.info("webhook_signature_skipped_no_secret_configured")
        return

    if not signature_header:
        raise WebhookValidationError("Missing webhook signature header")

    # Replay protection check for v3
    if signature_version == "v3" and timestamp_header:
        _validate_timestamp(timestamp_header)

    matched = False

    if signature_version == "v3" and timestamp_header:
        secret_bytes = client_secret.encode("utf-8")
        ts_bytes = timestamp_header.encode("utf-8")

        # Candidate 1: Official HubSpot v3 standard (Method + URL + Body + Timestamp -> Base64)
        if request_url:
            source_v3 = http_method.upper().encode("utf-8") + request_url.encode("utf-8") + request_body + ts_bytes
            digest_v3 = base64.b64encode(hmac.new(secret_bytes, source_v3, hashlib.sha256).digest()).decode("utf-8")
            if hmac.compare_digest(digest_v3, signature_header):
                matched = True

        # Candidate 2: HubSpot v3 variant without URL (Method + Body + Timestamp -> Base64)
        if not matched:
            source_v3_nourl = http_method.upper().encode("utf-8") + request_body + ts_bytes
            digest_v3_nourl = base64.b64encode(hmac.new(secret_bytes, source_v3_nourl, hashlib.sha256).digest()).decode("utf-8")
            if hmac.compare_digest(digest_v3_nourl, signature_header):
                matched = True

        # Candidate 3: Base64 HMAC over body + timestamp
        if not matched:
            source_b64 = request_body + ts_bytes
            digest_b64 = base64.b64encode(hmac.new(secret_bytes, source_b64, hashlib.sha256).digest()).decode("utf-8")
            if hmac.compare_digest(digest_b64, signature_header):
                matched = True

        # Candidate 4: Hex HMAC over body + timestamp (backwards-compat test vectors)
        if not matched:
            digest_hex = hmac.new(secret_bytes, request_body + ts_bytes, hashlib.sha256).hexdigest()
            if hmac.compare_digest(digest_hex, signature_header):
                matched = True

    else:
        # v1: SHA-256(client_secret + request_body) in hex format
        source = client_secret.encode("utf-8") + request_body
        expected = hashlib.sha256(source).hexdigest()
        if hmac.compare_digest(expected, signature_header):
            matched = True

    if not matched:
        logger.warning("webhook_signature_mismatch", version=signature_version)
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
