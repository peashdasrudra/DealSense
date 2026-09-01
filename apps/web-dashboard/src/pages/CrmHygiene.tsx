/**
 * DealSense Dashboard — CRM Data Hygiene & Automated Remediation Suite.
 * Automates detection and batch remediation of dirty CRM data, stale deals, and overdue close dates.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DealDrawer, DealData } from "../components/DealDrawer";

interface HygieneIssue {
  id: string;
  dealId: string;
  dealName: string;
  client: string;
  owner: string;
  value: number;
  issueType: "Stale Activity" | "Overdue Close Date" | "Missing Next Step" | "Single-Threaded";
  severity: "critical" | "high" | "moderate";
  details: string;
  recommendedAction: string;
  status: "pending" | "resolved";
}

const SAMPLE_HYGIENE_ISSUES: HygieneIssue[] = [
  {
    id: "hyg-001",
    dealId: "deal-101",
    dealName: "Orion Cloud Migration",
    client: "TechCorp Inc.",
    owner: "Sarah Miller",
    value: 150000,
    issueType: "Stale Activity",
    severity: "critical",
    details: "18 days since last logged call, meeting, or email. Stage aging limit breached.",
    recommendedAction: "Auto-create high-priority HubSpot task for Sarah Miller",
    status: "pending",
  },
  {
    id: "hyg-002",
    dealId: "deal-102",
    dealName: "Quantum Security Suite",
    client: "FinanceGo Ltd.",
    owner: "James Reynolds",
    value: 280000,
    issueType: "Overdue Close Date",
    severity: "critical",
    details: "Close date was August 15 (18 days in past) while deal remains in Negotiation stage.",
    recommendedAction: "Slip close date by +14 days and prompt rep for updated timeline",
    status: "pending",
  },
  {
    id: "hyg-003",
    dealId: "deal-103",
    dealName: "Horizon Data Platform",
    client: "RetailMax",
    owner: "Lisa Chen",
    value: 95000,
    issueType: "Single-Threaded",
    severity: "high",
    details: "Only 1 contact associated with $95K deal in Qualification stage.",
    recommendedAction: "Enrich account contacts & prompt rep to multi-thread economic buyer",
    status: "pending",
  },
  {
    id: "hyg-004",
    dealId: "deal-104",
    dealName: "Apex CRM Integration",
    client: "LogiPro Solutions",
    owner: "Mike Torres",
    value: 120000,
    issueType: "Missing Next Step",
    severity: "moderate",
    details: "Next Step field is blank; last meeting was 5 days ago.",
    recommendedAction: "Populate Next Step from meeting transcript: 'Board presentation Tuesday'",
    status: "pending",
  },
  {
    id: "hyg-005",
    dealId: "deal-106",
    dealName: "Nebula Analytics Engine",
    client: "HealthFirst Corp.",
    owner: "Sarah Miller",
    value: 210000,
    issueType: "Overdue Close Date",
    severity: "critical",
    details: "Close date passed 7 days ago with zero stage movement.",
    recommendedAction: "Slip close date by +21 days to end of month",
    status: "pending",
  },
  {
    id: "hyg-006",
    dealId: "deal-107",
    dealName: "Titan ERP Modernization",
    client: "ManufactCo",
    owner: "James Reynolds",
    value: 340000,
    issueType: "Stale Activity",
    severity: "high",
    details: "14 days without outbound communication from rep.",
    recommendedAction: "Send Slack alert to James Reynolds with suggested re-engagement draft",
    status: "pending",
  },
];

const ISSUE_BADGES: Record<string, { bg: string; color: string }> = {
  "Stale Activity": { bg: "var(--risk-critical-bg)", color: "var(--danger)" },
  "Overdue Close Date": { bg: "var(--risk-high-bg)", color: "var(--warning)" },
  "Single-Threaded": { bg: "#e7f5ff", color: "#1971c2" },
  "Missing Next Step": { bg: "var(--risk-moderate-bg)", color: "var(--risk-moderate)" },
};

export const CrmHygiene: React.FC = () => {
  const [issues, setIssues] = useState<HygieneIssue[]>(SAMPLE_HYGIENE_ISSUES);
  const [filter, setFilter] = useState("All");
  const [batchSuccess, setBatchSuccess] = useState<string | null>(null);
  const [selectedDrawerDeal, setSelectedDrawerDeal] = useState<DealData | null>(null);

  const pendingIssues = issues.filter((i) => i.status === "pending");

  const filteredIssues = issues.filter((i) => {
    if (filter === "All") return true;
    return i.issueType === filter;
  });

  const handleResolve = (id: string, actionName: string) => {
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status: "resolved" } : i)));
    setBatchSuccess(`✓ Action executed: ${actionName}`);
    setTimeout(() => setBatchSuccess(null), 3000);
  };

  const handleBatchFixAll = () => {
    setIssues((prev) => prev.map((i) => ({ ...i, status: "resolved" })));
    setBatchSuccess(`✓ Successfully remediated all ${pendingIssues.length} CRM hygiene issues in HubSpot!`);
    setTimeout(() => setBatchSuccess(null), 4000);
  };

  return (
    <div>
      {/* ── Status & Banner ───────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)" }}>
        <div style={{ fontSize: "13px", color: "var(--hs-text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--warning)", display: "inline-block" }} />
          <span>Automated Pipeline Data Quality & Hygiene Engine</span>
        </div>
        <span className="badge badge-outline">{pendingIssues.length} issues requiring cleanup</span>
      </div>

      {/* ── Batch Banner Notification ─────────────────────────────────── */}
      {batchSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "var(--risk-healthy-bg)",
            color: "var(--risk-healthy)",
            padding: "10px 20px",
            borderRadius: "var(--radius-sm)",
            marginBottom: "var(--sp-4)",
            fontSize: "13px",
            fontWeight: 600,
            border: "1px solid var(--risk-healthy-border)",
          }}
        >
          {batchSuccess}
        </motion.div>
      )}

      {/* ── Hygiene Score & KPI Bar ───────────────────────────────────── */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderTopColor: "var(--warning)" }}>
          <div className="kpi-label">Pipeline Hygiene Score</div>
          <div className="kpi-value" style={{ color: "var(--warning)" }}>68/100</div>
          <div style={{ fontSize: "11px", color: "var(--danger)", fontWeight: 600, marginTop: 4 }}>
            ▼ 4pts from last week
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--danger)" }}>
          <div className="kpi-label">Stale / Ghost Pipeline</div>
          <div className="kpi-value">$490K</div>
          <div style={{ fontSize: "11px", color: "var(--danger)", fontWeight: 600, marginTop: 4 }}>
            2 deals with 14d+ silence
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--warning)" }}>
          <div className="kpi-label">Past Due Close Dates</div>
          <div className="kpi-value">$490K</div>
          <div style={{ fontSize: "11px", color: "var(--warning)", fontWeight: 600, marginTop: 4 }}>
            2 deals in past calendar month
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#1971c2" }}>
          <div className="kpi-label">Single-Threaded Value</div>
          <div className="kpi-value">$95K</div>
          <div style={{ fontSize: "11px", color: "#1971c2", fontWeight: 600, marginTop: 4 }}>
            Only 1 contact associated
          </div>
        </div>
      </div>

      {/* ── 1-Click Automated Remediation Bar ─────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "var(--sp-6)" }}
      >
        <div className="card-header">
          <div>
            <div className="card-title">Automated 1-Click RevOps Remediation Hub</div>
            <div className="card-subtitle">Execute batch corrections across all connected HubSpot deal records</div>
          </div>
          <button className="btn btn-primary" onClick={handleBatchFixAll} disabled={pendingIssues.length === 0}>
            ⚡ Auto-Remediate All ({pendingIssues.length})
          </button>
        </div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            <div
              style={{
                padding: "14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--hs-border-dark)",
                background: "var(--hs-surface)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--hs-primary)" }}>
                📅 Batch Slip Past-Due Dates
              </div>
              <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", margin: "4px 0 10px" }}>
                Automatically advance all past-due close dates to end of current month.
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleBatchFixAll()}
              >
                Execute Date Push
              </button>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--hs-border-dark)",
                background: "var(--hs-surface)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--hs-primary)" }}>
                🔔 Slack Digest to Reps
              </div>
              <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", margin: "4px 0 10px" }}>
                Notify Sarah Miller & James Reynolds of their stalled deal actions.
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setBatchSuccess("✓ Slack alert sent to sales team channel with action items!");
                  setTimeout(() => setBatchSuccess(null), 3000);
                }}
              >
                Send Slack Digest
              </button>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--hs-border-dark)",
                background: "var(--hs-surface)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--hs-primary)" }}>
                📝 Auto-Populate Next Steps
              </div>
              <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", margin: "4px 0 10px" }}>
                Extract and write back next steps from recent call transcripts.
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleBatchFixAll()}
              >
                Write-Back Next Steps
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Hygiene Issues Table ──────────────────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="card-header">
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            {["All", "Stale Activity", "Overdue Close Date", "Single-Threaded", "Missing Next Step"].map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${filter === cat ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="badge badge-outline">{filteredIssues.length} issues listed</span>
        </div>

        {/* Desktop & Tablet Table */}
        <div className="desktop-hygiene-table table-responsive">
          <table>
            <thead>
              <tr>
                <th style={{ minWidth: 160 }}>Deal Name</th>
                <th style={{ minWidth: 140 }}>Account</th>
                <th style={{ minWidth: 110 }}>Owner</th>
                <th style={{ minWidth: 90 }}>Value</th>
                <th style={{ minWidth: 140 }}>Hygiene Issue</th>
                <th style={{ minWidth: 240, maxWidth: 360 }}>Detected Discrepancy</th>
                <th style={{ textAlign: "right", paddingRight: 16, minWidth: 160 }}>Remediation Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredIssues.map((issue) => {
                  const badge = ISSUE_BADGES[issue.issueType] || { bg: "var(--hs-surface)", color: "var(--hs-text)" };
                  const isResolved = issue.status === "resolved";

                  return (
                    <motion.tr
                      key={issue.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isResolved ? 0.4 : 1 }}
                      exit={{ opacity: 0 }}
                      style={{ cursor: "pointer" }}
                    >
                      <td
                        onClick={() =>
                          setSelectedDrawerDeal({
                            id: issue.dealId,
                            name: issue.dealName,
                            client: issue.client,
                            score: 38,
                            band: "Critical",
                            value: issue.value,
                            stage: "In Review",
                            owner: issue.owner,
                          })
                        }
                        style={{ fontWeight: 600, color: "var(--hs-primary)", fontSize: "13px", minWidth: 160, whiteSpace: "nowrap" }}
                      >
                        {issue.dealName}
                      </td>
                      <td style={{ color: "var(--hs-text-muted)", minWidth: 140, whiteSpace: "nowrap" }}>{issue.client}</td>
                      <td style={{ minWidth: 110, whiteSpace: "nowrap" }}>{issue.owner}</td>
                      <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600, minWidth: 90, whiteSpace: "nowrap" }}>
                        ${(issue.value / 1000).toFixed(0)}K
                      </td>
                      <td style={{ minWidth: 140, whiteSpace: "nowrap" }}>
                        <span
                          className="badge"
                          style={{ background: badge.bg, color: badge.color, fontWeight: 700 }}
                        >
                          {issue.issueType}
                        </span>
                      </td>
                      <td style={{ fontSize: "12.5px", color: "var(--hs-text)", minWidth: 240, maxWidth: 360, whiteSpace: "normal", lineHeight: 1.5 }}>
                        {issue.details}
                      </td>
                      <td style={{ textAlign: "right", paddingRight: 16 }}>
                        {!isResolved ? (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolve(issue.id, issue.recommendedAction);
                            }}
                          >
                            ⚡ Auto-Fix in HubSpot
                          </button>
                        ) : (
                          <span className="badge" style={{ background: "var(--risk-healthy-bg)", color: "var(--risk-healthy)" }}>
                            ✓ Remediated
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

        {/* Mobile Hygiene Cards (<640px) */}
        <div className="mobile-hygiene-cards">
          {filteredIssues.map((issue) => {
            const badge = ISSUE_BADGES[issue.issueType] || { bg: "var(--hs-surface)", color: "var(--hs-text)" };
            const isResolved = issue.status === "resolved";

            return (
              <div key={issue.id} className="mobile-hygiene-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--hs-primary)" }}>
                    {issue.dealName}
                  </div>
                  <span className="badge" style={{ background: badge.bg, color: badge.color, fontWeight: 700, fontSize: "10px" }}>
                    {issue.issueType}
                  </span>
                </div>

                <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginBottom: 4 }}>
                  Account: <strong>{issue.client}</strong> · ${(issue.value / 1000).toFixed(0)}K · {issue.owner}
                </div>

                <div style={{ fontSize: "12px", color: "var(--hs-text)", lineHeight: 1.4, marginBottom: 10 }}>
                  {issue.details}
                </div>

                {!isResolved ? (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => handleResolve(issue.id, issue.recommendedAction)}
                  >
                    ⚡ Auto-Fix in HubSpot
                  </button>
                ) : (
                  <div style={{ textAlign: "center", padding: "6px", background: "var(--risk-healthy-bg)", color: "var(--risk-healthy)", borderRadius: "var(--radius-sm)", fontSize: "11.5px", fontWeight: 700 }}>
                    ✓ Remediated in HubSpot
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Drawer */}
      <DealDrawer
        deal={selectedDrawerDeal}
        isOpen={!!selectedDrawerDeal}
        onClose={() => setSelectedDrawerDeal(null)}
      />
    </div>
  );
};
