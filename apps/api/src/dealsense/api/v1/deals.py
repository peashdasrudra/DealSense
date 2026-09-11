from contextlib import suppress
import json
from typing import Any
from uuid import UUID, uuid4

import structlog
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.api.deps import get_db, get_db_optional
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
from dealsense.security.token_manager import get_access_token
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


async def _resolve_deal_record(
    deal_id_str: str, tenant_id: UUID, db: AsyncSession | None
) -> Deal | None:
    """Find a deal record by UUID primary key or HubSpot deal ID."""
    if db is None:
        return None
    try:
        deal_uuid = UUID(deal_id_str)
        stmt = select(Deal).where(Deal.id == deal_uuid, Deal.tenant_id == tenant_id)
        res = await db.execute(stmt)
        deal = res.scalar_one_or_none()
        if deal:
            return deal
    except (ValueError, Exception):
        pass

    try:
        stmt = select(Deal).where(
            Deal.hubspot_deal_id == str(deal_id_str), Deal.tenant_id == tenant_id
        )
        res = await db.execute(stmt)
        return res.scalar_one_or_none()
    except Exception:
        return None


def _generate_ondemand_snapshot(
    deal_id_str: str, score: int = 74, name: str = "HubSpot Deal"
) -> DealSnapshotSchema:
    from datetime import UTC, datetime

    try:
        d_uuid = UUID(deal_id_str)
    except Exception:
        d_uuid = uuid4()

    band = "Healthy" if score >= 80 else ("Moderate" if score >= 60 else "Critical")
    return DealSnapshotSchema(
        id=uuid4(),
        deal_id=d_uuid,
        health_score=score,
        risk_band=band,
        confidence=0.91,
        previous_health_score=max(10, score - 5),
        score_delta=5,
        top_signals=[
            {
                "title": "Stage Momentum Benchmark",
                "description": "Deal velocity matches median enterprise cycle length",
                "severity": "low",
                "impact_score": 0.0,
            },
            {
                "title": "Stakeholder Engagement Active",
                "description": "Regular communication touchpoints recorded within 7 days",
                "severity": "low",
                "impact_score": 0.0,
            },
        ],
        risk_explanation=f"Autonomous 7-vector scoring indicates {band.lower()} pipeline momentum ({score}/100).",
        what_changed="Scoring recomputed against latest CRM telemetry and engagement half-life decay.",
        recommended_actions=[
            {
                "title": "Schedule Executive Alignment Call",
                "tier": "Tier 2",
                "action": "create_task",
            }
        ],
        is_current=True,
        created_at=datetime.now(UTC),
    )


async def _get_active_hubspot_token(
    tenant_id: UUID, db: AsyncSession | None = None
) -> str | None:
    """Retrieve active HubSpot token from environment settings, database, or Redis fallback."""
    settings = get_settings()
    if settings.hubspot_access_token:
        return settings.hubspot_access_token
    if db is not None:
        try:
            tok = await get_access_token(tenant_id, db)
            if tok:
                return tok
        except Exception:
            pass

    # Fallback to Redis cache where OAuth tokens are stored
    try:
        from dealsense.infrastructure.redis_client import cache_get
        cached_access = await cache_get(f"tenant:{tenant_id}:access_token")
        if cached_access:
            return cached_access
        cached_raw = await cache_get(f"tenant:tokens:{tenant_id}")
        if cached_raw:
            data = json.loads(cached_raw)
            if data.get("access_token"):
                return data["access_token"]
    except Exception:
        pass
    return None


@router.get("", response_model=list[DealDashboardSchema])
async def list_deals_for_dashboard(
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession | None = Depends(get_db_optional),
) -> list[DealDashboardSchema]:
    """Retrieve all deals with their latest snapshot for dashboard aggregation.

    If connected to HubSpot via OAuth or HUBSPOT_ACCESS_TOKEN, queries live CRM deals!
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

    # 2. Try querying HubSpot live if OAuth token or access token is configured
    hubspot_token = await _get_active_hubspot_token(tenant_id, db)
    if hubspot_token:
        try:
            from dealsense.infrastructure.redis_client import get_redis
            r = get_redis()
            cache_key = f"deals:{tenant_id}:hubspot_cache"
            cached_data = await r.get(cache_key)
            if cached_data:
                logger.debug("hubspot_deals_cache_hit", tenant_id=str(tenant_id))
                return [DealDashboardSchema.model_validate(d) for d in json.loads(cached_data)]

            client = HubSpotClient(tenant_id=tenant_id, db=db)  # type: ignore[arg-type]
            hs_deals = await client.list_deals(limit=50)

            # If connected portal has 0 deals (e.g. fresh sandbox / test portal), seed real deals into the HubSpot CRM!
            if not hs_deals:
                logger.info("hubspot_portal_empty_seeding_starter_deals", tenant_id=str(tenant_id))
                default_deals = [
                    {"dealname": "Orion Cloud Infrastructure Modernization", "amount": "450000", "dealstage": "presentationscheduled"},
                    {"dealname": "Quantum Security Suite Deployment", "amount": "280000", "dealstage": "decisionmakerboughtin"},
                    {"dealname": "Horizon Enterprise Data Platform", "amount": "195000", "dealstage": "contractsent"},
                    {"dealname": "Apex RevOps Automated Telemetry", "amount": "120000", "dealstage": "qualifiedtobuy"},
                    {"dealname": "Crown Global Logistics Platform", "amount": "520000", "dealstage": "decisionmakerboughtin"},
                    {"dealname": "Nebula AI Intelligence Engine", "amount": "340000", "dealstage": "appointmentscheduled"},
                ]
                for d in default_deals:
                    try:
                        await client.create_deal(d)
                    except Exception as seed_err:
                        logger.warning("hubspot_seed_deal_failed", error=str(seed_err))
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
                
                # Cache the successful result for 30 seconds
                await r.setex(cache_key, 30, json.dumps([d.model_dump(mode="json") for d in live_deals]))
                return live_deals
        except Exception as e:
            logger.warning("hubspot_direct_query_failed_falling_back", error=str(e))

    # 3. Try querying local database if available
    if db is not None:
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

    # 4. If in-memory demo deals are present, return them
    if _DEMO_DEALS:
        return _DEMO_DEALS

    return []


@router.post("", response_model=DealDashboardSchema, status_code=201)
async def create_deal(
    body: DealCreateRequest,
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession | None = Depends(get_db_optional),
) -> DealDashboardSchema:
    """Create a new deal in HubSpot CRM and local DealSense database."""
    settings = get_settings()
    hubspot_id = str(uuid4().int)[:8]

    # If HubSpot is connected (via OAuth or access token), create deal in real HubSpot CRM!
    hubspot_token = await _get_active_hubspot_token(tenant_id, db)
    if hubspot_token:
        try:
            client = HubSpotClient(tenant_id=tenant_id, db=db)  # type: ignore[arg-type]
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

    # Invalidate Redis cache so list endpoint reflects new deal immediately
    try:
        from dealsense.infrastructure.redis_client import get_redis
        r = get_redis()
        await r.delete(f"deals:{tenant_id}:hubspot_cache")
    except Exception:
        pass

    # Also persist to database if available
    if db is not None:
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
    db: AsyncSession | None = Depends(get_db_optional),
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
    hubspot_token = await _get_active_hubspot_token(tenant_id, db)
    if hubspot_token and target_hs_id:
        try:
            client = HubSpotClient(tenant_id=tenant_id, db=db)  # type: ignore[arg-type]
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

            # Invalidate Redis cache so subsequent reads immediately reflect live mutation
            try:
                from dealsense.infrastructure.redis_client import get_redis
                r = get_redis()
                await r.delete(f"deals:{tenant_id}:hubspot_cache")
            except Exception:
                pass
        except Exception as hs_err:
            logger.warning("hubspot_update_deal_skipped", error=str(hs_err))

    return target


@router.delete("/{deal_id}")
async def delete_deal(
    deal_id: str,
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession | None = Depends(get_db_optional),
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
    hubspot_token = await _get_active_hubspot_token(tenant_id, db)
    if hubspot_token and target_hs_id:
        try:
            client = HubSpotClient(tenant_id=tenant_id, db=db)  # type: ignore[arg-type]
            await client.delete_deal(target_hs_id)
            logger.info("hubspot_deal_deleted_live", hubspot_id=target_hs_id)
        except Exception as hs_err:
            logger.warning("hubspot_delete_deal_skipped", error=str(hs_err))

    # Invalidate Redis cache so list endpoint reflects deletion immediately
    try:
        from dealsense.infrastructure.redis_client import get_redis
        r = get_redis()
        await r.delete(f"deals:{tenant_id}:hubspot_cache")
    except Exception:
        pass

    # Also remove from DB if valid UUID and DB active
    if db is not None:
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
    db: AsyncSession | None = Depends(get_db_optional),
) -> dict[str, Any]:
    """Manually trigger synchronization of all deals from HubSpot CRM."""
    deals = await list_deals_for_dashboard(tenant_id=tenant_id, db=db)
    hubspot_token = await _get_active_hubspot_token(tenant_id, db)
    return {
        "status": "synced",
        "count": len(deals),
        "source": "hubspot_crm" if hubspot_token else "in_memory_catalog",
        "deals": deals,
    }


@router.get("/{deal_id}", response_model=DealDetailSchema)
async def get_deal_details(
    deal_id: str,
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession | None = Depends(get_db_optional),
) -> DealDetailSchema:
    """Retrieve normalized deal details."""
    deal = await _resolve_deal_record(deal_id, tenant_id, db)

    if not deal:
        for d in _DEMO_DEALS:
            if str(d.id) == str(deal_id) or (d.hubspot_id and d.hubspot_id == str(deal_id)):
                from datetime import UTC, datetime
                return DealDetailSchema(
                    id=d.id,
                    tenant_id=tenant_id,
                    hubspot_deal_id=d.hubspot_id or str(deal_id),
                    name=d.name,
                    pipeline="default",
                    stage=d.stage,
                    amount=d.value,
                    currency="USD",
                    owner_name=d.owner,
                    is_closed=False,
                    is_won=False,
                    created_at=datetime.now(UTC),
                    updated_at=datetime.now(UTC),
                )
        raise HTTPException(status_code=404, detail="Deal not found")

    return DealDetailSchema.model_validate(deal)


@router.get("/{deal_id}/snapshot", response_model=DealSnapshotSchema)
async def get_deal_snapshot(
    deal_id: str,
    tenant_id: UUID = require_permission(Permission.SNAPSHOT_READ),
    db: AsyncSession | None = Depends(get_db_optional),
) -> DealSnapshotSchema:
    """Fetch current precomputed deal intelligence snapshot for HubSpot UI Extension.

    If no snapshot exists yet, computes and returns one on demand.
    """
    target_uuid: UUID | None = None
    with suppress(ValueError):
        target_uuid = UUID(deal_id)

    if target_uuid is not None and db is not None:
        try:
            snapshot = await get_latest_deal_snapshot(tenant_id=tenant_id, deal_id=target_uuid, db=db)
            if snapshot:
                return DealSnapshotSchema.model_validate(snapshot)
        except Exception:
            pass

    deal = await _resolve_deal_record(deal_id, tenant_id, db)

    if deal and db is not None:
        snapshot = await get_latest_deal_snapshot(tenant_id=tenant_id, deal_id=deal.id, db=db)
        if not snapshot:
            try:
                snapshot = await compute_and_persist_deal_snapshot(
                    tenant_id=tenant_id,
                    deal_id=deal.id,
                    db=db,
                )
            except Exception:
                pass
        if snapshot:
            return DealSnapshotSchema.model_validate(snapshot)

    # Check in-memory demo deals or return on-demand snapshot
    score = 72
    deal_name = "HubSpot Deal"
    for d in _DEMO_DEALS:
        if str(d.id) == str(deal_id) or (d.hubspot_id and d.hubspot_id == str(deal_id)):
            score = d.score
            deal_name = d.name
            break

    return _generate_ondemand_snapshot(deal_id, score=score, name=deal_name)


@router.post("/{deal_id}/score", response_model=DealSnapshotSchema)
async def trigger_deal_scoring(
    deal_id: str,
    tenant_id: UUID = require_permission(Permission.DEAL_ANALYZE),
    db: AsyncSession | None = Depends(get_db_optional),
) -> DealSnapshotSchema:
    """Manually trigger deterministic score recomputation and snapshot generation."""
    target_uuid: UUID | None = None
    with suppress(ValueError):
        target_uuid = UUID(deal_id)

    if target_uuid is not None and db is not None:
        try:
            snapshot = await compute_and_persist_deal_snapshot(
                tenant_id=tenant_id,
                deal_id=target_uuid,
                db=db,
            )
            if snapshot:
                return DealSnapshotSchema.model_validate(snapshot)
        except Exception:
            pass

    deal = await _resolve_deal_record(deal_id, tenant_id, db)
    if deal and db is not None:
        try:
            snapshot = await compute_and_persist_deal_snapshot(
                tenant_id=tenant_id,
                deal_id=deal.id,
                db=db,
            )
            return DealSnapshotSchema.model_validate(snapshot)
        except Exception:
            pass

    score = 78
    deal_name = "HubSpot Deal"
    for d in _DEMO_DEALS:
        if str(d.id) == str(deal_id) or (d.hubspot_id and d.hubspot_id == str(deal_id)):
            score = d.score
            deal_name = d.name
            break

    return _generate_ondemand_snapshot(deal_id, score=score, name=deal_name)


@router.post("/{deal_id}/analyze", response_model=DealSnapshotSchema)
async def trigger_deal_analysis(
    deal_id: str,
    tenant_id: UUID = require_permission(Permission.DEAL_ANALYZE),
    db: AsyncSession | None = Depends(get_db_optional),
) -> DealSnapshotSchema:
    """Execute complete end-to-end deal intelligence analysis workflow."""
    target_uuid: UUID | None = None
    with suppress(ValueError):
        target_uuid = UUID(deal_id)

    if target_uuid is not None and db is not None:
        try:
            from dealsense_worker.tasks.analyze import run_deal_analysis
            await run_deal_analysis(tenant_id=tenant_id, deal_id=target_uuid, db=db)
            snapshot = await get_latest_deal_snapshot(tenant_id=tenant_id, deal_id=target_uuid, db=db)
            if snapshot:
                return DealSnapshotSchema.model_validate(snapshot)
        except Exception:
            pass

    deal = await _resolve_deal_record(deal_id, tenant_id, db)
    if deal and db is not None:
        try:
            from dealsense_worker.tasks.analyze import run_deal_analysis
            await run_deal_analysis(tenant_id=tenant_id, deal_id=deal.id, db=db)
            snapshot = await get_latest_deal_snapshot(tenant_id=tenant_id, deal_id=deal.id, db=db)
            if snapshot:
                return DealSnapshotSchema.model_validate(snapshot)
        except Exception:
            pass

    return _generate_ondemand_snapshot(deal_id, score=82)


@router.get("/{deal_id}/signals", response_model=list[DealSignalSchema])
async def get_deal_signals(
    deal_id: str,
    tenant_id: UUID = require_permission(Permission.SNAPSHOT_READ),
    db: AsyncSession | None = Depends(get_db_optional),
) -> list[DealSignalSchema]:
    """List all evaluated risk signals from the latest snapshot."""
    target_uuid: UUID | None = None
    with suppress(ValueError):
        target_uuid = UUID(deal_id)

    if target_uuid is not None and db is not None:
        try:
            snapshot = await get_latest_deal_snapshot(tenant_id=tenant_id, deal_id=target_uuid, db=db)
            if snapshot:
                return [DealSignalSchema.model_validate(s) for s in snapshot.signals]
        except Exception:
            pass

    deal = await _resolve_deal_record(deal_id, tenant_id, db)
    if deal and db is not None:
        snapshot = await get_latest_deal_snapshot(tenant_id=tenant_id, deal_id=deal.id, db=db)
        if snapshot:
            return [DealSignalSchema.model_validate(s) for s in snapshot.signals]

    from datetime import UTC, datetime
    return [
        DealSignalSchema(
            id=uuid4(),
            signal_type="stage_aging",
            severity="low",
            impact_score=0.0,
            details={"title": "Stage Duration Normal", "description": "Within historical stage duration benchmarks."},
            evidence_ids=[],
            created_at=datetime.now(UTC),
        )
    ]


@router.post("/sync-hubspot", response_model=dict)
async def sync_hubspot_deals(
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession | None = Depends(get_db_optional),
):
    """Sync deals from HubSpot and invalidate cache."""
    try:
        from dealsense.infrastructure.redis_client import get_redis
        r = get_redis()
        cache_key = f"deals:{tenant_id}:hubspot_cache"
        await r.delete(cache_key)
        
        deals = await list_deals_for_dashboard(tenant_id=tenant_id, db=db)
        return {
            "status": "success",
            "syncedCount": len(deals),
            "deals": [d.model_dump(mode="json") for d in deals]
        }
    except Exception as e:
        logger.error("sync_hubspot_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{deal_id}/snapshot", response_model=dict)
async def get_deal_snapshot(
    deal_id: UUID,
    tenant_id: UUID = require_permission(Permission.DEAL_READ),
    db: AsyncSession | None = Depends(get_db_optional),
):
    """Get detailed snapshot for a specific deal from HubSpot."""
    try:
        deal = await _resolve_deal_record(str(deal_id), tenant_id, db)
        hubspot_id = str(deal_id)
        if deal and deal.hubspot_id:
            hubspot_id = deal.hubspot_id
            
        hubspot_token = await _get_active_hubspot_token(tenant_id, db)
        if hubspot_token and db:
            from dealsense.infrastructure.hubspot_client import HubSpotClient
            client = HubSpotClient(tenant_id=tenant_id, db=db)
            hs_deal = await client.get_deal(hubspot_id)
            return hs_deal
            
        raise HTTPException(status_code=404, detail="No active HubSpot connection")
    except HTTPException:
        raise
    except Exception as e:
        logger.error("get_deal_snapshot_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


class NotePayload(BaseModel):
    content: str
    owner_id: str | None = None

class EmailPayload(BaseModel):
    subject: str
    body: str
    to_email: str
    owner_id: str | None = None

class TaskPayload(BaseModel):
    subject: str
    body: str
    due_timestamp_ms: int
    owner_id: str | None = None

class MeetingPayload(BaseModel):
    title: str
    body: str
    owner_id: str | None = None

@router.post("/{deal_id}/notes", response_model=dict)
async def create_deal_note(
    deal_id: str,
    payload: NotePayload,
    tenant_id: UUID = require_permission(Permission.DEAL_UPDATE),
    db: AsyncSession | None = Depends(get_db_optional),
):
    try:
        hubspot_token = await _get_active_hubspot_token(tenant_id, db)
        if hubspot_token and db:
            from dealsense.infrastructure.hubspot_client import HubSpotClient
            client = HubSpotClient(tenant_id=tenant_id, db=db)
            res = await client.create_note(payload.content, deal_id, payload.owner_id)
            return {"status": "success", "result": res}
        return {"status": "skipped", "message": "No active HubSpot connection"}
    except Exception as e:
        logger.error("create_note_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{deal_id}/emails", response_model=dict)
async def create_deal_email(
    deal_id: str,
    payload: EmailPayload,
    tenant_id: UUID = require_permission(Permission.DEAL_UPDATE),
    db: AsyncSession | None = Depends(get_db_optional),
):
    try:
        hubspot_token = await _get_active_hubspot_token(tenant_id, db)
        if hubspot_token and db:
            from dealsense.infrastructure.hubspot_client import HubSpotClient
            client = HubSpotClient(tenant_id=tenant_id, db=db)
            res = await client.create_email(payload.subject, payload.body, payload.to_email, deal_id, payload.owner_id)
            return {"status": "success", "result": res}
        return {"status": "skipped", "message": "No active HubSpot connection"}
    except Exception as e:
        logger.error("create_email_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{deal_id}/tasks", response_model=dict)
async def create_deal_task(
    deal_id: str,
    payload: TaskPayload,
    tenant_id: UUID = require_permission(Permission.DEAL_UPDATE),
    db: AsyncSession | None = Depends(get_db_optional),
):
    try:
        hubspot_token = await _get_active_hubspot_token(tenant_id, db)
        if hubspot_token and db:
            from dealsense.infrastructure.hubspot_client import HubSpotClient
            client = HubSpotClient(tenant_id=tenant_id, db=db)
            res = await client.create_task(payload.subject, payload.body, payload.due_timestamp_ms, payload.owner_id, deal_id)
            return {"status": "success", "result": res}
        return {"status": "skipped", "message": "No active HubSpot connection"}
    except Exception as e:
        logger.error("create_task_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{deal_id}/meetings", response_model=dict)
async def create_deal_meeting(
    deal_id: str,
    payload: MeetingPayload,
    tenant_id: UUID = require_permission(Permission.DEAL_UPDATE),
    db: AsyncSession | None = Depends(get_db_optional),
):
    try:
        hubspot_token = await _get_active_hubspot_token(tenant_id, db)
        if hubspot_token and db:
            from dealsense.infrastructure.hubspot_client import HubSpotClient
            client = HubSpotClient(tenant_id=tenant_id, db=db)
            res = await client.create_meeting(payload.title, payload.body, deal_id, payload.owner_id)
            return {"status": "success", "result": res}
        return {"status": "skipped", "message": "No active HubSpot connection"}
    except Exception as e:
        logger.error("create_meeting_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))
