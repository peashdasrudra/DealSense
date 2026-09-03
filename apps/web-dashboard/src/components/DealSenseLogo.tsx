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

export const DealSenseIcon: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({
  size = 32,
  className = "",
  style = {},
}) => {
  return (
    <img
      src="/logo_icon.png"
      alt="DealSense"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(6, Math.round(size * 0.22)),
        objectFit: "contain",
        flexShrink: 0,
        filter: "drop-shadow(0 2px 6px rgba(255, 92, 53, 0.22))",
        ...style,
      }}
    />
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
