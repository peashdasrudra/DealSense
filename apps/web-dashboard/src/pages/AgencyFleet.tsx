/**
 * DealSense — Specialized High-Converting Agency & HubSpot Partner Fleet Page.
 * 
 * Target Audience:
 * 1. HubSpot Solutions Partners (Elite, Diamond, Platinum, Gold)
 * 2. RevOps Agencies & CRM Consultancies
 * 3. Fractional RevOps Leaders & Independent CRM Specialists
 * 
 * Strategic Purpose:
 * Converts agency owners by exposing the brutal market shift toward automated revenue intelligence,
 * proving mathematical retainer economics ($150K-$300K ARR on 95% margin), and presenting DealSense
 * as the premier Solutions Partner fleet engine to become the #1 HubSpot partner in their market.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DealSenseIcon } from "../components/DealSenseLogo";
import { Footer } from "../components/Footer";
import { scrollToSection } from "../config/navigation";
import { HowItWorksVideoSection } from "../components/HowItWorksVideoSection";

export const AgencyFleet: React.FC = () => {
  const navigate = useNavigate();

  // Interactive ROI Calculator State
  const [clientCount, setClientCount] = useState<number>(5);
  const [retainerPrice, setRetainerPrice] = useState<number>(2500);
  const [activePortalTab, setActivePortalTab] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

  // Order Modal State
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedTier] = useState<"audit-99" | "growth-499" | "scale-999" | "enterprise-2499" | "agency-1500" | "elite-3500" | "agency-3500" | "deploy-1500" | "custom-app">("scale-999");
  const [agencyName, setAgencyName] = useState("");
  const [email, setEmail] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Calculations
  const annualRevenue = clientCount * retainerPrice * 12;
  const annualFleetCost = (clientCount <= 5 ? 399 : clientCount <= 15 ? 799 : 1999) * 12;
  const netProfit = annualRevenue - annualFleetCost;
  const roiMultiplier = Math.round((annualRevenue / Math.max(annualFleetCost, 1)) * 10) / 10;

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setOrderModalOpen(false);
    }, 3800);
  };

  const openOrder = (tier: string) => {
    let mappedTier = "scale-999";
    if (tier === "starter-299" || tier === "audit-99") mappedTier = "audit-99";
    else if (tier === "growth-499") mappedTier = "growth-499";
    else if (tier === "scale-999" || tier === "agency-1500" || tier === "deploy-1500") mappedTier = "scale-999";
    else if (tier === "enterprise-2499" || tier === "elite-3500" || tier === "agency-3500") mappedTier = "enterprise-2499";
    else if (tier === "custom-app") mappedTier = "custom-app";
    navigate(`/checkout?tier=${mappedTier}`);
  };

  return (
    <div style={{ background: "#ffffff", color: "#0f172a", fontFamily: "var(--font-sans)", overflowX: "hidden" }}>
      {/* ── 0. Top Ultra-Premium Minimal Alert Bar ─────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(90deg, #092124 0%, #124548 50%, #092124 100%)",
          color: "#ffffff",
          padding: "6px 12px",
          textAlign: "center",
          fontSize: "11.5px",
          fontWeight: 700,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          letterSpacing: "-0.01em",
          width: "100%",
          maxWidth: "100vw",
          overflow: "hidden",
        }}
      >
        <a
          href="#pricing"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("pricing", 54);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            color: "#e2e8f0",
            textDecoration: "none",
            flexWrap: "wrap",
            fontSize: "clamp(10.5px, 2.5vw, 12px)",
            transition: "opacity 0.2s ease",
            maxWidth: "100%",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c35", display: "inline-block", boxShadow: "0 0 8px #ff5c35", flexShrink: 0 }} />
          <span>✨ <strong>HubSpot Solutions Partner Fleet:</strong> Dedicated multi-tenant revenue intelligence</span>
          <span style={{ color: "#ff8c6b", fontWeight: 800, textDecoration: "underline", marginLeft: "2px" }}>Explore Partner Fleet Plans →</span>
        </a>
      </div>

      {/* ── 1. Sticky Navigation Header ─────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.9)",
          zIndex: 1000,
          padding: "10px clamp(14px, 3vw, 28px)",
          boxShadow: "0 1px 3px rgba(18, 69, 72, 0.03)",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
          <div
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}
          >
            <DealSenseIcon size={32} />
            <div style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: "19px", fontWeight: 800, color: "#092124", letterSpacing: "-0.035em", lineHeight: 1 }}>
                Deal<span style={{ color: "#ff5c35" }}>Sense</span>
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 800,
                  background: "rgba(255, 92, 53, 0.08)",
                  color: "#ff5c35",
                  border: "1px solid rgba(255, 92, 53, 0.3)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                }}
              >
                AGENCY FLEET
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="desktop-nav-links" style={{ alignItems: "center", gap: 24, fontSize: "13.5px", fontWeight: 700, color: "#334155" }}>
            <a href="#the-shift" style={{ textDecoration: "none", color: "#334155", transition: "color 0.2s ease" }}>The Agency Dilemma</a>
            <a href="#how-it-works" style={{ textDecoration: "none", color: "#334155", transition: "color 0.2s ease" }}>How It Works</a>
            <a href="#acquisition" style={{ textDecoration: "none", color: "#334155", transition: "color 0.2s ease" }}>Inbound Diagnostic Playbook</a>
            <a href="#calculator" style={{ textDecoration: "none", color: "#334155", transition: "color 0.2s ease" }}>Retainer Economics</a>
            <a href="#features" style={{ textDecoration: "none", color: "#334155", transition: "color 0.2s ease" }}>Fleet Capabilities</a>
          </div>

          {/* Header Action & Mobile Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("pricing", 54);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 800,
                border: "1px solid #e04a25",
                borderRadius: "8px",
                textDecoration: "none",
                boxShadow: "0 3px 12px rgba(255, 92, 53, 0.35)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
            >
              <span>See Pricing</span>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

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
                  background: "rgba(255, 255, 255, 0.96)",
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
                <a
                  href="#the-shift"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: "10px 14px", borderRadius: "10px", background: "#f8fafc", color: "#092124", textDecoration: "none", fontSize: "13.5px", fontWeight: 700 }}
                >
                  The Agency Dilemma
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: "10px 14px", borderRadius: "10px", background: "#f8fafc", color: "#092124", textDecoration: "none", fontSize: "13.5px", fontWeight: 700 }}
                >
                  ⚡ How It Works (Live Video Tour)
                </a>
                <a
                  href="#acquisition"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: "10px 14px", borderRadius: "10px", background: "#f8fafc", color: "#092124", textDecoration: "none", fontSize: "13.5px", fontWeight: 700 }}
                >
                  Inbound Diagnostic Playbook
                </a>
                <a
                  href="#calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: "10px 14px", borderRadius: "10px", background: "#f8fafc", color: "#092124", textDecoration: "none", fontSize: "13.5px", fontWeight: 700 }}
                >
                  Retainer Revenue Calculator ($300K ARR)
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: "10px 14px", borderRadius: "10px", background: "#f8fafc", color: "#092124", textDecoration: "none", fontSize: "13.5px", fontWeight: 700 }}
                >
                  Agency Fleet Capabilities
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255, 92, 53, 0.08)", color: "#ff5c35", border: "1px solid rgba(255,92,53,0.3)", textDecoration: "none", fontSize: "13.5px", fontWeight: 800 }}
                >
                  Pricing & Partner Fleet Plans
                </a>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* ── 2. Hero Section: Top-1% Agency Positioning ──────────────────── */}
      <section
        style={{
          padding: "clamp(36px, 5vw, 64px) clamp(14px, 3.5vw, 24px) 16px",
          background: "linear-gradient(180deg, #fbf7f5 0%, #ffffff 100%)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Ambient Glow */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 92, 53, 0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(255, 92, 53, 0.08)",
              border: "1px solid rgba(255, 92, 53, 0.25)",
              padding: "5px 14px",
              borderRadius: "9999px",
              marginBottom: 14,
              boxShadow: "0 2px 6px rgba(255,92,53,0.06)",
              whiteSpace: "nowrap",
              flexWrap: "nowrap",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c35", display: "inline-block", boxShadow: "0 0 8px #ff5c35", flexShrink: 0 }} />
            <span style={{ fontSize: "clamp(10.5px, 2.2vw, 11.5px)", fontWeight: 800, color: "#ff5c35", letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              👑 Built for HubSpot Partners & RevOps Agencies
            </span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(26px, 4.8vw, 54px)",
              fontWeight: 900,
              lineHeight: 1.18,
              letterSpacing: "-0.04em",
              color: "#092124",
              margin: "0 0 14px",
              maxWidth: 880,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <span style={{ display: "block" }}>Turn Every Client HubSpot Portal</span>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
              <span>Into a</span>
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
                  $2,500/mo AI Retainer
                </span>
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "clamp(14px, 1.8vw, 17.5px)",
              color: "#475569",
              lineHeight: 1.55,
              maxWidth: 740,
              margin: "0 auto 22px",
            }}
          >
            Stop trading hours for manual CRM cleanup. Deploy DealSense across your agency’s client fleet in 10 minutes. Deliver 7-vector deterministic risk scoring and executive QBR briefings with <strong>zero custom engineering</strong> and <strong>predictable partner fleet economics</strong>.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="landing-hero-btns"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap", maxWidth: 640, margin: "0 auto" }}
          >
            <button
              onClick={() => openOrder("audit-99")}
              className="hero-btn-primary"
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
              }}
            >
              <span>Start with $99 Plan</span>
              <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => navigate("/pipeline")}
              className="hero-btn-secondary"
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
              }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#124548" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span style={{ color: "#124548", fontWeight: 700, fontSize: "14.5px" }}>See Live Demo</span>
            </button>
          </motion.div>

          {/* Why DealSense Section Header — Full HubSpot UI Style */}
          <div style={{ marginTop: 18, marginBottom: 24, textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
              <DealSenseIcon size={28} />
              <h2 style={{ fontSize: "clamp(20px, 3.4vw, 28px)", fontWeight: 900, color: "#092124", letterSpacing: "-0.035em", margin: 0 }}>
                Why Deal<span style={{ color: "#ff5c35" }}>Sense</span>?
              </h2>
            </div>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "11.5px", fontWeight: 800, color: "#092124", background: "rgba(18, 69, 72, 0.05)", border: "1px solid rgba(18, 69, 72, 0.12)", padding: "3px 13px", borderRadius: "9999px", whiteSpace: "nowrap" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c35", display: "inline-block", boxShadow: "0 0 8px #ff5c35", flexShrink: 0 }} />
                <span>Zero Per-Seat User Markups <span style={{ color: "#94a3b8" }}>·</span> <strong style={{ color: "#ff5c35" }}>95% Pure Retainer Margin</strong></span>
              </div>
            </div>
          </div>

          {/* 4 Hero Metric Badges - The 4 Irresistible Agency Hooks */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            {[
              { num: "$300,000", label: "New Retainer ARR", sub: "At $2.5K/mo across 10 clients" },
              { num: "70%+", label: "Audit-to-Retainer Close", sub: "48-hr $25K pipeline hook" },
              { num: "80+ Hours", label: "Saved Every Month", sub: "1-click automated QBR briefings" },
              { num: "Multi-Portal", label: "Solutions Partner Fleet", sub: "Co-branded · Unlimited seats" },
            ].map((stat, i) => (
              <div
                key={i}
                className="enterprise-card"
                style={{
                  padding: "14px 10px",
                  textAlign: "center",
                  borderRadius: "14px",
                }}
              >
                <div style={{ fontSize: "clamp(19px, 3.2vw, 23px)", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em" }}>{stat.num}</div>
                <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#ff5c35", marginTop: 2 }}>{stat.label}</div>
                <div style={{ fontSize: "10.5px", color: "#64748b", marginTop: 2 }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. The Harsh Market Reality ("The Agency Dilemma") ──────────── */}
      <section id="the-shift" style={{ padding: "28px clamp(16px, 4vw, 24px) 56px", background: "#092124", color: "#ffffff", position: "relative" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 56px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#ff5c35", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              THE BRUTAL REALITY OF REVOPS IN 2026
            </span>
            <h2 style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", margin: "12px 0 16px" }}>
              The Manual Agency Model Is Dying. The AI-Augmented Partner Is Dominating.
            </h2>
            <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: 1.6 }}>
              Clients don’t want to pay $150/hr for consultants to manually inspect deals on Friday mornings. They want real-time telemetry, automated deal rescue, and executive board clarity.
            </p>
          </div>

          {/* Before vs After Contrast Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 20 }}>
            {/* The Old Manual Model */}
            <div style={{ background: "rgba(220, 38, 38, 0.05)", border: "1px solid rgba(220, 38, 38, 0.3)", borderRadius: "18px", padding: "clamp(20px, 4vw, 34px) clamp(16px, 3.5vw, 28px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#dc2626", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px" }}>✕</span>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fca5a5", margin: 0 }}>The Dying Manual Agency</h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  "Account managers spend 20+ hours building manual slide decks before quarterly QBRs.",
                  "Clients churn after 6 months because 'we can build custom HubSpot reports ourselves.'",
                  "Reps ignore manual dashboard recommendations and subjectively guess deal close dates.",
                  "Zero proprietary IP — completely vulnerable to any competitor offering AI automation.",
                  "Stuck in the 'hours-for-dollars' trap billing hourly or fighting for low-margin $1,500 retainers.",
                ].map((item, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "14px", color: "#cbd5e1", lineHeight: 1.5 }}>
                    <span style={{ color: "#ef4444", fontWeight: 800 }}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The DealSense Elite Partner */}
            <div style={{ background: "linear-gradient(180deg, rgba(18, 69, 72, 0.5) 0%, rgba(9, 33, 36, 0.8) 100%)", border: "2px solid #ff5c35", borderRadius: "18px", padding: "34px 28px", position: "relative", boxShadow: "0 0 36px rgba(255,92,53,0.2), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
              <div style={{ position: "absolute", top: -13, right: 24, background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)", color: "#ffffff", fontSize: "11px", fontWeight: 800, padding: "4px 14px", borderRadius: "9999px", letterSpacing: "0.05em", boxShadow: "0 4px 12px rgba(255,92,53,0.3)" }}>
                👑 TOP-1% HUBSPOT PARTNER
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#10b981", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px" }}>✓</span>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", margin: 0 }}>The AI-Augmented Fleet Partner</h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  "Deploys DealSense under their own agency domain & branding (revops.youragency.com).",
                  "Charges $2,500–$5,000/mo automated revenue intelligence retainers on 95% pure profit margin.",
                  "Instant 1-Click Executive QBR generation saves 80+ staff hours across client portfolios every month.",
                  "Sub-200ms webhooks catch ghosting CFOs and stalled deals before reps or clients even notice.",
                  "Irreplaceable strategic partner — board-level reporting that clients literally cannot afford to cancel.",
                ].map((item, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "14px", color: "#f1f5f9", lineHeight: 1.5 }}>
                    <span style={{ color: "#34d399", fontWeight: 800 }}>•</span>
                    <span><strong>{item}</strong></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.5 Interactive Live Flowing Video Tour: How It Works ───────── */}
      <HowItWorksVideoSection variant="agency" />

      {/* ── 4. The Inbound Diagnostic Client Acquisition Playbook ─────────── */}
      <section id="acquisition" style={{ padding: "84px clamp(16px, 4vw, 24px)", background: "#ffffff" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 56px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#ff5c35", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              INBOUND PIPELINE DIAGNOSTIC METHODOLOGY
            </span>
            <h2 style={{ fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em", margin: "12px 0 16px" }}>
              How Solutions Partners Use DealSense to Close $30,000 Retainers
            </h2>
            <p style={{ fontSize: "16px", color: "#64748b", lineHeight: 1.6 }}>
              Instead of pitching an abstract 6-month CRM overhaul, execute the <strong>3-Step Inbound Diagnostic Playbook</strong> that demonstrates immediate revenue risk to executive stakeholders.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 20 }}>
            {[
              {
                step: "01",
                title: "The Low-Friction Diagnostic Audit",
                tag: "Zero-Friction Entry",
                desc: "Offer prospective or existing clients a rapid 48-hour pipeline diagnostic: connect HubSpot via read-only OAuth, evaluate active deals against 7 mathematical risk vectors, and surface hidden deal slippage.",
              },
              {
                step: "02",
                title: "The Executive Pipeline Risk Brief",
                tag: "Quantified Pipeline Insights",
                desc: "Deliver a board-ready Executive Risk Brief revealing stalled commit deals, single-threaded opportunities, and silent economic buyers before the quarter ends.",
              },
              {
                step: "03",
                title: "The Ongoing RevOps Fleet Retainer",
                tag: "High-Retention Partnership",
                desc: "Transition the one-time diagnostic into an ongoing $2,500–$5,000/mo RevOps intelligence retainer, embedding real-time DealSense risk monitoring directly inside their team's daily pipeline.",
              },
            ].map((col, i) => (
              <div
                key={i}
                className="enterprise-card"
                style={{
                  padding: "34px 28px",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: "36px", fontWeight: 900, color: "#ff5c35", opacity: 0.9, lineHeight: 1, marginBottom: 12 }}>
                  {col.step}
                </div>
                <div style={{ display: "inline-block", background: "rgba(18,69,72,0.08)", color: "#124548", fontSize: "11px", fontWeight: 800, padding: "3px 10px", borderRadius: "9999px", marginBottom: 12 }}>
                  {col.tag}
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 800, color: "#092124", margin: "0 0 12px" }}>{col.title}</h3>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>{col.desc}</p>
              </div>
            ))}
          </div>

          {/* ── Multi-Tenant Fleet Cockpit Interactive Preview ──────────────── */}
          <div style={{ marginTop: 64 }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 24px 56px -12px rgba(9, 33, 36, 0.14), 0 4px 16px rgba(0,0,0,0.04)",
                overflow: "hidden",
              }}
            >
              {/* Cockpit Top Bar */}
              <div style={{ background: "#092124", padding: "16px clamp(14px, 3vw, 24px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.1)", minWidth: 0, width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <DealSenseIcon size={30} />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff" }}>
                      Apex RevOps Agency Fleet Cockpit
                    </div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                      revops.apexrevops.com · 8 Active HubSpot Client Portals
                    </div>
                  </div>
                </div>

                {/* Client Portal Selector (Horizontal Touch-Scroll on Mobile) */}
                <div
                  className="no-scrollbar"
                  style={{
                    display: "flex",
                    gap: 8,
                    overflowX: "auto",
                    WebkitOverflowScrolling: "touch",
                    maxWidth: "100%",
                    minWidth: 0,
                    flex: "1 1 auto",
                    paddingBottom: 4,
                  }}
                >
                  {[
                    { name: "TechCorp (HubSpot #49102)", score: 82, band: "Healthy" },
                    { name: "FinanceGo (HubSpot #38204)", score: 31, band: "Critical" },
                    { name: "RetailMax (HubSpot #29188)", score: 58, band: "Moderate" },
                  ].map((portal, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePortalTab(idx)}
                      style={{
                        padding: "7px 13px",
                        fontSize: "12px",
                        fontWeight: 700,
                        borderRadius: "8px",
                        border: "1px solid",
                        borderColor: activePortalTab === idx ? "#ff5c35" : "rgba(255,255,255,0.15)",
                        background: activePortalTab === idx ? "rgba(255,92,53,0.18)" : "rgba(255,255,255,0.05)",
                        color: activePortalTab === idx ? "#ff8c6b" : "#cbd5e1",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {portal.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Portal Intelligence Details */}
              <div style={{ padding: "clamp(16px, 3vw, 28px)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 12, marginBottom: 20 }}>
                  <div style={{ background: "#f8fafc", padding: "14px 12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Active Pipeline</div>
                    <div style={{ fontSize: "clamp(18px, 3.5vw, 24px)", fontWeight: 900, color: "#092124", margin: "3px 0" }}>$1,850,000</div>
                    <div style={{ fontSize: "11px", color: "#059669", fontWeight: 600 }}>● 24 Active Deals</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "14px 12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Deal Health</div>
                    <div style={{ fontSize: "clamp(18px, 3.5vw, 24px)", fontWeight: 900, color: activePortalTab === 1 ? "#dc2626" : activePortalTab === 2 ? "#d97706" : "#059669", margin: "3px 0" }}>
                      {activePortalTab === 1 ? "31/100 · Critical" : activePortalTab === 2 ? "58/100 · Moderate" : "82/100 · Healthy"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>7-Vector Deterministic</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "14px 12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Slippage Leakage</div>
                    <div style={{ fontSize: "clamp(18px, 3.5vw, 24px)", fontWeight: 900, color: "#dc2626", margin: "3px 0" }}>
                      {activePortalTab === 1 ? "$480,000" : activePortalTab === 2 ? "$190,000" : "$45,000"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#dc2626", fontWeight: 600 }}>⚠️ Stalled Risk</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "14px 12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Agency Retainer</div>
                    <div style={{ fontSize: "clamp(18px, 3.5vw, 24px)", fontWeight: 900, color: "#124548", margin: "3px 0" }}>$2,500/mo</div>
                    <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>95% Net Margin</div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, background: "rgba(18,69,72,0.04)", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(18,69,72,0.12)" }}>
                  <div style={{ fontSize: "13px", color: "#092124", fontWeight: 600 }}>
                    ⚡ <strong>Agency Action Ready:</strong> 1-Click Executive PDF Briefing ready for Client QBR.
                  </div>
                  <button
                    onClick={() => openOrder("scale-999")}
                    style={{ padding: "9px 18px", background: "#ff5c35", color: "#ffffff", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 800, cursor: "pointer", boxShadow: "0 2px 8px rgba(255,92,53,0.3)", width: "100%", maxWidth: 300 }}
                  >
                    Export Client QBR Dossier →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Live Interactive Retainer Revenue Calculator ──────────── */}
      <section id="calculator" style={{ padding: "84px clamp(16px, 4vw, 24px)", background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 48px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#ff5c35", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              INTERACTIVE AGENCY ROI CALCULATOR
            </span>
            <h2 style={{ fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em", margin: "12px 0 16px" }}>
              Calculate Your Agency’s Solutions Partner Retainer Profit
            </h2>
            <p style={{ fontSize: "16px", color: "#64748b", lineHeight: 1.6 }}>
              See why paying <strong>$0 monthly fees</strong> and deploying the Solutions Partner fleet engine creates an unstoppable cash engine for your agency.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "22px",
              padding: "clamp(20px, 4vw, 48px)",
              boxShadow: "0 20px 48px -15px rgba(9, 33, 36, 0.08)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "clamp(20px, 3vw, 40px)",
              alignItems: "center",
              minWidth: 0,
              width: "100%",
            }}
          >
            {/* Controls */}
            <div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: "14px", fontWeight: 700, color: "#092124" }}>Number of Active HubSpot Client Portals:</label>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "#ff5c35" }}>{clientCount} Clients</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={clientCount}
                  onChange={(e) => setClientCount(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#ff5c35", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: 4 }}>
                  <span>1 Client</span>
                  <span>10 Clients</span>
                  <span>25 Clients</span>
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: "14px", fontWeight: 700, color: "#092124" }}>Monthly Retainer Charged per Client:</label>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "#124548" }}>${retainerPrice.toLocaleString()}/mo</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={5000}
                  step={250}
                  value={retainerPrice}
                  onChange={(e) => setRetainerPrice(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#124548", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: 4 }}>
                  <span>$1,000/mo</span>
                  <span>$2,500/mo</span>
                  <span>$5,000/mo</span>
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12.5px", color: "#475569" }}>
                💡 <strong>DealSense Fleet Economics:</strong> Deploy across your client portals with transparent fleet pricing and unlimited rep seats. Scale retainers without unpredictable per-seat markups.
              </div>
            </div>

            {/* Results Display */}
            <div style={{ background: "linear-gradient(135deg, #092124 0%, #124548 100%)", borderRadius: "18px", padding: "36px", color: "#ffffff", textAlign: "center", boxShadow: "0 12px 32px rgba(9, 33, 36, 0.3)" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#34d399", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                YOUR PROJECTED ANNUAL REVENUE (ARR)
              </div>
              <div style={{ fontSize: "clamp(38px, 5vw, 54px)", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                ${annualRevenue.toLocaleString()}
                <span style={{ fontSize: "18px", fontWeight: 600, color: "#94a3b8" }}>/yr</span>
              </div>

              <div style={{ margin: "24px 0", height: 1, background: "rgba(255,255,255,0.15)" }} />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 80px), 1fr))", gap: 10, textAlign: "left" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Fleet Tier</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#ff8c6b" }}>
                    {clientCount <= 5 ? "Growth Fleet ($399/mo)" : clientCount <= 15 ? "Pro Fleet ($799/mo)" : "Enterprise Fleet"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Estimated Net Profit</div>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "#ffffff" }}>${netProfit.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>First-Year ROI</div>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "#34d399" }}>{roiMultiplier}x</div>
                </div>
              </div>

              <button
                onClick={() => clientCount <= 15 ? openOrder(clientCount <= 5 ? "growth-499" : "scale-999") : navigate("/app/enterprise")}
                style={{
                  width: "100%",
                  marginTop: 24,
                  padding: "15px",
                  background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 800,
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(255, 92, 53, 0.4)",
                  transition: "all 0.2s ease",
                }}
              >
                Deploy {clientCount <= 5 ? "Growth Fleet ($499/mo)" : clientCount <= 15 ? "Pro Fleet ($999/mo)" : "Enterprise Fleet"} →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Complete Solutions Partner Arsenal ─────────────────────────────── */}
      <section id="features" style={{ padding: "64px clamp(16px, 4vw, 24px) 16px", background: "#ffffff" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 40px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#ff5c35", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              SOLUTIONS PARTNER FLEET ARSENAL
            </span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em", margin: "10px 0 12px" }}>
              Everything You Need to Be the #1 HubSpot Agency in Your Market
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
              A complete production-grade technical moat. Zero developer hiring required.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 18 }}>
            {[
              {
                icon: "🏢",
                title: "Multi-Tenant Fleet Cockpit",
                desc: "Monitor 50+ client HubSpot portals in one unified command center with cross-portal risk benchmarking and health indexes.",
              },
              {
                icon: "🎨",
                title: "Co-Branded Client Experience",
                desc: "Hosted on your custom agency domain (e.g. revops.youragency.com) with your agency logo, signature color palette, and custom favicon.",
              },
              {
                icon: "🧩",
                title: "Embedded HubSpot Sidebar Extension",
                desc: "Your agency-branded DealSense intelligence card lives right inside your clients' native HubSpot deal records.",
              },
              {
                icon: "⚖️",
                title: "Custom Scoring Weights",
                desc: "Fine-tune 7-vector scoring algorithms per client vertical (SaaS, Services, Manufacturing, Healthcare) for 100% precision.",
              },
              {
                icon: "📑",
                title: "1-Click Executive QBR Exporter",
                desc: "Generate board-ready PDF deal risk briefings and leakage triage reports in 3 seconds before every client review.",
              },
              {
                icon: "⚡",
                title: "Sub-200ms Webhook Event Stream",
                desc: "FastAPI + Redis Streams + PostgreSQL 16 pgvector architecture with strict Row-Level Security tenant isolation.",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="enterprise-card"
                style={{
                  padding: "24px 22px",
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: 10 }}>{feat.icon}</div>
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#092124", margin: "0 0 6px" }}>{feat.title}</h3>
                <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.55, margin: 0 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Transparent Partner Pricing & Offer Ladder ───────────────── */}
      <section
        id="pricing"
        style={{
          scrollMarginTop: "54px",
          padding: "10px clamp(16px, 4vw, 24px) clamp(24px, 3vw, 40px)",
          background: "#f8fafc",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 840, margin: "0 auto 16px" }}>
            {/* Top Partner Capsule */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "linear-gradient(135deg, rgba(255, 92, 53, 0.07) 0%, rgba(255, 123, 87, 0.12) 100%)",
                border: "1px solid rgba(255, 92, 53, 0.28)",
                padding: "3px 12px",
                borderRadius: "9999px",
                marginBottom: 6,
                boxShadow: "0 2px 8px rgba(255, 92, 53, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                whiteSpace: "nowrap",
                fontSize: "11px",
                fontWeight: 700,
                color: "#092124",
                letterSpacing: "-0.01em",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c35", display: "inline-block", boxShadow: "0 0 8px #ff5c35", flexShrink: 0 }} />
              <span>HubSpot Solutions Partner Fleet Licensing <span style={{ color: "#cbd5e1" }}>·</span> <strong style={{ color: "#ff5c35", fontWeight: 800 }}>Multi-Portal RevOps Intelligence</strong></span>
            </div>

            <h2 style={{ fontSize: "clamp(22px, 2.6vw, 30px)", fontWeight: 900, color: "#092124", letterSpacing: "-0.035em", margin: "0 0 4px", fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
              Transparent Agency & Partner Fleet Pricing
            </h2>
            <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5, maxWidth: 680, margin: "0 auto 10px" }}>
              Deploy dedicated revenue intelligence across your client portals with transparent fleet subscriptions, unlimited rep seats, and zero per-seat user markups.
            </p>

            {/* 100x Market Delta Comparison Ribbon */}
            <div
              className="pricing-comparison-dock"
              style={{
                background: "linear-gradient(180deg, #092124 0%, #0c272a 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                padding: "5px 10px",
                boxShadow: "0 4px 16px -4px rgba(9, 33, 36, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Option 1 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "5px 10px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600 }}>Single-Portal Enterprise:</span>
                <span style={{ color: "#f87171", textDecoration: "line-through", fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap" }}>$45K+/yr per-seat</span>
              </div>

              {/* Option 2 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "5px 10px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600 }}>In-House Custom Dev:</span>
                <span style={{ color: "#f87171", textDecoration: "line-through", fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap" }}>$60K+ dev cycle</span>
              </div>

              {/* Option 3 (Winner) */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "5px 10px", background: "rgba(16, 185, 129, 0.12)", borderRadius: "6px", border: "1px solid rgba(16, 185, 129, 0.35)", boxShadow: "0 0 14px rgba(16, 185, 129, 0.15)" }}>
                <span style={{ color: "#34d399", fontSize: "11px", fontWeight: 800 }}>DealSense Partner Fleet:</span>
                <span style={{ color: "#ffffff", fontSize: "11.5px", fontWeight: 900, whiteSpace: "nowrap" }}>From $399/mo (Unlimited Seats)</span>
              </div>
            </div>

            {/* Monthly / Annual Billing Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "14px 0 6px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: !isAnnual ? "#092124" : "#64748b" }}>Monthly Billing</span>
              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 9999,
                  background: isAnnual ? "#ff5c35" : "#cbd5e1",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s ease",
                  padding: 2,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#ffffff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    transform: isAnnual ? "translateX(22px)" : "translateX(0)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              <span style={{ fontSize: "13px", fontWeight: 700, color: isAnnual ? "#092124" : "#64748b", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span>Annual Billing</span>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#059669", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 7px", borderRadius: 9999 }}>
                  SAVE 20%
                </span>
              </span>
            </div>
          </div>

          {/* 4 Clean Solutions Partner Pricing Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 255px), 1fr))", gap: 14, alignItems: "stretch" }}>
            {/* Tier 1: Pilot Deal Risk Audit ($99) */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e2e8f0",
                borderRadius: "16px",
                padding: "18px 16px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 16px rgba(9, 33, 36, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: "10px", fontWeight: 800, color: "#ff5c35", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    TIER 1 · DIAGNOSTIC PILOT
                  </span>
                  <span style={{ fontSize: "9.5px", fontWeight: 800, color: "#059669", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "1px 6px", borderRadius: "9999px" }}>
                    1 PORTAL
                  </span>
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 900, color: "#092124", margin: "0 0 4px", letterSpacing: "-0.02em", fontFamily: "'Outfit', sans-serif" }}>
                  Pilot Risk Audit
                </h3>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px", lineHeight: 1.4 }}>
                  Deterministic 0–100 health scoring across 50 active deals. Catches hidden slippage in 48 hours.
                </p>
                
                <div style={{ background: "rgba(255, 92, 53, 0.05)", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(255, 92, 53, 0.2)", marginBottom: 12 }}>
                  <div style={{ fontSize: "10.5px", color: "#94a3b8", fontWeight: 700 }}>
                    One-Time Diagnostic
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 1 }}>
                    <span style={{ fontSize: "30px", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                      $99
                    </span>
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#64748b" }}>
                      / flat fee
                    </span>
                  </div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#ff5c35", marginTop: 2 }}>
                    🔥 100% 'Find $25K Or Free' Guarantee
                  </div>
                </div>

                <div style={{ fontSize: "10px", fontWeight: 800, color: "#092124", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  AUDIT DELIVERABLES:
                </div>
                
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5.5, fontSize: "11px", color: "#334155" }}>
                  {[
                    { bold: "50 Active Deals Scored", text: "full 7–vector deterministic breakdown" },
                    { bold: "CFO Ghosting Detection", text: "identifies unengaged economic buyers" },
                    { bold: "Executive PDF Dossier", text: "board-ready deal triage briefing" },
                    { bold: "10–Min Loom Strategic Review", text: "senior architect strategic review" },
                    { bold: "48–Hour SLA Turnaround", text: "guaranteed fast audit delivery" },
                    { bold: "Find $25K Or It's Free", text: "100% no-risk money-back guarantee" },
                  ].map((item, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 6, lineHeight: 1.3 }}>
                      <div style={{ width: 13, height: 13, borderRadius: "50%", background: "rgba(255, 92, 53, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="#ff5c35" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <strong style={{ color: "#092124" }}>{item.bold}</strong> <span style={{ color: "#64748b" }}>({item.text})</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginTop: 12 }}>
                <div style={{ background: "rgba(255, 92, 53, 0.08)", border: "1px solid rgba(255, 92, 53, 0.2)", borderRadius: "7px", padding: "4px 6px", fontSize: "10px", color: "#e04a25", fontWeight: 800, textAlign: "center", marginBottom: 8 }}>
                  🎯 Test-drive DealSense on 1 client portal
                </div>
                <button
                  onClick={() => openOrder("audit-99")}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 800,
                    fontFamily: "'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif",
                    letterSpacing: "-0.01em",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(255, 92, 53, 0.35)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>Start $99 Risk Audit</span>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tier 2: Agency Growth Fleet ($499/mo) */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e2e8f0",
                borderRadius: "16px",
                padding: "18px 16px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 16px rgba(9, 33, 36, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: "10px", fontWeight: 800, color: "#00a4bd", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    TIER 2 · BOUTIQUE AGENCIES
                  </span>
                  <span style={{ fontSize: "9.5px", fontWeight: 800, color: "#00a4bd", background: "rgba(0, 164, 189, 0.1)", border: "1px solid rgba(0, 164, 189, 0.25)", padding: "1px 6px", borderRadius: "9999px" }}>
                    UP TO 5 PORTALS
                  </span>
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 900, color: "#092124", margin: "0 0 4px", letterSpacing: "-0.02em", fontFamily: "'Outfit', sans-serif" }}>
                  Agency Growth Fleet
                </h3>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px", lineHeight: 1.4 }}>
                  For boutique RevOps consultancies managing up to 5 client HubSpot portals.
                </p>
                
                <div style={{ background: "rgba(0, 164, 189, 0.05)", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(0, 164, 189, 0.2)", marginBottom: 12 }}>
                  <div style={{ fontSize: "10.5px", color: "#94a3b8", fontWeight: 700 }}>
                    {isAnnual ? "Billed Annually ($4,788/yr)" : "Billed Monthly"}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 1 }}>
                    <span style={{ fontSize: "30px", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                      ${isAnnual ? "399" : "499"}
                    </span>
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#64748b" }}>
                      / month
                    </span>
                  </div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#00a4bd", marginTop: 2 }}>
                    ✨ Unlimited Sales Rep Seats Included
                  </div>
                </div>

                <div style={{ fontSize: "10px", fontWeight: 800, color: "#092124", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  FLEET DELIVERABLES:
                </div>
                
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5.5, fontSize: "11px", color: "#334155" }}>
                  {[
                    { bold: "Manage up to 5 Client Portals", text: "multi-client workspace switcher" },
                    { bold: "7-Vector Deterministic Engine", text: "sub-200ms real-time event pipeline" },
                    { bold: "HubSpot Canvas Extension", text: "lives native inside client deal records" },
                    { bold: "1-Click Executive Briefs", text: "exportable PDF pipeline risk briefs" },
                    { bold: "Standard Partner Support", text: "Slack & email support with RevOps team" },
                    { bold: "Zero Per-Seat Markups", text: "transparent flat fee for all client reps" },
                  ].map((item, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 6, lineHeight: 1.3 }}>
                      <div style={{ width: 13, height: 13, borderRadius: "50%", background: "rgba(0, 164, 189, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="#00a4bd" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <strong style={{ color: "#092124" }}>{item.bold}</strong> <span style={{ color: "#64748b" }}>({item.text})</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginTop: 12 }}>
                <div style={{ background: "rgba(0, 164, 189, 0.08)", border: "1px solid rgba(0, 164, 189, 0.2)", borderRadius: "7px", padding: "4px 6px", fontSize: "10px", color: "#008a9e", fontWeight: 800, textAlign: "center", marginBottom: 8 }}>
                  💡 Bill 5 clients $2,500/mo = $150,000 ARR
                </div>
                <button
                  onClick={() => openOrder("growth-499")}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "#124548",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 800,
                    fontFamily: "'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif",
                    letterSpacing: "-0.01em",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(18, 69, 72, 0.25)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>Deploy Growth Fleet</span>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tier 3: Agency Pro Fleet ($999/mo) — FEATURED / MOST POPULAR */}
            <div
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #fff7f4 100%)",
                border: "2px solid #ff5c35",
                borderRadius: "16px",
                padding: "18px 16px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                boxShadow: "0 14px 36px -6px rgba(255, 92, 53, 0.22), 0 4px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255, 255, 255, 1)",
                transform: "scale(1.02)",
                zIndex: 2,
              }}
            >
              {/* Floating Crown Badge */}
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)",
                  color: "#ffffff",
                  padding: "3px 12px",
                  borderRadius: "9999px",
                  fontSize: "9.5px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  boxShadow: "0 4px 12px rgba(255, 92, 53, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  whiteSpace: "nowrap",
                }}
              >
                <span>👑</span>
                <span>MOST POPULAR · HUBSPOT PARTNERS</span>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, marginTop: 2 }}>
                  <span style={{ fontSize: "10px", fontWeight: 800, color: "#ff5c35", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    TIER 3 · SCALING FLEET
                  </span>
                  <span style={{ fontSize: "9.5px", fontWeight: 800, color: "#ff5c35", background: "rgba(255,92,53,0.12)", border: "1px solid rgba(255,92,53,0.3)", padding: "1px 6px", borderRadius: "9999px" }}>
                    UP TO 15 PORTALS
                  </span>
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 900, color: "#092124", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                  Agency Pro Fleet
                </h3>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px", lineHeight: 1.4 }}>
                  For scaling HubSpot partners managing up to 15 client portals with custom domain.
                </p>
                
                <div style={{ background: "rgba(255, 92, 53, 0.06)", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(255, 92, 53, 0.25)", marginBottom: 12 }}>
                  <div style={{ fontSize: "10.5px", color: "#94a3b8", fontWeight: 700 }}>
                    {isAnnual ? "Billed Annually ($9,588/yr)" : "Billed Monthly"}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 1 }}>
                    <span style={{ fontSize: "30px", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                      ${isAnnual ? "799" : "999"}
                    </span>
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#64748b" }}>
                      / month
                    </span>
                  </div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#ff5c35", marginTop: 2 }}>
                    🔥 Solutions Partner Fleet · Co-Branded Domain
                  </div>
                </div>

                <div style={{ fontSize: "10px", fontWeight: 800, color: "#092124", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  Complete Fleet Arsenal:
                </div>
                
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5.5, fontSize: "11px", color: "#092124" }}>
                  {[
                    { bold: "Manage up to 15 Client Portals", text: "master switcher cockpit" },
                    { bold: "Co-Branded Client Portals", text: "revops.youragency.com + custom logo" },
                    { bold: "Embedded HubSpot Canvas Card", text: "lives native inside client CRM records" },
                    { bold: "Sub-200ms Webhook Stream", text: "Redis Streams real-time event engine" },
                    { bold: "1-Click Executive QBR Dossier", text: "automated board-ready PDF briefing" },
                    { bold: "Client Acquisition Toolkit", text: "diagnostic proposals & pitch decks" },
                    { bold: "Priority Partner Slack SLA", text: "2-hour direct team response" },
                  ].map((item, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 6, lineHeight: 1.3 }}>
                      <div style={{ width: 13, height: 13, borderRadius: "50%", background: "rgba(255, 92, 53, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="#ff5c35" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
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
              
              <div style={{ marginTop: 12 }}>
                <div style={{ background: "rgba(255, 92, 53, 0.1)", border: "1px solid rgba(255, 92, 53, 0.25)", borderRadius: "7px", padding: "4px 6px", fontSize: "10px", color: "#e04a25", fontWeight: 800, textAlign: "center", marginBottom: 8 }}>
                  🔥 Bill 10 clients $2,500/mo = $300,000/yr ARR (25x ROI)
                </div>
                <button
                  onClick={() => openOrder("scale-999")}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 800,
                    fontFamily: "'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif",
                    letterSpacing: "-0.01em",
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(255, 92, 53, 0.4)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>Deploy Agency Pro Fleet</span>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tier 4: Enterprise Solutions Fleet ($2,499/mo) */}
            <div
              style={{
                background: "linear-gradient(180deg, #092124 0%, #0d2c30 100%)",
                border: "1.5px solid rgba(52, 211, 153, 0.4)",
                borderRadius: "16px",
                padding: "18px 16px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "#ffffff",
                boxShadow: "0 14px 36px -6px rgba(9, 33, 36, 0.5), 0 0 20px rgba(18, 69, 72, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                position: "relative",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: "10px", fontWeight: 800, color: "#34d399", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    TIER 4 · ELITE & GLOBAL
                  </span>
                  <span style={{ fontSize: "9.5px", fontWeight: 800, color: "#34d399", background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.35)", padding: "1px 6px", borderRadius: "9999px" }}>
                    UNLIMITED
                  </span>
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 900, color: "#ffffff", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                  Enterprise Fleet
                </h3>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 10px", lineHeight: 1.4 }}>
                  For Elite HubSpot partners and global RevOps consultancies with private cloud VPC.
                </p>
                
                <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.12)", marginBottom: 12 }}>
                  <div style={{ fontSize: "10.5px", color: "#94a3b8", fontWeight: 700 }}>
                    {isAnnual ? "Billed Annually ($23,988/yr)" : "Billed Monthly"}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 1 }}>
                    <span style={{ fontSize: "30px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                      ${isAnnual ? "1,999" : "2,499"}
                    </span>
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#94a3b8" }}>
                      / month
                    </span>
                  </div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#34d399", marginTop: 2 }}>
                    💎 Unlimited Portals & Private Cloud VPC
                  </div>
                </div>

                <div style={{ fontSize: "10px", fontWeight: 800, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  Enterprise Fleet Deliverables:
                </div>
                
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5.5, fontSize: "11px", color: "#f1f5f9" }}>
                  {[
                    { bold: "UNLIMITED Multi-Tenant Portals", text: "zero client or volume caps" },
                    { bold: "Dedicated Database & VPC Options", text: "AWS, GCP, DigitalOcean, or On-Prem" },
                    { bold: "Row-Level Security (RLS)", text: "strict tenant isolation partition engine" },
                    { bold: "Custom Workflow Action Code", text: "bespoke 14s watchdog code actions" },
                    { bold: "Bi-Weekly Strategy War Rooms", text: "direct sessions with senior RevOps architect" },
                    { bold: "Direct 1-Hour Priority SLA", text: "private dedicated engineer access" },
                  ].map((item, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 6, lineHeight: 1.3 }}>
                      <div style={{ width: 13, height: 13, borderRadius: "50%", background: "rgba(52, 211, 153, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
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
              
              <div style={{ marginTop: 12 }}>
                <div style={{ background: "rgba(52, 211, 153, 0.1)", border: "1px solid rgba(52, 211, 153, 0.25)", borderRadius: "7px", padding: "4px 6px", fontSize: "10px", color: "#34d399", fontWeight: 800, textAlign: "center", marginBottom: 8 }}>
                  💎 Unlimited Scale: Build a $500K+ ARR RevOps Practice
                </div>
                <button
                  onClick={() => navigate("/app/enterprise")}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "#ffffff",
                    color: "#092124",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 800,
                    fontFamily: "'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif",
                    letterSpacing: "-0.01em",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 #ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>Deploy Enterprise Fleet</span>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#092124" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7.5. Custom AI HubSpot App Engineering Banner ───────────────── */}
      <section style={{ padding: "0 clamp(16px, 4vw, 24px) 72px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #092124 0%, #0d2c30 50%, #124548 100%)",
              borderRadius: "24px",
              padding: "clamp(32px, 5vw, 48px) clamp(24px, 5vw, 48px)",
              border: "1px solid rgba(255, 92, 53, 0.3)",
              boxShadow: "0 24px 60px -12px rgba(9, 33, 36, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 36,
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
                  marginBottom: 16,
                  fontSize: "11.5px",
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
                  fontSize: "clamp(26px, 3.8vw, 36px)",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.18,
                  margin: "0 0 14px",
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                }}
              >
                Need Your Custom <span style={{ background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI HubSpot App</span>?
              </h3>

              <p style={{ fontSize: "15px", color: "#cbd5e1", lineHeight: 1.6, margin: "0 0 20px", maxWidth: 540 }}>
                Want a custom HubSpot CRM Canvas card, bespoke Redis event pipeline, fine-tuned LLM deal coach, or dedicated private cloud deployment? Our senior architects build, test, and hand over 100% full source code in <strong>5–10 business days</strong>.
              </p>

              {/* 4 Quick Deliverable Badges */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: 10 }}>
                {[
                  { icon: "⏱️", text: "5–10 Day Rapid Sprint" },
                  { icon: "💎", text: "100% Code Ownership" },
                  { icon: "🛡️", text: "HubSpot Canvas Certified" },
                  { icon: "🔒", text: "Zero Per-Seat Fees" },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", fontWeight: 700, color: "#f1f5f9" }}>
                    <span style={{ fontSize: "14px" }}>{item.icon}</span>
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
                padding: "28px 24px",
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* Discount Tag Lockup */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#34d399", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  CUSTOM ENTERPRISE SPRINT
                </span>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#34d399", background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.35)", padding: "3px 9px", borderRadius: "9999px" }}>
                  70% DISCOUNT
                </span>
              </div>

              {/* Price Strikethrough vs Flat Fee */}
              <div style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "line-through", fontWeight: 700, marginBottom: 2 }}>
                Standard Custom Dev: $5,000+
              </div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: "38px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                  $1,500
                </span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>
                  / flat one-time
                </span>
              </div>
              
              <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#ff8c6b", marginBottom: 18 }}>
                ⚡ Guaranteed 5–10 Business Day Turnaround · 100% IP Handover
              </div>

              <button
                onClick={() => openOrder("custom-app")}
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
                <span>Book Custom AI Sprint ($1,500)</span>
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

      {/* ── 8. Guarantee & Direct Architect Access ───────────────────────── */}
      <section style={{ padding: "80px clamp(16px, 4vw, 24px)", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center" }}>
          {/* Top Guarantee Pill Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.12) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              padding: "5px 16px",
              borderRadius: "9999px",
              marginBottom: 18,
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.08)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 8px #10b981" }} />
            <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#065f46", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              🛡️ 100% Risk-Free Performance Guarantee
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 36px)",
              fontWeight: 900,
              color: "#092124",
              letterSpacing: "-0.03em",
              margin: "0 0 14px",
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            }}
          >
            The "Find $25K Or It’s Free" Agency Partner Guarantee
          </h2>
          
          <p style={{ fontSize: "clamp(15px, 2vw, 16.5px)", color: "#475569", lineHeight: 1.65, maxWidth: 680, margin: "0 auto 32px" }}>
            If DealSense’s 7-vector scoring engine does not uncover at least <strong>$25,000 in at-risk pipeline slippage or hidden buyer ghosting</strong> on your first client audit, you receive an immediate, no-questions-asked <strong>100% full refund</strong>.
          </p>

          {/* Centered Direct Lead Architect Card with 3 High-Impact Actions */}
          <div
            style={{
              background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: "0 6px 24px -6px rgba(9, 33, 36, 0.08), inset 0 1px 0 #ffffff",
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            {/* Avatar Lockup with Glowing Luxury Halo & Live Status */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #092124 0%, #124548 100%)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "20px",
                    boxShadow: "0 0 0 3px #ffffff, 0 0 0 6px rgba(255, 92, 53, 0.3), 0 8px 24px rgba(9, 33, 36, 0.25)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  PR
                </div>
                {/* Live Online Status Dot */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#10b981",
                    border: "2.5px solid #ffffff",
                    boxShadow: "0 0 10px rgba(16, 185, 129, 0.9)",
                  }}
                  title="Lead Architect Online"
                />
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ fontSize: "18px", fontWeight: 900, color: "#092124", letterSpacing: "-0.02em", fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
                    Peash Das Rudra
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 800, color: "#065f46", background: "#d1fae5", border: "1px solid #a7f3d0", padding: "1px 7px", borderRadius: "9999px" }}>
                    CREATOR
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: 3 }}>
                  Lead AI Architect · HubAiLab (Creator & Monorepo Author)
                </div>
              </div>
            </div>

            {/* Action Buttons: 2 Icons Above + Full Book 1-on-1 Call Below */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 360 }}>
              {/* Top Row: 3 Icon-Only Buttons (Mail, LinkedIn, GitHub) */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                {/* 1. Mail Icon Button */}
                <a
                  href="mailto:peashdasrudra@gmail.com"
                  title="Send Direct Email to peashdasrudra@gmail.com"
                  style={{
                    width: 44,
                    height: 44,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#ffffff",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "12px",
                    color: "#ff5c35",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04), inset 0 1px 0 #ffffff",
                    transition: "all 0.2s ease",
                  }}
                >
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#ff5c35" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>

                {/* 2. LinkedIn Icon Button */}
                <a
                  href="https://www.linkedin.com/in/peashdasrudra"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Connect on LinkedIn"
                  style={{
                    width: 44,
                    height: 44,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(10, 102, 194, 0.08)",
                    border: "1.5px solid rgba(10, 102, 194, 0.3)",
                    borderRadius: "12px",
                    color: "#0a66c2",
                    boxShadow: "0 2px 6px rgba(10, 102, 194, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.89 0-1.61.72-1.61 1.61s.72 1.61 1.61 1.61 1.61-.72 1.61-1.61-.72-1.61-1.61-1.61Z" />
                  </svg>
                </a>

                {/* 3. GitHub Icon Button */}
                <a
                  href="https://github.com/peashdasrudra"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View GitHub Monorepo & Codebase"
                  style={{
                    width: 44,
                    height: 44,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(15, 23, 42, 0.06)",
                    border: "1.5px solid rgba(15, 23, 42, 0.2)",
                    borderRadius: "12px",
                    color: "#0f172a",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>

              {/* Bottom Row: Book 1-on-1 Call Button */}
              <button
                onClick={() => openOrder("agency-1500")}
                style={{
                  width: "100%",
                  padding: "13px 24px",
                  background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "14.5px",
                  fontWeight: 800,
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  letterSpacing: "-0.015em",
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(255, 92, 53, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Book 1-on-1 Call</span>
                <span style={{ fontSize: "14px" }}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8.5. Agency Partner Interactive FAQ Accordion ───────────────── */}
      <section id="faq" style={{ padding: "84px clamp(16px, 4vw, 24px)", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(18, 69, 72, 0.08)",
                border: "1px solid rgba(18, 69, 72, 0.25)",
                padding: "4px 14px",
                borderRadius: "9999px",
                marginBottom: 14,
                fontSize: "11px",
                fontWeight: 800,
                color: "#124548",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              <span>❓ AGENCY PARTNER FAQ</span>
            </div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em", margin: "0 0 12px", fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: "16px", color: "#64748b", margin: 0 }}>
              Click any question below to see detailed answers for HubSpot Solutions Partners.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                q: "Do my clients ever see 'DealSense' or know it's a 3rd party tool?",
                a: "Co-branded on your custom domain (revops.youragency.com) with your agency branding, logo, and embedded HubSpot CRM card as an authorized Solutions Partner delivery.",
              },
              {
                q: "How does fleet pricing work without per-seat charges?",
                a: "Unlike legacy platforms that charge $1,200+/rep/year for every sales rep, DealSense offers predictable fleet subscriptions with unlimited viewer and sales rep seats. You charge clients $2,500–$5,000/mo and keep 95%+ profit margins.",
              },
              {
                q: "How long does it take to onboard a client portal?",
                a: "Under 2 minutes. Client authorizes read-only HubSpot OAuth. DealSense syncs and scores all deals in sub-200ms with zero manual configuration.",
              },
              {
                q: "How does the 'Find $25K Or It's Free' guarantee work?",
                a: "Instant 100% refund. If your first client audit doesn't uncover at least $25,000 in at-risk pipeline slippage, we refund your payment immediately.",
              },
              {
                q: "Can we customize scoring algorithms per industry vertical?",
                a: "Yes, fully configurable. Tailor 7 deterministic risk weights (velocity decay, buyer engagement, MEDDICC) for SaaS, Services, Healthcare, or Manufacturing clients.",
              },
              {
                q: "Can we deploy DealSense in our own private cloud?",
                a: "Yes. Enterprise Fleet subscribers receive private cloud deployment options (AWS, GCP, DigitalOcean, or on-prem) with dedicated database isolation and Row-Level Security (RLS).",
              },
            ].map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: "#ffffff",
                    border: isOpen ? "1.5px solid #ff5c35" : "1px solid #e2e8f0",
                    borderRadius: "14px",
                    boxShadow: isOpen ? "0 8px 24px -4px rgba(255, 92, 53, 0.12)" : "0 2px 6px rgba(9, 33, 36, 0.03)",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: "100%",
                      padding: "18px 22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "15.5px",
                        fontWeight: 800,
                        color: isOpen ? "#ff5c35" : "#092124",
                        margin: 0,
                        letterSpacing: "-0.015em",
                        fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {item.q}
                    </h4>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "8px",
                        background: isOpen ? "rgba(255, 92, 53, 0.12)" : "rgba(15, 23, 42, 0.04)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isOpen ? "#ff5c35" : "#64748b",
                        flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div style={{ padding: "0 22px 20px", borderTop: "1px solid rgba(226, 232, 240, 0.6)" }}>
                          <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.65, margin: "12px 0 0" }}>
                            {item.a}
                          </p>
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

      {/* ── 9. Order & Checkout Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {orderModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(9, 33, 36, 0.75)",
              backdropFilter: "blur(10px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                maxWidth: 480,
                width: "100%",
                padding: "36px 32px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
                position: "relative",
              }}
            >
              <button
                onClick={() => setOrderModalOpen(false)}
                style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>

              {orderSuccess ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: "48px", marginBottom: 12 }}>🎉</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#092124", margin: "0 0 8px" }}>
                    Agency License Request Received!
                  </h3>
                  <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.55 }}>
                    Thank you, <strong>{agencyName || "Partner"}</strong>. Senior Architect Peash Das Rudra will email you at <strong>{email}</strong> within 2 hours with direct repository access and your client portal onboarding link.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit}>
                  <div style={{ display: "inline-block", background: "rgba(255,92,53,0.1)", color: "#ff5c35", fontSize: "11px", fontWeight: 800, padding: "4px 12px", borderRadius: "9999px", marginBottom: 12, letterSpacing: "0.04em" }}>
                    {selectedTier === "audit-99" ? "TIER 1 · $99 PILOT RISK AUDIT (50 DEALS)" : selectedTier === "growth-499" ? "TIER 2 · $499/MO AGENCY GROWTH FLEET (5 PORTALS)" : selectedTier === "scale-999" ? "TIER 3 · $999/MO AGENCY PRO FLEET (15 PORTALS)" : "TIER 4 · $2,499/MO ENTERPRISE SOLUTIONS FLEET (UNLIMITED)"}
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#092124", margin: "0 0 6px" }}>
                    Lock In Your Solutions Partner Fleet
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "#64748b", margin: "0 0 22px", lineHeight: 1.5 }}>
                    Immediate onboarding, co-branded portal setup, and zero per-seat user markups.
                  </p>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                      Agency / Company Name:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex RevOps Partners"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                    />
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                      Decision Maker Work Email:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="founder@youragency.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: 800,
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(255,92,53,0.35)",
                    }}
                  >
                    Confirm & Start Partner Onboarding →
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};
