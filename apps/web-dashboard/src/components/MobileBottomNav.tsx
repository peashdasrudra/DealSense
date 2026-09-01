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

const Icon: React.FC<{ d: string; size?: number }> = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

const ICONS: Record<string, React.ReactNode> = {
  overview: <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />,
  deals: (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  actions: (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  hygiene: (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  more: (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
};

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const NAV_TABS = [
    { label: "Overview", icon: "overview", path: "/" },
    { label: "Deals", icon: "deals", path: "/deals" },
    { label: "Actions", icon: "actions", path: "/actions", badge: "5", badgeColor: "#ff5c35" },
    { label: "Hygiene", icon: "hygiene", path: "/hygiene", badge: "6", badgeColor: "var(--warning)" },
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

            <span style={{ lineHeight: 1, marginBottom: "3px" }}>
              {ICONS[tab.icon]}
            </span>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: isActive ? 700 : 500,
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
                  right: "calc(50% - 20px)",
                  background: tab.badgeColor || "var(--danger)",
                  color: "#ffffff",
                  fontSize: "8.5px",
                  fontWeight: 800,
                  borderRadius: "var(--radius-pill)",
                  padding: "1px 5px",
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
        <span style={{ lineHeight: 1, marginBottom: "3px" }}>
          {ICONS["more"]}
        </span>
        <span style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: "-0.01em" }}>
          More
        </span>
      </button>
    </nav>
  );
};
