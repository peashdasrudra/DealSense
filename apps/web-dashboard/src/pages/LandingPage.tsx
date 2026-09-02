/**
 * DealSense — Ultimate High-Converting HubSpot SaaS Landing Page.
 * Engineered for Irresistible FOMO, No-Brainer Pricing ($29 / $299 / $699),
 * and Direct Pathways into the Live App.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DealSenseIcon } from "../components/DealSenseLogo";
import { Footer } from "../components/Footer";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"audit-29" | "deploy-299" | "agency-699">("audit-29");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // ── Order Form State ───────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    portalId: "",
  });

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setOrderModalOpen(false);
    }, 3800);
  };

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

  const openOrder = (tier: "audit-29" | "deploy-299" | "agency-699") => {
    setSelectedTier(tier);
    setOrderModalOpen(true);
  };

  return (
    <div style={{ background: "#ffffff", color: "var(--hs-text)", fontFamily: "var(--font-sans)", overflowX: "hidden" }}>
      {/* ── 0. Top FOMO Urgency Bar ──────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(90deg, #124548 0%, #ff5c35 50%, #124548 100%)",
          color: "#ffffff",
          padding: "7px 16px",
          textAlign: "center",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.02em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>🔥 FOUNDER LAUNCH PRICING: 85% OFF DEAL RISK AUDITS ($29)</span>
        <span style={{ background: "rgba(0,0,0,0.25)", padding: "2px 8px", borderRadius: "var(--radius-pill)", fontSize: "11px" }}>
          ONLY 3 SLOTS REMAINING TODAY
        </span>
      </div>

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
          {/* Brand Logo -> Clicking routes to /pipeline (Home) */}
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
            <a href="#fomo-pricing" style={{ fontSize: "13.5px", fontWeight: 700, color: "#ff5c35", textDecoration: "none" }}>⚡ $29 Audit & Pricing</a>
            <span onClick={() => navigate("/case-study")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-text)", cursor: "pointer" }}>Architecture Case Study</span>
          </div>

          {/* CTA Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="desktop-cta-btn"
              onClick={() => openOrder("audit-29")}
              style={{
                padding: "8px 16px",
                background: "#ffffff",
                color: "#ff5c35",
                fontSize: "13px",
                fontWeight: 700,
                border: "1.5px solid #ff5c35",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s ease",
              }}
            >
              ⚡ Claim $29 Audit
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
            {/* Mobile Menu Toggle Button */}
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
                📊 Home — Live Pipeline Dashboard
              </div>
              <div onClick={() => { openOrder("audit-29"); setMobileMenuOpen(false); }} style={{ padding: "10px 12px", fontWeight: 700, color: "#ff5c35", borderRadius: "var(--radius-sm)", background: "rgba(255,92,53,0.08)", cursor: "pointer" }}>
                🔥 Claim $29 Risk Audit (85% Off)
              </div>
              <div onClick={() => { navigate("/forecast"); setMobileMenuOpen(false); }} style={{ padding: "10px 12px", fontWeight: 600, color: "var(--hs-text)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                📈 Revenue Forecast & Simulation
              </div>
              <div onClick={() => { navigate("/war-room"); setMobileMenuOpen(false); }} style={{ padding: "10px 12px", fontWeight: 600, color: "var(--hs-text)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                ⚔️ Deal War Room (QBR)
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
          padding: "clamp(44px, 6.5vw, 90px) clamp(16px, 4vw, 24px) clamp(36px, 5vw, 68px)",
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
          {/* Trust Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255, 92, 53, 0.08)", border: "1px solid rgba(255, 92, 53, 0.25)", padding: "5px 14px", borderRadius: "var(--radius-pill)", marginBottom: 18 }}
          >
            <DealSenseIcon size={16} />
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#ff5c35", letterSpacing: "0.03em" }}>
              NATIVE HUBSPOT REVENUE INTELLIGENCE ENGINE
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
            Stop letting $100K+ deals <br /> slip to <span style={{ color: "#ff5c35" }}>silent buyers</span>.
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
              margin: "0 auto 34px",
            }}
          >
            Why risk losing $150,000 in quarterly revenue to hidden pipeline slippage? DealSense plugs into your HubSpot in 2 minutes, scores every active deal 0–100 with zero hallucinations, and alerts reps before buyers go cold.
          </motion.p>

          {/* Dual Action CTAs with Unbeatable $29 FOMO Hook */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="landing-hero-btns"
          >
            <button
              onClick={() => openOrder("audit-29")}
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
              <span>🚀 Claim $29 Risk Audit (Save $100K+)</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigate("/pipeline")}
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
              ⚡ Explore Live App Demo
            </button>
          </motion.div>

          <div style={{ marginTop: 18, fontSize: "12px", color: "var(--hs-text-muted)", fontWeight: 500, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <span>🛡️ 100% "Find $25K Or It's Free" Guarantee</span>
            <span>•</span>
            <span>⚡ 24h Turnaround</span>
            <span>•</span>
            <span>🔒 No Credit Card To Test Live Demo</span>
          </div>
        </div>
      </section>

      {/* ── 3. Live HubSpot Deal Card Preview ─────────────────────────── */}
      <section style={{ padding: "0 clamp(16px, 4vw, 24px) 64px", maxWidth: 1000, margin: "-12px auto 0" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--hs-border-dark)",
            borderTop: "4px solid #ff5c35",
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.08)",
            padding: "clamp(20px, 4vw, 32px)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, paddingBottom: 16, borderBottom: "1px solid var(--hs-border-dark)", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ background: "rgba(5,150,105,0.1)", color: "var(--risk-healthy)", border: "1px solid rgba(5,150,105,0.25)", padding: "3px 9px", borderRadius: "var(--radius-pill)", fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase" }}>
                ● Webhook Synced (180ms)
              </span>
              <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>HubSpot Portal #48921820</span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)" }}>
              Interactive Deal Risk Diagnosis
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", fontWeight: 600 }}>Account: RetailMax Corp. · Rep: Sarah Miller</div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--hs-heading)", margin: "4px 0 10px" }}>
                Horizon Data Platform Modernization
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--hs-primary)", fontFamily: "var(--font-heading)" }}>
                  $180,000
                </span>
                <span style={{ background: "var(--risk-critical-bg)", color: "var(--danger)", border: "1px solid rgba(235,0,0,0.2)", padding: "3px 10px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 700 }}>
                  23/100 · Critical Risk
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--hs-text)", lineHeight: 1.5, margin: "0 0 14px" }}>
                <strong>Detected Risk:</strong> Economic Buyer (CFO) silent for 18 days with zero stage movement. Close date pushed 2x.
              </p>
              <div style={{ padding: "10px 14px", background: "rgba(255, 92, 53, 0.08)", border: "1px solid rgba(255, 92, 53, 0.25)", borderRadius: "var(--radius-sm)", fontSize: "12px", color: "var(--hs-heading)", fontWeight: 600 }}>
                ⚡ <strong>DealSense Action:</strong> Auto-triggered peer-to-peer executive alignment sequence to CFO.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "var(--hs-surface)", padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid var(--hs-border-dark)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 4 }}>
                Quick Platform Actions:
              </div>
              <button
                onClick={() => openOrder("audit-29")}
                style={{
                  padding: "11px 16px",
                  background: "#ff5c35",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(255,92,53,0.3)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Audit Your Pipeline for $29</span>
                <span>→</span>
              </button>
              <button
                onClick={() => navigate("/pipeline")}
                style={{
                  padding: "11px 16px",
                  background: "#ffffff",
                  color: "var(--hs-primary)",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "1px solid var(--hs-border-dark)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Explore Live Dossier in App</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 4. Logo Trust Bar ────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--hs-border-dark)", borderBottom: "1px solid var(--hs-border-dark)", padding: "20px 16px", background: "var(--hs-surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hs-text-muted)", marginBottom: 12 }}>
            TRUSTED BY REVENUE TEAMS SCALING MULTI-MILLION DOLLAR HUBSPOT PIPELINES
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px 36px", flexWrap: "wrap", opacity: 0.9 }}>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-primary)" }}>TechCorp Inc.</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-primary)" }}>FinanceGo Ltd.</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-primary)" }}>RetailMax</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-primary)" }}>HealthFirst Corp.</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-primary)" }}>LogiPro Solutions</span>
            <span style={{ fontSize: "12px", fontWeight: 700, background: "rgba(255, 92, 53, 0.1)", color: "#ff5c35", padding: "4px 10px", borderRadius: "var(--radius-pill)" }}>
              HubSpot Certified App
            </span>
          </div>
        </div>
      </section>

      {/* ── 5. Live Interactive Deal Risk Simulator ──────────────────── */}
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
              onClick={() => openOrder("audit-29")}
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
              Get This Scorecard For Your Pipeline ($29) →
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. Irresistible No-Brainer FOMO Pricing Section ───────────── */}
      <section id="fomo-pricing" style={{ padding: "clamp(48px, 6vw, 84px) clamp(16px, 4vw, 24px)", background: "var(--hs-surface)", borderTop: "1px solid var(--hs-border-dark)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
              🔥 INSANE FOUNDER LAUNCH DEALS
            </span>
            <h2 style={{ fontSize: "clamp(26px, 4.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--hs-heading)", margin: "8px 0 12px" }}>
              Pricing so low that passing on it is pure insanity.
            </h2>
            <p style={{ fontSize: "14.5px", color: "var(--hs-text-muted)", maxWidth: 660, margin: "0 auto", lineHeight: 1.55 }}>
              Catch a single $50,000+ slipping deal in your HubSpot portal for less than the cost of lunch. 100% money-back guarantee.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 24, alignItems: "stretch" }}>
            {/* Tier 1: $29 Audit */}
            <div style={{ background: "#ffffff", borderRadius: "var(--radius-lg)", padding: "32px 24px", border: "2px solid #ff5c35", boxShadow: "0 12px 32px rgba(255, 92, 53, 0.18)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
              <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#ff5c35", color: "#fff", padding: "4px 14px", borderRadius: "var(--radius-pill)", fontSize: "10.5px", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                🔥 85% OFF · 3 SLOTS LEFT TODAY
              </span>
              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#ff5c35", textTransform: "uppercase", marginBottom: 4 }}>
                  Instant Pipeline Risk Audit
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "8px 0 10px" }}>
                  <span style={{ fontSize: "38px", fontWeight: 800, color: "var(--hs-heading)", letterSpacing: "-0.03em" }}>$29</span>
                  <span style={{ fontSize: "15px", color: "var(--hs-text-muted)", textDecoration: "line-through" }}>$199</span>
                  <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>/ one-time</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", lineHeight: 1.5, marginBottom: 18 }}>
                  Complete 0–100 health scoring across 50 active HubSpot deals. Identifies silent CFOs, ghost deals, and delivers an executive PDF report in 24 hours.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24, borderTop: "1px solid var(--hs-border-dark)", paddingTop: 16 }}>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)" }}>✓ Full snapshot scoring on up to 50 deals</div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)" }}>✓ Silent economic buyer detection</div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)" }}>✓ Board-ready PDF briefing summary</div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--risk-healthy)" }}>
                    ✓ 100% "Find $25K Or It's Free" Guarantee
                  </div>
                </div>
              </div>
              <button
                onClick={() => openOrder("audit-29")}
                style={{ width: "100%", padding: "14px", background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)", color: "#fff", fontSize: "14.5px", fontWeight: 800, border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", boxShadow: "0 4px 14px rgba(255, 92, 53, 0.4)" }}
              >
                Claim $29 Audit Slot Now →
              </button>
            </div>

            {/* Tier 2: $299 Lifetime Deployment */}
            <div style={{ background: "#ffffff", borderRadius: "var(--radius-lg)", padding: "32px 24px", border: "1px solid var(--hs-border-dark)", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
              <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--hs-primary)", color: "#fff", padding: "4px 12px", borderRadius: "var(--radius-pill)", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                ⚡ LIFETIME FOUNDER LICENSE · 88% OFF
              </span>
              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
                  Full RevOps AI Deployment
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "8px 0 10px" }}>
                  <span style={{ fontSize: "38px", fontWeight: 800, color: "var(--hs-heading)", letterSpacing: "-0.03em" }}>$299</span>
                  <span style={{ fontSize: "15px", color: "var(--hs-text-muted)", textDecoration: "line-through" }}>$2,500</span>
                  <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>/ lifetime ownership</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", lineHeight: 1.5, marginBottom: 18 }}>
                  Complete production FastAPI + PostgreSQL + Redis stack deployed into your infrastructure. Real-time bi-directional HubSpot webhooks and zero monthly fees.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24, borderTop: "1px solid var(--hs-border-dark)", paddingTop: 16 }}>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)" }}>✓ Full self-hosted production stack</div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)" }}>✓ Sub-200ms bi-directional webhooks</div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)" }}>✓ Full source code & database ownership</div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)" }}>✓ 30 days dedicated engineering support</div>
                </div>
              </div>
              <button
                onClick={() => openOrder("deploy-299")}
                style={{ width: "100%", padding: "14px", background: "var(--hs-primary)", color: "#fff", fontSize: "14px", fontWeight: 700, border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
              >
                Deploy Full Stack ($299) →
              </button>
            </div>

            {/* Tier 3: $699 Agency Fleet */}
            <div style={{ background: "#ffffff", borderRadius: "var(--radius-lg)", padding: "32px 24px", border: "1px solid var(--hs-border-dark)", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
              <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#00a4bd", color: "#fff", padding: "4px 12px", borderRadius: "var(--radius-pill)", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                👑 UNLIMITED AGENCY FLEET · 86% OFF
              </span>
              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
                  White-Label Agency Fleet
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "8px 0 10px" }}>
                  <span style={{ fontSize: "38px", fontWeight: 800, color: "var(--hs-heading)", letterSpacing: "-0.03em" }}>$699</span>
                  <span style={{ fontSize: "15px", color: "var(--hs-text-muted)", textDecoration: "line-through" }}>$5,000</span>
                  <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>/ unlimited fleet</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", lineHeight: 1.5, marginBottom: 18 }}>
                  Deploy across all your agency client portals with custom branding, logo, and domain. Charge clients $500/mo and keep 100% recurring profit.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24, borderTop: "1px solid var(--hs-border-dark)", paddingTop: 16 }}>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)" }}>✓ Unlimited client portal fleet licenses</div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)" }}>✓ 100% white-label (your logo & domain)</div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)" }}>✓ Custom scoring weights per industry</div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)" }}>✓ Priority agency engineering Slack SLA</div>
                </div>
              </div>
              <button
                onClick={() => openOrder("agency-699")}
                style={{ width: "100%", padding: "14px", background: "var(--hs-primary)", color: "#fff", fontSize: "14px", fontWeight: 700, border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
              >
                Lock In Agency Fleet ($699) →
              </button>
            </div>
          </div>
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
            Ready to upgrade your revenue governance? Test the live interactive platform or lock in our $29 founder launch audit.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={() => openOrder("audit-29")}
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
              Claim $29 Audit Slot Now →
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
              Launch Live App Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── 8. Global SaaS Multi-Column Footer ───────────────────────── */}
      <Footer />

      {/* ── 9. Interactive Founding Rate Order Modal ─────────────────── */}
      <AnimatePresence>
        {orderModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderModalOpen(false)}
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
                    {selectedTier === "audit-29"
                      ? "🚀 Claim $29 Deal Risk Audit"
                      : selectedTier === "deploy-299"
                      ? "⚡ Deploy Full AI Stack ($299)"
                      : "👑 Lock In Agency Fleet ($699)"}
                  </span>
                </div>
                <button onClick={() => setOrderModalOpen(false)} style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer", color: "var(--hs-text-muted)" }}>✕</button>
              </div>

              {orderSuccess ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: "36px", marginBottom: 8 }}>🎉</div>
                  <h4 style={{ fontSize: "18px", fontWeight: 800, color: "var(--risk-healthy)" }}>Founder Slot Reserved!</h4>
                  <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", marginTop: 6 }}>
                    Our engineering team has received your portal details. You will receive an onboarding link and report within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                    🔒 <strong>100% Risk-Free:</strong> 100% money-back guarantee if we don't catch at least $25K in at-risk pipeline.
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
                    🚀 {selectedTier === "audit-29" ? "Lock In $29 Founder Audit" : selectedTier === "deploy-299" ? "Confirm $299 Lifetime Setup" : "Confirm $699 Agency Fleet"}
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
