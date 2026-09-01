/**
 * DealSense Dashboard — Authentic HubSpot Enterprise Sidebar.
 * Complete RevOps Suite with Categorized Navigation.
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

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Revenue Intelligence",
    items: [
      { id: "overview", label: "Pipeline Overview", icon: "📊", path: "/" },
      { id: "forecast", label: "Revenue Forecast", icon: "🔮", path: "/forecast" },
      { id: "deals", label: "Deal Inspector", icon: "🎯", path: "/deals" },
      { id: "heatmap", label: "Risk Heatmap", icon: "🔥", path: "/heatmap" },
    ],
  },
  {
    title: "Execution & Actions",
    items: [
      { id: "actions", label: "Action Queue", icon: "⚡", path: "/actions", badge: 5 },
      { id: "map", label: "Mutual Action Plans", icon: "🗺️", path: "/map" },
      { id: "battlecards", label: "Battlecards & Objections", icon: "⚔️", path: "/battlecards" },
    ],
  },
  {
    title: "RevOps Operations",
    items: [
      { id: "hygiene", label: "CRM Hygiene", icon: "🧹", path: "/hygiene", badge: 6 },
      { id: "reps", label: "Rep Coaching", icon: "👥", path: "/reps" },
      { id: "clients", label: "Client Health", icon: "🏢", path: "/clients" },
    ],
  },
  {
    title: "Portfolio & Engineering",
    items: [
      { id: "case-study", label: "Executive Case Study", icon: "✨", path: "/case-study", badge: "PORTFOLIO" },
    ],
  },
  {
    title: "Governance & System",
    items: [
      { id: "audit", label: "Audit Trail", icon: "📋", path: "/audit" },
      { id: "settings", label: "Settings", icon: "⚙️", path: "/settings" },
    ],
  },
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

      {/* ── HubSpot Connected Account Card ───────────────────────────── */}
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
                HubSpot Live
              </span>
            </div>
            <span style={{ fontSize: "10px", color: "var(--hs-text-muted)", fontFamily: "var(--font-mono)" }}>
              #48921820
            </span>
          </div>

          <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--hs-primary)" }}>
            AiXpert Labs Workspace
          </div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 2 }}>
            Diamond Partner · 20 Deals Synced
          </div>
        </div>
      </div>

      {/* ── Categorized Navigation Links ─────────────────────────────── */}
      <div className="sidebar-nav" style={{ flex: 1, padding: "4px 10px", overflowY: "auto" }}>
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={section.title} style={{ marginBottom: sIdx === NAV_SECTIONS.length - 1 ? 4 : 14 }}>
            <div
              className="sidebar-section-label"
              style={{
                paddingLeft: 10,
                fontSize: "10px",
                color: "var(--hs-text-muted)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 4,
              }}
            >
              {section.title}
            </div>
            {section.items.map((item) => {
              const active = isActive(item.path);
              return (
                <div
                  key={item.id}
                  className={`sidebar-link ${active ? "active" : ""}`}
                  onClick={() => handleNav(item.path)}
                >
                  <span style={{ fontSize: "15px", lineHeight: 1 }}>{item.icon}</span>
                  <span style={{ flex: 1, fontWeight: active ? 700 : 500, fontSize: "13px" }}>{item.label}</span>
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
        ))}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid var(--hs-border-dark)", background: "var(--hs-surface)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>
            AES-256 Webhooks
          </div>
          <span className="badge" style={{ background: "var(--risk-healthy-bg)", color: "var(--risk-healthy)", fontSize: "9.5px" }}>
            ● Verified
          </span>
        </div>
      </div>
    </div>
  );
};
