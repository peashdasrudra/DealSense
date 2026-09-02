"""DealSense API — Encryption Utilities.

Fernet symmetric encryption for OAuth tokens. Tokens are encrypted at rest
and only decrypted when needed for API calls or refresh operations.
"""

from cryptography.fernet import Fernet, InvalidToken

from dealsense.config import get_settings
from dealsense.domain.exceptions import EncryptionError

_fernet: Fernet | None = None


def _get_fernet() -> Fernet:
    """Get or create the Fernet cipher instance."""
    global _fernet
    if _fernet is None:
        settings = get_settings()
        if not settings.encryption_key:
            raise EncryptionError(
                "ENCRYPTION_KEY is not configured. "
                'Generate one with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"'
            )
        try:
            _fernet = Fernet(settings.encryption_key.encode())
        except Exception as e:
            raise EncryptionError(f"Invalid encryption key format: {e}") from e
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
