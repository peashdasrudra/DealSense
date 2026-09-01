"""DealSense API — Common API Schemas.

Shared Pydantic response/request schemas used across API endpoints.
"""

from datetime import datetime
from typing import Any, Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel, Field

T = TypeVar("T")


class ErrorResponse(BaseModel):
    """Standard error response."""

    error: str
    message: str
    details: dict[str, Any] | None = None


class SuccessResponse(BaseModel):
    """Standard success response."""

    status: str = "ok"
    message: str = ""


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated list response."""

    items: list[T]
    total: int
    page: int
    page_size: int
    has_more: bool


class PaginationParams(BaseModel):
    """Pagination query parameters."""

    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=25, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    service: str
    checks: dict[str, str] | None = None


class AuditEventSchema(BaseModel):
    """Audit event for API responses."""

    id: UUID
    tenant_id: UUID
    actor: str
    actor_type: str
    action: str
    resource_type: str
    resource_id: str
    details: dict[str, Any]
    trace_id: str
    created_at: datetime

    model_config = {"from_attributes": True}
