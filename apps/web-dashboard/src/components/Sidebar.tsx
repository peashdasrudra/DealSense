/**
 * DealSense Dashboard — Sidebar Navigation Component.
 * Official HubSpot Canvas Design System Edition with Full RevOps Suite.
 */

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number | string;
}

const INTELLIGENCE_ITEMS: NavItem[] = [
  { id: "overview", label: "Portfolio Overview", icon: "📊", path: "/" },
  { id: "forecast", label: "Revenue Forecast", icon: "🔮", path: "/forecast" },
  { id: "deals", label: "Deal Explorer", icon: "🎯", path: "/deals" },
  { id: "actions", label: "Action Queue", icon: "⚡", path: "/actions", badge: 5 },
  { id: "heatmap", label: "Risk Heatmap", icon: "🔥", path: "/heatmap" },
];

const REVOPS_OPERATIONS: NavItem[] = [
  { id: "hygiene", label: "CRM Hygiene & Remediation", icon: "🧹", path: "/hygiene", badge: "6" },
  { id: "reps", label: "Rep Coaching & Velocity", icon: "👥", path: "/reps" },
  { id: "clients", label: "Client Health", icon: "🏢", path: "/clients" },
];

const SYSTEM_ITEMS: NavItem[] = [
  { id: "audit", label: "Audit & Governance", icon: "📋", path: "/audit" },
  { id: "settings", label: "Settings & Calibration", icon: "⚙️", path: "/settings" },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleNav = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* ── Brand ────────────────────────────────────────────────────── */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">DS</div>
        <div>
          <div style={{ fontWeight: 700, color: "var(--hs-primary)", lineHeight: 1.2, fontSize: "15px" }}>
            DealSense
          </div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", fontWeight: 500 }}>
            RevOps Command Center
          </div>
        </div>
      </div>

      {/* ── Nav Links ────────────────────────────────────────────────── */}
      <div className="sidebar-nav">
        <div className="sidebar-section-label">Revenue Intelligence</div>
        {INTELLIGENCE_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <div
              key={item.id}
              className={`sidebar-link ${active ? "active" : ""}`}
              onClick={() => handleNav(item.path)}
            >
              <span style={{ fontSize: "15px" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    background: active ? "rgba(255,255,255,0.25)" : "var(--hs-surface-hover)",
                    color: active ? "var(--hs-on-primary)" : "var(--hs-primary)",
                    border: active ? "none" : "1px solid var(--hs-border-dark)",
                    padding: "1px 6px",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "10.5px",
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}

        <div className="sidebar-section-label" style={{ marginTop: 20 }}>
          RevOps Operations
        </div>
        {REVOPS_OPERATIONS.map((item) => {
          const active = isActive(item.path);
          return (
            <div
              key={item.id}
              className={`sidebar-link ${active ? "active" : ""}`}
              onClick={() => handleNav(item.path)}
            >
              <span style={{ fontSize: "15px" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    background: active ? "rgba(255,255,255,0.25)" : "var(--risk-critical-bg)",
                    color: active ? "var(--hs-on-primary)" : "var(--danger)",
                    padding: "1px 6px",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "10.5px",
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}

        <div className="sidebar-section-label" style={{ marginTop: 20 }}>
          System & Governance
        </div>
        {SYSTEM_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <div
              key={item.id}
              className={`sidebar-link ${active ? "active" : ""}`}
              onClick={() => handleNav(item.path)}
            >
              <span style={{ fontSize: "15px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div style={{ padding: "var(--sp-4)", borderTop: "1px solid var(--hs-border-dark)", background: "var(--hs-surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--hs-primary)",
              color: "var(--hs-on-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "12px",
            }}
          >
            AX
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--hs-primary)" }}>
              AiXpert Labs
            </div>
            <div style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>
              HubSpot Diamond Partner
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
