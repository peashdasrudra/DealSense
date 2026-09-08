/**
 * DealSense Dashboard — Mutual Action Plan (MAP) Generator & Tracker.
 * Solves manual rep planning by auto-generating buyer-seller shared milestone timelines.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Milestone {
  id: string;
  phase: "Evaluation" | "Technical Validation" | "Commercial Alignment" | "Procurement & Legal" | "Executive Sign-Off";
  title: string;
  sellerOwner: string;
  buyerOwner: string;
  dueDate: string;
  status: "completed" | "in_progress" | "pending" | "delayed";
  deliverable: string;
}

interface DealMAP {
  dealId: string;
  dealName: string;
  client: string;
  value: number;
  targetCloseDate: string;
  progressPercent: number;
  milestones: Milestone[];
}

const SAMPLE_MAPS: DealMAP[] = [
  {
    dealId: "deal-ent-101",
    dealName: "Global Logistics Cloud Migration",
    client: "Maersk Digital Global",
    value: 1850000,
    targetCloseDate: "Sep 30, 2026",
    progressPercent: 55,
    milestones: [
      { id: "m1", phase: "Evaluation", title: "Cloud Architecture Sizing & Workload Mapping", sellerOwner: "Elena Rostova", buyerOwner: "Lars Sorensen (VP Tech)", dueDate: "Aug 15", status: "completed", deliverable: "Cloud Workload Sizing Model" },
      { id: "m2", phase: "Technical Validation", title: "Enterprise SOC2 & Maritime ISO Security Audit", sellerOwner: "Mike Torres (Lead SA)", buyerOwner: "Torben Dahl (Head of SecOps)", dueDate: "Sep 02", status: "completed", deliverable: "InfoSec Compliance Certification" },
      { id: "m3", phase: "Commercial Alignment", title: "Executive ROI & 3-Year Capex Reduction Presentation", sellerOwner: "Elena Rostova", buyerOwner: "Frederik Holst (CFO)", dueDate: "Sep 14", status: "delayed", deliverable: "CFO Business Justification Pack" },
      { id: "m4", phase: "Procurement & Legal", title: "Master Services Agreement (MSA) Redlines", sellerOwner: "Legal Counsel", buyerOwner: "Karen Lind (Procurement Dir)", dueDate: "Sep 22", status: "in_progress", deliverable: "Executed Enterprise MSA" },
      { id: "m5", phase: "Executive Sign-Off", title: "Global PO Authorization & Dual-Signature", sellerOwner: "Elena Rostova", buyerOwner: "Frederik Holst (CFO)", dueDate: "Sep 30", status: "pending", deliverable: "Countersigned Order Form" },
    ],
  },
  {
    dealId: "deal-ent-104",
    dealName: "PACS Medical Imaging Pipeline",
    client: "Siemens Healthineers",
    value: 2100000,
    targetCloseDate: "Nov 30, 2026",
    progressPercent: 40,
    milestones: [
      { id: "m1", phase: "Evaluation", title: "FDA 510(k) & Medical Device Compliance Review", sellerOwner: "David Kim", buyerOwner: "Dr. Klaus Weber (Chief Medical Officer)", dueDate: "Aug 20", status: "completed", deliverable: "FDA Compliance Audit" },
      { id: "m2", phase: "Technical Validation", title: "DICOM Throughput & Latency Sandbox PoC", sellerOwner: "Mike Torres (Lead SA)", buyerOwner: "Heinrich Schmidt (Chief Architect)", dueDate: "Sep 10", status: "in_progress", deliverable: "PoC SLA & Latency Benchmark" },
      { id: "m3", phase: "Commercial Alignment", title: "Hospital Tier-1 Volume Discount Structure", sellerOwner: "David Kim", buyerOwner: "Stefan Bauer (CFO)", dueDate: "Oct 05", status: "pending", deliverable: "Global Pricing Schedule" },
      { id: "m4", phase: "Procurement & Legal", title: "BAA & HIPAA Privacy Data Addendum", sellerOwner: "Legal Counsel", buyerOwner: "Monika Gruber (Legal Dir)", dueDate: "Nov 15", status: "pending", deliverable: "Signed BAA Agreement" },
      { id: "m5", phase: "Executive Sign-Off", title: "Supervisory Board Authorization", sellerOwner: "David Kim", buyerOwner: "Stefan Bauer (CFO)", dueDate: "Nov 30", status: "pending", deliverable: "Fully Executed Contract" },
    ],
  },
  {
    dealId: "deal-ent-102",
    dealName: "Unified Retail AI Recommendation",
    client: "IKEA Digital Retail",
    value: 1420000,
    targetCloseDate: "Oct 15, 2026",
    progressPercent: 70,
    milestones: [
      { id: "m1", phase: "Evaluation", title: "Omnichannel Customer Data Architecture Audit", sellerOwner: "Marcus Vance", buyerOwner: "Anders Lindqvist (CTO)", dueDate: "Aug 01", status: "completed", deliverable: "Catalog Integration Spec" },
      { id: "m2", phase: "Technical Validation", title: "Real-Time Inference Stress Test (100k req/s)", sellerOwner: "Mike Torres (Lead SA)", buyerOwner: "Karin Nilsson (Head of Data)", dueDate: "Aug 25", status: "completed", deliverable: "Throughput Validation Report" },
      { id: "m3", phase: "Commercial Alignment", title: "Store + E-Commerce Unified ARR Licensing", sellerOwner: "Marcus Vance", buyerOwner: "Erik Strom (VP E-Commerce)", dueDate: "Sep 15", status: "completed", deliverable: "Multi-Store Order Schedule" },
      { id: "m4", phase: "Procurement & Legal", title: "EU GDPR & Global Data Transfer Addendum", sellerOwner: "Legal Counsel", buyerOwner: "Sofia Berg (Procurement Dir)", dueDate: "Oct 01", status: "in_progress", deliverable: "Approved DPA & MSA" },
      { id: "m5", phase: "Executive Sign-Off", title: "Group Executive Committee Sign-Off", sellerOwner: "Marcus Vance", buyerOwner: "Anders Lindqvist (CTO)", dueDate: "Oct 15", status: "pending", deliverable: "Final Countersignature" },
    ],
  },
];

export const MutualActionPlan: React.FC = () => {
  const [maps, setMaps] = useState<DealMAP[]>(SAMPLE_MAPS);
  const [selectedDealId, setSelectedDealId] = useState<string>("deal-ent-101");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Milestone Form
  const [newTitle, setNewTitle] = useState("");
  const [newPhase, setNewPhase] = useState<Milestone["phase"]>("Technical Validation");
  const [newSeller, setNewSeller] = useState("Peash Rudra");
  const [newBuyer, setNewBuyer] = useState("VP Sponsor");
  const [newDate, setNewDate] = useState("2026-09-25");
  const [newDeliverable, setNewDeliverable] = useState("");

  const activeMAP = maps.find((m) => m.dealId === selectedDealId) || maps[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    setMaps((prev) =>
      prev.map((m) => {
        if (m.dealId !== selectedDealId) return m;
        const updatedMilestones = m.milestones.map((ms) => {
          if (ms.id !== milestoneId) return ms;
          const nextStatus: Record<string, Milestone["status"]> = {
            pending: "in_progress",
            in_progress: "completed",
            completed: "delayed",
            delayed: "pending",
          };
          return { ...ms, status: nextStatus[ms.status] };
        });
        const completedCount = updatedMilestones.filter((ms) => ms.status === "completed").length;
        const progressPercent = Math.round((completedCount / updatedMilestones.length) * 100);
        return { ...m, milestones: updatedMilestones, progressPercent };
      })
    );
    showToast("🎯 Milestone status updated & synced with HubSpot tasks!");
  };

  const handleCopyBuyerLink = () => {
    navigator.clipboard.writeText(`https://app.dealsense.io/map/portal/${activeMAP.dealId}?token=sec_991823`);
    showToast("🔗 Public Buyer Portal link copied to clipboard!");
  };

  const handleAiRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast("✨ AI Copilot analyzed HubSpot activity and aligned 5 key milestones!");
    }, 850);
  };

  const handleAddMilestone = () => {
    if (!newTitle.trim()) return;
    const newMs: Milestone = {
      id: `ms-${Date.now()}`,
      phase: newPhase,
      title: newTitle,
      sellerOwner: newSeller,
      buyerOwner: newBuyer,
      dueDate: newDate,
      status: "pending",
      deliverable: newDeliverable || "Executive Deliverable",
    };
    setMaps((prev) =>
      prev.map((m) => {
        if (m.dealId !== selectedDealId) return m;
        const updated = [...m.milestones, newMs];
        const completedCount = updated.filter((ms) => ms.status === "completed").length;
        const progressPercent = Math.round((completedCount / updated.length) * 100);
        return { ...m, milestones: updated, progressPercent };
      })
    );
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewDeliverable("");
    showToast(`✓ Milestone "${newTitle}" added to Mutual Action Plan!`);
  };

  const totalMapPipeline = maps.reduce((sum, m) => sum + m.value, 0);

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
              Mutual Action Plans (MAPs)
            </h2>
            <p className="page-header-desc">
              Collaborative buyer-seller playbooks. Sync milestones with HubSpot tasks, track execution speed, and eliminate late-stage legal delays.
            </p>
          </div>
          <div className="page-header-actions">
            <button
              onClick={() => showToast("📑 MAP Executive Briefing exported as PDF!")}
              style={{
                background: "#ffffff",
                color: "var(--hs-primary)",
                border: "1px solid #cbd6e2",
              }}
            >
              <span>📑 Export MAP</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                background: "#ff5c35",
                color: "#ffffff",
                border: "none",
                boxShadow: "0 2px 8px rgba(255, 92, 53, 0.3)",
              }}
            >
              <span>+ Add Milestone</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Standardized KPI Command Strip ─────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card" style={{ borderTopColor: "var(--hs-primary)" }}>
          <div className="kpi-label">Active MAP Pipeline</div>
          <div className="kpi-value">${(totalMapPipeline / 1000000).toFixed(2)}M</div>
          <div style={{ fontSize: "11px", color: "#007a8c", fontWeight: 600, marginTop: 4 }}>
            ● {maps.length} collaborative enterprise deals
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--risk-healthy)" }}>
          <div className="kpi-label">Milestone Completion Rate</div>
          <div className="kpi-value" style={{ color: "var(--risk-healthy)" }}>64.2%</div>
          <div style={{ fontSize: "11px", color: "var(--risk-healthy)", fontWeight: 600, marginTop: 4 }}>
            ▲ On-track for Q4 close
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#00a4bd" }}>
          <div className="kpi-label">Buyer Engagement Velocity</div>
          <div className="kpi-value" style={{ color: "#007a8c" }}>3.2 Days</div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Average buyer deliverable sign-off
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--danger)" }}>
          <div className="kpi-label">Critical Legal Blockers</div>
          <div className="kpi-value" style={{ color: "var(--danger)" }}>1 Delayed</div>
          <div style={{ fontSize: "11px", color: "var(--danger)", fontWeight: 600, marginTop: 4 }}>
            ⚠ Action required on MSA redlines
          </div>
        </div>
      </div>

      {/* ── 3. Active Deal Selector Toolbar ─────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          padding: "12px 18px",
          border: "1px solid #dfe3eb",
          borderRadius: "var(--radius-md)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          margin: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-heading)" }}>
            ● Active Enterprise Deal:
          </span>
          <select
            value={selectedDealId}
            onChange={(e) => setSelectedDealId(e.target.value)}
            style={{
              padding: "6px 12px",
              border: "1px solid #cbd6e2",
              borderRadius: "4px",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--hs-heading)",
              background: "#f8fafc",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {maps.map((m) => (
              <option key={m.dealId} value={m.dealId}>
                {m.dealName} (${(m.value / 1000).toLocaleString()}K) — {m.client}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={handleAiRegenerate}
            disabled={isGenerating}
            style={{
              padding: "6px 12px",
              background: "#ffffff",
              border: "1px solid #cbd6e2",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--hs-text)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span>{isGenerating ? "⚡ Analyzing..." : "⚡ Generate MAP Timeline"}</span>
          </button>
          <button
            onClick={handleCopyBuyerLink}
            style={{
              padding: "6px 14px",
              background: "#2d3e50",
              color: "#ffffff",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              boxShadow: "0 2px 6px rgba(45, 62, 80, 0.25)",
            }}
          >
            <span>🔗 Share with Buyer</span>
          </button>
        </div>
      </div>

      {/* ── 4. MAP Hero Progress Card ───────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          padding: "20px 24px",
          border: "1px solid #dfe3eb",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--hs-heading)", margin: "0 0 4px" }}>
              {activeMAP.dealName} · Mutual Action Plan
            </h3>
            <div style={{ fontSize: "12.5px", color: "var(--hs-text-muted)" }}>
              Account: <strong style={{ color: "var(--hs-heading)" }}>{activeMAP.client}</strong> · Target Close: <strong style={{ color: "var(--hs-heading)" }}>{activeMAP.targetCloseDate}</strong> · Value: <strong style={{ color: "#ff5c35" }}>${activeMAP.value.toLocaleString()} USD</strong>
            </div>
          </div>

          <div style={{ minWidth: 220 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, marginBottom: 6 }}>
              <span style={{ color: "var(--hs-heading)" }}>Overall Completion</span>
              <span style={{ color: "var(--risk-healthy)", fontWeight: 800 }}>{activeMAP.progressPercent}%</span>
            </div>
            <div style={{ width: "100%", height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
              <div
                style={{
                  width: `${activeMAP.progressPercent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #00a38d, #00bda5)",
                  borderRadius: 4,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Milestone Matrix Table ───────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          padding: "20px 24px",
          border: "1px solid #dfe3eb",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
            Joint Milestone Execution Timeline &amp; Deliverables
          </h4>
          <span style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
            Click status badge to cycle progress
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #cbd6e2" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-text-muted)", fontWeight: 700, width: 40 }}>#</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>Phase &amp; Milestone</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>Seller Champion</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>Buyer Counterpart</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>Target Date</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>Verified Deliverable</th>
                <th style={{ padding: "10px 12px", textAlign: "right", color: "var(--hs-heading)", fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeMAP.milestones.map((ms, idx) => {
                let badgeBg = "#f1f5f9";
                let badgeColor = "var(--hs-text-muted)";
                let badgeText = "○ Pending";

                if (ms.status === "completed") {
                  badgeBg = "var(--risk-healthy-bg)";
                  badgeColor = "var(--risk-healthy)";
                  badgeText = "✓ Completed";
                } else if (ms.status === "in_progress") {
                  badgeBg = "rgba(0, 164, 189, 0.12)";
                  badgeColor = "#007a8c";
                  badgeText = "⏳ In Progress";
                } else if (ms.status === "delayed") {
                  badgeBg = "var(--risk-critical-bg)";
                  badgeColor = "var(--danger)";
                  badgeText = "⚠ Delayed";
                }

                return (
                  <tr key={ms.id} style={{ borderBottom: "1px solid #eaf0f6" }}>
                    <td style={{ padding: "12px 12px", color: "var(--hs-text-muted)", fontWeight: 600 }}>0{idx + 1}</td>
                    <td style={{ padding: "12px 12px" }}>
                      <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#007a8c", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {ms.phase}
                      </div>
                      <div style={{ fontWeight: 700, color: "var(--hs-heading)", marginTop: 2 }}>{ms.title}</div>
                    </td>
                    <td style={{ padding: "12px 12px", color: "var(--hs-text)", fontWeight: 500 }}>{ms.sellerOwner}</td>
                    <td style={{ padding: "12px 12px", color: "var(--hs-heading)", fontWeight: 600 }}>{ms.buyerOwner}</td>
                    <td style={{ padding: "12px 12px", color: "var(--hs-text)", fontWeight: 600 }}>{ms.dueDate}</td>
                    <td style={{ padding: "12px 12px", color: "var(--hs-text-muted)", fontStyle: "italic" }}>{ms.deliverable}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right" }}>
                      <button
                        onClick={() => handleToggleMilestone(ms.id)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                          border: "none",
                          background: badgeBg,
                          color: badgeColor,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {badgeText}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Milestone Modal ────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(33, 43, 54, 0.65)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999999,
            padding: "16px",
          }}
        >
          <div className="enterprise-modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eaf0f6", paddingBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "var(--hs-heading)" }}>Add Mutual Action Milestone</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: "none", border: "none", color: "#7c98b6", fontSize: "16px", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Milestone Title *</label>
                <input type="text" placeholder="e.g. Infosec Architecture Review" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd6e2", borderRadius: "4px", fontSize: "12.5px", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Phase</label>
                  <select value={newPhase} onChange={(e) => setNewPhase(e.target.value as any)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd6e2", borderRadius: "4px", fontSize: "12.5px" }}>
                    <option value="Evaluation">Evaluation</option>
                    <option value="Technical Validation">Technical Validation</option>
                    <option value="Commercial Alignment">Commercial Alignment</option>
                    <option value="Procurement & Legal">Procurement &amp; Legal</option>
                    <option value="Executive Sign-Off">Executive Sign-Off</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Due Date</label>
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd6e2", borderRadius: "4px", fontSize: "12.5px", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Seller Owner</label>
                  <input type="text" value={newSeller} onChange={(e) => setNewSeller(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd6e2", borderRadius: "4px", fontSize: "12.5px", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Buyer Counterpart</label>
                  <input type="text" value={newBuyer} onChange={(e) => setNewBuyer(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd6e2", borderRadius: "4px", fontSize: "12.5px", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Verified Deliverable</label>
                <input type="text" placeholder="e.g. Signed Security Addendum" value={newDeliverable} onChange={(e) => setNewDeliverable(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd6e2", borderRadius: "4px", fontSize: "12.5px", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                <button onClick={() => setIsAddModalOpen(false)} style={{ padding: "8px 14px", background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", fontSize: "12px", fontWeight: 600, color: "var(--hs-text-muted)", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleAddMilestone} style={{ padding: "8px 16px", background: "#ff5c35", color: "#ffffff", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Add Milestone</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
