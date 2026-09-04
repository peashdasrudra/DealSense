/**
 * DealSense — Executive Pipeline Risk & Revenue Recovery Dossier Modal.
 * High-converting lead magnet generating board-ready pipeline leakage audits.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ExecutiveAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  deals?: any[];
  portalId?: string;
  portalName?: string;
}



export const HubSpotNativeExecutiveAuditModal: React.FC<ExecutiveAuditModalProps> = ({
  isOpen,
  onClose,
  deals = [],
  portalId = "48920193",
  portalName = "HubAiLab Production Fleet",
}) => {
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  if (!isOpen) return null;

  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const atRiskDeals = deals.filter((d) => ["Critical", "High", "critical", "high"].includes(d.band));
  const atRiskValue = atRiskDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const avgScore = deals.length > 0 ? Math.round(deals.reduce((sum, d) => sum + d.score, 0) / deals.length) : 58;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9990,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(18, 69, 72, 0.65)",
          backdropFilter: "blur(6px)",
          padding: "16px",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 12 }}
          style={{
            width: "100%",
            maxWidth: "760px",
            maxHeight: "92vh",
            overflowY: "auto",
            background: "#ffffff",
            borderRadius: "14px",
            boxShadow: "0 28px 72px -15px rgba(9, 33, 36, 0.4)",
            border: "1px solid #cbd6e2",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: "20px 28px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
              borderTopLeftRadius: "14px",
              borderTopRightRadius: "14px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span
                  style={{
                    background: "rgba(255, 92, 53, 0.12)",
                    color: "#ff5c35",
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Confidential Executive Audit Brief
                </span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  HubSpot Portal #{portalId} · {portalName}
                </span>
              </div>
              <h1 style={{ fontSize: "21px", fontWeight: 900, color: "#092124", margin: 0, letterSpacing: "-0.02em" }}>
                Pipeline Revenue Leakage &amp; Slippage Dossier
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={handlePrint}
                title="Print or Save PDF Brief"
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #cbd6e2",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#33475b",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                🖨️ PDF / Print
              </button>
              <button
                onClick={onClose}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "15px",
                  color: "#64748b",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Audit Body */}
          <div style={{ padding: "28px" }}>
            {/* Top 3 High-Impact Macro Metrics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "14px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 92, 53, 0.05)",
                  border: "1px solid rgba(255, 92, 53, 0.2)",
                  borderRadius: "10px",
                  padding: "16px",
                  borderLeft: "4px solid #ff5c35",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#ff5c35", textTransform: "uppercase" }}>
                  Identified At-Risk Capital
                </div>
                <div style={{ fontSize: "26px", fontWeight: 900, color: "#092124", margin: "4px 0" }}>
                  ${(atRiskValue / 1000).toFixed(0)}K
                </div>
                <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                  Across <strong>{atRiskDeals.length} stalled/slipping deals</strong>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(0, 164, 189, 0.05)",
                  border: "1px solid rgba(0, 164, 189, 0.2)",
                  borderRadius: "10px",
                  padding: "16px",
                  borderLeft: "4px solid #00a4bd",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#00a4bd", textTransform: "uppercase" }}>
                  Total Pipeline Audited
                </div>
                <div style={{ fontSize: "26px", fontWeight: 900, color: "#092124", margin: "4px 0" }}>
                  ${(totalValue / 1000000).toFixed(2)}M
                </div>
                <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                  {deals.length} active opportunities tracked
                </div>
              </div>

              <div
                style={{
                  background: "rgba(18, 69, 72, 0.05)",
                  border: "1px solid rgba(18, 69, 72, 0.2)",
                  borderRadius: "10px",
                  padding: "16px",
                  borderLeft: "4px solid #124548",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#124548", textTransform: "uppercase" }}>
                  Estimated Quarterly Leakage
                </div>
                <div style={{ fontSize: "26px", fontWeight: 900, color: "#d9534f", margin: "4px 0" }}>
                  -$380K – -$650K
                </div>
                <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                  Average Portfolio Score: <strong>{avgScore}/100</strong>
                </div>
              </div>
            </div>

            {/* Root-Cause Breakdown Section */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#092124", marginBottom: "12px" }}>
                Primary Vectors of Pipeline Rot &amp; Slippage
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: "18px" }}>🛑</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#092124" }}>
                        Economic Buyer Inaction &amp; Ghosting (&gt;14 Days)
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        Deals with zero executive engagement in late pipeline stages.
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#d9534f" }}>3 Deals · $525K</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Orion Cloud, Quantum Security, Apex CRM</div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px 16px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: "18px" }}>⏳</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#092124" }}>
                        Stage Velocity Decay (&gt;2.5x Median Dwell Time)
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        Deals stagnant in Proposal or Qualification without forward movement.
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#d9534f" }}>4 Deals · $680K</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Horizon Data, Nebula Analytics, Titan ERP</div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px 16px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: "18px" }}>⚠️</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#092124" }}>
                        Chronic Close Date Push (Pushed &ge; 2 Times)
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        Deals with artificial date extensions masking uncommitted champions.
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#d9534f" }}>2 Deals · $405K</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Atlas Data Warehouse, Pulse Infra</div>
                  </div>
                </div>
              </div>
            </div>

            {/* High-Ticket Actionable Conversion Banners */}
            <div
              style={{
                background: "linear-gradient(135deg, #092124 0%, #0d3135 100%)",
                borderRadius: "12px",
                padding: "22px 24px",
                color: "#33475b",
                boxShadow: "0 12px 28px rgba(9, 33, 36, 0.25)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    background: "#ff5c35",
                    color: "#33475b",
                    fontSize: "10.5px",
                    fontWeight: 800,
                    padding: "2px 7px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  RECOMMENDED REMEDIATION
                </span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                  Lead RevOps Architect Execution
                </span>
              </div>

              <h4 style={{ fontSize: "17px", fontWeight: 800, color: "#33475b", margin: "0 0 8px" }}>
                Unstick Your ${(atRiskValue / 1000).toFixed(0)}K In Stalled Revenue Before End of Quarter
              </h4>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", margin: "0 0 16px", lineHeight: 1.55 }}>
                Do not let high-probability deals slip away in silence. Book a hands-on risk triage session with Lead Architect <strong>Peash Das Rudra</strong> to pinpoint root causes, arm reps with MEDDICC objection playbooks, and automate executive alignment.
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  onClick={() => alert("Syncing execution...")}
                  style={{
                    padding: "11px 20px",
                    background: "#ff5c35",
                    color: "#33475b",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(255, 92, 53, 0.4)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>⚡ Book $99 Emergency Triage Pilot</span>
                </button>

                <button
                  onClick={() => alert("Syncing execution...")}
                  style={{
                    padding: "11px 20px",
                    background: "#e5f5f8",
                    border: "1px solid #00a4bd",
                    color: "#00a4bd",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>🛡️ Retainer Partnership ($2,500/mo)</span>
                </button>
              </div>

              <div style={{ marginTop: 12, fontSize: "11.5px", color: "#516f90" }}>
                ✓ Find $25K Or It's Free Guarantee · 48-Hour Execution SLA · 100% Confidential
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      
       setIsUpgradeOpen(false)} featureName="Automated Remediation & Sync" />
    </>
  );
};
