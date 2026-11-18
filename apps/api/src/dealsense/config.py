"""DealSense API — Application Configuration.

Uses Pydantic Settings for validated, type-safe configuration loaded from
environment variables and .env files.
"""

from functools import lru_cache
from typing import Literal

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ---- Application ----
    app_name: str = "dealsense"
    app_env: Literal["development", "staging", "production"] = "development"
    debug: bool = False
    log_level: str = "INFO"
    secret_key: str = Field(
        default="dealsense-super-secure-production-secret-key-change-in-env-32b",
        min_length=32,
    )
    admin_api_key: str = "dealsense_admin_secret_key"

    # ---- API Server ----
    api_host: str = "0.0.0.0"  # noqa: S104
    api_port: int = 8000
    api_reload: bool = False
    cors_origins: str = (
        "http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:8000"
    )

    # ---- PostgreSQL ----
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_user: str = "dealsense"
    postgres_password: str = Field(default="")
    postgres_db: str = "dealsense"
    database_url: str | None = None
    database_url_sync: str | None = None

    # ---- Redis ----
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_password: str = ""
    redis_db: int = 0
    redis_url: str | None = None

    # ---- HubSpot OAuth ----
    hubspot_client_id: str = ""
    hubspot_client_secret: str = ""
    hubspot_redirect_uri: str = "https://dealsense.peash.tech/oauth/callback"
    hubspot_scopes: str = (
        "crm.objects.deals.read,crm.objects.deals.write,crm.objects.contacts.read,"
        "crm.objects.companies.read,crm.schemas.deals.read,crm.objects.notes.read,"
        "crm.objects.notes.write,crm.objects.owners.read,timeline"
    )
    hubspot_app_id: str = ""
    hubspot_access_token: str = ""
    app_base_url: str = "https://dealsense.peash.tech"

    # ---- Encryption ----
    encryption_key: str = ""

    # ---- LLM ----
    openai_api_key: str = ""
    llm_model: str = "gpt-4o"
    llm_temperature: float = 0.1
    llm_max_tokens: int = 4096

    # ---- Embedding ----
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536

    # ---- Worker ----
    worker_concurrency: int = 4
    worker_queue_name: str = "dealsense:events"

    # ---- Observability ----
    otel_service_name: str = "dealsense-api"
    otel_exporter_otlp_endpoint: str = ""

    @computed_field  # type: ignore[prop-decorator]
    @property
    def async_database_url(self) -> str:
        """Construct async database URL if not provided."""
        if self.database_url:
            url = self.database_url
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            if "?sslmode=" in url:
                url = url.replace("?sslmode=require", "?ssl=require").replace(
                    "&sslmode=require", "&ssl=require"
                )
            return url
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def sync_database_url(self) -> str:
        """Construct sync database URL for Alembic migrations."""
        if self.database_url_sync:
            return self.database_url_sync
        if self.database_url:
            url = self.database_url
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql://", 1)
            elif url.startswith("postgresql+asyncpg://"):
                url = url.replace("postgresql+asyncpg://", "postgresql://", 1)
            return url
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def redis_connection_url(self) -> str:
        """Construct Redis URL if not provided."""
        if self.redis_url:
            return self.redis_url
        password_part = f":{self.redis_password}@" if self.redis_password else ""
        return f"redis://{password_part}{self.redis_host}:{self.redis_port}/{self.redis_db}"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def cors_origin_list(self) -> list[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"


@lru_cache
def get_settings() -> Settings:
    """Cached singleton for application settings."""
    return Settings()  # type: ignore[call-arg]
