"""DealSense Scoring Engine — Signal Evaluators.

Implementation of the 7 deterministic revenue risk signals:
1. Stage Aging (velocity decay vs benchmark)
2. Engagement Decay (days since touchpoint)
3. Stakeholder Gap (missing champion / economic buyer)
4. Commitment Quality (scheduled next step & task hygiene)
5. Date Slippage (close date push history)
6. CRM Hygiene (data completeness)
7. Historical Win Probability / Stage Progression
"""

from scoring.models import EvaluatedSignal, ScoringDealInput


def evaluate_stage_aging(deal: ScoringDealInput) -> EvaluatedSignal | None:
    """Evaluate if the deal is stalled in its current pipeline stage."""
    if deal.stage_benchmark_days <= 0:
        return None

    ratio = deal.days_in_current_stage / deal.stage_benchmark_days

    if ratio <= 1.0:
        return None  # On track

    if ratio >= 2.5:
        severity = "critical"
        penalty = 25.0
        desc = f"Deal has been in stage '{deal.stage}' for {deal.days_in_current_stage:.0f} days ({ratio:.1f}x the {deal.stage_benchmark_days:.0f}-day benchmark). Velocity is severely stalled."
    elif ratio >= 1.75:
        severity = "high"
        penalty = 18.0
        desc = f"Deal is aging in '{deal.stage}' ({deal.days_in_current_stage:.0f} days vs {deal.stage_benchmark_days:.0f}-day benchmark, {ratio:.1f}x slower)."
    else:
        severity = "warning"
        penalty = 10.0
        desc = f"Deal has slightly exceeded benchmark in '{deal.stage}' ({deal.days_in_current_stage:.0f} days vs {deal.stage_benchmark_days:.0f} days)."

    return EvaluatedSignal(
        signal_type="stage_aging",
        severity=severity,
        score_penalty=penalty,
        title="Pipeline Stage Aging",
        description=desc,
        evidence=[
            f"Current Stage: {deal.stage}",
            f"Days in stage: {deal.days_in_current_stage:.0f}",
            f"Benchmark days: {deal.stage_benchmark_days:.0f}",
        ],
        metrics={
            "days_in_stage": deal.days_in_current_stage,
            "benchmark_days": deal.stage_benchmark_days,
            "ratio": round(ratio, 2),
        },
    )


def evaluate_engagement_decay(deal: ScoringDealInput) -> EvaluatedSignal | None:
    """Evaluate touchpoint recency (meetings, calls, notes, emails)."""
    days = deal.days_since_last_activity

    if days < 7:
        return None  # Healthy recent engagement

    if days >= 28:
        severity = "critical"
        penalty = 30.0
        desc = f"Severe engagement drop-off: No recorded customer activity in {days:.0f} days."
    elif days >= 14:
        severity = "high"
        penalty = 20.0
        desc = f"Engagement decay detected: {days:.0f} days since last recorded interaction with prospect."
    else:
        severity = "warning"
        penalty = 10.0
        desc = f"Touchpoint recency warning: {days:.0f} days without prospect activity."

    return EvaluatedSignal(
        signal_type="engagement_decay",
        severity=severity,
        score_penalty=penalty,
        title="Engagement Decay",
        description=desc,
        evidence=[f"Days since last activity: {days:.0f}"],
        metrics={"days_since_last_activity": days},
    )


def evaluate_stakeholder_gap(deal: ScoringDealInput) -> EvaluatedSignal | None:
    """Evaluate presence of crucial buying roles (Champion, Economic Buyer)."""
    roles = [r.lower() for r in deal.identified_roles]
    has_champion = "champion" in roles
    has_economic_buyer = "economic_buyer" in roles or "economic buyer" in roles

    if has_champion and has_economic_buyer:
        return None  # Multi-threaded coverage

    missing = []
    if not has_champion:
        missing.append("Champion")
    if not has_economic_buyer:
        missing.append("Economic Buyer")

    if not has_champion and not has_economic_buyer:
        severity = "critical"
        penalty = 25.0
        desc = "Single-threaded deal: Neither an internal Champion nor Economic Buyer has been confirmed."
    else:
        severity = "high"
        penalty = 15.0
        desc = f"Key stakeholder gap: Missing confirmed {', '.join(missing)}."

    return EvaluatedSignal(
        signal_type="stakeholder_gap",
        severity=severity,
        score_penalty=penalty,
        title="Stakeholder Coverage Gap",
        description=desc,
        evidence=[
            f"Missing Roles: {', '.join(missing)}",
            f"Identified Contacts: {deal.total_contacts_count}",
        ],
        metrics={
            "has_champion": has_champion,
            "has_economic_buyer": has_economic_buyer,
            "total_contacts": deal.total_contacts_count,
        },
    )


def evaluate_commitment_quality(deal: ScoringDealInput) -> EvaluatedSignal | None:
    """Evaluate next step definition and task hygiene."""
    penalties = 0.0
    evidence = []
    issues = []

    if not deal.has_scheduled_next_step:
        penalties += 15.0
        issues.append("No agreed next step or scheduled meeting")
        evidence.append("No active next step scheduled")

    if deal.past_due_tasks_count > 0:
        penalties += min(deal.past_due_tasks_count * 5.0, 15.0)
        issues.append(f"{deal.past_due_tasks_count} overdue follow-up task(s)")
        evidence.append(f"Past-due tasks: {deal.past_due_tasks_count}")

    if penalties == 0.0:
        return None

    if penalties >= 25.0:
        severity = "critical"
    elif penalties >= 15.0:
        severity = "high"
    else:
        severity = "warning"

    return EvaluatedSignal(
        signal_type="commitment_quality",
        severity=severity,
        score_penalty=penalties,
        title="Commitment & Next-Step Quality",
        description="; ".join(issues) + ".",
        evidence=evidence,
        metrics={
            "has_scheduled_next_step": deal.has_scheduled_next_step,
            "past_due_tasks": deal.past_due_tasks_count,
        },
    )


def evaluate_date_slippage(deal: ScoringDealInput) -> EvaluatedSignal | None:
    """Evaluate close date slippage and push history."""
    pushes = deal.close_date_push_count

    if pushes == 0:
        return None

    if pushes >= 4:
        severity = "critical"
        penalty = 25.0
        desc = f"Chronic date slippage: Target close date has been pushed {pushes} times."
    elif pushes >= 2:
        severity = "high"
        penalty = 15.0
        desc = f"Date slippage risk: Target close date has been pushed {pushes} times."
    else:
        severity = "warning"
        penalty = 8.0
        desc = f"Close date was pushed {pushes} time."

    return EvaluatedSignal(
        signal_type="date_slippage",
        severity=severity,
        score_penalty=penalty,
        title="Close Date Slippage",
        description=desc,
        evidence=[f"Close date pushed {pushes} times"],
        metrics={"close_date_pushes": pushes},
    )


def evaluate_crm_hygiene(deal: ScoringDealInput) -> EvaluatedSignal | None:
    """Evaluate basic CRM data completeness."""
    missing = []
    penalties = 0.0

    if deal.amount is None or deal.amount <= 0:
        missing.append("Deal Amount")
        penalties += 10.0
    if not deal.owner_id:
        missing.append("Deal Owner")
        penalties += 10.0
    if not deal.close_date:
        missing.append("Close Date")
        penalties += 10.0

    if not missing:
        return None

    severity = "high" if penalties >= 20.0 else "warning"

    return EvaluatedSignal(
        signal_type="crm_hygiene",
        severity=severity,
        score_penalty=penalties,
        title="CRM Data Hygiene",
        description=f"Incomplete deal records: Missing {', '.join(missing)}.",
        evidence=[f"Missing fields: {', '.join(missing)}"],
        metrics={"missing_fields": missing},
    )


def evaluate_historical_similarity(deal: ScoringDealInput) -> EvaluatedSignal | None:
    """Baseline heuristic evaluating stage progression vs overall win characteristics."""
    # When deal amount is high and in early stage with high aging, flag disproportionate risk
    if (deal.amount or 0) > 100000 and deal.days_in_current_stage > 30:
        return EvaluatedSignal(
            signal_type="historical_similarity",
            severity="warning",
            score_penalty=8.0,
            title="High Value Stalled Profile",
            description="Enterprise tier deal (> $100k) exhibiting stalling pattern uncommon in winning deals.",
            evidence=[
                f"Amount: ${deal.amount:,.0f}",
                f"Stage days: {deal.days_in_current_stage:.0f}",
            ],
            metrics={"amount": deal.amount, "days": deal.days_in_current_stage},
        )
    return None
