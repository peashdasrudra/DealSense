/**
 * DealSense — Shared TypeScript Contracts
 *
 * Canonical type definitions shared between HubSpot UI Extension,
 * Agency Command Center dashboard, and the DealSense API.
 */

// ─── Risk Bands ──────────────────────────────────────────────────────────────

export type RiskBand = "critical" | "high" | "moderate" | "low" | "healthy";

export const RISK_BAND_ORDER: Record<RiskBand, number> = {
  critical: 0,
  high: 1,
  moderate: 2,
  low: 3,
  healthy: 4,
};

export const RISK_BAND_LABELS: Record<RiskBand, string> = {
  critical: "Critical Risk",
  high: "High Risk",
  moderate: "Moderate Risk",
  low: "Low Risk",
  healthy: "Healthy",
};

export const RISK_BAND_COLORS: Record<RiskBand, { primary: string; bg: string; glow: string }> = {
  critical: { primary: "#FF3B5C", bg: "rgba(255, 59, 92, 0.12)", glow: "0 0 20px rgba(255, 59, 92, 0.4)" },
  high: { primary: "#FF6B2C", bg: "rgba(255, 107, 44, 0.12)", glow: "0 0 20px rgba(255, 107, 44, 0.4)" },
  moderate: { primary: "#FFB547", bg: "rgba(255, 181, 71, 0.12)", glow: "0 0 20px rgba(255, 181, 71, 0.4)" },
  low: { primary: "#4ECDC4", bg: "rgba(78, 205, 196, 0.12)", glow: "0 0 20px rgba(78, 205, 196, 0.4)" },
  healthy: { primary: "#00D68F", bg: "rgba(0, 214, 143, 0.12)", glow: "0 0 20px rgba(0, 214, 143, 0.4)" },
};

// ─── Action Tiers ────────────────────────────────────────────────────────────

export type ActionTier = "tier_1" | "tier_2" | "tier_3" | "tier_4";

export const ACTION_TIER_LABELS: Record<ActionTier, string> = {
  tier_1: "Observe",
  tier_2: "Notify",
  tier_3: "Assist",
  tier_4: "Act",
};

export const ACTION_TIER_DESCRIPTIONS: Record<ActionTier, string> = {
  tier_1: "Insight surfaced — no action required",
  tier_2: "Alert sent to deal owner",
  tier_3: "Suggested action awaiting approval",
  tier_4: "Auto-executed CRM write-back",
};

export const ACTION_TIER_COLORS: Record<ActionTier, { primary: string; bg: string }> = {
  tier_1: { primary: "#8B9DC3", bg: "rgba(139, 157, 195, 0.12)" },
  tier_2: { primary: "#6C5CE7", bg: "rgba(108, 92, 231, 0.12)" },
  tier_3: { primary: "#0984E3", bg: "rgba(9, 132, 227, 0.12)" },
  tier_4: { primary: "#00B894", bg: "rgba(0, 184, 148, 0.12)" },
};

// ─── MEDDICC Framework ───────────────────────────────────────────────────────

export type MeddiccDimension =
  | "metrics"
  | "economic_buyer"
  | "decision_criteria"
  | "decision_process"
  | "identify_pain"
  | "champion"
  | "competition";

export const MEDDICC_LABELS: Record<MeddiccDimension, string> = {
  metrics: "Metrics",
  economic_buyer: "Economic Buyer",
  decision_criteria: "Decision Criteria",
  decision_process: "Decision Process",
  identify_pain: "Identify Pain",
  champion: "Champion",
  competition: "Competition",
};

export const MEDDICC_SHORT: Record<MeddiccDimension, string> = {
  metrics: "M",
  economic_buyer: "E",
  decision_criteria: "D",
  decision_process: "D",
  identify_pain: "I",
  champion: "C",
  competition: "C",
};

export type MeddiccStatus = "confirmed" | "identified" | "unknown" | "missing";

export const MEDDICC_STATUS_COLORS: Record<MeddiccStatus, string> = {
  confirmed: "#00D68F",
  identified: "#FFB547",
  unknown: "#8B9DC3",
  missing: "#FF3B5C",
};

// ─── API Response DTOs ───────────────────────────────────────────────────────

export interface RiskSignalDTO {
  signal_name: string;
  category: string;
  severity: RiskBand;
  score: number;
  weight: number;
  weighted_score: number;
  evidence: string;
  recommendation: string;
}

export interface MeddiccFieldDTO {
  dimension: MeddiccDimension;
  status: MeddiccStatus;
  confidence: number;
  evidence: string;
  last_updated: string;
}

export interface RecommendationDTO {
  id: string;
  tier: ActionTier;
  title: string;
  description: string;
  rationale: string;
  impact_estimate: string;
  status: "pending" | "approved" | "executed" | "rejected" | "expired";
  created_at: string;
}

export interface DealSnapshotDTO {
  id: string;
  deal_id: string;
  tenant_id: string;
  health_score: number;
  risk_band: RiskBand;
  confidence: number;
  top_signals: RiskSignalDTO[];
  meddicc_status?: MeddiccFieldDTO[];
  risk_explanation: string;
  what_changed: string;
  recommended_actions: RecommendationDTO[];
  is_current: boolean;
  created_at: string;
  score_delta?: number;
}

export interface DealDetailDTO {
  id: string;
  tenant_id: string;
  hubspot_deal_id: string;
  name: string;
  stage: string;
  pipeline: string;
  amount: number | null;
  owner_id: string | null;
  owner_name: string | null;
  close_date: string | null;
  created_at: string;
  properties: Record<string, unknown>;
}

// ─── Portfolio / Dashboard DTOs ──────────────────────────────────────────────

export interface PortfolioSummaryDTO {
  total_deals: number;
  total_pipeline_value: number;
  avg_health_score: number;
  risk_distribution: Record<RiskBand, number>;
  score_trend: { date: string; avg_score: number }[];
  at_risk_value: number;
  healthy_value: number;
}

export interface ClientHealthDTO {
  tenant_id: string;
  tenant_name: string;
  deal_count: number;
  total_value: number;
  avg_health_score: number;
  risk_distribution: Record<RiskBand, number>;
  worst_deal: {
    id: string;
    name: string;
    health_score: number;
    risk_band: RiskBand;
  } | null;
}

export interface ActionQueueItemDTO {
  id: string;
  deal_id: string;
  deal_name: string;
  tenant_id: string;
  tenant_name: string;
  tier: ActionTier;
  title: string;
  description: string;
  rationale: string;
  impact_estimate: string;
  status: "pending" | "approved" | "executed" | "rejected" | "expired";
  created_at: string;
  expires_at?: string;
}

export interface AuditEventDTO {
  id: string;
  tenant_id: string;
  actor_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, unknown>;
  created_at: string;
}

// ─── Write-Back Action Types ─────────────────────────────────────────────────

export type WriteBackActionType =
  | "create_task"
  | "create_note"
  | "update_property"
  | "update_deal_stage"
  | "create_engagement"
  | "send_notification";

export interface WriteBackPayloadDTO {
  action_type: WriteBackActionType;
  deal_id: string;
  parameters: Record<string, unknown>;
}

export interface WriteBackResultDTO {
  success: boolean;
  action_type: WriteBackActionType;
  hubspot_object_id?: string;
  error_message?: string;
  rollback_available: boolean;
  executed_at: string;
}

// ─── Utility Types ───────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export interface ApiErrorResponse {
  detail: string;
  error_code?: string;
  metadata?: Record<string, unknown>;
}
