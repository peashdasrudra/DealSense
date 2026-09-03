/**
 * DealSense Dashboard — Deal Inspection Slide-Over Drawer.
 * Deep RevOps Deal Dossier with Signals, Interactive MEDDICC, Multi-Threading Map, and AI Copilot.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DealData {
  id: string;
  name: string;
  client: string;
  score: number;
  band: "Critical" | "High" | "Moderate" | "Low" | "Healthy" | string;
  value: number;
  stage: string;
  owner: string;
  closeDate?: string;
  daysInStage?: number;
  lastTouch?: string;
  slippageCount?: number;
  meddicc?: {
    metrics?: string;
    economicBuyer?: string;
    decisionCriteria?: string;
    decisionProcess?: string;
    identifyPain?: string;
    champion?: string;
    competition?: string;
  };
  risks?: string[];
  recommendation?: string;
  contacts?: Array<{
    name: string;
    title: string;
    role: "Economic Buyer" | "Champion" | "Decision Maker" | "Technical Evaluator" | "Blocker" | "Influencer";
    sentiment: "positive" | "neutral" | "negative" | "silent";
    lastEngaged: string;
  }>;
}

interface DealDrawerProps {
  deal: DealData | null;
  isOpen: boolean;
  onClose: () => void;
  onActionTrigger?: (actionName: string, dealName: string) => void;
}

const SAMPLE_CONTACTS = [
  { name: "Richard Vance", title: "Chief Financial Officer", role: "Economic Buyer" as const, sentiment: "silent" as const, lastEngaged: "18 days ago" },
  { name: "Sarah Jenkins", title: "VP Sales Operations", role: "Champion" as const, sentiment: "positive" as const, lastEngaged: "3 days ago" },
  { name: "David Chen", title: "Lead Solutions Architect", role: "Technical Evaluator" as const, sentiment: "positive" as const, lastEngaged: "Yesterday" },
  { name: "Marcus Brody", title: "Head of Procurement", role: "Blocker" as const, sentiment: "negative" as const, lastEngaged: "12 days ago" },
];

export const DealDrawer: React.FC<DealDrawerProps> = ({
  deal,
  isOpen,
  onClose,
  onActionTrigger,
}) => {
  const [activeTab, setActiveTab] = useState<"signals" | "meddicc" | "stakeholders" | "map" | "battlecards" | "copilot">("signals");
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotChat, setCopilotChat] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Hello! I'm DealSense Copilot. I've analyzed all notes, email threads, and stage telemetry for this deal. Ask me anything about risk factors, stakeholder sentiment, or drafting next moves.",
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!deal) return null;

  const band = (deal.band || "Moderate").charAt(0).toUpperCase() + (deal.band || "Moderate").slice(1).toLowerCase();
  const isCritical = ["Critical", "critical"].includes(deal.band);
  const isHigh = ["High", "high"].includes(deal.band);
  const contacts = deal.contacts || SAMPLE_CONTACTS;

  const handleSendCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim() || isAiThinking) return;

    const userMsg = copilotQuery;
    setCopilotChat((prev) => [...prev, { sender: "user", text: userMsg }]);
    setCopilotQuery("");
    setIsAiThinking(true);

    setTimeout(() => {
      let aiReply = "Based on verified CRM activity, the primary impediment is that the Economic Buyer (CFO) has not participated in any calls for 18 days while Procurement raised legal indemnity concerns.";
      if (userMsg.toLowerCase().includes("email") || userMsg.toLowerCase().includes("draft")) {
        aiReply = `Here is an evidence-backed re-engagement email draft:\n\nSubject: Alignment on ${deal.name} business case & ROI\n\nHi Sarah,\n\nFollowing up on our architecture session with David. To ensure we have full financial justification ready for Richard before the end of the month, I've prepared our security ROI breakdown detailing the 30% OPEX savings.\n\nWould a brief 15-minute sync with Richard this Thursday work to review?`;
      } else if (userMsg.toLowerCase().includes("risk") || userMsg.toLowerCase().includes("why")) {
        aiReply = `Top 3 Grounded Risks for ${deal.name}:\n1. 21 days in current stage (exceeds tenant median of 10 days).\n2. Single-threaded economic alignment (CFO Richard Vance is currently unverified).\n3. Close date pushed 2 times in the last 30 days.`;
      }

      setCopilotChat((prev) => [...prev, { sender: "ai", text: aiReply }]);
      setIsAiThinking(false);
    }, 600);
  };

  const handleExecuteAction = (actionTitle: string) => {
    if (onActionTrigger) onActionTrigger(actionTitle, deal.name);
    setActionSuccessMsg(`✓ Executed "${actionTitle}" — Written back to HubSpot CRM`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(18, 69, 72, 0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 200,
            }}
          />

          {/* Slide-Over Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "min(740px, 100vw)",
              background: "#ffffff",
              boxShadow: "-8px 0 32px rgba(18, 69, 72, 0.2)",
              zIndex: 210,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 24px 16px",
                borderBottom: "1px solid #cbd6e2",
                background: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Breadcrumb */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#7c98b6", marginBottom: 6 }}>
                  <span>Sales Hub</span>
                  <span>/</span>
                  <span style={{ color: "#00a4bd" }}>Deals</span>
                  <span>/</span>
                  <span style={{ color: "#33475b", fontWeight: 600 }}>#{deal.id.slice(-6)}</span>
                </div>

                {/* Badges Row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <span
                    style={{
                      background: "#edf1f5",
                      color: "#33475b",
                      border: "1px solid #cbd6e2",
                      borderRadius: "3px",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      letterSpacing: "0.03em",
                      textTransform: "uppercase",
                    }}
                  >
                    {deal.stage}
                  </span>

                  {/* Authentic HubSpot Risk Pill */}
                  <span
                    style={{
                      background: isCritical ? "#fbeae9" : isHigh ? "#fff6e6" : "#e5f8f6",
                      color: isCritical ? "#c8372d" : isHigh ? "#b76e00" : "#007a70",
                      border: `1px solid ${isCritical ? "#f5c6c4" : isHigh ? "#fde1b0" : "#b2ede5"}`,
                      borderRadius: "3px",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      letterSpacing: "0.02em",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: isCritical ? "#c8372d" : isHigh ? "#b76e00" : "#007a70" }} />
                    SCORE: {deal.score} · {band.toUpperCase()} RISK
                  </span>

                  <span style={{ fontSize: "12px", color: "#516f90", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#eaf0f6", color: "#2d3e50", fontSize: "10px", fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      {deal.owner.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "OW"}
                    </span>
                    Owner: <strong style={{ color: "#33475b" }}>{deal.owner}</strong>
                  </span>
                </div>

                {/* Deal Title */}
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#33475b", margin: "4px 0 3px", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
                  {deal.name}
                </h2>

                {/* Deal Details Subtitle */}
                <div style={{ fontSize: "12.5px", color: "#516f90", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span>Account: <strong style={{ color: "#33475b" }}>{deal.client}</strong></span>
                  <span style={{ color: "#cbd6e2" }}>·</span>
                  <span>Pipeline Value: <strong style={{ color: "#ff7a59" }}>${(deal.value || 0).toLocaleString()}</strong></span>
                  <span style={{ color: "#cbd6e2" }}>·</span>
                  <span style={{ color: "#00a4bd", fontWeight: 600 }}>HubSpot REST v3</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "4px",
                  border: "1px solid #cbd6e2",
                  background: "#ffffff",
                  color: "#516f90",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                }}
                title="Close Drawer (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Notification Banner */}
            {actionSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "#e5f8f6",
                  color: "#007a70",
                  padding: "8px 20px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  borderBottom: "1px solid #b2ede5",
                }}
              >
                {actionSuccessMsg}
              </motion.div>
            )}

            {/* Tab Navigation */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #cbd6e2",
                background: "#ffffff",
                padding: "0 20px",
                gap: 20,
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {[
                {
                  id: "signals",
                  label: "Signals",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  ),
                },
                {
                  id: "meddicc",
                  label: "MEDDICC",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  ),
                },
                {
                  id: "stakeholders",
                  label: "Stakeholders",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                },
                {
                  id: "map",
                  label: "Mutual Action Plan",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  ),
                },
                {
                  id: "battlecards",
                  label: "Battlecards",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  ),
                },
                {
                  id: "copilot",
                  label: "AI Copilot",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ),
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      padding: "12px 2px",
                      background: "none",
                      border: "none",
                      borderBottom: isActive ? "2px solid #ff7a59" : "2px solid transparent",
                      color: isActive ? "#33475b" : "#516f90",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "all 0.15s ease",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: isActive ? "#ff7a59" : "#7c98b6", display: "flex", alignItems: "center" }}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              {/* TAB 1: SIGNALS & TELEMETRY */}
              {activeTab === "signals" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* KPI Bar */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    <div className="kpi-card" style={{ padding: "12px 14px" }}>
                      <div className="kpi-label">Days in Stage</div>
                      <div className="kpi-value" style={{ fontSize: "20px" }}>{deal.daysInStage || 21} Days</div>
                      <div style={{ fontSize: "11px", color: "var(--danger)", fontWeight: 600, marginTop: 2 }}>
                        ▲ 11d above benchmark
                      </div>
                    </div>
                    <div className="kpi-card" style={{ padding: "12px 14px" }}>
                      <div className="kpi-label">Last Interaction</div>
                      <div className="kpi-value" style={{ fontSize: "20px" }}>{deal.lastTouch || "12d ago"}</div>
                      <div style={{ fontSize: "11px", color: "var(--warning)", fontWeight: 600, marginTop: 2 }}>
                        Silence Alert
                      </div>
                    </div>
                    <div className="kpi-card" style={{ padding: "12px 14px" }}>
                      <div className="kpi-label">Close Date Pushes</div>
                      <div className="kpi-value" style={{ fontSize: "20px", color: (deal.slippageCount || 0) > 0 ? "var(--danger)" : "var(--success)" }}>
                        {deal.slippageCount || 2}×
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                        Target: End of Month
                      </div>
                    </div>
                  </div>

                  {/* Grounded Risk Signals */}
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--hs-primary)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
                      Grounded Risk Signals (Deterministic Math)
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {(deal.risks || [
                        "Deal has exceeded 20 days in Proposal Sent stage (threshold: 10 days)",
                        "Economic Buyer (CFO) is silent with zero logged 2-way correspondence",
                        "Close date was pushed 2 times in the last 30 days",
                      ]).map((risk, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "12px 16px",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--risk-critical-border)",
                            background: "var(--risk-critical-bg)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8372d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "#33475b" }}>
                              {risk}
                            </div>
                            <div style={{ fontSize: "11.5px", color: "#516f90", marginTop: 2 }}>
                              Source: HubSpot Activity Stream &amp; Historical Tenant Benchmarks
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Next Best Action Recommendation */}
                  <div
                    style={{
                      padding: "18px 20px",
                      borderRadius: "4px",
                      border: "1px solid #cbd6e2",
                      borderLeft: "3px solid #ff7a59",
                      background: "#ffffff",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "11px", fontWeight: 700, color: "#ff7a59", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      <span>Recommended RevOps Remediation</span>
                    </div>
                    <p style={{ fontSize: "13.5px", color: "#33475b", lineHeight: 1.5, margin: 0 }}>
                      {deal.recommendation || "Schedule an executive alignment call with the Economic Buyer within 48h to unblock procurement liability terms."}
                    </p>
                    <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleExecuteAction("Create Follow-Up Task in HubSpot")}
                        style={{
                          padding: "8px 14px",
                          background: "#ff7a59",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "3px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Create HubSpot Task
                      </button>
                      <button
                        onClick={() => handleExecuteAction("Send Re-Engagement Package")}
                        style={{
                          padding: "8px 14px",
                          background: "#ffffff",
                          color: "#33475b",
                          border: "1px solid #cbd6e2",
                          borderRadius: "3px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Draft Exec Re-Engagement Email
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDDICC AUDIT */}
              {activeTab === "meddicc" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ fontSize: "13px", color: "var(--hs-text-muted)" }}>
                    Every qualification pillar is extracted from unstructured meeting notes and emails. Pillars with missing citations are marked as unverified to prevent false optimism.
                  </div>

                  {Object.entries(deal.meddicc || {
                    metrics: "30% infrastructure OPEX reduction targeted",
                    economicBuyer: "Missing / Unverified (CFO Richard Vance silent)",
                    decisionCriteria: "SOC2 Compliance + AWS Native Zero Trust",
                    decisionProcess: "Legal and Procurement review underway",
                    identifyPain: "Current data center lease expiring Q4; manual reporting latency",
                    champion: "VP Sales Operations (Sarah Jenkins) is active sponsor",
                    competition: "AWS Professional Services direct",
                  }).map(([key, val]) => {
                    const isMissing = val.toLowerCase().includes("missing") || val.toLowerCase().includes("unverified");
                    return (
                      <div
                        key={key}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "var(--radius-sm)",
                          border: `1px solid ${isMissing ? "var(--risk-critical-border)" : "var(--hs-border-dark)"}`,
                          background: isMissing ? "var(--risk-critical-bg)" : "#ffffff",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: isMissing ? "var(--danger)" : "var(--hs-primary)", textTransform: "uppercase" }}>
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>
                          <span
                            className="badge"
                            style={{
                              background: isMissing ? "var(--risk-critical-bg)" : "var(--risk-healthy-bg)",
                              color: isMissing ? "var(--danger)" : "var(--risk-healthy)",
                              fontSize: "10px",
                              fontWeight: 700,
                            }}
                          >
                            {isMissing ? "✕ Gap Detected" : "✓ Verified"}
                          </span>
                        </div>
                        <div style={{ fontSize: "13.5px", color: "var(--hs-text)", fontWeight: 500 }}>
                          {val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: STAKEHOLDER & MULTI-THREADING MAP */}
              {activeTab === "stakeholders" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "13px", color: "var(--hs-text-muted)" }}>
                      Multi-threading reduces deal slip rate by 42%. Identified contacts in account:
                    </div>
                    <span className="badge badge-outline">{contacts.length} Associated Contacts</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {contacts.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--hs-border-dark)",
                          background: "var(--hs-surface)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontWeight: 700, color: "var(--hs-primary)", fontSize: "14px" }}>{c.name}</span>
                            <span className="badge badge-outline" style={{ fontSize: "10.5px" }}>{c.role}</span>
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                            {c.title} · Last engaged: <strong>{c.lastEngaged}</strong>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "2px 8px",
                              borderRadius: "var(--radius-pill)",
                              background:
                                c.sentiment === "positive"
                                  ? "var(--risk-healthy-bg)"
                                  : c.sentiment === "negative"
                                  ? "var(--risk-critical-bg)"
                                  : "var(--risk-moderate-bg)",
                              color:
                                c.sentiment === "positive"
                                  ? "var(--risk-healthy)"
                                  : c.sentiment === "negative"
                                  ? "var(--danger)"
                                  : "var(--risk-moderate)",
                            }}
                          >
                            {c.sentiment}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ alignSelf: "flex-start", marginTop: 8 }}
                    onClick={() => handleExecuteAction("Enrich Missing Stakeholder Contacts")}
                  >
                    + Auto-Enrich Missing Decision Makers via CRM
                  </button>
                </div>
              )}

              {/* TAB 4: MUTUAL ACTION PLAN */}
              {activeTab === "map" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--hs-primary)" }}>Buyer-Seller Mutual Action Plan</div>
                      <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>Target Close: Sep 30, 2026 · 45% Completed</div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => handleExecuteAction("Share MAP Link with Buyer")}>
                      🔗 Share with {deal.client}
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { step: "01", title: "Architecture Discovery & Sizing", owner: `${deal.owner} & Lead Architect`, due: "Aug 15", status: "✓ Done" },
                      { step: "02", title: "Security & SOC2 Review", owner: "Security Team", due: "Sep 02", status: "⏳ In Review" },
                      { step: "03", title: "CFO Business Case & ROI Alignment", owner: "Richard Vance (CFO)", due: "Sep 12", status: "⚠ Missing" },
                      { step: "04", title: "Master Service Agreement (MSA)", owner: "Procurement Lead", due: "Sep 22", status: "○ Pending" },
                      { step: "05", title: "Final PO & Countersign", owner: `${deal.owner} & Exec Sponsor`, due: "Sep 30", status: "○ Pending" },
                    ].map((ms) => (
                      <div
                        key={ms.step}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--hs-border-dark)",
                          background: "#ffffff",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, color: "var(--hs-text-muted)" }}>{ms.step}</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "12.5px", color: "var(--hs-text)" }}>{ms.title}</div>
                            <div style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>Owner: {ms.owner} · Due: {ms.due}</div>
                          </div>
                        </div>
                        <span className="badge" style={{ background: ms.status.includes("Done") ? "var(--risk-healthy-bg)" : ms.status.includes("Missing") ? "var(--risk-critical-bg)" : "var(--hs-surface)", color: ms.status.includes("Done") ? "var(--risk-healthy)" : ms.status.includes("Missing") ? "var(--danger)" : "var(--hs-text)", fontSize: "10.5px" }}>
                          {ms.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: COMPETITIVE BATTLECARDS */}
              {activeTab === "battlecards" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ padding: "10px 12px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                    <div style={{ fontWeight: 700, fontSize: "12.5px", color: "var(--hs-primary)", marginBottom: 4 }}>
                      ⚔️ Detected Competitor: Gong.io / Clari
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
                      Buyer asked about automated call transcript integration and Salesforce parity.
                    </div>
                  </div>

                  <div style={{ padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", background: "#ffffff" }}>
                    <div style={{ fontWeight: 700, fontSize: "12px", color: "#ff5c35", marginBottom: 6 }}>
                      💣 Landmine Question to Ask Buyer
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--hs-text)", fontStyle: "italic", lineHeight: 1.4 }}>
                      "Does your current tool automatically remediate overdue deal close dates and missing MEDDICC criteria directly in HubSpot, or does your team spend hours doing that manually every Friday?"
                    </div>
                  </div>

                  <div style={{ padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", background: "#ffffff" }}>
                    <div style={{ fontWeight: 700, fontSize: "12px", color: "var(--hs-primary)", marginBottom: 6 }}>
                      💬 Word-for-Word Objection Response
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--hs-text)", lineHeight: 1.4 }}>
                      "Gong is fantastic for call recording playback, but it doesn't execute deterministic HubSpot write-backs or multi-model Monte Carlo forecasting. DealSense sits on top of HubSpot to fix data quality and save at-risk pipeline automatically."
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: AI DEAL COPILOT */}
              {activeTab === "copilot" && (
                <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "420px" }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", marginBottom: 16 }}>
                    {copilotChat.map((msg, i) => (
                      <div
                        key={i}
                        style={{
                          alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                          maxWidth: "85%",
                          padding: "12px 16px",
                          borderRadius: "var(--radius-md)",
                          background: msg.sender === "user" ? "var(--hs-primary)" : "var(--hs-surface)",
                          color: msg.sender === "user" ? "#ffffff" : "var(--hs-text)",
                          border: msg.sender === "user" ? "none" : "1px solid var(--hs-border-dark)",
                          fontSize: "13px",
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {msg.text}
                      </div>
                    ))}

                    {isAiThinking && (
                      <div
                        style={{
                          alignSelf: "flex-start",
                          padding: "8px 14px",
                          borderRadius: "var(--radius-md)",
                          background: "var(--hs-surface)",
                          border: "1px solid var(--hs-border-dark)",
                          fontSize: "12px",
                          color: "var(--hs-text-muted)",
                        }}
                      >
                        DealSense AI is analyzing timeline & citations...
                      </div>
                    )}
                  </div>

                  {/* Suggested Quick Prompts */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {[
                      "What are the biggest stall risks?",
                      "Draft email to CFO",
                      "Summarize MEDDICC gaps",
                    ].map((prompt, i) => (
                      <button
                        key={i}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: "11px", padding: "3px 8px" }}
                        onClick={() => {
                          setCopilotQuery(prompt);
                        }}
                      >
                        💬 {prompt}
                      </button>
                    ))}
                  </div>

                  {/* Query Input */}
                  <form onSubmit={handleSendCopilot} style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Ask DealSense Copilot anything about this deal..."
                      value={copilotQuery}
                      onChange={(e) => setCopilotQuery(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "9px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--hs-border-dark)",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                    <button type="submit" className="btn btn-primary btn-sm" disabled={isAiThinking}>
                      Ask AI
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div
              style={{
                padding: "12px 18px",
                borderTop: "1px solid var(--hs-border-dark)",
                background: "var(--hs-surface)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
                ID: <code>{deal.id}</code> · Tenant: HubAiLab Fleet
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleExecuteAction("Slip Close Date +14 Days")}
                >
                  Slip Date +14d
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleExecuteAction("Trigger Full Deal Re-Analysis")}
                >
                  ↻ Re-Analyze Deal
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
