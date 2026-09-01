/**
 * DealSense — Multi-Threading Stakeholder Power Matrix.
 * Identifies single-threaded pipeline risks, unengaged CFOs, and technical blockers across active enterprise deals.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Stakeholder {
  id: string;
  name: string;
  title: string;
  role: "Economic Buyer" | "Champion" | "Technical Evaluator" | "Procurement / Legal" | "Blocker";
  sentiment: "Strong Advocate" | "Neutral" | "Skeptical / Blocker" | "Silent / Unengaged";
  lastTouch: string;
  email: string;
  influenceLevel: "High" | "Medium" | "Low";
}

interface DealMultiThreading {
  id: string;
  dealName: string;
  client: string;
  value: number;
  stage: string;
  riskScore: number;
  coverageScore: number; // 0 to 100
  engagedCount: number;
  totalRequired: number;
  status: "Single-Threaded (Fragile)" | "Partial Coverage" | "Fully Multi-Threaded";
  stakeholders: Stakeholder[];
}

const MULTI_THREADING_DEALS: DealMultiThreading[] = [
  {
    id: "deal-101",
    dealName: "Orion Cloud Migration",
    client: "TechCorp Inc.",
    value: 150000,
    stage: "Proposal Sent",
    riskScore: 23,
    coverageScore: 35,
    engagedCount: 1,
    totalRequired: 4,
    status: "Single-Threaded (Fragile)",
    stakeholders: [
      { id: "s1", name: "David Chen", title: "Chief Financial Officer", role: "Economic Buyer", sentiment: "Silent / Unengaged", lastTouch: "18 days ago (Unopened)", email: "david.chen@techcorp.com", influenceLevel: "High" },
      { id: "s2", name: "Marcus Vance", title: "VP Infrastructure", role: "Champion", sentiment: "Strong Advocate", lastTouch: "Yesterday", email: "m.vance@techcorp.com", influenceLevel: "High" },
      { id: "s3", name: "Elena Rostova", title: "Head of SecOps", role: "Technical Evaluator", sentiment: "Skeptical / Blocker", lastTouch: "6 days ago", email: "e.rostova@techcorp.com", influenceLevel: "Medium" },
      { id: "s4", name: "Unassigned Contact", title: "Director of Procurement", role: "Procurement / Legal", sentiment: "Silent / Unengaged", lastTouch: "Never", email: "procurement@techcorp.com", influenceLevel: "Medium" },
    ],
  },
  {
    id: "deal-102",
    dealName: "Quantum Security Suite",
    client: "FinanceGo Ltd.",
    value: 280000,
    stage: "Negotiation",
    riskScore: 31,
    coverageScore: 50,
    engagedCount: 2,
    totalRequired: 4,
    status: "Partial Coverage",
    stakeholders: [
      { id: "s5", name: "Sarah Jenkins", title: "Chief Information Security Officer", role: "Economic Buyer", sentiment: "Silent / Unengaged", lastTouch: "14 days ago", email: "s.jenkins@financego.com", influenceLevel: "High" },
      { id: "s6", name: "Arthur Dent", title: "Director of SecOps", role: "Champion", sentiment: "Strong Advocate", lastTouch: "2 days ago", email: "a.dent@financego.com", influenceLevel: "High" },
      { id: "s7", name: "Julian Thorne", title: "General Counsel", role: "Procurement / Legal", sentiment: "Skeptical / Blocker", lastTouch: "4 days ago (Pending Redlines)", email: "j.thorne@financego.com", influenceLevel: "High" },
      { id: "s8", name: "Liam O'Connor", title: "Cloud Architect", role: "Technical Evaluator", sentiment: "Neutral", lastTouch: "5 days ago", email: "liam@financego.com", influenceLevel: "Medium" },
    ],
  },
  {
    id: "deal-105",
    dealName: "Crown Global Enterprise",
    client: "LogiPro Solutions",
    value: 400000,
    stage: "Contract",
    riskScore: 92,
    coverageScore: 100,
    engagedCount: 4,
    totalRequired: 4,
    status: "Fully Multi-Threaded",
    stakeholders: [
      { id: "s9", name: "Robert Sterling", title: "Chief Executive Officer", role: "Economic Buyer", sentiment: "Strong Advocate", lastTouch: "Yesterday", email: "r.sterling@logipro.com", influenceLevel: "High" },
      { id: "s10", name: "Victoria Stone", title: "VP Revenue Operations", role: "Champion", sentiment: "Strong Advocate", lastTouch: "Today", email: "v.stone@logipro.com", influenceLevel: "High" },
      { id: "s11", name: "Tom Holland", title: "Head of Enterprise Systems", role: "Technical Evaluator", sentiment: "Strong Advocate", lastTouch: "2 days ago", email: "t.holland@logipro.com", influenceLevel: "Medium" },
      { id: "s12", name: "Jessica Alba", title: "VP Legal & Compliance", role: "Procurement / Legal", sentiment: "Neutral", lastTouch: "Yesterday", email: "j.alba@logipro.com", influenceLevel: "High" },
    ],
  },
];

export const StakeholderMatrix: React.FC = () => {
  const [deals] = useState<DealMultiThreading[]>(MULTI_THREADING_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<DealMultiThreading>(MULTI_THREADING_DEALS[0]);
  const [activeFilter, setActiveFilter] = useState<"All" | "Single-Threaded" | "Multi-Threaded">("All");
  const [outreachAlert, setOutreachAlert] = useState<string | null>(null);

  const singleThreadedCount = deals.filter((d) => d.status.includes("Single-Threaded")).length;
  const singleThreadedARR = deals.filter((d) => d.status.includes("Single-Threaded")).reduce((sum, d) => sum + d.value, 0);

  const handleTriggerOutreach = (stakeholder: Stakeholder) => {
    setOutreachAlert(`✓ Executive peer-to-peer sequence dispatched to ${stakeholder.name} (${stakeholder.title}) via HubSpot Sequence integration.`);
    setTimeout(() => setOutreachAlert(null), 3500);
  };

  const filteredDeals = deals.filter((d) => {
    if (activeFilter === "Single-Threaded") return d.status.includes("Single-Threaded");
    if (activeFilter === "Multi-Threaded") return d.status.includes("Fully");
    return true;
  });

  return (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      {/* ── Enterprise Header ─────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          padding: "20px 24px",
          border: "1px solid var(--hs-border-dark)",
          borderTop: "3px solid var(--hs-primary)",
          marginBottom: "var(--sp-5)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge" style={{ background: "rgba(255, 122, 89, 0.1)", color: "#ff7a59", border: "1px solid rgba(255, 122, 89, 0.3)", fontWeight: 700, padding: "2px 8px", fontSize: "9.5px", letterSpacing: "0.05em" }}>
                ● REVOPS PIPELINE TELEMETRY
              </span>
              <span style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", fontWeight: 500 }}>Buying Committee Fragility</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--hs-heading)", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
              Stakeholder Power Matrix
            </h2>
            <p style={{ fontSize: "13px", color: "var(--hs-text)", margin: 0, maxWidth: 680, lineHeight: 1.5 }}>
              Detect single-threaded fragility. Ensure economic buyers, champions, and legal contacts are engaged before committing deals to the forecast.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <button
              style={{
                padding: "6px 14px",
                background: "#ffffff",
                color: "var(--hs-text)",
                border: "1px solid var(--hs-border-dark)",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s"
              }}
            >
              Export Report
            </button>
            <button
              style={{
                padding: "6px 14px",
                background: "#ff7a59",
                color: "#ffffff",
                border: "none",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s"
              }}
            >
              Create Action
            </button>
          </div>
        </div>
      </div>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          padding: "20px 24px",
          border: "1px solid var(--hs-border-dark)",
          borderTop: "3px solid var(--hs-primary)",
          marginBottom: "var(--sp-5)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge" style={{ background: "rgba(255, 92, 53, 0.1)", color: "#ff5c35", border: "1px solid #ff7a59", fontWeight: 700 }}>
                ● STAKEHOLDER MULTI-THREADING ENGINE
              </span>
              <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>HubSpot Contact Association Graph</span>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--hs-heading)", margin: "4px 0 6px" }}>
              Multi-Threading & Stakeholder Power Matrix
            </h2>
            <p style={{ fontSize: "13.5px", color: "var(--hs-text)", margin: 0, maxWidth: 680 }}>
              Map buying committees across active enterprise opportunities. Detect single-threaded deals, unblock silent CFOs, and trigger peer-to-peer executive outreach.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, background: "rgba(255, 255, 255, 0.1)", padding: 4, borderRadius: "var(--radius-sm)" }}>
            {(["All", "Single-Threaded", "Multi-Threaded"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: activeFilter === f ? "#ff5c35" : "transparent",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: activeFilter === f ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {outreachAlert && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
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
            {outreachAlert}
          </motion.div>
        )}
      </div>

      {/* ── KPI Row ───────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card" style={{ borderTopColor: "var(--danger)" }}>
          <div className="kpi-title">Single-Threaded Deals</div>
          <div className="kpi-value" style={{ color: "var(--danger)" }}>
            {singleThreadedCount} Deals
          </div>
          <div className="kpi-subtitle">At high risk of sudden deal slippage</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#ff5c35" }}>
          <div className="kpi-title">Single-Threaded ARR Exposure</div>
          <div className="kpi-value" style={{ color: "#ff5c35" }}>
            ${(singleThreadedARR / 1000).toFixed(0)}K
          </div>
          <div className="kpi-subtitle">Resting on 1 single internal champion</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--risk-healthy)" }}>
          <div className="kpi-title">Avg Multi-Threaded Win Rate</div>
          <div className="kpi-value" style={{ color: "var(--risk-healthy)" }}>74.2%</div>
          <div className="kpi-subtitle">vs 28.5% for single-threaded deals</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#00a4bd" }}>
          <div className="kpi-title">Avg Stakeholders Engaged</div>
          <div className="kpi-value" style={{ color: "#ff7a59" }}>2.4 / Deal</div>
          <div className="kpi-subtitle">Benchmark is 3.8 for enterprise</div>
        </div>
      </div>

      {/* ── 2-Column Matrix: Deal Selector & Stakeholder Map ─────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {/* Left Column: Deal List */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Opportunities Under Review</div>
              <div className="card-subtitle">Select a deal to inspect stakeholder buying committee</div>
            </div>
          </div>
          <div className="card-body" style={{ padding: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filteredDeals.map((deal) => {
                const isSelected = selectedDeal.id === deal.id;
                const isSingle = deal.status.includes("Single-Threaded");
                const isFull = deal.status.includes("Fully");

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
                          {deal.dealName}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
                          {deal.client} · {deal.stage}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--hs-primary)" }}>
                          ${(deal.value / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontSize: "11px" }}>
                      <span style={{ color: "var(--hs-text-muted)" }}>
                        Committee: <strong>{deal.engagedCount}/{deal.totalRequired} Engaged</strong>
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: isSingle ? "var(--danger)" : isFull ? "var(--risk-healthy)" : "var(--warning)",
                        }}
                      >
                        ● {deal.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Stakeholder Buying Committee Org Matrix */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Buying Committee: {selectedDeal.dealName}</div>
              <div className="card-subtitle">Account: {selectedDeal.client} · Deal Value: ${(selectedDeal.value / 1000).toFixed(0)}K</div>
            </div>
            <span
              className="badge"
              style={{
                background: selectedDeal.coverageScore >= 80 ? "var(--risk-healthy-bg)" : "var(--risk-critical-bg)",
                color: selectedDeal.coverageScore >= 80 ? "var(--risk-healthy)" : "var(--danger)",
                fontWeight: 700,
              }}
            >
              {selectedDeal.coverageScore}% Committee Coverage
            </span>
          </div>

          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {selectedDeal.stakeholders.map((s) => {
              const isAdvocate = s.sentiment.includes("Advocate");
              const isSilent = s.sentiment.includes("Silent");
              const isBlocker = s.sentiment.includes("Blocker");

              const pillBg = isAdvocate ? "var(--risk-healthy-bg)" : isBlocker ? "var(--risk-critical-bg)" : "var(--risk-high-bg)";
              const pillColor = isAdvocate ? "var(--risk-healthy)" : isBlocker ? "var(--danger)" : "var(--warning)";

              return (
                <div
                  key={s.id}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--hs-border-dark)",
                    background: isSilent || isBlocker ? "rgba(255, 92, 53, 0.03)" : "#ffffff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--hs-primary)" }}>
                        {s.name}
                      </span>
                      <span className="badge badge-outline" style={{ fontSize: "10px", fontWeight: 700 }}>
                        {s.role}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>
                      {s.title} · Last touch: <strong>{s.lastTouch}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="badge" style={{ background: pillBg, color: pillColor, fontWeight: 700, fontSize: "10.5px" }}>
                      {s.sentiment}
                    </span>

                    {(isSilent || isBlocker) && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleTriggerOutreach(s)}
                        style={{ fontSize: "11px", fontWeight: 700, background: "#ff5c35", padding: "4px 10px" }}
                      >
                        ⚡ Trigger Outreach
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
