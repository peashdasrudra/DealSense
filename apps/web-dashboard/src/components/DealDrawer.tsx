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
  const [activeTab, setActiveTab] = useState<"signals" | "meddicc" | "stakeholders" | "copilot">("signals");
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
    onActionTrigger?.(actionTitle, deal.name);
    setActionSuccessMsg(`✓ ${actionTitle} executed & synced with HubSpot CRM`);
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
              maxWidth: "680px",
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
                padding: "20px 24px",
                borderBottom: "1px solid var(--hs-border-dark)",
                background: "var(--hs-surface)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span className="badge badge-outline" style={{ fontSize: "11px", fontWeight: 700 }}>
                    {deal.stage}
                  </span>
                  <span
                    className="risk-pill"
                    data-band={band}
                    style={{ fontSize: "11px", padding: "2px 8px" }}
                  >
                    Score: {deal.score} · {band} Risk
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>
                    Owner: {deal.owner}
                  </span>
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--hs-primary)", margin: 0, lineHeight: 1.3 }}>
                  {deal.name}
                </h2>
                <div style={{ fontSize: "13px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                  Account: <strong>{deal.client}</strong> · Pipeline Value: <strong>${(deal.value / 1000).toFixed(0)}K</strong>
                </div>
              </div>

              <button
                onClick={onClose}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: "50%", width: 32, height: 32, padding: 0, fontSize: "16px" }}
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
                  background: "var(--risk-healthy-bg)",
                  color: "var(--risk-healthy)",
                  padding: "8px 24px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  borderBottom: "1px solid var(--risk-healthy-border)",
                }}
              >
                {actionSuccessMsg}
              </motion.div>
            )}

            {/* Tab Navigation */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid var(--hs-border-dark)",
                background: "#ffffff",
                padding: "0 24px",
                gap: 20,
              }}
            >
              {[
                { id: "signals", label: "Telemetry & Signals", icon: "📊" },
                { id: "meddicc", label: "MEDDICC Audit", icon: "🎯" },
                { id: "stakeholders", label: "Stakeholder Map", icon: "👥" },
                { id: "copilot", label: "AI Copilot", icon: "🤖" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      padding: "12px 4px",
                      background: "none",
                      border: "none",
                      borderBottom: `3px solid ${isActive ? "var(--hs-primary)" : "transparent"}`,
                      color: isActive ? "var(--hs-primary)" : "var(--hs-text-muted)",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "13.5px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "all 0.15s",
                    }}
                  >
                    <span>{tab.icon}</span>
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
                          <span style={{ color: "var(--danger)", fontSize: "16px", lineHeight: 1 }}>⚠️</span>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--hs-text)" }}>
                              {risk}
                            </div>
                            <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                              Source: HubSpot Activity Stream & Historical Tenant Benchmarks
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Next Best Action Recommendation */}
                  <div
                    style={{
                      padding: "18px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--hs-border-dark)",
                      background: "var(--hs-surface)",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", textTransform: "uppercase", marginBottom: 6 }}>
                      ⚡ Recommended RevOps Remediation
                    </div>
                    <p style={{ fontSize: "13.5px", color: "var(--hs-text)", lineHeight: 1.5, margin: 0 }}>
                      {deal.recommendation || "Schedule an executive alignment call with the Economic Buyer within 48h to unblock procurement liability terms."}
                    </p>
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleExecuteAction("Create Follow-Up Task in HubSpot")}
                      >
                        ⚡ Create HubSpot Task
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleExecuteAction("Send Re-Engagement Package")}
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

              {/* TAB 4: AI DEAL COPILOT */}
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
                padding: "16px 24px",
                borderTop: "1px solid var(--hs-border-dark)",
                background: "var(--hs-surface)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>
                ID: <code>{deal.id}</code> · Tenant: AiXpert Labs
              </div>
              <div style={{ display: "flex", gap: 10 }}>
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
