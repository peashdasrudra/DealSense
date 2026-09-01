/**
 * DealSense Dashboard — Authentic HubSpot Enterprise Top Navigation Bar.
 * Clean, small professional page title on mobile, with HubSpot Portal & Account Switcher inside the Avatar Menu.
 */

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const [selectedPortal, setSelectedPortal] = useState({
    id: "48921820",
    name: "AiXpert Labs Workspace",
    tier: "Diamond Partner",
    deals: 20,
    latency: "0.18s",
  });

  const PORTALS = [
    { id: "48921820", name: "AiXpert Labs Workspace", tier: "Diamond Partner", deals: 20, latency: "0.18s" },
    { id: "19284711", name: "TechCorp Global", tier: "Enterprise Portal", deals: 12, latency: "0.22s" },
    { id: "88210943", name: "FinanceGo Production", tier: "Client Workspace", deals: 8, latency: "0.19s" },
  ];

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleManualSync = () => {
    setSyncStatusMsg("↻ Synchronizing HubSpot Webhooks...");
    setTimeout(() => {
      setSyncStatusMsg("✓ 20 Deals Synced · Latency 0.18s");
      setTimeout(() => setSyncStatusMsg(null), 3000);
    }, 800);
  };

  return (
    <header className="main-header">
      {/* ── Left: Hamburger (Mobile) + Logo + Page Title ────────────── */}
      <div className="header-left">
        <button
          className="mobile-nav-toggle"
          onClick={onOpenSidebar}
          aria-label="Open Navigation Menu"
        >
          ☰
        </button>

        {/* Brand Logo */}
        <div className="header-brand-wrap" onClick={onOpenSidebar}>
          <DealSenseIcon size={24} />
          <div className="topbar-brand-text">
            <span style={{ fontWeight: 700, color: "#2d3e50" }}>Deal</span>
            <span style={{ fontWeight: 800, color: "#ff5c35" }}>Sense</span>
          </div>
        </div>

        {/* Page Title (Always Visible on Both Desktop and Mobile) */}
        <div className="topbar-title-section">
          <span className="title-divider">/</span>
          <h1 className="header-page-title">{title}</h1>
        </div>
      </div>

      {/* ── Right: Search + Notifications + HubSpot Profile Avatar ─── */}
      <div className="header-right">
        {/* Global Quick Search Button */}
        <button
          className="header-search-btn"
          onClick={onOpenSearch}
          aria-label="Search pipeline"
          title="Search deals, accounts & contacts ( / )"
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <span className="search-text-label">Search</span>
          <span className="search-kbd-shortcut">/</span>
        </button>

        {/* Risk Alerts Notification Bell */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setProfileMenuOpen(false);
            }}
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
                <span className="badge" style={{ background: "var(--risk-critical-bg)", color: "var(--danger)", fontSize: "9.5px", fontWeight: 700 }}>3 Critical</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ padding: "8px 10px", background: "var(--risk-critical-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--risk-critical-border)", fontSize: "11.5px" }}>
                  <strong>Orion Cloud</strong>: 18d CFO silence (TechCorp)
                </div>
                <div style={{ padding: "8px 10px", background: "var(--risk-high-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--risk-high-border)", fontSize: "11.5px" }}>
                  <strong>Quantum Security</strong>: Overdue close date by 18d
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── HubSpot Profile & Portal Switcher Dropdown (Top Right) ── */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <div
            className="header-avatar-btn"
            onClick={() => {
              setProfileMenuOpen(!profileMenuOpen);
              setNotificationOpen(false);
            }}
            title={`HubSpot Portal #${selectedPortal.id}`}
          >
            <span className="avatar-initials">AX</span>
            <span className="avatar-live-indicator" />
          </div>

          {profileMenuOpen && (
            <div className="hubspot-profile-menu">
              {/* User Account Info */}
              <div className="profile-menu-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="profile-large-avatar">AX</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--hs-primary)" }}>
                      Alex Morgan
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>
                      alex@aixpertlabs.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected HubSpot Portal Section */}
              <div style={{ padding: "10px 12px", background: "var(--hs-surface)", borderBottom: "1px solid var(--hs-border-dark)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--risk-healthy)", display: "inline-block" }} />
                    <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#ff5c35", textTransform: "uppercase" }}>
                      Connected HubSpot Portal
                    </span>
                  </div>
                  <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--hs-text-muted)" }}>
                    #{selectedPortal.id}
                  </span>
                </div>

                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--hs-primary)" }}>
                  {selectedPortal.name}
                </div>
                <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 2, display: "flex", justifyContent: "space-between" }}>
                  <span>{selectedPortal.tier}</span>
                  <span style={{ fontWeight: 600 }}>{selectedPortal.deals} Deals</span>
                </div>

                {syncStatusMsg && (
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--risk-healthy)", marginTop: 6 }}>
                    {syncStatusMsg}
                  </div>
                )}
              </div>

              {/* Switch HubSpot Portals List */}
              <div style={{ padding: "6px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--hs-text-muted)", padding: "4px 6px" }}>
                  Switch Portal
                </div>
                {PORTALS.map((portal) => (
                  <div
                    key={portal.id}
                    onClick={() => {
                      setSelectedPortal(portal);
                      setProfileMenuOpen(false);
                    }}
                    className={`portal-dropdown-item ${selectedPortal.id === portal.id ? "active" : ""}`}
                    style={{ padding: "6px 8px", borderRadius: "var(--radius-sm)" }}
                  >
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--hs-primary)" }}>
                        {portal.name}
                      </div>
                      <div style={{ fontSize: "10.5px", color: "var(--hs-text-muted)" }}>
                        #{portal.id} · {portal.deals} deals
                      </div>
                    </div>
                    {selectedPortal.id === portal.id && (
                      <span style={{ color: "var(--risk-healthy)", fontWeight: 700, fontSize: "12px" }}>✓</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Links */}
              <div style={{ padding: "6px", borderTop: "1px solid var(--hs-border-dark)", display: "flex", flexDirection: "column", gap: 2 }}>
                <button
                  className="profile-link-btn"
                  onClick={() => {
                    handleManualSync();
                  }}
                >
                  🔄 Re-Sync HubSpot Webhooks
                </button>
                <button
                  className="profile-link-btn"
                  onClick={() => {
                    navigate("/settings");
                    setProfileMenuOpen(false);
                  }}
                >
                  ⚙️ Portal Settings & Calibration
                </button>
                <button
                  className="profile-link-btn"
                  onClick={() => {
                    navigate("/case-study");
                    setProfileMenuOpen(false);
                  }}
                  style={{ color: "#ff5c35", fontWeight: 700 }}
                >
                  ✨ Case Study & $49 Audit Pilot
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
