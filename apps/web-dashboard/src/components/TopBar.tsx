/**
 * DealSense Dashboard — Enterprise Top Navigation Bar.
 * Official HubSpot Canvas Design System Edition with Portal Switcher, Live Telemetry Pulse & Quick Search.
 */

import React, { useState } from "react";
import { DealSenseLogo } from "./DealSenseLogo";

interface TopBarProps {
  breadcrumb: string;
  title: string;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  breadcrumb,
  title,
  onOpenSidebar,
  onOpenSearch,
}) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [portalSelectOpen, setPortalSelectOpen] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState("AiXpert Labs (Diamond)");

  const PORTALS = [
    { id: "p1", name: "AiXpert Labs (Diamond)", tier: "Primary Agency", deals: 20 },
    { id: "p2", name: "TechCorp Global Portal", tier: "Client Workspace", deals: 12 },
    { id: "p3", name: "FinanceGo Production", tier: "Client Workspace", deals: 8 },
  ];

  return (
    <header className="main-header">
      {/* ── Left: Mobile Toggle, Logo & Breadcrumb ───────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <button
          className="mobile-nav-toggle"
          onClick={onOpenSidebar}
          aria-label="Open Navigation Menu"
        >
          ☰
        </button>

        {/* Mobile-only logo */}
        <div className="mobile-only-logo" style={{ display: "none" }}>
          <DealSenseLogo size="sm" showWordmark={false} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div className="main-header-breadcrumb">{breadcrumb}</div>
          <h1 className="main-header-title">{title}</h1>
        </div>
      </div>

      {/* ── Right: Portal Switcher, Search, Notifications & Profile ─── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {/* HubSpot Portal Selector (Desktop/Tablet) */}
        <div style={{ position: "relative" }} className="portal-selector-wrapper">
          <button
            onClick={() => setPortalSelectOpen(!portalSelectOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              background: "var(--hs-surface)",
              border: "1px solid var(--hs-border-dark)",
              borderRadius: "var(--radius-sm)",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--hs-primary)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "14px" }}>🏢</span>
            <span className="portal-name-label">{selectedPortal}</span>
            <span style={{ fontSize: "10px", color: "var(--hs-text-muted)" }}>▼</span>
          </button>

          {portalSelectOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 6,
                width: 260,
                background: "#ffffff",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--hs-border-dark)",
                padding: "8px",
                zIndex: 150,
              }}
            >
              <div style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", color: "var(--hs-text-muted)", padding: "4px 8px 8px" }}>
                Connected HubSpot Portals
              </div>
              {PORTALS.map((portal) => (
                <div
                  key={portal.id}
                  onClick={() => {
                    setSelectedPortal(portal.name);
                    setPortalSelectOpen(false);
                  }}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    background: selectedPortal === portal.name ? "var(--hs-surface-hover)" : "transparent",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--hs-primary)" }}>
                      {portal.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>
                      {portal.tier}
                    </div>
                  </div>
                  <span className="badge badge-outline" style={{ fontSize: "10px" }}>
                    {portal.deals} Deals
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Quick Search Pill */}
        <div
          className="header-search-pill"
          onClick={onOpenSearch}
          title="Press / or click to search"
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--hs-text-muted)" strokeWidth={2}>
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <span className="search-text-label" style={{ fontSize: "13px", color: "var(--hs-text-muted)" }}>
            Search deals, reps, signals...
          </span>
          <span
            className="search-kbd-shortcut"
            style={{
              fontSize: "10.5px",
              background: "#ffffff",
              border: "1px solid var(--hs-border-dark)",
              padding: "1px 5px",
              borderRadius: "4px",
              color: "var(--hs-text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            /
          </span>
        </div>

        {/* Risk Alerts Notification Bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-sm)",
              background: "var(--hs-surface)",
              border: "1px solid var(--hs-border-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              color: "var(--hs-primary)",
              fontSize: "16px",
            }}
            aria-label="View Risk Notifications"
          >
            🔔
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--danger)",
                border: "2px solid #ffffff",
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
                width: 320,
                background: "#ffffff",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--hs-border-dark)",
                padding: "12px",
                zIndex: 150,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid var(--hs-border-dark)" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--hs-primary)" }}>Telemetry Risk Alerts</span>
                <span className="badge" style={{ background: "var(--risk-critical-bg)", color: "var(--danger)" }}>3 Critical</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ padding: "8px", background: "var(--risk-critical-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--risk-critical-border)", fontSize: "12px" }}>
                  <strong>Orion Cloud Migration</strong>: 18d silence from CFO Richard Vance.
                </div>
                <div style={{ padding: "8px", background: "var(--risk-high-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--risk-high-border)", fontSize: "12px" }}>
                  <strong>Quantum Security Suite</strong>: Close date overdue by 18 days.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Online Dot */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--hs-primary)",
              color: "var(--hs-on-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "12.5px",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            AX
          </div>
          <span
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "var(--risk-healthy)",
              border: "2px solid #ffffff",
            }}
          />
        </div>
      </div>
    </header>
  );
};
