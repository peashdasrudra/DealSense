/**
 * DealSense Dashboard — Beta Preview Notice Banner.
 * Clearly differentiates Enterprise Roadmap / Beta modules from the 100% Live MVP.
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
        background: "linear-gradient(90deg, #fffbf0 0%, #ffffff 100%)",
        border: "1px solid rgba(255, 171, 0, 0.35)",
        borderLeft: "4px solid #ffab00",
        borderRadius: "var(--radius-sm)",
        padding: "12px 18px",
        marginBottom: "var(--sp-4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        boxShadow: "0 1px 3px rgba(255, 171, 0, 0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, maxWidth: 760 }}>
        <div
          style={{
            background: "rgba(255, 171, 0, 0.15)",
            color: "#b76e00",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          🧪 BETA PREVIEW
        </div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#33475b", marginBottom: 2 }}>
            {moduleName ? `${moduleName} (Enterprise Roadmap Preview)` : "Enterprise Roadmap Beta Module"}
          </div>
          <div style={{ fontSize: "12px", color: "#516f90", lineHeight: 1.45 }}>
            This advanced module preview demonstrates upcoming revenue operations capabilities.
            The core MVP features (<strong>Deal Inspector & Live CRM</strong>, <strong>Pipeline Command Center</strong>, and <strong>Action Approval Queue</strong>) are 100% live and operating against your production HubSpot server.
          </div>
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
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(255, 122, 89, 0.3)",
            whiteSpace: "nowrap",
          }}
        >
          Go to Live Deals (MVP) →
        </button>
        <button
          onClick={() => navigate("/pipeline")}
          style={{
            padding: "6px 12px",
            background: "#ffffff",
            color: "#33475b",
            border: "1px solid #cbd6e2",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Pipeline Center
        </button>
      </div>
    </div>
  );
};
