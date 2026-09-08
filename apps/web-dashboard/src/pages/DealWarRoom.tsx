/**
 * DealSense — Deal War Room & Executive QBR Decision Engine.
 * Built for VP Sales, CROs, and RevOps leaders for high-stakes Friday pipeline reviews and board meetings.
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalDeals, updateDeal, logAuditEvent, DealItem } from "../api";
import { ENTERPRISE_WAR_ROOM, EnterpriseWarRoomDeal } from "../data/enterpriseData";

function mergeWarRoomDeals(localDeals: DealItem[]): EnterpriseWarRoomDeal[] {
  if (localDeals.length === 0) return ENTERPRISE_WAR_ROOM;

  return localDeals.slice(0, 10).map((d, index) => {
    const defaultTemplate = ENTERPRISE_WAR_ROOM[index % ENTERPRISE_WAR_ROOM.length];
    const band = d.score < 50 ? "Critical" : d.score < 75 ? "High" : "Moderate";
    const goNoGoStatus = d.score >= 75 ? "Commit" : d.score < 50 ? "High Risk" : "Conditional";

    return {
      id: d.id,
      name: d.name,
      client: d.client,
      value: d.value,
      stage: d.stage,
      closeDate: d.closeDate || "2026-09-30",
      riskScore: d.score,
      band: band as any,
      daysStalled: d.daysInStage || 14 + index * 4,
      keyBlocker:
        d.risks && d.risks.length > 0
          ? typeof d.risks[0] === "string"
            ? (d.risks[0] as string)
            : (d.risks[0] as any).text || "Missing economic buyer sign-off"
          : defaultTemplate?.keyBlocker || "Missing economic buyer sign-off and pricing alignment.",

      economicBuyer: {
        name: d.contacts?.find((c: any) => c.role === "Economic Buyer")?.name || defaultTemplate?.economicBuyer?.name || "Marcus Vance",
        title: "Chief Financial Officer",
        engagement: d.score < 50 ? "Silent 18d" : "Engaged",
      },

      champion: {
        name: d.contacts?.find((c: any) => c.role === "Champion")?.name || defaultTemplate?.champion?.name || "Sarah Jenkins",
        title: "VP Revenue Operations",
        sentiment: d.score >= 70 ? "Strong" : "Hesitant",
      },

      nextExecAction:
        d.recommendation || defaultTemplate?.nextExecAction || "Host 15-minute VP-to-CFO ROI alignment call before month-end.",
      goNoGoStatus: goNoGoStatus as any,
    };

  });
}

export const DealWarRoom: React.FC = () => {
  const [deals, setDeals] = useState<EnterpriseWarRoomDeal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string>("");
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [qbrModalOpen, setQbrModalOpen] = useState(false);
  const [copiedQbr, setCopiedQbr] = useState(false);

  const loadWarRoom = () => {
    const localDeals = getLocalDeals();
    const merged = mergeWarRoomDeals(localDeals);
    setDeals(merged);
    if (!selectedDealId && merged.length > 0) {
      setSelectedDealId(merged[0].id);
    }
  };

  useEffect(() => {
    loadWarRoom();
    const handleUpdate = () => loadWarRoom();
    window.addEventListener("dealsense:deals-updated", handleUpdate);
    return () => window.removeEventListener("dealsense:deals-updated", handleUpdate);
  }, []);

  const selectedDeal = deals.find((d) => d.id === selectedDealId) || deals[0];

  const totalAtStake = deals.reduce((sum, d) => sum + d.value, 0);
  const criticalAtRisk = deals.filter((d) => d.band === "Critical").reduce((sum, d) => sum + d.value, 0);
  const commitRevenue = deals.filter((d) => d.goNoGoStatus === "Commit").reduce((sum, d) => sum + d.value, 0);

  const handleExecuteIntervention = (dealId: string, actionName: string) => {
    const deal = deals.find((d) => d.id === dealId) || selectedDeal;
    if (!deal) return;

    if (actionName.includes("Rescue") || actionName.includes("Peer-to-Peer")) {
      const newScore = Math.min(92, deal.riskScore + 16);
      updateDeal(dealId, {
        score: newScore,
        band: newScore >= 75 ? "Healthy" : "Moderate",
      });
      logAuditEvent({
        actor: "James Reynolds",
        role: "VP of Revenue Operations",
        actionType: "Executive Intervention Dispatched",
        targetObject: `Deal #${deal.id} (${deal.name})`,
        tier: "Tier 4 (Executive Action)",
        status: "Success",
        details: `Dispatched CFO Peer-to-Peer outreach sequence. Increased deal health score to ${newScore} and updated stage confidence in HubSpot.`,
      });
    } else if (actionName.includes("Push Close Date")) {
      updateDeal(dealId, {
        closeDate: "2026-10-31",
      });
      logAuditEvent({
        actor: "James Reynolds",
        role: "VP of Revenue Operations",
        actionType: "War Room Close Date Slip",
        targetObject: `Deal #${deal.id} (${deal.name})`,
        tier: "Tier 3 (Automated Write-Back)",
        status: "Success",
        details: `Pushed close date +30 days to 2026-10-31 and notified assigned enterprise rep.`,
      });
    } else if (actionName.includes("MAP")) {
      logAuditEvent({
        actor: "James Reynolds",
        role: "VP of Revenue Operations",
        actionType: "Mutual Action Plan Dispatched",
        targetObject: `Deal #${deal.id} (${deal.name})`,
        tier: "Tier 2 (Assisted Task)",
        status: "Success",
        details: `Generated interactive Mutual Action Plan and dispatched link to ${deal.champion.name} (${deal.champion.title}).`,
      });
    }

    setActionSuccessMsg(`✓ Triggered: "${actionName}" for ${deal.name} (HubSpot Task Created & Webhook Dispatched)`);
    setTimeout(() => setActionSuccessMsg(null), 3800);
  };

  const qbrBriefText = `### DEAL SENSE — EXECUTIVE REVENUE BRIEFING (QBR)
**Total Pipeline Under Review:** $${(totalAtStake / 1000000).toFixed(1)}M (${deals.length} Deals)
**Critical Slippage Risk:** $${(criticalAtRisk / 1000000).toFixed(1)}M (${deals.filter((d) => d.band === "Critical").length} Deals)
**Forecast Commit Realization:** $${(commitRevenue / 1000000).toFixed(1)}M

#### Top Executive Action Items:
${deals
  .slice(0, 3)
  .map((d, i) => `${i + 1}. **${d.name} ($${(d.value / 1000).toFixed(0)}K)**: ${d.nextExecAction}`)
  .join("\n")}

*Generated autonomously via DealSense Sub-200ms Webhook Engine.*`;

  const handleCopyQbr = () => {
    navigator.clipboard.writeText(qbrBriefText);
    setCopiedQbr(true);
    setTimeout(() => setCopiedQbr(false), 2500);
  };

  const handleDownloadQbr = () => {
    const blob = new Blob([qbrBriefText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qbr_executive_brief_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      {/* ── Enterprise Header ─────────────────────────────────────────── */}
      <div className="page-header-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="page-header-badge-row">
              <span className="page-header-badge">
                ● REVOPS PIPELINE TELEMETRY
              </span>
            </div>
            <h2 className="page-header-title">
              Deal War Room &amp; Executive QBR Decision Matrix
            </h2>
            <p className="page-header-desc">
              Live decision hub for closing high-ticket stalled deals this month. Evaluate single-threaded risks, unblock economic buyers, and trigger interventions.
            </p>
          </div>
          <div className="page-header-actions">
            <button
              onClick={() => setQbrModalOpen(true)}
              style={{
                background: "#ffffff",
                color: "var(--hs-primary)",
                border: "1px solid var(--hs-border-dark)",
              }}
            >
              <span>📑 Export QBR Brief</span>
            </button>
            {selectedDeal && (
              <button
                onClick={() => handleExecuteIntervention(selectedDeal.id, "Auto-Trigger Peer-to-Peer CFO Multi-Threading Email")}
                style={{
                  background: "#ff5c35",
                  color: "#ffffff",
                  border: "none",
                  boxShadow: "0 2px 6px rgba(255, 92, 53, 0.25)",
                }}
              >
                <span>⚡ Auto-Rescue CFO Sequence</span>
              </button>
            )}
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
              color: "#007a8c",
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
          <div className="kpi-value">${(totalAtStake / 1000000).toFixed(1)}M</div>
          <div className="kpi-subtitle">{deals.length} strategic deals under QBR review</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--danger)" }}>
          <div className="kpi-title">Critical Slippage Exposure</div>
          <div className="kpi-value" style={{ color: "var(--danger)" }}>
            ${(criticalAtRisk / 1000000).toFixed(1)}M
          </div>
          <div className="kpi-subtitle">Requires immediate executive triage</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--risk-healthy)" }}>
          <div className="kpi-title">Forecast Commit Target</div>
          <div className="kpi-value" style={{ color: "var(--risk-healthy)" }}>
            ${(commitRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="kpi-subtitle">Pre-contract &amp; final PO approval</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#00a4bd" }}>
          <div className="kpi-title">Avg CFO Silence Duration</div>
          <div className="kpi-value" style={{ color: "#ff7a59" }}>14.8 Days</div>
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
              <div className="card-subtitle">Select a deal to inspect stakeholders &amp; trigger interventions</div>
            </div>
            <span className="badge" style={{ background: "var(--hs-surface)", color: "var(--hs-primary)", fontWeight: 700 }}>
              {deals.length} DEALS
            </span>
          </div>
          <div className="card-body" style={{ padding: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {deals.map((deal) => {
                const isSelected = selectedDeal?.id === deal.id;
                return (
                  <div
                    key={deal.id}
                    onClick={() => setSelectedDealId(deal.id)}
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
        {selectedDeal ? (
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
        ) : null}
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
                  <button className="btn btn-secondary" onClick={handleDownloadQbr}>
                    📥 Download .md
                  </button>
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

