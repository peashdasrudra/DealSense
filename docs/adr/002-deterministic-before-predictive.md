# ADR-002: Deterministic Scoring Before Predictive ML

## Status
Accepted

## Context
Deal health scoring can be implemented through:
1. Pure LLM-based scoring (ask GPT to rate the deal)
2. Predictive ML models trained on historical win/loss data
3. Deterministic signals from measurable CRM data
4. Hybrid: deterministic signals + LLM for extraction/explanation

## Decision
We will implement a **deterministic scoring engine** based on measurable CRM signals as the production score, and use LLMs only for **structured extraction, explanation, and recommendation generation** — never for computing the score itself.

## Rationale
- **Explainability**: Every score point can be traced to a specific signal and evidence. "Risk increased by 18 because the economic buyer hasn't engaged in 18 days" is far more actionable than "the AI thinks this deal is 42% healthy."
- **Testability**: Deterministic scoring is reproducible — identical inputs always produce identical outputs. This enables regression testing and quality gates before deployment.
- **Reliability**: LLM outputs vary between calls, models, and versions. A production score that shifts based on model temperature is not commercially viable for agencies.
- **Safety**: If the LLM hallucinates, it affects explanations and recommendations (which are reviewed by humans) but not the core risk assessment.
- **Auditability**: Agencies and their clients need to understand and trust the scoring methodology. "We weight 7 measurable signals" is auditable; "we ask GPT" is not.

## Consequences
- We must define, calibrate, and maintain 7+ signal calculations with configurable weights.
- LLM costs are bounded to extraction/explanation tasks, not every scoring run.
- We need sufficient CRM activity data per deal for signals to be meaningful.
- Historical similarity scoring (signal 7) will start as a placeholder until we have enough closed-deal data.

## Formula
```
Deal Health = w₁(engagement) + w₂(stakeholder_coverage) + w₃(velocity) 
            + w₄(commitment_quality) + w₅(sentiment_trend) + w₆(crm_hygiene) 
            + w₇(historical_similarity)
```

## Alternatives Rejected
- **Pure LLM scoring**: Non-deterministic, unexplainable, untestable, and commercially risky.
- **Pure predictive ML**: Requires extensive labeled historical data we don't have at launch, and is opaque to end users.
