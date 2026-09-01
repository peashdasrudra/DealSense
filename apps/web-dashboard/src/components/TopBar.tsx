/**
 * DealSense Dashboard — Authentic HubSpot Enterprise Top Navigation Bar.
 * 100% Responsive, Zero Horizontal Overflow on Mobile Devices (320px–420px).
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
  const [selectedPortal, setSelectedPortal] = useState({ name: "AiXpert Labs", id: "48921820", tier: "Diamond Partner", deals: 20 });

  const PORTALS = [
    { id: "48921820", name: "AiXpert Labs", tier: "Diamond Partner", deals: 20 },
    { id: "19284711", name: "TechCorp Global", tier: "Enterprise Portal", deals: 12 },
    { id: "88210943", name: "FinanceGo Production", tier: "Client Workspace", deals: 8 },
  ];

  return (
    <header className="main-header">
      {/* ── Left: Hamburger Toggle & HubSpot Brand ─────────────────────── */}
      <div className="header-left">
        <button
          className="mobile-nav-toggle"
          onClick={onOpenSidebar}
          aria-label="Open Navigation Menu"
        >
          ☰
        </button>

        {/* Brand Logo & Name */}
        <div className="header-brand-wrap" onClick={onOpenSidebar}>
          <DealSenseIcon size={26} />
          <div className="topbar-brand-text">
            <span style={{ fontWeight: 700, color: "#2d3e50" }}>Deal</span>
            <span style={{ fontWeight: 800, color: "#ff5c35" }}>Sense</span>
          </div>
        </div>

        {/* Divider & Page Title (Desktop only) */}
        <div className="topbar-title-section">
          <span className="title-divider">/</span>
          <span className="header-page-title">{title}</span>
        </div>
      </div>

      {/* ── Right: Live HubSpot Connection Pill & Quick Actions ──────── */}
      <div className="header-right">
        {/* HubSpot Portal Pill (Compact on Mobile, Full on Desktop) */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setPortalSelectOpen(!portalSelectOpen)}
            className="hubspot-portal-pill"
            aria-label="Switch HubSpot Portal"
          >
            <span className="portal-live-dot" />
            <span className="portal-hubspot-label">HubSpot:</span>
            <span className="portal-pill-name">{selectedPortal.id}</span>
            <span className="portal-caret">▾</span>
          </button>

          {/* Portal Switcher Dropdown */}
          {portalSelectOpen && (
            <div className="portal-dropdown-menu">
              <div className="portal-dropdown-header">
                Connected HubSpot Portals
              </div>
              {PORTALS.map((portal) => (
                <div
                  key={portal.id}
                  onClick={() => {
                    setSelectedPortal(portal);
                    setPortalSelectOpen(false);
                  }}
                  className={`portal-dropdown-item ${selectedPortal.id === portal.id ? "active" : ""}`}
                >
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--hs-primary)" }}>
                      {portal.name}
                    </div>
                    <div style={{ fontSize: "10.5px", color: "var(--hs-text-muted)" }}>
                      Portal #{portal.id} · {portal.tier}
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

        {/* Global Quick Search Button */}
        <button
          className="header-search-btn"
          onClick={onOpenSearch}
          aria-label="Search pipeline"
          title="Search deals & contacts"
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
            className="header-icon-btn"
            aria-label="View Risk Notifications"
          >
            🔔
            <span className="bell-badge-dot" />
          </button>

          {notificationOpen && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)" }}>HubSpot Risk Alerts</span>
                <span className="badge" style={{ background: "var(--risk-critical-bg)", color: "var(--danger)", fontSize: "9px" }}>3 Critical</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ padding: "6px 8px", background: "var(--risk-critical-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--risk-critical-border)", fontSize: "11px" }}>
                  <strong>Orion Cloud</strong>: 18d CFO silence (TechCorp)
                </div>
                <div style={{ padding: "6px 8px", background: "var(--risk-high-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--risk-high-border)", fontSize: "11px" }}>
                  <strong>Quantum Security</strong>: Overdue close date by 18d
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="header-avatar" onClick={onOpenSidebar} title="AiXpert Labs Profile">
          AX
        </div>
      </div>
    </header>
  );
};
