/**
 * DealSense Dashboard — Sidebar Navigation Component.
 * Canvas Design System Edition.
 */

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Portfolio Overview", icon: "📊", path: "/" },
  { id: "clients", label: "Client Health", icon: "🏢", path: "/clients" },
  { id: "deals", label: "Deal Explorer", icon: "🎯", path: "/deals" },
  { id: "actions", label: "Action Queue", icon: "⚡", path: "/actions", badge: 7 },
  { id: "heatmap", label: "Risk Heatmap", icon: "🔥", path: "/heatmap" },
];

const SECONDARY_ITEMS: NavItem[] = [
  { id: "audit", label: "Audit Log", icon: "📋", path: "/audit" },
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
      {/* ── Brand ────────────────────────────────────────────────────── */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">DS</div>
        <div>
          <div style={{ fontWeight: 700, color: "var(--hs-text)", lineHeight: 1.2 }}>DealSense</div>
          <div style={{ fontSize: 12, color: "var(--hs-text-muted)" }}>Command Center</div>
        </div>
      </div>

      {/* ── Primary Nav ──────────────────────────────────────────────── */}
      <div className="sidebar-nav">
        <div className="sidebar-section-label">Intelligence</div>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <div
              key={item.id}
              className={`sidebar-link ${active ? "active" : ""}`}
              onClick={() => handleNav(item.path)}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span
                  style={{
                    background: active ? "rgba(255,255,255,0.2)" : "var(--hs-border)",
                    color: active ? "var(--hs-on-primary)" : "var(--hs-text)",
                    padding: "2px 6px",
                    borderRadius: "var(--radius-pill)",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}

        <div className="sidebar-section-label" style={{ marginTop: 24 }}>
          System
        </div>
        {SECONDARY_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
            onClick={() => handleNav(item.path)}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div style={{ padding: "var(--sp-4)", borderTop: "1px solid var(--hs-border-dark)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              fontSize: 12,
            }}
          >
            AX
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--hs-text)" }}>
              AiXpert Labs
            </div>
            <div style={{ fontSize: 11, color: "var(--hs-text-muted)" }}>
              Agency Owner
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
