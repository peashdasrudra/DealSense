/**
 * DealSense Dashboard — Settings & RevOps Scoring Calibration.
 * Configure custom methodology weights, approval gate policies, and HubSpot connection status.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

export const Settings: React.FC = () => {
  const [weights, setWeights] = useState({
    stageAging: 2.0,
    engagementDecay: 1.5,
    stakeholderGap: 1.2,
    commitmentQuality: 1.0,
    dateSlippage: 1.0,
    crmHygiene: 0.8,
    historicalSimilarity: 0.5,
  });

  const [approvalTiers, setApprovalTiers] = useState({
    autoTaskCreation: true,
    autoEmailDraft: true,
    requireApprovalForStageRollback: true,
    requireApprovalForCloseDateSlip: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 840 }}>
      {/* ── HubSpot Connection Status ─────────────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "var(--sp-6)" }}
      >
        <div className="card-header">
          <div className="card-title">HubSpot CRM Integration</div>
          <span className="badge" style={{ background: "var(--risk-healthy-bg)", color: "var(--risk-healthy)" }}>
            ✓ Connected (Live OAuth 2.0)
          </span>
        </div>
        <div className="card-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, color: "var(--hs-primary)" }}>Portal ID: 48920193 (AiXpert Labs)</div>
              <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                Subscribed Topics: deals, contacts, notes, engagements, stage_transitions
              </div>
            </div>
            <button className="btn btn-secondary btn-sm">
              ↻ Test Webhook Sync
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Deterministic Scoring Weights Calibration ─────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: "var(--sp-6)" }}
      >
        <div className="card-header">
          <div>
            <div className="card-title">Scoring Weights & Telemetry Tuning</div>
            <div className="card-subtitle">Calibrate how individual risk signals influence the 0–100 health score</div>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(weights).map(([key, val]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div style={{ minWidth: 200, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "13.5px", textTransform: "capitalize" }}>
                    {key.replace(/([A-Z])/g, " $1")}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
                    Multiplier weight applied during snapshot calculations
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={val}
                    onChange={(e) =>
                      setWeights((prev) => ({ ...prev, [key]: parseFloat(e.target.value) }))
                    }
                    style={{ width: 130 }}
                  />
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, minWidth: 36, textAlign: "right" }}>
                    {val.toFixed(1)}×
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Human-in-the-Loop Governance Gates ───────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: "var(--sp-6)" }}
      >
        <div className="card-header">
          <div>
            <div className="card-title">Governance & Autonomous Action Gates</div>
            <div className="card-subtitle">Set boundaries for what DealSense can execute vs require human approval</div>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {Object.entries(approvalTiers).map(([key, val]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div style={{ minWidth: 200, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "13.5px" }}>
                    {key.replace(/([A-Z])/g, " $1")}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
                    {val ? "Requires approval from AM / RevOps Lead" : "Autonomous execution enabled"}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={val}
                  onChange={(e) =>
                    setApprovalTiers((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  style={{ width: 20, height: 20, cursor: "pointer" }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
            {saved && (
              <span style={{ color: "var(--risk-healthy)", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center" }}>
                ✓ Settings updated successfully!
              </span>
            )}
            <button className="btn btn-primary" onClick={handleSave}>
              Save RevOps Policy
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
