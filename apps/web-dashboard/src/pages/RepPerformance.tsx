/**
 * DealSense Dashboard — Rep Performance & Velocity Coaching Hub.
 * Replaces manual rep inspection with AI-driven pipeline velocity, multi-threading adherence, and coaching dossiers.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ENTERPRISE_REPS, EnterpriseRep } from "../data/enterpriseData";

export const RepPerformance: React.FC = () => {
  const [reps] = useState<EnterpriseRep[]>(ENTERPRISE_REPS);
  const [selectedRep, setSelectedRep] = useState<EnterpriseRep | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const totalPipeline = reps.reduce((s, r) => s + r.pipelineValue, 0);
  const avgAttainment = Math.round(reps.reduce((s, r) => s + r.quotaAttainment, 0) / reps.length);
  const avgMultiThreading = Math.round(reps.reduce((s, r) => s + r.multiThreadingRate, 0) / reps.length);
  const avgCycle = Math.round(reps.reduce((s, r) => s + r.avgCycleDays, 0) / reps.length);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
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
              Enterprise Rep Performance &amp; AI Velocity Coaching
            </h2>
            <p className="page-header-desc">
              Benchmark individual AE velocity, stage aging bottlenecks, and multi-threading adherence across ${(totalPipeline / 1000000).toFixed(1)}M in active enterprise pipeline.
            </p>
          </div>
          <div className="page-header-actions">
            <button
              onClick={() => showToast("✓ Team Velocity Audit Exported to PDF")}
              className="btn btn-secondary"
              style={{
                background: "#ffffff",
                color: "var(--hs-text)",
                border: "1px solid var(--hs-border-dark)",
              }}
            >
              📑 Export Rep Audit
            </button>
            <button
              onClick={() => showToast("✓ AI 1-on-1 Coaching Agendas Generated & Synced with HubSpot")}
              className="btn btn-primary"
              style={{
                background: "#ff5c35",
                color: "#ffffff",
                border: "none",
                boxShadow: "0 2px 6px rgba(255, 92, 53, 0.25)",
              }}
            >
              ⚡ Schedule 1-on-1 Syncs
            </button>
          </div>
        </div>
      </div>

      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: "10px 16px", background: "rgba(0, 189, 165, 0.12)", border: "1px solid rgba(0, 189, 165, 0.3)", borderRadius: "var(--radius-sm)", color: "#007a70", fontSize: "12.5px", fontWeight: 700 }}
        >
          {toastMsg}
        </motion.div>
      )}

      {/* ── Team KPI Bar ─────────────────────────────────────────────── */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderTopColor: "var(--success)" }}>
          <div className="kpi-label">Team Quota Attainment</div>
          <div className="kpi-value">{avgAttainment}%</div>
          <div style={{ fontSize: "11px", color: "var(--success)", fontWeight: 600, marginTop: 4 }}>
            ▲ +14% vs prior quarter
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--hs-primary)" }}>
          <div className="kpi-label">Total Rep Pipeline</div>
          <div className="kpi-value">${(totalPipeline / 1000000).toFixed(1)}M</div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            {reps.reduce((s, r) => s + r.dealCount, 0)} Active Enterprise Deals
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#00a4bd" }}>
          <div className="kpi-label">Multi-Threading Adherence</div>
          <div className="kpi-value">{avgMultiThreading}%</div>
          <div style={{ fontSize: "11px", color: "#007a8c", fontWeight: 600, marginTop: 4 }}>
            ● Target: &gt;75% multi-threaded
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--warning)" }}>
          <div className="kpi-label">Average Sales Cycle</div>
          <div className="kpi-value">{avgCycle} Days</div>
          <div style={{ fontSize: "11px", color: "var(--success)", fontWeight: 600, marginTop: 4 }}>
            ▼ 8 days velocity acceleration
          </div>
        </div>
      </div>

      {/* ── Rep Scorecard Grid ────────────────────────────────────────── */}
      <div className="grid-2" style={{ marginBottom: "var(--sp-2)" }}>
        {reps.map((rep, idx) => (
          <motion.div
            key={rep.id}
            className="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            style={{ margin: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
          >
            <div>
              <div className="card-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255, 92, 53, 0.12)", color: "#ff5c35", fontWeight: 800, fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255, 92, 53, 0.3)" }}>
                    {rep.avatar}
                  </div>
                  <div>
                    <div className="card-title" style={{ fontSize: "15px", fontWeight: 800 }}>{rep.name}</div>
                    <div className="card-subtitle">{rep.role}</div>
                  </div>
                </div>
                <span
                  className="badge"
                  style={{
                    background: rep.quotaAttainment >= 100 ? "rgba(0, 189, 165, 0.1)" : "rgba(245, 194, 107, 0.15)",
                    color: rep.quotaAttainment >= 100 ? "#007a70" : "#b36b00",
                    border: `1px solid ${rep.quotaAttainment >= 100 ? "rgba(0, 189, 165, 0.3)" : "rgba(245, 194, 107, 0.3)"}`,
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                >
                  {rep.quotaAttainment}% Quota
                </span>
              </div>

              <div className="card-body">
                {/* Rep Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
                  <div style={{ padding: "10px", background: "var(--hs-surface-hover)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                    <div style={{ fontSize: "10px", color: "var(--hs-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Pipeline</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--hs-heading)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                      ${(rep.pipelineValue / 1000000).toFixed(2)}M
                    </div>
                  </div>

                  <div style={{ padding: "10px", background: "var(--hs-surface-hover)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                    <div style={{ fontSize: "10px", color: "var(--hs-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Health Index</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: rep.avgHealthScore < 60 ? "var(--danger)" : "var(--success)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                      {rep.avgHealthScore}/100
                    </div>
                  </div>

                  <div style={{ padding: "10px", background: "var(--hs-surface-hover)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                    <div style={{ fontSize: "10px", color: "var(--hs-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Multi-Thread %</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: rep.multiThreadingRate < 50 ? "var(--danger)" : "#007a70", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                      {rep.multiThreadingRate}%
                    </div>
                  </div>
                </div>

                {/* Coaching Insight */}
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--hs-surface-hover)",
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
              </div>
            </div>

            <div style={{ padding: "0 20px 18px" }}>
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
                background: "rgba(18, 69, 72, 0.45)",
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
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
                    1-on-1 Coaching Agenda: {selectedRep.name}
                  </h3>
                  <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                    {selectedRep.role} · Active Pipeline ${(selectedRep.pipelineValue / 1000000).toFixed(2)}M ({selectedRep.dealCount} Deals)
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
                <div style={{ padding: "14px", background: "var(--hs-surface-hover)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-primary)", textTransform: "uppercase", marginBottom: 6 }}>
                    Key Pipeline Risk Themes
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--hs-text)", lineHeight: 1.5 }}>
                    ▲ <strong>Primary Risk:</strong> {selectedRep.topRiskFactor}
                  </div>
                </div>

                <div style={{ padding: "14px", background: "rgba(0, 189, 165, 0.08)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(0, 189, 165, 0.25)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#007a70", textTransform: "uppercase", marginBottom: 6 }}>
                    Suggested 1-on-1 Discussion Plan
                  </div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)", lineHeight: 1.55 }}>
                    1. "What is our plan to engage the CFO/VP level on stalled contracts?"<br />
                    2. "How can sales leadership assist with procurement legal redlines this week?"<br />
                    3. "Let's review the DocuSign mutual action plan timeline for end-of-quarter commitments."
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
                    showToast(`✓ Coaching agenda exported & synced with HubSpot 1-on-1 notes for ${selectedRep.name}!`);
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
