/**
 * DealSense — Enterprise SaaS Global Multi-Column Footer.
 * Designed to match HubSpot's official scaling enterprise footer aesthetics.
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { DealSenseIcon } from "./DealSenseLogo";

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer
      style={{
        background: "#0c282b",
        color: "#ffffff",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        paddingTop: "64px",
        paddingBottom: "36px",
        fontFamily: "var(--font-sans)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 92, 53, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* ── Top Grid: 5 Multi-Column Sections ────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "40px 24px",
            marginBottom: "56px",
          }}
        >
          {/* Col 1: Brand & Identity */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              onClick={() => navigate("/")}
              style={{ display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer" }}
            >
              <DealSenseIcon size={28} />
              <span style={{ fontSize: "19px", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Deal<span style={{ color: "#ff5c35" }}>Sense</span>
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.6, margin: 0, maxWidth: 220 }}>
              The autonomous HubSpot-native revenue intelligence and predictive deal health platform for modern B2B RevOps teams.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              <span style={{ fontSize: "12px", color: "#6ee7b7", fontWeight: 600 }}>All Systems Operational</span>
            </div>
          </div>

          {/* Col 2: Revenue Intelligence */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35", marginBottom: "16px" }}>
              Revenue Platform
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <Link to="/" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.75)")}>
                Pipeline Overview
              </Link>
              <Link to="/forecast" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Monte Carlo Forecasting
              </Link>
              <Link to="/waterfall" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Pipeline Waterfall Velocity
              </Link>
              <Link to="/deals" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Deal Inspector & Dossiers
              </Link>
              <Link to="/war-room" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Executive War Room (QBR)
              </Link>
              <Link to="/heatmap" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Risk Distribution Heatmap
              </Link>
            </div>
          </div>

          {/* Col 3: Autonomous RevOps */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35", marginBottom: "16px" }}>
              Governance & Execution
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <Link to="/hygiene" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                CRM Data Hygiene Engine
              </Link>
              <Link to="/actions" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Action Approval Queue
              </Link>
              <Link to="/playbooks" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Autonomous Playbooks
              </Link>
              <Link to="/stakeholders" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Stakeholder Power Matrix
              </Link>
              <Link to="/battlecards" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Competitive Intelligence
              </Link>
              <Link to="/reps" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Rep Risk Profiles & Coaching
              </Link>
            </div>
          </div>

          {/* Col 4: Agency & Fleet */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35", marginBottom: "16px" }}>
              Agency & Commercial
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <Link to="/case-study" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Agency Case Study & ROI
              </Link>
              <Link to="/case-study" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                $99 Pilot Audit Offer
              </Link>
              <Link to="/clients" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Client Health Scorecards
              </Link>
              <Link to="/audit" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                SOC2 Audit & Compliance Trail
              </Link>
              <Link to="/settings" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Scoring Model Weights
              </Link>
            </div>
          </div>

          {/* Col 5: Security & Compliance */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35", marginBottom: "16px" }}>
              Enterprise Security
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.75)" }}>🔒 AES-256 GCM Token Encryption</span>
              <span style={{ color: "rgba(255, 255, 255, 0.75)" }}>🛡️ Zero LLM Hallucinations</span>
              <span style={{ color: "rgba(255, 255, 255, 0.75)" }}>⚡ Sub-200ms Webhook Engine</span>
              <span style={{ color: "rgba(255, 255, 255, 0.75)" }}>🏢 Single-Tenant Isolation</span>
              <span style={{ color: "rgba(255, 255, 255, 0.75)" }}>✅ 48/48 CI Automated Suites</span>
            </div>
          </div>
        </div>

        {/* ── Bottom Divider & Legal Bar ───────────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <div>
            © 2026 DealSense Inc. Built by <strong style={{ color: "#ffffff" }}>Peash Das Rudra</strong>. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
            <span style={{ cursor: "pointer" }}>Privacy Policy</span>
            <span style={{ cursor: "pointer" }}>Terms of Service</span>
            <span style={{ cursor: "pointer" }}>HubSpot App Marketplace Compliance</span>
            <span style={{ cursor: "pointer" }}>Security Disclosure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
