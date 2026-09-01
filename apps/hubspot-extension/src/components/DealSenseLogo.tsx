/**
 * DealSense — Official HubSpot-Inspired Brand Logo Set for HubSpot Extension.
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
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="hsExtPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#124548" />
          <stop offset="100%" stopColor="#042729" />
        </linearGradient>
        <linearGradient id="hsExtAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4800" />
          <stop offset="100%" stopColor="#d9480f" />
        </linearGradient>
      </defs>

      <rect width="40" height="40" rx="10" fill="url(#hsExtPrimary)" />
      <circle cx="20" cy="20" r="13" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M 20 11 L 20 20 L 28 26" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 20 20 L 12 26" stroke="url(#hsExtAccent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="11" r="3" fill="#ffffff" />
      <circle cx="28" cy="26" r="3" fill="#087f5b" stroke="#ffffff" strokeWidth="1.2" />
      <circle cx="12" cy="26" r="3.5" fill="url(#hsExtAccent)" stroke="#ffffff" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="4.5" fill="#ffffff" />
      <circle cx="20" cy="20" r="2" fill="url(#hsExtPrimary)" />
    </svg>
  );
};

export const DealSenseLogo: React.FC<{ size?: "sm" | "md"; tagline?: string }> = ({
  size = "md",
  tagline = "Revenue Intelligence",
}) => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <DealSenseIcon size={size === "sm" ? 24 : 30} />
      <div>
        <div style={{ fontSize: size === "sm" ? "14px" : "16px", fontWeight: 800, color: "var(--hs-primary)", display: "flex" }}>
          <span>Deal</span>
          <span style={{ color: "#ff4800" }}>Sense</span>
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
