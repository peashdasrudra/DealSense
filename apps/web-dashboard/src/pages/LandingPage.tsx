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
import { HowItWorksVideoSection } from "../components/HowItWorksVideoSection";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedTier] = useState<"audit-99" | "deploy-1500" | "agency-3500">("audit-99");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

  const openOrder = (tier: "audit-99" | "deploy-1500" | "agency-3500" | "custom-app") => {
    navigate(`/checkout?tier=${tier}`);
  };

  const HUBS = [
    { iconSvg: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", iconColor: "#ff5c35", iconBg: "rgba(255, 92, 53, 0.08)", title: "Deal Scoring Hub", desc: "0–100 deterministic risk scoring with transparent signal telemetry for every pipeline deal.", path: "/deals" },
    { iconSvg: "M22 12h-4l-3 9L9 3l-3 9H2", iconColor: "#0284c7", iconBg: "rgba(2, 132, 199, 0.08)", title: "Revenue Forecast Hub", desc: "Stage-weighted and Monte Carlo models giving RevOps leaders realistic quarter projections.", path: "/forecast" },
    { iconSvg: "M3 3v18h18", iconColor: "#7c3aed", iconBg: "rgba(124, 58, 237, 0.08)", title: "Pipeline Waterfall Hub", desc: "Track pipeline velocity, newly created inflow, expansion, slippage, and lost momentum.", path: "/waterfall" },
    { iconSvg: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", iconColor: "#dc2626", iconBg: "rgba(220, 38, 38, 0.08)", title: "Deal War Room Hub", desc: "Executive command matrix for Friday pipeline reviews and unblocking stalled opportunities.", path: "/war-room" },
    { iconSvg: "M22 11.08V12a10 10 0 11-5.93-9.14", iconColor: "#059669", iconBg: "rgba(5, 150, 105, 0.08)", title: "CRM Hygiene Hub", desc: "Automated writebacks and remediation for overdue close dates and single-threading.", path: "/hygiene" },
    { iconSvg: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", iconColor: "#d97706", iconBg: "rgba(217, 119, 6, 0.08)", title: "Stakeholder Matrix Hub", desc: "Power matrix visualizing Economic Buyers, Champions, and single-threaded vulnerability.", path: "/stakeholders" },
  ];

  const AI_AGENTS = [
    { title: "Pipeline Triage Agent", role: "Autonomous Scrutiny", status: "Active 24/7", desc: "Monitors incoming webhooks. Detects when economic buyers go silent for 14+ days and flags critical slippage.", metric: "180ms latency" },
    { title: "Executive QBR Agent", role: "Board Synthesis", status: "Active 24/7", desc: "Synthesizes pipeline telemetry, stakeholder gaps, and MEDDICC evidence into board-ready executive briefings.", metric: "1-Click Export" },
    { title: "CRM Remediation Agent", role: "Autonomous Sync", status: "Active 24/7", desc: "Calculates updated close dates, assigns Slack rep tasks, and writes clean metadata directly back to HubSpot.", metric: "100% Audit Logged" },
  ];

  return (
    <div style={{ background: "#ffffff", color: "#0f172a", fontFamily: "var(--font-sans)", overflowX: "hidden" }}>
      {/* ── 0. Top Enterprise Founder Discount & Telemetry Ticker ──────────────── */}
      <div className="top-telemetry-banner">
        {/* Desktop PC Layout: Single Clean Centered Horizontal Line */}
        <div className="banner-desktop">
          {/* Live Status Beacon */}
          <div className="telemetry-beacon-container" title="Live Webhook Streaming">
            <span className="telemetry-beacon-ring" />
            <span className="telemetry-beacon-dot" />
          </div>

          {/* HubSpot Native Platform Label */}
          <span style={{ letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "11px", fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>
            HubSpot Native Platform
          </span>

          {/* Vertical Divider */}
          <span className="telemetry-divider" />

          {/* Founder Discount Pill */}
          <a
            href="#pricing-matrix"
            style={{
              textDecoration: "none",
              fontSize: "10.5px",
              fontWeight: 800,
              color: "#ff8c6b",
              background: "rgba(255, 92, 53, 0.18)",
              border: "1px solid rgba(255, 92, 53, 0.4)",
              padding: "2px 8px",
              borderRadius: "9999px",
              letterSpacing: "0.03em",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>🔥</span>
            <span>FOUNDER DISCOUNT: UP TO 98% OFF</span>
          </a>

          {/* Vertical Divider */}
          <span className="telemetry-divider" />

          {/* Telemetry Metric Chip */}
          <div className="telemetry-cta-pill" title="0.2s Real-Time Webhook Processing">
            <span style={{ color: "#38bdf8", fontSize: "10px" }}>⚡</span>
            <span>0.2s sync · Unlimited rep seats</span>
          </div>
        </div>

        {/* Mobile Layout: Top Row Side-by-Side (HubSpot Native + 0.2s sync), Bottom Row Centered Founder Discount */}
        <div className="banner-mobile">
          {/* Top Row: HubSpot Native Platform + 0.2s sync Side-by-Side */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, flexWrap: "nowrap" }}>
            <div className="telemetry-beacon-container" title="Live Webhook Streaming">
              <span className="telemetry-beacon-ring" />
              <span className="telemetry-beacon-dot" />
            </div>

            <span style={{ letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "10.5px", fontWeight: 800, color: "#f1f5f9", lineHeight: 1, whiteSpace: "nowrap" }}>
              HubSpot Native Platform
            </span>

            <span className="telemetry-divider" />

            <div className="telemetry-cta-pill" title="0.2s Real-Time Webhook Processing" style={{ padding: "2px 7px" }}>
              <span style={{ color: "#38bdf8", fontSize: "9.5px" }}>⚡</span>
              <span style={{ fontSize: "10px" }}>0.2s sync · Unlimited rep seats</span>
            </div>
          </div>

          {/* Bottom Row: Founder Discount Centered in Middle Below Them */}
          <a
            href="#pricing-matrix"
            style={{
              textDecoration: "none",
              fontSize: "10px",
              fontWeight: 800,
              color: "#ff8c6b",
              background: "rgba(255, 92, 53, 0.18)",
              border: "1px solid rgba(255, 92, 53, 0.4)",
              padding: "2px 10px",
              borderRadius: "9999px",
              letterSpacing: "0.03em",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              boxShadow: "0 2px 6px rgba(255, 92, 53, 0.15)",
            }}
          >
            <span>🔥</span>
            <span>FOUNDER DISCOUNT: UP TO 98% OFF</span>
            <span style={{ color: "#ffffff", marginLeft: 2, fontSize: "9px" }}>→</span>
          </a>
        </div>
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
            <DealSenseIcon size={34} />
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#092124", letterSpacing: "-0.035em" }}>
              Deal<span style={{ color: "#ff5c35" }}>Sense</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="desktop-nav-links" style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span onClick={() => navigate("/pipeline")} style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", cursor: "pointer" }}>Platform</span>
            <a href="#how-it-works" style={{ fontSize: "14px", fontWeight: 600, color: "#475569", textDecoration: "none", cursor: "pointer" }}>How It Works</a>
            <span onClick={() => navigate("/forecast")} style={{ fontSize: "14px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>Forecasting</span>
            <span onClick={() => navigate("/war-room")} style={{ fontSize: "14px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>War Room</span>
            <span
              onClick={() => navigate("/login")}
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#ff5c35",
                cursor: "pointer",
                background: "rgba(255, 92, 53, 0.08)",
                border: "1px solid rgba(255, 92, 53, 0.25)",
                padding: "3px 9px",
                borderRadius: "6px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              Install Free in HubSpot
            </span>
            <a href="#pricing-matrix" style={{ fontSize: "14px", fontWeight: 600, color: "#475569", textDecoration: "none" }}>Pricing</a>
            <span onClick={() => navigate("/case-study")} style={{ fontSize: "14px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>Case Study</span>
          </div>

          {/* CTA Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href="#pricing-matrix"
              className="desktop-cta-btn"
              style={{
                padding: "8px 16px",
                background: "#ffffff",
                color: "#092124",
                fontSize: "13px",
                fontWeight: 700,
                border: "1.5px solid #cbd5e1",
                borderRadius: "8px",
                cursor: "pointer",
                textDecoration: "none",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                transition: "all 0.2s ease",
              }}
            >
              View Pricing
            </a>
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

        {/* Mobile Dropdown Menu — Floating Glassmorphic Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop Blur Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  top: 50,
                  background: "rgba(9, 33, 36, 0.45)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  zIndex: 1998,
                }}
              />

              {/* Floating Glassmorphic Card Container */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: "12px",
                  right: "12px",
                  background: "rgba(255, 255, 255, 0.94)",
                  backdropFilter: "blur(24px) saturate(190%)",
                  WebkitBackdropFilter: "blur(24px) saturate(190%)",
                  border: "1px solid rgba(255, 255, 255, 0.85)",
                  borderRadius: "18px",
                  boxShadow: "0 24px 60px -12px rgba(9, 33, 36, 0.35), 0 0 0 1px rgba(226, 232, 240, 0.7)",
                  padding: "14px 12px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                  zIndex: 1999,
                  maxHeight: "calc(88vh - 70px)",
                  overflowY: "auto",
                }}
              >
                {/* 1. Pipeline Command Center */}
                <div
                  onClick={() => { navigate("/pipeline"); setMobileMenuOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    borderRadius: "12px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "8px", background: "rgba(18,69,72,0.08)", border: "1px solid rgba(18,69,72,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#124548" }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#092124", lineHeight: 1.2 }}>Pipeline Command Center</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>180ms deterministic deal triage & CRM sync</div>
                    </div>
                  </div>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>

                {/* 2. Install Free in HubSpot (Featured Card) */}
                <div
                  onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, rgba(255, 92, 53, 0.08) 0%, rgba(18, 69, 72, 0.05) 100%)",
                    border: "1.5px solid rgba(255, 92, 53, 0.35)",
                    boxShadow: "0 2px 10px rgba(255, 92, 53, 0.08)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "8px", background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", boxShadow: "0 2px 6px rgba(255,92,53,0.3)" }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 800, color: "#ff5c35", lineHeight: 1.2 }}>Install Free in HubSpot</span>
                        <span style={{ fontSize: "9px", fontWeight: 800, background: "rgba(255, 92, 53, 0.15)", color: "#ff5c35", border: "1px solid rgba(255, 92, 53, 0.3)", padding: "1px 5px", borderRadius: "4px" }}>
                          72% OFF
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Multi-tenant partner CRM canvas cards</div>
                    </div>
                  </div>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#ff5c35" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>

                {/* 3. Pricing & Deployment Plans */}
                <a
                  href="#pricing-matrix"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    borderRadius: "12px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "8px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#092124", lineHeight: 1.2 }}>Pricing & Software Ownership</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Single Portal ($1.5K) & Master Fleet ($3.5K)</div>
                    </div>
                  </div>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </a>

                {/* 4. Revenue Simulation & Forecast */}
                <div
                  onClick={() => { navigate("/forecast"); setMobileMenuOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    borderRadius: "12px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "8px", background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7" }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#092124", lineHeight: 1.2 }}>Revenue Simulation & Forecast</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Monte Carlo probabilities & slippage models</div>
                    </div>
                  </div>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>

                {/* 5. Deal War Room */}
                <div
                  onClick={() => { navigate("/war-room"); setMobileMenuOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    borderRadius: "12px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "8px", background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed" }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="m4.93 4.93 4.24 4.24" /><path d="m14.83 9.17 4.24-4.24" /><path d="m14.83 14.83 4.24 4.24" /><path d="m9.17 14.83-4.24 4.24" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#092124", lineHeight: 1.2 }}>Deal War Room & QBR</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>MEDDICC scrutiny & AI rep coaching actions</div>
                    </div>
                  </div>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>

                {/* 6. Case Study & Architecture Dossier */}
                <div
                  onClick={() => { navigate("/case-study"); setMobileMenuOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    borderRadius: "12px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "8px", background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706" }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#092124", lineHeight: 1.2 }}>Architecture & Case Study</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Production monorepo technical dossier</div>
                    </div>
                  </div>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>

                {/* Bottom Quick Action CTAs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "2px", paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
                  <button
                    onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                    style={{
                      padding: "10px 12px",
                      background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 800,
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(255, 92, 53, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <span>Agency Discount</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => { navigate("/pipeline"); setMobileMenuOpen(false); }}
                    style={{
                      padding: "10px 12px",
                      background: "#ffffff",
                      color: "#092124",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "1.5px solid #cbd5e1",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Launch App Demo
                  </button>
                </div>
              </motion.div>
            </>
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
          {/* Top Pill Badge — Top-1% Enterprise Style */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg, rgba(255, 92, 53, 0.07) 0%, rgba(255, 123, 87, 0.12) 100%)",
              border: "1px solid rgba(255, 92, 53, 0.28)",
              padding: "4px 14px",
              borderRadius: "9999px",
              marginBottom: 16,
              boxShadow: "0 2px 10px rgba(255, 92, 53, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
              whiteSpace: "nowrap",
              flexWrap: "nowrap",
              fontSize: "clamp(11px, 2.2vw, 12px)",
              fontWeight: 700,
              color: "#092124",
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c35", display: "inline-block", boxShadow: "0 0 8px #ff5c35", flexShrink: 0 }} />
            <span>Native HubSpot Intelligence <span style={{ color: "#cbd5e1" }}>·</span> <strong style={{ color: "#ff5c35", fontWeight: 800 }}>0% Hallucination Engine</strong></span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(28px, 5.4vw, 56px)",
              fontWeight: 900,
              lineHeight: 1.16,
              letterSpacing: "-0.04em",
              color: "#092124",
              margin: "0 0 18px",
            }}
          >
            <span style={{ display: "block" }}>Stop Silent Deal Slippage</span>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
              <span>In HubSpot With</span>
              <span
                style={{
                  background: "linear-gradient(135deg, rgba(255,92,53,0.1) 0%, rgba(255,123,87,0.16) 100%)",
                  border: "1.5px solid rgba(255,92,53,0.35)",
                  padding: "2px 14px",
                  borderRadius: "14px",
                  boxShadow: "0 6px 24px rgba(255,92,53,0.18)",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    background: "linear-gradient(135deg, #ff5c35 0%, #ff7b57 40%, #e04a25 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 2px 10px rgba(255,92,53,0.3))",
                  }}
                >
                  AI Revenue Telemetry
                </span>
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "clamp(14.5px, 2vw, 18px)",
              color: "#475569",
              lineHeight: 1.6,
              maxWidth: 740,
              margin: "0 auto 30px",
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
            style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap", maxWidth: 680, margin: "0 auto" }}
          >
            {/* 1. Orange Button: Install Free in HubSpot */}
            <button
              className="hero-btn-primary"
              onClick={() => navigate("/login")}
              id="hero-claim-discount-btn"
              style={{
                padding: "14px 28px",
                fontSize: "14.5px",
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(255, 92, 53, 0.42), inset 0 1px 0 rgba(255,255,255,0.3)",
                cursor: "pointer",
              }}
            >
              <span>Install Free in HubSpot</span>
              <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            {/* 2. Secondary Button: Access Agency Portal */}
            <button
              className="hero-btn-secondary"
              onClick={() => navigate("/agency")}
              id="hero-agency-portal-btn"
              style={{
                padding: "14px 26px",
                fontSize: "14.5px",
                fontWeight: 700,
                color: "#124548",
                background: "#ffffff",
                border: "1.5px solid #cbd5e1",
                borderRadius: "12px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 2px 8px rgba(9, 33, 36, 0.04), inset 0 1px 0 #ffffff",
                cursor: "pointer",
              }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#124548" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span style={{ color: "#124548", fontWeight: 700, fontSize: "14.5px" }}>Access Agency Portal</span>
            </button>
          </motion.div>

          {/* Premium Enterprise Trust Badges */}
          <div className="hero-trust-row">
            <span className="hero-trust-chip" title="100% Satisfaction or full refund guarantee">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>100% Money-Back Guarantee</span>
            </span>

            <span className="hero-trust-chip" title="Fast 24-hour turnaround on audit results">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>24h Turnaround</span>
            </span>

            <span className="hero-trust-chip" title="Enterprise grade AES-256 GCM token encryption">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#124548" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>AES-256 GCM Encrypted</span>
            </span>
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

      {/* ── 4. Logo Trust Bar — Real Enterprise Tech Brands + Infinite Marquee ── */}
      <section style={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "24px 0", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "10.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: 16, padding: "0 16px" }}>
            INTEGRATED WITH THE TECH STACK OF REVENUE & REVOPS LEADERS SCALING MULTI-MILLION DOLLAR PIPELINES
          </div>
          <div className="logo-marquee-container">
            <div className="logo-marquee-track">
              {[...Array(2)].map((_, setIdx) => (
                <React.Fragment key={setIdx}>
                  {/* HubSpot */}
                  <div className="logo-marquee-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#64748b"><path d="M17.69 13.28c-.39 0-.75.12-1.06.31l-1.59-1.2c.14-.35.22-.73.22-1.13 0-.38-.07-.75-.2-1.09l1.57-1.2c.31.2.68.32 1.06.32a1.89 1.89 0 001.89-1.89V7.2a1.89 1.89 0 00-1.89-1.89h-.2a1.89 1.89 0 00-1.89 1.89v.2c0 .08.01.15.02.22l-1.69 1.3a3.19 3.19 0 00-1.87-.61c-.7 0-1.35.23-1.88.62l-1.68-1.3c.01-.07.02-.14.02-.22v-.2A1.89 1.89 0 006.62 5.3h-.2a1.89 1.89 0 00-1.89 1.89v.2A1.89 1.89 0 006.42 9.3c.38 0 .75-.12 1.06-.32l1.57 1.2c-.13.34-.2.71-.2 1.09 0 .4.08.78.22 1.13l-1.59 1.2c-.31-.19-.67-.31-1.06-.31a1.89 1.89 0 00-1.89 1.89v.2a1.89 1.89 0 001.89 1.89h.2a1.89 1.89 0 001.89-1.89v-.2c0-.07-.01-.14-.02-.21l1.62-1.24a3.19 3.19 0 001.8.56c.68 0 1.31-.21 1.83-.58l1.61 1.23c-.01.08-.02.16-.02.24v.2a1.89 1.89 0 001.89 1.89h.2a1.89 1.89 0 001.89-1.89v-.2a1.89 1.89 0 00-1.89-1.89zm-5.63-1.01a1.04 1.04 0 110-2.08 1.04 1.04 0 010 2.08z"/></svg>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#475569", letterSpacing: "-0.02em" }}>HubSpot</span>
                  </div>
                  {/* Salesforce */}
                  <div className="logo-marquee-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#64748b"><path d="M10.05 4.8a4.6 4.6 0 013.45 1.56 3.9 3.9 0 012.14-.64 3.96 3.96 0 013.85 4.73A3.37 3.37 0 0121 13.6a3.37 3.37 0 01-2.82 3.32 3.56 3.56 0 01-3.25 2.13c-.9 0-1.72-.34-2.34-.9a4.2 4.2 0 01-2.78 1.05 4.2 4.2 0 01-3.87-2.57A3.65 3.65 0 013 13.2a3.65 3.65 0 012.24-3.37A4.6 4.6 0 0110.05 4.8z"/></svg>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#475569", letterSpacing: "-0.02em" }}>Salesforce</span>
                  </div>
                  {/* Slack */}
                  <div className="logo-marquee-item">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#64748b"><path d="M5.04 15.18a2.02 2.02 0 01-2.02 2.02A2.02 2.02 0 011 15.18a2.02 2.02 0 012.02-2.02h2.02v2.02zm1.01 0a2.02 2.02 0 012.02-2.02 2.02 2.02 0 012.02 2.02v5.05a2.02 2.02 0 01-2.02 2.02 2.02 2.02 0 01-2.02-2.02v-5.05zm2.02-10.14A2.02 2.02 0 016.05 3.02 2.02 2.02 0 018.07 1a2.02 2.02 0 012.02 2.02v2.02H8.07zm0 1.02a2.02 2.02 0 012.02 2.02 2.02 2.02 0 01-2.02 2.02H3.02A2.02 2.02 0 011 8.08a2.02 2.02 0 012.02-2.02h5.05zm10.14 2.02a2.02 2.02 0 012.02-2.02A2.02 2.02 0 0123 8.08a2.02 2.02 0 01-2.02 2.02h-2.02V8.08zm-1.01 0a2.02 2.02 0 01-2.02 2.02 2.02 2.02 0 01-2.02-2.02V3.02A2.02 2.02 0 0117.2 1a2.02 2.02 0 012.02 2.02v5.06zm-2.02 10.14a2.02 2.02 0 012.02 2.02A2.02 2.02 0 0117.2 23a2.02 2.02 0 01-2.02-2.02v-2.02h2.02v.26zm0-1.28a2.02 2.02 0 01-2.02-2.02 2.02 2.02 0 012.02-2.02h5.05A2.02 2.02 0 0123 15.92a2.02 2.02 0 01-2.02 2.02H17.2v-.98z"/></svg>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#475569", letterSpacing: "-0.02em" }}>Slack</span>
                  </div>
                  {/* Stripe */}
                  <div className="logo-marquee-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#64748b"><path d="M13.98 10.17c0-.94-.46-1.68-1.34-1.68-.89 0-1.42.74-1.42 1.67 0 1.1.63 1.66 1.53 1.66.44 0 .78-.1 1.03-.24v-1.18c-.23.13-.49.2-.78.2-.31 0-.58-.11-.62-.48h1.6v-.2zm-1.61-.35c0-.36.22-.51.42-.51.2 0 .4.15.4.51h-.82zM3.33 10.17c0-.94-.46-1.68-1.34-1.68-.88 0-1.41.74-1.41 1.67 0 1.1.63 1.66 1.53 1.66.44 0 .77-.1 1.03-.24v-1.18c-.23.13-.5.2-.78.2-.31 0-.58-.11-.62-.48H3.33v-.2zm-1.6-.35c0-.36.21-.51.41-.51.2 0 .4.15.4.51h-.81zm7.64-.65c-.31 0-.52.15-.63.25l-.04-.2h-.9v4.71l1.02-.22v-1.14c.12.08.29.2.57.2.58 0 1.1-.46 1.1-1.49 0-.94-.53-1.46-1.12-1.46v.35zm-.2 2.26c-.19 0-.3-.07-.38-.15v-1.2c.08-.1.2-.17.39-.17.3 0 .5.33.5.76 0 .44-.2.76-.51.76zm-3.16-.94c0 .78.38 1.35 1.11 1.35.33 0 .55-.07.74-.18l-.06-.77c-.15.08-.31.13-.52.13-.34 0-.56-.18-.56-.55V9.32h.56l.07-.77h-.63v-.92l-1.01.21v2.65h.3zm6.99-1.34l-.05-.2h-.88v3.43h1.01v-2.33c.24-.31.64-.25.77-.21V9.02c-.13-.05-.61-.14-.85.33zm3.39.09l-.04-.29h-.89v3.43h1.01v-2.35c.24-.31.64-.26.77-.21V9.02c-.13-.05-.61-.14-.85.32zm2.54-.75c0-.35.29-.49.77-.49.32 0 .72.1 1.04.27V8.3a3.09 3.09 0 00-1.04-.18c-.85 0-1.42.44-1.42 1.18 0 1.15 1.59.97 1.59 1.47 0 .41-.36.55-.85.55-.37 0-.84-.15-1.21-.36v1.01c.41.18.83.26 1.21.26.88 0 1.48-.35 1.48-1.18 0-1.24-1.59-1.02-1.59-1.49l.02-.12z"/></svg>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#475569", letterSpacing: "-0.02em" }}>Stripe</span>
                  </div>
                  {/* AWS */}
                  <div className="logo-marquee-item">
                    <svg width="26" height="16" viewBox="0 0 32 20" fill="#64748b"><path d="M9.02 7.71c0 .34.04.61.1.81.08.2.17.42.29.66.05.08.07.16.07.23 0 .1-.06.2-.19.3l-.63.42a.48.48 0 01-.26.09c-.1 0-.2-.05-.3-.14a3.1 3.1 0 01-.36-.47 8.7 8.7 0 01-.31-.59c-.78.92-1.76 1.38-2.94 1.38-.84 0-1.51-.24-2-.72-.49-.48-.74-1.12-.74-1.92 0-.85.3-1.54.91-2.06.6-.52 1.41-.78 2.44-.78.34 0 .69.03 1.06.08.37.05.75.13 1.15.22V4.7c0-.76-.16-1.29-.47-1.6-.32-.31-.86-.46-1.63-.46-.35 0-.71.04-1.08.13-.37.09-.73.2-1.08.35-.16.07-.28.11-.35.13a.63.63 0 01-.14.03c-.12 0-.18-.09-.18-.27V2.6c0-.14.02-.24.07-.3.05-.06.14-.12.28-.18.35-.18.77-.33 1.26-.45A6.05 6.05 0 015.37 1.5c1.16 0 2.01.26 2.56.79.54.53.81 1.33.81 2.41v3.17l.28-.16zm-4.06 1.52c.33 0 .67-.06 1.03-.18.36-.12.68-.34.94-.64.16-.19.28-.4.35-.64.07-.24.11-.53.11-.87v-.42c-.29-.07-.6-.13-.92-.17-.32-.04-.63-.06-.94-.06-.66 0-1.15.13-1.47.4-.32.27-.48.65-.48 1.15 0 .47.12.82.38 1.06.25.24.61.37 1 .37zm8.03 1.08c-.16 0-.27-.03-.34-.08-.07-.05-.14-.16-.19-.31L10.2 2.93c-.05-.16-.08-.26-.08-.31 0-.12.06-.19.18-.19h.98c.17 0 .28.03.34.08.07.05.13.16.18.31l1.6 6.31 1.49-6.31c.04-.16.1-.26.17-.31.07-.05.19-.08.35-.08h.8c.17 0 .28.03.35.08.07.05.14.16.17.31l1.5 6.39L19.97 2.8c.05-.16.12-.26.18-.31.07-.05.18-.08.34-.08h.93c.12 0 .19.06.19.19 0 .04-.01.08-.02.13-.01.05-.03.11-.06.2l-2.3 7.08c-.05.16-.12.26-.19.31-.07.05-.18.08-.34.08h-.86c-.17 0-.28-.03-.35-.08-.07-.06-.14-.16-.17-.32l-1.48-6.14-1.47 6.13c-.04.17-.1.27-.17.32-.07.06-.19.09-.35.09h-.86zm12.84.27c-.52 0-1.03-.06-1.53-.18-.5-.12-.89-.25-1.15-.4-.16-.09-.27-.19-.31-.28a.72.72 0 01-.06-.28v-.42c0-.18.07-.27.2-.27.05 0 .1.01.15.03.05.02.13.05.21.09.29.13.6.23.94.3.35.07.68.1 1.03.1.54 0 .97-.1 1.27-.29.3-.19.46-.47.46-.83 0-.24-.08-.45-.23-.61a2.15 2.15 0 00-.78-.45l-1.12-.35c-.56-.18-.98-.44-1.23-.79a1.87 1.87 0 01-.38-1.12c0-.32.07-.6.21-.86.14-.25.33-.47.57-.65.24-.18.51-.31.83-.4.32-.09.65-.13 1-.13.18 0 .37.01.55.03.19.03.36.06.53.1.16.05.32.1.46.15.14.06.25.12.33.18.11.07.19.14.24.22.05.08.07.18.07.31v.39c0 .18-.07.27-.2.27a.91.91 0 01-.33-.1 4.02 4.02 0 00-1.68-.34c-.49 0-.88.08-1.14.25-.27.17-.4.43-.4.79 0 .25.09.46.26.63.17.17.5.33.96.48l1.1.34c.56.18.96.43 1.2.76.24.33.36.7.36 1.12 0 .33-.07.63-.2.9-.14.27-.33.51-.57.7-.24.19-.53.34-.87.44-.35.11-.72.17-1.1.17z"/></svg>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#475569", letterSpacing: "-0.02em" }}>AWS</span>
                  </div>
                  {/* Google Cloud */}
                  <div className="logo-marquee-item">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#64748b"><path d="M12 3.68L7.37 8.31l1.42 1.42L12 6.51l3.21 3.22 1.42-1.42L12 3.68zM3.68 12l4.63-4.63-1.42-1.42L2.26 10.58l1.42 1.42zm0 0l-1.42 1.42L6.89 18.05l1.42-1.42L3.68 12zM12 20.32l4.63-4.63-1.42-1.42L12 17.49l-3.21-3.22-1.42 1.42L12 20.32zM20.32 12l-4.63 4.63 1.42 1.42 4.63-4.63-1.42-1.42zm0 0l1.42-1.42-4.63-4.63-1.42 1.42 4.63 4.63z"/></svg>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#475569", letterSpacing: "-0.02em" }}>Google Cloud</span>
                  </div>
                  {/* Zapier */}
                  <div className="logo-marquee-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#64748b"><path d="M15.54 8.46l-2.47 2.47h4.87c.06.35.06.7 0 1.06h-4.87l2.47 2.47c-.26.28-.54.54-.83.78l-2.47-2.47v4.87a5.88 5.88 0 01-1.06 0v-4.87l-2.47 2.47c-.29-.24-.57-.5-.83-.78l2.47-2.47H5.48a5.88 5.88 0 010-1.06h4.87L7.88 8.46c.26-.29.54-.57.83-.83l2.47 2.47V5.23c.35-.06.7-.06 1.06 0v4.87l2.47-2.47c.29.26.57.54.83.83zM12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#475569", letterSpacing: "-0.02em" }}>Zapier</span>
                  </div>
                  {/* GitHub */}
                  <div className="logo-marquee-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#64748b"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#475569", letterSpacing: "-0.02em" }}>GitHub</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Product Hubs Bento Grid — HubSpot Native Style ─────── */}
      <section style={{ padding: "clamp(56px, 7vw, 96px) clamp(16px, 4vw, 24px)", background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="landing-hubs-layout">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
            >
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c35", display: "inline-block" }} />
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
                  ALL-IN-ONE REVOPS ENGINE
                </span>
              </div>
              <h2 style={{ fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#092124", margin: "0 0 16px", lineHeight: 1.15 }}>
                Growing a pipeline is hard. DealSense makes it automatic.
              </h2>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6, marginBottom: 28 }}>
                Everything your revenue team needs to inspect stalled opportunities, run executive war rooms, and eliminate pipeline leakage in one unified HubSpot-native suite.
              </p>
              <button
                onClick={() => navigate("/pipeline")}
                style={{
                  padding: "14px 28px",
                  background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 800,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  boxShadow: "0 6px 16px rgba(255, 92, 53, 0.25)",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "fit-content",
                }}
              >
                <span>Explore Live Platform</span>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </motion.div>

            <div className="landing-hubs-grid">
              {HUBS.map((hub, i) => (
                <motion.div
                  key={i}
                  className="premium-hub-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() => navigate(hub.path)}
                  style={{
                    background: "#ffffff",
                    padding: "26px 24px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    borderTop: `4px solid ${hub.iconColor}`,
                    boxShadow: "0 8px 30px rgba(9, 33, 36, 0.04)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(9, 33, 36, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(9, 33, 36, 0.04)";
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: hub.iconBg, border: `1px solid ${hub.iconColor}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={hub.iconColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={hub.iconSvg} />
                    </svg>
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#092124", marginBottom: 8, letterSpacing: "-0.01em" }}>
                    {hub.title}
                  </div>
                  <div style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                    {hub.desc}
                  </div>
                  <div className="hub-explore-link" style={{ fontSize: "13px", fontWeight: 800, color: hub.iconColor, display: "flex", alignItems: "center", gap: 4 }}>
                    <span>Explore Hub</span>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={hub.iconColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                </motion.div>
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

      {/* ── 6.5 Interactive Live Flowing Video Tour: How It Works ───────── */}
      <HowItWorksVideoSection variant="landing" />

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

      <section
        id="pricing-matrix"
        style={{
          scrollMarginTop: "54px",
          padding: "clamp(16px, 2.5vw, 28px) clamp(16px, 4vw, 24px) 36px",
          background: "#ffffff",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          {/* Header & Market Delta Dock */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            {/* Top Urgency Capsule */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(255, 92, 53, 0.08)",
                border: "1px solid rgba(255, 92, 53, 0.25)",
                padding: "4px 14px",
                borderRadius: "9999px",
                marginBottom: 10,
                fontSize: "11px",
                fontWeight: 700,
                color: "#092124",
                letterSpacing: "-0.01em",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c35", display: "inline-block", boxShadow: "0 0 8px #ff5c35", flexShrink: 0 }} />
              <span>Limited Q1 Allocation <span style={{ color: "#cbd5e1" }}>·</span> <strong style={{ color: "#ff5c35", fontWeight: 800 }}>Only 3 Partner Deployments Left</strong></span>
            </div>

            <h2 style={{ fontSize: "clamp(24px, 3.2vw, 34px)", fontWeight: 900, color: "#092124", letterSpacing: "-0.035em", margin: "0 0 6px", fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
              Transparent Revenue Intelligence Packages
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.5, maxWidth: 680, margin: "0 auto 14px" }}>
              Competitor platforms cost <strong>$30,000–$60,000/yr</strong> with rigid per-seat licensing. Deploy DealSense with <strong>transparent pricing and unlimited rep seats</strong>.
            </p>

            {/* 100x Market Delta Comparison Ribbon */}
            <div
              className="pricing-comparison-dock"
              style={{
                background: "linear-gradient(180deg, #092124 0%, #0c272a 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "14px",
                padding: "8px 12px",
                boxShadow: "0 8px 24px -6px rgba(9, 33, 36, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Option 1 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "7px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8", fontSize: "11.5px", fontWeight: 600 }}>In-House Dev:</span>
                <span style={{ color: "#f87171", textDecoration: "line-through", fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>$58K+ & 8 Mos</span>
              </div>

              {/* Option 2 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "7px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8", fontSize: "11.5px", fontWeight: 600 }}>Gong / Clari:</span>
                <span style={{ color: "#f87171", textDecoration: "line-through", fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>$45K/yr (0% Brand)</span>
              </div>

              {/* Option 3 (Winner) */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "7px 12px", background: "rgba(16, 185, 129, 0.12)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.35)", boxShadow: "0 0 14px rgba(16, 185, 129, 0.15)" }}>
                <span style={{ color: "#34d399", fontSize: "11.5px", fontWeight: 800 }}>DealSense Stack:</span>
                <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 900, whiteSpace: "nowrap" }}>$99–$3,500 (Predictable ROI)</span>
              </div>
            </div>
          </div>

          {/* 3 Balanced Enterprise Pricing Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "stretch" }}>
            {/* Tier 1: $99 Audit (FEATURED PILOT) */}
            <div
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #fff7f4 100%)",
                border: "2px solid #ff5c35",
                borderRadius: "18px",
                padding: "22px 20px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                boxShadow: "0 16px 40px -8px rgba(255, 92, 53, 0.24), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255, 255, 255, 1)",
                transform: "scale(1.02)",
                zIndex: 2,
              }}
            >
              {/* Floating Crown Badge */}
              <div
                style={{
                  position: "absolute",
                  top: -13,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)",
                  color: "#ffffff",
                  padding: "4px 16px",
                  borderRadius: "9999px",
                  fontSize: "10.5px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  boxShadow: "0 4px 12px rgba(255, 92, 53, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  whiteSpace: "nowrap",
                }}
              >
                <span>👑</span>
                <span>MOST POPULAR · 48-HR PILOT</span>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#ff5c35", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    TIER 1 · TEST-DRIVE AUDIT
                  </span>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#ff5c35", background: "rgba(255,92,53,0.12)", border: "1px solid rgba(255,92,53,0.3)", padding: "2px 8px", borderRadius: "9999px" }}>
                    98% SAVINGS
                  </span>
                </div>
                <h3 style={{ fontSize: "21px", fontWeight: 900, color: "#092124", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                  Pilot Deal Risk Audit
                </h3>
                <p style={{ fontSize: "12.5px", color: "#64748b", margin: "0 0 14px", lineHeight: 1.4 }}>
                  Deterministic 0–100 health scoring across 50 active deals. Catches hidden slippage in 48 hours.
                </p>
                
                <div style={{ background: "rgba(255, 92, 53, 0.06)", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(255, 92, 53, 0.25)", marginBottom: 16 }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8", textDecoration: "line-through", fontWeight: 700 }}>
                    Standard: $5,000
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 1 }}>
                    <span style={{ fontSize: "38px", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                      $99
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>
                      / one-time flat fee
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#ff5c35", marginTop: 3 }}>
                    🔥 100% 'Find $25K Or Free' Guarantee
                  </div>
                </div>

                <div style={{ fontSize: "11px", fontWeight: 800, color: "#092124", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                  Audit Deliverables:
                </div>
                
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7.5, fontSize: "12px", color: "#092124" }}>
                  {[
                    { bold: "50 Active Deals Scored", text: "full 7-vector deterministic breakdown" },
                    { bold: "CFO Ghosting Detection", text: "identifies unengaged economic buyers" },
                    { bold: "Executive PDF Dossier", text: "board-ready deal triage briefing" },
                    { bold: "10-Min Loom Walkthrough", text: "senior architect strategic review" },
                    { bold: "48-Hour SLA Turnaround", text: "guaranteed fast audit delivery" },
                    { bold: "Find $25K Or It's Free", text: "100% no-risk money-back guarantee" },
                  ].map((item, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.3 }}>
                      <div style={{ width: 15, height: 15, borderRadius: "50%", background: "rgba(255, 92, 53, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="#ff5c35" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <strong style={{ color: "#092124" }}>{item.bold}</strong> <span style={{ color: "#475569" }}>({item.text})</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <div style={{ background: "rgba(255, 92, 53, 0.1)", border: "1px solid rgba(255, 92, 53, 0.25)", borderRadius: "8px", padding: "6px 10px", fontSize: "11px", color: "#e04a25", fontWeight: 800, textAlign: "center", marginBottom: 10 }}>
                  🎯 Find $25,000 In Slippage Or You Pay $0
                </div>
                <button
                  onClick={() => openOrder("audit-99")}
                  style={{
                    width: "100%",
                    padding: "12px 18px",
                    background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 800,
                    fontFamily: "'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif",
                    letterSpacing: "-0.02em",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(255, 92, 53, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>Start $99 Risk Audit</span>
                  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tier 2: $1,500 HubSpot Agency Fleet */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid rgba(203, 213, 225, 0.9)",
                borderRadius: "18px",
                padding: "22px 20px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 10px 24px -6px rgba(9, 33, 36, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                position: "relative",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#ff5c35", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    TIER 2 · SCALING HUBSPOT AGENCY
                  </span>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#ff5c35", background: "rgba(255,92,53,0.12)", border: "1px solid rgba(255,92,53,0.3)", padding: "2px 8px", borderRadius: "9999px" }}>
                    82% DISCOUNT
                  </span>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#092124", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                  HubSpot Agency Fleet
                </h3>
                <p style={{ fontSize: "12.5px", color: "#64748b", margin: "0 0 14px", lineHeight: 1.4 }}>
                  For scaling HubSpot partners managing up to 15 client portals under their own brand.
                </p>
                
                <div style={{ background: "rgba(255, 92, 53, 0.05)", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(255, 92, 53, 0.2)", marginBottom: 16 }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8", textDecoration: "line-through", fontWeight: 700 }}>
                    Standard: $8,500
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 1 }}>
                    <span style={{ fontSize: "34px", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                      $1,500
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>
                      / one-time flat fee
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#ff5c35", marginTop: 3 }}>
                    🔥 Solutions Partner Fleet · Unlimited Rep Seats
                  </div>
                </div>

                <div style={{ fontSize: "11px", fontWeight: 800, color: "#092124", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                  Complete Fleet Arsenal:
                </div>
                
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7.5, fontSize: "12px", color: "#092124" }}>
                  {[
                    { bold: "Manage up to 15 Client Portals", text: "master switcher cockpit" },
                    { bold: "Co-Branded Client Portals", text: "revops.youragency.com + custom logo" },
                    { bold: "Embedded HubSpot Canvas Card", text: "lives inside client CRM records" },
                    { bold: "Sub-200ms Webhook Stream", text: "Redis Streams real-time event engine" },
                    { bold: "1-Click Executive QBR Dossier", text: "automated board-ready PDF briefing" },
                    { bold: "1-Click Batch CRM Hygiene", text: "auto-remediation writebacks to HubSpot" },
                  ].map((item, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.3 }}>
                      <div style={{ width: 15, height: 15, borderRadius: "50%", background: "rgba(255, 92, 53, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="#ff5c35" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <strong style={{ color: "#092124" }}>{item.bold}</strong> <span style={{ color: "#475569" }}>({item.text})</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <div style={{ background: "rgba(255, 92, 53, 0.08)", border: "1px solid rgba(255, 92, 53, 0.2)", borderRadius: "8px", padding: "6px 10px", fontSize: "11px", color: "#e04a25", fontWeight: 800, textAlign: "center", marginBottom: 10 }}>
                  🔥 Bill 10 clients $2,500/mo = $300,000/yr ARR (200x ROI)
                </div>
                <button
                  onClick={() => openOrder("deploy-1500")}
                  style={{
                    width: "100%",
                    padding: "12px 18px",
                    background: "#092124",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    fontSize: "13.5px",
                    fontWeight: 800,
                    fontFamily: "'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif",
                    letterSpacing: "-0.02em",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(9, 33, 36, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>Deploy Partner Fleet ($1,500)</span>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tier 3: $3,500 Elite Master Fleet (Hero High-Ticket) */}
            <div
              style={{
                background: "linear-gradient(180deg, #092124 0%, #0d2c30 100%)",
                border: "1.5px solid rgba(52, 211, 153, 0.4)",
                borderRadius: "18px",
                padding: "22px 20px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "#ffffff",
                boxShadow: "0 16px 40px -8px rgba(9, 33, 36, 0.5), 0 0 24px rgba(18, 69, 72, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                position: "relative",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#34d399", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    TIER 3 · MASTER FLEET & MONOREPO
                  </span>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#34d399", background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.35)", padding: "2px 8px", borderRadius: "9999px" }}>
                    85% DISCOUNT
                  </span>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#ffffff", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                  Elite Master Fleet
                </h3>
                <p style={{ fontSize: "12.5px", color: "#94a3b8", margin: "0 0 14px", lineHeight: 1.4 }}>
                  For Elite HubSpot partners & consultancies demanding 100% code ownership & unlimited scale.
                </p>
                
                <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.12)", marginBottom: 16 }}>
                  <div style={{ fontSize: "12px", color: "#64748b", textDecoration: "line-through", fontWeight: 700 }}>
                    Standard: $24,000
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 1 }}>
                    <span style={{ fontSize: "34px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                      $3,500
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8" }}>
                      / one-time flat fee
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#34d399", marginTop: 3 }}>
                    💎 Unlimited Multi-Tenant Portals
                  </div>
                </div>

                <div style={{ fontSize: "11px", fontWeight: 800, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                  Master Partner Deliverables:
                </div>
                
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7.5, fontSize: "12px", color: "#f1f5f9" }}>
                  {[
                    { bold: "UNLIMITED Multi-Tenant Portals", text: "zero client or volume caps" },
                    { bold: "100% Monorepo Source Code", text: "FastAPI, React 18, Postgres 16, Redis" },
                    { bold: "Private Cloud VPC Deployment", text: "AWS, GCP, DigitalOcean, or On-Prem" },
                    { bold: "Row-Level Security (RLS)", text: "strict tenant isolation partition engine" },
                    { bold: "Custom Canvas Extension SDK", text: "build bespoke HubSpot CRM widgets" },
                    { bold: "1-on-1 Architect Slack SLA", text: "direct 1-hour senior lead response" },
                  ].map((item, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.3 }}>
                      <div style={{ width: 15, height: 15, borderRadius: "50%", background: "rgba(52, 211, 153, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <strong style={{ color: "#ffffff" }}>{item.bold}</strong> <span style={{ color: "#94a3b8" }}>({item.text})</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <div style={{ background: "rgba(52, 211, 153, 0.1)", border: "1px solid rgba(52, 211, 153, 0.25)", borderRadius: "8px", padding: "6px 10px", fontSize: "11px", color: "#34d399", fontWeight: 800, textAlign: "center", marginBottom: 10 }}>
                  💎 Unlimited Scale: Build a $500K+ ARR RevOps Practice
                </div>
                <button
                  onClick={() => openOrder("agency-3500")}
                  style={{
                    width: "100%",
                    padding: "12px 18px",
                    background: "#ffffff",
                    color: "#092124",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "13.5px",
                    fontWeight: 800,
                    fontFamily: "'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif",
                    letterSpacing: "-0.02em",
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.3), inset 0 1px 0 #ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>Claim Elite Master Fleet ($3,500)</span>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#092124" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9.5. Custom AI HubSpot App Engineering Banner ───────────────── */}
      <section style={{ padding: "0 clamp(16px, 4vw, 24px) 56px", background: "#ffffff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #092124 0%, #0d2c30 50%, #124548 100%)",
              borderRadius: "24px",
              padding: "clamp(32px, 5vw, 44px) clamp(20px, 4vw, 40px)",
              border: "1px solid rgba(255, 92, 53, 0.3)",
              boxShadow: "0 24px 60px -12px rgba(9, 33, 36, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 32,
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Ambient Background Flare */}
            <div style={{ position: "absolute", top: 0, right: 0, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 92, 53, 0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Left Column: Heading & Value Prop */}
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255, 92, 53, 0.15)",
                  border: "1px solid rgba(255, 92, 53, 0.35)",
                  padding: "4px 14px",
                  borderRadius: "9999px",
                  marginBottom: 14,
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#ff8c6b",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c35", display: "inline-block", boxShadow: "0 0 8px #ff5c35" }} />
                <span>⚡ BESPOKE HUBSPOT AI ARCHITECTURE</span>
              </div>

              <h3
                style={{
                  fontSize: "clamp(24px, 3.4vw, 34px)",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.18,
                  margin: "0 0 12px",
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                }}
              >
                Need Your Custom <span style={{ background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI HubSpot App</span>?
              </h3>

              <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.55, margin: "0 0 18px", maxWidth: 540 }}>
                Want a custom HubSpot CRM Canvas card, bespoke Redis event pipeline, fine-tuned LLM deal coach, or dedicated private cloud deployment? Our senior architects build, test, and hand over 100% full source code in <strong>5–10 business days</strong>.
              </p>

              {/* 4 Quick Deliverable Badges */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
                {[
                  { icon: "⏱️", text: "5–10 Day Rapid Sprint" },
                  { icon: "💎", text: "100% Code Ownership" },
                  { icon: "🛡️", text: "HubSpot Canvas Certified" },
                  { icon: "🔒", text: "Zero Per-Seat Fees" },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "12px", fontWeight: 700, color: "#f1f5f9" }}>
                    <span style={{ fontSize: "13px" }}>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: High Converting CTA Card with 70% Discount */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "18px",
                padding: "24px 20px",
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#34d399", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  CUSTOM ENTERPRISE SPRINT
                </span>
                <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#34d399", background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.35)", padding: "2px 8px", borderRadius: "9999px" }}>
                  70% DISCOUNT
                </span>
              </div>

              <div style={{ fontSize: "12px", color: "#94a3b8", textDecoration: "line-through", fontWeight: 700, marginBottom: 2 }}>
                Standard Custom Dev: $5,000+
              </div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 5, marginBottom: 4 }}>
                <span style={{ fontSize: "36px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                  $1,500
                </span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#cbd5e1" }}>
                  / flat one-time
                </span>
              </div>
              
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#ff8c6b", marginBottom: 16 }}>
                🔥 Save $3,500 · Only 2 Sprint Slots Open This Month
              </div>

              <button
                onClick={() => openOrder("deploy-1500")}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: 800,
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  letterSpacing: "-0.02em",
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(255, 92, 53, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                  marginBottom: 12,
                }}
              >
                <span>Claim $1,500 Custom Sprint</span>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                ⚡ Fixed Flat Price · 100% Code Handover · 1-Hr SLA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Senior Lead Architect Guarantee & Contact Hub ──────────── */}
      <section id="guarantee" style={{ padding: "0 clamp(16px, 4vw, 24px) 64px", background: "#ffffff" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(255, 92, 53, 0.3)",
              borderRadius: "20px",
              padding: "clamp(22px, 4vw, 32px) clamp(16px, 3.5vw, 32px)",
              boxShadow: "0 20px 48px -12px rgba(255, 92, 53, 0.12), 0 4px 16px rgba(0,0,0,0.03)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 28,
              alignItems: "center",
            }}
          >
            {/* Left: Guarantee Copy */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "3px 12px", borderRadius: "9999px", marginBottom: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#065f46", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  100% NO-RISK GUARANTEE
                </span>
              </div>
              <h3 style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em", margin: "0 0 10px", fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
                Find $25,000 in Deal Slippage or Your Audit is 100% Free
              </h3>
              <p style={{ fontSize: "13.5px", color: "#475569", lineHeight: 1.55, margin: 0 }}>
                Connect your HubSpot portal in 2 minutes via read-only OAuth. If our 7-vector scoring engine fails to uncover at least $25,000 in unaddressed slippage risk or silent buyer disengagement across your active pipeline, we issue an instant, no-questions-asked refund.
              </p>
            </div>

            {/* Right: Direct Lead Architect Contact Card */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px 18px", textAlign: "center" }}>
              {/* Luxury Concentric Avatar Badge */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #092124 0%, #124548 50%, #ff5c35 100%)",
                      color: "#ffffff",
                      fontSize: "20px",
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                      boxShadow: "0 0 0 3px #ffffff, 0 0 0 6px rgba(255, 92, 53, 0.3), 0 8px 24px rgba(9, 33, 36, 0.25)",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    PR
                  </div>
                  {/* Glowing Online Status Beacon */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "#10b981",
                      border: "2.5px solid #ffffff",
                      boxShadow: "0 0 8px #10b981",
                    }}
                    title="Lead Architect Online"
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 2 }}>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#092124" }}>
                  Peash Das Rudra
                </div>
                <span style={{ fontSize: "9px", fontWeight: 800, background: "rgba(16, 185, 129, 0.12)", color: "#059669", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "1px 5px", borderRadius: "4px", letterSpacing: "0.04em" }}>
                  CREATOR
                </span>
              </div>
              <div style={{ fontSize: "11.5px", color: "#64748b", lineHeight: 1.4, marginBottom: 12 }}>
                Lead AI Architect · HubAiLab<br />
                <span style={{ color: "#059669", fontWeight: 700 }}>🟢 Lead Architect Online · Monorepo Creator</span>
              </div>

              {/* 3 Top Icon Action Buttons */}
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 12 }}>
                <a
                  href="mailto:peashdasrudra@gmail.com?subject=DealSense%20Architecture%20Inquiry"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "10px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#ff5c35",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                  title="Direct Architect Email"
                >
                  <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/peashdasrudra"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "10px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#0a66c2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                  title="LinkedIn Direct Profile"
                >
                  <svg width={19} height={19} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/peashdasrudra"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "10px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#092124",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                  title="GitHub Monorepo Creator"
                >
                  <svg width={19} height={19} viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>

              {/* Full Width High-Converting Booking Button */}
              <a
                href="mailto:peashdasrudra@gmail.com?subject=DealSense%201-on-1%20Architecture%20Call%20Request"
                style={{
                  width: "100%",
                  padding: "13px 18px",
                  background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                  color: "#ffffff",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 800,
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  letterSpacing: "-0.02em",
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(255, 92, 53, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
              >
                <span>📅 Book 1-on-1 Architecture Call</span>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10.5. Interactive Expandable FAQ Accordion Section ───────────── */}
      <section id="faq" style={{ padding: "clamp(48px, 6vw, 76px) clamp(16px, 4vw, 24px)", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#ff5c35", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em", margin: "8px 0 10px", fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
              Everything You Need to Know Before Deploying
            </h2>
            <p style={{ fontSize: "14.5px", color: "#64748b", margin: "0 auto", maxWidth: 600, lineHeight: 1.5 }}>
              Clear, transparent answers on data security, source code ownership, and deterministic AI scoring.
            </p>
          </div>

          {/* Interactive Expandable Accordion */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                q: "How fast does the $99 pilot risk audit deliver findings?",
                a: "Under 48 hours. Connect via read-only OAuth, and our 7-vector engine scores all active deals, detects ghosting, and generates an Executive PDF Dossier with a 10-min Architect Loom walkthrough.",
              },
              {
                q: "Is our CRM data secure during the read-only OAuth connection?",
                a: "100% bank-grade secure. Official HubSpot read-only OAuth. We never modify records, never train public AI models on your pipeline, and enforce AES-256 encryption in transit and at rest.",
              },
              {
                q: "How does partner pricing work without per-seat charges?",
                a: "Unlike legacy platforms that charge $1,200+/rep/year for every sales rep, DealSense offers flat portal-based fleet licensing with unlimited viewer and sales rep seats.",
              },
              {
                q: "Do we get full source code ownership?",
                a: "Yes, complete source code handover. Full FastAPI backend, React 18 frontend, Postgres schema, Redis Streams, and HubSpot Canvas SDK with unlimited commercial rights.",
              },
              {
                q: "How does the 'Find $25K Or It’s Free' guarantee work?",
                a: "Zero-risk money-back guarantee. If our audit doesn't uncover at least $25,000 in pipeline slippage or ghosting risk, get a 100% full refund within 14 days. No questions asked.",
              },
              {
                q: "Can this integrate with our agency's custom domain & branding?",
                a: "Co-branded partner ready. Run on your own domain (e.g. revops.youragency.com) with your agency branding, colors, and bespoke HubSpot CRM sidebar cards.",
              },
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: "#ffffff",
                    border: isOpen ? "1.5px solid #ff5c35" : "1px solid #e2e8f0",
                    borderRadius: "14px",
                    overflow: "hidden",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: isOpen ? "0 4px 20px -4px rgba(255, 92, 53, 0.15)" : "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      background: "transparent",
                      border: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 14,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: "14.5px", fontWeight: 800, color: isOpen ? "#ff5c35" : "#092124", lineHeight: 1.4, fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
                      {faq.q}
                    </span>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "8px",
                        background: isOpen ? "rgba(255,92,53,0.12)" : "#f8fafc",
                        border: isOpen ? "1px solid rgba(255,92,53,0.3)" : "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={isOpen ? "#ff5c35" : "#64748b"} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "0 20px 18px", fontSize: "13.5px", color: "#475569", lineHeight: 1.6, borderTop: "1px solid rgba(255, 92, 53, 0.1)", paddingTop: 12 }}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 11. Final High-Impact CTA Banner ─────────────────────────── */}
      <section style={{ padding: "clamp(48px, 6vw, 76px) clamp(16px, 4vw, 24px)", background: "#ffffff" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #092124 0%, #124548 100%)",
            padding: "clamp(36px, 5vw, 56px) clamp(20px, 4vw, 48px)",
            textAlign: "center",
            color: "#ffffff",
            boxShadow: "0 20px 48px rgba(9, 33, 36, 0.28)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 92, 53, 0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

          <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 12px", fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
            Make impossible pipeline growth feel impossibly easy.
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255, 255, 255, 0.88)", maxWidth: 640, margin: "0 auto 28px", lineHeight: 1.6 }}>
            Ready to upgrade your revenue governance? Test the live interactive platform or start with our $99 pilot risk audit.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={() => openOrder("audit-99")}
              style={{
                padding: "14px 30px",
                background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)",
                color: "#ffffff",
                fontSize: "14.5px",
                fontWeight: 800,
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(255, 92, 53, 0.45)",
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                letterSpacing: "-0.02em",
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
                fontWeight: 800,
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                letterSpacing: "-0.02em",
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
