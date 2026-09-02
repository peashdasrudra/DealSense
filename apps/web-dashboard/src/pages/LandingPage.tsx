/**
 * DealSense — Ultimate High-Converting HubSpot SaaS Landing Page.
 * Engineered specifically to convert prospective RevOps agencies, VPs of Sales,
 * and SaaS revenue leaders into paying clients.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DealSenseIcon } from "../components/DealSenseLogo";
import { Footer } from "../components/Footer";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);

  // ── Interactive Deal Risk Simulator State ──────────────────────────────────
  const [simBuyerSilent, setSimBuyerSilent] = useState(true);
  const [simSingleThread, setSimSingleThread] = useState(true);
  const [simDatePushed, setSimDatePushed] = useState(true);
  const [simStaleActivity, setSimStaleActivity] = useState(false);

  // Dynamic Score Calculation for Simulator
  const calculateSimScore = () => {
    let score = 92;
    if (simBuyerSilent) score -= 32;
    if (simSingleThread) score -= 22;
    if (simDatePushed) score -= 18;
    if (simStaleActivity) score -= 16;
    return Math.max(12, score);
  };

  const currentScore = calculateSimScore();
  const getRiskBand = (s: number) => {
    if (s < 40) return { label: "Critical Risk", color: "var(--danger)", bg: "var(--risk-critical-bg)" };
    if (s < 70) return { label: "High Risk", color: "var(--warning)", bg: "var(--risk-high-bg)" };
    if (s < 85) return { label: "Moderate", color: "#1971c2", bg: "#e7f5ff" };
    return { label: "Healthy", color: "var(--risk-healthy)", bg: "var(--risk-healthy-bg)" };
  };
  const band = getRiskBand(currentScore);

  // ── Interactive ROI Slippage Calculator State ──────────────────────────────
  const [pipelineVal, setPipelineVal] = useState(1200000); // $1.2M default
  const estimatedSlippage = Math.round(pipelineVal * 0.18);
  const estimatedSaved = Math.round(estimatedSlippage * 0.75);

  // ── Audit Booking Form ─────────────────────────────────────────────────────
  const [orderTier, setOrderTier] = useState("audit-99");
  const [formData, setFormData] = useState({ name: "", email: "", company: "", portalId: "" });

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuditSuccess(true);
    setTimeout(() => {
      setAuditSuccess(false);
      setAuditModalOpen(false);
    }, 3500);
  };

  const PRICING_TIERS = [
    {
      id: "audit-99",
      name: "Pilot Deal Risk Audit",
      price: "$99",
      period: "one-time",
      badge: "Fastest ROI (24h)",
      highlight: true,
      desc: "Instant 0–100 deterministic scoring of your active HubSpot deals and identified slippage risks.",
      features: [
        "Full snapshot scoring of up to 50 HubSpot deals",
        "Deterministic 0–100 health telemetry breakdown",
        "Ghost deal & silent buyer identification",
        "Executive PDF board briefing report",
        "24–48h guaranteed turnaround",
        "100% Money-Back Guarantee",
      ],
      cta: "Start $99 Risk-Free Audit",
    },
    {
      id: "deploy-1500",
      name: "Full RevOps Deployment",
      price: "$1,500",
      period: "one-time setup",
      badge: "Complete Ownership",
      highlight: false,
      desc: "Complete self-hosted production deployment of the DealSense engine into your infrastructure.",
      features: [
        "Full FastAPI + PostgreSQL + Redis stack deployment",
        "Real-time bi-directional HubSpot webhook sync (<200ms)",
        "All 15 RevOps command modules & War Room",
        "Automated 1-click CRM hygiene writebacks",
        "Full source code & database ownership",
        "30 days dedicated engineering support",
      ],
      cta: "Deploy DealSense ($1,500)",
    },
    {
      id: "agency-3500",
      name: "Agency White-Label Fleet",
      price: "$3,500",
      period: "multi-portal fleet",
      badge: "For RevOps Agencies",
      highlight: false,
      desc: "Deploy DealSense across all your agency client portals with custom branding and scoring weights.",
      features: [
        "Multi-tenant fleet management for 10+ client portals",
        "Custom white-label branding & domain mapping",
        "Customizable scoring signal weights per industry",
        "Agency client health scorecards & QBR exports",
        "Dedicated onboarding Slack channel",
        "Priority feature roadmap requests",
      ],
      cta: "Order Agency Fleet ($3,500)",
    },
  ];

  return (
    <div style={{ background: "#ffffff", color: "var(--hs-text)", fontFamily: "var(--font-sans)", overflowX: "hidden" }}>
      {/* ── 1. Top Global Navigation Header ──────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--hs-border-dark)",
          zIndex: 1000,
          padding: "10px clamp(16px, 4vw, 24px)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Brand Logo -> Clicking routes to /pipeline (Home) */}
          <div
            onClick={() => navigate("/pipeline")}
            style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}
            title="Launch Home Dashboard"
          >
            <DealSenseIcon size={30} />
            <span style={{ fontSize: "19px", fontWeight: 800, color: "var(--hs-primary)", letterSpacing: "-0.03em" }}>
              Deal<span style={{ color: "#ff5c35" }}>Sense</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="desktop-nav-links">
            <span onClick={() => navigate("/pipeline")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-heading)", cursor: "pointer" }}>Home</span>
            <span onClick={() => navigate("/forecast")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-text)", cursor: "pointer" }}>Forecasting</span>
            <span onClick={() => navigate("/war-room")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-text)", cursor: "pointer" }}>War Room</span>
            <a href="#pricing" style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-text)", textDecoration: "none" }}>Pricing & Audit</a>
            <span onClick={() => navigate("/case-study")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-text)", cursor: "pointer" }}>Case Study</span>
          </div>

          {/* CTA Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="desktop-cta-btn"
              onClick={() => { setOrderTier("audit-99"); setAuditModalOpen(true); }}
              style={{
                padding: "8px 16px",
                background: "#ffffff",
                color: "#ff5c35",
                fontSize: "12.5px",
                fontWeight: 700,
                border: "1.5px solid #ff5c35",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s ease",
              }}
            >
              ⚡ $99 Deal Audit
            </button>
            <button
              onClick={() => navigate("/pipeline")}
              style={{
                padding: "9px 18px",
                background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(255, 92, 53, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              <span>Launch App</span>
              <span>→</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              style={{
                display: "none",
                padding: "6px 8px",
                background: "var(--hs-surface)",
                border: "1px solid var(--hs-border-dark)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
              className="mobile-hamburger-btn"
              aria-label="Toggle Menu"
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (<path d="M18 6L6 18M6 6l12 12" />) : (<path d="M4 6h16M4 12h16M4 18h16" />)}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                overflow: "hidden",
                borderTop: "1px solid var(--hs-border-dark)",
                marginTop: "10px",
                paddingTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div onClick={() => { navigate("/pipeline"); setMobileMenuOpen(false); }} style={{ padding: "8px 12px", fontWeight: 700, color: "var(--hs-heading)", borderRadius: "var(--radius-sm)", background: "var(--hs-surface)", cursor: "pointer" }}>
                📊 Home — Live Pipeline Dashboard
              </div>
              <div onClick={() => { navigate("/forecast"); setMobileMenuOpen(false); }} style={{ padding: "8px 12px", fontWeight: 600, color: "var(--hs-text)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                📈 Revenue Forecast & Simulation
              </div>
              <div onClick={() => { navigate("/war-room"); setMobileMenuOpen(false); }} style={{ padding: "8px 12px", fontWeight: 600, color: "var(--hs-text)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                ⚔️ Deal War Room (QBR)
              </div>
              <div onClick={() => { setOrderTier("audit-99"); setAuditModalOpen(true); setMobileMenuOpen(false); }} style={{ padding: "8px 12px", fontWeight: 700, color: "#ff5c35", borderRadius: "var(--radius-sm)", background: "rgba(255,92,53,0.08)", cursor: "pointer" }}>
                ⚡ Start $99 Risk-Free Audit
              </div>
              <div onClick={() => { navigate("/case-study"); setMobileMenuOpen(false); }} style={{ padding: "8px 12px", fontWeight: 600, color: "var(--hs-text)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                📜 Agency Case Study & Architecture
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── 2. Hero Section ──────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          padding: "clamp(36px, 6vw, 84px) clamp(16px, 4vw, 24px) clamp(32px, 5vw, 64px)",
          background: "linear-gradient(180deg, #fdf8f6 0%, #ffffff 100%)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "450px",
            background: "radial-gradient(ellipse at center, rgba(255, 92, 53, 0.12) 0%, rgba(0, 164, 189, 0.04) 50%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 880, margin: "0 auto", position: "relative" }}>
          {/* Trust Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255, 92, 53, 0.08)", border: "1px solid rgba(255, 92, 53, 0.25)", padding: "5px 14px", borderRadius: "var(--radius-pill)", marginBottom: 16 }}
          >
            <DealSenseIcon size={16} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#ff5c35", letterSpacing: "0.02em" }}>
              AUTONOMOUS HUBSPOT REVENUE INTELLIGENCE
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(28px, 6vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.035em",
              color: "var(--hs-heading)",
              margin: "0 0 16px",
            }}
          >
            Stop losing $100K+ deals <br /> to silent buyers & CRM slippage.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "clamp(14px, 2.5vw, 17.5px)",
              color: "var(--hs-text-muted)",
              lineHeight: 1.6,
              maxWidth: 680,
              margin: "0 auto 32px",
            }}
          >
            DealSense plugs into your HubSpot portal in 2 minutes, evaluates every deal across 7 deterministic risk signals within 180ms, and alerts your team before pipeline slips. Zero LLM hallucinations.
          </motion.p>

          {/* Dual High-Converting CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="landing-hero-btns"
          >
            <button
              onClick={() => { setOrderTier("audit-99"); setAuditModalOpen(true); }}
              style={{
                padding: "14px 30px",
                background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                color: "#ffffff",
                fontSize: "14.5px",
                fontWeight: 700,
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1), 0 6px 20px rgba(255, 92, 53, 0.4), inset 0 1px 0 rgba(255,255,255,0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s ease",
              }}
            >
              <span>🚀 Start $99 Risk-Free Deal Audit</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigate("/pipeline")}
              style={{
                padding: "14px 26px",
                background: "#ffffff",
                color: "var(--hs-heading)",
                fontSize: "14px",
                fontWeight: 700,
                border: "1.5px solid var(--hs-border-dark)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s ease",
              }}
            >
              ⚡ Explore Home Dashboard
            </button>
          </motion.div>

          <div style={{ marginTop: 14, fontSize: "12px", color: "var(--hs-text-muted)", fontWeight: 500 }}>
            🛡️ 100% Money-Back Guarantee · ⚡ 24h Delivery · 🔒 No CRM Write Access Required for Audit
          </div>
        </div>
      </section>

      {/* ── 3. Logo Trust Bar ────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--hs-border-dark)", borderBottom: "1px solid var(--hs-border-dark)", padding: "18px 16px", background: "var(--hs-surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hs-text-muted)", marginBottom: 12 }}>
            POWERING REVENUE LEADERS SCALING MILLION-DOLLAR HUBSPOT PIPELINES
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px 28px", flexWrap: "wrap", opacity: 0.85 }}>
            <span style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--hs-primary)" }}>TechCorp</span>
            <span style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--hs-primary)" }}>FinanceGo</span>
            <span style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--hs-primary)" }}>RetailMax</span>
            <span style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--hs-primary)" }}>HealthFirst</span>
            <span style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--hs-primary)" }}>LogiPro</span>
            <span style={{ fontSize: "11.5px", fontWeight: 700, background: "rgba(255, 92, 53, 0.1)", color: "#ff5c35", padding: "3px 9px", borderRadius: "var(--radius-pill)" }}>
              HubSpot Certified App
            </span>
          </div>
        </div>
      </section>

      {/* ── 4. Interactive Live Deal Simulator Widget ────────────────── */}
      <section style={{ padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 24px)", maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
            LIVE INTERACTIVE SIMULATOR
          </span>
          <h2 style={{ fontSize: "clamp(24px, 4.5vw, 38px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--hs-heading)", margin: "8px 0 10px" }}>
            See how DealSense scores deal risk in real-time.
          </h2>
          <p style={{ fontSize: "14px", color: "var(--hs-text-muted)", maxWidth: 620, margin: "0 auto", lineHeight: 1.55 }}>
            Toggle risk signals below to watch our 0–100 deterministic algorithm recalculate score and recommendations instantly.
          </p>
        </div>

        <div
          className="card landing-feature-grid"
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(20px, 4vw, 36px)",
            border: "1px solid var(--hs-border-dark)",
            borderTop: `4px solid ${band.color}`,
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Left: Signal Controls */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--hs-text-muted)", marginBottom: 14 }}>
              1. Toggle Deal Risk Signals:
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: simBuyerSilent ? "rgba(235, 0, 0, 0.05)" : "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", cursor: "pointer" }}>
                <input type="checkbox" checked={simBuyerSilent} onChange={(e) => setSimBuyerSilent(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#ff5c35" }} />
                <div style={{ fontSize: "13px" }}>
                  <strong>Economic Buyer Silent:</strong> 14+ days without response
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: simSingleThread ? "rgba(235, 0, 0, 0.05)" : "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", cursor: "pointer" }}>
                <input type="checkbox" checked={simSingleThread} onChange={(e) => setSimSingleThread(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#ff5c35" }} />
                <div style={{ fontSize: "13px" }}>
                  <strong>Single-Threaded:</strong> Only 1 contact involved in deal
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: simDatePushed ? "rgba(235, 0, 0, 0.05)" : "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", cursor: "pointer" }}>
                <input type="checkbox" checked={simDatePushed} onChange={(e) => setSimDatePushed(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#ff5c35" }} />
                <div style={{ fontSize: "13px" }}>
                  <strong>Date Slippage:</strong> Close date pushed 2+ times
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: simStaleActivity ? "rgba(235, 0, 0, 0.05)" : "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", cursor: "pointer" }}>
                <input type="checkbox" checked={simStaleActivity} onChange={(e) => setSimStaleActivity(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#ff5c35" }} />
                <div style={{ fontSize: "13px" }}>
                  <strong>Stale Activity:</strong> No rep activity in past 10 days
                </div>
              </label>
            </div>
          </div>

          {/* Right: Instant Score Output */}
          <div
            style={{
              background: "var(--hs-surface)",
              borderRadius: "var(--radius-md)",
              padding: "24px",
              border: "1px solid var(--hs-border-dark)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-heading)" }}>Deal Health Score Output</span>
              <span style={{ fontSize: "11px", color: "var(--risk-healthy)", fontWeight: 700 }}>● 180ms Ingestion Latency</span>
            </div>

            <div style={{ background: "#ffffff", padding: "18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
              <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginBottom: 4 }}>Orion Cloud Modernization · $180,000</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 800, color: band.color }}>
                  {currentScore}/100
                </div>
                <span style={{ fontSize: "11.5px", background: band.bg, color: band.color, padding: "4px 10px", borderRadius: "4px", fontWeight: 700 }}>
                  {band.label}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--hs-text)", marginTop: 10, lineHeight: 1.45 }}>
                {currentScore < 50
                  ? "⚠️ Critical slippage risk: Economic Buyer disengaged. High probability of slipping next quarter."
                  : currentScore < 75
                  ? "⚡ Moderate risk: Potential stage stall detected. Recommend multi-threading alignment."
                  : "✓ Strong pipeline momentum. High confidence to close this quarter."}
              </div>
            </div>

            <button
              onClick={() => { setOrderTier("audit-99"); setAuditModalOpen(true); }}
              style={{
                width: "100%",
                padding: "12px",
                background: "#ff5c35",
                color: "#fff",
                fontSize: "13.5px",
                fontWeight: 700,
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(255,92,53,0.3)",
              }}
            >
              Get This Scorecard For Your Deals ($99) →
            </button>
          </div>
        </div>
      </section>

      {/* ── 5. Interactive Pipeline Slippage ROI Calculator ──────────── */}
      <section style={{ padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 24px)", background: "var(--hs-surface)", borderTop: "1px solid var(--hs-border-dark)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
            REVENUE SLIPPAGE CALCULATOR
          </span>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--hs-heading)", margin: "8px 0 14px" }}>
            How much pipeline is currently at risk in your HubSpot?
          </h2>
          <p style={{ fontSize: "14px", color: "var(--hs-text-muted)", maxWidth: 580, margin: "0 auto 32px", lineHeight: 1.55 }}>
            Industry data shows 15–22% of active pipeline slips unexpectedly each quarter due to silent buyers and stale stages.
          </p>

          <div style={{ background: "#ffffff", padding: "clamp(24px, 4vw, 36px)", borderRadius: "var(--radius-lg)", border: "1px solid var(--hs-border-dark)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--hs-heading)" }}>Active HubSpot Pipeline:</span>
                <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--hs-primary)", fontFamily: "var(--font-heading)" }}>
                  ${(pipelineVal / 1000).toLocaleString()}K
                </span>
              </div>
              <input
                type="range"
                min={200000}
                max={5000000}
                step={50000}
                value={pipelineVal}
                onChange={(e) => setPipelineVal(Number(e.target.value))}
                style={{ width: "100%", height: 8, accentColor: "#ff5c35", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 6 }}>
                <span>$200K</span>
                <span>$2.5M</span>
                <span>$5M+</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              <div style={{ background: "var(--hs-surface)", padding: "18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
                <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", fontWeight: 600 }}>Estimated Slippage Risk</div>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--danger)", marginTop: 4 }}>
                  ${(estimatedSlippage / 1000).toLocaleString()}K
                </div>
              </div>

              <div style={{ background: "rgba(5,150,105,0.08)", padding: "18px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(5,150,105,0.25)" }}>
                <div style={{ fontSize: "11.5px", color: "var(--risk-healthy)", fontWeight: 600 }}>Revenue Saved by DealSense</div>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--risk-healthy)", marginTop: 4 }}>
                  ${(estimatedSaved / 1000).toLocaleString()}K
                </div>
              </div>
            </div>

            <button
              onClick={() => { setOrderTier("audit-99"); setAuditModalOpen(true); }}
              style={{
                padding: "13px 28px",
                background: "#ff5c35",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(255,92,53,0.35)",
              }}
            >
              Audit My Portal For $99 & Recover Stalled Deals →
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. Pricing Packages Section ──────────────────────────────── */}
      <section id="pricing" style={{ padding: "clamp(48px, 6vw, 84px) clamp(16px, 4vw, 24px)", maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
            TRANSPARENT VALUE-BASED PRICING
          </span>
          <h2 style={{ fontSize: "clamp(26px, 4.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--hs-heading)", margin: "8px 0 12px" }}>
            Start with a $99 Pilot. Scale to Full Deployment.
          </h2>
          <p style={{ fontSize: "14.5px", color: "var(--hs-text-muted)", maxWidth: 620, margin: "0 auto", lineHeight: 1.55 }}>
            No recurring hidden subscriptions. Full database ownership and guaranteed revenue ROI.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "stretch" }}>
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              style={{
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                padding: "32px 24px",
                border: tier.highlight ? "2px solid #ff5c35" : "1px solid var(--hs-border-dark)",
                boxShadow: tier.highlight ? "0 12px 32px rgba(255, 92, 53, 0.15)" : "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              {tier.highlight && (
                <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#ff5c35", color: "#fff", padding: "4px 12px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Most Popular For New Clients
                </span>
              )}

              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: tier.highlight ? "#ff5c35" : "var(--hs-text-muted)", textTransform: "uppercase", marginBottom: 6 }}>
                  {tier.badge}
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--hs-heading)", margin: "0 0 6px" }}>
                  {tier.name}
                </h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "14px 0" }}>
                  <span style={{ fontSize: "36px", fontWeight: 800, color: "var(--hs-heading)", letterSpacing: "-0.03em" }}>
                    {tier.price}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>/ {tier.period}</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", lineHeight: 1.5, marginBottom: 20 }}>
                  {tier.desc}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28, borderTop: "1px solid var(--hs-border-dark)", paddingTop: 18 }}>
                  {tier.features.map((feat, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "12.5px" }}>
                      <span style={{ color: "#10b981", fontWeight: 800, flexShrink: 0 }}>✓</span>
                      <span style={{ color: "var(--hs-text)" }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setOrderTier(tier.id); setAuditModalOpen(true); }}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: tier.highlight ? "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)" : "var(--hs-primary)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  boxShadow: tier.highlight ? "0 4px 14px rgba(255, 92, 53, 0.35)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {tier.cta} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Final High-Impact CTA Banner ──────────────────────────── */}
      <section style={{ padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 24px)", background: "#ffffff" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(135deg, #124548 0%, #062b2e 100%)",
            padding: "clamp(32px, 5vw, 64px) clamp(20px, 4vw, 48px)",
            textAlign: "center",
            color: "#ffffff",
            boxShadow: "0 12px 36px rgba(18, 69, 72, 0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 92, 53, 0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

          <h2 style={{ fontSize: "clamp(22px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            Make impossible pipeline growth feel impossibly easy.
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.85)", maxWidth: 620, margin: "0 auto 28px", lineHeight: 1.55 }}>
            Deploy DealSense into your HubSpot portal in under 2 minutes. Score your entire pipeline, uncover hidden deal risks, and power predictive revenue decisions.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => { setOrderTier("audit-99"); setAuditModalOpen(true); }}
              style={{
                padding: "13px 28px",
                background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                color: "#ffffff",
                fontSize: "14.5px",
                fontWeight: 700,
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(255, 92, 53, 0.45)",
              }}
            >
              Start $99 Risk-Free Audit →
            </button>
            <button
              onClick={() => navigate("/pipeline")}
              style={{
                padding: "13px 22px",
                background: "#ffffff",
                color: "#124548",
                fontSize: "14px",
                fontWeight: 700,
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              Launch Home Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ── 8. Global SaaS Multi-Column Footer ───────────────────────── */}
      <Footer />

      {/* ── 9. Interactive Audit / Order Checkout Modal ─────────────── */}
      <AnimatePresence>
        {auditModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuditModalOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(18, 69, 72, 0.55)", backdropFilter: "blur(4px)", zIndex: 2000 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: 480,
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                padding: "28px 24px",
                boxShadow: "var(--shadow-xl)",
                zIndex: 2001,
                border: "1px solid var(--hs-border-dark)",
                borderTop: "4px solid #ff5c35",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <DealSenseIcon size={24} />
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--hs-primary)" }}>
                    {orderTier === "audit-99" ? "🚀 Start $99 Deal Risk Audit" : "⚡ Order Deployment"}
                  </span>
                </div>
                <button onClick={() => setAuditModalOpen(false)} style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer", color: "var(--hs-text-muted)" }}>✕</button>
              </div>

              {auditSuccess ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: "36px", marginBottom: 8 }}>🎉</div>
                  <h4 style={{ fontSize: "18px", fontWeight: 800, color: "var(--risk-healthy)" }}>Audit Request Received!</h4>
                  <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", marginTop: 6 }}>
                    Our engineering team has received your portal details. You will receive an onboarding link and report within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAuditSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Full Name *</label>
                    <input required type="text" placeholder="Sarah Miller" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)", fontSize: "13px" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Work Email *</label>
                    <input required type="email" placeholder="sarah@agency.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)", fontSize: "13px" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Company / Agency *</label>
                    <input required type="text" placeholder="Apex Revenue Ops" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)", fontSize: "13px" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>HubSpot Portal ID (Optional)</label>
                    <input type="text" placeholder="e.g. #48921820" value={formData.portalId} onChange={(e) => setFormData({ ...formData, portalId: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)", fontSize: "13px" }} />
                  </div>

                  <div style={{ padding: "8px 12px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", fontSize: "11px", color: "var(--hs-text-muted)" }}>
                    🔒 <strong>100% Risk-Free:</strong> 100% money-back guarantee if we don't catch at least $50K in at-risk pipeline.
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#ff5c35",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 700,
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(255, 92, 53, 0.35)",
                      marginTop: 4,
                    }}
                  >
                    🚀 {orderTier === "audit-99" ? "Confirm & Start $99 Audit" : "Submit Deployment Order"}
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
