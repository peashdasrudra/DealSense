/**
 * DealSense Dashboard — Rep Performance & Velocity Coaching Hub.
 * Replaces manual rep inspection with AI-driven pipeline velocity, multi-threading adherence, and coaching dossiers.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RepProfile {
  id: string;
  name: string;
  role: string;
  quotaAttainment: number;
  pipelineValue: number;
  dealCount: number;
  avgHealthScore: number;
  multiThreadingRate: number;
  slippageRate: number;
  avgCycleDays: number;
  topGaps: string[];
  coachingAction: string;
}

const SAMPLE_REPS: RepProfile[] = [
  {
    id: "rep-001",
    name: "Sarah Miller",
    role: "Senior Account Executive",
    quotaAttainment: 78,
    pipelineValue: 695000,
    dealCount: 5,
    avgHealthScore: 48,
    multiThreadingRate: 40,
    slippageRate: 45,
    avgCycleDays: 62,
    topGaps: ["Single-threaded deals (missing Economic Buyers)", "High stage aging in Proposal Sent"],
    coachingAction: "Conduct executive multi-threading session; align VP Sales on Orion Cloud deal.",
  },
  {
    id: "rep-002",
    name: "James Reynolds",
    role: "Enterprise Account Executive",
    quotaAttainment: 86,
    pipelineValue: 1110000,
    dealCount: 6,
    avgHealthScore: 56,
    multiThreadingRate: 67,
    slippageRate: 60,
    avgCycleDays: 54,
    topGaps: ["High close date slippage rate (2.4× avg)", "Legal / Procurement contract friction"],
    coachingAction: "Assist with standardizing FinServ compliance addendum on Quantum Security.",
  },
  {
    id: "rep-003",
    name: "Mike Torres",
    role: "Strategic Account Executive",
    quotaAttainment: 114,
    pipelineValue: 940000,
    dealCount: 5,
    avgHealthScore: 82,
    multiThreadingRate: 85,
    slippageRate: 10,
    avgCycleDays: 38,
    topGaps: ["CRM custom object documentation lag"],
    coachingAction: "Top velocity performer. Share multi-threading playbook with broader team.",
  },
  {
    id: "rep-004",
    name: "Lisa Chen",
    role: "Mid-Market Account Executive",
    quotaAttainment: 82,
    pipelineValue: 565000,
    dealCount: 4,
    avgHealthScore: 65,
    multiThreadingRate: 50,
    slippageRate: 25,
    avgCycleDays: 44,
    topGaps: ["Discovery to Qualification gate conversion", "Unquantified buyer ROI metrics"],
    coachingAction: "Review value engineering calculator during Thursday 1-on-1.",
  },
];

export const RepPerformance: React.FC = () => {
  const [reps] = useState<RepProfile[]>(SAMPLE_REPS);
  const [selectedRep, setSelectedRep] = useState<RepProfile | null>(null);

  return (
    <div>
      {/* ── Status Banner ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)" }}>
        <div style={{ fontSize: "13px", color: "var(--hs-text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--risk-healthy)", display: "inline-block" }} />
          <span>Rep Velocity & AI Pipeline Coaching Intelligence</span>
        </div>
        <span className="badge badge-outline">{reps.length} Reps Monitored</span>
      </div>

      {/* ── Team KPI Bar ─────────────────────────────────────────────── */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Team Quota Attainment</div>
          <div className="kpi-value">88%</div>
          <div style={{ fontSize: "11px", color: "var(--risk-healthy)", fontWeight: 600, marginTop: 4 }}>
            ▲ 12% vs prior quarter
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Average Sales Cycle</div>
          <div className="kpi-value">48 Days</div>
          <div style={{ fontSize: "11px", color: "var(--risk-healthy)", fontWeight: 600, marginTop: 4 }}>
            ▼ 6 days velocity acceleration
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Multi-Threading Adherence</div>
          <div className="kpi-value">61%</div>
          <div style={{ fontSize: "11px", color: "var(--warning)", fontWeight: 600, marginTop: 4 }}>
            Target: &gt;75% multi-threaded
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Stalled Deal Recovery Rate</div>
          <div className="kpi-value" style={{ color: "var(--risk-healthy)" }}>34%</div>
          <div style={{ fontSize: "11px", color: "var(--risk-healthy)", fontWeight: 600, marginTop: 4 }}>
            Recovered via AI early warning
          </div>
        </div>
      </div>

      {/* ── Rep Scorecard Grid ────────────────────────────────────────── */}
      <div className="grid-2" style={{ marginBottom: "var(--sp-6)" }}>
        {reps.map((rep, idx) => (
          <motion.div
            key={rep.id}
            className="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="card-header">
              <div>
                <div className="card-title" style={{ fontSize: "16px" }}>{rep.name}</div>
                <div className="card-subtitle">{rep.role}</div>
              </div>
              <span
                className="badge"
                style={{
                  background: rep.quotaAttainment >= 100 ? "var(--risk-healthy-bg)" : "var(--hs-surface)",
                  color: rep.quotaAttainment >= 100 ? "var(--risk-healthy)" : "var(--hs-primary)",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                {rep.quotaAttainment}% Quota
              </span>
            </div>

            <div className="card-body">
              {/* Rep Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                <div style={{ padding: "10px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                  <div style={{ fontSize: "10.5px", color: "var(--hs-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Pipeline</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--hs-primary)", marginTop: 2 }}>
                    ${(rep.pipelineValue / 1000).toFixed(0)}K
                  </div>
                </div>

                <div style={{ padding: "10px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                  <div style={{ fontSize: "10.5px", color: "var(--hs-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Health Index</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: rep.avgHealthScore < 50 ? "var(--danger)" : "var(--risk-healthy)", marginTop: 2 }}>
                    {rep.avgHealthScore}/100
                  </div>
                </div>

                <div style={{ padding: "10px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                  <div style={{ fontSize: "10.5px", color: "var(--hs-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Multi-Thread %</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: rep.multiThreadingRate < 50 ? "var(--warning)" : "var(--risk-healthy)", marginTop: 2 }}>
                    {rep.multiThreadingRate}%
                  </div>
                </div>
              </div>

              {/* Coaching Insight */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--hs-surface)",
                  border: "1px solid var(--hs-border-dark)",
                  marginBottom: 14,
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-primary)", textTransform: "uppercase", marginBottom: 4 }}>
                  💡 AI 1-on-1 Coaching Focus
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--hs-text)", lineHeight: 1.45 }}>
                  {rep.coachingAction}
                </div>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setSelectedRep(rep)}
              >
                📋 Open 1-on-1 Coaching Dossier
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── 1-on-1 Coaching Dossier Modal ─────────────────────────────── */}
      <AnimatePresence>
        {selectedRep && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRep(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(18, 69, 72, 0.4)",
                backdropFilter: "blur(4px)",
                zIndex: 200,
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: "600px",
                background: "#ffffff",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 210,
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--hs-primary)", margin: 0 }}>
                    1-on-1 Coaching Agenda: {selectedRep.name}
                  </h3>
                  <div style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>
                    {selectedRep.role} · Active Pipeline ${(selectedRep.pipelineValue / 1000).toFixed(0)}K
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedRep(null)}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                <div style={{ padding: "12px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-primary)", textTransform: "uppercase", marginBottom: 6 }}>
                    Key Pipeline Risk Themes
                  </div>
                  <ul style={{ paddingLeft: 18, fontSize: "13px", color: "var(--hs-text)", lineHeight: 1.6 }}>
                    {selectedRep.topGaps.map((gap, i) => (
                      <li key={i}>{gap}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: "12px", background: "var(--risk-healthy-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--risk-healthy-border)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--risk-healthy)", textTransform: "uppercase", marginBottom: 4 }}>
                    Suggested Discussion Questions
                  </div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)", lineHeight: 1.5 }}>
                    1. "What is our plan to engage the CFO on the top 2 stalled opportunities?"<br />
                    2. "How can sales leadership assist with procurement terms this week?"<br />
                    3. "Let's review the mutual action plan timeline for current month commits."
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedRep(null)}>
                  Close
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    alert(`✓ Coaching agenda exported & synced with HubSpot 1-on-1 notes for ${selectedRep.name}!`);
                    setSelectedRep(null);
                  }}
                >
                  Export to HubSpot 1-on-1
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
