/**
 * DealSense Dashboard — Enterprise Audit Trail & Governance Log.
 * Full audit record of AI extractions, scoring runs, action approvals, and CRM write-backs.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  actionType: string;
  targetObject: string;
  tier: string;
  status: "Success" | "Reverted" | "Blocked" | "Pending";
  details: string;
}

const SAMPLE_AUDIT_LOGS: AuditEntry[] = [
  {
    id: "aud-901",
    timestamp: "Today, 11:42 PM",
    actor: "James Reynolds",
    role: "RevOps Lead",
    actionType: "CRM Stage Regression",
    targetObject: "Deal #deal-101 (Orion Cloud)",
    tier: "Tier 4 (High Risk)",
    status: "Success",
    details: "Reverted deal stage from Proposal Sent to Discovery due to missing economic buyer.",
  },
  {
    id: "aud-902",
    timestamp: "Today, 09:15 PM",
    actor: "DealSense AI Engine",
    role: "System Autonomous",
    actionType: "MEDDICC Extraction",
    targetObject: "Deal #deal-102 (Quantum Security)",
    tier: "Tier 1 (Observe)",
    status: "Success",
    details: "Extracted unquantified ROI risk from email thread with CFO Richard Vance.",
  },
  {
    id: "aud-903",
    timestamp: "Today, 06:30 PM",
    actor: "Sarah Miller",
    role: "Agency Owner",
    actionType: "HubSpot Task Write-Back",
    targetObject: "Deal #deal-103 (Horizon Data)",
    tier: "Tier 2 (Low Risk)",
    status: "Success",
    details: "Created high-priority task 'Schedule Executive Alignment Call' for deal owner.",
  },
  {
    id: "aud-904",
    timestamp: "Yesterday, 04:12 PM",
    actor: "Lisa Chen",
    role: "Account Manager",
    actionType: "Action Rollback",
    targetObject: "Deal #deal-104 (Apex CRM)",
    tier: "Tier 3 (Medium Risk)",
    status: "Reverted",
    details: "Rolled back automated close date slip by 14 days after rep confirmed meeting scheduled.",
  },
  {
    id: "aud-905",
    timestamp: "Yesterday, 02:00 PM",
    actor: "Security Guard",
    role: "RBAC Guard",
    actionType: "Unauthorized Write Blocked",
    targetObject: "Deal #deal-105 (Crown Global)",
    tier: "Tier 4 (High Risk)",
    status: "Blocked",
    details: "Blocked attempt by Sales Rep role to modify close date directly without manager approval.",
  },
];

const STATUS_MAP: Record<string, { bg: string; color: string }> = {
  Success: { bg: "var(--risk-healthy-bg)", color: "var(--risk-healthy)" },
  Reverted: { bg: "var(--risk-moderate-bg)", color: "var(--risk-moderate)" },
  Blocked: { bg: "var(--risk-critical-bg)", color: "var(--risk-critical)" },
  Pending: { bg: "var(--hs-surface)", color: "var(--hs-text-muted)" },
};

export const AuditLog: React.FC = () => {
  const [logs] = useState<AuditEntry[]>(SAMPLE_AUDIT_LOGS);
  const [filter, setFilter] = useState("All");

  const filteredLogs = logs.filter((l) => {
    if (filter === "All") return true;
    return l.status === filter;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)" }}>
        <div>
          <div style={{ fontSize: "13px", color: "var(--hs-text-muted)" }}>
            Immutable SOC2 & Enterprise Governance Log
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Success", "Reverted", "Blocked"].map((status) => (
            <button
              key={status}
              className={`btn btn-sm ${filter === status ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="card-header">
          <div className="card-title">Event & Write-Back Audit Trail</div>
          <span className="badge badge-outline">{filteredLogs.length} verified events</span>
        </div>
        <div style={{ overflowX: "auto" }}>
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
              {filteredLogs.map((log) => {
                const s = STATUS_MAP[log.status];
                return (
                  <tr key={log.id}>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--hs-text-muted)" }}>
                      {log.timestamp}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--hs-primary)" }}>{log.actor}</div>
                      <div style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>{log.role}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{log.actionType}</td>
                    <td style={{ fontSize: "12.5px", color: "var(--hs-text-muted)" }}>{log.targetObject}</td>
                    <td>
                      <span className="badge badge-outline" style={{ fontSize: "11px" }}>
                        {log.tier}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{ background: s.bg, color: s.color, fontWeight: 700 }}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "12.5px", color: "var(--hs-text)", maxWidth: 320 }}>
                      {log.details}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
