/**
 * DealSense — Deal War Room & Executive QBR Decision Engine.
 * Built for VP Sales, CROs, and RevOps leaders for high-stakes Friday pipeline reviews and board meetings.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WarRoomDeal {
  id: string;
  name: string;
  client: string;
  value: number;
  stage: string;
  riskScore: number;
  band: "Critical" | "High" | "Moderate" | "Healthy";
  closeDate: string;
  daysStalled: number;
  economicBuyer: { name: string; title: string; engagement: "Silent 18d" | "Engaged" | "Unknown" | "Hostile" };
  champion: { name: string; title: string; sentiment: "Strong" | "Hesitant" | "Disengaged" };
  competitor?: string;
  keyBlocker: string;
  goNoGoStatus: "High Risk" | "Conditional" | "Commit";
  nextExecAction: string;
}

const INITIAL_WAR_ROOM_DEALS: WarRoomDeal[] = [
  {
    id: "deal-101",
    name: "Orion Cloud Migration",
    client: "TechCorp Inc.",
    value: 150000,
    stage: "Proposal Sent",
    riskScore: 23,
    band: "Critical",
    closeDate: "Nov 30, 2026 (Past Due 2d)",
    daysStalled: 18,
    economicBuyer: { name: "David Chen", title: "Chief Financial Officer", engagement: "Silent 18d" },
    champion: { name: "Marcus Vance", title: "VP Infrastructure", sentiment: "Hesitant" },
    competitor: "Clari / Internal Build",
    keyBlocker: "CFO has not approved ROI justification; single-threaded through VP Eng.",
    goNoGoStatus: "High Risk",
    nextExecAction: "VP Sales to initiate peer-to-peer CFO outreach with Forrester ROI model.",
  },
  {
    id: "deal-102",
    name: "Quantum Security Suite",
    client: "FinanceGo Ltd.",
    value: 280000,
    stage: "Negotiation",
    riskScore: 31,
    band: "Critical",
    closeDate: "Dec 15, 2026",
    daysStalled: 22,
    economicBuyer: { name: "Sarah Jenkins", title: "Chief Information Security Officer", engagement: "Silent 18d" },
    champion: { name: "Arthur Dent", title: "Director of SecOps", sentiment: "Strong" },
    competitor: "Gong Reality",
    keyBlocker: "Legal redlines pending on SOC2 indemnification clause for 14 days.",
    goNoGoStatus: "High Risk",
    nextExecAction: "Offer standard cyber insurance addendum to unblock General Counsel.",
  },
  {
    id: "deal-106",
    name: "Nebula Analytics Engine",
    client: "HealthFirst Corp.",
    value: 210000,
    stage: "Discovery",
    riskScore: 44,
    band: "High",
    closeDate: "Dec 20, 2026",
    daysStalled: 14,
    economicBuyer: { name: "Dr. Elena Rostova", title: "Chief Medical Officer", engagement: "Unknown" },
    champion: { name: "Kevin Patel", title: "Head of Data Ops", sentiment: "Hesitant" },
    keyBlocker: "HIPAA BAA agreement requirement unconfirmed by procurement team.",
    goNoGoStatus: "Conditional",
    nextExecAction: "Send pre-signed HIPAA BAA package directly to Head of Compliance.",
  },
  {
    id: "deal-104",
    name: "Apex CRM Integration",
    client: "LogiPro Solutions",
    value: 120000,
    stage: "Proposal Sent",
    riskScore: 62,
    band: "Moderate",
    closeDate: "Dec 28, 2026",
    daysStalled: 6,
    economicBuyer: { name: "Rachel Adams", title: "VP Sales Operations", engagement: "Engaged" },
    champion: { name: "Tom Holland", title: "Sales Systems Lead", sentiment: "Strong" },
    keyBlocker: "Awaiting final commercial sign-off on 2-year payment terms.",
    goNoGoStatus: "Conditional",
    nextExecAction: "Grant 8% multi-year discount incentive if signed by Dec 24.",
  },
  {
    id: "deal-105",
    name: "Crown Global Enterprise",
    client: "LogiPro Solutions",
    value: 400000,
    stage: "Contract",
    riskScore: 92,
    band: "Healthy",
    closeDate: "Dec 31, 2026",
    daysStalled: 2,
    economicBuyer: { name: "Robert Sterling", title: "Chief Executive Officer", engagement: "Engaged" },
    champion: { name: "Victoria Stone", title: "VP Revenue Operations", sentiment: "Strong" },
    keyBlocker: "None. Ready for DocuSign final execution.",
    goNoGoStatus: "Commit",
    nextExecAction: "Send DocuSign envelope with CEO sign-off notification.",
  },
];

export const DealWarRoom: React.FC = () => {
  const [deals, setDeals] = useState<WarRoomDeal[]>(INITIAL_WAR_ROOM_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<WarRoomDeal>(INITIAL_WAR_ROOM_DEALS[0]);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [qbrModalOpen, setQbrModalOpen] = useState(false);
  const [copiedQbr, setCopiedQbr] = useState(false);

  const totalAtStake = deals.reduce((sum, d) => sum + d.value, 0);
  const criticalAtRisk = deals.filter((d) => d.band === "Critical").reduce((sum, d) => sum + d.value, 0);
  const commitRevenue = deals.filter((d) => d.goNoGoStatus === "Commit").reduce((sum, d) => sum + d.value, 0);

  const handleExecuteIntervention = (dealId: string, actionName: string) => {
    setActionSuccessMsg(`✓ Triggered: "${actionName}" for ${selectedDeal.name} (HubSpot Task Created)`);
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, goNoGoStatus: "Conditional", riskScore: Math.min(85, d.riskScore + 18) } : d))
    );
    setTimeout(() => setActionSuccessMsg(null), 3800);
  };

  const qbrBriefText = `### DEAL SENSE — EXECUTIVE REVENUE BRIEFING (QBR)
**Total Pipeline Under Review:** $${(totalAtStake / 1000).toFixed(0)}K
**Critical Slippage Risk:** $${(criticalAtRisk / 1000).toFixed(0)}K (${deals.filter((d) => d.band === "Critical").length} Deals)
**Forecast Commit Realization:** $${(commitRevenue / 1000).toFixed(0)}K

#### Top Action Items:
1. **${deals[0].name} ($${(deals[0].value / 1000).toFixed(0)}K)**: ${deals[0].nextExecAction}
2. **${deals[1].name} ($${(deals[1].value / 1000).toFixed(0)}K)**: ${deals[1].nextExecAction}
3. **${deals[2].name} ($${(deals[2].value / 1000).toFixed(0)}K)**: ${deals[2].nextExecAction}

*Generated autonomously via DealSense Sub-200ms Webhook Engine.*`;

  const handleCopyQbr = () => {
    navigator.clipboard.writeText(qbrBriefText);
    setCopiedQbr(true);
    setTimeout(() => setCopiedQbr(false), 2500);
  };

  return (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      {/* ── Enterprise Header ─────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #124548 0%, #062b2e 100%)",
          color: "#ffffff",
          padding: "20px 24px",
          border: "none",
          marginBottom: "var(--sp-5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge" style={{ background: "rgba(0, 164, 189, 0.25)", color: "#7de2ea", border: "1px solid rgba(0, 164, 189, 0.4)", fontWeight: 700, padding: "2px 8px", fontSize: "9.5px", letterSpacing: "0.05em" }}>
                ● REVOPS PIPELINE TELEMETRY
              </span>
              <span style={{ fontSize: "11.5px", color: "#a5c2c4", fontWeight: 500 }}>Executive Deal Review</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
              Deal War Room & Executive QBR Decision Matrix
            </h2>
            <p style={{ fontSize: "13px", color: "#d9e8e8", margin: 0, maxWidth: 680, lineHeight: 1.5 }}>
              Live decision hub for closing high-ticket stalled deals this month. Evaluate single-threaded risks, unblock economic buyers, and trigger interventions.
            </p>
          </div>
        </div>
      </div>

      {/* ── War Room Header ───────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #124548 0%, #0a3538 100%)",
          color: "#ffffff",
          padding: "26px 30px",
          border: "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge" style={{ background: "rgba(255, 92, 53, 0.25)", color: "#ff7a59", border: "1px solid #ff7a59", fontWeight: 700 }}>
                ● LIVE WAR ROOM ACTIVE
              </span>
              <span style={{ fontSize: "12px", color: "#a5c2c4" }}>HubSpot Portal #48921820</span>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "4px 0 6px" }}>
              Deal War Room & Executive QBR Decision Matrix
            </h2>
            <p style={{ fontSize: "13.5px", color: "#d9e8e8", margin: 0, maxWidth: 680 }}>
              Live decision hub for closing high-ticket stalled deals this month. Evaluate single-threaded risks, unblock economic buyers, and trigger executive interventions in 1 click.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn btn-primary"
              onClick={() => setQbrModalOpen(true)}
              style={{ background: "#ff5c35", fontWeight: 700, fontSize: "13px", padding: "9px 18px" }}
            >
              📄 Export Executive QBR Brief
            </button>
          </div>
        </div>

        {/* Action Success Alert Banner */}
        {actionSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 16,
              padding: "10px 14px",
              background: "rgba(0, 164, 189, 0.2)",
              border: "1px solid #00a4bd",
              borderRadius: "var(--radius-sm)",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#e6ffff",
            }}
          >
            {actionSuccessMsg}
          </motion.div>
        )}
      </div>

      {/* ── High-Impact KPI Metrics ───────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card" style={{ borderTopColor: "var(--hs-primary)" }}>
          <div className="kpi-title">Total Revenue at Stake</div>
          <div className="kpi-value">${(totalAtStake / 1000).toFixed(0)}K</div>
          <div className="kpi-subtitle">5 high-ticket deals closing this cycle</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--danger)" }}>
          <div className="kpi-title">Critical Slippage Exposure</div>
          <div className="kpi-value" style={{ color: "var(--danger)" }}>
            ${(criticalAtRisk / 1000).toFixed(0)}K
          </div>
          <div className="kpi-subtitle">Requires immediate VP Sales triage</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--risk-healthy)" }}>
          <div className="kpi-title">Forecast Commit Target</div>
          <div className="kpi-value" style={{ color: "var(--risk-healthy)" }}>
            ${(commitRevenue / 1000).toFixed(0)}K
          </div>
          <div className="kpi-subtitle">Pre-contract & final approval</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#00a4bd" }}>
          <div className="kpi-title">Avg CFO Silence Duration</div>
          <div className="kpi-value" style={{ color: "#00a4bd" }}>14.8 Days</div>
          <div className="kpi-subtitle">Highest driver of deal slippage</div>
        </div>
      </div>

      {/* ── 2-Column War Room Interface: Deal List & Live Triage Dossier ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {/* Left Column: Deal Priority Queue */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Active War Room Deals</div>
              <div className="card-subtitle">Select a deal to inspect stakeholders & trigger interventions</div>
            </div>
            <span className="badge" style={{ background: "var(--hs-surface)", color: "var(--hs-primary)", fontWeight: 700 }}>
              {deals.length} DEALS
            </span>
          </div>
          <div className="card-body" style={{ padding: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {deals.map((deal) => {
                const isSelected = selectedDeal.id === deal.id;
                return (
                  <div
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "var(--radius-sm)",
                      border: isSelected ? "2px solid #ff5c35" : "1px solid var(--hs-border-dark)",
                      background: isSelected ? "var(--hs-surface-hover)" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--hs-primary)" }}>
                          {deal.name}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
                          {deal.client} · {deal.stage}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-primary)" }}>
                          ${(deal.value / 1000).toFixed(0)}K
                        </div>
                        <span className={`risk-pill`} data-band={deal.band} style={{ fontSize: "9.5px", padding: "1px 6px" }}>
                          Score: {deal.riskScore}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontSize: "11px", color: "var(--hs-text-muted)" }}>
                      <span>Stalled: <strong>{deal.daysStalled}d</strong></span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: deal.goNoGoStatus === "Commit" ? "var(--risk-healthy)" : deal.goNoGoStatus === "High Risk" ? "var(--danger)" : "var(--warning)",
                        }}
                      >
                        ● {deal.goNoGoStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Deep Triage & Executive Intervention Command Center */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Executive Triage: {selectedDeal.name}</div>
              <div className="card-subtitle">Account: {selectedDeal.client} · Value: ${(selectedDeal.value / 1000).toFixed(0)}K</div>
            </div>
            <span className={`risk-pill`} data-band={selectedDeal.band}>
              Score: {selectedDeal.riskScore} · {selectedDeal.band}
            </span>
          </div>

          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Key Blocker Callout */}
            <div style={{ padding: "12px 14px", background: "var(--risk-critical-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--risk-critical-border)" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--danger)", textTransform: "uppercase" }}>
                ⚠️ Primary Deal Slip Blocker
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--hs-text)", marginTop: 4, lineHeight: 1.5 }}>
                {selectedDeal.keyBlocker}
              </div>
            </div>

            {/* Stakeholder Multi-Threading Grid */}
            <div>
              <div style={{ fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", color: "var(--hs-text-muted)", marginBottom: 8 }}>
                Stakeholder Engagement Map
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {/* Economic Buyer */}
                <div style={{ padding: "10px 12px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                  <div style={{ fontSize: "10.5px", color: "var(--hs-text-muted)", textTransform: "uppercase" }}>
                    Economic Buyer (CFO/Exec)
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "12.5px", color: "var(--hs-primary)", marginTop: 2 }}>
                    {selectedDeal.economicBuyer.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>
                    {selectedDeal.economicBuyer.title}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span className="badge" style={{ background: selectedDeal.economicBuyer.engagement.includes("Silent") ? "var(--risk-critical-bg)" : "var(--risk-healthy-bg)", color: selectedDeal.economicBuyer.engagement.includes("Silent") ? "var(--danger)" : "var(--risk-healthy)", fontSize: "9.5px" }}>
                      {selectedDeal.economicBuyer.engagement}
                    </span>
                  </div>
                </div>

                {/* Champion */}
                <div style={{ padding: "10px 12px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                  <div style={{ fontSize: "10.5px", color: "var(--hs-text-muted)", textTransform: "uppercase" }}>
                    Internal Champion
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "12.5px", color: "var(--hs-primary)", marginTop: 2 }}>
                    {selectedDeal.champion.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>
                    {selectedDeal.champion.title}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span className="badge" style={{ background: selectedDeal.champion.sentiment === "Strong" ? "var(--risk-healthy-bg)" : "var(--risk-high-bg)", color: selectedDeal.champion.sentiment === "Strong" ? "var(--risk-healthy)" : "var(--warning)", fontSize: "9.5px" }}>
                      Sentiment: {selectedDeal.champion.sentiment}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Executive Next Move */}
            <div style={{ padding: "12px 14px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-primary)", textTransform: "uppercase" }}>
                🎯 Recommended Executive Intervention
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--hs-primary)", marginTop: 4, lineHeight: 1.5 }}>
                {selectedDeal.nextExecAction}
              </div>
            </div>

            {/* 1-Click Executive Intervention Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              <button
                className="btn btn-primary"
                onClick={() => handleExecuteIntervention(selectedDeal.id, "Auto-Trigger Peer-to-Peer CFO Multi-Threading Email")}
                style={{ width: "100%", padding: "11px 0", fontWeight: 700, background: "#ff5c35", fontSize: "13px" }}
              >
                ⚡ 1-Click Trigger CFO Peer-to-Peer Rescue
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleExecuteIntervention(selectedDeal.id, "Push Close Date +30 Days & Notify Rep")}
                  style={{ padding: "9px 0", fontSize: "12px", fontWeight: 600 }}
                >
                  📅 Push Close Date +30d
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleExecuteIntervention(selectedDeal.id, "Send Mutual Action Plan (MAP) to Champion")}
                  style={{ padding: "9px 0", fontSize: "12px", fontWeight: 600 }}
                >
                  🗺️ Dispatch MAP Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Executive QBR Export Modal ───────────────────────────────── */}
      <AnimatePresence>
        {qbrModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQbrModalOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(18, 69, 72, 0.5)", zIndex: 400 }}
            />
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              style={{
                position: "fixed",
                top: "12%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                maxWidth: "600px",
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 410,
                overflow: "hidden",
                border: "1px solid var(--hs-border-dark)",
              }}
            >
              <div style={{ padding: "16px 20px", background: "var(--hs-surface)", borderBottom: "1px solid var(--hs-border-dark)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--hs-primary)" }}>
                  Executive QBR Revenue Briefing Export
                </div>
                <button onClick={() => setQbrModalOpen(false)} className="btn btn-secondary btn-sm">✕</button>
              </div>
              <div style={{ padding: "20px" }}>
                <textarea
                  readOnly
                  value={qbrBriefText}
                  style={{
                    width: "100%",
                    height: "220px",
                    padding: "12px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    background: "var(--hs-surface)",
                    border: "1px solid var(--hs-border-dark)",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                    lineHeight: 1.5,
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
                  <button className="btn btn-secondary" onClick={() => setQbrModalOpen(false)}>Close</button>
                  <button className="btn btn-primary" onClick={handleCopyQbr} style={{ background: "#ff5c35", fontWeight: 700 }}>
                    {copiedQbr ? "✓ Copied to Clipboard!" : "📋 Copy Executive Brief"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
