/**
 * DealSense Dashboard — Authentic Enterprise Mobile Bottom Navigation.
 * Glassmorphic design with active indicators, live notification badges, and native touch targets.
 */

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const NAV_TABS = [
    { label: "Overview", icon: "📊", path: "/" },
    { label: "Deals", icon: "🎯", path: "/deals" },
    { label: "Actions", icon: "⚡", path: "/actions", badge: "5", badgeColor: "#ff5c35" },
    { label: "Hygiene", icon: "🧹", path: "/hygiene", badge: "6", badgeColor: "var(--warning)" },
    { label: "Case Study", icon: "✨", path: "/case-study", badge: "HOT", badgeColor: "#00a4bd" },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60px",
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--hs-border-dark)",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-around",
        zIndex: 80,
        boxShadow: "0 -4px 16px rgba(18, 69, 72, 0.08)",
        paddingBottom: "max(4px, env(safe-area-inset-bottom))",
      }}
    >
      {NAV_TABS.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.label}
            onClick={() => navigate(tab.path)}
            className={`mobile-nav-item ${isActive ? "active" : ""}`}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              padding: "4px 0",
              cursor: "pointer",
              color: isActive ? "#ff5c35" : "var(--hs-text-muted)",
              position: "relative",
              transition: "all 0.15s ease",
            }}
          >
            {/* Top Active Indicator Bar */}
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  width: "28px",
                  height: "3px",
                  background: "#ff5c35",
                  borderRadius: "0 0 3px 3px",
                }}
              />
            )}

            <span style={{ fontSize: "16px", lineHeight: 1, marginTop: isActive ? 2 : 0 }}>
              {tab.icon}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: isActive ? 800 : 500,
                marginTop: "3px",
                letterSpacing: "-0.01em",
              }}
            >
              {tab.label}
            </span>

            {tab.badge && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: "calc(50% - 16px)",
                  background: tab.badgeColor || "var(--danger)",
                  color: "#ffffff",
                  fontSize: "8.5px",
                  fontWeight: 800,
                  borderRadius: "var(--radius-pill)",
                  padding: "1px 4px",
                  lineHeight: 1.1,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Menu / More Off-Canvas Trigger */}
      <button
        onClick={onOpenMenu}
        className="mobile-nav-item"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          padding: "4px 0",
          cursor: "pointer",
          color: "var(--hs-text-muted)",
        }}
      >
        <span style={{ fontSize: "16px", lineHeight: 1 }}>☰</span>
        <span style={{ fontSize: "10px", fontWeight: 600, marginTop: "3px" }}>
          More
        </span>
      </button>
    </nav>
  );
};
