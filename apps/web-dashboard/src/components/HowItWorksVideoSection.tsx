/**
 * DealSense — Interactive Live Flowing Video/GIF-Style "How It Works" Section.
 * 
 * Engineered for executive hook, visual superiority, and maximum conversion.
 * Features:
 * - 4-stage continuous video simulation loop with active progress scrubbers.
 * - Play / Pause, Stage Scrubbing, Speed Controls (1x, 1.5x, 2x).
 * - Interactive Sandbox Mode with live signal toggles, webhook simulator, and Monte Carlo engine.
 * - HubSpot-native enterprise design system & micro-animations.
 * - Dual-variant support ('landing' for sales leaders vs 'agency' for HubSpot partners).
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DealSenseIcon } from "./DealSenseLogo";

interface HowItWorksProps {
  variant?: "landing" | "agency";
}

interface StageMeta {
  id: number;
  title: string;
  badge: string;
  shortDesc: string;
  duration: number; // in seconds
}

const STAGES: StageMeta[] = [
  {
    id: 0,
    title: "1. Zero-Code Ingestion",
    badge: "2-MIN OAUTH & WEBHOOKS",
    shortDesc: "Sub-200ms Redis stream ingestion from HubSpot CRM",
    duration: 6,
  },
  {
    id: 1,
    title: "2. Deterministic Telemetry",
    badge: "7-VECTOR MATH ENGINE",
    shortDesc: "0% hallucination scoring across buyer engagement & velocity",
    duration: 7,
  },
  {
    id: 2,
    title: "3. Autonomous AI Agents",
    badge: "WAR ROOM & MONTE CARLO",
    shortDesc: "10,000-run simulation & executive QBR briefing synthesis",
    duration: 7,
  },
  {
    id: 3,
    title: "4. 2-Way HubSpot Writeback",
    badge: "EMBEDDED CANVAS RESCUE",
    shortDesc: "Instant CRM writeback, Slack alert, and protected revenue",
    duration: 6,
  },
];

export const HowItWorksVideoSection: React.FC<HowItWorksProps> = ({ variant = "landing" }) => {
  const navigate = useNavigate();

  // Playback State
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [stageProgress, setStageProgress] = useState<number>(0); // 0 to 100%
  const [interactiveMode, setInteractiveMode] = useState<boolean>(false);

  // Stage 1 Interactive State
  const [simulatedWebhookCount, setSimulatedWebhookCount] = useState<number>(1284);
  const [webhookPulsing, setWebhookPulsing] = useState<boolean>(false);
  const [recentWebhookLog, setRecentWebhookLog] = useState<string>("deal.propertyChange: Orion Cloud · amount: $180,000");

  // Stage 2 Interactive State (Telemetry Signals)
  const [buyerSilent, setBuyerSilent] = useState<boolean>(true);
  const [singleThreaded, setSingleThreaded] = useState<boolean>(true);
  const [datePushed, setDatePushed] = useState<boolean>(true);
  const [staleActivity, setStaleActivity] = useState<boolean>(false);

  // Stage 3 Interactive State (Monte Carlo Run)
  const [monteCarloRuns, setMonteCarloRuns] = useState<number>(10000);
  const [isSimulatingMonteCarlo, setIsSimulatingMonteCarlo] = useState<boolean>(false);

  // Stage 4 Interactive State (Writeback Trigger)
  const [writebackStatus, setWritebackStatus] = useState<"synced" | "syncing" | "verified">("synced");

  // Agency Fleet State
  const [selectedClientPortal, setSelectedClientPortal] = useState<string>("Acme Corp (Portal #84920)");

  // Calculate dynamic score for Stage 2
  const calculateScore = () => {
    let score = 94;
    if (buyerSilent) score -= 34;
    if (singleThreaded) score -= 22;
    if (datePushed) score -= 18;
    if (staleActivity) score -= 16;
    return Math.max(14, score);
  };
  const liveScore = calculateScore();

  // Autoplay progression loop
  useEffect(() => {
    if (!isPlaying || interactiveMode) return;

    const intervalMs = 50;
    const totalStageTimeMs = (STAGES[activeStage].duration * 1000) / playbackSpeed;
    const increment = (intervalMs / totalStageTimeMs) * 100;

    const timer = setInterval(() => {
      setStageProgress((prev) => {
        if (prev >= 100) {
          setActiveStage((currentStage) => (currentStage + 1) % STAGES.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, activeStage, playbackSpeed, interactiveMode]);

  const handleStageSelect = (index: number) => {
    setActiveStage(index);
    setStageProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleSimulateWebhook = () => {
    setWebhookPulsing(true);
    setSimulatedWebhookCount((c) => c + 1);
    const events = [
      "deal.propertyChange: close_date slipped +14d",
      "engagement.meeting: CFO absent from review",
      "deal.stageChange: moved to Negotiation",
      "email.received: Champion flagged budget push",
    ];
    setRecentWebhookLog(events[Math.floor(Math.random() * events.length)]);
    setTimeout(() => setWebhookPulsing(false), 800);
  };

  const handleRunMonteCarlo = () => {
    setIsSimulatingMonteCarlo(true);
    setTimeout(() => {
      setMonteCarloRuns((prev) => prev + 5000);
      setIsSimulatingMonteCarlo(false);
    }, 700);
  };

  const handleTriggerWriteback = () => {
    setWritebackStatus("syncing");
    setTimeout(() => {
      setWritebackStatus("verified");
      setTimeout(() => setWritebackStatus("synced"), 2500);
    }, 900);
  };

  // Format Elapsed Timecode (00:SS)
  const currentTotalSeconds = STAGES.slice(0, activeStage).reduce((acc, s) => acc + s.duration, 0) +
    Math.round((stageProgress / 100) * STAGES[activeStage].duration);
  const totalDuration = STAGES.reduce((acc, s) => acc + s.duration, 0);

  return (
    <section
      id="how-it-works"
      style={{
        padding: "clamp(56px, 7vw, 96px) clamp(14px, 3.5vw, 24px)",
        background: "linear-gradient(180deg, #faf6f4 0%, #ffffff 50%, #f8fafc 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Subtle Grid & Light Glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 1280,
          height: 600,
          background: "radial-gradient(circle at 50% 15%, rgba(255, 92, 53, 0.08) 0%, rgba(18, 69, 72, 0.04) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* ── Section Header ──────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255, 92, 53, 0.08)",
              border: "1px solid rgba(255, 92, 53, 0.25)",
              padding: "4px 14px",
              borderRadius: "9999px",
              marginBottom: 12,
              boxShadow: "0 2px 6px rgba(255, 92, 53, 0.08)",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5c35", display: "inline-block", boxShadow: "0 0 8px #ff5c35" }} />
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#ff5c35", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {variant === "agency" ? "👑 AGENCY FLEET WORKFLOW" : "⚡ LIVE TELEMETRY ENGINE"}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(26px, 4.4vw, 44px)",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              color: "#092124",
              margin: "0 0 12px",
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            }}
          >
            {variant === "agency" ? (
              <>
                How Top HubSpot Partners Scale to{" "}
                <span style={{ color: "#ff5c35", display: "inline-block" }}>$300K ARR Retainers</span>
              </>
            ) : (
              <>
                How DealSense Works:{" "}
                <span style={{ color: "#ff5c35", display: "inline-block" }}>From Webhook to Saved Pipeline</span>
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            style={{
              fontSize: "clamp(14px, 1.8vw, 16.5px)",
              color: "#475569",
              maxWidth: 720,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            {variant === "agency"
              ? "See the 4-step live flow: Connect client portals via 2-minute OAuth, monitor multi-tenant pipeline risk in 180ms, and generate automated executive QBR dossiers under your agency's domain."
              : "Plug into your HubSpot portal in 2 minutes with zero IT configuration. Evaluate 7 deterministic deal health signals in 180ms, uncover hidden revenue slippage, and automate executive board briefings."}
          </motion.p>
        </div>

        {/* ── Video Player & Live Telemetry Deck Container ────────────────── */}
        <div className="how-it-works-video-deck">
          {/* Top Video Deck Control Header */}
          <div
            style={{
              background: "rgba(9, 33, 36, 0.95)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "12px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {/* Left: Window Dots & Stream Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(255, 255, 255, 0.07)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: isPlaying && !interactiveMode ? "#10b981" : "#f59e0b",
                    boxShadow: isPlaying && !interactiveMode ? "0 0 8px #10b981" : "none",
                  }}
                  className={isPlaying && !interactiveMode ? "pulse-hubspot-dot" : ""}
                />
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "0.04em" }}>
                  {interactiveMode ? "SANDBOX INTERACTIVE MODE" : isPlaying ? "● LIVE 60FPS TELEMETRY TOUR" : "PAUSED"}
                </span>
                <span style={{ fontSize: "10px", color: "#38bdf8", fontWeight: 700, background: "rgba(56, 189, 248, 0.15)", padding: "1px 6px", borderRadius: "4px" }}>
                  4K
                </span>
              </div>
            </div>

            {/* Middle: Timecode & Step Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#94a3b8", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
              <span>
                {String(Math.floor(currentTotalSeconds / 60)).padStart(2, "0")}:{String(currentTotalSeconds % 60).padStart(2, "0")} / 00:{String(totalDuration).padStart(2, "0")}
              </span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
              <span style={{ color: "#ff8c6b", fontWeight: 700 }}>STAGE {activeStage + 1} OF 4</span>
            </div>

            {/* Right: Video Controls (Play/Pause, Speed, Mode) */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Play / Pause Toggle Button */}
              <button
                onClick={togglePlayPause}
                style={{
                  padding: "6px 12px",
                  background: isPlaying ? "rgba(255, 92, 53, 0.2)" : "#ff5c35",
                  border: "1px solid rgba(255, 92, 53, 0.4)",
                  color: "#ffffff",
                  borderRadius: "7px",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  transition: "all 0.15s ease",
                }}
                title={isPlaying ? "Pause Tour" : "Resume Tour"}
              >
                {isPlaying ? (
                  <>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    <span>Play</span>
                  </>
                )}
              </button>

              {/* Speed Selector */}
              <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: "6px", padding: "2px", border: "1px solid rgba(255,255,255,0.1)" }}>
                {[1, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    style={{
                      padding: "3px 7px",
                      background: playbackSpeed === spd ? "rgba(255, 92, 53, 0.3)" : "transparent",
                      color: playbackSpeed === spd ? "#ffffff" : "#94a3b8",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Mode Toggle Button */}
              <button
                onClick={() => {
                  setInteractiveMode((prev) => !prev);
                  if (!interactiveMode) setIsPlaying(false);
                }}
                style={{
                  padding: "5px 10px",
                  background: interactiveMode ? "#10b981" : "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "7px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>{interactiveMode ? "✓ Sandbox Active" : "🎮 Sandbox Mode"}</span>
              </button>
            </div>
          </div>

          {/* 4 Interactive Stage Progress Tabs */}
          <div
            className="video-stage-tabs-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
              padding: "14px 18px",
              background: "rgba(9, 33, 36, 0.7)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {STAGES.map((stage, idx) => {
              const isCurrent = activeStage === idx;
              const isPassed = activeStage > idx;

              return (
                <div
                  key={stage.id}
                  onClick={() => handleStageSelect(idx)}
                  className={`video-stage-tab ${isCurrent ? "active" : ""}`}
                >
                  {/* Micro Progress Bar inside Tab */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: isCurrent ? "linear-gradient(90deg, #ff5c35 0%, #ff8c6b 100%)" : isPassed ? "#10b981" : "transparent",
                        width: isCurrent ? `${stageProgress}%` : isPassed ? "100%" : "0%",
                        transition: isCurrent ? "width 0.05s linear" : "none",
                        boxShadow: isCurrent ? "0 0 8px #ff5c35" : "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: isCurrent ? "#ff8c6b" : "#94a3b8", letterSpacing: "0.04em" }}>
                      {stage.badge}
                    </span>
                    <span style={{ fontSize: "10px", color: isPassed ? "#10b981" : "#64748b", fontWeight: 700 }}>
                      {isPassed ? "✓ Complete" : isCurrent ? "● Running" : `${stage.duration}s`}
                    </span>
                  </div>

                  <div style={{ fontSize: "13px", fontWeight: 800, color: isCurrent ? "#ffffff" : "#cbd5e1", lineHeight: 1.2, marginBottom: 3 }}>
                    {stage.title}
                  </div>

                  <div style={{ fontSize: "11px", color: isCurrent ? "#cbd5e1" : "#64748b", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {stage.shortDesc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Main Interactive Simulation Stage Viewport ─────────────────── */}
          <div style={{ padding: "clamp(16px, 3vw, 28px)" }}>
            <div className="video-canvas-viewport">
              {/* Internal Window Header bar */}
              <div
                style={{
                  background: "#f8fafc",
                  padding: "10px 16px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <DealSenseIcon size={20} />
                  <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#092124" }}>
                    {variant === "agency" ? "DealSense Multi-Tenant Agency Cockpit" : "DealSense Enterprise Telemetry Deck"}
                  </span>
                  <span style={{ fontSize: "11px", background: "rgba(18, 69, 72, 0.08)", color: "#124548", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                    HubSpot Production Gateway
                  </span>
                </div>

                {variant === "agency" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "11.5px" }}>
                    <span style={{ color: "#64748b", fontWeight: 600 }}>Active Client Portal:</span>
                    <select
                      value={selectedClientPortal}
                      onChange={(e) => setSelectedClientPortal(e.target.value)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: "#092124",
                        background: "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      <option value="Acme Corp (Portal #84920)">Acme Corp (Portal #84920)</option>
                      <option value="FinTech Global (Portal #91023)">FinTech Global (Portal #91023)</option>
                      <option value="RetailCloud Ltd (Portal #77312)">RetailCloud Ltd (Portal #77312)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Stage Specific Interactive Content */}
              <div style={{ padding: "clamp(16px, 3vw, 24px)", minHeight: 380, background: "#ffffff" }}>
                <AnimatePresence mode="wait">
                  {/* ─────────────────────────────────────────────────────────────
                      STAGE 1: ZERO-CODE INGESTION (WEBHOOK & OAUTH)
                  ───────────────────────────────────────────────────────────── */}
                  {activeStage === 0 && (
                    <motion.div
                      key="stage-0"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: "flex", flexDirection: "column", gap: 20 }}
                    >
                      {/* Top Ingestion Flow Visualizer */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        {/* 1. HubSpot Source Node */}
                        <div
                          style={{
                            background: "#fafafa",
                            border: "1.5px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "16px",
                            position: "relative",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "6px", background: "#ff5c35", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: "13px" }}>
                              H
                            </div>
                            <div>
                              <div style={{ fontSize: "13px", fontWeight: 800, color: "#092124" }}>HubSpot CRM Portal</div>
                              <div style={{ fontSize: "10.5px", color: "#059669", fontWeight: 700 }}>● OAuth 2.0 Connected</div>
                            </div>
                          </div>
                          <div style={{ fontSize: "11.5px", color: "#475569", lineHeight: 1.4, background: "#ffffff", padding: "8px 10px", borderRadius: "6px", border: "1px solid #edf2f7" }}>
                            <strong>Deal Ingested:</strong> Orion Cloud Migration ($180K)<br />
                            <strong>Owner:</strong> Sarah Miller · <strong>Stage:</strong> Proposal
                          </div>
                        </div>

                        {/* 2. Middle Animated Telemetry Stream Connector */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0" }}>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: "11px",
                              fontWeight: 800,
                              color: "#ff5c35",
                              background: "rgba(255, 92, 53, 0.08)",
                              padding: "4px 10px",
                              borderRadius: "9999px",
                              marginBottom: 8,
                            }}
                          >
                            <span>⚡ Redis Stream Queue</span>
                            <span style={{ color: "#092124" }}>· 142ms</span>
                          </div>

                          {/* Animated SVG Pipeline Beam */}
                          <svg width="100%" height="24" viewBox="0 0 200 24" style={{ overflow: "visible" }}>
                            <line x1="0" y1="12" x2="200" y2="12" stroke="#cbd5e1" strokeWidth="3" />
                            <line x1="0" y1="12" x2="200" y2="12" stroke="#ff5c35" strokeWidth="3" className="streaming-flow-line" />
                            <circle cx="100" cy="12" r="5" fill="#ff5c35" />
                          </svg>

                          <div style={{ fontSize: "10px", color: "#64748b", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                            AES-256 GCM Encrypted Handshake
                          </div>
                        </div>

                        {/* 3. DealSense Telemetry Engine Node */}
                        <div
                          style={{
                            background: "linear-gradient(135deg, rgba(18, 69, 72, 0.06) 0%, rgba(255, 92, 53, 0.06) 100%)",
                            border: "1.5px solid rgba(18, 69, 72, 0.3)",
                            borderRadius: "12px",
                            padding: "16px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <DealSenseIcon size={28} />
                            <div>
                              <div style={{ fontSize: "13px", fontWeight: 800, color: "#092124" }}>DealSense Ingestion Core</div>
                              <div style={{ fontSize: "10.5px", color: "#ff5c35", fontWeight: 800 }}>⚡ 0% SaaS Tax · Sub-200ms</div>
                            </div>
                          </div>
                          <div style={{ fontSize: "11.5px", color: "#334155", background: "#ffffff", padding: "8px 10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                            <strong>Processed:</strong> {simulatedWebhookCount.toLocaleString()} events today<br />
                            <strong>Payload:</strong> Deals, Notes, Calls & Transcripts
                          </div>
                        </div>
                      </div>

                      {/* Interactive Terminal Bar */}
                      <div
                        style={{
                          background: "#092124",
                          borderRadius: "10px",
                          padding: "12px 16px",
                          color: "#38bdf8",
                          fontFamily: "var(--font-mono)",
                          fontSize: "11.5px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 10,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "#10b981" }}>➜</span>
                          <span style={{ color: "#e2e8f0" }}>[STREAM]</span>
                          <span style={{ color: webhookPulsing ? "#ff8c6b" : "#38bdf8" }}>{recentWebhookLog}</span>
                        </div>

                        <button
                          onClick={handleSimulateWebhook}
                          style={{
                            padding: "5px 12px",
                            background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 800,
                            cursor: "pointer",
                            boxShadow: "0 2px 6px rgba(255, 92, 53, 0.4)",
                          }}
                        >
                          Simulate Incoming Webhook ⚡
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ─────────────────────────────────────────────────────────────
                      STAGE 2: DETERMINISTIC 7-VECTOR RISK SCORING (180ms)
                  ───────────────────────────────────────────────────────────── */}
                  {activeStage === 1 && (
                    <motion.div
                      key="stage-1"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}
                    >
                      {/* Left: 7 Deterministic Vectors (Interactive Toggles) */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <span style={{ fontSize: "12px", fontWeight: 800, color: "#092124", textTransform: "uppercase" }}>
                            7 Deterministic Telemetry Vectors
                          </span>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>Click toggles to test score</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {/* Vector 1 */}
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "9px 12px",
                              borderRadius: "8px",
                              background: buyerSilent ? "rgba(220, 38, 38, 0.06)" : "#f8fafc",
                              border: `1px solid ${buyerSilent ? "rgba(220, 38, 38, 0.25)" : "#e2e8f0"}`,
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12px" }}>
                              <input type="checkbox" checked={buyerSilent} onChange={(e) => setBuyerSilent(e.target.checked)} style={{ accentColor: "#dc2626" }} />
                              <span style={{ fontWeight: 700, color: "#092124" }}>Economic Buyer Silent (18d)</span>
                            </div>
                            <span style={{ fontSize: "11px", fontWeight: 800, color: buyerSilent ? "#dc2626" : "#94a3b8" }}>-34 pts</span>
                          </label>

                          {/* Vector 2 */}
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "9px 12px",
                              borderRadius: "8px",
                              background: singleThreaded ? "rgba(234, 88, 12, 0.06)" : "#f8fafc",
                              border: `1px solid ${singleThreaded ? "rgba(234, 88, 12, 0.25)" : "#e2e8f0"}`,
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12px" }}>
                              <input type="checkbox" checked={singleThreaded} onChange={(e) => setSingleThreaded(e.target.checked)} style={{ accentColor: "#ea580c" }} />
                              <span style={{ fontWeight: 700, color: "#092124" }}>Single-Threaded Contact</span>
                            </div>
                            <span style={{ fontSize: "11px", fontWeight: 800, color: singleThreaded ? "#ea580c" : "#94a3b8" }}>-22 pts</span>
                          </label>

                          {/* Vector 3 */}
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "9px 12px",
                              borderRadius: "8px",
                              background: datePushed ? "rgba(234, 88, 12, 0.06)" : "#f8fafc",
                              border: `1px solid ${datePushed ? "rgba(234, 88, 12, 0.25)" : "#e2e8f0"}`,
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12px" }}>
                              <input type="checkbox" checked={datePushed} onChange={(e) => setDatePushed(e.target.checked)} style={{ accentColor: "#ea580c" }} />
                              <span style={{ fontWeight: 700, color: "#092124" }}>Close Date Slipped 2x</span>
                            </div>
                            <span style={{ fontSize: "11px", fontWeight: 800, color: datePushed ? "#ea580c" : "#94a3b8" }}>-18 pts</span>
                          </label>

                          {/* Vector 4 */}
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "9px 12px",
                              borderRadius: "8px",
                              background: staleActivity ? "rgba(234, 88, 12, 0.06)" : "#f8fafc",
                              border: `1px solid ${staleActivity ? "rgba(234, 88, 12, 0.25)" : "#e2e8f0"}`,
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12px" }}>
                              <input type="checkbox" checked={staleActivity} onChange={(e) => setStaleActivity(e.target.checked)} style={{ accentColor: "#ea580c" }} />
                              <span style={{ fontWeight: 700, color: "#092124" }}>Stage Stall (&gt;2.4x Avg)</span>
                            </div>
                            <span style={{ fontSize: "11px", fontWeight: 800, color: staleActivity ? "#ea580c" : "#94a3b8" }}>-16 pts</span>
                          </label>
                        </div>
                      </div>

                      {/* Right: Dynamic Deterministic Score Output */}
                      <div
                        style={{
                          background: "#fafafa",
                          borderRadius: "14px",
                          padding: "20px",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minHeight: 250,
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Deterministic Health Score</span>
                            <span style={{ fontSize: "11px", fontWeight: 800, color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "2px 8px", borderRadius: "9999px" }}>
                              ⚡ 180ms Latency
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                            <span
                              style={{
                                fontSize: "48px",
                                fontWeight: 900,
                                color: liveScore < 40 ? "#dc2626" : liveScore < 70 ? "#ea580c" : "#059669",
                                fontFamily: "'Outfit', sans-serif",
                                lineHeight: 1,
                              }}
                            >
                              {liveScore}
                            </span>
                            <span style={{ fontSize: "18px", color: "#94a3b8", fontWeight: 700 }}>/ 100</span>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: 800,
                                padding: "3px 10px",
                                borderRadius: "9999px",
                                background: liveScore < 40 ? "rgba(220, 38, 38, 0.1)" : liveScore < 70 ? "rgba(234, 88, 12, 0.1)" : "rgba(5, 150, 105, 0.1)",
                                color: liveScore < 40 ? "#dc2626" : liveScore < 70 ? "#ea580c" : "#059669",
                              }}
                            >
                              {liveScore < 40 ? "CRITICAL RISK" : liveScore < 70 ? "HIGH RISK" : "CLOSING CONFIDENCE"}
                            </span>
                          </div>

                          <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.5, margin: "0 0 12px" }}>
                            {liveScore < 50
                              ? "⚠️ High probability of slipping into Q2. Economic buyer has not engaged in 18 days. Single-threaded risk requires executive intervention."
                              : "✓ Deal momentum is verified by active stakeholder multi-threading and consistent meeting velocity."}
                          </p>
                        </div>

                        <div style={{ background: "#ffffff", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#092124" }}>
                          🔒 <strong>Deterministic Guarantee:</strong> Zero stochastic AI hallucinations. Every score point is mathematically auditable.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ─────────────────────────────────────────────────────────────
                      STAGE 3: AUTONOMOUS AI AGENTS & DEAL WAR ROOM
                  ───────────────────────────────────────────────────────────── */}
                  {activeStage === 2 && (
                    <motion.div
                      key="stage-2"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: "flex", flexDirection: "column", gap: 16 }}
                    >
                      {/* 3 Active Agents Cards */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                        {/* Agent 1 */}
                        <div style={{ background: "#fafafa", borderRadius: "10px", padding: "14px", border: "1px solid #e2e8f0" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#ff5c35", background: "rgba(255, 92, 53, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                              AGENT 01
                            </span>
                            <span style={{ fontSize: "10.5px", color: "#10b981", fontWeight: 700 }}>● Active</span>
                          </div>
                          <div style={{ fontSize: "13px", fontWeight: 800, color: "#092124", marginBottom: 4 }}>Pipeline Triage Agent</div>
                          <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                            Monitors webhook stream 24/7. Flags $180K Orion Cloud Modernization as critical slippage.
                          </div>
                        </div>

                        {/* Agent 2 */}
                        <div style={{ background: "#fafafa", borderRadius: "10px", padding: "14px", border: "1px solid #e2e8f0" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#0284c7", background: "rgba(2, 132, 199, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                              AGENT 02
                            </span>
                            <span style={{ fontSize: "10.5px", color: "#10b981", fontWeight: 700 }}>● Active</span>
                          </div>
                          <div style={{ fontSize: "13px", fontWeight: 800, color: "#092124", marginBottom: 4 }}>Monte Carlo Reality Engine</div>
                          <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                            Runs {monteCarloRuns.toLocaleString()} probability curves. Detects $460,000 manager quota padding.
                          </div>
                        </div>

                        {/* Agent 3 */}
                        <div style={{ background: "#fafafa", borderRadius: "10px", padding: "14px", border: "1px solid #e2e8f0" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#7c3aed", background: "rgba(124, 58, 237, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                              AGENT 03
                            </span>
                            <span style={{ fontSize: "10.5px", color: "#10b981", fontWeight: 700 }}>● Active</span>
                          </div>
                          <div style={{ fontSize: "13px", fontWeight: 800, color: "#092124", marginBottom: 4 }}>Executive Board QBR Agent</div>
                          <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                            Synthesizes board briefing deck & peer-to-peer executive sequence to re-engage CFO.
                          </div>
                        </div>
                      </div>

                      {/* Monte Carlo Visualizer Simulation Bar */}
                      <div
                        style={{
                          background: "#092124",
                          borderRadius: "12px",
                          padding: "16px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 12,
                          color: "#ffffff",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: 800, color: "#ff8c6b", textTransform: "uppercase" }}>
                            Monte Carlo Slippage Reality Distribution ({monteCarloRuns.toLocaleString()} Runs)
                          </div>
                          <div style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff", marginTop: 2 }}>
                            Rep Commit: <span style={{ color: "#f87171" }}>$1.40M</span> vs. AI Realistic Reality:{" "}
                            <span style={{ color: "#34d399" }}>$940K</span> ($460K Gap Caught)
                          </div>
                        </div>

                        <button
                          onClick={handleRunMonteCarlo}
                          disabled={isSimulatingMonteCarlo}
                          style={{
                            padding: "8px 16px",
                            background: isSimulatingMonteCarlo ? "#475569" : "#ff5c35",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 800,
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(255, 92, 53, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span>{isSimulatingMonteCarlo ? "Simulating Curves..." : "Run 10,000 Monte Carlo Runs 🎲"}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ─────────────────────────────────────────────────────────────
                      STAGE 4: 2-WAY HUBSPOT WRITEBACK & PROTECTED REVENUE
                  ───────────────────────────────────────────────────────────── */}
                  {activeStage === 3 && (
                    <motion.div
                      key="stage-3"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, alignItems: "start" }}
                    >
                      {/* Left: Native HubSpot Canvas Card UI */}
                      <div
                        style={{
                          background: "#ffffff",
                          border: "2px solid #ff5c35",
                          borderRadius: "14px",
                          padding: "18px",
                          boxShadow: "0 8px 24px rgba(255, 92, 53, 0.12)",
                          position: "relative",
                        }}
                      >
                        <div style={{ position: "absolute", top: -11, right: 14, background: "#ff5c35", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "9999px" }}>
                          EMBEDDED HUBSPOT CANVAS
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <DealSenseIcon size={24} />
                          <div>
                            <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#092124" }}>
                              DealSense™ Intelligence Panel
                            </div>
                            <div style={{ fontSize: "10.5px", color: "#64748b" }}>
                              Lives inside your HubSpot Deal Record View
                            </div>
                          </div>
                        </div>

                        <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: 4 }}>
                            <span style={{ color: "#475569" }}>Deal Risk Status:</span>
                            <span style={{ fontWeight: 800, color: "#059669" }}>✓ Executive Action Dispatched</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px" }}>
                            <span style={{ color: "#475569" }}>Recalibrated Score:</span>
                            <span style={{ fontWeight: 800, color: "#059669" }}>84 / 100 (Protected)</span>
                          </div>
                        </div>

                        <div style={{ fontSize: "11px", color: "#334155", lineHeight: 1.45 }}>
                          ⚡ <strong>Auto-Remediation Triggered:</strong> CFO re-engaged via executive ROI briefing. Close date adjusted +14d in HubSpot CRM properties.
                        </div>
                      </div>

                      {/* Right: Writeback Logs & Impact Box */}
                      <div
                        style={{
                          background: "#fafafa",
                          borderRadius: "14px",
                          padding: "18px",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minHeight: 220,
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <span style={{ fontSize: "11px", fontWeight: 800, color: "#092124", textTransform: "uppercase" }}>
                              Verified 2-Way CRM Writebacks
                            </span>
                            <span style={{ fontSize: "10.5px", color: "#059669", fontWeight: 800 }}>
                              {writebackStatus === "syncing" ? "Syncing..." : "● 100% Audit Logged"}
                            </span>
                          </div>

                          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px", display: "flex", flexDirection: "column", gap: 6, fontSize: "11.5px", color: "#334155" }}>
                            <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ color: "#10b981", fontWeight: 900 }}>✓</span>
                              <span>HubSpot deal property <code>dealsense_risk_score</code> updated</span>
                            </li>
                            <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ color: "#10b981", fontWeight: 900 }}>✓</span>
                              <span>Slack rep alert sent to Sarah Miller (Actionable play)</span>
                            </li>
                            <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ color: "#10b981", fontWeight: 900 }}>✓</span>
                              <span>$180,000 Orion Cloud Modernization saved from slippage</span>
                            </li>
                          </ul>
                        </div>

                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <button
                            onClick={handleTriggerWriteback}
                            style={{
                              flex: 1,
                              padding: "9px",
                              background: "#092124",
                              color: "#fff",
                              border: "none",
                              borderRadius: "7px",
                              fontSize: "11.5px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            {writebackStatus === "syncing" ? "Dispatching..." : "Simulate Writeback Sync ⚡"}
                          </button>
                          <div style={{ fontSize: "12px", fontWeight: 800, color: "#ff5c35", whiteSpace: "nowrap" }}>
                            +$180K Protected
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Bottom High-Conversion Action Dock ──────────────────────────── */}
          <div
            style={{
              background: "rgba(9, 33, 36, 0.95)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "16px clamp(16px, 3vw, 24px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff" }}>
                {variant === "agency"
                  ? "Deploy DealSense for up to 15 client portals under your agency brand"
                  : "Ready to eliminate deal slippage in your HubSpot portal?"}
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: 2 }}>
                {variant === "agency"
                  ? "Zero monthly platform tax · 95% pure retainer margin · 2-minute client setup"
                  : "Test-drive with 50 scored deals for $99. Find $25K in slippage or pay $0."}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {variant === "agency" ? (
                <>
                  <button
                    onClick={() => navigate("/checkout?tier=deploy-1500")}
                    style={{
                      padding: "10px 20px",
                      background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: 800,
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(255, 92, 53, 0.4)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>Deploy Partner Fleet ($1,500)</span>
                    <span>→</span>
                  </button>
                  <a
                    href="#pricing"
                    style={{
                      padding: "10px 16px",
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: 700,
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    View All Plans
                  </a>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/checkout?tier=audit-99")}
                    style={{
                      padding: "10px 20px",
                      background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: 800,
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(255, 92, 53, 0.4)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>Test Drive Audit ($99)</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => navigate("/pipeline")}
                    style={{
                      padding: "10px 16px",
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: 700,
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Launch Live Demo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
