/**
 * DealSense Dashboard — Ultra-Premium Enterprise Top Navigation Bar.
 * Clean Canvas-standard account & portal switcher designed for maximum clarity, speed, and executive polish.
 */

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectHubSpotModal } from "./ConnectHubSpotModal";
import { AccountAuthModal } from "./AccountAuthModal";
import { AdminLoginModal } from "./AdminLoginModal";
import { useAuth } from "../contexts/AuthContext";

interface TopBarProps {
  breadcrumb?: string;
  title: string;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  onNavigateHome?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  breadcrumb,
  title,
  onOpenSidebar,
  onOpenSearch,
  onNavigateHome,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
}) => {
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const { isAdmin } = useAuth();

  const handleLogoClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      navigate("/pipeline");
    }
  };

  const [currentUser, setCurrentUser] = useState({
    name: "Peash Das Rudra",
    email: "peashdasrudra@gmail.com",
    role: "Lead RevOps Architect",
    initials: "PR",
  });

  const [selectedPortal, setSelectedPortal] = useState({
    id: "48920193",
    name: "DealSense Enterprise Fleet",
    tier: "Enterprise Portal",
    deals: 25,
    latency: "0.18s",
  });

  const [portals, setPortals] = useState([
    { id: "48920193", name: "DealSense Enterprise Fleet", tier: "Enterprise Portal", deals: 25, latency: "0.18s" },
    { id: "29481023", name: "Premier Client Sandbox", tier: "Sandbox Portal", deals: 16, latency: "0.19s" },
    { id: "19284711", name: "TechCorp Global Fleet", tier: "Enterprise Portal", deals: 12, latency: "0.22s" },
  ]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
        setPortalDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleManualSync = () => {
    setSyncStatusMsg("Syncing...");
    setTimeout(() => {
      setSyncStatusMsg("✓ Synced (0.18s)");
      setTimeout(() => setSyncStatusMsg(null), 2500);
    }, 600);
  };

  const [avatarImgError, setAvatarImgError] = useState(false);
  const [dropdownImgError, setDropdownImgError] = useState(false);

  return (
    <header className="main-header" style={{
      height: 56,
      padding: "0 20px",
      background: "rgba(255, 255, 255, 0.98)",
      borderBottom: "1px solid rgba(203, 214, 226, 0.8)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      boxShadow: "0 1px 3px rgba(45, 62, 80, 0.03)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 50,
      gap: 12,
    }}>
      {/* ── Left: Mobile Toggle + Rich Breadcrumb Trail ────────────── */}
      <div className="header-left" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
        <button
          className="mobile-nav-toggle"
          onClick={onOpenSidebar}
          aria-label="Open Navigation Menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="17" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Desktop Sidebar Toggle Button (HubSpot Canvas Style) */}
        {onToggleSidebarCollapse && (
          <button
            type="button"
            className="desktop-sidebar-toggle hide-on-mobile"
            onClick={onToggleSidebarCollapse}
            aria-label={isSidebarCollapsed ? "Expand sidebar navigation (Ctrl+\\)" : "Collapse sidebar navigation (Ctrl+\\)"}
            title={isSidebarCollapsed ? "Expand sidebar (Ctrl+\\)" : "Collapse sidebar (Ctrl+\\)"}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: isSidebarCollapsed ? "rgba(255, 122, 89, 0.09)" : "transparent",
              border: `1px solid ${isSidebarCollapsed ? "rgba(255, 122, 89, 0.4)" : "rgba(203, 214, 226, 0.9)"}`,
              color: isSidebarCollapsed ? "#ff7a59" : "#516f90",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s ease",
              padding: 0,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!isSidebarCollapsed) {
                e.currentTarget.style.background = "#f5f8fa";
                e.currentTarget.style.borderColor = "#00a4bd";
                e.currentTarget.style.color = "#2d3e50";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSidebarCollapsed) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(203, 214, 226, 0.9)";
                e.currentTarget.style.color = "#516f90";
              }
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
              {isSidebarCollapsed ? (
                <polyline points="13 9 16 12 13 15" />
              ) : (
                <polyline points="15 9 12 12 15 15" />
              )}
            </svg>
          </button>
        )}

        {/* Clean Breadcrumb Navigation */}
        <div className="topbar-title-section" style={{ display: "flex", alignItems: "center", minWidth: 0, gap: 8 }}>
          <div
            className="hide-on-mobile"
            onClick={handleLogoClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "6px",
              background: "rgba(45, 62, 80, 0.04)",
              border: "1px solid rgba(203, 214, 226, 0.6)",
              transition: "all 0.15s ease",
            }}
            title="Return to Pipeline Overview"
          >
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#2d3e50", letterSpacing: "0.02em" }}>
              REVOPS WORKSPACE
            </span>
            <span style={{ fontSize: "9.5px", fontWeight: 800, background: "#00a4bd", color: "#ffffff", padding: "1px 5px", borderRadius: "3px" }}>
              PROD
            </span>
          </div>

          <span className="hide-on-mobile" style={{ color: "#cbd6e2", fontSize: "15px", fontWeight: 300, userSelect: "none" }}>
            ›
          </span>

          <h1 className="header-page-title hide-on-mobile" style={{
            fontSize: "14.5px",
            fontWeight: 800,
            color: "#2d3e50",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: 0,
            letterSpacing: "-0.01em",
          }}>
            {title}
          </h1>

          {/* Minimal Mobile View Title Pill */}
          <div className="topbar-mobile-pill show-on-mobile-flex">
            <span className="topbar-mobile-dot" />
            <span className="topbar-mobile-title-text">{breadcrumb || title.split("—")[0].trim()}</span>
          </div>

          {/* Live Telemetry Sync Pill */}
          <div
            className="hide-on-mobile"
            style={{
              marginLeft: 6,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 10px",
              borderRadius: "20px",
              background: "rgba(0, 189, 165, 0.08)",
              border: "1px solid rgba(0, 189, 165, 0.25)",
              fontSize: "11px",
              fontWeight: 700,
              color: "#007a70",
              cursor: "pointer",
            }}
            onClick={handleManualSync}
            title="Click to trigger instant webhook sync"
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00bda5", display: "inline-block", boxShadow: "0 0 6px #00bda5" }} />
            <span>Portal #{selectedPortal.id} ({selectedPortal.latency})</span>
          </div>
        </div>
      </div>

      {/* ── Right: Search + Notifications + HubSpot Profile Avatar ─── */}
      <div className="header-right" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {/* Global Quick Search Button */}
        <button
          className="header-search-btn"
          onClick={onOpenSearch}
          aria-label="Search pipeline"
          title="Search deals, accounts & contacts ( / )"
          type="button"
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#ff5c35" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <span className="search-text-label hide-on-mobile" style={{ color: "#33475b", fontWeight: 600 }}>Quick Search</span>
          <span className="search-kbd-shortcut hide-on-mobile">⌘K</span>
        </button>

        {/* Risk Alerts Notification Bell */}
        <div ref={notifRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setNotificationOpen((prev) => !prev);
              setProfileMenuOpen(false);
            }}
            className="header-icon-btn"
            aria-label="View Risk Notifications"
            type="button"
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#d93843",
                boxShadow: "0 0 0 2px #ffffff",
              }}
            />
          </button>

          {notificationOpen && (
            <div className="notifications-dropdown" style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: "300px",
              background: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #dfe3eb",
              boxShadow: "0 10px 30px rgba(45, 62, 80, 0.15)",
              padding: "12px",
              zIndex: 9999,
            }}>
              <div className="notifications-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #edf1f5" }}>
                <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#2d3e50" }}>HubSpot Risk Alerts</span>
                <span style={{ background: "rgba(242, 84, 91, 0.12)", color: "#d93843", fontSize: "10px", fontWeight: 800, padding: "2px 6px", borderRadius: 4 }}>3 Critical</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ padding: "8px 10px", background: "#fff5f5", borderRadius: "4px", border: "1px solid #fecaca", fontSize: "11.5px", color: "#991b1b" }}>
                  <strong>Orion Cloud</strong>: 18d CFO silence (TechCorp)
                </div>
                <div style={{ padding: "8px 10px", background: "#fffaf0", borderRadius: "4px", border: "1px solid #feebc8", fontSize: "11.5px", color: "#9c4221" }}>
                  <strong>Quantum Security</strong>: Overdue close date by 18d
                </div>
                <div style={{ padding: "8px 10px", background: "#f0fdf4", borderRadius: "4px", border: "1px solid #bbf7d0", fontSize: "11.5px", color: "#166534" }}>
                  <strong>Maersk Digital</strong>: MSA Redlines complete in DocuSign
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── HubSpot Profile & Portal Switcher (Top Right Pill) ── */}
        <div ref={profileRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            type="button"
            className="topbar-user-pill"
            onClick={(e) => {
              e.stopPropagation();
              setProfileMenuOpen((prev) => !prev);
              setNotificationOpen(false);
            }}
            title={`HubSpot Operator: ${currentUser.name} (Portal #${selectedPortal.id})`}
            aria-expanded={profileMenuOpen}
          >
            {/* Real Executive Avatar with Live Status Badge */}
            <div className="topbar-user-avatar-wrap">
              {!avatarImgError ? (
                <img
                  src="/peash_avatar.jpg"
                  alt={currentUser.name}
                  className="topbar-user-avatar"
                  onError={() => setAvatarImgError(true)}
                />
              ) : (
                <div
                  className="topbar-user-avatar"
                  style={{
                    background: "linear-gradient(135deg, #ff5c35 0%, #ff7a59 100%)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "11px",
                  }}
                >
                  {currentUser.initials}
                </div>
              )}
              <span className="topbar-user-badge" />
            </div>

            <span className="topbar-user-name">
              Peash Rudra
            </span>

            <span
              className="topbar-user-chevron"
              style={{
                transform: profileMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>

          {profileMenuOpen && (
            <div
              className="topbar-profile-dropdown"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "min(280px, calc(100vw - 20px))",
                maxWidth: "calc(100vw - 20px)",
                background: "#ffffff",
                borderRadius: 8,
                border: "1px solid #dfe3eb",
                boxShadow: "0 10px 30px rgba(45, 62, 80, 0.12), 0 2px 6px rgba(45, 62, 80, 0.04)",
                zIndex: 9999,
                overflow: "hidden",
                fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
                animation: "dropdown-enter 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                boxSizing: "border-box",
              }}
            >
              {/* 1. User Info Header */}
              <div style={{ padding: "12px 14px", borderBottom: "1px solid #edf1f5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ position: "relative", width: 38, height: 38, flexShrink: 0 }}>
                    {!dropdownImgError ? (
                      <img
                        src="/peash_avatar.jpg"
                        alt={currentUser.name}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1.5px solid #00a4bd",
                          display: "block",
                        }}
                        onError={() => setDropdownImgError(true)}
                      />
                    ) : (
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #ff5c35 0%, #ff7a59 100%)",
                          color: "#ffffff",
                          fontWeight: 800,
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {currentUser.initials}
                      </div>
                    )}
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: "#00bda5",
                        border: "1.5px solid #ffffff",
                      }}
                    />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "#2d3e50", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#7c98b6", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {currentUser.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Connected Portal Bar (Compact with expandable switcher) */}
              <div style={{ background: "#f8fafc", borderBottom: "1px solid #edf1f5", padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "10.5px", fontWeight: 700, color: "#007a8c", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00bda5", display: "inline-block" }} />
                    Portal #{selectedPortal.id}
                  </div>
                  <button
                    onClick={() => setPortalDropdownOpen((prev) => !prev)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#007a8c",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: "1px 4px",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    Switch {portalDropdownOpen ? "▲" : "▼"}
                  </button>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#33475b" }}>
                  {selectedPortal.name}
                </div>
                <div style={{ fontSize: "10.5px", color: "#7c98b6", marginTop: 2, display: "flex", justifyContent: "space-between" }}>
                  <span>{selectedPortal.tier}</span>
                  <span>{selectedPortal.deals} Deals · {selectedPortal.latency}</span>
                </div>

                {/* Collapsible Switch Portal List */}
                {portalDropdownOpen && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 3 }}>
                    {portals.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPortal(p);
                          setPortalDropdownOpen(false);
                        }}
                        style={{
                          padding: "6px 8px",
                          borderRadius: 4,
                          background: selectedPortal.id === p.id ? "rgba(0, 164, 189, 0.08)" : "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedPortal.id !== p.id) (e.currentTarget as HTMLElement).style.background = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          if (selectedPortal.id !== p.id) (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "11.5px", fontWeight: 600, color: "#2d3e50" }}>{p.name}</div>
                          <div style={{ fontSize: "10px", color: "#7c98b6" }}>#{p.id} · {p.deals} deals</div>
                        </div>
                        {selectedPortal.id === p.id && (
                          <span style={{ color: "#00a4bd", fontWeight: 800, fontSize: "11px" }}>✓</span>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setIsConnectModalOpen(true);
                        setProfileMenuOpen(false);
                      }}
                      style={{
                        background: "none",
                        border: "1px dashed #cbd6e2",
                        borderRadius: 4,
                        padding: "5px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#ff5c35",
                        cursor: "pointer",
                        marginTop: 4,
                        textAlign: "center",
                      }}
                    >
                      + Connect Another Portal
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Action Navigation List */}
              <div style={{ padding: "4px 6px" }}>
                <button
                  className="profile-link-btn"
                  onClick={handleManualSync}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 4,
                    border: "none",
                    background: "none",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#33475b",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.1s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f5f8fa")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#ff5c35" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                  <span style={{ flex: 1 }}>Re-Sync Webhooks</span>
                  {syncStatusMsg && (
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#00a4bd" }}>{syncStatusMsg}</span>
                  )}
                </button>

                <button
                  className="profile-link-btn"
                  onClick={() => {
                    navigate("/case-study");
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 4,
                    border: "none",
                    background: "none",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#33475b",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.1s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f5f8fa")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#00a4bd" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>Architecture Case Study</span>
                </button>

                <button
                  className="profile-link-btn"
                  onClick={() => {
                    navigate("/settings");
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 4,
                    border: "none",
                    background: "none",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#33475b",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.1s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f5f8fa")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#516f90" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>Integration &amp; Settings</span>
                </button>

                <button
                  className="profile-link-btn"
                  onClick={() => {
                    setIsAdminModalOpen(true);
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 4,
                    border: "none",
                    background: "none",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#33475b",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.1s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f5f8fa")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#516f90" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>{isAdmin ? "Admin Logout" : "Admin Security Key"}</span>
                </button>
              </div>

              {/* 4. Footer Disconnect */}
              <div style={{ padding: "4px 6px 6px", borderTop: "1px solid #edf1f5" }}>
                <button
                  className="profile-link-btn"
                  onClick={() => {
                    setIsConnectModalOpen(true);
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 4,
                    border: "none",
                    background: "none",
                    fontSize: "11.5px",
                    fontWeight: 500,
                    color: "#64748b",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(225, 29, 72, 0.06)";
                    (e.currentTarget as HTMLElement).style.color = "#e11d48";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#64748b";
                  }}
                >
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Disconnect Portal (Revoke OAuth)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connect HubSpot OAuth Modal */}
      <ConnectHubSpotModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnected={(newPortal) => {
          setPortals((prev) => [newPortal, ...prev.filter((p) => p.id !== newPortal.id)]);
          setSelectedPortal(newPortal);
        }}
      />

      <AccountAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserSwitch={(newUser) => setCurrentUser(newUser)}
      />

      {/* Single Server Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </header>
  );
};
