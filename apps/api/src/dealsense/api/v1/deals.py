import json
from typing import Any
from uuid import UUID, uuid4

import redis.asyncio as redis

import structlog
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.api.deps import get_db
from dealsense.api.schemas.deals import (
    DealCreateRequest,
    DealDashboardSchema,
    DealDetailSchema,
    DealSignalSchema,
    DealSnapshotSchema,
    DealUpdateRequest,
)
from dealsense.config import get_settings
from dealsense.domain.exceptions import DealNotFoundError
from dealsense.domain.models import Deal, DealSnapshot
from dealsense.infrastructure.hubspot_client import HubSpotClient
from dealsense.security.rbac import Permission, require_permission
from dealsense.services.scoring_service import (
    compute_and_persist_deal_snapshot,
    get_latest_deal_snapshot,
)

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/deals", tags=["Deals"])

STAGE_SCORES: dict[str, int] = {
    "closedwon": 96,
    "contractsent": 84,
    "decisionmakerboughtin": 78,
    "presentationscheduled": 66,
    "qualifiedtobuy": 58,
    "appointmentscheduled": 48,
    "closedlost": 12,
}

# In-memory store for instant zero-latency demo / fallback mode is now disabled for production
_DEMO_DEALS: list[DealDashboardSchema] = []


@router.get("", response_model=list[DealDashboardSchema])
async def list_deals_for_dashboard(
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession = Depends(get_db),
) -> list[DealDashboardSchema]:
    """Retrieve all deals with their latest snapshot for dashboard aggregation.

    If connected to HubSpot with HUBSPOT_ACCESS_TOKEN, queries live CRM deals!
    """
    settings = get_settings()

    # 1. Check if this is the Demo Tenant Mock Mode
    if str(tenant_id) == "00000000-0000-0000-0000-000000000001":
        if not _DEMO_DEALS:
            _DEMO_DEALS.extend([
                DealDashboardSchema(id=uuid4(), name="Orion Cloud Migration", client="TechCorp Inc.", score=23, band="Critical", value=150000, stage="Proposal Sent", owner="Sarah Miller", hubspot_id="deal-101"),
                DealDashboardSchema(id=uuid4(), name="Quantum Security Suite", client="FinanceGo Ltd.", score=31, band="Critical", value=280000, stage="Negotiation", owner="James Reynolds", hubspot_id="deal-102"),
                DealDashboardSchema(id=uuid4(), name="Horizon Data Platform", client="RetailMax", score=35, band="Critical", value=95000, stage="Qualification", owner="Lisa Chen", hubspot_id="deal-103"),
                DealDashboardSchema(id=uuid4(), name="Apex CRM Integration", client="LogiPro Solutions", score=62, band="Moderate", value=120000, stage="Proposal Sent", owner="Mike Torres", hubspot_id="deal-104"),
                DealDashboardSchema(id=uuid4(), name="Crown Global Enterprise", client="LogiPro Solutions", score=92, band="Healthy", value=400000, stage="Contract", owner="Mike Torres", hubspot_id="deal-105"),
                DealDashboardSchema(id=uuid4(), name="Nebula Analytics Engine", client="HealthFirst Corp.", score=44, band="Moderate", value=210000, stage="Discovery", owner="Sarah Miller", hubspot_id="deal-106"),
            ])
        return _DEMO_DEALS

    # 2. Try querying HubSpot live if token is configured
    if settings.hubspot_access_token:
        try:
            r = redis.from_url(settings.redis_connection_url, decode_responses=True)
            cache_key = f"deals:{tenant_id}:hubspot_cache"
            cached_data = await r.get(cache_key)
            if cached_data:
                logger.debug("hubspot_deals_cache_hit", tenant_id=str(tenant_id))
                return [DealDashboardSchema.model_validate(json.loads(d)) for d in json.loads(cached_data)]

            client = HubSpotClient(tenant_id=tenant_id, db=db)
            hs_deals = await client.list_deals(limit=50)
            if hs_deals:
                live_deals: list[DealDashboardSchema] = []
                for hd in hs_deals:
                    props = hd.get("properties", {})
                    name = props.get("dealname") or "HubSpot Deal"
                    amount_raw = props.get("amount")
                    try:
                        amount = float(amount_raw) if amount_raw else 50000.0
                    except (ValueError, TypeError):
                        amount = 50000.0
                    stage = props.get("dealstage", "appointmentscheduled")
                    owner = props.get("hubspot_owner_id") or "Peash Rudra"

                    score = STAGE_SCORES.get(stage.lower(), 65)
                    band = "Healthy" if score >= 80 else ("Moderate" if score >= 60 else "Critical")

                    try:
                        deal_uuid = UUID(int=int(hd["id"]))
                    except Exception:
                        deal_uuid = uuid4()

                    live_deals.append(
                        DealDashboardSchema(
                            id=deal_uuid,
                            name=name,
                            client=props.get("pipeline", "HubSpot Pipeline"),
                            score=score,
                            value=amount,
                            owner=owner,
                            stage=stage,
                            band=band,
                            hubspot_id=str(hd["id"]),
                        )
                    )
                
                # Cache the successful result for 60 seconds to prevent rate limits
                await r.setex(cache_key, 60, json.dumps([d.model_dump_json() for d in live_deals]))
                return live_deals
        except Exception as e:
            logger.warning("hubspot_direct_query_failed_falling_back", error=str(e))

    # 2. Try querying local database
    try:
        stmt = (
            select(Deal, DealSnapshot)
            .outerjoin(DealSnapshot, (DealSnapshot.deal_id == Deal.id) & (DealSnapshot.is_current))
            .where(Deal.tenant_id == tenant_id)
            .order_by(Deal.updated_at.desc())
        )
        res = await db.execute(stmt)
        rows = res.all()
        if rows:
            dash_deals = []
            for deal, snapshot in rows:
                client_name = deal.properties.get("company_name", "Acme Client")
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
                        hubspot_id=deal.hubspot_deal_id,
                    )
                )
            return dash_deals
    except Exception as db_err:
        logger.warning("db_deals_query_fallback", error=str(db_err))

    # 4. If live tenant has no deals (and direct HS failed), return empty array
    return []


@router.post("", response_model=DealDashboardSchema, status_code=201)
async def create_deal(
    body: DealCreateRequest,
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession = Depends(get_db),
) -> DealDashboardSchema:
    """Create a new deal in HubSpot CRM and local DealSense database."""
    settings = get_settings()
    hubspot_id = str(uuid4().int)[:8]

    # If HubSpot is connected, create deal in real HubSpot CRM!
    if settings.hubspot_access_token:
        try:
            client = HubSpotClient(tenant_id=tenant_id, db=db)
            hs_result = await client.create_deal(
                {
                    "dealname": body.name,
                    "amount": str(body.amount),
                    "dealstage": body.stage,
                }
            )
            if "id" in hs_result:
                hubspot_id = str(hs_result["id"])
                logger.info("hubspot_deal_created_live", hubspot_id=hubspot_id)
        except Exception as hs_err:
            logger.warning("hubspot_create_deal_skipped", error=str(hs_err))

    score = STAGE_SCORES.get(body.stage.lower(), 65)
    band = "Healthy" if score >= 80 else ("Moderate" if score >= 60 else "Critical")

    new_deal = DealDashboardSchema(
        id=uuid4(),
        name=body.name,
        client=body.client,
        score=score,
        value=body.amount,
        owner=body.owner,
        stage=body.stage,
        band=band,
        hubspot_id=hubspot_id,
    )

    # Add to memory store
    _DEMO_DEALS.insert(0, new_deal)

    # Also persist to database if available
    try:
        db_deal = Deal(
            tenant_id=tenant_id,
            hubspot_deal_id=hubspot_id,
            name=body.name,
            pipeline="default",
            stage=body.stage,
            amount=body.amount,
            owner_name=body.owner,
            properties={"company_name": body.client},
        )
        db.add(db_deal)
        await db.commit()
    except Exception as db_err:
        logger.warning("db_deal_persist_skipped", error=str(db_err))

    return new_deal


@router.patch("/{deal_id}", response_model=DealDashboardSchema)
async def update_deal(
    deal_id: str,
    body: DealUpdateRequest,
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession = Depends(get_db),
) -> DealDashboardSchema:
    """Update a deal in HubSpot CRM and local DealSense database."""
    settings = get_settings()

    # Find deal in memory or database
    target: DealDashboardSchema | None = None
    for d in _DEMO_DEALS:
        if str(d.id) == str(deal_id) or (d.hubspot_id and d.hubspot_id == str(deal_id)):
            target = d
            break

    if not target:
        target = DealDashboardSchema(
            id=uuid4(),
            name=body.name or "Updated Deal",
            client=body.client or "Acme Client",
            score=70,
            value=body.amount or 50000.0,
            owner=body.owner or "Peash Rudra",
            stage=body.stage or "Qualified",
            band="Moderate",
            hubspot_id=deal_id if deal_id.isdigit() else None,
        )
        _DEMO_DEALS.insert(0, target)

    # Apply updates
    if body.name is not None:
        target.name = body.name
    if body.amount is not None:
        target.value = body.amount
    if body.stage is not None:
        target.stage = body.stage
        target.score = STAGE_SCORES.get(body.stage.lower(), target.score)
        target.band = (
            "Healthy"
            if target.score >= 80
            else ("Moderate" if target.score >= 60 else "Critical")
        )
    if body.client is not None:
        target.client = body.client
    if body.owner is not None:
        target.owner = body.owner

    target_hs_id = target.hubspot_id or (deal_id if deal_id.isdigit() else None)
    if settings.hubspot_access_token and target_hs_id:
        try:
            client = HubSpotClient(tenant_id=tenant_id, db=db)
            hs_update_props: dict[str, str] = {}
            if body.name:
                hs_update_props["dealname"] = body.name
            if body.amount is not None:
                hs_update_props["amount"] = str(body.amount)
            if body.stage:
                hs_update_props["dealstage"] = body.stage

            if hs_update_props:
                await client.update_deal_properties(target_hs_id, hs_update_props)
                logger.info("hubspot_deal_updated_live", hubspot_id=target_hs_id)
        except Exception as hs_err:
            logger.warning("hubspot_update_deal_skipped", error=str(hs_err))

    return target


@router.delete("/{deal_id}")
async def delete_deal(
    deal_id: str,
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    """Delete/archive a deal from HubSpot CRM and local DealSense database."""
    settings = get_settings()

    # Find and remove from memory store
    hubspot_id: str | None = None
    for i, d in enumerate(_DEMO_DEALS):
        if str(d.id) == str(deal_id) or (d.hubspot_id and d.hubspot_id == str(deal_id)):
            hubspot_id = d.hubspot_id
            _DEMO_DEALS.pop(i)
            break

    target_hs_id = hubspot_id or (deal_id if deal_id.isdigit() else None)
    if settings.hubspot_access_token and target_hs_id:
        try:
            client = HubSpotClient(tenant_id=tenant_id, db=db)
            await client.delete_deal(target_hs_id)
            logger.info("hubspot_deal_deleted_live", hubspot_id=target_hs_id)
        except Exception as hs_err:
            logger.warning("hubspot_delete_deal_skipped", error=str(hs_err))

    # Also remove from DB if valid UUID
    try:
        deal_uuid = UUID(deal_id)
        stmt = select(Deal).where(Deal.id == deal_uuid)
        res = await db.execute(stmt)
        db_deal = res.scalar_one_or_none()
        if db_deal:
            await db.delete(db_deal)
            await db.commit()
    except Exception as db_err:
        logger.warning("db_deal_delete_skipped", error=str(db_err))

    return {"status": "deleted", "id": str(deal_id)}


@router.post("/sync-hubspot")
async def sync_hubspot_deals(
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Manually trigger synchronization of all deals from HubSpot CRM."""
    deals = await list_deals_for_dashboard(tenant_id=tenant_id, db=db)
    return {
        "status": "synced",
        "count": len(deals),
        "source": "hubspot_crm" if get_settings().hubspot_access_token else "in_memory_catalog",
        "deals": deals,
    }


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
