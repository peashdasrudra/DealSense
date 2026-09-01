/**
 * DealSense — Autonomous RevOps Playbook Engine.
 * Enables revenue leaders and agencies to automate conditional deal rescue workflows, multi-threading alerts, and date slip policies.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PlaybookRule {
  id: string;
  name: string;
  category: "Executive Multi-Threading" | "CRM Hygiene" | "Competitive Defense" | "Deal Velocity";
  isActive: boolean;
  triggerEvent: string;
  condition: string;
  automatedAction: string;
  dealsImpacted: number;
  revenueProtected: number;
  lastFired: string;
}

const INITIAL_PLAYBOOKS: PlaybookRule[] = [
  {
    id: "pb-1",
    name: "CFO Ghosting & Multi-Threading Protocol",
    category: "Executive Multi-Threading",
    isActive: true,
    triggerEvent: "HubSpot Deal Ingestion Event",
    condition: "Deal Value ≥ $100,000 AND Economic Buyer Silent for ≥ 14 Days",
    automatedAction: "Auto-draft VP Sales peer-to-peer alignment email & dispatch High-Priority Slack alert",
    dealsImpacted: 3,
    revenueProtected: 430000,
    lastFired: "18 mins ago",
  },
  {
    id: "pb-2",
    name: "Autonomous Past-Due Date Remediation",
    category: "CRM Hygiene",
    isActive: true,
    triggerEvent: "Daily Scheduled RevOps Hygiene Audit",
    condition: "Close Date Past Due by ≥ 7 Days AND Stage ≠ Closed Won/Lost",
    automatedAction: "Auto-push close date +30 days, increment 'Date Slip Counter' property in HubSpot, notify owner",
    dealsImpacted: 6,
    revenueProtected: 545000,
    lastFired: "2 hours ago",
  },
  {
    id: "pb-3",
    name: "Single-Threaded Champion Multi-Threading",
    category: "Deal Velocity",
    isActive: true,
    triggerEvent: "Deal Moved to Proposal / Negotiation",
    condition: "Contacts Count = 1 (Zero VP/C-Level Stakeholders Attached)",
    automatedAction: "Auto-generate Mutual Action Plan (MAP) link & create 'Identify Economic Buyer' task for Rep",
    dealsImpacted: 4,
    revenueProtected: 365000,
    lastFired: "Yesterday",
  },
  {
    id: "pb-4",
    name: "Gong / Clari Competitive Objection Killer",
    category: "Competitive Defense",
    isActive: true,
    triggerEvent: "Meeting Note Synced via HubSpot Activity Stream",
    condition: "Call Notes / Transcript mentions 'Gong', 'Clari', or 'Spreadsheets'",
    automatedAction: "Instantly attach competitive battlecard & objection talk track to rep's deal dossier",
    dealsImpacted: 2,
    revenueProtected: 280000,
    lastFired: "3 hours ago",
  },
];

export const RevOpsPlaybooks: React.FC = () => {
  const [playbooks, setPlaybooks] = useState<PlaybookRule[]>(INITIAL_PLAYBOOKS);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [newPlaybookOpen, setNewPlaybookOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    name: "",
    category: "Executive Multi-Threading",
    condition: "",
    action: "",
  });

  const activeCount = playbooks.filter((p) => p.isActive).length;
  const totalProtected = playbooks.reduce((sum, p) => sum + (p.isActive ? p.revenueProtected : 0), 0);

  const togglePlaybook = (id: string) => {
    setPlaybooks((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleSimulateAll = () => {
    setSimulating(true);
    setSimResult(null);
    setTimeout(() => {
      setSimulating(false);
      setSimResult("✓ Simulated 20 active deals: 4 triggers fired, $1.62M in pipeline slip risk proactively remediated.");
    }, 900);
  };

  const handleCreatePlaybook = (e: React.FormEvent) => {
    e.preventDefault();
    const created: PlaybookRule = {
      id: `pb-${Date.now()}`,
      name: newForm.name,
      category: newForm.category as any,
      isActive: true,
      triggerEvent: "Real-Time Webhook Pipeline",
      condition: newForm.condition || "Deal Ingestion Trigger",
      automatedAction: newForm.action || "Auto-create task in HubSpot",
      dealsImpacted: 1,
      revenueProtected: 120000,
      lastFired: "Just now",
    };
    setPlaybooks([created, ...playbooks]);
    setNewPlaybookOpen(false);
    setNewForm({ name: "", category: "Executive Multi-Threading", condition: "", action: "" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      {/* ── Playbooks Header Card ─────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          padding: "20px 24px",
          border: "1px solid var(--hs-border-dark)",
          borderTop: "3px solid var(--hs-primary)",
          marginBottom: "var(--sp-5)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge" style={{ background: "var(--risk-healthy-bg)", color: "var(--risk-healthy)", fontWeight: 700 }}>
                ● {activeCount} PLAYBOOKS LIVE
              </span>
              <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>HubSpot Automated Policy Engine</span>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--hs-heading)", margin: "4px 0 6px" }}>
              Autonomous RevOps Playbooks & Trigger Engine
            </h2>
            <p style={{ fontSize: "13.5px", color: "var(--hs-text)", margin: 0, maxWidth: 680 }}>
              Set conditional rules that automatically rescue stalled deals, auto-remediate past-due close dates, and multi-thread silent economic buyers without manual sales rep effort.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <button
              style={{
                padding: "6px 14px",
                background: "#ffffff",
                color: "var(--hs-text)",
                border: "1px solid var(--hs-border-dark)",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s"
              }}
            >
              Export Playbook
            </button>
            <button
              style={{
                padding: "6px 14px",
                background: "#ff5c35",
                color: "#ffffff",
                border: "none",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s"
              }}
            >
              Create Playbook
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn btn-secondary"
              onClick={handleSimulateAll}
              disabled={simulating}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.25)",
                fontSize: "13px",
              }}
            >
              {simulating ? "↻ Simulating Pipeline..." : "⚡ Run Live Simulation"}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setNewPlaybookOpen(true)}
              style={{ background: "#ff5c35", fontWeight: 700, fontSize: "13px" }}
            >
              + Create New Playbook
            </button>
          </div>
        </div>

        {simResult && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 16,
              padding: "10px 14px",
              background: "rgba(0, 164, 189, 0.2)",
              border: "1px solid #00a4bd",
              borderRadius: "var(--radius-sm)",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#e6ffff",
            }}
          >
            {simResult}
          </motion.div>
        )}
      </div>

      {/* ── Summary KPI Metrics ───────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card" style={{ borderTopColor: "var(--risk-healthy)" }}>
          <div className="kpi-title">Active Playbooks</div>
          <div className="kpi-value" style={{ color: "var(--risk-healthy)" }}>{activeCount} Active</div>
          <div className="kpi-subtitle">Running sub-200ms evaluations</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#ff5c35" }}>
          <div className="kpi-title">Pipeline Revenue Protected</div>
          <div className="kpi-value" style={{ color: "#ff5c35" }}>
            ${(totalProtected / 1000).toFixed(0)}K
          </div>
          <div className="kpi-subtitle">Across active conditional triggers</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--hs-primary)" }}>
          <div className="kpi-title">Deals Auto-Remediated</div>
          <div className="kpi-value">15 Deals</div>
          <div className="kpi-subtitle">Zero manual rep data entry needed</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#00a4bd" }}>
          <div className="kpi-title">Hours Saved / Week</div>
          <div className="kpi-value" style={{ color: "#ff7a59" }}>14.2 hrs</div>
          <div className="kpi-subtitle">Per RevOps team member</div>
        </div>
      </div>

      {/* ── Playbooks List ────────────────────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Configured Autonomous Playbooks</div>
            <div className="card-subtitle">Real-time webhook triggers synced with HubSpot CRM properties</div>
          </div>
          <span className="badge" style={{ background: "var(--risk-healthy-bg)", color: "var(--risk-healthy)", fontWeight: 700 }}>
            ● HubSpot Webhook Listener Active
          </span>
        </div>

        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {playbooks.map((pb) => (
            <div
              key={pb.id}
              style={{
                padding: "18px 20px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--hs-border-dark)",
                background: pb.isActive ? "#ffffff" : "var(--hs-surface)",
                opacity: pb.isActive ? 1 : 0.65,
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span className="badge badge-outline" style={{ fontSize: "10px", fontWeight: 700 }}>
                      {pb.category}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>
                      Last fired: {pb.lastFired}
                    </span>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--hs-primary)" }}>
                    {pb.name}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--hs-primary)" }}>
                      ${(pb.revenueProtected / 1000).toFixed(0)}K Protected
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>
                      {pb.dealsImpacted} Deals Remediated
                    </div>
                  </div>

                  <button
                    onClick={() => togglePlaybook(pb.id)}
                    className={`btn ${pb.isActive ? "btn-secondary" : "btn-primary"} btn-sm`}
                    style={{ fontSize: "11.5px", fontWeight: 700, minWidth: 70 }}
                  >
                    {pb.isActive ? "Pause" : "Activate"}
                  </button>
                </div>
              </div>

              {/* Condition -> Action Flow Logic Box */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 12,
                  padding: "12px 14px",
                  background: "var(--hs-surface)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--hs-border-dark)",
                }}
              >
                <div>
                  <div style={{ fontSize: "10.5px", textTransform: "uppercase", fontWeight: 700, color: "var(--hs-text-muted)", marginBottom: 2 }}>
                    Trigger Condition
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--hs-primary)", fontFamily: "var(--font-mono)" }}>
                    IF {pb.condition}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "10.5px", textTransform: "uppercase", fontWeight: 700, color: "var(--hs-text-muted)", marginBottom: 2 }}>
                    Autonomous Action
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#ff5c35" }}>
                    THEN {pb.automatedAction}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Create Playbook Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {newPlaybookOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewPlaybookOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(18, 69, 72, 0.5)", zIndex: 400 }}
            />
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              style={{
                position: "fixed",
                top: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                maxWidth: "540px",
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 410,
                overflow: "hidden",
                border: "1px solid var(--hs-border-dark)",
              }}
            >
              <div style={{ padding: "16px 20px", background: "var(--hs-surface)", borderBottom: "1px solid var(--hs-border-dark)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--hs-primary)" }}>
                  Create Autonomous RevOps Playbook
                </div>
                <button onClick={() => setNewPlaybookOpen(false)} className="btn btn-secondary btn-sm">✕</button>
              </div>

              <form onSubmit={handleCreatePlaybook} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", marginBottom: 4 }}>
                    Playbook Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Legal Review 14-Day Escalation"
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    className="modal-form-input"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    value={newForm.category}
                    onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                    className="modal-form-input"
                    style={{ background: "#ffffff" }}
                  >
                    <option value="Executive Multi-Threading">Executive Multi-Threading</option>
                    <option value="CRM Hygiene">CRM Hygiene</option>
                    <option value="Competitive Defense">Competitive Defense</option>
                    <option value="Deal Velocity">Deal Velocity</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", marginBottom: 4 }}>
                    Trigger Condition (IF) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Deal Value ≥ $50K AND Legal Stage > 10 Days"
                    value={newForm.condition}
                    onChange={(e) => setNewForm({ ...newForm, condition: e.target.value })}
                    className="modal-form-input"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", marginBottom: 4 }}>
                    Automated Action (THEN) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Auto-notify General Counsel & create high-priority task"
                    value={newForm.action}
                    onChange={(e) => setNewForm({ ...newForm, action: e.target.value })}
                    className="modal-form-input"
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setNewPlaybookOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ background: "#ff5c35", fontWeight: 700 }}>
                    ⚡ Deploy Playbook
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
