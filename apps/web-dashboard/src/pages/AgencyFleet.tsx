import React from "react";

export const AgencyFleet: React.FC = () => {

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <h1 style={{ fontSize: 42, fontWeight: 900, color: "#092124", marginBottom: 16 }}>
          Upgrade to DealSense Enterprise Pro
        </h1>
        <p style={{ fontSize: 18, color: "#64748b", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
          Unlock autonomous pipeline remediation, AI battlecards, and advanced execution playbooks to dominate your revenue targets.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, alignItems: "start" }}>
        {/* Basic Plan */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 40, boxShadow: "0 12px 24px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#092124", marginBottom: 8 }}>Core Intelligence</h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 32 }}>For teams exploring pipeline visibility.</p>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#092124", marginBottom: 8 }}>
            Free <span style={{ fontSize: 16, fontWeight: 500, color: "#64748b" }}>/ forever</span>
          </div>
          
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0", gap: 16, display: "flex", flexDirection: "column" }}>
            <li style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "#334155", fontWeight: 500 }}>
              <span style={{ color: "#10b981" }}>✓</span> Pipeline Risk Overview
            </li>
            <li style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "#334155", fontWeight: 500 }}>
              <span style={{ color: "#10b981" }}>✓</span> Deal Inspector
            </li>
            <li style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "#334155", fontWeight: 500 }}>
              <span style={{ color: "#10b981" }}>✓</span> Stakeholder Matrix
            </li>
            <li style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "#334155", fontWeight: 500 }}>
              <span style={{ color: "#10b981" }}>✓</span> Deal War Room
            </li>
          </ul>

          <button style={{ width: "100%", padding: "16px", borderRadius: 12, background: "#f1f5f9", color: "#475569", fontWeight: 700, border: "none", cursor: "default" }}>
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div style={{ background: "#092124", border: "1px solid #124548", borderRadius: 24, padding: 40, boxShadow: "0 24px 48px rgba(9, 33, 36, 0.2)", position: "relative" }}>
          <div style={{ position: "absolute", top: -14, right: 32, background: "linear-gradient(135deg, #ff7a59 0%, #ff5c35 100%)", color: "white", padding: "6px 16px", borderRadius: 999, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", boxShadow: "0 4px 12px rgba(255, 92, 53, 0.3)" }}>
            Recommended
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", marginBottom: 8 }}>Enterprise Pro</h2>
          <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 32 }}>Automate your execution and CRM hygiene.</p>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#ffffff", marginBottom: 8 }}>
            $499 <span style={{ fontSize: 16, fontWeight: 500, color: "#94a3b8" }}>/ month</span>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0", gap: 16, display: "flex", flexDirection: "column" }}>
            <li style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "#e2e8f0", fontWeight: 500 }}>
              <span style={{ color: "#ff7a59" }}>✓</span> Everything in Core
            </li>
            <li style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "#e2e8f0", fontWeight: 500 }}>
              <span style={{ color: "#ff7a59" }}>✓</span> Action Approval Queue
            </li>
            <li style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "#e2e8f0", fontWeight: 500 }}>
              <span style={{ color: "#ff7a59" }}>✓</span> Mutual Action Plans (MAP)
            </li>
            <li style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "#e2e8f0", fontWeight: 500 }}>
              <span style={{ color: "#ff7a59" }}>✓</span> Competitive Battlecards
            </li>
            <li style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "#e2e8f0", fontWeight: 500 }}>
              <span style={{ color: "#ff7a59" }}>✓</span> AI Rep Coaching
            </li>
            <li style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "#e2e8f0", fontWeight: 500 }}>
              <span style={{ color: "#ff7a59" }}>✓</span> Autonomous Playbooks & Hygiene
            </li>
          </ul>

          <button 
            onClick={() => alert("Enterprise Pro upgraded successfully in demo environment.")}
            style={{ width: "100%", padding: "16px", borderRadius: 12, background: "linear-gradient(135deg, #ff7a59 0%, #ff5c35 100%)", color: "#ffffff", fontWeight: 800, border: "none", cursor: "pointer", fontSize: 16, transition: "transform 0.2s" }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
};
