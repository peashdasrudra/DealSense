/**
 * DealSense Dashboard — HubSpot Canvas-Grade Beta Preview Notice.
 * Clean, enterprise tone without loud emojis or amateur styling.
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
        background: "#ffffff",
        border: "1px solid #cbd6e2",
        borderLeft: "4px solid #00a4bd",
        borderRadius: "4px",
        padding: "12px 18px",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 800 }}>
        <span
          style={{
            background: "rgba(0, 164, 189, 0.1)",
            color: "#007a8c",
            padding: "2px 8px",
            borderRadius: "3px",
            fontSize: "10.5px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            border: "1px solid rgba(0, 164, 189, 0.25)",
            flexShrink: 0,
          }}
        >
          Beta Preview
        </span>
        <div style={{ fontSize: "12.5px", color: "#33475b", lineHeight: 1.45 }}>
          <strong>{moduleName || "Enterprise Module"}</strong> is currently in public beta. Core deal scoring, MEDDICC qualification, and HubSpot write-backs are fully active in Deal Inspector.
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={() => navigate("/deals")}
          style={{
            padding: "6px 14px",
            background: "#ff7a59",
            color: "#ffffff",
            border: "none",
            borderRadius: "3px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            outline: "none",
            boxShadow: "0 1px 2px rgba(255, 122, 89, 0.25)",
          }}
        >
          View Live Deals →
        </button>
      </div>
    </div>
  );
};
