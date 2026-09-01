/**
 * DealSense Dashboard — Enterprise Mobile Bottom Navigation.
 * Only visible on mobile (<850px) via CSS `.mobile-bottom-nav` class.
 * Uses CSS display rules instead of inline display to avoid overriding desktop hidden state.
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
  ];

  return (
    <nav className="mobile-bottom-nav">
      {NAV_TABS.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.label}
            onClick={() => navigate(tab.path)}
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
              transition: "color 0.15s ease",
            }}
          >
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  width: "24px",
                  height: "2.5px",
                  background: "#ff5c35",
                  borderRadius: "0 0 3px 3px",
                }}
              />
            )}

            <span style={{ fontSize: "17px", lineHeight: 1 }}>
              {tab.icon}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: isActive ? 700 : 500,
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
                  fontSize: "8px",
                  fontWeight: 800,
                  borderRadius: "var(--radius-pill)",
                  padding: "1px 4px",
                  lineHeight: 1.1,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Menu / More */}
      <button
        onClick={onOpenMenu}
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
        <span style={{ fontSize: "17px", lineHeight: 1 }}>☰</span>
        <span style={{ fontSize: "10px", fontWeight: 600, marginTop: "3px" }}>
          More
        </span>
      </button>
    </nav>
  );
};
