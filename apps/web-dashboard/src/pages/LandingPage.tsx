/**
 * DealSense — Official HubSpot-Native Public SaaS Landing Page.
 * Designed to match HubSpot's actual enterprise marketing homepage aesthetics.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DealSenseIcon } from "../components/DealSenseLogo";
import { Footer } from "../components/Footer";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const PLATFORM_TABS = [
    {
      id: "scoring",
      title: "Deterministic Deal Scoring",
      tagline: "0–100 Explainable Risk Models",
      desc: "Scores every HubSpot deal across 7 deterministic risk signals within 180ms of webhook ingestion. Zero hallucinated probabilities.",
      color: "#ff5c35",
      badge: "Sub-200ms Ingestion",
      stats: ["7 Risk Evaluators", "0% LLM Hallucinations", "180ms Latency"],
    },
    {
      id: "forecast",
      title: "Multi-Model Forecasting",
      tagline: "Rep Commit vs. AI Reality",
      desc: "Simulates revenue outcomes through Monte Carlo distribution. Uncover hidden manager padding and pipeline slippage before board reviews.",
      color: "#00a4bd",
      badge: "Monte Carlo Engine",
      stats: ["Commit vs Reality", "±$45K Confidence", "Historical Win Vector"],
    },
    {
      id: "warroom",
      title: "Executive Deal War Room",
      tagline: "QBR Decision Matrix & Interventions",
      desc: "High-stakes closing matrix for stalled enterprise deals. Trigger peer-to-peer executive outreach and export board briefings in 1 click.",
      color: "#124548",
      badge: "Executive QBR Ready",
      stats: ["Single-Thread Alert", "DocuSign Ready", "Instant Brief Export"],
    },
    {
      id: "hygiene",
      title: "Autonomous CRM Hygiene",
      tagline: "1-Click Batch Data Remediation",
      desc: "Automatically identifies ghost deals, past-due close dates, and missing next steps with 1-click writeback to HubSpot CRM.",
      color: "#10b981",
      badge: "Bi-directional Sync",
      stats: ["Ghost Deal Ingestion", "Auto Date Push", "Slack Rep Alerts"],
    },
  ];

  const HUBS = [
    {
      icon: "🎯",
      title: "Deal Scoring Hub",
      desc: "Deterministic 0–100 health scoring with transparent signal telemetry for every pipeline opportunity.",
      path: "/deals",
    },
    {
      icon: "📈",
      title: "Revenue Forecast Hub",
      desc: "Stage-weighted and Monte Carlo forecast models that give RevOps leaders realistic quarter predictions.",
      path: "/forecast",
    },
    {
      icon: "🌊",
      title: "Pipeline Waterfall Hub",
      desc: "Track pipeline velocity, newly created inflow, expansion, slippage, and lost deal momentum.",
      path: "/waterfall",
    },
    {
      icon: "⚔️",
      title: "Deal War Room Hub",
      desc: "Executive command matrix for Friday pipeline reviews and unblocking high-ticket stalled deals.",
      path: "/war-room",
    },
    {
      icon: "⚡",
      title: "CRM Hygiene Hub",
      desc: "Automated writebacks and remediation for overdue dates, single-threading, and stale activities.",
      path: "/hygiene",
    },
    {
      icon: "🤝",
      title: "Stakeholder Matrix Hub",
      desc: "Power matrix visualizing Economic Buyers, Champions, and single-threaded vulnerability.",
      path: "/stakeholders",
    },
  ];

  const AI_AGENTS = [
    {
      title: "Pipeline Triage Agent",
      role: "Autonomous Deal Scrutiny",
      status: "Active 24/7",
      desc: "Monitors all incoming HubSpot webhooks. Detects when economic buyers go silent for 14+ days and flags critical slippage.",
      metric: "180ms latency",
    },
    {
      title: "Executive QBR Agent",
      role: "Board Briefing Synthesis",
      status: "Active 24/7",
      desc: "Synthesizes pipeline telemetry, stakeholder gaps, and MEDDICC evidence into board-ready executive briefings in 1 click.",
      metric: "1-Click Export",
    },
    {
      title: "CRM Remediation Agent",
      role: "Autonomous Writebacks",
      status: "Active 24/7",
      desc: "Automatically calculates updated close dates, assigns rep Slack tasks, and writes clean metadata directly back to HubSpot.",
      metric: "100% Audit Logged",
    },
  ];

  return (
    <div style={{ background: "#ffffff", color: "var(--hs-text)", fontFamily: "var(--font-sans)", overflowX: "hidden" }}>
      {/* ── 1. Top Global Navigation Header ──────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--hs-border-dark)",
          zIndex: 1000,
          padding: "12px 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Brand Logo */}
          <div
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}
            title="DealSense Home"
          >
            <DealSenseIcon size={30} />
            <span style={{ fontSize: "19px", fontWeight: 800, color: "var(--hs-primary)", letterSpacing: "-0.03em" }}>
              Deal<span style={{ color: "#ff5c35" }}>Sense</span>
            </span>
          </div>

          {/* Nav Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="desktop-nav-links">
            <span onClick={() => navigate("/")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-heading)", cursor: "pointer" }}>Platform</span>
            <span onClick={() => navigate("/forecast")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-text)", cursor: "pointer" }}>Forecasting</span>
            <span onClick={() => navigate("/war-room")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-text)", cursor: "pointer" }}>War Room</span>
            <span onClick={() => navigate("/case-study")} style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--hs-text)", cursor: "pointer" }}>Case Study</span>
          </div>

          {/* CTA Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => navigate("/case-study")}
              style={{
                padding: "8px 16px",
                background: "#ffffff",
                color: "var(--hs-text)",
                fontSize: "13px",
                fontWeight: 600,
                border: "1px solid var(--hs-border-dark)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              $99 Pilot Audit
            </button>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "8px 18px",
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
              }}
            >
              <span>Launch App</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. Hero Section ("Where go-to-market teams go to scale") ─── */}
      <section
        style={{
          position: "relative",
          padding: "clamp(56px, 8vw, 96px) 24px clamp(48px, 6vw, 80px)",
          background: "linear-gradient(180deg, #fdf8f6 0%, #ffffff 100%)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Subtle Ambient Radial Glow */}
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

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255, 92, 53, 0.08)", border: "1px solid rgba(255, 92, 53, 0.25)", padding: "5px 14px 5px 10px", borderRadius: "var(--radius-pill)", marginBottom: 20 }}
          >
            <DealSenseIcon size={18} />
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#ff5c35", letterSpacing: "0.02em" }}>
              HUBSPOT-NATIVE REVENUE PLATFORM
            </span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(34px, 5.5vw, 62px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "var(--hs-heading)",
              margin: "0 0 20px",
            }}
          >
            Where go-to-market <br /> teams go to <span style={{ color: "#ff5c35" }}>scale</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "clamp(15px, 2vw, 18.5px)",
              color: "var(--hs-text-muted)",
              lineHeight: 1.6,
              maxWidth: 680,
              margin: "0 auto 36px",
            }}
          >
            DealSense is the autonomous HubSpot revenue intelligence engine that scores every deal in real-time, stops quarterly pipeline leaks, and runs deterministic RevOps with zero LLM hallucinations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, flexWrap: "wrap" }}
          >
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "14px 32px",
                background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1), 0 6px 20px rgba(255, 92, 53, 0.4), inset 0 1px 0 rgba(255,255,255,0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s ease",
              }}
            >
              <span>Launch Live Dashboard</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigate("/case-study")}
              style={{
                padding: "14px 26px",
                background: "#ffffff",
                color: "var(--hs-heading)",
                fontSize: "14.5px",
                fontWeight: 700,
                border: "1px solid var(--hs-border-dark)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s ease",
              }}
            >
              View Case Study & ROI
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Logo Trust Bar ────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--hs-border-dark)", borderBottom: "1px solid var(--hs-border-dark)", padding: "24px 20px", background: "var(--hs-surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hs-text-muted)", marginBottom: 14 }}>
            TRUSTED BY REVENUE & REVOPS LEADERS SCALING MILLION-DOLLAR PIPELINES
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "28px 40px", flexWrap: "wrap", opacity: 0.85 }}>
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

      {/* ── 4. Platform Showcase ("A CRM that's really smart") ───────── */}
      <section style={{ padding: "80px 24px", maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
            DEALSENSE REVENUE PLATFORM
          </span>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--hs-heading)", margin: "8px 0 12px" }}>
            A pipeline that's really smart.
          </h2>
          <p style={{ fontSize: "15px", color: "var(--hs-text-muted)", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
            Deterministic deal health telemetry, multi-model Monte Carlo forecasting, and automated 1-click writebacks to HubSpot.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {PLATFORM_TABS.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              style={{
                padding: "10px 18px",
                borderRadius: "var(--radius-pill)",
                fontSize: "13px",
                fontWeight: activeTab === idx ? 700 : 600,
                border: activeTab === idx ? `2px solid ${tab.color}` : "1px solid var(--hs-border-dark)",
                background: activeTab === idx ? "#ffffff" : "var(--hs-surface)",
                color: activeTab === idx ? "var(--hs-heading)" : "var(--hs-text-muted)",
                cursor: "pointer",
                boxShadow: activeTab === idx ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Active Tab Card Preview */}
        <div
          className="card"
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-lg)",
            padding: "36px 32px",
            border: "1px solid var(--hs-border-dark)",
            borderTop: `4px solid ${PLATFORM_TABS[activeTab].color}`,
            boxShadow: "var(--shadow-md)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "36px",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", background: "rgba(255, 92, 53, 0.1)", color: PLATFORM_TABS[activeTab].color, padding: "4px 10px", borderRadius: "var(--radius-pill)" }}>
              {PLATFORM_TABS[activeTab].badge}
            </span>
            <h3 style={{ fontSize: "24px", fontWeight: 800, color: "var(--hs-heading)", margin: "14px 0 8px" }}>
              {PLATFORM_TABS[activeTab].tagline}
            </h3>
            <p style={{ fontSize: "14px", color: "var(--hs-text-muted)", lineHeight: 1.6, marginBottom: 24 }}>
              {PLATFORM_TABS[activeTab].desc}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {PLATFORM_TABS[activeTab].stats.map((stat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", fontWeight: 600 }}>
                  <span style={{ color: "#10b981", fontWeight: 800 }}>✓</span>
                  <span>{stat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "10px 20px",
                background: "var(--hs-primary)",
                color: "#fff",
                fontSize: "13.5px",
                fontWeight: 700,
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              Explore In Live App →
            </button>
          </div>

          {/* Visual Simulation Display */}
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
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-heading)" }}>Telemetry Node Output</span>
              <span style={{ fontSize: "11px", color: "var(--risk-healthy)", fontWeight: 700 }}>● 180ms Latency</span>
            </div>
            <div style={{ padding: "16px", background: "#ffffff", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
              <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginBottom: 4 }}>Orion Cloud Migration · $150K</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--danger)" }}>Health Score: 23/100</span>
                <span style={{ fontSize: "11px", background: "var(--risk-critical-bg)", color: "var(--danger)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>Critical Risk</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--hs-text)", marginTop: 8, lineHeight: 1.4 }}>
                Key blocker: CFO silent for 18 days; single-threaded through VP Eng.
              </div>
            </div>
            <div style={{ padding: "12px 16px", background: "rgba(0, 164, 189, 0.08)", border: "1px solid #00a4bd", borderRadius: "var(--radius-sm)", fontSize: "12px", color: "var(--hs-primary)", fontWeight: 600 }}>
              ⚡ Action: Auto-triggered VP Sales peer-to-peer sequence with Forrester ROI report.
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Product Hubs Grid ("Growing revenue is hard...") ───────── */}
      <section style={{ padding: "80px 24px", background: "var(--hs-surface)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "48px", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
                ALL-IN-ONE REVOPS ENGINE
              </span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--hs-heading)", margin: "8px 0 16px" }}>
                Growing a pipeline is hard. DealSense makes it automatic.
              </h2>
              <p style={{ fontSize: "14px", color: "var(--hs-text-muted)", lineHeight: 1.6, marginBottom: 28 }}>
                Everything your revenue team needs to inspect stalled opportunities, run executive war rooms, and eliminate pipeline leakage in one unified HubSpot-native suite.
              </p>
              <button
                onClick={() => navigate("/")}
                style={{
                  padding: "12px 24px",
                  background: "#ff5c35",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(255, 92, 53, 0.3)",
                }}
              >
                Get Started Free →
              </button>
            </div>

            {/* 6 Hubs Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {HUBS.map((hub, i) => (
                <div
                  key={i}
                  onClick={() => navigate(hub.path)}
                  style={{
                    background: "#ffffff",
                    padding: "20px 22px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--hs-border-dark)",
                    boxShadow: "var(--shadow-sm)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div style={{ fontSize: "24px", marginBottom: 8 }}>{hub.icon}</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--hs-heading)", marginBottom: 6 }}>
                    {hub.title}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text-muted)", lineHeight: 1.5, marginBottom: 12 }}>
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

      {/* ── 6. Coral Glow: Built-in AI Agents ────────────────────────── */}
      <section
        style={{
          padding: "80px 24px",
          background: "linear-gradient(135deg, #fff1eb 0%, #fde2e4 50%, #fff1eb 100%)",
          borderTop: "1px solid #ffd5cc",
          borderBottom: "1px solid #ffd5cc",
        }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
              AUTONOMOUS REVENUE AGENTS
            </span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--hs-heading)", margin: "8px 0 12px" }}>
              Built-in AI agents that work for you 24/7.
            </h2>
            <p style={{ fontSize: "14.5px", color: "var(--hs-text-muted)", maxWidth: 620, margin: "0 auto", lineHeight: 1.6 }}>
              Autonomous RevOps agents that evaluate deal risk, draft executive QBR briefs, and trigger corrective workflows without human intervention.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {AI_AGENTS.map((agent, i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  borderRadius: "var(--radius-lg)",
                  padding: "28px 24px",
                  border: "1px solid rgba(255, 92, 53, 0.2)",
                  boxShadow: "0 8px 24px rgba(255, 92, 53, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#ff5c35", background: "rgba(255, 92, 53, 0.1)", padding: "3px 8px", borderRadius: "var(--radius-pill)" }}>
                      {agent.role}
                    </span>
                    <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700 }}>● {agent.status}</span>
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--hs-heading)", margin: "0 0 8px" }}>
                    {agent.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", lineHeight: 1.6, margin: 0 }}>
                    {agent.desc}
                  </p>
                </div>
                <div style={{ borderTop: "1px solid var(--hs-border-dark)", paddingTop: 14, marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--hs-text)" }}>
                  <span style={{ fontWeight: 600 }}>Performance:</span>
                  <span style={{ fontWeight: 700, color: "#ff5c35" }}>{agent.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Integrations Stack ────────────────────────────────────── */}
      <section style={{ padding: "64px 24px", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--hs-heading)", marginBottom: 8 }}>
          Works with your entire revenue stack.
        </h3>
        <p style={{ fontSize: "13.5px", color: "var(--hs-text-muted)", marginBottom: 28 }}>
          Native 1-click OAuth integration with HubSpot CRM, Slack alerts, PostgreSQL, and Redis event streams.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px 24px", flexWrap: "wrap", fontSize: "13px", fontWeight: 700, color: "var(--hs-primary)" }}>
          <span style={{ padding: "8px 16px", background: "var(--hs-surface)", borderRadius: "var(--radius-pill)", border: "1px solid var(--hs-border-dark)" }}>🟠 HubSpot CRM</span>
          <span style={{ padding: "8px 16px", background: "var(--hs-surface)", borderRadius: "var(--radius-pill)", border: "1px solid var(--hs-border-dark)" }}>💬 Slack Webhooks</span>
          <span style={{ padding: "8px 16px", background: "var(--hs-surface)", borderRadius: "var(--radius-pill)", border: "1px solid var(--hs-border-dark)" }}>🐘 PostgreSQL + pgvector</span>
          <span style={{ padding: "8px 16px", background: "var(--hs-surface)", borderRadius: "var(--radius-pill)", border: "1px solid var(--hs-border-dark)" }}>⚡ Redis Streams</span>
          <span style={{ padding: "8px 16px", background: "var(--hs-surface)", borderRadius: "var(--radius-pill)", border: "1px solid var(--hs-border-dark)" }}>🔒 AES-256 GCM Security</span>
        </div>
      </section>

      {/* ── 8. Customer Success Story & Case Study ───────────────────── */}
      <section style={{ padding: "80px 24px", background: "var(--hs-surface)", borderTop: "1px solid var(--hs-border-dark)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: "#ffffff", borderRadius: "var(--radius-lg)", padding: "40px", border: "1px solid var(--hs-border-dark)", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "36px", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff5c35" }}>
                AGENCY & REVOPS CASE STUDY
              </span>
              <h3 style={{ fontSize: "24px", fontWeight: 800, color: "var(--hs-heading)", margin: "10px 0 14px" }}>
                "We caught $1.4M in stalled enterprise pipeline before the quarter closed."
              </h3>
              <p style={{ fontSize: "13.5px", color: "var(--hs-text-muted)", lineHeight: 1.6, margin: "0 0 20px" }}>
                DealSense helped our sales leadership team replace manual guesswork with deterministic 0–100 health scoring and instant CFO alignment interventions.
              </p>
              <div style={{ fontSize: "12px", color: "var(--hs-text)", fontWeight: 600 }}>
                — <strong>Marcus Vance</strong>, VP Revenue Operations
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "var(--hs-surface)", padding: "20px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--risk-healthy)" }}>+28%</div>
                <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 4 }}>Win Rate Increase</div>
              </div>
              <div style={{ background: "var(--hs-surface)", padding: "20px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#ff5c35" }}>$1.4M</div>
                <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 4 }}>Slippage Saved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Final High-Impact CTA Banner ──────────────────────────── */}
      <section style={{ padding: "80px 24px", background: "#ffffff" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(135deg, #124548 0%, #062b2e 100%)",
            padding: "clamp(36px, 6vw, 64px) clamp(24px, 5vw, 48px)",
            textAlign: "center",
            color: "#ffffff",
            boxShadow: "0 12px 36px rgba(18, 69, 72, 0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 92, 53, 0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

          <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 14px" }}>
            Make impossible pipeline growth feel impossibly easy.
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255, 255, 255, 0.85)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Deploy DealSense into your HubSpot portal in under 2 minutes. Score your entire pipeline, uncover hidden deal risks, and power predictive revenue decisions.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "14px 32px",
                background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(255, 92, 53, 0.45)",
              }}
            >
              Launch Dashboard Now →
            </button>
            <button
              onClick={() => navigate("/case-study")}
              style={{
                padding: "14px 26px",
                background: "#ffffff",
                color: "#124548",
                fontSize: "14.5px",
                fontWeight: 700,
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              Explore Agency Case Study
            </button>
          </div>
        </div>
      </section>

      {/* ── 10. Global SaaS Multi-Column Footer ──────────────────────── */}
      <Footer />
    </div>
  );
};
