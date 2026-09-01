# ADR-004: Approval Gates Before Autonomous Actions

## Status
Accepted

## Context
DealSense can recommend and execute actions in HubSpot CRM — creating tasks, adding notes, updating properties, changing deal stages, etc. The question is how much autonomy to give the system.

## Decision
We will implement a **6-tier action ladder** where higher-impact actions require progressively more explicit human approval. No autonomous CRM writes in V1.

## Tiers
| Tier | Examples | Policy |
|------|----------|--------|
| 0: Read-only | Score, evidence, explanation | Automatic |
| 1: Suggestion | "Create follow-up task" | User manually triggers |
| 2: Draft | Draft note, task, email outline | User reviews and confirms |
| 3: Controlled write | Create task, add note, update property | Explicit user approval |
| 4: High-impact write | Change forecast, stage, owner | Manager approval + user confirmation |
| 5: Autonomous | Recurring automated action | Customer-specific policy, monitoring required |

## Rationale
- **Commercial trust**: Agencies selling DealSense to clients cannot afford "the AI moved a deal stage without anyone knowing." A single unauthorized write could end a client relationship.
- **Regulatory/compliance**: Many B2B organizations have policies about CRM data modification. Approval gates demonstrate governance.
- **Liability**: If an autonomous action causes harm (wrong email, lost deal, incorrect forecast), who is responsible? Approval gates make the human the decision-maker.
- **Incremental trust**: We can progressively unlock autonomy as the system proves reliability — not the reverse.
- **Audit trail**: Every action has an attributable actor (human or approved-system), making the audit log meaningful.

## Consequences
- Every CRM write-back requires an ActionProposal → Approval → Execution → AuditEvent flow.
- Higher user friction for actions, but higher trust and lower risk.
- We must build approval UX in both the HubSpot sidebar card and the agency dashboard.
- Idempotency keys prevent duplicate executions on retries.

## Alternatives Rejected
- **Full autonomy from launch**: Commercially unacceptable risk for agency white-label deployment.
- **No write-backs at all**: Reduces product value significantly — reps want to act from the card, not just read.
