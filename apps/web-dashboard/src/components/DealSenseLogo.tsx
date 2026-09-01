/**
 * DealSense — Official HubSpot Sprocket-Inspired Logo & Brand Mark.
 * Exact mathematical HubSpot sprocket geometry with connected telemetry nodes.
 */

import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | number;
  showWordmark?: boolean;
  tagline?: string;
  className?: string;
  theme?: "light" | "dark";
}

export const DealSenseIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
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
      {/* HubSpot Iconic Sprocket Geometry */}
      {/* Top Vertical Spoke */}
      <path
        d="M22 10V22"
        stroke="#ff5c35"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Bottom-Right Spoke (120 deg) */}
      <path
        d="M22 22L32.5 28.5"
        stroke="#ff5c35"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Bottom-Left Spoke (240 deg) */}
      <path
        d="M22 22L11.5 28.5"
        stroke="#ff5c35"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Central Sprocket Ring */}
      <circle
        cx="22"
        cy="22"
        r="6.5"
        fill="#ffffff"
        stroke="#ff5c35"
        strokeWidth="3.2"
      />

      {/* Top Orbit Node */}
      <circle cx="22" cy="7.5" r="4.2" fill="#ff5c35" />

      {/* Bottom-Right Orbit Node */}
      <circle cx="34.5" cy="29.5" r="4.2" fill="#ff5c35" />

      {/* Bottom-Left Orbit Node */}
      <circle cx="9.5" cy="29.5" r="4.2" fill="#ff5c35" />
    </svg>
  );
};

export const DealSenseLogo: React.FC<LogoProps> = ({
  size = "md",
  showWordmark = true,
  tagline = "Revenue Intelligence",
  className = "",
}) => {
  const iconSize = typeof size === "number" ? size : size === "sm" ? 26 : size === "lg" ? 38 : 32;

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "9px",
        textDecoration: "none",
        userSelect: "none",
      }}
    >
      <DealSenseIcon size={iconSize} />

      {showWordmark && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: size === "sm" ? "15px" : size === "lg" ? "20px" : "17px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#2d3e50" }}>Deal</span>
            <span style={{ color: "#ff5c35", fontWeight: 800 }}>Sense</span>
          </div>

          {tagline && (
            <div
              style={{
                fontSize: size === "sm" ? "9px" : "10px",
                color: "var(--hs-text-muted)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginTop: "1px",
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
