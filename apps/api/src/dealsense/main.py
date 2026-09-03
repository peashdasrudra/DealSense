"""DealSense API — FastAPI Application Factory.

Creates and configures the FastAPI application with:
- Lifespan management (DB, Redis, queue initialization)
- CORS middleware
- Structured error handlers
- API v1 router
- Health check endpoints
"""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import Any

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse

from dealsense.api.v1 import api_v1_router
from dealsense.config import get_settings
from dealsense.domain.exceptions import (
    AuthenticationError,
    AuthorizationError,
    CrossTenantAccessError,
    DealNotFoundError,
    DealSenseError,
    DuplicateWebhookError,
    OAuthError,
    SnapshotNotFoundError,
    TenantNotFoundError,
    WebhookValidationError,
)
from dealsense.infrastructure.database import close_db, init_db
from dealsense.infrastructure.observability import setup_logging, setup_tracing
from dealsense.infrastructure.queue import ensure_consumer_group
from dealsense.infrastructure.redis_client import close_redis, init_redis

logger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan: initialize and clean up resources."""
    # ---- Startup ----
    setup_logging()
    setup_tracing()
    logger.info("starting_dealsense", env=get_settings().app_env)

    await init_db()
    logger.info("database_connected")

    try:
        await init_redis()
        logger.info("redis_connected")
    except Exception as e:
        logger.warning("redis_connection_failed", error=str(e))

    try:
        await ensure_consumer_group()
        logger.info("event_queue_ready")
    except Exception as e:
        logger.warning("queue_init_failed", error=str(e))

    logger.info("dealsense_started")

    yield

    # ---- Shutdown ----
    logger.info("shutting_down_dealsense")
    await close_redis()
    await close_db()
    logger.info("dealsense_stopped")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title="DealSense API",
        description=(
            "White-label HubSpot-native AI Deal Intelligence platform. "
            "Provides deal health scoring, risk signals, evidence-grounded "
            "recommendations, and approval-controlled CRM write-backs."
        ),
        version="0.1.0",
        docs_url="/docs" if settings.is_development else None,
        redoc_url="/redoc" if settings.is_development else None,
        default_response_class=ORJSONResponse,
        lifespan=lifespan,
    )

    # ---- Middlewares ----
    from dealsense.api.middleware import RequestContextMiddleware
    from dealsense.security.tenant_guard import TenantGuardMiddleware

    app.add_middleware(RequestContextMiddleware)
    app.add_middleware(TenantGuardMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ---- Exception Handlers ----
    _register_exception_handlers(app)

    # ---- Routers ----
    app.include_router(api_v1_router, prefix="/api/v1")

    # ---- Health Checks ----
    @app.get("/", tags=["System"])
    @app.head("/", tags=["System"])
    async def root_health() -> dict[str, str]:
        """Root probe for cloud load balancers and Render."""
        return {"status": "healthy", "service": "dealsense-api"}

    @app.get("/health", tags=["System"])
    @app.head("/health", tags=["System"])
    @app.get("/api/v1/health", tags=["System"])
    @app.head("/api/v1/health", tags=["System"])
    async def health_check() -> dict[str, str]:
        """Liveness probe — returns 200 if the process is running."""
        return {"status": "healthy", "service": "dealsense-api"}

    @app.get("/ready", tags=["System"])
    async def readiness_check() -> dict[str, Any]:
        """Readiness probe — checks database and Redis connectivity."""
        checks: dict[str, str] = {}

        # Check database
        try:
            from dealsense.infrastructure.database import get_engine

            async with get_engine().connect() as conn:
                await conn.execute(__import__("sqlalchemy").text("SELECT 1"))
            checks["database"] = "ok"
        except Exception as e:
            checks["database"] = f"error: {e}"

        # Check Redis
        try:
            from dealsense.infrastructure.redis_client import get_redis

            await get_redis().ping()
            checks["redis"] = "ok"
        except Exception as e:
            checks["redis"] = f"error: {e}"

        all_ok = all(v == "ok" for v in checks.values())
        return {
            "status": "ready" if all_ok else "degraded",
            "checks": checks,
        }

    return app


def _register_exception_handlers(app: FastAPI) -> None:
    """Register structured error handlers for domain exceptions."""

    @app.exception_handler(AuthenticationError)
    async def handle_auth_error(request: Request, exc: AuthenticationError) -> ORJSONResponse:
        return ORJSONResponse(
            status_code=401,
            content={"error": exc.code, "message": exc.message},
        )

    @app.exception_handler(AuthorizationError)
    async def handle_authz_error(request: Request, exc: AuthorizationError) -> ORJSONResponse:
        return ORJSONResponse(
            status_code=403,
            content={"error": exc.code, "message": exc.message},
        )

    @app.exception_handler(CrossTenantAccessError)
    async def handle_cross_tenant(request: Request, exc: CrossTenantAccessError) -> ORJSONResponse:
        logger.warning("cross_tenant_access_attempt", path=request.url.path)
        return ORJSONResponse(
            status_code=403,
            content={"error": exc.code, "message": exc.message},
        )

    @app.exception_handler(TenantNotFoundError)
    async def handle_tenant_not_found(request: Request, exc: TenantNotFoundError) -> ORJSONResponse:
        return ORJSONResponse(
            status_code=404,
            content={"error": exc.code, "message": exc.message},
        )

    @app.exception_handler(DealNotFoundError)
    async def handle_deal_not_found(request: Request, exc: DealNotFoundError) -> ORJSONResponse:
        return ORJSONResponse(
            status_code=404,
            content={"error": exc.code, "message": exc.message},
        )

    @app.exception_handler(SnapshotNotFoundError)
    async def handle_snapshot_not_found(
        request: Request, exc: SnapshotNotFoundError
    ) -> ORJSONResponse:
        return ORJSONResponse(
            status_code=404,
            content={"error": exc.code, "message": exc.message},
        )

    @app.exception_handler(WebhookValidationError)
    async def handle_webhook_error(request: Request, exc: WebhookValidationError) -> ORJSONResponse:
        logger.warning("webhook_validation_failed", error=exc.message)
        return ORJSONResponse(
            status_code=401,
            content={"error": exc.code, "message": exc.message},
        )

    @app.exception_handler(DuplicateWebhookError)
    async def handle_duplicate_webhook(
        request: Request, exc: DuplicateWebhookError
    ) -> ORJSONResponse:
        return ORJSONResponse(
            status_code=200,
            content={"status": "already_processed"},
        )

    @app.exception_handler(OAuthError)
    async def handle_oauth_error(request: Request, exc: OAuthError) -> ORJSONResponse:
        return ORJSONResponse(
            status_code=400,
            content={"error": exc.code, "message": exc.message},
        )

    @app.exception_handler(DealSenseError)
    async def handle_dealsense_error(request: Request, exc: DealSenseError) -> ORJSONResponse:
        logger.error("unhandled_domain_error", code=exc.code, message=exc.message)
        return ORJSONResponse(
            status_code=500,
            content={"error": exc.code, "message": "Internal server error"},
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, exc: Exception) -> ORJSONResponse:
        logger.exception("unexpected_error", error=str(exc))
        return ORJSONResponse(
            status_code=500,
            content={"error": "INTERNAL_ERROR", "message": "Internal server error"},
        )


# Create the application instance
app = create_app()
