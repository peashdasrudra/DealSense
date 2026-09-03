# HubSpot Workflow Custom Code Action (Node.js)

Production-grade Node.js Custom Code Action designed for HubSpot Sales Hub Workflows.

---

## 1. Architectural Overview & Agency Benchmark

HubSpot agencies implement automation via **Workflows with Custom Code Actions**. Unlike generic webhooks that introduce latency and external points of failure, custom code actions run serverlessly directly within HubSpot's cloud infrastructure.

```
HubSpot Workflow Trigger (Deal Stage Changed / Activity Logged)
              │
              ▼
[Node.js Custom Code Action] (128 MB RAM | 20s Max Timeout)
       │                    │
       ▼ (HTTPS / HMAC)     ▼ (@hubspot/api-client)
DealSense Scoring API   HubSpot CRM Deal Properties Update
(7-Vector Deterministic)  - dealsense_health_score
                          - dealsense_risk_band
                          - dealsense_recommended_action
              │
              ▼
HubSpot Workflow Outputs (Downstream Branching & Task Automation)
```

### Serverless Constraints Enforced

| Parameter | HubSpot Limit | DealSense Implementation | Margin of Safety |
| :--- | :--- | :--- | :--- |
| **Execution Timeout** | `20,000 ms` | Hard-aborted at `14,000 ms` via `AbortController` | **6,000 ms buffer** |
| **Memory Limit** | `128 MB` | Lean Node.js runtime, zero heavy memory buffers (~32 MB peak) | **75% memory headroom** |
| **Fault Tolerance** | Unhandled crashes halt workflow | Fallback to deterministic heuristic engine | **100% execution continuity** |

---

## 2. Input & Output Mappings in HubSpot Workflow

### Expected Action Input Fields
Map these in the HubSpot Workflow Action configuration:
* `dealname`: Deal Name
* `dealstage`: Deal Stage internal name (e.g. `qualifiedtobuy`)
* `amount`: Deal Amount
* `pipeline`: Pipeline ID
* `closedate`: Close Date timestamp

### Output Fields Registered
* `dealsense_health_score` (Number: 0 – 100)
* `dealsense_risk_band` (Enumeration: `LOW`, `MODERATE`, `HIGH`, `CRITICAL`)
* `dealsense_recommended_action` (String: Top prioritized MEDDICC action)
* `dealsense_execution_source` (`DEALSENSE_CLOUD_API` or `DETERMINISTIC_FALLBACK`)
* `dealsense_execution_status` (`SUCCESS` or `FAILED`)

---

## 3. Local Development & Testing

```bash
# Install dependencies
npm install

# Run Jest unit test suite
npm test

# Run test coverage
npm run test:coverage
```
