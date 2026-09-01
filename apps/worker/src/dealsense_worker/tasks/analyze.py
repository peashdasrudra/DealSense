"""DealSense Worker — Deal Analysis Task.

Entry point for executing deal intelligence analysis workflows from queue jobs or direct triggers.
"""

from uuid import UUID

import structlog
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.infrastructure.queue import publish_event
from dealsense_worker.workflows.deal_analysis import DealAnalysisWorkflow
from dealsense_worker.workflows.state import DealAnalysisState

logger = structlog.get_logger(__name__)


async def run_deal_analysis(
    tenant_id: UUID,
    deal_id: UUID,
    db: AsyncSession,
    trace_id: str = "",
) -> DealAnalysisState:
    """Execute deal analysis workflow and emit completion domain event.

    Args:
        tenant_id: Tenant UUID
        deal_id: Deal UUID
        db: AsyncSession
        trace_id: Correlation trace ID

    Returns:
        DealAnalysisState with workflow results
    """
    logger.info("running_deal_analysis_task", tenant_id=str(tenant_id), deal_id=str(deal_id))
    workflow = DealAnalysisWorkflow(db=db)
    state = await workflow.execute(tenant_id=tenant_id, deal_id=deal_id, trace_id=trace_id)

    # Publish completion event
    await publish_event(
        event_type="analysis.completed",
        payload={
            "tenant_id": str(tenant_id),
            "deal_id": str(deal_id),
            "snapshot_id": str(state.snapshot_id) if state.snapshot_id else None,
            "health_score": state.scoring_result.health_score if state.scoring_result else None,
            "risk_band": state.scoring_result.risk_band if state.scoring_result else None,
            "duration_ms": state.execution_duration_ms,
        },
    )

    return state
