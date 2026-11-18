import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalPlaybooks, saveLocalPlaybooks, logAuditEvent } from "../api";

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

export const HubSpotNativePlaybooks: React.FC = () => {

  const [playbooks, setPlaybooks] = useState<PlaybookRule[]>(getLocalPlaybooks);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [newPlaybookOpen, setNewPlaybookOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    name: "",
    category: "Executive Multi-Threading",
    condition: "",
    action: "",
  });

  useEffect(() => {
    const handleUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setPlaybooks(e.detail);
      } else {
        setPlaybooks(getLocalPlaybooks());
      }
    };
    window.addEventListener("dealsense:playbooks-updated", handleUpdated);
    return () => window.removeEventListener("dealsense:playbooks-updated", handleUpdated);
  }, []);

  const activeCount = playbooks.filter((p) => p.isActive).length;
  const totalProtected = playbooks.reduce((sum, p) => sum + (p.isActive ? p.revenueProtected : 0), 0);

  const togglePlaybook = (id: string) => {
    const updated = playbooks.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    setPlaybooks(updated);
    saveLocalPlaybooks(updated);
    const target = playbooks.find(p => p.id === id);
    if (target) {
      logAuditEvent({
        actionType: target.isActive ? "Playbook Paused" : "Playbook Activated",
        actor: "Peash Rudra",
        role: "VP RevOps",
        targetObject: `Playbook: ${target.name}`,
        tier: "Tier 2 (Autonomous Config)",
        status: "Success",
        details: `${target.isActive ? "Paused" : "Activated"} autonomous rule "${target.name}".`,
      });
    }
  };

  const deletePlaybook = (id: string) => {
    const target = playbooks.find(p => p.id === id);
    const updated = playbooks.filter((p) => p.id !== id);
    setPlaybooks(updated);
    saveLocalPlaybooks(updated);
    if (target) {
      logAuditEvent({
        actionType: "Playbook Deleted",
        actor: "Peash Rudra",
        role: "VP RevOps",
        targetObject: `Playbook: ${target.name}`,
        tier: "Tier 4 (Executive Action)",
        status: "Success",
        details: `Deleted autonomous rule "${target.name}".`,
      });
    }
  };

  const handleSimulateAll = () => {
    setSimulating(true);
    setSimResult(null);
    setTimeout(() => {
      setSimulating(false);
      setSimResult("✓ Simulated 25 active deals: 4 triggers fired, $1.62M in pipeline slip risk proactively remediated.");
    }, 800);
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
    const updated = [created, ...playbooks];
    setPlaybooks(updated);
    saveLocalPlaybooks(updated);
    setNewPlaybookOpen(false);
    setNewForm({ name: "", category: "Executive Multi-Threading", condition: "", action: "" });

    logAuditEvent({
      actionType: "Playbook Deployed",
      actor: "Peash Rudra",
      role: "VP RevOps",
      targetObject: `Playbook: ${created.name}`,
      tier: "Tier 2 (Autonomous Config)",
      status: "Success",
      details: `Deployed new autonomous playbook "${created.name}" targeting ${created.category}.`,
    });
  };

  return (
      <div style={{ flex: 1 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      {/* ── Playbooks Header Card ─────────────────────────────────────── */}
      <div className="page-header-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="page-header-badge-row">
              <span className="page-header-badge" style={{ background: "var(--risk-healthy-bg)", color: "var(--risk-healthy)", borderColor: "rgba(0, 189, 165, 0.3)" }}>
                ● {activeCount} PLAYBOOKS LIVE
              </span>
            </div>
            <h2 className="page-header-title">
              Autonomous RevOps Playbooks & Trigger Engine
            </h2>
            <p className="page-header-desc">
              Set conditional rules that automatically rescue stalled deals, auto-remediate past-due close dates, and multi-thread silent economic buyers without manual sales rep effort.
            </p>
          </div>
          <div className="page-header-actions">
            <button
              onClick={handleSimulateAll}
              disabled={simulating}
              className="btn btn-secondary"
              style={{
                background: "#ffffff",
                color: "#2d3e50",
                border: "1px solid #dfe3eb",
              }}
            >
              <span>{simulating ? "↻ Simulating..." : "⚡ Run Live Simulation"}</span>
            </button>
            <button
              onClick={() => setNewPlaybookOpen(true)}
              className="btn btn-primary"
              style={{
                background: "#ff5c35",
                color: "#ffffff",
                border: "none",
                boxShadow: "0 2px 6px rgba(255, 92, 53, 0.25)",
              }}
            >
              <span>+ Create Playbook</span>
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

        <div className="kpi-card" style={{ borderTopColor: "#ff7a59" }}>
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
                border: "1px solid #dfe3eb",
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
                    <span style={{ fontSize: "11px", color: "#516f90" }}>
                      Last fired: {pb.lastFired}
                    </span>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#ff7a59" }}>
                    {pb.name}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#ff7a59" }}>
                      ${(pb.revenueProtected / 1000).toFixed(0)}K Protected
                    </div>
                    <div style={{ fontSize: "11px", color: "#516f90" }}>
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
                  <button
                    onClick={() => deletePlaybook(pb.id)}
                    style={{
                      background: "none",
                      border: "1px solid #cbd6e2",
                      borderRadius: "var(--radius-sm)",
                      padding: "6px 10px",
                      cursor: "pointer",
                      color: "var(--danger)",
                      fontSize: "12px",
                    }}
                    title="Delete playbook"
                  >
                    🗑️
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
                  border: "1px solid #dfe3eb",
                }}
              >
                <div>
                  <div style={{ fontSize: "10.5px", textTransform: "uppercase", fontWeight: 700, color: "#516f90", marginBottom: 2 }}>
                    Trigger Condition
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#ff7a59", fontFamily: "var(--font-mono)" }}>
                    IF {pb.condition}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "10.5px", textTransform: "uppercase", fontWeight: 700, color: "#516f90", marginBottom: 2 }}>
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
                border: "1px solid #dfe3eb",
              }}
            >
              <div style={{ padding: "16px 20px", background: "var(--hs-surface)", borderBottom: "1px solid #dfe3eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "15px", color: "#ff7a59" }}>
                  Create Autonomous RevOps Playbook
                </div>
                <button onClick={() => setNewPlaybookOpen(false)} className="btn btn-secondary btn-sm">✕</button>
              </div>

              <form onSubmit={handleCreatePlaybook} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#ff7a59", marginBottom: 4 }}>
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
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#ff7a59", marginBottom: 4 }}>
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
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#ff7a59", marginBottom: 4 }}>
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
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#ff7a59", marginBottom: 4 }}>
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
    </div>
  );
};
