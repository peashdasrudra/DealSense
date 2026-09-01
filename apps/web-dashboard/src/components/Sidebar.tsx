/**
 * DealSense Dashboard — Authentic HubSpot Enterprise Sidebar.
 * Highlighting Core RevOps Features and Top-1% Systems Architect Showcase.
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
  badgeColor?: string;
  isKeyFeature?: boolean;
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
      { id: "forecast", label: "Revenue Forecast", icon: "🔮", path: "/forecast", isKeyFeature: true },
      { id: "deals", label: "Deal Inspector", icon: "🎯", path: "/deals" },
      { id: "heatmap", label: "Risk Heatmap", icon: "🔥", path: "/heatmap" },
    ],
  },
  {
    title: "Sales Execution & Actions",
    items: [
      { id: "actions", label: "Action Queue", icon: "⚡", path: "/actions", badge: "5 NEW", badgeColor: "#ff5c35", isKeyFeature: true },
      { id: "map", label: "Mutual Action Plans", icon: "🗺️", path: "/map", isKeyFeature: true },
      { id: "battlecards", label: "Battlecards & Objections", icon: "⚔️", path: "/battlecards" },
    ],
  },
  {
    title: "RevOps Automation",
    items: [
      { id: "hygiene", label: "CRM Hygiene", icon: "🧹", path: "/hygiene", badge: "6 AT RISK", badgeColor: "var(--warning)", isKeyFeature: true },
      { id: "reps", label: "Rep Coaching", icon: "👥", path: "/reps" },
      { id: "clients", label: "Client Health", icon: "🏢", path: "/clients" },
    ],
  },
  {
    title: "Architect Portfolio & Hiring",
    items: [
      { id: "case-study", label: "Case Study & $99 Pilot", icon: "✨", path: "/case-study", badge: "TOP 1%", badgeColor: "#00a4bd", isKeyFeature: true },
    ],
  },
  {
    title: "Governance & Security",
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#ffffff" }}>
      {/* ── Brand Header with Mobile Close ───────────────────────────── */}
      <div
        className="sidebar-brand"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 18px 12px",
          borderBottom: "1px solid var(--hs-border-dark)",
        }}
      >
        <DealSenseLogo size="md" tagline="Revenue Intelligence" />
        {onClose && (
          <button
            onClick={onClose}
            className="sidebar-close-btn"
            style={{
              background: "var(--hs-surface)",
              border: "1px solid var(--hs-border-dark)",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              color: "var(--hs-primary)",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "var(--shadow-sm)",
            }}
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── HubSpot Connected Account Profile Card ───────────────────── */}
      <div style={{ padding: "12px 14px 8px" }}>
        <div
          style={{
            padding: "10px 12px",
            background: "linear-gradient(135deg, #f9fbfb 0%, #f4f8f8 100%)",
            border: "1px solid var(--hs-border-dark)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--risk-healthy)", display: "inline-block", boxShadow: "0 0 6px rgba(0, 164, 189, 0.4)" }} />
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#ff5c35", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                HubSpot CRM Live
              </span>
            </div>
            <span style={{ fontSize: "10px", color: "var(--hs-text-muted)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
              #48921820
            </span>
          </div>

          <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--hs-primary)" }}>
            AiXpert Labs Workspace
          </div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 2, display: "flex", justifyContent: "space-between" }}>
            <span>Diamond Partner Tier</span>
            <span style={{ fontWeight: 600, color: "var(--hs-primary)" }}>20 Deals Synced</span>
          </div>
        </div>
      </div>

      {/* ── Top-1% Builder Portfolio Callout Pill ─────────────────────── */}
      <div style={{ padding: "0 14px 6px" }}>
        <div
          onClick={() => handleNav("/case-study")}
          style={{
            padding: "8px 12px",
            background: "linear-gradient(90deg, #ff5c35 0%, #ff7a59 100%)",
            color: "#ffffff",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(255, 92, 53, 0.25)",
            transition: "transform 0.15s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: "13px" }}>✨</span>
            <span style={{ fontSize: "11.5px", fontWeight: 700 }}>Hire Builder · $99 Pilot</span>
          </div>
          <span style={{ fontSize: "10px", background: "rgba(255,255,255,0.25)", padding: "1px 6px", borderRadius: "var(--radius-pill)", fontWeight: 800 }}>
            TOP 1%
          </span>
        </div>
      </div>

      {/* ── Categorized Navigation Links ─────────────────────────────── */}
      <div className="sidebar-nav" style={{ flex: 1, padding: "4px 10px", overflowY: "auto" }}>
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={section.title} style={{ marginBottom: sIdx === NAV_SECTIONS.length - 1 ? 4 : 12 }}>
            <div
              className="sidebar-section-label"
              style={{
                paddingLeft: 10,
                fontSize: "10px",
                color: "var(--hs-text-muted)",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
                marginTop: 2,
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
                  style={{
                    position: "relative",
                    background: active ? "var(--hs-primary)" : undefined,
                    color: active ? "#ffffff" : "var(--hs-text)",
                    borderLeft: active ? "3px solid #ff5c35" : "3px solid transparent",
                  }}
                >
                  <span style={{ fontSize: "15px", lineHeight: 1 }}>{item.icon}</span>
                  <span style={{ flex: 1, fontWeight: active ? 700 : 500, fontSize: "13px" }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      style={{
                        background: active ? "rgba(255,255,255,0.2)" : item.badgeColor ? `${item.badgeColor}18` : "var(--hs-surface-hover)",
                        color: active ? "#ffffff" : item.badgeColor || "var(--hs-text-muted)",
                        border: active ? "none" : item.badgeColor ? `1px solid ${item.badgeColor}40` : "none",
                        padding: "1px 7px",
                        borderRadius: "var(--radius-pill)",
                        fontSize: "10px",
                        fontWeight: 800,
                        letterSpacing: "0.02em",
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
      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--hs-border-dark)", background: "var(--hs-surface)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-primary)" }}>
              AES-256 Webhooks
            </div>
            <div style={{ fontSize: "10px", color: "var(--hs-text-muted)" }}>
              HMAC Signature Verified
            </div>
          </div>
          <span className="badge" style={{ background: "var(--risk-healthy-bg)", color: "var(--risk-healthy)", fontSize: "10px", fontWeight: 700 }}>
            ● Verified
          </span>
        </div>
      </div>
    </div>
  );
};
