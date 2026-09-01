/**
 * DealSense Dashboard — Deal Explorer & Pipeline Intelligence.
 * Interactive RevOps deal inspector with live telemetry, MEDDICC breakdown, and action triggers.
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DealDetail {
  id: string;
  name: string;
  client: string;
  score: number;
  band: "Critical" | "High" | "Moderate" | "Low" | "Healthy";
  value: number;
  stage: string;
  owner: string;
  daysInStage: number;
  lastTouch: string;
  slippageCount: number;
  meddicc: {
    metrics: string;
    economicBuyer: string;
    decisionCriteria: string;
    decisionProcess: string;
    identifyPain: string;
    champion: string;
    competition: string;
  };
  risks: string[];
  recommendation: string;
}

const SAMPLE_DEAL_EXPLORER: DealDetail[] = [
  {
    id: "deal-101",
    name: "Orion Cloud Migration",
    client: "TechCorp Inc.",
    score: 23,
    band: "Critical",
    value: 150000,
    stage: "Proposal Sent",
    owner: "Sarah Miller",
    daysInStage: 21,
    lastTouch: "12 days ago",
    slippageCount: 2,
    meddicc: {
      metrics: "30% infrastructure OPEX reduction targeted",
      economicBuyer: "Missing / Unverified",
      decisionCriteria: "SOC2 Compliance + AWS Native",
      decisionProcess: "Unclear approval hierarchy",
      identifyPain: "Current data center lease expiring Q4",
      champion: "VP Engineering (Sarah) supportive but quiet",
      competition: "AWS Professional Services direct",
    },
    risks: [
      "21 days in Proposal Sent stage (threshold: 10 days)",
      "Zero logged interactions with economic buyer",
      "Close date pushed twice in 30 days",
    ],
    recommendation: "Request executive sponsor alignment call with VP Finance within 48h.",
  },
  {
    id: "deal-102",
    name: "Quantum Security Suite",
    client: "FinanceGo Ltd.",
    score: 31,
    band: "Critical",
    value: 280000,
    stage: "Negotiation",
    owner: "James Reynolds",
    daysInStage: 28,
    lastTouch: "8 days ago",
    slippageCount: 3,
    meddicc: {
      metrics: "Unquantified ROI documentation",
      economicBuyer: "CFO (Richard Vance) — attended 1 demo",
      decisionCriteria: "Zero Trust Architecture",
      decisionProcess: "Legal and Procurement review underway",
      identifyPain: "Failed recent penetration test audit",
      champion: "Head of SecOps is strong champion",
      competition: "Palo Alto Networks",
    },
    risks: [
      "Contract negotiation stalled on liability cap terms",
      "Negative sentiment trend in last procurement email",
    ],
    recommendation: "Provide standard FinServ compliance addendum and schedule legal counsel check-in.",
  },
  {
    id: "deal-103",
    name: "Horizon Data Platform",
    client: "RetailMax",
    score: 35,
    band: "Critical",
    value: 95000,
    stage: "Qualification",
    owner: "Lisa Chen",
    daysInStage: 18,
    lastTouch: "14 days ago",
    slippageCount: 1,
    meddicc: {
      metrics: "Real-time inventory sync across 400 stores",
      economicBuyer: "Not yet identified",
      decisionCriteria: "Sub-second latency query speed",
      decisionProcess: "RFP format expected",
      identifyPain: "Lost $2.4M in stockouts last holiday season",
      champion: "Lead Data Architect",
      competition: "Snowflake + dbt Labs",
    },
    risks: [
      "Single-threaded deal (1 contact associated)",
      "14 days silence since architecture review",
    ],
    recommendation: "Deliver retail inventory ROI whitepaper to introduce VP Supply Chain.",
  },
  {
    id: "deal-104",
    name: "Apex CRM Integration",
    client: "LogiPro Solutions",
    score: 62,
    band: "Moderate",
    value: 120000,
    stage: "Proposal Sent",
    owner: "Mike Torres",
    daysInStage: 7,
    lastTouch: "2 days ago",
    slippageCount: 0,
    meddicc: {
      metrics: "Consolidate 4 disconnected tools into HubSpot",
      economicBuyer: "COO confirmed budget owner",
      decisionCriteria: "Bi-directional ERP sync capability",
      decisionProcess: "Final board presentation next Tuesday",
      identifyPain: "Sales reps spend 9 hrs/wk on duplicate data entry",
      champion: "Director of RevOps",
      competition: "Salesforce Revenue Cloud",
    },
    risks: [
      "CRM custom object schema complexity requires scoping sign-off",
    ],
    recommendation: "Schedule technical architecture pre-flight before Tuesday board review.",
  },
  {
    id: "deal-105",
    name: "Crown Global Enterprise",
    client: "LogiPro Solutions",
    score: 92,
    band: "Healthy",
    value: 400000,
    stage: "Contract",
    owner: "Mike Torres",
    daysInStage: 4,
    lastTouch: "Yesterday",
    slippageCount: 0,
    meddicc: {
      metrics: "$1.8M annual efficiency gains verified by finance",
      economicBuyer: "CEO & CFO signed mutual action plan",
      decisionCriteria: "Enterprise SLA & Dedicated CSM",
      decisionProcess: "Standard DocuSign routing",
      identifyPain: "Legacy system EOL in 45 days",
      champion: "VP Sales & Head of IT both aligned",
      competition: "Sole source vendor selected",
    },
    risks: [
      "No critical risks identified. High momentum velocity.",
    ],
    recommendation: "Monitor DocuSign completion and trigger onboarding kickoff workflow.",
  },
];

const BAND_MAP: Record<string, { bg: string; color: string; border: string }> = {
  Critical: { bg: "var(--risk-critical-bg)", color: "var(--risk-critical)", border: "var(--risk-critical-border)" },
  High: { bg: "var(--risk-high-bg)", color: "var(--risk-high)", border: "var(--risk-high-border)" },
  Moderate: { bg: "var(--risk-moderate-bg)", color: "var(--risk-moderate)", border: "var(--risk-moderate-border)" },
  Low: { bg: "var(--risk-low-bg)", color: "var(--risk-low)", border: "var(--risk-low-border)" },
  Healthy: { bg: "var(--risk-healthy-bg)", color: "var(--risk-healthy)", border: "var(--risk-healthy-border)" },
};

export const DealExplorer: React.FC = () => {
  const [deals] = useState<DealDetail[]>(SAMPLE_DEAL_EXPLORER);
  const [search, setSearch] = useState("");
  const [selectedBand, setSelectedBand] = useState<string>("All");
  const [activeDeal, setActiveDeal] = useState<DealDetail>(SAMPLE_DEAL_EXPLORER[0]);

  const filteredDeals = useMemo(() => {
    return deals.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.client.toLowerCase().includes(search.toLowerCase());
      const matchesBand = selectedBand === "All" || d.band === selectedBand;
      return matchesSearch && matchesBand;
    });
  }, [deals, search, selectedBand]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      {/* ── Header Card ───────────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #124548 0%, #062b2e 100%)",
          color: "#ffffff",
          padding: "26px 30px",
          border: "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge" style={{ background: "rgba(0, 164, 189, 0.25)", color: "#7de2ea", border: "1px solid #00a4bd", fontWeight: 700 }}>
                ● REVOPS PIPELINE TELEMETRY
              </span>
              <span style={{ fontSize: "12px", color: "#a5c2c4" }}>Deal Dossiers & MEDDICC</span>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "4px 0 6px" }}>
              Deal Inspector & Pipeline Intelligence
            </h2>
            <p style={{ fontSize: "13.5px", color: "#d9e8e8", margin: 0, maxWidth: 680 }}>
              Deep dive into individual deal dossiers. Review automated MEDDICC scoring, surface hidden risk factors, and trigger executive interventions.
            </p>
          </div>
        </div>
      </div>

      {/* ── Filters Bar ──────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", flex: 1, minWidth: 0 }}>
          <input
            type="text"
            placeholder="Search deals or clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "7px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--hs-border-dark)",
              background: "#ffffff",
              fontSize: "13px",
              color: "var(--hs-text)",
              outline: "none",
              flex: "1 1 180px",
              maxWidth: 280,
            }}
          />
          {["All", "Critical", "Moderate", "Healthy"].map((b) => (
            <button
              key={b}
              className={`btn btn-sm ${selectedBand === b ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSelectedBand(b)}
            >
              {b}
            </button>
          ))}
        </div>

        <span className="badge badge-outline" style={{ flexShrink: 0 }}>{filteredDeals.length} deals mapped</span>
      </div>

      {/* ── Master-Detail Grid ───────────────────────────────────────── */}
      <div className="deal-explorer-grid">
        {/* Deal List Panel */}
        <div className="card" style={{ maxHeight: "calc(100vh - 180px)", minHeight: "360px", display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            <div className="card-title">Deal Intelligence Roster</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "var(--sp-2)" }}>
            {filteredDeals.map((deal) => {
              const isSelected = activeDeal.id === deal.id;
              const meta = BAND_MAP[deal.band];

              return (
                <motion.div
                  key={deal.id}
                  onClick={() => setActiveDeal(deal)}
                  whileHover={{ backgroundColor: "var(--hs-surface-hover)" }}
                  style={{
                    padding: "12px",
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${isSelected ? "var(--hs-primary)" : "var(--hs-border-dark)"}`,
                    background: isSelected ? "var(--hs-surface)" : "#ffffff",
                    marginBottom: 8,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <div style={{ fontWeight: 600, color: "var(--hs-primary)", fontSize: "13.5px" }}>{deal.name}</div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: "13px",
                        color: meta.color,
                      }}
                    >
                      {deal.score}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--hs-text-muted)" }}>
                    <span>{deal.client}</span>
                    <span style={{ fontWeight: 600, color: "var(--hs-text)" }}>${(deal.value / 1000).toFixed(0)}K</span>
                  </div>

                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <span className="risk-pill" data-band={deal.band}>
                      {deal.band}
                    </span>
                    <span className="badge badge-outline" style={{ fontSize: "10.5px" }}>
                      {deal.stage}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Deal Full Intelligence Dossier */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDeal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="card"
            style={{ minHeight: "420px", overflowY: "auto" }}
          >
            <div className="card-header" style={{ background: "var(--hs-surface)" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                  Deal Intelligence Dossier
                </div>
                <div className="card-title" style={{ fontSize: "20px", marginTop: 2 }}>
                  {activeDeal.name} · <span style={{ color: "var(--hs-text-muted)", fontWeight: 400 }}>{activeDeal.client}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className="risk-pill" data-band={activeDeal.band} style={{ fontSize: "12px", padding: "4px 12px" }}>
                  Health Score: {activeDeal.score}/100 ({activeDeal.band})
                </span>
              </div>
            </div>

            <div className="card-body">
              {/* Telemetry Stats Bar */}
              <div className="kpi-grid" style={{ marginBottom: "var(--sp-6)" }}>
                <div className="kpi-card" style={{ padding: "12px 16px" }}>
                  <div className="kpi-label">Pipeline Value</div>
                  <div className="kpi-value" style={{ fontSize: "22px" }}>${(activeDeal.value / 1000).toFixed(0)}K</div>
                </div>
                <div className="kpi-card" style={{ padding: "12px 16px" }}>
                  <div className="kpi-label">Time in Stage</div>
                  <div className="kpi-value" style={{ fontSize: "22px" }}>{activeDeal.daysInStage} Days</div>
                </div>
                <div className="kpi-card" style={{ padding: "12px 16px" }}>
                  <div className="kpi-label">Last Interaction</div>
                  <div className="kpi-value" style={{ fontSize: "20px" }}>{activeDeal.lastTouch}</div>
                </div>
                <div className="kpi-card" style={{ padding: "12px 16px" }}>
                  <div className="kpi-label">Close Date Pushes</div>
                  <div className="kpi-value" style={{ fontSize: "22px", color: activeDeal.slippageCount > 0 ? "var(--danger)" : "var(--success)" }}>
                    {activeDeal.slippageCount}×
                  </div>
                </div>
              </div>

              {/* MEDDICC Breakdown Grid */}
              <div style={{ marginBottom: "var(--sp-6)" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--hs-primary)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
                  MEDDICC Qualification Framework
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                  {Object.entries(activeDeal.meddicc).map(([key, val]) => (
                    <div
                      key={key}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--hs-border-dark)",
                        background: "var(--hs-surface)",
                      }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase" }}>
                        {key.replace(/([A-Z])/g, " $1")}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--hs-text)", marginTop: 2, fontWeight: 500 }}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detected Risks & Next Action (Responsive Auto-Fit Stack) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 16,
                  width: "100%",
                  minWidth: 0,
                }}
              >
                {/* Risk Signals */}
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--risk-critical-border)",
                    background: "var(--risk-critical-bg)",
                    minWidth: 0,
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--danger)", textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>⚠️</span> Grounded Risk Signals
                  </div>
                  <ul style={{ paddingLeft: 18, fontSize: "13px", color: "var(--hs-text)", lineHeight: 1.6 }}>
                    {activeDeal.risks.map((r, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{r}</li>
                    ))}
                  </ul>
                </div>

                {/* AI Next Best Action */}
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--hs-border-dark)",
                    background: "var(--hs-surface)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minWidth: 0,
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>⚡</span> Recommended Next Best Move
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--hs-text)", lineHeight: 1.5 }}>
                      {activeDeal.recommendation}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                    <button className="btn btn-primary btn-sm" style={{ whiteSpace: "nowrap" }}>
                      ⚡ Execute Write-Back
                    </button>
                    <button className="btn btn-secondary btn-sm" style={{ whiteSpace: "nowrap" }}>
                      Create HubSpot Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
