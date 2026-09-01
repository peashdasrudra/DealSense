/**
 * DealSense Dashboard — Authentic HubSpot Enterprise Top Navigation Bar.
 * Visible HubSpot connection status on all devices (mobile + desktop).
 */

import React, { useState } from "react";
import { DealSenseIcon } from "./DealSenseLogo";

interface TopBarProps {
  breadcrumb?: string;
  title: string;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  onOpenSidebar,
  onOpenSearch,
}) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [portalSelectOpen, setPortalSelectOpen] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState("AiXpert Labs (48921820)");

  const PORTALS = [
    { id: "48921820", name: "AiXpert Labs", tier: "Diamond Partner", deals: 20 },
    { id: "19284711", name: "TechCorp Global", tier: "Enterprise Portal", deals: 12 },
    { id: "88210943", name: "FinanceGo Production", tier: "Client Workspace", deals: 8 },
  ];

  return (
    <header className="main-header">
      {/* ── Left: Hamburger Toggle & HubSpot Brand ─────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <button
          className="mobile-nav-toggle"
          onClick={onOpenSidebar}
          aria-label="Open Navigation Menu"
        >
          ☰
        </button>

        {/* Logo and Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <DealSenseIcon size={28} />
          <div className="topbar-brand-text">
            <span style={{ fontWeight: 700, color: "#2d3e50", fontSize: "15px" }}>Deal</span>
            <span style={{ fontWeight: 800, color: "#ff5c35", fontSize: "15px" }}>Sense</span>
          </div>
        </div>

        {/* Title Divider & Breadcrumb (Desktop) */}
        <div className="topbar-title-section">
          <span style={{ color: "var(--hs-border-dark)", fontSize: "18px", margin: "0 6px" }}>/</span>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--hs-text)" }}>{title}</span>
        </div>
      </div>

      {/* ── Center / Right: Live HubSpot Connection Pill & Actions ────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {/* HubSpot Portal Pill (Always Visible on Mobile & Desktop) */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setPortalSelectOpen(!portalSelectOpen)}
            className="hubspot-portal-pill"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              background: "#ffffff",
              border: "1px solid var(--hs-border-dark)",
              borderRadius: "var(--radius-pill)",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--hs-primary)",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--risk-healthy)", display: "inline-block" }} />
            <span style={{ color: "#ff5c35", fontWeight: 700 }}>HubSpot:</span>
            <span className="portal-pill-name">{selectedPortal}</span>
            <span style={{ fontSize: "9px", color: "var(--hs-text-muted)" }}>▾</span>
          </button>

          {/* Portal Switcher Dropdown */}
          {portalSelectOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 6,
                width: 270,
                background: "#ffffff",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--hs-border-dark)",
                padding: "8px",
                zIndex: 150,
              }}
            >
              <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--hs-text-muted)", padding: "4px 8px 6px" }}>
                Connected HubSpot Portals
              </div>
              {PORTALS.map((portal) => (
                <div
                  key={portal.id}
                  onClick={() => {
                    setSelectedPortal(`${portal.name} (${portal.id})`);
                    setPortalSelectOpen(false);
                  }}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    background: selectedPortal.includes(portal.id) ? "var(--hs-surface-hover)" : "transparent",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--hs-primary)" }}>
                      {portal.name}
                    </div>
                    <div style={{ fontSize: "10.5px", color: "var(--hs-text-muted)" }}>
                      Portal: {portal.id} · {portal.tier}
                    </div>
                  </div>
                  <span className="badge" style={{ background: "var(--risk-healthy-bg)", color: "var(--risk-healthy)", fontSize: "9.5px" }}>
                    {portal.deals} Deals
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Quick Search Pill */}
        <button
          className="header-search-btn"
          onClick={onOpenSearch}
          title="Search deals & contacts"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "var(--hs-surface)",
            border: "1px solid var(--hs-border-dark)",
            borderRadius: "var(--radius-sm)",
            padding: "5px 10px",
            cursor: "pointer",
            color: "var(--hs-text-muted)",
            fontSize: "12px",
          }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <span className="search-text-label">Search</span>
          <span className="search-kbd-shortcut">/</span>
        </button>

        {/* Risk Alerts Notification Bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              background: "var(--hs-surface)",
              border: "1px solid var(--hs-border-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              color: "var(--hs-primary)",
              fontSize: "15px",
            }}
            aria-label="View Risk Notifications"
          >
            🔔
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--danger)",
                border: "1.5px solid #ffffff",
              }}
            />
          </button>

          {notificationOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 6,
                width: 300,
                background: "#ffffff",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--hs-border-dark)",
                padding: "10px",
                zIndex: 150,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, paddingBottom: 6, borderBottom: "1px solid var(--hs-border-dark)" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)" }}>HubSpot Risk Alerts</span>
                <span className="badge" style={{ background: "var(--risk-critical-bg)", color: "var(--danger)", fontSize: "9px" }}>3 Critical</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ padding: "6px 8px", background: "var(--risk-critical-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--risk-critical-border)", fontSize: "11.5px" }}>
                  <strong>Orion Cloud</strong>: 18d CFO silence (TechCorp)
                </div>
                <div style={{ padding: "6px 8px", background: "var(--risk-high-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--risk-high-border)", fontSize: "11.5px" }}>
                  <strong>Quantum Security</strong>: Overdue close date by 18d
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
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
            fontSize: "11.5px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          AX
        </div>
      </div>
    </header>
  );
};
