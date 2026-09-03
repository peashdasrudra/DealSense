/**
 * DealSense — Premium HubSpot-Grade Enterprise Sidebar Navigation.
 * 
 * Design principles matching HubSpot's actual sidebar:
 * - Clean white background with subtle borders
 * - Compact nav items with refined hover states
 * - Active item uses subtle teal background tint (not full dark block)
 * - Muted uppercase section headers with tight spacing
 * - SVG icons instead of emoji for professional appearance
 * - Minimal badge usage — only on high-priority items
 * - Collapsible sections
 * - Brand wordmark at top, not a large logo block
 */

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DealSenseIcon } from "./DealSenseLogo";

/* ── SVG Icon Components (HubSpot-grade minimal line icons) ──────────── */

const Icon: React.FC<{ d: string; size?: number }> = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

/* Reusable path data for each nav icon */
const ICONS: Record<string, React.ReactNode> = {
  overview: <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />,
  forecast: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  waterfall: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="3" y="3" width="4" height="18" rx="1" />
      <rect x="10" y="8" width="4" height="13" rx="1" />
      <rect x="17" y="13" width="4" height="8" rx="1" />
    </svg>
  ),
  deals: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  warroom: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  stakeholders: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  heatmap: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  actions: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  map: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  battlecards: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  playbooks: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  hygiene: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  reps: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  clients: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  casestudy: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  audit: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  settings: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
};

/* ── Navigation Structure ──────────────────────────────────────────────── */

interface NavItem {
  id: string;
  label: string;
  iconKey: string;
  path: string;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Core MVP (Free Marketplace)",
    defaultOpen: true,
    items: [
      { id: "overview", label: "Pipeline Overview", iconKey: "overview", path: "/pipeline" },
      { id: "deals", label: "Deal Inspector", iconKey: "deals", path: "/deals", badge: "Live" },
      { id: "actions", label: "Action Queue", iconKey: "actions", path: "/actions" },
      { id: "agency", label: "Agency Fleet Partner", iconKey: "clients", path: "/agency", badge: "Retainer" },
    ],
  },
  {
    title: "Enterprise Pro (Paid / Beta)",
    defaultOpen: false,
    items: [
      { id: "forecast", label: "Revenue Forecast", iconKey: "forecast", path: "/forecast", badge: "Pro" },
      { id: "waterfall", label: "Pipeline Waterfall", iconKey: "waterfall", path: "/waterfall", badge: "Pro" },
      { id: "warroom", label: "Deal War Room", iconKey: "warroom", path: "/war-room", badge: "Pro" },
      { id: "stakeholders", label: "Stakeholder Matrix", iconKey: "stakeholders", path: "/stakeholders", badge: "Pro" },
      { id: "heatmap", label: "Risk Heatmap", iconKey: "heatmap", path: "/heatmap", badge: "Pro" },
      { id: "map", label: "Mutual Action Plans", iconKey: "map", path: "/map", badge: "Pro" },
      { id: "battlecards", label: "Battlecards", iconKey: "battlecards", path: "/battlecards", badge: "Pro" },
      { id: "playbooks", label: "RevOps Playbooks", iconKey: "playbooks", path: "/playbooks", badge: "Pro" },
      { id: "hygiene", label: "CRM Hygiene", iconKey: "hygiene", path: "/hygiene", badge: "Pro" },
      { id: "reps", label: "Rep Coaching", iconKey: "reps", path: "/reps", badge: "Pro" },
      { id: "clients", label: "Client Health", iconKey: "clients", path: "/clients", badge: "Pro" },
    ],
  },
  {
    title: "HubSpot Marketplace & Trust",
    defaultOpen: true,
    items: [
      { id: "compliance", label: "App Partner Certification", iconKey: "audit", path: "/compliance", badge: "100/100" },
      { id: "onboarding", label: "Marketplace Setup Flow", iconKey: "playbooks", path: "/onboarding" },
      { id: "listing", label: "Marketplace Directory View", iconKey: "casestudy", path: "/marketplace-listing" },
      { id: "case-study", label: "Architecture Case Study", iconKey: "casestudy", path: "/case-study" },
      { id: "audit", label: "Audit Log & Telemetry", iconKey: "audit", path: "/audit" },
      { id: "settings", label: "HubSpot Integration Hub", iconKey: "settings", path: "/settings" },
    ],
  },
];

/* ── Sidebar Component ─────────────────────────────────────────────────── */

interface SidebarProps {
  onClose?: () => void;
  onNavigateHome?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose, onNavigateHome }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(NAV_SECTIONS.filter((s) => !s.defaultOpen).map((s) => s.title))
  );

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" || location.pathname === "/landing";
    return location.pathname.startsWith(path);
  };

  const handleNav = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogoClick = () => {
    if (onNavigateHome) onNavigateHome();
    else handleNav("/pipeline");
    if (onClose) onClose();
  };

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#ffffff",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* ── Brand Header ────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 16px",
          borderBottom: "1px solid var(--hs-border-dark)",
          flexShrink: 0,
        }}
      >
        <div
          onClick={handleLogoClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            padding: "2px 4px",
            borderRadius: "var(--radius-sm)",
            transition: "background 0.12s",
          }}
          title="DealSense Home"
        >
          <DealSenseIcon size={22} />
          <span style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--hs-primary)", letterSpacing: "-0.02em" }}>
            Deal<span style={{ color: "#ff5c35" }}>Sense</span>
          </span>
        </div>

        {/* Mobile close button — hidden on desktop via CSS */}
        {onClose && (
          <button
            onClick={onClose}
            className="sidebar-close-btn"
            style={{
              background: "none",
              border: "1px solid var(--hs-border-dark)",
              width: 28,
              height: 28,
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              cursor: "pointer",
              color: "var(--hs-text-muted)",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Workspace Indicator ──────────────────────────────────────── */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--hs-border-dark)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--radius-sm)",
              background: "linear-gradient(135deg, var(--hs-primary), #0a3537)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            HL
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-text)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              HubAiLab Fleet
            </div>
            <div style={{ fontSize: "10.5px", color: "var(--hs-text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--risk-healthy)", display: "inline-block" }} />
              HubSpot Portal #48920193
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 0" }}>
        {NAV_SECTIONS.map((section) => {
          const isCollapsed = collapsedSections.has(section.title);

          return (
            <div key={section.title} style={{ marginBottom: 4 }}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 16px 4px",
                  background: "none",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  cursor: "pointer",
                  color: "#516f90",
                  fontFamily: "var(--font-sans)",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#516f90",
                  }}
                >
                  {section.title}
                </span>
                <svg
                  width={10}
                  height={10}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#516f90"
                  strokeWidth={2.5}
                  style={{
                    transition: "transform 0.15s ease",
                    transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                    opacity: 0.6,
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Section Items */}
              {!isCollapsed && (
                <div style={{ padding: "2px 8px 6px" }}>
                  {section.items.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.path)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "7px 10px",
                          borderRadius: "var(--radius-sm)",
                          background: active ? "rgba(0, 164, 189, 0.08)" : "transparent",
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          cursor: "pointer",
                          color: active ? "#007a8c" : "#33475b",
                          fontFamily: "var(--font-sans)",
                          fontSize: "13px",
                          fontWeight: active ? 600 : 450,
                          textAlign: "left",
                          transition: "all 0.1s ease",
                          marginBottom: 1,
                          position: "relative",
                          WebkitTapHighlightColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) (e.currentTarget as HTMLElement).style.background = "#f5f8fa";
                        }}
                        onMouseLeave={(e) => {
                          if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                      >
                        {/* Active indicator bar */}
                        {active && (
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: 3,
                              height: 16,
                              borderRadius: "0 2px 2px 0",
                              background: "#00a4bd",
                            }}
                          />
                        )}

                        <span style={{ color: active ? "#00a4bd" : "#7c98b6", transition: "color 0.1s" }}>
                          {ICONS[item.iconKey] || null}
                        </span>
                        <span style={{ flex: 1, lineHeight: 1.2 }}>{item.label}</span>

                        {item.badge && (
                          <span
                            style={{
                              fontSize: "9px",
                              fontWeight: 700,
                              padding: "1px 5px",
                              borderRadius: "3px",
                              background: "#edf1f5",
                              color: "#516f90",
                              border: "1px solid #cbd6e2",
                              lineHeight: 1.3,
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--hs-border-dark)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "10.5px", color: "var(--hs-text-muted)" }}>
            <span style={{ fontWeight: 600 }}>v1.0.0</span> · 48/48 tests
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--risk-healthy)",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--risk-healthy)" }}>
              Healthy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
