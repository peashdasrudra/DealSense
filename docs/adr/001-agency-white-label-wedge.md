# ADR-001: Agency White-Label as Market Wedge

## Status
Accepted

## Context
We need to choose an initial go-to-market strategy for DealSense. Options include:
1. Direct-to-customer B2B SaaS
2. HubSpot App Marketplace listing
3. Agency white-label enablement
4. Enterprise direct sales

## Decision
We will launch as a **white-label platform for HubSpot agencies** rather than a direct-to-customer product.

## Rationale
- **Distribution leverage**: There are hundreds of HubSpot Solutions Partners. Selling to 30 agencies who each serve 10+ clients is more capital-efficient than acquiring 300 individual customers.
- **Recurring revenue alignment**: Agencies already sell recurring implementation/optimization retainers. DealSense adds a new retainable service line (AI deal intelligence) without requiring us to build customer acquisition infrastructure.
- **Reduced support burden**: Agencies handle client-facing training, customization, and first-line support.
- **Faster iteration**: Working closely with 3–5 agency design partners provides concentrated, high-quality feedback.
- **White-label premium**: Agencies pay more for tools they can brand and resell than for commodity SaaS.

## Consequences
- We must build multi-tenancy with white-label configuration from day one.
- We need agency-facing analytics (portfolio view, client risk, adoption metrics) in addition to end-user features.
- Our sales process targets agency owners and RevOps leads, not individual sales managers.
- We defer HubSpot Marketplace listing until post-validation.

## Alternatives Rejected
- **Direct B2B SaaS**: Higher CAC, longer sales cycles, requires marketing/sales infrastructure we don't have yet.
- **Marketplace-first**: Good for distribution but low average contract value and difficult to differentiate.
