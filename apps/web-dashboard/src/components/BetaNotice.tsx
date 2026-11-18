/**
 * DealSense Dashboard — Authentic HubSpot Enterprise Pro / Paid Beta Gate.
 * Clear conversion paywall banner that distinguishes the Free Marketplace MVP from paid modules.
 */

import React from "react";
import { useNavigate } from "react-router-dom";

interface BetaNoticeProps {
  moduleName?: string;
}

export const BetaNotice: React.FC<BetaNoticeProps> = ({ moduleName }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid #cbd6e2",
        borderLeft: "4px solid #ff7a59",
        borderRadius: "8px",
        padding: "16px 20px",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        fontFamily: "var(--font-sans, -apple-system, sans-serif)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, maxWidth: 780 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: "rgba(255, 122, 89, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ff5c35",
            fontSize: 18,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          🔒
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                background: "rgba(255, 122, 89, 0.12)",
                color: "#ff5c35",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "10.5px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Enterprise Pro Module (Beta Gate)
            </span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              • Viewing Demo Telemetry Simulation
            </span>
          </div>
          <div style={{ fontSize: "13px", color: "#33475b", lineHeight: 1.5 }}>
            <strong>{moduleName || "Enterprise Pro Module"}</strong> is part of the HubAiLab Paid Remediations Tier ($79/mo) and Agency Fleet Retainer. The core <strong>Deal Risk Scoring Layer</strong> is 100% free forever on the HubSpot Marketplace.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => navigate("/deals")}
          style={{
            padding: "8px 14px",
            background: "#ffffff",
            color: "#2d3e50",
            border: "1px solid #cbd6e2",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          ← Free Deal Inspector (MVP)
        </button>
        <button
          onClick={() => navigate("/checkout")}
          style={{
            padding: "8px 16px",
            background: "#ff7a59",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 1px 3px rgba(255, 122, 89, 0.3)",
          }}
        >
          Upgrade to Pro ($79/mo) ➔
        </button>
      </div>
    </div>
  );
};
