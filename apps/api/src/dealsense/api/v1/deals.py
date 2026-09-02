"""DealSense API — Deals and Risk Intelligence Router.

Endpoints for fetching deal intelligence, precomputed snapshots, and executing scores.
"""

from uuid import UUID

import structlog
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.api.deps import get_db
from dealsense.api.schemas.deals import (
    DealDashboardSchema,
    DealDetailSchema,
    DealSignalSchema,
    DealSnapshotSchema,
)
from dealsense.domain.exceptions import DealNotFoundError
from dealsense.domain.models import Deal, DealSnapshot
from dealsense.security.rbac import Permission, require_permission
from dealsense.services.scoring_service import (
    compute_and_persist_deal_snapshot,
    get_latest_deal_snapshot,
)

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/deals", tags=["Deals"])


@router.get("", response_model=list[DealDashboardSchema])
async def list_deals_for_dashboard(
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession = Depends(get_db),
) -> list[DealDashboardSchema]:
    """Retrieve all deals with their latest snapshot for dashboard aggregation."""
    stmt = (
        select(Deal, DealSnapshot)
        .outerjoin(DealSnapshot, (DealSnapshot.deal_id == Deal.id) & (DealSnapshot.is_current))
        .where(Deal.tenant_id == tenant_id)
        .order_by(Deal.updated_at.desc())
    )
    res = await db.execute(stmt)

    dash_deals = []
    for deal, snapshot in res.all():
        client_name = deal.properties.get("company_name", "Unknown Client")
        dash_deals.append(
            DealDashboardSchema(
                id=deal.id,
                name=deal.name,
                client=client_name,
                score=snapshot.health_score if snapshot else 50,
                value=deal.amount or 0.0,
                owner=deal.owner_name or "Unassigned",
                stage=deal.stage or "New",
                band=snapshot.risk_band if snapshot else "Moderate",
            )
        )
    return dash_deals


@router.get("/{deal_id}", response_model=DealDetailSchema)
async def get_deal_details(
    deal_id: UUID,
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession = Depends(get_db),
) -> DealDetailSchema:
    """Retrieve normalized deal details."""
    stmt = select(Deal).where(Deal.id == deal_id, Deal.tenant_id == tenant_id)
    res = await db.execute(stmt)
    deal = res.scalar_one_or_none()

    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    return DealDetailSchema.model_validate(deal)


@router.get("/{deal_id}/snapshot", response_model=DealSnapshotSchema)
async def get_deal_snapshot(
    deal_id: UUID,
    tenant_id: UUID = require_permission(Permission.SNAPSHOT_READ),
    db: AsyncSession = Depends(get_db),
) -> DealSnapshotSchema:
    """Fetch current precomputed deal intelligence snapshot for HubSpot UI Extension.

    If no snapshot exists yet, computes and returns one on demand.
    """
    snapshot = await get_latest_deal_snapshot(tenant_id=tenant_id, deal_id=deal_id, db=db)

    if not snapshot:
        # Compute first snapshot if deal exists
        try:
            snapshot = await compute_and_persist_deal_snapshot(
                tenant_id=tenant_id,
                deal_id=deal_id,
                db=db,
            )
        except DealNotFoundError as e:
            raise HTTPException(status_code=404, detail="Deal not found") from e

    return DealSnapshotSchema.model_validate(snapshot)


@router.post("/{deal_id}/score", response_model=DealSnapshotSchema)
async def trigger_deal_scoring(
    deal_id: UUID,
    tenant_id: UUID = require_permission(Permission.DEAL_ANALYZE),
    db: AsyncSession = Depends(get_db),
) -> DealSnapshotSchema:
    """Manually trigger deterministic score recomputation and snapshot generation."""
    try:
        snapshot = await compute_and_persist_deal_snapshot(
            tenant_id=tenant_id,
            deal_id=deal_id,
            db=db,
        )
        return DealSnapshotSchema.model_validate(snapshot)
    except DealNotFoundError as e:
        raise HTTPException(status_code=404, detail="Deal not found") from e


@router.post("/{deal_id}/analyze", response_model=DealSnapshotSchema)
async def trigger_deal_analysis(
    deal_id: UUID,
    tenant_id: UUID = require_permission(Permission.DEAL_ANALYZE),
    db: AsyncSession = Depends(get_db),
) -> DealSnapshotSchema:
    """Execute complete end-to-end deal intelligence analysis workflow."""
    from dealsense_worker.tasks.analyze import run_deal_analysis

    try:
        await run_deal_analysis(tenant_id=tenant_id, deal_id=deal_id, db=db)
        snapshot = await get_latest_deal_snapshot(tenant_id=tenant_id, deal_id=deal_id, db=db)
        if not snapshot:
            raise HTTPException(status_code=500, detail="Snapshot not created by analysis workflow")
        return DealSnapshotSchema.model_validate(snapshot)
    except DealNotFoundError as e:
        raise HTTPException(status_code=404, detail="Deal not found") from e


@router.get("/{deal_id}/signals", response_model=list[DealSignalSchema])
async def get_deal_signals(
    deal_id: UUID,
    tenant_id: UUID = require_permission(Permission.SNAPSHOT_READ),
    db: AsyncSession = Depends(get_db),
) -> list[DealSignalSchema]:
    """List all evaluated risk signals from the latest snapshot."""
    snapshot = await get_latest_deal_snapshot(tenant_id=tenant_id, deal_id=deal_id, db=db)

    if not snapshot:
        raise HTTPException(status_code=404, detail="No snapshot found for deal")

    return [DealSignalSchema.model_validate(s) for s in snapshot.signals]
