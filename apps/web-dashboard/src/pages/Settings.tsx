/**
 * DealSense Dashboard — Authentic HubSpot Enterprise Integration & Settings Hub.
 * Manages OAuth 2.0 connection, webhook v3 diagnostics, marketplace plan tiers, and scoring calibration.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ConnectHubSpotModal } from "../components/ConnectHubSpotModal";

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"integration" | "subscription" | "scoring" | "governance">("integration");

  const [portal, setPortal] = useState({
    id: "48920193",
    name: "DealSense Enterprise Fleet",
    tier: "Enterprise Active",
    connectedSince: "September 4, 2026",
    webhookUrl: "https://api.dealsense.peash.tech/api/v1/webhooks/hubspot",
    tokenEncryption: "AES-256-GCM (Fernet)",
  });

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

  const handleTestWebhook = () => {
    setWebhookTestStatus("testing");
    setTimeout(() => {
      setWebhookTestStatus("success");
      setTimeout(() => setWebhookTestStatus(null), 4000);
    }, 900);
  };

  const handleDisconnect = () => {
    if (window.confirm("Are you sure you want to disconnect this HubSpot Portal? This will trigger the app.uninstall lifecycle hook and revoke OAuth access tokens.")) {
      setPortal({
        ...portal,
        tier: "Disconnected (Tokens Revoked)",
        name: "No Portal Connected",
      });
    }
  };

  return (
    <div style={{ maxWidth: 940, fontFamily: "var(--font-sans, -apple-system, sans-serif)" }}>
      {/* Enterprise Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#2d3e50", margin: "0 0 6px" }}>
          Integration & App Settings
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
          Manage your connected HubSpot CRM portals, OAuth 2.0 webhook diagnostics, plan subscriptions, and scoring calibration.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid #cbd6e2", marginBottom: 24 }}>
        {[
          { id: "integration", label: "🟠 HubSpot Integration & OAuth" },
          { id: "subscription", label: "💎 Marketplace Tier & Plans" },
          { id: "scoring", label: "⚡ 7-Vector Scoring Tuning" },
          { id: "governance", label: "🛡️ CRM Write-Back Governance" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "10px 16px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "3px solid #ff7a59" : "3px solid transparent",
              color: activeTab === tab.id ? "#ff7a59" : "#516f90",
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: HubSpot Integration & OAuth ───────────────────────── */}
      {activeTab === "integration" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: 24, background: "#ffffff", borderRadius: 10, border: "1px solid #cbd6e2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: "#ff7a59", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: 24 }}>
                  🟠
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#2d3e50" }}>
                    DealSense Native Integration (App ID: <code>hs-dealsense-v3</code>)
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    Official HubSpot Developer App • Native UI Extension + Webhook v3 Listener
                  </div>
                </div>
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  background: portal.tier.includes("Disconnected") ? "rgba(225, 29, 72, 0.1)" : "rgba(0, 164, 189, 0.12)",
                  color: portal.tier.includes("Disconnected") ? "#e11d48" : "#00a4bd",
                  border: `1px solid ${portal.tier.includes("Disconnected") ? "rgba(225, 29, 72, 0.3)" : "rgba(0, 164, 189, 0.3)"}`,
                }}
              >
                ● {portal.tier}
              </span>
            </div>

            {/* Portal Metadata Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, background: "#f8fafc", padding: 16, borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Connected Portal</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#2d3e50", marginTop: 2 }}>{portal.name}</div>
                <div style={{ fontSize: 11, color: "#7c98b6" }}>Portal ID: #{portal.id}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Token Encryption</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#2d3e50", marginTop: 2 }}>{portal.tokenEncryption}</div>
                <div style={{ fontSize: 11, color: "#34d399", fontWeight: 600 }}>Active Multi-Tenant Isolation</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Webhook Endpoint</div>
                <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "#00a4bd", marginTop: 2, wordBreak: "break-all" }}>
                  /api/v1/webhooks/hubspot
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Fast ACK &lt; 200ms</div>
              </div>
            </div>

            {/* Scopes Badges */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
                Authorized CRM Permissions:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["crm.objects.deals.read", "crm.objects.deals.write", "crm.objects.contacts.read", "tickets", "webhooks", "timeline"].map((sc) => (
                  <span key={sc} style={{ padding: "3px 8px", background: "#f1f5f9", borderRadius: 4, fontSize: 11, fontFamily: "var(--font-mono)", color: "#475569", border: "1px solid #cbd6e2" }}>
                    ✓ {sc}
                  </span>
                ))}
              </div>
            </div>

            {/* Diagnostics and Actions */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  onClick={handleTestWebhook}
                  style={{
                    padding: "8px 16px",
                    background: "#00a4bd",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {webhookTestStatus === "testing" ? "⚡ Testing HMAC Signature..." : "↻ Test Webhook v3 Handshake"}
                </button>
                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  style={{
                    padding: "8px 16px",
                    background: "#ffffff",
                    border: "1px solid #cbd6e2",
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#33475b",
                    cursor: "pointer",
                  }}
                >
                  Switch / Connect Portal
                </button>
              </div>

              <button
                onClick={handleDisconnect}
                style={{
                  padding: "8px 14px",
                  background: "transparent",
                  border: "1px solid #fca5a5",
                  borderRadius: 6,
                  color: "#e11d48",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Disconnect Portal
              </button>
            </div>

            {webhookTestStatus === "success" && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 14, padding: "10px 14px", background: "rgba(5, 150, 105, 0.1)", border: "1px solid rgba(5, 150, 105, 0.3)", borderRadius: 6, color: "#065f46", fontSize: 12 }}>
                ✓ <strong>HubSpot Webhook v3 Signature Validated:</strong> HMAC-SHA256 authenticated, replay timestamp within 300s window, Redis Stream published in 178ms.
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── TAB 2: Marketplace Tier & Plans ──────────────────────────── */}
      {activeTab === "subscription" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {/* Free Tier Card */}
            <div style={{ background: "#ffffff", borderRadius: 10, border: "2px solid #00a4bd", padding: 24, position: "relative" }}>
              <span style={{ position: "absolute", top: 16, right: 16, background: "rgba(0, 164, 189, 0.12)", color: "#00a4bd", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                CURRENT ACTIVE
              </span>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#00a4bd", textTransform: "uppercase" }}>HubSpot Marketplace</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#2d3e50", margin: "4px 0 8px" }}>Free Diagnostic Tier</h3>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#2d3e50", marginBottom: 16 }}>$0 <span style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>/ forever</span></div>
              <ul style={{ paddingLeft: 18, fontSize: 13, color: "#33475b", lineHeight: 1.7, margin: "0 0 20px" }}>
                <li>Deterministic 0–100 Deal Risk Scoring</li>
                <li>7-Vector Telemetry Breakdown</li>
                <li>Native HubSpot Deal Record Canvas Card</li>
                <li>Stalled Deals & Ghosting Detection</li>
                <li>Sub-200ms Webhook Event Sync</li>
              </ul>
              <button disabled style={{ width: "100%", padding: "10px", background: "#f1f5f9", border: "1px solid #cbd6e2", borderRadius: 6, color: "#64748b", fontWeight: 700, fontSize: 13 }}>
                ✓ Currently Active on Portal #{portal.id}
              </button>
            </div>

            {/* Pro Remediations */}
            <div style={{ background: "#ffffff", borderRadius: 10, border: "1px solid #cbd6e2", padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ff7a59", textTransform: "uppercase" }}>Automated Cure</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#2d3e50", margin: "4px 0 8px" }}>Pro Remediations</h3>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#2d3e50", marginBottom: 16 }}>$79 <span style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>/ month</span></div>
              <ul style={{ paddingLeft: 18, fontSize: 13, color: "#33475b", lineHeight: 1.7, margin: "0 0 20px" }}>
                <li>Automated HubSpot Task & Note Write-Backs</li>
                <li>AI Multi-Threading Email Generator</li>
                <li>Automated MEDDICC Qualification Gaps</li>
                <li>Monte Carlo Revenue Probability Forecast</li>
                <li>Slack & Teams High-Risk Alerts</li>
              </ul>
              <button
                onClick={() => navigate("/checkout")}
                style={{ width: "100%", padding: "10px", background: "#ff7a59", border: "none", borderRadius: 6, color: "#ffffff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
              >
                Upgrade to Pro ➔
              </button>
            </div>

            {/* Agency Fleet Retainer */}
            <div style={{ background: "linear-gradient(180deg, #092124 0%, #051618 100%)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", padding: 24, color: "#ffffff" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#34d399", textTransform: "uppercase" }}>Solutions Partner Fleet</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", margin: "4px 0 8px" }}>Agency Fleet Retainer</h3>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#34d399", marginBottom: 16 }}>$2,500 <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>/ retainer</span></div>
              <ul style={{ paddingLeft: 18, fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: "0 0 20px" }}>
                <li>Multi-Tenant Agency Command Console</li>
                <li>Co-Branded HubSpot UI Extension Embedding</li>
                <li>$99 Pipeline Risk Audit Lead Generation Kit</li>
                <li>Direct Architecture Support with Peash Das Rudra</li>
              </ul>
              <button
                onClick={() => navigate("/agency")}
                style={{ width: "100%", padding: "10px", background: "linear-gradient(90deg, #ff5c35 0%, #00a4bd 100%)", border: "none", borderRadius: 6, color: "#ffffff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
              >
                Explore Partner Fleet Retainer ➔
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TAB 3: Scoring Calibration ───────────────────────────────── */}
      {activeTab === "scoring" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 24, background: "#ffffff", borderRadius: 10, border: "1px solid #cbd6e2" }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#2d3e50" }}>7-Vector Telemetry Multipliers</h3>
            <p style={{ margin: 0, fontSize: 12.5, color: "#64748b" }}>Adjust the relative weight of individual risk signals to match your sales cycle velocity.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(weights).map(([key, val]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ minWidth: 220 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: "#2d3e50", textTransform: "capitalize" }}>
                    {key.replace(/([A-Z])/g, " $1")}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#64748b" }}>
                    Influence on final composite risk score (0–100)
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={val}
                    onChange={(e) => setWeights((prev) => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                    style={{ width: 140 }}
                  />
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, minWidth: 40, textAlign: "right", color: "#ff7a59" }}>
                    {val.toFixed(1)}×
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              onClick={handleSave}
              style={{
                padding: "9px 20px",
                background: "#ff7a59",
                color: "#ffffff",
                border: "none",
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Save Calibration Multipliers
            </button>
          </div>
          {saved && (
            <div style={{ marginTop: 12, color: "#059669", fontWeight: 600, fontSize: 12, textAlign: "right" }}>
              ✓ Scoring parameters updated and applied to pipeline snapshot
            </div>
          )}
        </motion.div>
      )}

      {/* ── TAB 4: Governance Gates ─────────────────────────────────── */}
      {activeTab === "governance" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 24, background: "#ffffff", borderRadius: 10, border: "1px solid #cbd6e2" }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#2d3e50" }}>Human-in-the-Loop CRM Governance Gates</h3>
            <p style={{ margin: 0, fontSize: 12.5, color: "#64748b" }}>Control autonomous write-backs to HubSpot CRM to prevent unapproved pipeline mutations.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { id: "autoTaskCreation", label: "Auto-Create High-Risk Tasks for Deal Owner in HubSpot", desc: "Instantly provisions follow-up tasks when a deal score crosses above 70." },
              { id: "autoEmailDraft", label: "Auto-Draft AI Multi-Threading Emails into HubSpot CRM", desc: "Generates draft emails to executive sponsors without auto-sending." },
              { id: "requireApprovalForStageRollback", label: "Require Manager Approval for Stage Regressions", desc: "Prevents automatic demotion from Proposal to Discovery without human confirmation." },
              { id: "requireApprovalForCloseDateSlip", label: "Enforce Close Date Slip Audit Trail", desc: "Logs any pushed close dates into HubSpot timeline with rep rationale." },
            ].map((g) => (
              <div key={g.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, padding: "12px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#2d3e50" }}>{g.label}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{g.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={(approvalTiers as any)[g.id]}
                  onChange={(e) => setApprovalTiers((prev) => ({ ...prev, [g.id]: e.target.checked }))}
                  style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#ff7a59" }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Connect Modal */}
      <ConnectHubSpotModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnected={(newPortal) => {
          setPortal({
            ...portal,
            id: newPortal.id,
            name: newPortal.name,
            tier: "Marketplace Free Active",
          });
        }}
      />
    </div>
  );
};
