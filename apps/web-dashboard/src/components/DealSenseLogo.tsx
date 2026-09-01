/**
 * DealSense — Official HubSpot-Inspired Brand Logo Set.
 * Modern geometric revenue nexus emblem connecting pipeline telemetry nodes.
 */

import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | number;
  showWordmark?: boolean;
  tagline?: string;
  className?: string;
}

export const DealSenseIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
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
        <linearGradient id="dsGradientPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#124548" />
          <stop offset="100%" stopColor="#042729" />
        </linearGradient>
        <linearGradient id="dsGradientAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4800" />
          <stop offset="100%" stopColor="#d9480f" />
        </linearGradient>
        <linearGradient id="dsGradientGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#087f5b" />
          <stop offset="100%" stopColor="#124548" />
        </linearGradient>
      </defs>

      {/* Rounded Background Badge */}
      <rect width="40" height="40" rx="10" fill="url(#dsGradientPrimary)" />

      {/* Outer Telemetry Signal Ring */}
      <circle cx="20" cy="20" r="13" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Connecting Signal Pathways (HubSpot Sprocket Inspired) */}
      <path d="M 20 11 L 20 20 L 28 26" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 20 20 L 12 26" stroke="url(#dsGradientAccent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Intelligence Nodes */}
      {/* Top Node (Revenue Metrics) */}
      <circle cx="20" cy="11" r="3" fill="#ffffff" />
      
      {/* Right Node (MEDDICC Evidence) */}
      <circle cx="28" cy="26" r="3" fill="url(#dsGradientGlow)" stroke="#ffffff" strokeWidth="1.2" />

      {/* Left Node (HubSpot Flame Trigger Node) */}
      <circle cx="12" cy="26" r="3.5" fill="url(#dsGradientAccent)" stroke="#ffffff" strokeWidth="1.2" />

      {/* Center AI Core */}
      <circle cx="20" cy="20" r="4.5" fill="#ffffff" />
      <circle cx="20" cy="20" r="2" fill="url(#dsGradientPrimary)" />
    </svg>
  );
};

export const DealSenseLogo: React.FC<LogoProps> = ({
  size = "md",
  showWordmark = true,
  tagline = "RevOps Command Center",
  className = "",
}) => {
  const iconSize = typeof size === "number" ? size : size === "sm" ? 28 : size === "lg" ? 40 : 34;

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
      }}
    >
      <DealSenseIcon size={iconSize} />

      {showWordmark && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: size === "sm" ? "15px" : size === "lg" ? "20px" : "17px",
              fontWeight: 800,
              color: "var(--hs-primary)",
              letterSpacing: "-0.4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>Deal</span>
            <span style={{ color: "var(--hs-accent, #ff4800)" }}>Sense</span>
          </div>

          {tagline && (
            <div
              style={{
                fontSize: size === "sm" ? "9.5px" : "10.5px",
                color: "var(--hs-text-muted)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginTop: "2px",
              }}
            >
              {tagline}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
