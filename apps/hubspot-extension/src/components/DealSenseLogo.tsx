/**
 * DealSense — Official HubSpot Sprocket Brand Mark for HubSpot Extension.
 */

import React from "react";

export const DealSenseIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <path d="M22 10V22" stroke="#ff5c35" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M22 22L32.5 28.5" stroke="#ff5c35" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M22 22L11.5 28.5" stroke="#ff5c35" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="22" cy="22" r="6.5" fill="#ffffff" stroke="#ff5c35" strokeWidth="3.2" />
      <circle cx="22" cy="7.5" r="4.2" fill="#ff5c35" />
      <circle cx="34.5" cy="29.5" r="4.2" fill="#ff5c35" />
      <circle cx="9.5" cy="29.5" r="4.2" fill="#ff5c35" />
    </svg>
  );
};

export const DealSenseLogo: React.FC<{ size?: "sm" | "md"; tagline?: string }> = ({
  size = "md",
  tagline = "Revenue Intelligence",
}) => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <DealSenseIcon size={size === "sm" ? 24 : 28} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <div style={{ fontSize: size === "sm" ? "14px" : "15.5px", fontWeight: 700, letterSpacing: "-0.03em", display: "flex" }}>
          <span style={{ color: "#2d3e50" }}>Deal</span>
          <span style={{ color: "#ff5c35", fontWeight: 800 }}>Sense</span>
        </div>
        {tagline && (
          <div style={{ fontSize: "9px", color: "var(--hs-text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
            {tagline}
          </div>
        )}
      </div>
    </div>
  );
};
