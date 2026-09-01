"""DealSense API — Role-Based Access Control (RBAC).

Defines permissions per role and provides dependency injection guards
for FastAPI endpoints.
"""

from collections.abc import Callable
from enum import StrEnum
from uuid import UUID

import structlog
from fastapi import Depends, HTTPException, Request

from dealsense.domain.enums import UserRole

logger = structlog.get_logger(__name__)


class Permission(StrEnum):
    """Granular permissions for DealSense operations."""

    # ---- Tenant Management ----
    TENANT_READ = "tenant:read"
    TENANT_UPDATE = "tenant:update"
    TENANT_DELETE = "tenant:delete"

    # ---- Deal Intelligence ----
    DEAL_READ = "deal:read"
    DEAL_ANALYZE = "deal:analyze"
    SNAPSHOT_READ = "snapshot:read"

    # ---- Actions ----
    ACTION_READ = "action:read"
    ACTION_APPROVE = "action:approve"
    ACTION_REJECT = "action:reject"
    ACTION_EXECUTE = "action:execute"

    # ---- Configuration ----
    CONFIG_READ = "config:read"
    CONFIG_UPDATE = "config:update"
    SCORING_CONFIG = "scoring:config"

    # ---- OAuth ----
    OAUTH_MANAGE = "oauth:manage"
    OAUTH_DISCONNECT = "oauth:disconnect"

    # ---- Audit ----
    AUDIT_READ = "audit:read"
    AUDIT_EXPORT = "audit:export"

    # ---- Agency Portfolio ----
    PORTFOLIO_READ = "portfolio:read"
    PORTFOLIO_MANAGE = "portfolio:manage"
    WHITE_LABEL_CONFIG = "white_label:config"

    # ---- User Management ----
    USER_READ = "user:read"
    USER_MANAGE = "user:manage"


# ---- Role → Permission Mapping ----

ROLE_PERMISSIONS: dict[UserRole, frozenset[Permission]] = {
    UserRole.AGENCY_OWNER: frozenset(Permission),  # All permissions

    UserRole.AGENCY_OPERATOR: frozenset({
        Permission.TENANT_READ,
        Permission.TENANT_UPDATE,
        Permission.DEAL_READ,
        Permission.DEAL_ANALYZE,
        Permission.SNAPSHOT_READ,
        Permission.ACTION_READ,
        Permission.ACTION_APPROVE,
        Permission.ACTION_REJECT,
        Permission.ACTION_EXECUTE,
        Permission.CONFIG_READ,
        Permission.CONFIG_UPDATE,
        Permission.SCORING_CONFIG,
        Permission.OAUTH_MANAGE,
        Permission.AUDIT_READ,
        Permission.PORTFOLIO_READ,
        Permission.WHITE_LABEL_CONFIG,
        Permission.USER_READ,
    }),

    UserRole.CLIENT_ADMIN: frozenset({
        Permission.TENANT_READ,
        Permission.DEAL_READ,
        Permission.DEAL_ANALYZE,
        Permission.SNAPSHOT_READ,
        Permission.ACTION_READ,
        Permission.ACTION_APPROVE,
        Permission.ACTION_REJECT,
        Permission.ACTION_EXECUTE,
        Permission.CONFIG_READ,
        Permission.CONFIG_UPDATE,
        Permission.SCORING_CONFIG,
        Permission.OAUTH_MANAGE,
        Permission.OAUTH_DISCONNECT,
        Permission.AUDIT_READ,
        Permission.USER_READ,
        Permission.USER_MANAGE,
    }),

    UserRole.SALES_MANAGER: frozenset({
        Permission.DEAL_READ,
        Permission.DEAL_ANALYZE,
        Permission.SNAPSHOT_READ,
        Permission.ACTION_READ,
        Permission.ACTION_APPROVE,
        Permission.ACTION_REJECT,
        Permission.CONFIG_READ,
        Permission.AUDIT_READ,
    }),

    UserRole.SALES_REP: frozenset({
        Permission.DEAL_READ,
        Permission.SNAPSHOT_READ,
        Permission.ACTION_READ,
        Permission.ACTION_APPROVE,  # Own actions only
    }),

    UserRole.AUDITOR: frozenset({
        Permission.TENANT_READ,
        Permission.DEAL_READ,
        Permission.SNAPSHOT_READ,
        Permission.ACTION_READ,
        Permission.CONFIG_READ,
        Permission.AUDIT_READ,
        Permission.AUDIT_EXPORT,
        Permission.PORTFOLIO_READ,
    }),
}


def has_permission(role: UserRole, permission: Permission) -> bool:
    """Check if a role has a specific permission."""
    role_perms = ROLE_PERMISSIONS.get(role, frozenset())
    return permission in role_perms


def get_role_permissions(role: UserRole) -> frozenset[Permission]:
    """Get all permissions for a role."""
    return ROLE_PERMISSIONS.get(role, frozenset())


def require_permission(permission: Permission) -> Callable[..., UUID]:
    """FastAPI dependency that enforces a permission check.

    Usage:
        @router.get("/deals")
        async def list_deals(
            tenant_id: UUID = Depends(require_permission(Permission.DEAL_READ))
        ):
            ...

    In V1, this validates the tenant context exists. Full JWT-based
    user authentication will be added when the dashboard is built.
    """

    async def _check(request: Request) -> UUID:
        # Ensure tenant context exists
        tenant_id = getattr(request.state, "tenant_id", None)
        if tenant_id is None:
            raise HTTPException(
                status_code=401,
                detail="Authentication required",
            )

        # TODO: In V2, extract user role from JWT and verify permission
        # For now, having a valid tenant context is sufficient
        # role = extract_role_from_jwt(request)
        # if not has_permission(role, permission):
        #     logger.warning(
        #         "permission_denied",
        #         role=role,
        #         permission=permission,
        #         tenant_id=str(tenant_id),
        #     )
        #     raise HTTPException(status_code=403, detail="Insufficient permissions")

        return tenant_id

    return Depends(_check)


def require_any_permission(*permissions: Permission) -> Callable[..., UUID]:
    """FastAPI dependency that requires any one of the listed permissions.

    Usage:
        @router.post("/actions/{action_id}/approve")
        async def approve_action(
            tenant_id: UUID = require_any_permission(
                Permission.ACTION_APPROVE, Permission.ACTION_EXECUTE
            )
        ):
            ...
    """

    async def _check(request: Request) -> UUID:
        tenant_id = getattr(request.state, "tenant_id", None)
        if tenant_id is None:
            raise HTTPException(
                status_code=401,
                detail="Authentication required",
            )

        # TODO: Check user has any of the required permissions
        return tenant_id

    return Depends(_check)
