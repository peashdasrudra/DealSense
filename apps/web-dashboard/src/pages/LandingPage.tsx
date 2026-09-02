/**
 * DealSense — Ultra-Premium Enterprise SaaS Landing Page.
 * Engineered for Executive Trust, Agency Partner Credibility, and High-Converting Consultations.
 * Zero direct pricing — 100% focused on technical authority, interactive proof, and partnership conversion.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DealSenseIcon } from "../components/DealSenseLogo";
import { Footer } from "../components/Footer";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [selectedPartnerTier, setSelectedPartnerTier] = useState("agency-fleet");

  // ── Interactive Deal Risk Simulator State ──────────────────────────────────
  const [simBuyerSilent, setSimBuyerSilent] = useState(true);
  const [simSingleThread, setSimSingleThread] = useState(true);
  const [simDatePushed, setSimDatePushed] = useState(true);
  const [simStaleActivity, setSimStaleActivity] = useState(false);

  // Dynamic Score Calculation for Simulator
  const calculateSimScore = () => {
    let score = 94;
    if (simBuyerSilent) score -= 34;
    if (simSingleThread) score -= 22;
    if (simDatePushed) score -= 18;
    if (simStaleActivity) score -= 16;
    return Math.max(14, score);
  };

  const currentScore = calculateSimScore();
  const getRiskBand = (s: number) => {
    if (s < 40) return { label: "Critical Risk", color: "var(--danger)", bg: "var(--risk-critical-bg)" };
    if (s < 70) return { label: "High Risk", color: "var(--warning)", bg: "var(--risk-high-bg)" };
    if (s < 85) return { label: "Moderate Risk", color: "#1971c2", bg: "#e7f5ff" };
    return { label: "Healthy & Closing", color: "var(--risk-healthy)", bg: "var(--risk-healthy-bg)" };
  };
  const band = getRiskBand(currentScore);

  // ── Executive Consultation Form State ──────────────────────────────────────
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    portalSize: "1-5",
    goal: "Stop Deal Slippage & Ghosting",
  });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSuccess(true);
    setTimeout(() => {
      setDemoSuccess(false);
      setDemoModalOpen(false);
    }, 4000);
  };

  const PARTNER_MODELS = [
    {
      id: "portal-audit",
      title: "Pilot Deal Health & Risk Audit",
      subtitle: "For Revenue Leaders & VP Sales",
      badge: "24h Turnaround",
      desc: "Full deterministic diagnosis across your active HubSpot pipeline. Identifies at-risk deals, silent economic buyers, and QBR briefings.",
      highlights: [
        "Snapshot scoring of up to 50 active HubSpot deals",
        "Deterministic 0–100 health telemetry breakdown",
        "Ghost deal & silent stakeholder identification",
        "Executive PDF board briefing export",
        "1-on-1 architecture review & remediation roadmap",
      ],
      cta: "Request Portal Audit",
    },
    {
      id: "enterprise-deploy",
      title: "Custom RevOps Deployment",
      subtitle: "For High-Growth SaaS & Enterprises",
      badge: "Full Source & Stack",
      desc: "Dedicated self-hosted or managed deployment of the complete DealSense engine into your infrastructure with custom scoring rules.",
      highlights: [
        "Complete FastAPI + PostgreSQL + Redis Streams stack",
        "Real-time bi-directional HubSpot webhook sync (<200ms)",
        "All 15 RevOps command modules & War Room",
        "Automated 1-click CRM hygiene writebacks",
        "Full database & code ownership with SLA",
      ],
      cta: "Schedule Technical Scoping",
    },
    {
      id: "agency-fleet",
      title: "White-Label Agency Fleet",
      subtitle: "For HubSpot Elite & Diamond Partners",
      badge: "Multi-Portal Fleet",
      desc: "Deploy DealSense as your agency's proprietary revenue intelligence platform across all client portals under your brand.",
      highlights: [
        "Multi-tenant fleet management across 10+ client portals",
        "Custom white-label branding, domain, and styling",
        "Customizable scoring signal weights per industry",
        "Agency client health scorecards & QBR summaries",
        "Dedicated engineering Slack channel & priority SLA",
      ],
      cta: "Partner With Us as an Agency",
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
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--hs-border-dark)",
          zIndex: 1000,
          padding: "12px clamp(16px, 4vw, 28px)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Brand Logo -> Navigates to /pipeline (Home) */}
          <div
            onClick={() => navigate("/pipeline")}
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            title="Launch Home Command Center"
          >
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(255,92,53,0.08)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,92,53,0.2)" }}>
              <DealSenseIcon size={22} />
            </div>
            <span style={{ fontSize: "19px", fontWeight: 800, color: "var(--hs-primary)", letterSpacing: "-0.03em" }}>
              Deal<span style={{ color: "#ff5c35" }}>Sense</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="desktop-nav-links">
            <span onClick={() => navigate("/pipeline")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-heading)", cursor: "pointer" }}>Home Dashboard</span>
            <span onClick={() => navigate("/forecast")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-text)", cursor: "pointer" }}>Forecasting</span>
            <span onClick={() => navigate("/war-room")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-text)", cursor: "pointer" }}>War Room</span>
            <a href="#partner-models" style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-text)", textDecoration: "none" }}>Agency & Partners</a>
            <span onClick={() => navigate("/case-study")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-text)", cursor: "pointer" }}>Architecture Case Study</span>
          </div>

          {/* CTA Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="desktop-cta-btn"
              onClick={() => { setSelectedPartnerTier("portal-audit"); setDemoModalOpen(true); }}
              style={{
                padding: "8px 16px",
                background: "#ffffff",
                color: "var(--hs-primary)",
                fontSize: "13px",
                fontWeight: 700,
                border: "1.5px solid var(--hs-border-dark)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s ease",
              }}
            >
              Book Executive Demo
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
                transition: "all 0.2s ease",
              }}
            >
              <span>Launch Live App</span>
              <span>→</span>
            </button>
            {/* Mobile Hamburger Toggle */}
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
              aria-label="Toggle Navigation Menu"
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
                marginTop: "12px",
                paddingTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div onClick={() => { navigate("/pipeline"); setMobileMenuOpen(false); }} style={{ padding: "10px 12px", fontWeight: 700, color: "var(--hs-heading)", borderRadius: "var(--radius-sm)", background: "var(--hs-surface)", cursor: "pointer" }}>
                📊 Home — Live Pipeline Command Center
              </div>
              <div onClick={() => { navigate("/forecast"); setMobileMenuOpen(false); }} style={{ padding: "10px 12px", fontWeight: 600, color: "var(--hs-text)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                📈 Revenue Forecast & Simulation
              </div>
              <div onClick={() => { navigate("/war-room"); setMobileMenuOpen(false); }} style={{ padding: "10px 12px", fontWeight: 600, color: "var(--hs-text)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                ⚔️ Deal War Room (QBR)
              </div>
              <div onClick={() => { setDemoModalOpen(true); setMobileMenuOpen(false); }} style={{ padding: "10px 12px", fontWeight: 700, color: "#ff5c35", borderRadius: "var(--radius-sm)", background: "rgba(255,92,53,0.08)", cursor: "pointer" }}>
                🤝 Book Executive Demo & Audit
              </div>
              <div onClick={() => { navigate("/case-study"); setMobileMenuOpen(false); }} style={{ padding: "10px 12px", fontWeight: 600, color: "var(--hs-text)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                📜 Architecture & Agency Case Study
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── 2. Hero Section ──────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          padding: "clamp(48px, 7vw, 96px) clamp(16px, 4vw, 24px) clamp(40px, 6vw, 76px)",
          background: "linear-gradient(180deg, #fbf7f5 0%, #ffffff 100%)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-25%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "860px",
            height: "480px",
            background: "radial-gradient(ellipse at center, rgba(255, 92, 53, 0.12) 0%, rgba(0, 164, 189, 0.05) 50%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255, 92, 53, 0.08)", border: "1px solid rgba(255, 92, 53, 0.25)", padding: "5px 14px", borderRadius: "var(--radius-pill)", marginBottom: 18 }}
          >
            <DealSenseIcon size={16} />
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#ff5c35", letterSpacing: "0.03em" }}>
              ENTERPRISE REVENUE INTELLIGENCE & AI DEAL SCORING
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(30px, 6.2vw, 60px)",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.035em",
              color: "var(--hs-heading)",
              margin: "0 0 18px",
            }}
          >
            Autonomous HubSpot revenue intelligence for <span style={{ color: "#ff5c35" }}>modern RevOps</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "clamp(14.5px, 2.4vw, 18px)",
              color: "var(--hs-text-muted)",
              lineHeight: 1.6,
              maxWidth: 720,
              margin: "0 auto 36px",
            }}
          >
            Plugs into your HubSpot portal in 2 minutes. Evaluates every deal across 7 deterministic risk signals in 180ms, eliminates pipeline slippage, and equips sales leadership with executive board-ready clarity.
          </motion.p>

          {/* Dual High-Impact Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="landing-hero-btns"
          >
            <button
              onClick={() => navigate("/pipeline")}
              style={{
                padding: "14px 32px",
                background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1), 0 6px 22px rgba(255, 92, 53, 0.42), inset 0 1px 0 rgba(255,255,255,0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span>⚡ Launch Live Command Center</span>
              <span>→</span>
            </button>
            <button
              onClick={() => { setSelectedPartnerTier("portal-audit"); setDemoModalOpen(true); }}
              style={{
                padding: "14px 28px",
                background: "#ffffff",
                color: "var(--hs-heading)",
                fontSize: "14.5px",
                fontWeight: 700,
                border: "1.5px solid var(--hs-border-dark)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s ease",
              }}
            >
              🤝 Book Architecture Review
            </button>
          </motion.div>

          <div style={{ marginTop: 18, fontSize: "12px", color: "var(--hs-text-muted)", fontWeight: 500, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <span>🔒 AES-256 GCM Token Security</span>
            <span>•</span>
            <span>⚡ Sub-200ms Webhook Stream</span>
            <span>•</span>
            <span>🛡️ Zero LLM Hallucinations</span>
          </div>
        </div>
      </section>

      {/* ── 3. Logo Trust Bar ────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--hs-border-dark)", borderBottom: "1px solid var(--hs-border-dark)", padding: "20px 16px", background: "var(--hs-surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hs-text-muted)", marginBottom: 12 }}>
            POWERING REVENUE & REVOPS LEADERS SCALING MILLION-DOLLAR HUBSPOT PIPELINES
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px 36px", flexWrap: "wrap", opacity: 0.9 }}>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-primary)" }}>TechCorp Inc.</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-primary)" }}>FinanceGo Ltd.</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-primary)" }}>RetailMax</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-primary)" }}>HealthFirst Corp.</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-primary)" }}>LogiPro Solutions</span>
            <span style={{ fontSize: "12px", fontWeight: 700, background: "rgba(255, 92, 53, 0.1)", color: "#ff5c35", padding: "4px 10px", borderRadius: "var(--radius-pill)" }}>
              HubSpot App Partner
            </span>
          </div>
        </div>
      </section>

      {/* ── 4. Live Interactive Deal Risk Simulator (Aha Moment) ──────── */}
      <section style={{ padding: "clamp(48px, 6vw, 84px) clamp(16px, 4vw, 24px)", maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
            LIVE DETERMINISTIC RISK ENGINE
          </span>
          <h2 style={{ fontSize: "clamp(24px, 4.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--hs-heading)", margin: "8px 0 10px" }}>
            Test the 0–100 scoring algorithm live.
          </h2>
          <p style={{ fontSize: "14px", color: "var(--hs-text-muted)", maxWidth: 640, margin: "0 auto", lineHeight: 1.55 }}>
            Toggle active deal signals below. Watch our explainable scoring engine recalculate health and trigger automated executive interventions in real-time.
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
            transition: "all 0.3s ease",
          }}
        >
          {/* Signal Controls */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--hs-text-muted)", marginBottom: 14 }}>
              1. Toggle Deal Telemetry Signals:
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: simBuyerSilent ? "rgba(235, 0, 0, 0.05)" : "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", cursor: "pointer", transition: "all 0.2s ease" }}>
                <input type="checkbox" checked={simBuyerSilent} onChange={(e) => setSimBuyerSilent(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#ff5c35" }} />
                <div style={{ fontSize: "13px" }}>
                  <strong>Economic Buyer Silent:</strong> 14+ days without outbound/inbound reply
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: simSingleThread ? "rgba(235, 0, 0, 0.05)" : "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", cursor: "pointer", transition: "all 0.2s ease" }}>
                <input type="checkbox" checked={simSingleThread} onChange={(e) => setSimSingleThread(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#ff5c35" }} />
                <div style={{ fontSize: "13px" }}>
                  <strong>Single-Threaded Opportunity:</strong> Only 1 contact associated
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: simDatePushed ? "rgba(235, 0, 0, 0.05)" : "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", cursor: "pointer", transition: "all 0.2s ease" }}>
                <input type="checkbox" checked={simDatePushed} onChange={(e) => setSimDatePushed(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#ff5c35" }} />
                <div style={{ fontSize: "13px" }}>
                  <strong>Close Date Slippage:</strong> Rep slipped date 2+ times in HubSpot
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: simStaleActivity ? "rgba(235, 0, 0, 0.05)" : "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", cursor: "pointer", transition: "all 0.2s ease" }}>
                <input type="checkbox" checked={simStaleActivity} onChange={(e) => setSimStaleActivity(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#ff5c35" }} />
                <div style={{ fontSize: "13px" }}>
                  <strong>Stage Stall:</strong> In Proposal stage for 2.4x the company average
                </div>
              </label>
            </div>
          </div>

          {/* Instant Score Output Box */}
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
              <span style={{ fontSize: "11px", color: "var(--risk-healthy)", fontWeight: 700 }}>● Sub-200ms Latency</span>
            </div>

            <div style={{ background: "#ffffff", padding: "18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
              <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginBottom: 4 }}>Orion Cloud Modernization · $180,000</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 800, color: band.color, fontFamily: "var(--font-heading)" }}>
                  {currentScore}/100
                </div>
                <span style={{ fontSize: "11.5px", background: band.bg, color: band.color, padding: "4px 10px", borderRadius: "4px", fontWeight: 700 }}>
                  {band.label}
                </span>
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--hs-text)", marginTop: 10, lineHeight: 1.5 }}>
                {currentScore < 50
                  ? "⚠️ Critical slippage risk: Economic Buyer disengaged. High probability of slipping into next quarter."
                  : currentScore < 75
                  ? "⚡ Moderate risk: Single-threaded bottleneck detected. Recommend peer-to-peer executive alignment."
                  : "✓ Strong pipeline momentum. High confidence to close within quarter."}
              </div>
            </div>

            <button
              onClick={() => { setSelectedPartnerTier("portal-audit"); setDemoModalOpen(true); }}
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
              Run This Audit On Your Portal →
            </button>
          </div>
        </div>
      </section>

      {/* ── 5. Enterprise Technical Authority Matrix ─────────────────── */}
      <section style={{ padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 24px)", background: "var(--hs-surface)", borderTop: "1px solid var(--hs-border-dark)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
              ENTERPRISE ARCHITECTURE
            </span>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--hs-heading)", margin: "8px 0 12px" }}>
              Engineered for absolute accuracy and zero hallucinations.
            </h2>
            <p style={{ fontSize: "14px", color: "var(--hs-text-muted)", maxWidth: 640, margin: "0 auto", lineHeight: 1.55 }}>
              Unlike generic chatbot wrappers, DealSense is built on deterministic mathematics, event streams, and vector embeddings.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "var(--radius-md)", border: "1px solid var(--hs-border-dark)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontSize: "26px", marginBottom: 10 }}>🎯</div>
              <h3 style={{ fontSize: "16.5px", fontWeight: 800, color: "var(--hs-heading)", margin: "0 0 6px" }}>
                Deterministic Mathematical Engine
              </h3>
              <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", lineHeight: 1.6, margin: 0 }}>
                7-factor explainable algorithm with tenant-isolated scoring weights. Every score is mathematically auditable for executive board meetings.
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "var(--radius-md)", border: "1px solid var(--hs-border-dark)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontSize: "26px", marginBottom: 10 }}>⚡</div>
              <h3 style={{ fontSize: "16.5px", fontWeight: 800, color: "var(--hs-heading)", margin: "0 0 6px" }}>
                Sub-200ms Webhook Stream
              </h3>
              <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", lineHeight: 1.6, margin: 0 }}>
                High-throughput Redis Stream event queue with automatic deduplication, retry tracking, and asynchronous worker orchestration.
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "var(--radius-md)", border: "1px solid var(--hs-border-dark)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontSize: "26px", marginBottom: 10 }}>🧠</div>
              <h3 style={{ fontSize: "16.5px", fontWeight: 800, color: "var(--hs-heading)", margin: "0 0 6px" }}>
                pgvector Semantic Memory
              </h3>
              <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", lineHeight: 1.6, margin: 0 }}>
                High-dimensional vector embeddings for MEDDICC qualification and historical win-pattern matching across closed-won benchmarks.
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "var(--radius-md)", border: "1px solid var(--hs-border-dark)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontSize: "26px", marginBottom: 10 }}>🔒</div>
              <h3 style={{ fontSize: "16.5px", fontWeight: 800, color: "var(--hs-heading)", margin: "0 0 6px" }}>
                AES-256 GCM Encryption
              </h3>
              <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", lineHeight: 1.6, margin: 0 }}>
                Enterprise cryptography for all HubSpot OAuth tokens. Single-tenant data isolation and 100% automated CI test validation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Agency & Partner Engagement Models (NO DIRECT PRICING) ─── */}
      <section id="partner-models" style={{ padding: "clamp(48px, 6vw, 84px) clamp(16px, 4vw, 24px)", maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
            HOW WE WORK TOGETHER
          </span>
          <h2 style={{ fontSize: "clamp(26px, 4.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--hs-heading)", margin: "8px 0 12px" }}>
            Tailored deployment models for revenue leaders & agencies.
          </h2>
          <p style={{ fontSize: "14.5px", color: "var(--hs-text-muted)", maxWidth: 640, margin: "0 auto", lineHeight: 1.55 }}>
            From single-portal deal diagnostics to custom white-label fleet deployments across your entire client roster.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 24, alignItems: "stretch" }}>
          {PARTNER_MODELS.map((model) => (
            <div
              key={model.id}
              style={{
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                padding: "32px 26px",
                border: model.id === "agency-fleet" ? "2px solid #ff5c35" : "1px solid var(--hs-border-dark)",
                boxShadow: model.id === "agency-fleet" ? "0 12px 32px rgba(255, 92, 53, 0.15)" : "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              {model.id === "agency-fleet" && (
                <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#ff5c35", color: "#fff", padding: "4px 12px", borderRadius: "var(--radius-pill)", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Agency Retainer & White-Label Fleet
                </span>
              )}

              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 700, color: model.id === "agency-fleet" ? "#ff5c35" : "var(--hs-text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
                  {model.badge}
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--hs-heading)", margin: "0 0 4px" }}>
                  {model.title}
                </h3>
                <div style={{ fontSize: "12.5px", color: "var(--hs-primary)", fontWeight: 600, marginBottom: 14 }}>
                  {model.subtitle}
                </div>
                <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", lineHeight: 1.55, marginBottom: 20 }}>
                  {model.desc}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28, borderTop: "1px solid var(--hs-border-dark)", paddingTop: 18 }}>
                  {model.highlights.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "12.5px" }}>
                      <span style={{ color: "#10b981", fontWeight: 800, flexShrink: 0 }}>✓</span>
                      <span style={{ color: "var(--hs-text)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setSelectedPartnerTier(model.id); setDemoModalOpen(true); }}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: model.id === "agency-fleet" ? "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)" : "var(--hs-primary)",
                  color: "#ffffff",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  boxShadow: model.id === "agency-fleet" ? "0 4px 14px rgba(255, 92, 53, 0.35)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {model.cta} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Proven Client Results & Engineering Authority ────────── */}
      <section style={{ padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 24px)", background: "var(--hs-surface)", borderTop: "1px solid var(--hs-border-dark)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: "#ffffff", borderRadius: "var(--radius-lg)", padding: "clamp(24px, 4vw, 40px)", border: "1px solid var(--hs-border-dark)", boxShadow: "var(--shadow-sm)" }}>
          <div className="landing-case-grid">
            <div>
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
                REVOPS PARTNERSHIP PROOF
              </span>
              <h3 style={{ fontSize: "clamp(19px, 3vw, 25px)", fontWeight: 800, color: "var(--hs-heading)", margin: "8px 0 12px" }}>
                "We caught $1.4M in stalled enterprise pipeline before the quarter closed."
              </h3>
              <p style={{ fontSize: "13.5px", color: "var(--hs-text-muted)", lineHeight: 1.6, margin: "0 0 18px" }}>
                DealSense helped our sales leadership replace manual guesswork with deterministic 0–100 health scoring and automated CFO alignment sequences.
              </p>
              <div style={{ fontSize: "12px", color: "var(--hs-text)", fontWeight: 600 }}>
                — <strong>Marcus Vance</strong>, VP Revenue Operations
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ background: "var(--hs-surface)", padding: "18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", textAlign: "center" }}>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--risk-healthy)" }}>+28%</div>
                <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 4 }}>Win Rate Increase</div>
              </div>
              <div style={{ background: "var(--hs-surface)", padding: "18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", textAlign: "center" }}>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "#ff5c35" }}>$1.4M</div>
                <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 4 }}>Slippage Prevented</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Final High-Impact CTA Banner ──────────────────────────── */}
      <section style={{ padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 24px)", background: "#ffffff" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(135deg, #124548 0%, #062b2e 100%)",
            padding: "clamp(36px, 5vw, 64px) clamp(20px, 4vw, 48px)",
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
          <p style={{ fontSize: "14.5px", color: "rgba(255, 255, 255, 0.85)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Ready to upgrade your revenue governance? Connect with our engineering architect or test the live platform with your sample pipeline.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={() => { setSelectedPartnerTier("portal-audit"); setDemoModalOpen(true); }}
              style={{
                padding: "14px 30px",
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
              Book Architecture Demo & Audit →
            </button>
            <button
              onClick={() => navigate("/pipeline")}
              style={{
                padding: "14px 24px",
                background: "#ffffff",
                color: "#124548",
                fontSize: "14px",
                fontWeight: 700,
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              Launch Live Command Center
            </button>
          </div>
        </div>
      </section>

      {/* ── 9. Global SaaS Multi-Column Footer ───────────────────────── */}
      <Footer />

      {/* ── 10. Executive Architecture Consultation Modal ────────────── */}
      <AnimatePresence>
        {demoModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDemoModalOpen(false)}
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
                maxWidth: 500,
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                padding: "28px 26px",
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
                    {selectedPartnerTier === "agency-fleet"
                      ? "🤝 Agency White-Label Partnership"
                      : "⚡ Executive Architecture Demo"}
                  </span>
                </div>
                <button onClick={() => setDemoModalOpen(false)} style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer", color: "var(--hs-text-muted)" }}>✕</button>
              </div>

              {demoSuccess ? (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <div style={{ fontSize: "38px", marginBottom: 10 }}>🎉</div>
                  <h4 style={{ fontSize: "19px", fontWeight: 800, color: "var(--risk-healthy)" }}>Consultation Request Confirmed</h4>
                  <p style={{ fontSize: "13.5px", color: "var(--hs-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
                    Our engineering architect has received your details. We will reach out within 24 hours with an invitation link and tailored audit scope.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Full Name *</label>
                    <input required type="text" placeholder="Sarah Miller" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)", fontSize: "13px" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Work Email *</label>
                    <input required type="email" placeholder="sarah@agency.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)", fontSize: "13px" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Company / Agency Name *</label>
                    <input required type="text" placeholder="Apex Revenue Ops" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)", fontSize: "13px" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>Primary Objective *</label>
                    <select value={formData.goal} onChange={(e) => setFormData({ ...formData, goal: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)", fontSize: "13px", background: "#fff" }}>
                      <option value="Stop Deal Slippage & Ghosting">Stop Deal Slippage & Ghosting in Active Deals</option>
                      <option value="Agency White-Label Fleet">White-Label Fleet for Agency Client Portals</option>
                      <option value="Custom Self-Hosted Deployment">Custom Self-Hosted Enterprise Deployment</option>
                      <option value="Executive Deal War Room QBRs">Executive Deal War Room & Board QBRs</option>
                    </select>
                  </div>

                  <div style={{ padding: "8px 12px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
                    🔒 <strong>Executive Promise:</strong> Direct 1-on-1 architecture review with systems engineer. No aggressive sales pressure.
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "13px",
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
                    🚀 Schedule Executive Architecture Review
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
