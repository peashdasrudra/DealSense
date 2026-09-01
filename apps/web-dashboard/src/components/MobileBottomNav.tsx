/**
 * DealSense Dashboard — Minimalist Mobile Bottom Navigation.
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
    { label: "Actions", icon: "⚡", path: "/actions", badge: "5" },
    { label: "Hygiene", icon: "🧹", path: "/hygiene", badge: "6" },
  ];

  return (
    <nav className="mobile-bottom-nav">
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
              padding: "6px 0",
              cursor: "pointer",
              color: isActive ? "var(--hs-primary)" : "var(--hs-text-muted)",
              position: "relative",
              transition: "color 0.15s",
            }}
          >
            <span style={{ fontSize: "17px", lineHeight: 1 }}>{tab.icon}</span>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: isActive ? 700 : 500,
                marginTop: "3px",
              }}
            >
              {tab.label}
            </span>

            {tab.badge && (
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  right: "calc(50% - 15px)",
                  background: "var(--danger)",
                  color: "#ffffff",
                  fontSize: "9px",
                  fontWeight: 700,
                  borderRadius: "var(--radius-pill)",
                  padding: "1px 5px",
                  lineHeight: 1.2,
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Menu / More button */}
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
          padding: "6px 0",
          cursor: "pointer",
          color: "var(--hs-text-muted)",
        }}
      >
        <span style={{ fontSize: "17px", lineHeight: 1 }}>☰</span>
        <span style={{ fontSize: "10.5px", fontWeight: 500, marginTop: "3px" }}>
          More
        </span>
      </button>
    </nav>
  );
};
