/**
 * DealSense Dashboard — Enterprise Audit Trail & Governance Log.
 * Full audit record of AI extractions, scoring runs, action approvals, and CRM write-backs.
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalAuditLogs, saveLocalAuditLogs, logAuditEvent, AuditLogItem } from "../api";

const STATUS_MAP: Record<string, { bg: string; color: string; border: string }> = {
  Success: { bg: "rgba(0, 189, 165, 0.1)", color: "#007a70", border: "rgba(0, 189, 165, 0.3)" },
  Reverted: { bg: "rgba(245, 194, 107, 0.15)", color: "#b36b00", border: "rgba(245, 194, 107, 0.4)" },
  Blocked: { bg: "rgba(242, 84, 91, 0.1)", color: "#d93843", border: "rgba(242, 84, 91, 0.3)" },
  Pending: { bg: "var(--hs-surface)", color: "var(--hs-text-muted)", border: "var(--hs-border-dark)" },
};

export const AuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLog, setNewLog] = useState({
    actor: "Peash Rudra",
    role: "VP of Revenue Operations",
    actionType: "Manual Stage Override",
    targetObject: "Deal #deal-ent-101",
    tier: "Tier 3 (Executive Action)",
    status: "Success" as "Success" | "Reverted" | "Blocked" | "Pending",
    details: "Manually validated economic buyer credentials and authorized contract dispatch.",
  });

  const loadLogs = () => {
    setLogs(getLocalAuditLogs());
  };

  useEffect(() => {
    loadLogs();
    const handleUpdate = () => loadLogs();
    window.addEventListener("dealsense:audit-updated", handleUpdate);
    return () => window.removeEventListener("dealsense:audit-updated", handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const filteredLogs = logs.filter((l) => {
    const matchesFilter = filter === "All" || l.status === filter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.targetObject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ["ID", "Timestamp", "Actor", "Role", "Action Type", "Target Entity", "Governance Tier", "Status", "Details"];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.role}"`,
      `"${l.actionType}"`,
      `"${l.targetObject}"`,
      `"${l.tier}"`,
      l.status,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dealsense_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`✓ Exported ${filteredLogs.length} audit trail records to CSV`);
  };

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear all audit records? You can reset them anytime.")) {
      saveLocalAuditLogs([]);
      showToast("✓ Audit log cleared.");
    }
  };

  const handleResetLogs = () => {
    localStorage.removeItem("dealsense_crud_audit");
    loadLogs();
    showToast("✓ Audit trail reset to initial verified logs.");
  };

  const handleCreateCustomLog = (e: React.FormEvent) => {
    e.preventDefault();
    logAuditEvent({
      actor: newLog.actor,
      role: newLog.role,
      actionType: newLog.actionType,
      targetObject: newLog.targetObject,
      tier: newLog.tier,
      status: newLog.status,
      details: newLog.details,
    });
    setShowAddModal(false);
    showToast(`✓ Logged custom event: ${newLog.actionType}`);
  };

  const successCount = logs.filter((l) => l.status === "Success").length;
  const blockedCount = logs.filter((l) => l.status === "Blocked").length;
  const revertedCount = logs.filter((l) => l.status === "Reverted").length;
  const successRate = logs.length > 0 ? Math.round((successCount / logs.length) * 100) : 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      {/* ── Enterprise Header ─────────────────────────────────────────── */}
      <div className="page-header-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="page-header-badge-row">
              <span className="page-header-badge">
                ● REVOPS GOVERNANCE TELEMETRY
              </span>
            </div>
            <h2 className="page-header-title">
              Enterprise Audit Trail &amp; Governance Log
            </h2>
            <p className="page-header-desc">
              Immutable audit record of all telemetry extractions, scoring runs, action approvals, and HubSpot bidirectional write-backs.
            </p>
          </div>

          <div className="page-header-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleExportCSV}
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              📥 Export CSV
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAddModal(true)}
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              + Add Audit Event
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleResetLogs}
              title="Reset to default sample audit records"
              style={{ fontSize: "12px" }}
            >
              ↻ Reset
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleClearLogs}
              style={{ fontSize: "12px", color: "var(--danger)" }}
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 14,
              padding: "10px 14px",
              background: "rgba(0, 189, 165, 0.12)",
              border: "1px solid rgba(0, 189, 165, 0.3)",
              borderRadius: "var(--radius-sm)",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#007a70",
            }}
          >
            {toastMsg}
          </motion.div>
        )}
      </div>

      {/* ── Summary KPI Badges ────────────────────────────────────────── */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderTopColor: "var(--hs-primary)" }}>
          <div className="kpi-label">Total Audit Events</div>
          <div className="kpi-value" style={{ color: "var(--hs-heading)" }}>{logs.length}</div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Recorded in local persistence &amp; API proxy
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--risk-healthy)" }}>
          <div className="kpi-label">Success Rate</div>
          <div className="kpi-value" style={{ color: "var(--risk-healthy)" }}>{successRate}%</div>
          <div style={{ fontSize: "11px", color: "var(--risk-healthy)", fontWeight: 600, marginTop: 4 }}>
            {successCount} Successful Write-Backs
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--danger)" }}>
          <div className="kpi-label">Blocked Safeguards</div>
          <div className="kpi-value" style={{ color: "var(--danger)" }}>{blockedCount}</div>
          <div style={{ fontSize: "11px", color: "var(--danger)", marginTop: 4 }}>
            RBAC &amp; compliance violations halted
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--warning)" }}>
          <div className="kpi-label">Reverted Actions</div>
          <div className="kpi-value" style={{ color: "var(--warning)" }}>{revertedCount}</div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Human-in-the-loop rollbacks
          </div>
        </div>
      </div>

      {/* ── Table Container ───────────────────────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ margin: 0 }}
      >
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 260 }}>
            <div className="card-title" style={{ whiteSpace: "nowrap" }}>Event &amp; Write-Back Audit Trail</div>
            <span className="badge badge-outline">{filteredLogs.length} matching events</span>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Search by actor, entity, action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--hs-border-dark)",
                outline: "none",
                minWidth: 220,
              }}
            />

            <div style={{ display: "flex", gap: 4, background: "var(--hs-surface-hover)", padding: 3, borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
              {["All", "Success", "Reverted", "Blocked"].map((status) => (
                <button
                  key={status}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: filter === status ? "var(--hs-primary)" : "transparent",
                    color: filter === status ? "#ffffff" : "var(--hs-text)",
                    fontSize: "11.5px",
                    fontWeight: filter === status ? 700 : 500,
                    cursor: "pointer",
                  }}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="desktop-audit-table table-responsive">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor / Role</th>
                <th>Action Type</th>
                <th>Target Entity</th>
                <th>Governance Tier</th>
                <th>Status</th>
                <th>Operation Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--hs-text-muted)" }}>
                    No audit records match your current filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const s = STATUS_MAP[log.status] || STATUS_MAP.Pending;
                  return (
                    <tr key={log.id}>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px", color: "var(--hs-text-muted)", whiteSpace: "nowrap" }}>
                        {log.timestamp}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--hs-primary)", fontSize: "12.5px" }}>{log.actor}</div>
                        <div style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>{log.role}</div>
                      </td>
                      <td style={{ fontWeight: 600, fontSize: "12.5px", color: "var(--hs-heading)" }}>{log.actionType}</td>
                      <td style={{ fontSize: "12px", color: "var(--hs-text-muted)", fontFamily: "var(--font-mono)" }}>{log.targetObject}</td>
                      <td>
                        <span className="badge badge-outline" style={{ fontSize: "10.5px" }}>
                          {log.tier}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontWeight: 700, fontSize: "11px" }}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "var(--hs-text)", maxWidth: 320, lineHeight: 1.45 }}>
                        {log.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Audit Cards (<640px) */}
        <div className="mobile-audit-cards">
          {filteredLogs.map((log) => {
            const s = STATUS_MAP[log.status] || STATUS_MAP.Pending;
            return (
              <div key={log.id} className="mobile-audit-card" style={{ padding: "12px", borderBottom: "1px solid var(--hs-border-dark)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--hs-primary)" }}>
                    {log.actionType}
                  </div>
                  <span className="badge" style={{ background: s.bg, color: s.color, fontWeight: 700, fontSize: "10px" }}>
                    {log.status}
                  </span>
                </div>

                <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginBottom: 4 }}>
                  {log.actor} ({log.role}) · <code>{log.targetObject}</code>
                </div>

                <div style={{ fontSize: "12px", color: "var(--hs-text)", lineHeight: 1.4, marginBottom: 6 }}>
                  {log.details}
                </div>

                <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", fontFamily: "var(--font-mono)" }}>
                  {log.timestamp} · {log.tier}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Add Custom Audit Event Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(18, 69, 72, 0.4)", zIndex: 400 }}
            />
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              style={{
                position: "fixed",
                top: "14%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                maxWidth: "520px",
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
                  Record Governance Audit Event
                </div>
                <button onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">✕</button>
              </div>

              <form onSubmit={handleCreateCustomLog} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 4 }}>
                    Actor Name &amp; Role
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <input
                      type="text"
                      required
                      value={newLog.actor}
                      onChange={(e) => setNewLog({ ...newLog, actor: e.target.value })}
                      placeholder="e.g. James Reynolds"
                      style={{ padding: "7px 10px", fontSize: "12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)" }}
                    />
                    <input
                      type="text"
                      required
                      value={newLog.role}
                      onChange={(e) => setNewLog({ ...newLog, role: e.target.value })}
                      placeholder="e.g. VP Sales Ops"
                      style={{ padding: "7px 10px", fontSize: "12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 4 }}>
                      Action Type
                    </label>
                    <input
                      type="text"
                      required
                      value={newLog.actionType}
                      onChange={(e) => setNewLog({ ...newLog, actionType: e.target.value })}
                      placeholder="e.g. Manual Stage Override"
                      style={{ width: "100%", padding: "7px 10px", fontSize: "12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 4 }}>
                      Target Entity
                    </label>
                    <input
                      type="text"
                      required
                      value={newLog.targetObject}
                      onChange={(e) => setNewLog({ ...newLog, targetObject: e.target.value })}
                      placeholder="e.g. Deal #deal-ent-101"
                      style={{ width: "100%", padding: "7px 10px", fontSize: "12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 4 }}>
                      Governance Tier
                    </label>
                    <select
                      value={newLog.tier}
                      onChange={(e) => setNewLog({ ...newLog, tier: e.target.value })}
                      style={{ width: "100%", padding: "7px 10px", fontSize: "12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)" }}
                    >
                      <option value="Tier 1 (Continuous Telemetry)">Tier 1 (Continuous Telemetry)</option>
                      <option value="Tier 2 (Assisted Task)">Tier 2 (Assisted Task)</option>
                      <option value="Tier 3 (Automated Write-Back)">Tier 3 (Automated Write-Back)</option>
                      <option value="Tier 4 (Executive Action)">Tier 4 (Executive Action)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 4 }}>
                      Status
                    </label>
                    <select
                      value={newLog.status}
                      onChange={(e) => setNewLog({ ...newLog, status: e.target.value as any })}
                      style={{ width: "100%", padding: "7px 10px", fontSize: "12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)" }}
                    >
                      <option value="Success">Success</option>
                      <option value="Reverted">Reverted</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 4 }}>
                    Operation Details
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newLog.details}
                    onChange={(e) => setNewLog({ ...newLog, details: e.target.value })}
                    placeholder="Describe the telemetry decision, CRM mutation, or blocked compliance action..."
                    style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ background: "var(--hs-primary)", fontWeight: 700 }}>
                    Save Audit Entry
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

