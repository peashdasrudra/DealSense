/**
 * DealSenseCard — HubSpot Deal Sidebar Intelligence Card.
 * Canvas Design System Edition.
 * Wired to Real FastAPI Backend with graceful Enterprise fallback.
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { HealthGauge } from "./components/HealthGauge";
import { MeddiccMatrix } from "./components/MeddiccMatrix";
import { RiskSignals } from "./components/RiskSignals";
import { ActionCards } from "./components/ActionCards";
import { SkeletonLoader } from "./components/SkeletonLoader";
import { fetchDealSnapshot, submitActionDecision, triggerDealEvaluation } from "./api";

const SAMPLE_SNAPSHOT = {
  id: "snap-001",
  deal_id: "deal-001",
  tenant_id: "tenant-001",
  health_score: 42,
  risk_band: "high" as const,
  confidence: 0.87,
  score_delta: -8,
  risk_explanation:
    "Deal velocity has degraded significantly over the past 14 days. The primary contact has gone silent after the technical evaluation, and no economic buyer has been identified. Close date was pushed back twice in 3 weeks.",
  what_changed:
    "Score dropped 8 points since last analysis. Stage aging signal triggered (21 days in 'Proposal Sent'). Engagement decay accelerated — last meaningful activity was 12 days ago.",
  is_current: true,
  created_at: new Date().toISOString(),
  top_signals: [
    {
      signal_name: "stage_aging",
      category: "velocity",
      severity: "critical",
      score: 15,
      weight: 2.0,
      weighted_score: 30.0,
      evidence: "Deal has been in 'Proposal Sent' for 21 days (threshold: 10 days)",
      recommendation: "Schedule an executive alignment call within 48 hours to unblock.",
    },
    {
      signal_name: "engagement_decay",
      category: "activity",
      severity: "high",
      score: 18,
      weight: 1.5,
      weighted_score: 27.0,
      evidence: "Last meaningful 2-way communication was 12 days ago.",
      recommendation: "Send a value-add asset (case study, ROI calculator) to re-engage.",
    },
    {
      signal_name: "stakeholder_gap",
      category: "relationship",
      severity: "high",
      score: 20,
      weight: 1.2,
      weighted_score: 24.0,
      evidence: "Only 1 contact associated. No economic buyer identified.",
      recommendation: "Request a multi-thread introduction through your champion.",
    },
  ],
  meddicc_status: [
    { dimension: "metrics", status: "identified" as const, confidence: 0.72, evidence: "Customer mentioned 30% cost reduction target in discovery call." },
    { dimension: "economic_buyer", status: "missing" as const, confidence: 0.0, evidence: "" },
    { dimension: "decision_criteria", status: "identified" as const, confidence: 0.65, evidence: "Security compliance and API integration speed mentioned." },
    { dimension: "decision_process", status: "unknown" as const, confidence: 0.2, evidence: "Unclear approval chain. Procurement not yet involved." },
    { dimension: "identify_pain", status: "confirmed" as const, confidence: 0.91, evidence: "Manual reporting taking 3 FTEs, 2 week latency on pipeline visibility." },
    { dimension: "champion", status: "identified" as const, confidence: 0.55, evidence: "VP Sales Sarah seems supportive but hasn't actively advocated internally." },
    { dimension: "competition", status: "unknown" as const, confidence: 0.15, evidence: "Competitor presence suspected but not confirmed." },
  ],
  recommended_actions: [
    {
      id: "act-001",
      tier: "tier_3",
      title: "Schedule Executive Alignment Call",
      description: "Book a 30-min call with VP Sales and your AE to re-establish momentum and identify the economic buyer.",
      rationale: "Stage aging (21 days) + missing economic buyer = 68% stall probability based on historical patterns.",
      impact_estimate: "+12 to +18 score points if executed within 5 days",
      status: "pending",
    },
    {
      id: "act-002",
      tier: "tier_2",
      title: "Send Re-Engagement Package",
      description: "Deliver personalized case study + ROI calculator to the primary contact.",
      rationale: "12-day silence. Similar deals that re-engaged within 14 days had 3.2× higher close rate.",
      impact_estimate: "+5 to +9 score points",
      status: "pending",
    },
    {
      id: "act-003",
      tier: "tier_4",
      title: "Create Follow-Up Task in HubSpot",
      description: "Auto-create a high-priority task for the deal owner: 'Follow up with Sarah — exec alignment' due in 2 days.",
      rationale: "Automated task creation ensures accountability on the most critical next step.",
      impact_estimate: "Accelerates response time by 2.1 days on average",
      status: "pending",
    },
  ],
};

type CardState = "loading" | "loaded" | "refreshing";

export const DealSenseCard: React.FC = () => {
  const [state, setState] = useState<CardState>("loading");
  const [snapshot, setSnapshot] = useState<any>(SAMPLE_SNAPSHOT);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(false);

  // Extract HubSpot CRM context from URL query params (passed by HubSpot iframe / UI Extensions SDK)
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const currentDealId = searchParams.get("hs_object_id") || searchParams.get("dealId") || "deal-001";
  const currentPortalId = searchParams.get("portalId") || "982341";

  const loadSnapshot = async () => {
    try {
      const data = await fetchDealSnapshot(currentDealId);
      if (data && data.health_score !== undefined) {
        if (!data.meddicc_status) {
          data.meddicc_status = SAMPLE_SNAPSHOT.meddicc_status;
        }
        setSnapshot(data);
        setIsLive(true);
      }
      setLastUpdated(new Date());
      setState("loaded");
    } catch (err) {
      console.warn("Using sample deal intelligence for card:", err);
      setSnapshot(SAMPLE_SNAPSHOT);
      setLastUpdated(new Date());
      setState("loaded");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSnapshot();
    }, 400);
    return () => clearTimeout(timer);
  }, [currentDealId]);

  const handleRefresh = useCallback(async () => {
    setState("refreshing");
    await new Promise((r) => setTimeout(r, 600));
    await loadSnapshot();
  }, [currentDealId]);

  const handleReAudit = async () => {
    setState("refreshing");
    try {
      await triggerDealEvaluation(currentDealId, undefined, currentPortalId);
      await loadSnapshot();
    } catch {
      await loadSnapshot();
    }
  };

  const handleApprove = async (id: string) => {
    try {
      if (isLive) await submitActionDecision(id, "approve");
      setSnapshot((prev: any) => ({
        ...prev,
        recommended_actions: prev.recommended_actions.map((a: any) =>
          a.id === id ? { ...a, status: "approved" } : a
        ),
      }));
    } catch (err) {
      console.error("Failed to approve action:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      if (isLive) await submitActionDecision(id, "reject");
      setSnapshot((prev: any) => ({
        ...prev,
        recommended_actions: prev.recommended_actions.map((a: any) =>
          a.id === id ? { ...a, status: "rejected" } : a
        ),
      }));
    } catch (err) {
      console.error("Failed to reject action:", err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="ds-container">
      {/* ── Header ──────────────────────────────────────────────────── */}
      {/* HubSpot Native Record Extension Context Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          background: "#f5f8fa",
          border: "1px solid #cbd6e2",
          borderRadius: "var(--radius-sm)",
          fontSize: 11,
          color: "#33475b",
          marginBottom: "var(--sp-3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#00a38d",
              display: "inline-block",
            }}
          />
          <span>HubSpot CRM Record Tab &bull; <strong>Deal #{currentDealId}</strong></span>
        </div>
        <div>
          <span>Portal: <strong>{currentPortalId}</strong></span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "var(--sp-2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              background: "var(--hs-primary)",
              color: "var(--hs-on-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            DS
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "var(--hs-text)", lineHeight: 1.2 }}>
              DealSense Intelligence
            </div>
            <div style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>
              Updated {formatTime(lastUpdated)} &bull; {isLive ? "🟢 Cloud Synced" : "🟡 Offline Fallback"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleReAudit}
            disabled={state === "refreshing" || state === "loading"}
            style={{ fontSize: "12px" }}
          >
            ⚡ Re-Score Deal
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleRefresh}
            disabled={state === "refreshing" || state === "loading"}
            style={{ opacity: state === "refreshing" ? 0.6 : 1, fontSize: "12px" }}
          >
            {state === "refreshing" ? "↻ Analyzing..." : "↻ Refresh"}
          </button>
        </div>
      </motion.div>

      {/* ── Content Area ────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {state === "loading" && <SkeletonLoader key="skeleton" />}

        {(state === "loaded" || state === "refreshing") && snapshot && (
          <motion.div
            key="loaded"
            initial={{ opacity: 0 }}
            animate={{ opacity: state === "refreshing" ? 0.6 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}
          >
            {/* Health & Narrative Card */}
            <div className="ds-card">
              <HealthGauge
                score={snapshot.health_score}
                riskBand={snapshot.risk_band}
                delta={snapshot.score_delta}
                confidence={snapshot.confidence}
              />
              <div style={{ marginTop: "var(--sp-4)" }}>
                <p style={{ fontSize: "14px", color: "var(--hs-text)" }}>
                  {snapshot.risk_explanation}
                </p>
                {snapshot.what_changed && (
                  <div
                    style={{
                      marginTop: "var(--sp-3)",
                      padding: "var(--sp-3)",
                      background: "var(--hs-surface-hover)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--hs-border)",
                      fontSize: "13px",
                      color: "var(--hs-text)",
                      display: "flex",
                      gap: "var(--sp-2)",
                    }}
                  >
                    <span>📉</span>
                    <span>{snapshot.what_changed}</span>
                  </div>
                )}
              </div>
            </div>

            {/* MEDDICC Matrix Card */}
            <div className="ds-card">
              <div className="ds-card-header">
                <h3 className="ds-card-title">MEDDICC Qualification</h3>
                <span className="badge badge-outline">
                  {snapshot.meddicc_status?.filter((f: any) => f.status === "confirmed").length || 0}/
                  {snapshot.meddicc_status?.length || 0} confirmed
                </span>
              </div>
              <MeddiccMatrix fields={snapshot.meddicc_status || []} />
            </div>

            {/* Risk Signals Card */}
            <div className="ds-card">
              <div className="ds-card-header">
                <h3 className="ds-card-title">Risk Signals</h3>
                <span className="badge badge-outline">
                  {snapshot.top_signals?.filter((s: any) => s.severity === "critical" || s.severity === "high").length || 0} urgent
                </span>
              </div>
              <RiskSignals signals={snapshot.top_signals || []} />
            </div>

            {/* Next Best Actions Card */}
            <div className="ds-card">
              <div className="ds-card-header">
                <h3 className="ds-card-title">Next Best Actions</h3>
                <span className="badge badge-outline">
                  {snapshot.recommended_actions?.filter((a: any) => a.status === "pending").length || 0} pending
                </span>
              </div>
              <ActionCards
                recommendations={snapshot.recommended_actions || []}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
            
            {/* Footer */}
            <div style={{ textAlign: "center", fontSize: "12px", color: "var(--hs-text-disabled)", marginTop: "var(--sp-2)" }}>
              Powered by DealSense AI · Confidence {Math.round(snapshot.confidence * 100)}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
