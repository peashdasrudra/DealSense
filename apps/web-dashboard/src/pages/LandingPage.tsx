/**
 * DealSense — Absolute Premium Tier-1 Enterprise SaaS Landing Page.
 * Engineered for Executive Hook, Visual Superiority, and Maximum Conversion.
 * Unified Case Study Pricing: $99 (Pilot Audit), $1,500 (Full Deployment), $3,500 (Agency Fleet).
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
  const [selectedTier, setSelectedTier] = useState<"audit-99" | "deploy-1500" | "agency-3500">("audit-99");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // ── Hero Interactive Tab Showcase ──────────────────────────────────────────
  const [heroTab, setHeroTab] = useState<"scoring" | "forecast" | "warroom" | "hygiene">("scoring");

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
    if (s < 40) return { label: "Critical Risk", color: "#dc2626", bg: "rgba(220, 38, 38, 0.08)", border: "rgba(220, 38, 38, 0.25)" };
    if (s < 70) return { label: "High Risk", color: "#ea580c", bg: "rgba(234, 88, 12, 0.08)", border: "rgba(234, 88, 12, 0.25)" };
    if (s < 85) return { label: "Moderate Risk", color: "#0284c7", bg: "rgba(2, 132, 199, 0.08)", border: "rgba(2, 132, 199, 0.25)" };
    return { label: "Healthy & Closing", color: "#059669", bg: "rgba(5, 150, 105, 0.08)", border: "rgba(5, 150, 105, 0.25)" };
  };
  const band = getRiskBand(currentScore);

  // ── Slippage ROI Calculator State ──────────────────────────────────────────
  const [pipelineVal, setPipelineVal] = useState(1500000); // $1.5M default
  const estimatedSlippage = Math.round(pipelineVal * 0.18);
  const estimatedSaved = Math.round(estimatedSlippage * 0.75);

  // ── Order Modal Form State ─────────────────────────────────────────────────
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

  const openOrder = (tier: "audit-99" | "deploy-1500" | "agency-3500") => {
    setSelectedTier(tier);
    setOrderModalOpen(true);
  };

  const HUBS = [
    { icon: "🎯", title: "Deal Scoring Hub", desc: "0–100 deterministic risk scoring with transparent signal telemetry for every pipeline deal.", path: "/deals" },
    { icon: "📈", title: "Revenue Forecast Hub", desc: "Stage-weighted and Monte Carlo models giving RevOps leaders realistic quarter projections.", path: "/forecast" },
    { icon: "🌊", title: "Pipeline Waterfall Hub", desc: "Track pipeline velocity, newly created inflow, expansion, slippage, and lost momentum.", path: "/waterfall" },
    { icon: "⚔️", title: "Deal War Room Hub", desc: "Executive command matrix for Friday pipeline reviews and unblocking stalled opportunities.", path: "/war-room" },
    { icon: "⚡", title: "CRM Hygiene Hub", desc: "Automated writebacks and remediation for overdue close dates and single-threading.", path: "/hygiene" },
    { icon: "🤝", title: "Stakeholder Matrix Hub", desc: "Power matrix visualizing Economic Buyers, Champions, and single-threaded vulnerability.", path: "/stakeholders" },
  ];

  const AI_AGENTS = [
    { title: "Pipeline Triage Agent", role: "Autonomous Scrutiny", status: "Active 24/7", desc: "Monitors incoming webhooks. Detects when economic buyers go silent for 14+ days and flags critical slippage.", metric: "180ms latency" },
    { title: "Executive QBR Agent", role: "Board Synthesis", status: "Active 24/7", desc: "Synthesizes pipeline telemetry, stakeholder gaps, and MEDDICC evidence into board-ready executive briefings.", metric: "1-Click Export" },
    { title: "CRM Remediation Agent", role: "Autonomous Sync", status: "Active 24/7", desc: "Calculates updated close dates, assigns Slack rep tasks, and writes clean metadata directly back to HubSpot.", metric: "100% Audit Logged" },
  ];

  return (
    <div style={{ background: "#ffffff", color: "#0f172a", fontFamily: "var(--font-sans)", overflowX: "hidden" }}>
      {/* ── 0. Top Enterprise Telemetry Ticker ────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(90deg, #092124 0%, #124548 40%, #ff5c35 70%, #092124 100%)",
          color: "#ffffff",
          padding: "8px 16px",
          textAlign: "center",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.02em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 8px #34d399" }} />
          HUBSPOT-NATIVE REVENUE PLATFORM · SUB-200MS REAL-TIME INGESTION
        </span>
        <span style={{ background: "rgba(255,255,255,0.18)", padding: "2px 10px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 800 }}>
          $99 PILOT AUDIT AVAILABLE
        </span>
      </div>

      {/* ── 1. Top Glassmorphic Navigation Header ─────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
          zIndex: 1000,
          padding: "12px clamp(16px, 4vw, 32px)",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Brand Logo -> Clicking routes to /pipeline (Home) */}
          <div
            onClick={() => navigate("/pipeline")}
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            title="Launch Home Command Center"
          >
            <div style={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, rgba(255,92,53,0.12) 0%, rgba(18,69,72,0.08) 100%)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,92,53,0.25)", boxShadow: "0 2px 6px rgba(255,92,53,0.12)" }}>
              <DealSenseIcon size={22} />
            </div>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#092124", letterSpacing: "-0.035em" }}>
              Deal<span style={{ color: "#ff5c35" }}>Sense</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="desktop-nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <span onClick={() => navigate("/pipeline")} style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", cursor: "pointer" }}>Platform</span>
            <span onClick={() => navigate("/forecast")} style={{ fontSize: "14px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>Forecasting</span>
            <span onClick={() => navigate("/war-room")} style={{ fontSize: "14px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>War Room</span>
            <a href="#pricing-matrix" style={{ fontSize: "14px", fontWeight: 700, color: "#ff5c35", textDecoration: "none" }}>⚡ $99 Audit & Pricing</a>
            <span onClick={() => navigate("/case-study")} style={{ fontSize: "14px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>Architecture Case Study</span>
          </div>

          {/* CTA Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="desktop-cta-btn"
              onClick={() => openOrder("audit-99")}
              style={{
                padding: "8px 16px",
                background: "#ffffff",
                color: "#ff5c35",
                fontSize: "13px",
                fontWeight: 700,
                border: "1.5px solid #ff5c35",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(255, 92, 53, 0.15)",
                transition: "all 0.2s ease",
              }}
            >
              $99 Pilot Audit
            </button>
            <button
              onClick={() => navigate("/pipeline")}
              style={{
                padding: "9px 20px",
                background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)",
                color: "#ffffff",
                fontSize: "13.5px",
                fontWeight: 700,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(255, 92, 53, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
            >
              <span>Launch App</span>
              <span>→</span>
            </button>
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              style={{
                display: "none",
                padding: "7px 9px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              className="mobile-hamburger-btn"
              aria-label="Toggle Navigation Menu"
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#092124" strokeWidth={2}>
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
                borderTop: "1px solid #e2e8f0",
                marginTop: "12px",
                paddingTop: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div onClick={() => { navigate("/pipeline"); setMobileMenuOpen(false); }} style={{ padding: "10px 14px", fontWeight: 700, color: "#092124", borderRadius: "8px", background: "#f8fafc", cursor: "pointer" }}>
                📊 Platform Pipeline Dashboard
              </div>
              <div onClick={() => { openOrder("audit-99"); setMobileMenuOpen(false); }} style={{ padding: "10px 14px", fontWeight: 800, color: "#ff5c35", borderRadius: "8px", background: "rgba(255,92,53,0.08)", cursor: "pointer" }}>
                🔥 Start $99 Pilot Deal Risk Audit
              </div>
              <div onClick={() => { navigate("/forecast"); setMobileMenuOpen(false); }} style={{ padding: "10px 14px", fontWeight: 600, color: "#334155", borderRadius: "8px", cursor: "pointer" }}>
                📈 Revenue Forecast & Simulation
              </div>
              <div onClick={() => { navigate("/war-room"); setMobileMenuOpen(false); }} style={{ padding: "10px 14px", fontWeight: 600, color: "#334155", borderRadius: "8px", cursor: "pointer" }}>
                ⚔️ Deal War Room (QBR Decisions)
              </div>
              <div onClick={() => { navigate("/case-study"); setMobileMenuOpen(false); }} style={{ padding: "10px 14px", fontWeight: 600, color: "#334155", borderRadius: "8px", cursor: "pointer" }}>
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
          padding: "clamp(48px, 6vw, 84px) clamp(16px, 4vw, 24px) clamp(36px, 5vw, 68px)",
          background: "linear-gradient(180deg, #faf6f4 0%, #ffffff 100%)",
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
            width: "920px",
            height: "520px",
            background: "radial-gradient(ellipse at center, rgba(255, 92, 53, 0.14) 0%, rgba(18, 69, 72, 0.06) 45%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 940, margin: "0 auto", position: "relative" }}>
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255, 92, 53, 0.08)",
              border: "1px solid rgba(255, 92, 53, 0.25)",
              padding: "6px 16px",
              borderRadius: "var(--radius-pill)",
              marginBottom: 18,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5c35", display: "inline-block", boxShadow: "0 0 8px #ff5c35" }} />
            <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#ff5c35", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              NATIVE HUBSPOT REVENUE INTELLIGENCE
            </span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(32px, 6.2vw, 62px)",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.04em",
              color: "#092124",
              margin: "0 0 18px",
            }}
          >
            Where go-to-market <br /> teams go to <span style={{ background: "linear-gradient(135deg, #ff5c35 0%, #e04a25 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>scale</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "clamp(15px, 2.2vw, 18.5px)",
              color: "#475569",
              lineHeight: 1.6,
              maxWidth: 740,
              margin: "0 auto 34px",
            }}
          >
            Stop losing $100K+ deals to silent buyers and hidden CRM slippage. DealSense plugs into your HubSpot portal in 2 minutes, evaluates deal risk across 7 deterministic signals in 180ms, and equips sales leadership with executive board clarity.
          </motion.p>

          {/* Dual Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="landing-hero-btns"
          >
            <button
              onClick={() => openOrder("audit-99")}
              style={{
                padding: "15px 34px",
                background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 800,
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1), 0 8px 24px rgba(255, 92, 53, 0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
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
                padding: "15px 30px",
                background: "#ffffff",
                color: "#092124",
                fontSize: "15px",
                fontWeight: 700,
                border: "1.5px solid #cbd5e1",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
              }}
            >
              ⚡ Explore Live App Demo
            </button>
          </motion.div>

          <div style={{ marginTop: 20, fontSize: "12.5px", color: "#64748b", fontWeight: 500, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <span>🛡️ 100% Money-Back Guarantee</span>
            <span>•</span>
            <span>⚡ 24h Turnaround</span>
            <span>•</span>
            <span>🔒 AES-256 GCM Encrypted</span>
          </div>
        </div>
      </section>

      {/* ── 3. Interactive Hero Command Deck ─────────────────────────── */}
      <section style={{ padding: "0 clamp(16px, 4vw, 24px) 56px", maxWidth: 1080, margin: "-16px auto 0", position: "relative", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            borderTop: "4px solid #ff5c35",
            boxShadow: "0 20px 48px -12px rgba(9, 33, 36, 0.12), 0 4px 16px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          {/* App Mock Header */}
          <div style={{ background: "#f8fafc", padding: "12px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
              </div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#092124" }}>DealSense RevOps Command Deck</span>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setHeroTab("scoring")} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: 700, borderRadius: "6px", border: "none", cursor: "pointer", background: heroTab === "scoring" ? "#092124" : "transparent", color: heroTab === "scoring" ? "#fff" : "#64748b" }}>
                Deal Inspector
              </button>
              <button onClick={() => setHeroTab("forecast")} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: 700, borderRadius: "6px", border: "none", cursor: "pointer", background: heroTab === "forecast" ? "#092124" : "transparent", color: heroTab === "forecast" ? "#fff" : "#64748b" }}>
                Monte Carlo
              </button>
              <button onClick={() => setHeroTab("warroom")} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: 700, borderRadius: "6px", border: "none", cursor: "pointer", background: heroTab === "warroom" ? "#092124" : "transparent", color: heroTab === "warroom" ? "#fff" : "#64748b" }}>
                Deal War Room
              </button>
            </div>
          </div>

          {/* Dynamic Content Display */}
          <div style={{ padding: "clamp(20px, 4vw, 32px)" }}>
            {heroTab === "scoring" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ background: "rgba(220, 38, 38, 0.1)", color: "#dc2626", padding: "3px 10px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 800 }}>
                      23/100 · Critical Slippage Risk
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>HubSpot Deal #48921820</span>
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#092124", margin: "0 0 6px" }}>
                    Horizon Data Modernization · $180,000
                  </h3>
                  <div style={{ fontSize: "13px", color: "#475569", marginBottom: 14 }}>
                    <strong>Account:</strong> RetailMax Corp. · <strong>Rep:</strong> Sarah Miller · <strong>Stage:</strong> Proposal & Review
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12.5px", color: "#dc2626", fontWeight: 600 }}>
                      <span>⚠️</span> <span>Economic Buyer (CFO) silent for 18 days (-34pts)</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12.5px", color: "#ea580c", fontWeight: 600 }}>
                      <span>⚠️</span> <span>Single-threaded through VP Eng only (-22pts)</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12.5px", color: "#ea580c", fontWeight: 600 }}>
                      <span>⚠️</span> <span>Close date pushed 2x this quarter (-18pts)</span>
                    </div>
                  </div>
                  <div style={{ padding: "10px 14px", background: "rgba(255, 92, 53, 0.08)", border: "1px solid rgba(255, 92, 53, 0.25)", borderRadius: "8px", fontSize: "12.5px", color: "#092124", fontWeight: 600 }}>
                    ⚡ <strong>Automated Action:</strong> Triggered executive peer-to-peer sequence to CFO with Forrester ROI benchmark.
                  </div>
                </div>

                <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#092124", textTransform: "uppercase" }}>
                    Instant Executive Actions
                  </div>
                  <button onClick={() => navigate("/deals")} style={{ width: "100%", padding: "12px", background: "#ff5c35", color: "#fff", fontSize: "13.5px", fontWeight: 700, border: "none", borderRadius: "8px", cursor: "pointer", boxShadow: "0 2px 8px rgba(255,92,53,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Inspect Full Dossier in App</span>
                    <span>→</span>
                  </button>
                  <button onClick={() => openOrder("audit-99")} style={{ width: "100%", padding: "12px", background: "#ffffff", color: "#092124", fontSize: "13.5px", fontWeight: 700, border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Audit Your Portal for $99</span>
                    <span>↗</span>
                  </button>
                </div>
              </div>
            )}

            {heroTab === "forecast" && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#00a4bd", textTransform: "uppercase", marginBottom: 6 }}>Monte Carlo Revenue Simulation</div>
                <h4 style={{ fontSize: "20px", fontWeight: 800, color: "#092124", marginBottom: 10 }}>Rep Commit: $1.4M vs. AI Realistic: $940K</h4>
                <p style={{ fontSize: "13.5px", color: "#64748b", maxWidth: 580, margin: "0 auto 18px" }}>
                  Uncovers $460,000 in manager padding and hidden deal slippage across 10,000 statistical Monte Carlo distribution runs.
                </p>
                <button onClick={() => navigate("/forecast")} style={{ padding: "10px 22px", background: "#092124", color: "#fff", borderRadius: "8px", fontWeight: 700, fontSize: "13px", border: "none", cursor: "pointer" }}>
                  Explore Forecast Simulator →
                </button>
              </div>
            )}

            {heroTab === "warroom" && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#ff5c35", textTransform: "uppercase", marginBottom: 6 }}>Executive QBR Decision Matrix</div>
                <h4 style={{ fontSize: "20px", fontWeight: 800, color: "#092124", marginBottom: 10 }}>5 Enterprise Deals Requiring Immediate CFO Intervention</h4>
                <p style={{ fontSize: "13.5px", color: "#64748b", maxWidth: 580, margin: "0 auto 18px" }}>
                  Pre-configured board briefing deck, DocuSign velocity tracking, and peer-to-peer executive outreach sequencing.
                </p>
                <button onClick={() => navigate("/war-room")} style={{ padding: "10px 22px", background: "#ff5c35", color: "#fff", borderRadius: "8px", fontWeight: 700, fontSize: "13px", border: "none", cursor: "pointer" }}>
                  Open Deal War Room →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── 4. Logo Trust Bar ────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "20px 16px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b", marginBottom: 12 }}>
            TRUSTED BY REVENUE & REVOPS LEADERS SCALING MULTI-MILLION DOLLAR HUBSPOT PIPELINES
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px 40px", flexWrap: "wrap", opacity: 0.9 }}>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "#092124" }}>TechCorp Inc.</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "#092124" }}>FinanceGo Ltd.</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "#092124" }}>RetailMax</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "#092124" }}>HealthFirst Corp.</span>
            <span style={{ fontSize: "14px", fontWeight: 800, color: "#092124" }}>LogiPro Solutions</span>
            <span style={{ fontSize: "12px", fontWeight: 700, background: "rgba(255, 92, 53, 0.1)", color: "#ff5c35", padding: "4px 12px", borderRadius: "var(--radius-pill)" }}>
              HubSpot App Partner
            </span>
          </div>
        </div>
      </section>

      {/* ── 5. Product Hubs Bento Grid ───────────────────────────────── */}
      <section style={{ padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 24px)", background: "#ffffff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="landing-hubs-layout">
            <div>
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
                ALL-IN-ONE REVOPS ENGINE
              </span>
              <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#092124", margin: "8px 0 14px" }}>
                Growing a pipeline is hard. DealSense makes it automatic.
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>
                Everything your revenue team needs to inspect stalled opportunities, run executive war rooms, and eliminate pipeline leakage in one unified HubSpot-native suite.
              </p>
              <button
                onClick={() => navigate("/pipeline")}
                style={{
                  padding: "12px 24px",
                  background: "#092124",
                  color: "#fff",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Explore Live Platform →
              </button>
            </div>

            <div className="landing-hubs-grid">
              {HUBS.map((hub, i) => (
                <div
                  key={i}
                  onClick={() => navigate(hub.path)}
                  style={{
                    background: "#ffffff",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: 8 }}>{hub.icon}</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#092124", marginBottom: 4 }}>
                    {hub.title}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#64748b", lineHeight: 1.5, marginBottom: 10 }}>
                    {hub.desc}
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#ff5c35" }}>
                    Explore Hub →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Coral Glow: Built-in AI Autonomous Agents ─────────────── */}
      <section
        style={{
          padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 24px)",
          background: "linear-gradient(135deg, #fff1eb 0%, #fde2e4 50%, #fff1eb 100%)",
          borderTop: "1px solid #ffd5cc",
          borderBottom: "1px solid #ffd5cc",
        }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
              AUTONOMOUS REVENUE AGENTS
            </span>
            <h2 style={{ fontSize: "clamp(24px, 4.5vw, 38px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#092124", margin: "8px 0 10px" }}>
              Built-in AI agents working for your pipeline 24/7.
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", maxWidth: 620, margin: "0 auto", lineHeight: 1.55 }}>
              Autonomous RevOps agents that evaluate deal risk, draft executive QBR briefs, and trigger corrective workflows without human intervention.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {AI_AGENTS.map((agent, i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  borderRadius: "14px",
                  padding: "24px 20px",
                  border: "1px solid rgba(255, 92, 53, 0.2)",
                  boxShadow: "0 8px 24px rgba(255, 92, 53, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#ff5c35", background: "rgba(255, 92, 53, 0.1)", padding: "3px 9px", borderRadius: "var(--radius-pill)" }}>
                      {agent.role}
                    </span>
                    <span style={{ fontSize: "11px", color: "#059669", fontWeight: 700 }}>● {agent.status}</span>
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#092124", margin: "0 0 6px" }}>
                    {agent.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.55, margin: 0 }}>
                    {agent.desc}
                  </p>
                </div>
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 14, marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#334155" }}>
                  <span style={{ fontWeight: 600 }}>Performance:</span>
                  <span style={{ fontWeight: 800, color: "#ff5c35" }}>{agent.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Live Interactive Deal Risk Simulator ──────────────────── */}
      <section style={{ padding: "clamp(56px, 7vw, 90px) clamp(16px, 4vw, 24px)", maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
            LIVE DETERMINISTIC RISK SIMULATOR
          </span>
          <h2 style={{ fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.035em", color: "#092124", margin: "8px 0 12px" }}>
            See how DealSense scores deal risk in real-time.
          </h2>
          <p style={{ fontSize: "14.5px", color: "#64748b", maxWidth: 660, margin: "0 auto", lineHeight: 1.6 }}>
            Toggle active deal telemetry signals below. Watch our explainable mathematical engine recalculate health and trigger automated executive interventions in real-time.
          </p>
        </div>

        <div
          className="card landing-feature-grid"
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "clamp(24px, 4vw, 36px)",
            border: "1px solid #e2e8f0",
            borderTop: `4px solid ${band.color}`,
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease",
          }}
        >
          {/* Signal Controls */}
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#475569", marginBottom: 14 }}>
              1. Toggle Deal Telemetry Signals:
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: simBuyerSilent ? "rgba(220, 38, 38, 0.05)" : "#f8fafc", borderRadius: "8px", border: `1px solid ${simBuyerSilent ? "rgba(220, 38, 38, 0.25)" : "#e2e8f0"}`, cursor: "pointer", transition: "all 0.2s ease" }}>
                <input type="checkbox" checked={simBuyerSilent} onChange={(e) => setSimBuyerSilent(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#ff5c35" }} />
                <div style={{ fontSize: "13.5px" }}>
                  <strong>Economic Buyer Silent:</strong> 14+ days without reply (-34pts)
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: simSingleThread ? "rgba(234, 88, 12, 0.05)" : "#f8fafc", borderRadius: "8px", border: `1px solid ${simSingleThread ? "rgba(234, 88, 12, 0.25)" : "#e2e8f0"}`, cursor: "pointer", transition: "all 0.2s ease" }}>
                <input type="checkbox" checked={simSingleThread} onChange={(e) => setSimSingleThread(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#ff5c35" }} />
                <div style={{ fontSize: "13.5px" }}>
                  <strong>Single-Threaded Deal:</strong> Only 1 contact associated (-22pts)
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: simDatePushed ? "rgba(234, 88, 12, 0.05)" : "#f8fafc", borderRadius: "8px", border: `1px solid ${simDatePushed ? "rgba(234, 88, 12, 0.25)" : "#e2e8f0"}`, cursor: "pointer", transition: "all 0.2s ease" }}>
                <input type="checkbox" checked={simDatePushed} onChange={(e) => setSimDatePushed(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#ff5c35" }} />
                <div style={{ fontSize: "13.5px" }}>
                  <strong>Close Date Slippage:</strong> Pushed 2+ times in HubSpot (-18pts)
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: simStaleActivity ? "rgba(234, 88, 12, 0.05)" : "#f8fafc", borderRadius: "8px", border: `1px solid ${simStaleActivity ? "rgba(234, 88, 12, 0.25)" : "#e2e8f0"}`, cursor: "pointer", transition: "all 0.2s ease" }}>
                <input type="checkbox" checked={simStaleActivity} onChange={(e) => setSimStaleActivity(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#ff5c35" }} />
                <div style={{ fontSize: "13.5px" }}>
                  <strong>Stage Stall:</strong> In stage 2.4x company historical avg (-16pts)
                </div>
              </label>
            </div>
          </div>

          {/* Instant Score Output Box */}
          <div
            style={{
              background: "#f8fafc",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#092124", textTransform: "uppercase" }}>Deal Health Score Output</span>
              <span style={{ fontSize: "11.5px", color: "#059669", fontWeight: 700 }}>● 180ms Ingestion Latency</span>
            </div>

            <div style={{ background: "#ffffff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: 4 }}>Orion Cloud Modernization · $180,000</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "30px", fontWeight: 800, color: band.color, fontFamily: "var(--font-heading)" }}>
                  {currentScore}/100
                </div>
                <span style={{ fontSize: "12px", background: band.bg, color: band.color, border: `1px solid ${band.border}`, padding: "4px 12px", borderRadius: "var(--radius-pill)", fontWeight: 800 }}>
                  {band.label}
                </span>
              </div>
              <div style={{ fontSize: "13px", color: "#334155", marginTop: 10, lineHeight: 1.5 }}>
                {currentScore < 50
                  ? "⚠️ Critical slippage risk: Economic Buyer disengaged. High probability of slipping into next quarter."
                  : currentScore < 75
                  ? "⚡ Moderate risk: Single-threaded bottleneck detected. Recommend peer-to-peer executive alignment."
                  : "✓ Strong pipeline momentum. High confidence to close within quarter."}
              </div>
            </div>

            <button
              onClick={() => openOrder("audit-99")}
              style={{
                width: "100%",
                padding: "13px",
                background: "#ff5c35",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 800,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(255,92,53,0.3)",
              }}
            >
              Get This Scorecard For Your Pipeline ($99) →
            </button>
          </div>
        </div>
      </section>

      {/* ── 8. Slippage ROI Calculator ───────────────────────────────── */}
      <section style={{ padding: "0 clamp(16px, 4vw, 24px) 64px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ background: "#f8fafc", padding: "clamp(24px, 4vw, 36px)", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.03)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
              INTERACTIVE REVENUE SLIPPAGE CALCULATOR
            </span>
            <h3 style={{ fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 800, color: "#092124", margin: "6px 0 8px" }}>
              How much pipeline is currently at risk in your HubSpot?
            </h3>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#092124" }}>Active HubSpot Pipeline:</span>
              <span style={{ fontSize: "22px", fontWeight: 800, color: "#092124", fontFamily: "var(--font-heading)" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: 6 }}>
              <span>$200K</span>
              <span>$2.5M</span>
              <span>$5M+</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
            <div style={{ background: "#ffffff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Estimated Slippage Risk</div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#dc2626", marginTop: 4 }}>
                ${(estimatedSlippage / 1000).toLocaleString()}K
              </div>
            </div>

            <div style={{ background: "rgba(5,150,105,0.06)", padding: "18px", borderRadius: "10px", border: "1px solid rgba(5,150,105,0.2)" }}>
              <div style={{ fontSize: "12px", color: "#059669", fontWeight: 600 }}>Revenue Saved by DealSense</div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#059669", marginTop: 4 }}>
                ${(estimatedSaved / 1000).toLocaleString()}K
              </div>
            </div>
          </div>

          <button
            onClick={() => openOrder("audit-99")}
            style={{
              width: "100%",
              padding: "14px",
              background: "#ff5c35",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 800,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(255,92,53,0.35)",
            }}
          >
            Run $99 Audit & Recover Stalled Pipeline →
          </button>
        </div>
      </section>

      {/* ── 9. Authoritative 3-Tier Pricing Section ───────────────────── */}
      <section id="pricing-matrix" style={{ padding: "clamp(56px, 7vw, 96px) clamp(16px, 4vw, 24px)", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
              TRANSPARENT VALUE-BASED PACKAGES
            </span>
            <h2 style={{ fontSize: "clamp(26px, 4.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.035em", color: "#092124", margin: "8px 0 12px" }}>
              Start with a $99 Pilot. Scale to Full Deployment.
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b", maxWidth: 660, margin: "0 auto", lineHeight: 1.55 }}>
              No recurring hidden subscriptions. Full database ownership and guaranteed revenue ROI.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 24, alignItems: "stretch" }}>
            {/* Tier 1: $99 */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "34px 26px", border: "2px solid #ff5c35", boxShadow: "0 16px 36px rgba(255, 92, 53, 0.18)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
              <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#ff5c35", color: "#fff", padding: "4px 14px", borderRadius: "var(--radius-pill)", fontSize: "10.5px", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                MOST POPULAR FOR NEW CLIENTS
              </span>
              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#ff5c35", textTransform: "uppercase", marginBottom: 4 }}>
                  Pilot Deal Risk Audit
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "8px 0 10px" }}>
                  <span style={{ fontSize: "40px", fontWeight: 800, color: "#092124", letterSpacing: "-0.03em" }}>$99</span>
                  <span style={{ fontSize: "16px", color: "#94a3b8", textDecoration: "line-through" }}>$5,000</span>
                  <span style={{ fontSize: "12.5px", color: "#64748b" }}>/ one-time</span>
                </div>
                <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.5, marginBottom: 18 }}>
                  Complete 0–100 health scoring across 50 active HubSpot deals. Catches hidden slippage and delivers an executive PDF report.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ Full snapshot scoring on up to 50 deals</div>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ Silent economic buyer detection</div>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ Board-ready PDF briefing summary</div>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ 24–48h guaranteed turnaround</div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#059669" }}>
                    ✓ 100% Money-Back Guarantee
                  </div>
                </div>
              </div>
              <button
                onClick={() => openOrder("audit-99")}
                style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)", color: "#fff", fontSize: "14.5px", fontWeight: 800, border: "none", borderRadius: "8px", cursor: "pointer", boxShadow: "0 4px 14px rgba(255, 92, 53, 0.4)" }}
              >
                Start $99 Risk-Free Audit →
              </button>
            </div>

            {/* Tier 2: $1,500 */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "34px 26px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
                  Full RevOps Deployment
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "8px 0 10px" }}>
                  <span style={{ fontSize: "40px", fontWeight: 800, color: "#092124", letterSpacing: "-0.03em" }}>$1,500</span>
                  <span style={{ fontSize: "16px", color: "#94a3b8", textDecoration: "line-through" }}>$3,500</span>
                  <span style={{ fontSize: "12.5px", color: "#64748b" }}>/ one-time setup</span>
                </div>
                <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.5, marginBottom: 18 }}>
                  Complete self-hosted FastAPI + PostgreSQL + Redis deployment with real-time bi-directional HubSpot webhooks and all 15 modules.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ Full production stack deployment</div>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ Sub-200ms bi-directional webhooks</div>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ All 15 RevOps intelligence modules</div>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ Full source code & database ownership</div>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ 30 days dedicated engineering support</div>
                </div>
              </div>
              <button
                onClick={() => openOrder("deploy-1500")}
                style={{ width: "100%", padding: "14px", background: "#092124", color: "#fff", fontSize: "14px", fontWeight: 800, border: "none", borderRadius: "8px", cursor: "pointer" }}
              >
                Deploy Full Stack ($1,500) →
              </button>
            </div>

            {/* Tier 3: $3,500 */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "34px 26px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
                  Agency White-Label Fleet
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "8px 0 10px" }}>
                  <span style={{ fontSize: "40px", fontWeight: 800, color: "#092124", letterSpacing: "-0.03em" }}>$3,500</span>
                  <span style={{ fontSize: "16px", color: "#94a3b8", textDecoration: "line-through" }}>$9,000</span>
                  <span style={{ fontSize: "12.5px", color: "#64748b" }}>/ multi-portal</span>
                </div>
                <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.5, marginBottom: 18 }}>
                  Deploy across all your agency client portals with custom branding, logo, and domain. Charge clients $500/mo and keep 100% recurring profit.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ Multi-tenant client fleet dashboard</div>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ 100% white-label (your logo & domain)</div>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ Custom scoring weights per industry</div>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ Unlimited client HubSpot portals</div>
                  <div style={{ fontSize: "13px", color: "#334155" }}>✓ Priority agency engineering Slack SLA</div>
                </div>
              </div>
              <button
                onClick={() => openOrder("agency-3500")}
                style={{ width: "100%", padding: "14px", background: "#092124", color: "#fff", fontSize: "14px", fontWeight: 800, border: "none", borderRadius: "8px", cursor: "pointer" }}
              >
                Order Agency Fleet ($3,500) →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Final High-Impact CTA Banner ─────────────────────────── */}
      <section style={{ padding: "clamp(48px, 6vw, 84px) clamp(16px, 4vw, 24px)", background: "#f8fafc" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #092124 0%, #124548 100%)",
            padding: "clamp(36px, 5vw, 64px) clamp(20px, 4vw, 48px)",
            textAlign: "center",
            color: "#ffffff",
            boxShadow: "0 20px 48px rgba(9, 33, 36, 0.28)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 92, 53, 0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            Make impossible pipeline growth feel impossibly easy.
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255, 255, 255, 0.88)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Ready to upgrade your revenue governance? Test the live interactive platform or start with our $99 pilot risk audit.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={() => openOrder("audit-99")}
              style={{
                padding: "14px 32px",
                background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 800,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(255, 92, 53, 0.45)",
              }}
            >
              Start $99 Risk-Free Audit →
            </button>
            <button
              onClick={() => navigate("/pipeline")}
              style={{
                padding: "14px 26px",
                background: "#ffffff",
                color: "#092124",
                fontSize: "14.5px",
                fontWeight: 700,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Launch Live App Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── 11. Global SaaS Multi-Column Footer ──────────────────────── */}
      <Footer />

      {/* ── 12. Interactive Founding Rate Order Modal ────────────────── */}
      <AnimatePresence>
        {orderModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderModalOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(9, 33, 36, 0.65)", backdropFilter: "blur(6px)", zIndex: 2000 }}
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
                width: "92%",
                maxWidth: 480,
                background: "#ffffff",
                borderRadius: "16px",
                padding: "28px 24px",
                boxShadow: "0 24px 60px rgba(0, 0, 0, 0.25)",
                zIndex: 2001,
                border: "1px solid #e2e8f0",
                borderTop: "4px solid #ff5c35",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <DealSenseIcon size={24} />
                  <span style={{ fontSize: "16.5px", fontWeight: 800, color: "#092124" }}>
                    {selectedTier === "audit-99"
                      ? "🚀 Start $99 Deal Risk Audit"
                      : selectedTier === "deploy-1500"
                      ? "⚡ Deploy Full RevOps Stack ($1,500)"
                      : "👑 Order Agency Fleet ($3,500)"}
                  </span>
                </div>
                <button onClick={() => setOrderModalOpen(false)} style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}>✕</button>
              </div>

              {orderSuccess ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: "40px", marginBottom: 8 }}>🎉</div>
                  <h4 style={{ fontSize: "19px", fontWeight: 800, color: "#059669" }}>Order Request Received!</h4>
                  <p style={{ fontSize: "13.5px", color: "#64748b", marginTop: 6, lineHeight: 1.55 }}>
                    Our engineering team has received your details. You will receive an onboarding link and report within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#092124", marginBottom: 4 }}>Full Name *</label>
                    <input required type="text" placeholder="Sarah Miller" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13.5px" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#092124", marginBottom: 4 }}>Work Email *</label>
                    <input required type="email" placeholder="sarah@agency.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13.5px" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#092124", marginBottom: 4 }}>Company / Agency *</label>
                    <input required type="text" placeholder="Apex Revenue Ops" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13.5px" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#092124", marginBottom: 4 }}>HubSpot Portal ID (Optional)</label>
                    <input type="text" placeholder="e.g. #48921820" value={formData.portalId} onChange={(e) => setFormData({ ...formData, portalId: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13.5px" }} />
                  </div>

                  <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11.5px", color: "#64748b", lineHeight: 1.45 }}>
                    🔒 <strong>100% Risk-Free:</strong> 100% money-back guarantee if we don't catch at least $25K in at-risk pipeline.
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "13px",
                      background: "#ff5c35",
                      color: "#fff",
                      fontSize: "14.5px",
                      fontWeight: 800,
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(255, 92, 53, 0.4)",
                      marginTop: 4,
                    }}
                  >
                    🚀 {selectedTier === "audit-99" ? "Confirm & Start $99 Audit" : selectedTier === "deploy-1500" ? "Confirm $1,500 Deployment Order" : "Confirm $3,500 Agency Fleet"}
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
