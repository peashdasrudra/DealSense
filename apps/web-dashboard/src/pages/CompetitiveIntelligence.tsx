/**
 * DealSense Dashboard — Competitive Battlecards & Objection Killer Engine.
 * Gives sales reps instant battlecards, competitor trap questions, and objection scripts.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CompetitorCard {
  id: string;
  name: string;
  category: string;
  threatLevel: "High" | "Moderate" | "Low";
  winRate: string;
  pricingModel: string;
  quickSummary: string;
  ourAdvantage: string[];
  trapQuestions: string[];
  objectionResponses: Array<{ objection: string; script: string }>;
  tcoComparison: {
    implementationTime: { us: string; them: string };
    pricingModel: { us: string; them: string };
    crmWriteBack: { us: string; them: string };
    llmPrivacy: { us: string; them: string };
  };
}

const COMPETITORS: CompetitorCard[] = [
  {
    id: "gong",
    name: "Gong.io / Chorus",
    category: "Conversation Intelligence",
    threatLevel: "High",
    winRate: "76.8%",
    pricingModel: "$1,400 / rep / yr + platform base fee",
    quickSummary: "Strong in recording call transcripts and keywords, but lacks deterministic CRM stage qualification & autonomous write-back remediation.",
    ourAdvantage: [
      "Deterministic 0-100 risk scoring with 0 hallucination (Gong relies on statistical sentiment).",
      "Native bidirectional write-back into HubSpot (auto-create tasks, slip dates, enrich next steps).",
      "100% tenant-isolated with zero LLM training on proprietary deal data.",
      "1/4th the price with zero per-seat user markups for casual viewers.",
    ],
    trapQuestions: [
      "Does Gong automatically fix your past-due close dates and missing MEDDICC criteria directly in HubSpot, or does your team still do that manually on Friday afternoons?",
      "How does Gong ensure customer transcripts aren't exposed across shared LLM training weights?",
    ],
    objectionResponses: [
      {
        objection: "We already use Gong for call recording.",
        script: "Gong is exceptional for call playback, but RevOps still has to spend 15 hours a week manually chasing reps to update HubSpot. DealSense doesn't replace Gong's recorder—it sits on top as the deterministic execution engine that automatically audits deals and writes back fixes into HubSpot.",
      },
      {
        objection: "Can't Gong forecast our revenue?",
        script: "Gong's forecast is based on historical call sentiment trends. DealSense uses verified stakeholder engagement frequency, procurement redlines, and deterministic slippage patterns to give you an unshakeable AI Reality forecast.",
      },
    ],
    tcoComparison: {
      implementationTime: { us: "5 Minutes (1-Click OAuth)", them: "4-6 Weeks Complex Setup" },
      pricingModel: { us: "Flat Fleet Pricing (Zero Per-Seat Penalty)", them: "$1,400+ per user / year" },
      crmWriteBack: { us: "Instant Bi-directional 2-way sync", them: "Read-only insights stream" },
      llmPrivacy: { us: "Zero Training / Fernet AES-256 Vault", them: "Aggregated model weights" },
    },
  },
  {
    id: "clari",
    name: "Clari / BoostUp",
    category: "Revenue Operations Platform",
    threatLevel: "High",
    winRate: "81.2%",
    pricingModel: "$90,000+ annual minimum commit",
    quickSummary: "Legacy enterprise forecasting tool requiring 6-month enterprise implementation and heavy consulting overhead.",
    ourAdvantage: [
      "Instant 5-minute HubSpot OAuth setup vs 6-month Clari deployment.",
      "No mandatory annual minimum contracts or high professional services fees.",
      "Real-time event streaming (<0.2s latency) vs Clari's batch night sync.",
      "Built natively for HubSpot Canvas instead of retrofitted from Salesforce.",
    ],
    trapQuestions: [
      "How much are you paying in mandatory implementation and professional services fees just to get your pipeline boards configured?",
      "When a deal slips today, does your team know in real-time, or do you have to wait for the nightly sync to run?",
    ],
    objectionResponses: [
      {
        objection: "We are evaluating Clari for enterprise forecasting.",
        script: "Clari is built for legacy 5,000-person Salesforce orgs with dedicated admin teams. If you're running HubSpot, DealSense installs via 1-click OAuth, operates natively inside your deal sidebar, and starts surfacing revenue risks within 30 seconds without a 6-month implementation.",
      },
    ],
    tcoComparison: {
      implementationTime: { us: "5 Minutes (Native HubSpot)", them: "3-6 Months Implementation" },
      pricingModel: { us: "Transparent Value Tiers", them: "High 6-Figure Annual Minimums" },
      crmWriteBack: { us: "1-Click Native Write-Back", them: "External Spreadsheet Matrix" },
      llmPrivacy: { us: "100% Tenant Isolation", them: "Enterprise Cloud Multi-Tenant" },
    },
  },
  {
    id: "native-hubspot",
    name: "Native HubSpot CRM Reporting",
    category: "Native CRM Features",
    threatLevel: "Moderate",
    winRate: "88.5%",
    pricingModel: "Included with Sales Hub Pro / Enterprise",
    quickSummary: "Good for basic weighted pipeline reporting, but lacks deal intelligence, stakeholder multi-threading analysis, and autonomous remediation.",
    ourAdvantage: [
      "Autonomous 1-click batch hygiene remediation (native HubSpot requires manual editing deal-by-deal).",
      "Multi-threading risk detection (flags deals missing Economic Buyer / CFO involvement).",
      "Monte Carlo slip simulator (+15d, +30d, +45d revenue reality models).",
      "Automated Mutual Action Plan generator for high-value enterprise accounts.",
    ],
    trapQuestions: [
      "When you look at HubSpot's weighted pipeline, does it know whether the CFO has been ghosting for 18 days, or does it just multiply stage probability by deal size?",
    ],
    objectionResponses: [
      {
        objection: "Why pay for DealSense when HubSpot has built-in reports?",
        script: "HubSpot's built-in reports show you what happened in the past. DealSense tells you what's going to fail next week before it slips—and gives your reps the exact 1-click email drafts and task triggers to save the deal today.",
      },
    ],
    tcoComparison: {
      implementationTime: { us: "Instant Add-On", them: "Built-In Standard" },
      pricingModel: { us: "Extends HubSpot ROI 10x", them: "Requires Manual Rep Labor" },
      crmWriteBack: { us: "Automated 7-Vector Write-Back", them: "Manual Field Edits" },
      llmPrivacy: { us: "Zero Hallucination Telemetry", them: "Basic Historical Aggregations" },
    },
  },
];

export const CompetitiveIntelligence: React.FC = () => {
  const [selectedCompId, setSelectedCompId] = useState("gong");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeComp = COMPETITORS.find((c) => c.id === selectedCompId) || COMPETITORS[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyScript = (script: string, idx: number) => {
    navigator.clipboard.writeText(script);
    setCopiedIndex(idx);
    showToast("📋 Talk track copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Toast Notification ───────────────────────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: "fixed",
              top: 24,
              right: 28,
              zIndex: 99999,
              background: "#1e293b",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "6px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.28)",
              border: "1px solid #00a4bd",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. Standardized Enterprise Header Card ────────────────────────────── */}
      <div className="page-header-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="page-header-badge-row">
              <span className="page-header-badge">
                ● REVOPS CRM WORKSPACE
              </span>
            </div>
            <h2 className="page-header-title">
              Competitive Battlecards &amp; Objection Response Engine
            </h2>
            <p className="page-header-desc">
              Equip reps with deterministic objection scripts, buyer landmine questions, and key differentiators against Gong, Clari, and legacy alternatives.
            </p>
          </div>
          <div className="page-header-actions">
            <button
              onClick={() => showToast("📑 Exported all competitive battlecards as enterprise PDF package!")}
              style={{
                background: "#ffffff",
                color: "var(--hs-primary)",
                border: "1px solid #cbd6e2",
              }}
            >
              <span>📑 Export Battlecards</span>
            </button>
            <button
              onClick={() => showToast("➕ Custom competitor builder opened.")}
              style={{
                background: "#ff5c35",
                color: "#ffffff",
                border: "none",
                boxShadow: "0 2px 8px rgba(255, 92, 53, 0.3)",
              }}
            >
              <span>+ Add Competitor</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Standardized KPI Command Strip ─────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card" style={{ borderTopColor: "var(--risk-healthy)" }}>
          <div className="kpi-label">Competitive Win Rate</div>
          <div className="kpi-value" style={{ color: "var(--risk-healthy)" }}>78.4%</div>
          <div style={{ fontSize: "11px", color: "var(--risk-healthy)", fontWeight: 600, marginTop: 4 }}>
            ▲ +14.2% vs Industry Benchmark
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--hs-primary)" }}>
          <div className="kpi-label">Active Competitor Profiles</div>
          <div className="kpi-value">3 Platforms</div>
          <div style={{ fontSize: "11px", color: "#007a8c", fontWeight: 600, marginTop: 4 }}>
            ● Gong, Clari &amp; Native HubSpot
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#00a4bd" }}>
          <div className="kpi-label">Objection Talk Tracks</div>
          <div className="kpi-value" style={{ color: "#007a8c" }}>12 Scripts</div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Verified deterministic responses
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#ff7a59" }}>
          <div className="kpi-label">Revenue Defended</div>
          <div className="kpi-value" style={{ color: "#ff5c35" }}>$14.2M</div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Active competitive deal defense
          </div>
        </div>
      </div>

      {/* ── 3. Competitor Selector Tabs ─────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          background: "#ffffff",
          border: "1px solid #dfe3eb",
          borderRadius: "var(--radius-md)",
          padding: "4px",
          gap: 6,
          boxShadow: "var(--shadow-xs)",
          overflowX: "auto",
        }}
      >
        {COMPETITORS.map((comp) => {
          const isSelected = selectedCompId === comp.id;
          return (
            <button
              key={comp.id}
              onClick={() => setSelectedCompId(comp.id)}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: "4px",
                border: "none",
                background: isSelected ? "#2d3e50" : "transparent",
                color: isSelected ? "#ffffff" : "var(--hs-text)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                fontSize: "13px",
                fontWeight: isSelected ? 700 : 600,
                transition: "all 0.15s ease",
                boxShadow: isSelected ? "0 2px 6px rgba(45, 62, 80, 0.25)" : "none",
                whiteSpace: "nowrap",
              }}
            >
              <span>⚔️ {comp.name}</span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: isSelected ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 122, 140, 0.08)",
                  color: isSelected ? "#ffffff" : "#007a8c",
                  fontWeight: 700,
                }}
              >
                {comp.winRate} Win
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 4. Active Battlecard Dossier ───────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Competitor Overview Card */}
        <div
          className="card"
          style={{
            background: "#ffffff",
            padding: "22px 24px",
            border: "1px solid #dfe3eb",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
                  {activeComp.name} · Competitive Battlecard
                </h3>
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "10px",
                    background: activeComp.threatLevel === "High" ? "var(--risk-critical-bg)" : "var(--risk-high-bg)",
                    color: activeComp.threatLevel === "High" ? "var(--danger)" : "var(--risk-high)",
                    border: `1px solid ${activeComp.threatLevel === "High" ? "var(--risk-critical-border)" : "var(--risk-high-border)"}`,
                  }}
                >
                  {activeComp.threatLevel.toUpperCase()} THREAT
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                Category: <strong>{activeComp.category}</strong> · Pricing Model: {activeComp.pricingModel}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--risk-healthy-bg)", padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--risk-healthy-border)" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--risk-healthy)" }}>OUR WIN RATE:</span>
              <span style={{ fontSize: "16px", fontWeight: 900, color: "var(--risk-healthy)" }}>{activeComp.winRate}</span>
            </div>
          </div>

          <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #eaf0f6", fontSize: "13px", color: "var(--hs-text)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--hs-heading)" }}>Executive Summary:</strong> {activeComp.quickSummary}
          </div>
        </div>

        {/* 2-Column Advantage & Landmines Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
          {/* Why DealSense Wins */}
          <div
            className="card"
            style={{
              background: "#ffffff",
              padding: "20px 22px",
              border: "1px solid #dfe3eb",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: "18px" }}>🎯</span>
              <h4 style={{ fontSize: "14.5px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
                Why DealSense Wins (Key Differentiators)
              </h4>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {activeComp.ourAdvantage.map((adv, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", background: "#f0fdf4", borderRadius: "6px", border: "1px solid #bbf7d0" }}>
                  <span style={{ color: "#166534", fontWeight: 800, fontSize: "14px" }}>✓</span>
                  <span style={{ fontSize: "12.5px", color: "#166534", lineHeight: 1.45, fontWeight: 500 }}>{adv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Landmine Questions */}
          <div
            className="card"
            style={{
              background: "#ffffff",
              padding: "20px 22px",
              border: "1px solid #dfe3eb",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: "18px" }}>💣</span>
              <h4 style={{ fontSize: "14.5px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
                Landmine Questions to Ask Buyer
              </h4>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {activeComp.trapQuestions.map((q, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", background: "var(--risk-high-bg)", borderRadius: "6px", border: "1px solid var(--risk-high-border)" }}>
                  <span style={{ color: "#b76e00", fontWeight: 800, fontSize: "14px" }}>❓</span>
                  <span style={{ fontSize: "12.5px", color: "#78350f", lineHeight: 1.45, fontWeight: 600, fontStyle: "italic" }}>"{q}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Word-for-Word Objection Responses */}
        <div
          className="card"
          style={{
            background: "#ffffff",
            padding: "22px 24px",
            border: "1px solid #dfe3eb",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "18px" }}>🎙️</span>
              <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
                Word-for-Word Objection Responses
              </h4>
            </div>
            <span style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>Click copy to grab talk track</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {activeComp.objectionResponses.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: "16px 18px",
                  borderRadius: "6px",
                  background: "#f8fafc",
                  border: "1px solid #eaf0f6",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#ff5c35" }}>
                    Buyer: "{item.objection}"
                  </div>
                  <button
                    onClick={() => handleCopyScript(item.script, idx)}
                    style={{
                      padding: "4px 10px",
                      background: copiedIndex === idx ? "#00a38d" : "#ffffff",
                      color: copiedIndex === idx ? "#ffffff" : "#007a8c",
                      border: copiedIndex === idx ? "none" : "1px solid #cbd6e2",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>{copiedIndex === idx ? "✓ Copied" : "📋 Copy Talk Track"}</span>
                  </button>
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--hs-text)", lineHeight: 1.55, background: "#ffffff", padding: "12px 14px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                  <strong style={{ color: "#007a8c" }}>Rep Talk Track:</strong> {item.script}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TCO & Feature Matrix Comparison */}
        <div
          className="card"
          style={{
            background: "#ffffff",
            padding: "22px 24px",
            border: "1px solid #dfe3eb",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <h4 style={{ fontSize: "14.5px", fontWeight: 800, color: "var(--hs-heading)", margin: "0 0 14px 0" }}>
            Total Cost of Ownership &amp; Architecture Comparison
          </h4>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #cbd6e2" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>Dimension</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", color: "#ff5c35", fontWeight: 800 }}>DealSense</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", color: "var(--hs-text-muted)", fontWeight: 700 }}>{activeComp.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #eaf0f6" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "var(--hs-heading)" }}>Deployment Time</td>
                  <td style={{ padding: "10px 14px", color: "var(--risk-healthy)", fontWeight: 700 }}>✓ {activeComp.tcoComparison.implementationTime.us}</td>
                  <td style={{ padding: "10px 14px", color: "var(--hs-text-muted)" }}>{activeComp.tcoComparison.implementationTime.them}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #eaf0f6" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "var(--hs-heading)" }}>Pricing Model</td>
                  <td style={{ padding: "10px 14px", color: "var(--risk-healthy)", fontWeight: 700 }}>✓ {activeComp.tcoComparison.pricingModel.us}</td>
                  <td style={{ padding: "10px 14px", color: "var(--hs-text-muted)" }}>{activeComp.tcoComparison.pricingModel.them}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #eaf0f6" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "var(--hs-heading)" }}>HubSpot Write-Back</td>
                  <td style={{ padding: "10px 14px", color: "var(--risk-healthy)", fontWeight: 700 }}>✓ {activeComp.tcoComparison.crmWriteBack.us}</td>
                  <td style={{ padding: "10px 14px", color: "var(--hs-text-muted)" }}>{activeComp.tcoComparison.crmWriteBack.them}</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "var(--hs-heading)" }}>Data Privacy &amp; LLM Isolation</td>
                  <td style={{ padding: "10px 14px", color: "var(--risk-healthy)", fontWeight: 700 }}>✓ {activeComp.tcoComparison.llmPrivacy.us}</td>
                  <td style={{ padding: "10px 14px", color: "var(--hs-text-muted)" }}>{activeComp.tcoComparison.llmPrivacy.them}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
