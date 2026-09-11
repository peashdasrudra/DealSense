"""DealSense API — Encryption Utilities.

Fernet symmetric encryption for OAuth tokens. Tokens are encrypted at rest
and only decrypted when needed for API calls or refresh operations.
"""

import base64
import hashlib

from cryptography.fernet import Fernet, InvalidToken

from dealsense.config import get_settings
from dealsense.domain.exceptions import EncryptionError

_fernet: Fernet | None = None


def _get_fernet() -> Fernet:
    """Get or create the Fernet cipher instance.

    Uses ENCRYPTION_KEY if provided, otherwise derives a secure, deterministic
    32-byte Fernet key from SECRET_KEY to prevent runtime crashes.
    """
    global _fernet
    if _fernet is None:
        settings = get_settings()
        raw_key = settings.encryption_key.strip() if settings.encryption_key else ""
        if raw_key:
            try:
                _fernet = Fernet(raw_key.encode("utf-8"))
                return _fernet
            except Exception:
                pass

        # Deterministic 32-byte urlsafe base64 key derived from SECRET_KEY
        seed = (settings.secret_key or "dealsense-encryption-seed-production-key-32b").encode(
            "utf-8"
        )
        derived_key = base64.urlsafe_b64encode(hashlib.sha256(seed).digest())
        _fernet = Fernet(derived_key)
    return _fernet


def encrypt_value(plaintext: str) -> str:
    """Encrypt a string value using Fernet symmetric encryption.

    Returns the encrypted value as a base64-encoded string.
    """
    if not plaintext:
        raise EncryptionError("Cannot encrypt empty value")
    try:
        fernet = _get_fernet()
        encrypted = fernet.encrypt(plaintext.encode("utf-8"))
        return encrypted.decode("utf-8")
    except EncryptionError:
        raise
    except Exception as e:
        raise EncryptionError(f"Encryption failed: {e}") from e


def decrypt_value(encrypted: str) -> str:
    """Decrypt a Fernet-encrypted string value.

    Returns the original plaintext string.
    """
    if not encrypted:
        raise EncryptionError("Cannot decrypt empty value")
    try:
        fernet = _get_fernet()
        decrypted = fernet.decrypt(encrypted.encode("utf-8"))
        return decrypted.decode("utf-8")
    except InvalidToken as e:
        raise EncryptionError("Decryption failed — invalid token or wrong key") from e
    except EncryptionError:
        raise
    except Exception as e:
        raise EncryptionError(f"Decryption failed: {e}") from e
