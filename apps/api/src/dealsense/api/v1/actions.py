"""DealSense API — Action Approval and Write-Back Router.

Endpoints for managing action proposals, approval workflows, and
controlled HubSpot CRM write-back execution across 4 tiers.

Tier 1 (Observe):  Read-only insight surfacing — no CRM mutation
Tier 2 (Notify):   Send alert notifications to deal owners / managers
Tier 3 (Assist):   Human-approved CRM write-back (create task, note, etc.)
Tier 4 (Act):      Auto-executed write-back with rollback capability
"""

from datetime import datetime, timezone
from typing import Literal
from uuid import UUID

import structlog
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.api.deps import get_db
from dealsense.domain.models import ActionProposal, ActionExecution, AuditEvent
from dealsense.security.rbac import Permission, require_permission

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/actions", tags=["Actions & Write-Backs"])


# ─── Request / Response Schemas ──────────────────────────────────────────────

class ActionApprovalRequest(BaseModel):
    """Approve or reject a pending action proposal."""
    decision: Literal["approve", "reject"]
    reason: str = Field(default="", max_length=500)


class WriteBackRequest(BaseModel):
    """Execute an approved write-back action against HubSpot CRM."""
    action_type: str = Field(
        ...,
        description="One of: create_task, create_note, update_property, update_deal_stage, create_engagement, send_notification",
    )
    parameters: dict = Field(default_factory=dict)


class ActionProposalResponse(BaseModel):
    """Serialized action proposal."""
    id: str
    deal_id: str
    tenant_id: str
    tier: str
    title: str
    description: str
    rationale: str
    impact_estimate: str
    status: str
    created_at: str
    updated_at: str | None = None

    class Config:
        from_attributes = True


class ActionExecutionResponse(BaseModel):
    """Serialized write-back execution result."""
    id: str
    action_proposal_id: str
    action_type: str
    success: bool
    hubspot_object_id: str | None = None
    error_message: str | None = None
    rollback_available: bool
    executed_at: str

    class Config:
        from_attributes = True


class WriteBackResultResponse(BaseModel):
    """Result from executing a write-back."""
    success: bool
    action_type: str
    hubspot_object_id: str | None = None
    error_message: str | None = None
    rollback_available: bool
    executed_at: str


# ─── Endpoints ───────────────────────────────────────────────────────────────

@router.get("", response_model=list[ActionProposalResponse])
async def list_pending_actions(
    status: str = "pending",
    tier: str | None = None,
    tenant_id: UUID = require_permission(Permission.ACTION_READ),
    db: AsyncSession = Depends(get_db),
) -> list[ActionProposalResponse]:
    """List action proposals filtered by status and optional tier."""
    stmt = select(ActionProposal).where(
        ActionProposal.tenant_id == tenant_id,
        ActionProposal.status == status,
    )
    if tier:
        stmt = stmt.where(ActionProposal.tier == tier)

    stmt = stmt.order_by(ActionProposal.created_at.desc())
    result = await db.execute(stmt)
    proposals = result.scalars().all()

    return [
        ActionProposalResponse(
            id=str(p.id),
            deal_id=str(p.deal_id),
            tenant_id=str(p.tenant_id),
            tier=p.tier,
            title=p.title,
            description=p.description,
            rationale=p.rationale or "",
            impact_estimate=p.impact_estimate or "",
            status=p.status,
            created_at=p.created_at.isoformat() if p.created_at else "",
            updated_at=p.updated_at.isoformat() if hasattr(p, "updated_at") and p.updated_at else None,
        )
        for p in proposals
    ]


@router.post("/{action_id}/decision", response_model=ActionProposalResponse)
async def submit_action_decision(
    action_id: UUID,
    body: ActionApprovalRequest,
    tenant_id: UUID = require_permission(Permission.ACTION_APPROVE),
    db: AsyncSession = Depends(get_db),
) -> ActionProposalResponse:
    """Approve or reject an action proposal. Tier 3/4 actions require explicit approval."""
    stmt = select(ActionProposal).where(
        ActionProposal.id == action_id,
        ActionProposal.tenant_id == tenant_id,
    )
    result = await db.execute(stmt)
    proposal = result.scalar_one_or_none()

    if not proposal:
        raise HTTPException(status_code=404, detail="Action proposal not found")

    if proposal.status != "pending":
        raise HTTPException(status_code=409, detail=f"Action already {proposal.status}")

    new_status = "approved" if body.decision == "approve" else "rejected"
    proposal.status = new_status

    # Audit log
    audit = AuditEvent(
        tenant_id=tenant_id,
        actor_id="api_user",
        action=f"action.{body.decision}",
        resource_type="action_proposal",
        resource_id=str(action_id),
        details={"reason": body.reason, "tier": proposal.tier},
    )
    db.add(audit)
    await db.commit()
    await db.refresh(proposal)

    logger.info(
        "action_decision_submitted",
        action_id=str(action_id),
        decision=body.decision,
        tier=proposal.tier,
    )

    return ActionProposalResponse(
        id=str(proposal.id),
        deal_id=str(proposal.deal_id),
        tenant_id=str(proposal.tenant_id),
        tier=proposal.tier,
        title=proposal.title,
        description=proposal.description,
        rationale=proposal.rationale or "",
        impact_estimate=proposal.impact_estimate or "",
        status=proposal.status,
        created_at=proposal.created_at.isoformat() if proposal.created_at else "",
    )


@router.post("/{action_id}/execute", response_model=WriteBackResultResponse)
async def execute_write_back(
    action_id: UUID,
    tenant_id: UUID = require_permission(Permission.ACTION_EXECUTE),
    db: AsyncSession = Depends(get_db),
) -> WriteBackResultResponse:
    """Execute an approved write-back action against HubSpot CRM.

    Only approved Tier 3/4 actions can be executed.
    Creates an ActionExecution record for audit trail and rollback capability.
    """
    stmt = select(ActionProposal).where(
        ActionProposal.id == action_id,
        ActionProposal.tenant_id == tenant_id,
    )
    result = await db.execute(stmt)
    proposal = result.scalar_one_or_none()

    if not proposal:
        raise HTTPException(status_code=404, detail="Action proposal not found")

    if proposal.status != "approved":
        raise HTTPException(
            status_code=409,
            detail=f"Action must be approved before execution (current: {proposal.status})",
        )

    if proposal.tier not in ("tier_3", "tier_4"):
        raise HTTPException(
            status_code=400,
            detail="Only Tier 3 (Assist) and Tier 4 (Act) actions support CRM write-back execution",
        )

    # TODO: In production, call HubSpot CRM API here based on proposal.action_type
    # For now, simulate successful execution
    executed_at = datetime.now(timezone.utc)

    execution = ActionExecution(
        proposal_id=proposal.id,
        tenant_id=tenant_id,
        action_type=proposal.action_type or "create_task",
        executed_by="system",
        success=True,
        hubspot_object_id=f"hs_{action_id.hex[:8]}",
        response_payload={"simulated": True},
        rollback_payload={"original_state": {}},
        executed_at=executed_at,
    )
    db.add(execution)

    proposal.status = "executed"

    # Audit log
    audit = AuditEvent(
        tenant_id=tenant_id,
        actor_id="system",
        action="action.executed",
        resource_type="action_proposal",
        resource_id=str(action_id),
        details={
            "tier": proposal.tier,
            "action_type": proposal.action_type or "create_task",
            "hubspot_object_id": f"hs_{action_id.hex[:8]}",
        },
    )
    db.add(audit)
    await db.commit()

    logger.info(
        "write_back_executed",
        action_id=str(action_id),
        tier=proposal.tier,
        action_type=proposal.action_type,
    )

    return WriteBackResultResponse(
        success=True,
        action_type=proposal.action_type or "create_task",
        hubspot_object_id=f"hs_{action_id.hex[:8]}",
        error_message=None,
        rollback_available=True,
        executed_at=executed_at.isoformat(),
    )


@router.post("/{action_id}/rollback")
async def rollback_write_back(
    action_id: UUID,
    tenant_id: UUID = require_permission(Permission.ACTION_EXECUTE),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Rollback a previously executed write-back action.

    Reverts the HubSpot CRM change and marks the action as rolled_back.
    """
    stmt = select(ActionProposal).where(
        ActionProposal.id == action_id,
        ActionProposal.tenant_id == tenant_id,
    )
    result = await db.execute(stmt)
    proposal = result.scalar_one_or_none()

    if not proposal:
        raise HTTPException(status_code=404, detail="Action proposal not found")

    if proposal.status != "executed":
        raise HTTPException(
            status_code=409,
            detail="Only executed actions can be rolled back",
        )

    # TODO: In production, call HubSpot CRM API to reverse the change
    proposal.status = "rolled_back"

    audit = AuditEvent(
        tenant_id=tenant_id,
        actor_id="api_user",
        action="action.rolled_back",
        resource_type="action_proposal",
        resource_id=str(action_id),
        details={"tier": proposal.tier},
    )
    db.add(audit)
    await db.commit()

    logger.info("write_back_rolled_back", action_id=str(action_id))

    return {"status": "rolled_back", "action_id": str(action_id)}
