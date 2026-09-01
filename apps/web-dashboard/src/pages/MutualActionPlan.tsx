/**
 * DealSense Dashboard — Mutual Action Plan (MAP) Generator & Tracker.
 * Solves manual rep planning by auto-generating buyer-seller shared milestone timelines.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

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
    dealId: "deal-101",
    dealName: "Orion Cloud Migration",
    client: "TechCorp Inc.",
    value: 150000,
    targetCloseDate: "Sep 30, 2026",
    progressPercent: 45,
    milestones: [
      { id: "m1", phase: "Evaluation", title: "Architecture Discovery & Sizing", sellerOwner: "Sarah Miller", buyerOwner: "David Chen (Architect)", dueDate: "Aug 15", status: "completed", deliverable: "Cloud Sizing Workbook" },
      { id: "m2", phase: "Technical Validation", title: "Security & SOC2 Review", sellerOwner: "Mike Torres (SA)", buyerOwner: "Security Lead", dueDate: "Sep 02", status: "in_progress", deliverable: "Security Questionnaire" },
      { id: "m3", phase: "Commercial Alignment", title: "Executive ROI Business Case", sellerOwner: "Sarah Miller", buyerOwner: "Richard Vance (CFO)", dueDate: "Sep 12", status: "delayed", deliverable: "CFO ROI Presentation" },
      { id: "m4", phase: "Procurement & Legal", title: "Master Service Agreement (MSA)", sellerOwner: "Legal Counsel", buyerOwner: "Marcus Brody (Procurement)", dueDate: "Sep 22", status: "pending", deliverable: "Executed MSA & Redlines" },
      { id: "m5", phase: "Executive Sign-Off", title: "Final PO Generation", sellerOwner: "Sarah Miller", buyerOwner: "Richard Vance (CFO)", dueDate: "Sep 30", status: "pending", deliverable: "Countersigned Order Form" },
    ],
  },
  {
    dealId: "deal-102",
    dealName: "Quantum Security Suite",
    client: "FinanceGo Ltd.",
    value: 280000,
    targetCloseDate: "Oct 15, 2026",
    progressPercent: 60,
    milestones: [
      { id: "m1", phase: "Evaluation", title: "Compliance Gap Assessment", sellerOwner: "James Reynolds", buyerOwner: "VP Compliance", dueDate: "Aug 20", status: "completed", deliverable: "Gap Report" },
      { id: "m2", phase: "Technical Validation", title: "Proof of Concept (PoC) Sandbox", sellerOwner: "Mike Torres (SA)", buyerOwner: "Lead SecOps", dueDate: "Sep 05", status: "completed", deliverable: "PoC Success Criteria Sign-off" },
      { id: "m3", phase: "Commercial Alignment", title: "Tier 1 Pricing & Multi-Year Discount", sellerOwner: "James Reynolds", buyerOwner: "Finance Director", dueDate: "Sep 18", status: "in_progress", deliverable: "Approved Quote Proposal" },
      { id: "m4", phase: "Procurement & Legal", title: "DPA & Data Privacy Addendum", sellerOwner: "Legal Counsel", buyerOwner: "Corporate Counsel", dueDate: "Oct 05", status: "pending", deliverable: "Approved DPA" },
      { id: "m5", phase: "Executive Sign-Off", title: "Board Authorization & Signature", sellerOwner: "James Reynolds", buyerOwner: "CEO & CFO", dueDate: "Oct 15", status: "pending", deliverable: "Signed Contract" },
    ],
  },
];

export const MutualActionPlan: React.FC = () => {
  const [maps, setMaps] = useState<DealMAP[]>(SAMPLE_MAPS);
  const [selectedDealId, setSelectedDealId] = useState<string>("deal-101");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeMAP = maps.find((m) => m.dealId === selectedDealId) || maps[0];

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
  };

  const handleCopyBuyerLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAiRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 800);
  };

  const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
    completed: { bg: "var(--risk-healthy-bg)", color: "var(--risk-healthy)", label: "✓ Completed" },
    in_progress: { bg: "var(--risk-high-bg)", color: "var(--risk-high)", label: "⏳ In Progress" },
    pending: { bg: "var(--hs-surface)", color: "var(--hs-text-muted)", label: "○ Pending" },
    delayed: { bg: "var(--risk-critical-bg)", color: "var(--danger)", label: "⚠ Delayed" },
  };

  return (
    <div>
      {/* ── Top Header & Deal Selector ───────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: "13px", color: "var(--hs-text-muted)" }}>
            Buyer-Seller Shared Mutual Action Plans (Auto-Synced with HubSpot)
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select
            value={selectedDealId}
            onChange={(e) => setSelectedDealId(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--hs-border-dark)",
              background: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--hs-primary)",
              outline: "none",
            }}
          >
            {maps.map((m) => (
              <option key={m.dealId} value={m.dealId}>
                {m.dealName} (${(m.value / 1000).toFixed(0)}K)
              </option>
            ))}
          </select>
          <button className="btn btn-secondary btn-sm" onClick={handleAiRegenerate} disabled={isGenerating}>
            {isGenerating ? "Analyzing Deal..." : "🤖 AI Auto-Generate MAP"}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleCopyBuyerLink}>
            {copiedLink ? "✓ Shared Link Copied!" : "🔗 Share with Buyer"}
          </button>
        </div>
      </div>

      {/* ── Active Deal Summary Card ─────────────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "var(--sp-6)" }}
      >
        <div className="card-header">
          <div>
            <div className="card-title">{activeMAP.dealName} · Mutual Action Plan</div>
            <div className="card-subtitle">
              Account: <strong>{activeMAP.client}</strong> · Target Close: <strong>{activeMAP.targetCloseDate}</strong> · Value: <strong>${(activeMAP.value / 1000).toFixed(0)}K</strong>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--hs-primary)" }}>
              {activeMAP.progressPercent}% Completed
            </span>
            <div style={{ width: 120, height: 8, background: "var(--hs-surface-hover)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${activeMAP.progressPercent}%`, height: "100%", background: activeMAP.progressPercent > 50 ? "var(--risk-healthy)" : "var(--risk-high)", transition: "width 0.3s" }} />
            </div>
          </div>
        </div>

        {/* ── Milestones List ─────────────────────────────────────────── */}
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 40, paddingLeft: 16 }}>#</th>
                  <th>Phase & Milestone</th>
                  <th>Seller Champion</th>
                  <th>Buyer Counterpart</th>
                  <th>Target Date</th>
                  <th>Verified Deliverable</th>
                  <th style={{ textAlign: "right", paddingRight: 16 }}>Status (Click to Toggle)</th>
                </tr>
              </thead>
              <tbody>
                {activeMAP.milestones.map((ms, idx) => {
                  const s = STATUS_STYLES[ms.status];
                  return (
                    <tr
                      key={ms.id}
                      onClick={() => handleToggleMilestone(ms.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ paddingLeft: 16, fontFamily: "var(--font-mono)", color: "var(--hs-text-muted)" }}>
                        0{idx + 1}
                      </td>
                      <td>
                        <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 700, color: "var(--hs-text-muted)" }}>
                          {ms.phase}
                        </div>
                        <div style={{ fontWeight: 600, color: "var(--hs-text)", fontSize: "13px", marginTop: 2 }}>
                          {ms.title}
                        </div>
                      </td>
                      <td style={{ fontSize: "12.5px" }}>{ms.sellerOwner}</td>
                      <td style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--hs-primary)" }}>{ms.buyerOwner}</td>
                      <td style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }}>{ms.dueDate}</td>
                      <td style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>{ms.deliverable}</td>
                      <td style={{ textAlign: "right", paddingRight: 16 }}>
                        <span
                          className="badge"
                          style={{
                            background: s.bg,
                            color: s.color,
                            fontWeight: 700,
                            fontSize: "11px",
                            padding: "4px 10px",
                          }}
                        >
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
