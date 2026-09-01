/**
 * DealSense Dashboard — Minimalist Sidebar Navigation.
 * Streamlined, high-utility navigation without redundancy.
 */

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DealSenseLogo } from "./DealSenseLogo";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number | string;
}

const PRIMARY_NAV: NavItem[] = [
  { id: "overview", label: "Pipeline Overview", icon: "📊", path: "/" },
  { id: "deals", label: "Deal Inspector", icon: "🎯", path: "/deals" },
  { id: "actions", label: "Action Queue", icon: "⚡", path: "/actions", badge: 5 },
  { id: "hygiene", label: "CRM Hygiene", icon: "🧹", path: "/hygiene", badge: 6 },
  { id: "audit", label: "Audit Trail", icon: "📋", path: "/audit" },
  { id: "settings", label: "Settings", icon: "⚙️", path: "/settings" },
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
      {/* ── Brand Header ─────────────────────────────────────────────── */}
      <div className="sidebar-brand">
        <DealSenseLogo size="md" tagline="Revenue Intelligence" />
      </div>

      {/* ── Nav Links ────────────────────────────────────────────────── */}
      <div className="sidebar-nav">
        {PRIMARY_NAV.map((item) => {
          const active = isActive(item.path);
          return (
            <div
              key={item.id}
              className={`sidebar-link ${active ? "active" : ""}`}
              onClick={() => handleNav(item.path)}
            >
              <span style={{ fontSize: "16px", lineHeight: 1 }}>{item.icon}</span>
              <span style={{ flex: 1, fontWeight: active ? 600 : 500 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    background: active ? "rgba(255,255,255,0.2)" : "var(--hs-surface-hover)",
                    color: active ? "#ffffff" : "var(--hs-text-muted)",
                    padding: "1px 6px",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Minimal Footer ───────────────────────────────────────────── */}
      <div style={{ padding: "14px 16px", borderTop: "1px solid var(--hs-border-dark)", background: "var(--hs-surface)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--risk-healthy)", display: "inline-block" }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--hs-text)" }}>
              HubSpot Connected
            </span>
          </div>
          <span style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>v1.4</span>
        </div>
      </div>
    </>
  );
};
