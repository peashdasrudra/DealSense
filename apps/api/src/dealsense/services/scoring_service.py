"""DealSense API — Deal Health Scoring & Snapshot Service.

Hydrates deal metrics from normalized database tables, computes deterministic risk scores,
persists immutable DealSnapshot and DealSignal records, and tracks historical deltas.
"""

from datetime import datetime, timezone
from typing import Any
from uuid import UUID, uuid4

import structlog
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from dealsense.domain.exceptions import DealNotFoundError
from dealsense.domain.models import Activity, Deal, DealParticipant, DealSignal, DealSnapshot, DealStageHistory
from scoring import ScoringDealInput, score_deal

logger = structlog.get_logger(__name__)


async def compute_and_persist_deal_snapshot(
    tenant_id: UUID,
    deal_id: UUID,
    db: AsyncSession,
) -> DealSnapshot:
    """Compute deterministic score for a deal and persist a new current snapshot.

    Args:
        tenant_id: Tenant UUID
        deal_id: Deal UUID in database
        db: AsyncSession

    Returns:
        The newly persisted DealSnapshot model
    """
    # 1. Fetch deal with related activities, participants, and stage history
    stmt = (
        select(Deal)
        .where(Deal.id == deal_id, Deal.tenant_id == tenant_id)
        .options(
            selectinload(Deal.stage_history),
            selectinload(Deal.activities),
            selectinload(Deal.participants),
        )
    )
    result = await db.execute(stmt)
    deal = result.scalar_one_or_none()

    if not deal:
        raise DealNotFoundError(str(deal_id))

    # 2. Extract metrics from relational history
    now = datetime.now(timezone.utc)

    # Days in current stage
    days_in_stage = 0.0
    if deal.stage_history:
        latest_transition = max(deal.stage_history, key=lambda h: h.changed_at)
        days_in_stage = max(0.0, (now - latest_transition.changed_at.replace(tzinfo=timezone.utc)).total_seconds() / 86400.0)
    elif deal.created_at:
        days_in_stage = max(0.0, (now - deal.created_at.replace(tzinfo=timezone.utc)).total_seconds() / 86400.0)

    # Days since last activity
    days_since_activity = 0.0
    has_scheduled_next_step = False
    past_due_tasks = 0
    open_tasks = 0

    if deal.activities:
        latest_activity = max(deal.activities, key=lambda a: a.occurred_at)
        days_since_activity = max(0.0, (now - latest_activity.occurred_at.replace(tzinfo=timezone.utc)).total_seconds() / 86400.0)

        for act in deal.activities:
            if act.activity_type == "task":
                meta = act.metadata_json or {}
                status = meta.get("hs_task_status", "NOT_STARTED")
                if status != "COMPLETED":
                    open_tasks += 1
                    due_ts = meta.get("hs_timestamp")
                    if due_ts and int(due_ts) < (now.timestamp() * 1000):
                        past_due_tasks += 1
            elif act.activity_type in ("meeting", "call"):
                # If meeting scheduled in the future
                if act.occurred_at.replace(tzinfo=timezone.utc) > now:
                    has_scheduled_next_step = True

    # Stakeholder roles
    identified_roles = [p.role for p in deal.participants if p.role]
    total_contacts = len(deal.participants)

    # 3. Construct scoring input
    scoring_input = ScoringDealInput(
        deal_id=str(deal.id),
        name=deal.name,
        stage=deal.stage,
        pipeline=deal.pipeline,
        amount=deal.amount,
        close_date=deal.close_date,
        created_at=deal.created_at,
        owner_id=deal.owner_id,
        properties=deal.properties,
        days_in_current_stage=days_in_stage,
        stage_benchmark_days=14.0,  # Default benchmark
        days_since_last_activity=days_since_activity,
        close_date_push_count=int(deal.properties.get("hs_num_target_date_changes", 0)),
        past_due_tasks_count=past_due_tasks,
        open_tasks_count=open_tasks,
        has_scheduled_next_step=has_scheduled_next_step,
        identified_roles=identified_roles,
        total_contacts_count=total_contacts,
    )

    # 4. Evaluate deterministic score
    scoring_result = score_deal(scoring_input)

    # 5. Fetch previous snapshot for delta tracking
    prev_stmt = (
        select(DealSnapshot)
        .where(
            DealSnapshot.deal_id == deal.id,
            DealSnapshot.tenant_id == tenant_id,
            DealSnapshot.is_current.is_(True),
        )
    )
    prev_res = await db.execute(prev_stmt)
    prev_snapshot = prev_res.scalar_one_or_none()

    prev_score = prev_snapshot.health_score if prev_snapshot else None
    score_delta = (scoring_result.health_score - prev_score) if prev_score is not None else None

    # Mark old snapshots as not current
    if prev_snapshot:
        await db.execute(
            update(DealSnapshot)
            .where(DealSnapshot.deal_id == deal.id, DealSnapshot.tenant_id == tenant_id)
            .values(is_current=False)
        )

    # 6. Create new DealSnapshot
    snapshot = DealSnapshot(
        id=uuid4(),
        deal_id=deal.id,
        tenant_id=tenant_id,
        health_score=scoring_result.health_score,
        risk_band=scoring_result.risk_band,
        confidence=scoring_result.confidence,
        previous_health_score=prev_score,
        score_delta=score_delta,
        top_signals=[s.model_dump() for s in scoring_result.top_signals],
        risk_explanation=scoring_result.risk_summary,
        is_current=True,
    )
    db.add(snapshot)
    await db.flush()

    # 7. Persist individual DealSignal records
    for signal_eval in scoring_result.signals:
        signal_record = DealSignal(
            id=uuid4(),
            deal_id=deal.id,
            tenant_id=tenant_id,
            snapshot_id=snapshot.id,
            signal_type=signal_eval.signal_type,
            severity=signal_eval.severity,
            impact_score=signal_eval.score_penalty,
            details={
                "title": signal_eval.title,
                "description": signal_eval.description,
                "metrics": signal_eval.metrics,
            },
            evidence_ids=signal_eval.evidence,
        )
        db.add(signal_record)

    await db.flush()

    logger.info(
        "deal_snapshot_created",
        deal_id=str(deal.id),
        score=snapshot.health_score,
        risk_band=snapshot.risk_band,
        delta=score_delta,
    )

    return snapshot


async def get_latest_deal_snapshot(
    tenant_id: UUID,
    deal_id: UUID,
    db: AsyncSession,
) -> DealSnapshot | None:
    """Retrieve the current active snapshot for a deal."""
    stmt = (
        select(DealSnapshot)
        .where(
            DealSnapshot.deal_id == deal_id,
            DealSnapshot.tenant_id == tenant_id,
            DealSnapshot.is_current.is_(True),
        )
        .options(selectinload(DealSnapshot.signals))
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()
