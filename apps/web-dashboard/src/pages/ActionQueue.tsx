/**
 * DealSense Dashboard — Action Approval Queue Page.
 * Canvas Design System Edition.
 * Wired to Real FastAPI Backend with graceful Enterprise fallback.
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchActions, submitActionDecision } from "../api";

interface ActionItem {
  id: string;
  dealName?: string;
  clientName?: string;
  tier: string;
  title: string;
  description: string;
  rationale: string;
  impact: string;
  status: "pending" | "approved" | "executed" | "rejected";
  createdAt: string;
  urgency: "critical" | "high" | "normal";
}

const SAMPLE_ACTIONS: ActionItem[] = [
  {
    id: "act-001",
    dealName: "Orion Cloud Migration",
    clientName: "TechCorp Inc.",
    tier: "tier_4",
    title: "Create Follow-Up Task in HubSpot",
    description: "Auto-create a high-priority HubSpot task for deal owner: 'Schedule exec alignment call with VP Engineering'",
    rationale: "21 days in Proposal Sent stage + missing economic buyer = 68% stall probability based on historical patterns",
    impact: "Accelerates response by 2.1 days avg",
    status: "pending",
    createdAt: "2 min ago",
    urgency: "critical",
  },
  {
    id: "act-002",
    dealName: "Quantum Security Suite",
    clientName: "FinanceGo Ltd.",
    tier: "tier_3",
    title: "Deliver Value & ROI Assessment",
    description: "Deliver personalized security ROI calculator with compliance cost savings analysis directly to CFO",
    rationale: "Metrics dimension unconfirmed. Deals with quantified ROI documentation close 2.8× faster",
    impact: "+8 to +12 score points",
    status: "pending",
    createdAt: "15 min ago",
    urgency: "high",
  },
  {
    id: "act-003",
    dealName: "Horizon Data Platform",
    clientName: "RetailMax",
    tier: "tier_4",
    title: "Advance CRM Deal Stage to Negotiation",
    description: "Move deal from 'Proposal Sent' to 'Negotiation' — mutual action plan signed yesterday by procurement",
    rationale: "Stage history shows buyer commitment signals. CRM stage not yet updated by rep",
    impact: "Improves pipeline forecast accuracy",
    status: "pending",
    createdAt: "28 min ago",
    urgency: "high",
  },
  {
    id: "act-004",
    dealName: "Nebula Analytics Engine",
    clientName: "HealthFirst Corp.",
    tier: "tier_2",
    title: "Notify Sales Director of Engagement Decay",
    description: "Trigger internal Slack alert about silence — no 2-way client communication for 14 consecutive days",
    rationale: "Deal value $210K is above intervention threshold. Early manager intervention recovers 34% of stalled deals",
    impact: "Immediate risk mitigation",
    status: "pending",
    createdAt: "1 hr ago",
    urgency: "normal",
  },
  {
    id: "act-005",
    dealName: "Titan ERP Modernization",
    clientName: "ManufactCo",
    tier: "tier_3",
    title: "Multi-Thread Stakeholder Introduction",
    description: "Draft warm intro email to VP Operations through existing champion contact to establish technical buy-in",
    rationale: "Only 1 stakeholder associated. Historical win rate doubles with 3+ decision makers",
    impact: "+5 to +10 score points",
    status: "pending",
    createdAt: "2 hrs ago",
    urgency: "normal",
  },
];

const TIER_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  tier_1: { label: "Observe", color: "var(--hs-text-muted)", bg: "var(--hs-border)", icon: "👁" },
  tier_2: { label: "Notify", color: "var(--tier-2)", bg: "var(--hs-surface-hover)", icon: "🔔" },
  tier_3: { label: "Assist", color: "var(--tier-3)", bg: "var(--hs-surface-hover)", icon: "🤝" },
  tier_4: { label: "Act", color: "var(--tier-4)", bg: "var(--hs-surface-hover)", icon: "⚡" },
};

const URGENCY_STYLES: Record<string, { color: string; dot: string }> = {
  critical: { color: "var(--danger)", dot: "var(--danger)" },
  high: { color: "var(--warning)", dot: "var(--warning)" },
  normal: { color: "var(--hs-text-disabled)", dot: "var(--hs-text-disabled)" },
};

export const ActionQueue: React.FC = () => {
  const [actions, setActions] = useState<ActionItem[]>(SAMPLE_ACTIONS);
  const [filter, setFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchActions()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            dealName: d.deal_name || `Deal #${d.deal_id?.substring(0, 8)}`,
            clientName: d.client_name || "CRM Account",
            tier: d.tier || "tier_3",
            title: d.title,
            description: d.description,
            rationale: d.rationale,
            impact: d.impact_estimate || "+5-10 score points",
            status: d.status || "pending",
            createdAt: new Date(d.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            urgency: (d.tier === "tier_4" ? "critical" : d.tier === "tier_3" ? "high" : "normal") as any,
          }));
          setActions(mapped);
          setIsLive(true);
        }
      })
      .catch((err) => {
        console.warn("Using sample actions queue intelligence:", err);
      });
  }, []);

  const filtered = filter === "all"
    ? actions
    : actions.filter((a) => a.tier === filter);

  const pendingCount = actions.filter((a) => a.status === "pending").length;

  const handleApprove = async (id: string) => {
    try {
      if (isLive) await submitActionDecision(id, "approve");
      setActions((prev) => prev.map((a) => a.id === id ? { ...a, status: "approved" as const } : a));
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      if (isLive) await submitActionDecision(id, "reject");
      setActions((prev) => prev.map((a) => a.id === id ? { ...a, status: "rejected" as const } : a));
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  const handleBulkApprove = async () => {
    for (const id of Array.from(selectedIds)) {
      await handleApprove(id);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)" }}>
        <div style={{ fontSize: "13px", color: "var(--hs-text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: isLive ? "var(--success)" : "var(--hs-primary)", display: "inline-block" }} />
          <span>{isLive ? "Live CRM Action Proposals" : "Autonomous Next Best Actions (Demo Active)"}</span>
        </div>
        <span className="badge badge-outline">{pendingCount} awaiting review</span>
      </div>

      {/* ── Header Controls ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--sp-6)",
        }}
      >
        {/* Tier filter tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "tier_4", "tier_3", "tier_2", "tier_1"].map((t) => {
            const isAll = t === "all";
            const meta = isAll ? null : TIER_META[t];
            const count = isAll ? actions.length : actions.filter((a) => a.tier === t).length;
            const isActive = filter === t;

            return (
              <button
                key={t}
                className={`btn ${isActive ? "btn-primary" : "btn-secondary"} btn-sm`}
                onClick={() => setFilter(t)}
                style={
                  isActive && meta
                    ? { background: meta.bg, color: meta.color, border: "none" }
                    : {}
                }
              >
                {isAll ? "All" : `${meta?.icon} ${meta?.label}`} ({count})
              </button>
            );
          })}
        </div>

        {/* Bulk actions */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>
                {selectedIds.size} selected
              </span>
              <button className="btn btn-primary btn-sm" onClick={handleBulkApprove}>
                ✓ Approve Selected
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedIds(new Set())}
              >
                Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Summary Pills ────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, marginBottom: "var(--sp-6)" }}>
        <div style={{ padding: "6px 12px", background: "var(--warning-bg)", borderRadius: "var(--radius-pill)", fontSize: "12px", fontWeight: 600, color: "var(--warning)" }}>
          {pendingCount} pending approval
        </div>
        <div style={{ padding: "6px 12px", background: "var(--success-bg)", borderRadius: "var(--radius-pill)", fontSize: "12px", fontWeight: 600, color: "var(--success)" }}>
          {actions.filter((a) => a.status === "approved").length} approved today
        </div>
      </div>

      {/* ── Action List Section (Desktop Table + Mobile Cards) ─────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Desktop & Tablet Responsive Table */}
        <div className="desktop-action-table table-responsive">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40, paddingLeft: 16 }}></th>
                <th style={{ minWidth: 280, maxWidth: 380 }}>Action Recommendation</th>
                <th style={{ minWidth: 160 }}>Deal / Account</th>
                <th style={{ minWidth: 110 }}>Autonomous Tier</th>
                <th style={{ minWidth: 140 }}>Expected Impact</th>
                <th style={{ minWidth: 90 }}>Created</th>
                <th style={{ textAlign: "right", paddingRight: 16, minWidth: 170 }}>Approval Decision</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((action, idx) => {
                  const tier = TIER_META[action.tier] || TIER_META["tier_3"];
                  const urgency = URGENCY_STYLES[action.urgency] || URGENCY_STYLES["normal"];
                  const isSelected = selectedIds.has(action.id);

                  return (
                    <motion.tr
                      key={action.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10, height: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.2 }}
                      style={{
                        background: isSelected ? "var(--hs-surface-hover)" : undefined,
                        opacity: action.status !== "pending" ? 0.6 : 1,
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ paddingLeft: 16, width: 40 }}>
                        {action.status === "pending" && (
                          <div
                            onClick={() => toggleSelect(action.id)}
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: 4,
                              border: `1px solid ${isSelected ? "var(--hs-primary)" : "var(--hs-border-dark)"}`,
                              background: isSelected ? "var(--hs-primary)" : "transparent",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {isSelected && (
                              <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>✓</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Action Info */}
                      <td style={{ minWidth: 280, maxWidth: 380, whiteSpace: "normal" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          {action.urgency !== "normal" && (
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: urgency.dot,
                                marginTop: 6,
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, color: "var(--hs-text)", fontSize: "13px" }}>
                              {action.title}
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 3, lineHeight: 1.5 }}>
                              {action.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Deal/Client */}
                      <td style={{ minWidth: 160, whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 600, color: "var(--hs-primary)", fontSize: "13px" }}>
                          {action.dealName}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                          {action.clientName}
                        </div>
                      </td>

                      {/* Tier */}
                      <td style={{ minWidth: 110, whiteSpace: "nowrap" }}>
                        <span className="tier-badge" style={{ background: tier.bg, color: tier.color, border: "none" }}>
                          {tier.icon} {tier.label}
                        </span>
                      </td>

                      {/* Impact */}
                      <td style={{ minWidth: 140, fontSize: "12.5px", color: "var(--hs-text-muted)" }}>
                        {action.impact}
                      </td>

                      {/* Age */}
                      <td style={{ minWidth: 90, fontSize: "12px", color: "var(--hs-text-muted)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                        {action.createdAt}
                      </td>

                      {/* Action Buttons */}
                      <td style={{ textAlign: "right", paddingRight: 16 }}>
                        {action.status === "pending" ? (
                          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleApprove(action.id)}
                            >
                              ✓ Approve
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleReject(action.id)}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className="tier-badge"
                            style={{
                              background: action.status === "approved" ? "var(--success-bg)" : "var(--danger-bg)",
                              color: action.status === "approved" ? "var(--success)" : "var(--danger)",
                              border: "none",
                            }}
                          >
                            {action.status === "approved" ? "✓ Approved" : "✕ Rejected"}
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Action Cards (<640px) */}
        <div className="mobile-action-cards">
          {filtered.map((action) => {
            const tier = TIER_META[action.tier] || TIER_META["tier_3"];
            const isPending = action.status === "pending";

            return (
              <div key={action.id} className="mobile-action-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--hs-primary)" }}>
                    {action.title}
                  </div>
                  <span className="tier-badge" style={{ background: tier.bg, color: tier.color, border: "none", fontSize: "10px" }}>
                    {tier.icon} {tier.label}
                  </span>
                </div>

                <div style={{ fontSize: "12px", color: "var(--hs-text)", marginBottom: 6 }}>
                  Deal: <strong>{action.dealName}</strong> · {action.clientName}
                </div>

                <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", lineHeight: 1.4, marginBottom: 10 }}>
                  {action.description}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--hs-border-dark)" }}>
                  <span style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>Impact: {action.impact}</span>
                  {isPending ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleApprove(action.id)}>
                        ✓ Approve
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleReject(action.id)}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span className="badge" style={{ background: action.status === "approved" ? "var(--risk-healthy-bg)" : "var(--risk-critical-bg)", color: action.status === "approved" ? "var(--risk-healthy)" : "var(--danger)" }}>
                      {action.status === "approved" ? "✓ Approved" : "✕ Rejected"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
