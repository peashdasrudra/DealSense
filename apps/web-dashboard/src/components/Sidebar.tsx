/**
 * DealSense Dashboard — Authentic HubSpot Enterprise Sidebar.
 * Displays HubSpot Connected Account Profile, Portal ID, and Instant Navigation.
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* ── Brand Header with Mobile Close ───────────────────────────── */}
      <div
        className="sidebar-brand"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 16px",
        }}
      >
        <DealSenseLogo size="md" tagline="Revenue Intelligence" />
        {onClose && (
          <button
            onClick={onClose}
            className="sidebar-close-btn"
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "var(--hs-text-muted)",
              padding: "4px",
              display: "none",
            }}
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── HubSpot Connected Account Card (Top of Sidebar) ─────────── */}
      <div style={{ padding: "0 14px 10px" }}>
        <div
          style={{
            padding: "10px 12px",
            background: "#ffffff",
            border: "1px solid var(--hs-border-dark)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--risk-healthy)", display: "inline-block" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#ff5c35", textTransform: "uppercase" }}>
                HubSpot Connected
              </span>
            </div>
            <span style={{ fontSize: "10px", color: "var(--hs-text-muted)", fontFamily: "var(--font-mono)" }}>
              ID: 48921820
            </span>
          </div>

          <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--hs-primary)" }}>
            AiXpert Labs Workspace
          </div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 2 }}>
            Diamond Partner · 20 Deals Monitored
          </div>
        </div>
      </div>

      {/* ── Navigation Links ─────────────────────────────────────────── */}
      <div className="sidebar-nav" style={{ flex: 1, padding: "4px 10px" }}>
        <div className="sidebar-section-label" style={{ paddingLeft: 10, fontSize: "10px", color: "var(--hs-text-muted)", fontWeight: 700 }}>
          Navigation
        </div>
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

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--hs-border-dark)", background: "var(--hs-surface)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
            AES-256 Webhook Active
          </div>
          <span className="badge" style={{ background: "var(--risk-healthy-bg)", color: "var(--risk-healthy)", fontSize: "9.5px" }}>
            ● Live
          </span>
        </div>
      </div>
    </div>
  );
};
