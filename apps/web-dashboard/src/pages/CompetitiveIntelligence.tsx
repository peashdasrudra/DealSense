/**
 * DealSense Dashboard — Competitive Battlecards & Objection Killer Engine.
 * Gives sales reps instant battlecards, competitor trap questions, and objection scripts.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

interface CompetitorCard {
  id: string;
  name: string;
  category: string;
  threatLevel: "High" | "Moderate" | "Low";
  quickSummary: string;
  ourAdvantage: string[];
  trapQuestions: string[];
  objectionResponses: Array<{ objection: string; script: string }>;
}

const COMPETITORS: CompetitorCard[] = [
  {
    id: "gong",
    name: "Gong.io / Chorus",
    category: "Conversation Intelligence",
    threatLevel: "High",
    quickSummary: "Strong in recording call transcripts and keywords, but lacks deterministic CRM stage qualification & autonomous write-back remediation.",
    ourAdvantage: [
      "Deterministic 0-100 risk scoring with 0 hallucination (Gong relies on statistical sentiment).",
      "Native bidirectional write-back into HubSpot (auto-create tasks, slip dates, enrich next steps).",
      "100% tenant-isolated with zero LLM training on proprietary deal data.",
      "1/4th the price with zero per-seat user tax for casual viewers.",
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
  },
  {
    id: "clari",
    name: "Clari / BoostUp",
    category: "Revenue Operations Platform",
    threatLevel: "High",
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
  },
  {
    id: "native-hubspot",
    name: "Native HubSpot CRM Reporting",
    category: "Native CRM Features",
    threatLevel: "Moderate",
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
  },
];

export const CompetitiveIntelligence: React.FC = () => {
  const [selectedCompId, setSelectedCompId] = useState("gong");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const activeComp = COMPETITORS.find((c) => c.id === selectedCompId) || COMPETITORS[0];

  const handleCopyScript = (script: string, idx: number) => {
    navigator.clipboard.writeText(script);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div>
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
              <span style={{ fontSize: "11.5px", color: "#a5c2c4", fontWeight: 500 }}>Competitive Battlecards</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
              AI-Powered Competitive Intelligence
            </h2>
            <p style={{ fontSize: "13px", color: "#d9e8e8", margin: 0, maxWidth: 680, lineHeight: 1.5 }}>
              Equip your reps with real-time battlecards. Counter objections, highlight key differentiators, and track win rates against major competitors.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "var(--sp-4)", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {COMPETITORS.map((c) => (
            <button
              key={c.id}
              className={`btn btn-sm ${selectedCompId === c.id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSelectedCompId(c.id)}
            >
              ⚔️ {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Competitor Profile Card ───────────────────────────────────── */}
      <motion.div
        key={activeComp.id}
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "var(--sp-6)" }}
      >
        <div className="card-header">
          <div>
            <div className="card-title">{activeComp.name} · Competitive Battlecard</div>
            <div className="card-subtitle">{activeComp.category} · Threat Level: <strong>{activeComp.threatLevel}</strong></div>
          </div>
          <span className="badge" style={{ background: activeComp.threatLevel === "High" ? "var(--risk-critical-bg)" : "var(--risk-moderate-bg)", color: activeComp.threatLevel === "High" ? "var(--danger)" : "var(--warning)", fontWeight: 700 }}>
            {activeComp.threatLevel} Threat
          </span>
        </div>

        <div className="card-body">
          <div style={{ padding: "12px 14px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", marginBottom: 20 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--hs-text-muted)" }}>
              Executive Summary
            </div>
            <div style={{ fontSize: "13px", color: "var(--hs-text)", marginTop: 4, lineHeight: 1.5 }}>
              {activeComp.quickSummary}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
            {/* Our Advantages */}
            <div style={{ padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", background: "#ffffff" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--hs-primary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🎯</span> Why DealSense Wins
              </div>
              <ul style={{ paddingLeft: 18, fontSize: "12.5px", color: "var(--hs-text)", lineHeight: 1.6 }}>
                {activeComp.ourAdvantage.map((adv, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{adv}</li>
                ))}
              </ul>
            </div>

            {/* Trap Questions to Plant */}
            <div style={{ padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", background: "#ffffff" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#ff5c35", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span>💣</span> Landmine Questions to Ask Buyer
              </div>
              <ul style={{ paddingLeft: 18, fontSize: "12.5px", color: "var(--hs-text)", lineHeight: 1.6 }}>
                {activeComp.trapQuestions.map((q, i) => (
                  <li key={i} style={{ marginBottom: 6 }}><em>"{q}"</em></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Objection Handler Scripts */}
          <div>
            <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--hs-primary)", marginBottom: 12 }}>
              💬 Word-for-Word Objection Responses
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activeComp.objectionResponses.map((obj, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--hs-border-dark)",
                    background: "var(--hs-surface)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--danger)" }}>
                      Buyer: "{obj.objection}"
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "11px", padding: "2px 8px", flexShrink: 0 }}
                      onClick={() => handleCopyScript(obj.script, idx)}
                    >
                      {copiedIndex === idx ? "✓ Copied!" : "📋 Copy Talk Track"}
                    </button>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)", lineHeight: 1.5, background: "#ffffff", padding: "10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                    {obj.script}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
