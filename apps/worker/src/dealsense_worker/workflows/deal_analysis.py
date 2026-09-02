"""DealSense Worker — LangGraph Deal Analysis Workflow.

State graph orchestrating deterministic risk scoring, hybrid evidence retrieval,
MEDDICC qualification extraction, tiered recommendations, and immutable snapshot persistence.
"""

import time
from datetime import UTC, datetime
from uuid import UUID, uuid4

import structlog
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from dealsense.domain.enums import ActionStatus
from dealsense.domain.exceptions import DealNotFoundError
from dealsense.domain.models import (
    ActionProposal,
    Deal,
    DealSignal,
    DealSnapshot,
)
from dealsense.services.llm_service import extract_meddicc_analysis
from dealsense.services.recommendation_service import generate_recommended_actions
from dealsense.services.retrieval_service import search_deal_evidence
from dealsense_worker.workflows.state import DealAnalysisState
from scoring import ScoringDealInput, score_deal

logger = structlog.get_logger(__name__)


class DealAnalysisWorkflow:
    """Orchestrates end-to-end deal intelligence analysis."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def execute(
        self, tenant_id: UUID, deal_id: UUID, trace_id: str = ""
    ) -> DealAnalysisState:
        """Run the full analysis pipeline across all sequential nodes."""
        start_time = time.perf_counter()
        state = DealAnalysisState(
            tenant_id=tenant_id,
            deal_id=deal_id,
            trace_id=trace_id or str(uuid4()),
        )

        try:
            # Step 1: Hydrate Deal State
            state = await self._hydrate_deal_node(state)

            # Step 2: Compute Deterministic Score
            state = await self._score_deal_node(state)

            # Step 3: Retrieve Hybrid Evidence
            state = await self._retrieve_evidence_node(state)

            # Step 4: Extract MEDDICC Qualification
            state = await self._extract_meddicc_node(state)

            # Step 5: Generate Tiered Recommendations
            state = await self._generate_recommendations_node(state)

            # Step 6: Synthesize Narrative & Explanation
            state = await self._synthesize_narrative_node(state)

            # Step 7: Persist Snapshot & Action Proposals
            state = await self._persist_snapshot_node(state)

            state.current_node = "completed"
            state.execution_duration_ms = int((time.perf_counter() - start_time) * 1000)

            logger.info(
                "analysis_workflow_completed",
                deal_id=str(deal_id),
                health_score=state.scoring_result.health_score if state.scoring_result else 0,
                duration_ms=state.execution_duration_ms,
            )
            return state

        except Exception as e:
            state.errors.append(str(e))
            state.current_node = "failed"
            logger.error("analysis_workflow_failed", deal_id=str(deal_id), error=str(e))
            raise

    # ---- Graph Nodes ----

    async def _hydrate_deal_node(self, state: DealAnalysisState) -> DealAnalysisState:
        """Node 1: Load deal and related activity history from database."""
        state.current_node = "hydrate_deal"

        stmt = (
            select(Deal)
            .where(Deal.id == state.deal_id, Deal.tenant_id == state.tenant_id)
            .options(
                selectinload(Deal.stage_history),
                selectinload(Deal.activities),
                selectinload(Deal.participants),
            )
        )
        result = await self.db.execute(stmt)
        deal = result.scalar_one_or_none()

        if not deal:
            raise DealNotFoundError(str(state.deal_id))

        state.deal_name = deal.name
        state.stage = deal.stage
        state.pipeline = deal.pipeline
        state.amount = deal.amount
        state.owner_id = deal.owner_id
        state.owner_name = deal.owner_name
        state.properties = deal.properties or {}

        state.activities = [
            {
                "id": str(a.id),
                "type": a.activity_type,
                "content": a.content,
                "occurred_at": a.occurred_at.isoformat(),
            }
            for a in deal.activities
        ]

        state.participants = [
            {"id": str(p.id), "role": p.role, "role_confidence": p.role_confidence}
            for p in deal.participants
        ]

        state.stage_history = [
            {
                "from_stage": h.from_stage,
                "to_stage": h.to_stage,
                "changed_at": h.changed_at.isoformat(),
            }
            for h in deal.stage_history
        ]

        state.completed_nodes.append("hydrate_deal")
        return state

    async def _score_deal_node(self, state: DealAnalysisState) -> DealAnalysisState:
        """Node 2: Evaluate deterministic risk signals."""
        state.current_node = "score_deal"
        now = datetime.now(UTC)

        # Calculate time in current stage
        days_in_stage = 0.0
        if state.stage_history:
            latest_transition_iso = state.stage_history[-1]["changed_at"]
            latest_dt = datetime.fromisoformat(latest_transition_iso)
            days_in_stage = max(0.0, (now - latest_dt).total_seconds() / 86400.0)

        # Days since last activity
        days_since_activity = 0.0
        has_next_step = False
        past_due_tasks = 0

        if state.activities:
            latest_act_iso = max(state.activities, key=lambda a: a["occurred_at"])["occurred_at"]
            latest_act_dt = datetime.fromisoformat(latest_act_iso)
            days_since_activity = max(0.0, (now - latest_act_dt).total_seconds() / 86400.0)

            for act in state.activities:
                if act["type"] in ("meeting", "call"):
                    act_dt = datetime.fromisoformat(act["occurred_at"])
                    if act_dt > now:
                        has_next_step = True

        identified_roles = [p["role"] for p in state.participants if p.get("role")]

        scoring_input = ScoringDealInput(
            deal_id=str(state.deal_id),
            name=state.deal_name,
            stage=state.stage,
            pipeline=state.pipeline,
            amount=state.amount,
            owner_id=state.owner_id,
            properties=state.properties,
            days_in_current_stage=days_in_stage,
            stage_benchmark_days=14.0,
            days_since_last_activity=days_since_activity,
            close_date_push_count=int(state.properties.get("hs_num_target_date_changes", 0)),
            past_due_tasks_count=past_due_tasks,
            has_scheduled_next_step=has_next_step,
            identified_roles=identified_roles,
            total_contacts_count=len(state.participants),
        )

        state.scoring_result = score_deal(scoring_input)
        state.completed_nodes.append("score_deal")
        return state

    async def _retrieve_evidence_node(self, state: DealAnalysisState) -> DealAnalysisState:
        """Node 3: Hybrid vector + keyword search for risk evidence."""
        state.current_node = "retrieve_evidence"

        query_terms = ["budget", "decision process", "champion", "timeline", "pain point"]
        if state.scoring_result and state.scoring_result.top_signals:
            query_terms.extend([s.title for s in state.scoring_result.top_signals])

        query = " ".join(query_terms[:4])
        state.retrieved_evidence = await search_deal_evidence(
            tenant_id=state.tenant_id,
            deal_id=state.deal_id,
            query=query,
            db=self.db,
            top_k=5,
        )

        state.completed_nodes.append("retrieve_evidence")
        return state

    async def _extract_meddicc_node(self, state: DealAnalysisState) -> DealAnalysisState:
        """Node 4: Structured LLM extraction for MEDDICC."""
        state.current_node = "extract_meddicc"

        evidence_texts = [e.content for e in state.retrieved_evidence]
        if not evidence_texts and state.activities:
            evidence_texts = [a["content"] for a in state.activities if a.get("content")][:5]

        state.meddicc_result = await extract_meddicc_analysis(
            deal_name=state.deal_name,
            stage=state.stage,
            amount=state.amount,
            owner_name=state.owner_name,
            evidence_texts=evidence_texts,
        )

        state.completed_nodes.append("extract_meddicc")
        return state

    async def _generate_recommendations_node(self, state: DealAnalysisState) -> DealAnalysisState:
        """Node 5: Tiered Next-Best-Action recommendations."""
        state.current_node = "generate_recommendations"

        top_signals_dict = (
            [s.model_dump() for s in state.scoring_result.top_signals]
            if state.scoring_result
            else []
        )

        state.recommendations = await generate_recommended_actions(
            deal_id=str(state.deal_id),
            deal_name=state.deal_name,
            stage=state.stage,
            amount=state.amount,
            health_score=state.scoring_result.health_score if state.scoring_result else 50,
            risk_band=state.scoring_result.risk_band if state.scoring_result else "moderate",
            top_signals=top_signals_dict,
            meddicc=state.meddicc_result,
            recent_context="\n".join([e.content for e in state.retrieved_evidence[:3]]),
        )

        state.completed_nodes.append("generate_recommendations")
        return state

    async def _synthesize_narrative_node(self, state: DealAnalysisState) -> DealAnalysisState:
        """Node 6: Synthesize executive risk explanation & what changed."""
        state.current_node = "synthesize_narrative"

        if state.scoring_result:
            state.risk_explanation = state.scoring_result.risk_summary
        else:
            state.risk_explanation = "Deal analysis completed."

        if state.stage_history:
            last_change = state.stage_history[-1]
            state.what_changed = (
                f"Deal moved from '{last_change['from_stage']}' to '{last_change['to_stage']}'."
            )
        else:
            state.what_changed = "No recent stage transitions recorded."

        state.completed_nodes.append("synthesize_narrative")
        return state

    async def _persist_snapshot_node(self, state: DealAnalysisState) -> DealAnalysisState:
        """Node 7: Persist snapshot, signals, and action proposals in PostgreSQL."""
        state.current_node = "persist_snapshot"

        # Fetch previous snapshot for delta calculation
        prev_stmt = select(DealSnapshot).where(
            DealSnapshot.deal_id == state.deal_id,
            DealSnapshot.tenant_id == state.tenant_id,
            DealSnapshot.is_current.is_(True),
        )
        prev_res = await self.db.execute(prev_stmt)
        prev_snapshot = prev_res.scalar_one_or_none()

        prev_score = prev_snapshot.health_score if prev_snapshot else None
        current_score = state.scoring_result.health_score if state.scoring_result else 50
        score_delta = (current_score - prev_score) if prev_score is not None else None

        # Mark previous snapshot not current
        if prev_snapshot:
            await self.db.execute(
                update(DealSnapshot)
                .where(
                    DealSnapshot.deal_id == state.deal_id, DealSnapshot.tenant_id == state.tenant_id
                )
                .values(is_current=False)
            )

        # Create new DealSnapshot
        snapshot = DealSnapshot(
            id=uuid4(),
            deal_id=state.deal_id,
            tenant_id=state.tenant_id,
            health_score=current_score,
            risk_band=state.scoring_result.risk_band if state.scoring_result else "moderate",
            confidence=state.scoring_result.confidence if state.scoring_result else 1.0,
            previous_health_score=prev_score,
            score_delta=score_delta,
            top_signals=[s.model_dump() for s in state.scoring_result.top_signals]
            if state.scoring_result
            else [],
            methodology_extraction=state.meddicc_result.model_dump()
            if state.meddicc_result
            else {},
            risk_explanation=state.risk_explanation,
            what_changed=state.what_changed,
            recommended_actions=[a.model_dump() for a in state.recommendations],
            evidence_summary=[e.model_dump() for e in state.retrieved_evidence],
            trace_id=state.trace_id,
            is_current=True,
        )
        self.db.add(snapshot)
        await self.db.flush()

        # Persist signals
        if state.scoring_result:
            for signal in state.scoring_result.signals:
                signal_rec = DealSignal(
                    id=uuid4(),
                    deal_id=state.deal_id,
                    tenant_id=state.tenant_id,
                    snapshot_id=snapshot.id,
                    signal_type=signal.signal_type,
                    severity=signal.severity,
                    impact_score=signal.score_penalty,
                    details={
                        "title": signal.title,
                        "description": signal.description,
                        "metrics": signal.metrics,
                    },
                    evidence_ids=signal.evidence,
                )
                self.db.add(signal_rec)

        # Persist Action Proposals
        for action in state.recommendations:
            proposal = ActionProposal(
                id=uuid4(),
                deal_id=state.deal_id,
                tenant_id=state.tenant_id,
                snapshot_id=snapshot.id,
                category=action.category,
                tier=action.tier,
                title=action.title,
                description=action.description,
                rationale=action.rationale,
                evidence_ids=action.evidence_citations,
                confidence=action.confidence,
                payload=action.suggested_payload,
                status=ActionStatus.PROPOSED,
                idempotency_key=f"prop:{state.deal_id}:{action.id}",
                created_by="dealsense_ai",
            )
            self.db.add(proposal)

        await self.db.flush()
        state.snapshot_id = snapshot.id
        state.completed_nodes.append("persist_snapshot")
        return state
