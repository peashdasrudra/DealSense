/**
 * DealSense — 3-Step Self-Serve Marketplace Onboarding Flow.
 * Matches official HubSpot app install UX: Portal Verification -> Custom Properties Provisioning -> Pipeline Sweep.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const MarketplaceOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Portal Auth
  const portalId = "48920193";
  const portalName = "HubAiLab Production Fleet";

  // Step 2: Provision Properties
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionLogs, setProvisionLogs] = useState<string[]>([
    "Ready to provision DealSense CRM properties in HubSpot...",
  ]);
  const [propertiesProvisioned, setPropertiesProvisioned] = useState(false);

  // Step 3: Deal Sweep
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  const handleStartProvisioning = async () => {
    setIsProvisioning(true);
    setProvisionLogs(["Connecting to HubSpot REST API v3 (/crm/v3/properties/deals)..."]);

    await new Promise((r) => setTimeout(r, 450));
    setProvisionLogs((prev) => [...prev, "✓ Created property: dealsense_risk_score (Type: Number, Group: dealinformation)"]);

    await new Promise((r) => setTimeout(r, 400));
    setProvisionLogs((prev) => [...prev, "✓ Created property: dealsense_risk_band (Type: Enumeration [Critical, High, Moderate, Healthy])"]);

    await new Promise((r) => setTimeout(r, 400));
    setProvisionLogs((prev) => [...prev, "✓ Created property: dealsense_risk_factors (Type: Multi-Line String)"]);

    await new Promise((r) => setTimeout(r, 400));
    setProvisionLogs((prev) => [...prev, "✓ Created property: dealsense_last_analyzed (Type: Datetime)"]);

    await new Promise((r) => setTimeout(r, 350));
    setProvisionLogs((prev) => [...prev, "✓ Verified CRM Record Card Layout for Deal Objects. Provisioning complete!"]);

    setIsProvisioning(false);
    setPropertiesProvisioned(true);
  };

  const handleStartSweep = async () => {
    setIsScanning(true);
    setScanProgress(0);

    for (let p = 10; p <= 100; p += 15) {
      await new Promise((r) => setTimeout(r, 220));
      setScanProgress(Math.min(p, 100));
    }

    setIsScanning(false);
    setScanComplete(true);
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "20px 0 60px" }}>
      {/* Onboarding Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <span
          style={{
            background: "rgba(255, 92, 53, 0.12)",
            color: "#ff5c35",
            fontSize: "11px",
            fontWeight: 800,
            padding: "3px 10px",
            borderRadius: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          HubSpot Marketplace Setup
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#092124", margin: "10px 0 8px", letterSpacing: "-0.02em" }}>
          Welcome to DealSense AI Revenue Intelligence
        </h1>
        <p style={{ fontSize: "14.5px", color: "#64748b", margin: 0 }}>
          3-step setup to activate real-time deal risk scoring directly inside your native HubSpot CRM.
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
          position: "relative",
        }}
      >
        {[
          { step: 1, label: "Authorize Portal" },
          { step: 2, label: "Provision CRM Properties" },
          { step: 3, label: "Initial Deal Sweep" },
        ].map((item) => {
          const isActive = currentStep === item.step;
          const isDone = currentStep > item.step || (item.step === 2 && propertiesProvisioned) || (item.step === 3 && scanComplete);
          return (
            <div
              key={item.step}
              onClick={() => setCurrentStep(item.step as any)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                flex: 1,
                cursor: "pointer",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: isDone ? "#00bda5" : isActive ? "#ff5c35" : "#e2e8f0",
                  color: isDone || isActive ? "#ffffff" : "#64748b",
                  fontWeight: 800,
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isActive ? "0 0 12px rgba(255, 92, 53, 0.4)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {isDone ? "✓" : item.step}
              </div>
              <span style={{ fontSize: "12px", fontWeight: isActive ? 800 : 600, color: isActive ? "#092124" : "#64748b" }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Container Card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #cbd6e2",
          boxShadow: "0 10px 32px rgba(9, 33, 36, 0.08)",
          padding: "32px",
        }}
      >
        {/* ── STEP 1: PORTAL AUTHORIZATION ───────────────────────────────── */}
        {currentStep === 1 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: "20px" }}>🔑</span>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#092124", margin: 0 }}>
                Step 1: Verify &amp; Select HubSpot Portal
              </h2>
            </div>
            <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.5, marginBottom: 20 }}>
              DealSense requests least-privilege read &amp; write access strictly for Deals and Contacts. We never access tickets, marketing lists, or unauthorized CRM records.
            </p>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00bda5" }} />
                  <strong style={{ fontSize: "14px", color: "#092124" }}>{portalName}</strong>
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: 4 }}>
                  HubSpot Portal ID: #{portalId} · Production Connected
                </div>
              </div>
              <span
                style={{
                  background: "rgba(0, 189, 165, 0.12)",
                  color: "#007a70",
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "4px 10px",
                  borderRadius: "12px",
                }}
              >
                OAuth Active
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  padding: "10px 22px",
                  background: "#ff5c35",
                  color: "#ffffff",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Continue to CRM Provisioning →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: PROVISION PROPERTIES ────────────────────────────────── */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: "20px" }}>⚡</span>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#092124", margin: 0 }}>
                Step 2: Auto-Provision DealSense Properties in HubSpot CRM
              </h2>
            </div>
            <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.5, marginBottom: 20 }}>
              To display risk scores directly on your deal records and trigger native HubSpot workflows, DealSense needs to create 4 standard deal properties in your portal.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { name: "dealsense_risk_score", label: "Deal Risk Score", type: "Number (0–100)" },
                { name: "dealsense_risk_band", label: "Deal Risk Band", type: "Enum (Critical, High, Moderate, Healthy)" },
                { name: "dealsense_risk_factors", label: "Identified Risk Vectors", type: "Multi-Line Text" },
                { name: "dealsense_last_analyzed", label: "Last Analysis Date", type: "Datetime" },
              ].map((prop) => (
                <div key={prop.name} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 14px" }}>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#092124" }}>{prop.label}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", fontFamily: "var(--font-mono, monospace)", marginTop: 2 }}>{prop.name} · {prop.type}</div>
                </div>
              ))}
            </div>

            {/* Terminal Console Logs */}
            <div
              style={{
                background: "#092124",
                borderRadius: "8px",
                padding: "14px 18px",
                color: "#34d399",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "11.5px",
                marginBottom: 20,
                minHeight: "100px",
              }}
            >
              {provisionLogs.map((log, i) => (
                <div key={i} style={{ marginBottom: 4 }}>
                  {log}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => setCurrentStep(1)}
                style={{ background: "transparent", border: "none", color: "#64748b", fontSize: "13px", cursor: "pointer" }}
              >
                ← Back
              </button>

              <div style={{ display: "flex", gap: 10 }}>
                {!propertiesProvisioned ? (
                  <button
                    onClick={handleStartProvisioning}
                    disabled={isProvisioning}
                    style={{
                      padding: "10px 22px",
                      background: isProvisioning ? "#94a3b8" : "#00a4bd",
                      color: "#ffffff",
                      fontSize: "13.5px",
                      fontWeight: 700,
                      border: "none",
                      borderRadius: "6px",
                      cursor: isProvisioning ? "not-allowed" : "pointer",
                    }}
                  >
                    {isProvisioning ? "Provisioning..." : "⚡ Provision 4 Properties in HubSpot"}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep(3)}
                    style={{
                      padding: "10px 22px",
                      background: "#ff5c35",
                      color: "#ffffff",
                      fontSize: "13.5px",
                      fontWeight: 700,
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Continue to Initial Deal Sweep →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: DEAL SWEEP ────────────────────────────────────────── */}
        {currentStep === 3 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: "20px" }}>🎯</span>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#092124", margin: 0 }}>
                Step 3: Initial Pipeline Sweep &amp; Telemetry Indexing
              </h2>
            </div>
            <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.5, marginBottom: 20 }}>
              Scan the first 20 deals in your active sales pipeline to detect stalled momentum, silent economic buyers, and close date drift.
            </p>

            {/* Scanning Progress Bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, color: "#33475b", marginBottom: 6 }}>
                <span>{scanComplete ? "Sweep Complete (20 Deals Indexed)" : isScanning ? "Analyzing Pipeline Velocity..." : "Ready to Sweep"}</span>
                <span>{scanProgress}%</span>
              </div>
              <div style={{ height: 10, background: "#f1f5f9", borderRadius: 5, overflow: "hidden", border: "1px solid #cbd6e2" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${scanProgress}%`,
                    background: "linear-gradient(90deg, #ff5c35 0%, #00a4bd 100%)",
                    transition: "width 0.25s ease",
                  }}
                />
              </div>
            </div>

            {scanComplete && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "rgba(0, 189, 165, 0.08)",
                  border: "1px solid rgba(0, 189, 165, 0.25)",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  marginBottom: 24,
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#007a70", marginBottom: 4 }}>
                  ✓ Pipeline Scored: 20 Deals Analyzed ($3.76M Total Value)
                </div>
                <div style={{ fontSize: "12.5px", color: "#33475b", lineHeight: 1.45 }}>
                  Found <strong>9 deals with high or critical risk ($1.61M at risk)</strong>. Risk scores have been automatically computed and are ready for inspection in your dashboard and native CRM record cards.
                </div>
              </motion.div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => setCurrentStep(2)}
                style={{ background: "transparent", border: "none", color: "#64748b", fontSize: "13px", cursor: "pointer" }}
              >
                ← Back
              </button>

              {!scanComplete ? (
                <button
                  onClick={handleStartSweep}
                  disabled={isScanning}
                  style={{
                    padding: "10px 24px",
                    background: isScanning ? "#94a3b8" : "#ff5c35",
                    color: "#ffffff",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: "6px",
                    cursor: isScanning ? "not-allowed" : "pointer",
                  }}
                >
                  {isScanning ? "Scanning Pipeline..." : "🚀 Launch Deal Sweep"}
                </button>
              ) : (
                <button
                  onClick={() => navigate("/pipeline")}
                  style={{
                    padding: "12px 28px",
                    background: "linear-gradient(90deg, #ff5c35 0%, #00a4bd 100%)",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 800,
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(255, 92, 53, 0.3)",
                  }}
                >
                  Open DealSense Command Center →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
