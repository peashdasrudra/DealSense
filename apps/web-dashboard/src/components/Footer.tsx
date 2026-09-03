/**
 * DealSense — Ultra-Premium Enterprise SaaS Global Footer.
 * Pure HubSpot-native enterprise design system edition.
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { DealSenseIcon } from "./DealSenseLogo";

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #092124 0%, #051618 100%)",
        color: "#ffffff",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        paddingTop: "72px",
        paddingBottom: "40px",
        fontFamily: "var(--font-sans)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient Radial Background Glow */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: "15%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 92, 53, 0.09) 0%, rgba(0, 164, 189, 0.04) 50%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* ── Top Row: Brand, Trust Badges, & Newsletter ─────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "36px",
            paddingBottom: "48px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            marginBottom: "52px",
            alignItems: "center",
          }}
        >
          {/* Brand & Value Prop */}
          <div>
            <div
              onClick={() => navigate("/")}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: "14px" }}
            >
              <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.12)" }}>
                <DealSenseIcon size={22} />
              </div>
              <span style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-0.03em" }}>
                Deal<span style={{ color: "#ff5c35" }}>Sense</span>
              </span>
            </div>
            <p style={{ fontSize: "13.5px", color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.6, margin: 0, maxWidth: 360 }}>
              The autonomous HubSpot-native revenue intelligence and deterministic deal risk scoring engine for high-velocity B2B RevOps teams.
            </p>
          </div>

          {/* Trust Certifications Pill Group */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
              Enterprise Compliance & Security
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span style={{ padding: "5px 12px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "var(--radius-pill)", fontSize: "11.5px", fontWeight: 600, color: "#e2e8f0" }}>
                🔒 AES-256 GCM
              </span>
              <span style={{ padding: "5px 12px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "var(--radius-pill)", fontSize: "11.5px", fontWeight: 600, color: "#e2e8f0" }}>
                🛡️ SOC 2 Type II
              </span>
              <span style={{ padding: "5px 12px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "var(--radius-pill)", fontSize: "11.5px", fontWeight: 600, color: "#e2e8f0" }}>
                🟠 HubSpot App Marketplace
              </span>
              <span style={{ padding: "5px 12px", background: "rgba(5, 150, 105, 0.15)", border: "1px solid rgba(5, 150, 105, 0.3)", borderRadius: "var(--radius-pill)", fontSize: "11.5px", fontWeight: 700, color: "#34d399", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
                Sub-200ms Webhooks
              </span>
            </div>
          </div>

          {/* Quick Launch CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <button
              onClick={() => navigate("/pipeline")}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                color: "#ffffff",
                fontSize: "13.5px",
                fontWeight: 700,
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(255, 92, 53, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s ease",
              }}
            >
              <span>Launch Live Dashboard</span>
              <span>→</span>
            </button>
            <span style={{ fontSize: "11.5px", color: "rgba(255, 255, 255, 0.5)" }}>
              No credit card required · 1-Click HubSpot OAuth
            </span>
          </div>
        </div>

        {/* ── Middle Grid: 5 Multi-Column Navigation Sections ─────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "36px 20px",
            marginBottom: "56px",
          }}
        >
          {/* Col 1: Platform Hubs */}
          <div>
            <div style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35", marginBottom: "16px" }}>
              Revenue Platform
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "13px" }}>
              <Link to="/pipeline" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Pipeline Overview
              </Link>
              <Link to="/forecast" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Monte Carlo Forecasting
              </Link>
              <Link to="/waterfall" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Pipeline Waterfall
              </Link>
              <Link to="/deals" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Deal Inspector & Dossiers
              </Link>
              <Link to="/war-room" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Executive Deal War Room
              </Link>
              <Link to="/heatmap" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Risk Distribution Heatmap
              </Link>
            </div>
          </div>

          {/* Col 2: Sales & RevOps Execution */}
          <div>
            <div style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35", marginBottom: "16px" }}>
              RevOps Governance
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "13px" }}>
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
                Competitive Battlecards
              </Link>
              <Link to="/reps" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Rep Risk Profiles
              </Link>
            </div>
          </div>

          {/* Col 3: Commercial & Partnerships */}
          <div>
            <div style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35", marginBottom: "16px" }}>
              Agency & Partnerships
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "13px" }}>
              <Link to="/case-study" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Agency Case Study & ROI
              </Link>
              <Link to="/case-study" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Pilot Portal Deal Audit
              </Link>
              <Link to="/agency" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Solutions Partner Fleet Deployment
              </Link>
              <Link to="/clients" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Client Health Scorecards
              </Link>
              <Link to="/settings" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>
                Custom Scoring Weights
              </Link>
            </div>
          </div>

          {/* Col 4: Integrations & Stack */}
          <div>
            <div style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35", marginBottom: "16px" }}>
              Ecosystem & Tech
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "13px" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>🟠 HubSpot CRM Sync</span>
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>💬 Slack Webhook Bot</span>
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>🐘 PostgreSQL + pgvector</span>
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>⚡ Redis Event Streams</span>
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>🛡️ Deterministic Scoring</span>
            </div>
          </div>

          {/* Col 5: Hub System Status */}
          <div>
            <div style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35", marginBottom: "16px" }}>
              Telemetry Status
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "var(--radius-sm)", padding: "14px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>API Gateway</span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>99.99%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>Webhook Ingest</span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>180ms</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>Automated CI</span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>48/48 Passed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Legal, Language & Copyright Bar ───────────────────── */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.55)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span>© 2026 DealSense Inc. Engineered by <strong style={{ color: "#ffffff" }}>Peash Das Rudra</strong>.</span>
            <span>•</span>
            <Link to="/privacy" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" style={{ color: "rgba(255, 255, 255, 0.75)", textDecoration: "none" }}>Terms of Service</Link>
            <span>•</span>
            <span style={{ color: "rgba(255, 255, 255, 0.75)" }}>Security Disclosures</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ padding: "4px 10px", background: "rgba(255, 255, 255, 0.06)", borderRadius: "var(--radius-pill)", border: "1px solid rgba(255, 255, 255, 0.1)", fontSize: "11px", color: "#e2e8f0" }}>
              🌐 English (US)
            </span>
            <span style={{ padding: "4px 10px", background: "rgba(255, 255, 255, 0.06)", borderRadius: "var(--radius-pill)", border: "1px solid rgba(255, 255, 255, 0.1)", fontSize: "11px", color: "#e2e8f0" }}>
              HubSpot API v3
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
