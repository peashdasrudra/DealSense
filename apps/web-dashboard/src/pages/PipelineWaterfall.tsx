/**
 * DealSense — Pipeline Waterfall & Stage Velocity Bottleneck Engine.
 * Premium Enterprise Edition.
 * Built for RevOps leaders and CROs to track pipeline inflows, slippages, stage stagnation, and velocity leaks.
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logAuditEvent } from "../api";

interface WaterfallItem {
  category: string;
  amount: number;
  type: "start" | "add" | "subtract" | "end";
  count: number;
  description: string;
  contributingAccounts: string[];
}

interface StageVelocity {
  id: string;
  stageNumber: number;
  stage: string;
  avgDays: number;
  benchmarkDays: number;
  conversionRate: number;
  benchmarkConversion: number;
  stalledDeals: number;
  revenueAtRisk: number;
  bottleneckSeverity: "Critical" | "Moderate" | "Optimal";
  recommendedAction: string;
  keyBlocker: string;
}

const WATERFALL_DATA: WaterfallItem[] = [
  {
    category: "Starting Pipeline (Q3)",
    amount: 18400000,
    type: "start",
    count: 18,
    description: "Enterprise pipeline brought forward into the quarter",
    contributingAccounts: ["Maersk Digital", "IKEA Retail", "Snowflake", "Twilio"],
  },
  {
    category: "+ Inbound & SDR Created",
    amount: 12400000,
    type: "add",
    count: 12,
    description: "New qualified enterprise opportunities added",
    contributingAccounts: ["Palantir Tech", "Klarna Bank", "Adyen Global", "CrowdStrike"],
  },
  {
    category: "+ Scope Expansion & Upsell",
    amount: 2450000,
    type: "add",
    count: 6,
    description: "Seat expansions on active proposals and pilot upgrades",
    contributingAccounts: ["Epic Health Systems", "SAP America", "Datadog"],
  },
  {
    category: "− Closed Won Revenue",
    amount: -4820000,
    type: "subtract",
    count: 5,
    description: "Successfully executed contracts (Maersk, IKEA, Cloudflare)",
    contributingAccounts: ["Maersk Digital Global", "IKEA Digital Retail", "Cloudflare EMEA"],
  },
  {
    category: "− Pushed / Slipped Close Dates",
    amount: -2650000,
    type: "subtract",
    count: 4,
    description: "Deals pushed past current fiscal quarter target",
    contributingAccounts: ["DHL Global Supply Chain", "CrowdStrike Global", "Twilio API"],
  },
  {
    category: "− Closed Lost / Frozen",
    amount: -1350000,
    type: "subtract",
    count: 2,
    description: "Lost to competitor or frozen budget freeze",
    contributingAccounts: ["Legacy FinTech RFP", "Regional Logistics Pilot"],
  },
  {
    category: "Ending Active Pipeline",
    amount: 28430000,
    type: "end",
    count: 25,
    description: "Current active enterprise deals closing this quarter",
    contributingAccounts: ["25 Active Enterprise Accounts Across 5 Stages"],
  },
];

const STAGE_VELOCITY_DATA: StageVelocity[] = [
  {
    id: "stage-1",
    stageNumber: 1,
    stage: "Appointment Scheduled (Discovery)",
    avgDays: 6.2,
    benchmarkDays: 8.0,
    conversionRate: 74,
    benchmarkConversion: 65,
    stalledDeals: 1,
    revenueAtRisk: 580000,
    bottleneckSeverity: "Optimal",
    keyBlocker: "Minor scheduling lag across EMEA reps",
    recommendedAction: "Pacing ahead of target. Maintain current enterprise SDR qualification cadences.",
  },
  {
    id: "stage-2",
    stageNumber: 2,
    stage: "Qualified to Buy (Qualification)",
    avgDays: 14.8,
    benchmarkDays: 10.0,
    conversionRate: 62,
    benchmarkConversion: 68,
    stalledDeals: 3,
    revenueAtRisk: 1450000,
    bottleneckSeverity: "Moderate",
    keyBlocker: "Unassigned Economic Buyer budget authorization",
    recommendedAction: "Mandate CFO/VP Economic Buyer engagement before issuing pricing quotes.",
  },
  {
    id: "stage-3",
    stageNumber: 3,
    stage: "Presentation Scheduled (Proposal & Demo)",
    avgDays: 22.4,
    benchmarkDays: 12.0,
    conversionRate: 46,
    benchmarkConversion: 58,
    stalledDeals: 5,
    revenueAtRisk: 3780000,
    bottleneckSeverity: "Critical",
    keyBlocker: "Stalled customized demo sandbox queue & missing MAP",
    recommendedAction: "Stalled demo queue: Enforce Mutual Action Plan (MAP) before delivering customized demo sandbox.",
  },
  {
    id: "stage-4",
    stageNumber: 4,
    stage: "Decision Maker Bought-In (Negotiation)",
    avgDays: 18.2,
    benchmarkDays: 14.0,
    conversionRate: 68,
    benchmarkConversion: 75,
    stalledDeals: 3,
    revenueAtRisk: 2850000,
    bottleneckSeverity: "Moderate",
    keyBlocker: "InfoSec & SOC2 compliance legal redlines",
    recommendedAction: "Pre-seed standard Infosec & SOC2 compliance packages to resolve 9 days of legal friction.",
  },
  {
    id: "stage-5",
    stageNumber: 5,
    stage: "Contract Sent (Closing)",
    avgDays: 5.4,
    benchmarkDays: 7.0,
    conversionRate: 92,
    benchmarkConversion: 90,
    stalledDeals: 1,
    revenueAtRisk: 1650000,
    bottleneckSeverity: "Optimal",
    keyBlocker: "Awaiting DocuSign counter-signature",
    recommendedAction: "DocuSign turnaround is healthy. Maintain automated CEO signature reminders.",
  },
];

export const PipelineWaterfall: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"This Month" | "This Quarter" | "Year to Date">("This Quarter");
  const [activeStageFilter, setActiveStageFilter] = useState<string>("All");
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const totalSlippedRevenue = Math.abs(
    WATERFALL_DATA.find((w) => w.category.includes("Pushed"))?.amount || 0
  );
  const totalCreatedRevenue =
    WATERFALL_DATA.find((w) => w.category.includes("Created"))?.amount || 0;
  const criticalBottleneckRevenue = STAGE_VELOCITY_DATA.filter(
    (s) => s.bottleneckSeverity === "Critical"
  ).reduce((sum, s) => sum + s.revenueAtRisk, 0);

  const filteredStages = useMemo(() => {
    if (activeStageFilter === "All") return STAGE_VELOCITY_DATA;
    return STAGE_VELOCITY_DATA.filter((s) => s.bottleneckSeverity === activeStageFilter);
  }, [activeStageFilter]);

  const formatCurrency = (val: number) => {
    const absVal = Math.abs(val);
    if (absVal >= 1000000) return `$${(absVal / 1000000).toFixed(2)}M`;
    if (absVal >= 1000) return `$${(absVal / 1000).toFixed(0)}K`;
    return `$${absVal}`;
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      showToast("⚡ Velocity Simulation complete: Accelerating Proposal stage by 8 days recovers +$1.85M in Q3 closed revenue!");
      logAuditEvent({
        actor: "Peash Rudra",
        role: "VP Revenue Operations",
        actionType: "Pipeline Velocity Simulation",
        targetObject: "Funnel Velocity Engine",
        tier: "Tier 1 (Continuous Telemetry)",
        status: "Success",
        details: "Simulated 8-day acceleration in Stage 3 (Proposal). Projected ARR impact: +$1.85M recovery.",
      });
    }, 600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Toast Notification ───────────────────────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: "fixed",
              top: 24,
              right: 28,
              zIndex: 99999,
              background: "#1e293b",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "6px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.28)",
              border: "1px solid #ff5c35",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. Enterprise Header Card ─────────────────────────────────── */}
      <div className="page-header-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="page-header-badge-row">
              <span className="page-header-badge" style={{ background: "rgba(255, 92, 53, 0.08)", color: "#ff5c35", borderColor: "rgba(255, 92, 53, 0.25)" }}>
                ● REVOPS PIPELINE TELEMETRY
              </span>
            </div>
            <h2 className="page-header-title">
              Pipeline Waterfall &amp; Stage Velocity Bottleneck Diagnostic
            </h2>
            <p className="page-header-desc">
              Track pipeline creation, stage duration decay, and deal slippage across every stage of your sales funnel. Surface exact bottlenecks before they derail quarterly revenue targets.
            </p>
          </div>

          <div className="page-header-actions">
            {/* Timeframe Selector */}
            <div style={{ display: "flex", gap: 3, background: "var(--hs-surface-hover)", padding: 3, borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
              {(["This Month", "This Quarter", "Year to Date"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTimeframe(t)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    border: "none",
                    background: selectedTimeframe === t ? "#ff5c35" : "transparent",
                    color: selectedTimeframe === t ? "#ffffff" : "var(--hs-text)",
                    fontSize: "11.5px",
                    fontWeight: selectedTimeframe === t ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                showToast("📥 Exported Pipeline Waterfall & Stage Velocity Model (CSV/PDF)!");
                logAuditEvent({
                  actor: "Peash Rudra",
                  role: "VP Sales Ops",
                  actionType: "Waterfall Export",
                  targetObject: "Pipeline Waterfall Model",
                  tier: "Tier 1 (Continuous Telemetry)",
                  status: "Success",
                  details: `Exported pipeline waterfall model for ${selectedTimeframe}.`,
                });
              }}
              style={{
                background: "#ffffff",
                color: "var(--hs-primary)",
                border: "1px solid var(--hs-border-dark)",
                padding: "8px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "var(--shadow-xs)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              <span>📥 Export Forecast</span>
            </button>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              style={{
                background: "#ff5c35",
                color: "#ffffff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(255, 92, 53, 0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              <span>{isSimulating ? "⏳ Simulating..." : "⚡ Run Simulation"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Enterprise Telemetry KPI Grid ──────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <div
          className="kpi-card"
          style={{
            background: "#ffffff",
            padding: "16px 18px",
            borderRadius: "8px",
            border: "1px solid var(--hs-border-dark)",
            borderTop: "3px solid #007a70",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              New Pipeline Created
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(0, 189, 165, 0.12)", color: "#007a70", padding: "2px 6px", borderRadius: 4 }}>
              +34% INFLOW
            </span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#007a70", fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}>
            +{formatCurrency(totalCreatedRevenue)}
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            8 new qualified enterprise opportunities
          </div>
        </div>

        <div
          className="kpi-card"
          style={{
            background: "#ffffff",
            padding: "16px 18px",
            borderRadius: "8px",
            border: "1px solid var(--hs-border-dark)",
            borderTop: "3px solid #d93843",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Pipeline Slipped / Pushed
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(217, 56, 67, 0.1)", color: "#d93843", padding: "2px 6px", borderRadius: 4 }}>
              LEAK DETECTED
            </span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#d93843", fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}>
            −{formatCurrency(totalSlippedRevenue)}
          </div>
          <div style={{ fontSize: "11.5px", color: "#d93843", marginTop: 4, fontWeight: 600 }}>
            ▲ 5 deals pushed past current quarter target
          </div>
        </div>

        <div
          className="kpi-card"
          style={{
            background: "#ffffff",
            padding: "16px 18px",
            borderRadius: "8px",
            border: "1px solid var(--hs-border-dark)",
            borderTop: "3px solid #ff5c35",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Bottleneck Revenue Exposure
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(255, 92, 53, 0.1)", color: "#ff5c35", padding: "2px 6px", borderRadius: 4 }}>
              5 DEALS AT RISK
            </span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#ff5c35", fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}>
            {formatCurrency(criticalBottleneckRevenue)}
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Stalled in Presentation &amp; Proposal stage
          </div>
        </div>

        <div
          className="kpi-card"
          style={{
            background: "#ffffff",
            padding: "16px 18px",
            borderRadius: "8px",
            border: "1px solid var(--hs-border-dark)",
            borderTop: "3px solid #2d3e50",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Average Sales Cycle
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(45, 62, 80, 0.08)", color: "#2d3e50", padding: "2px 6px", borderRadius: 4 }}>
              +9.2D DELAY
            </span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#2d3e50", fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}>
            67.5 Days
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Benchmark target is 58.3 days
          </div>
        </div>
      </div>

      {/* ── 3. Pipeline Movement Waterfall Financial Bridge ───────────── */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          border: "1px solid var(--hs-border-dark)",
          boxShadow: "var(--shadow-sm)",
          margin: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--hs-border-dark)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
                Pipeline Movement Waterfall Bridge ({selectedTimeframe})
              </h3>
              <span style={{ fontSize: "11px", fontWeight: 700, background: "rgba(0, 164, 189, 0.1)", color: "#007a8c", padding: "2px 8px", borderRadius: 10 }}>
                7 Movement Drivers
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
              Detailed inflow additions, closed conversions, slippage leaks, and ending balance
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>Active Baseline:</span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 800,
                color: "#2d3e50",
                fontFamily: "var(--font-mono)",
                background: "var(--hs-surface)",
                padding: "4px 12px",
                borderRadius: "6px",
                border: "1px solid var(--hs-border-dark)",
              }}
            >
              $28.43M Active Pipeline
            </span>
          </div>
        </div>

        {/* Visual Waterfall Bridge Flow Bars */}
        <div style={{ padding: "20px 20px 10px", background: "#fbfcfe", borderBottom: "1px solid var(--hs-border)" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
            Financial Waterfall Bridge Flow
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 8,
              alignItems: "end",
              minHeight: 140,
            }}
          >
            {WATERFALL_DATA.map((item, idx) => {
              const isAdd = item.type === "add";
              const isSub = item.type === "subtract";
              const isStart = item.type === "start";
              const isEnd = item.type === "end";

              const barColor = isAdd
                ? "#00a38d"
                : isSub
                ? item.category.includes("Won")
                  ? "#00a4bd"
                  : "#d93843"
                : isStart
                ? "#516f90"
                : "#2d3e50";

              // Scale height relative to max value ($28.43M)
              const heightPercent = Math.max(24, Math.min(100, (Math.abs(item.amount) / 28430000) * 100));

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  {/* Amount Chip */}
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      fontFamily: "var(--font-mono)",
                      color: barColor,
                      marginBottom: 6,
                    }}
                  >
                    {item.amount > 0 && !isStart && !isEnd ? "+" : ""}
                    {formatCurrency(item.amount)}
                  </div>

                  {/* Visual Step Pillar Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}px` }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    style={{
                      width: "85%",
                      background: barColor,
                      borderRadius: "4px 4px 0 0",
                      boxShadow: hoveredStep === idx ? `0 4px 12px ${barColor}50` : "none",
                      transform: hoveredStep === idx ? "scaleY(1.04)" : "scaleY(1)",
                      transition: "transform 0.15s ease",
                    }}
                  />

                  {/* Step Label */}
                  <div
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      color: hoveredStep === idx ? "var(--hs-primary)" : "var(--hs-text)",
                      textAlign: "center",
                      marginTop: 8,
                      lineHeight: 1.25,
                    }}
                  >
                    {item.category.split(" ")[0]} {item.category.split(" ")[1] || ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Waterfall Ledger Rows */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          {WATERFALL_DATA.map((item, idx) => {
            const isAdd = item.type === "add";
            const isSub = item.type === "subtract";
            const isStart = item.type === "start";
            const isEnd = item.type === "end";
            const isTotal = isStart || isEnd;

            const tagColor = isAdd
              ? { bg: "rgba(0, 189, 165, 0.1)", text: "#007a70", border: "rgba(0, 189, 165, 0.3)" }
              : isSub
              ? item.category.includes("Won")
                ? { bg: "rgba(0, 164, 189, 0.1)", text: "#007a8c", border: "rgba(0, 164, 189, 0.3)" }
                : { bg: "rgba(217, 56, 67, 0.1)", text: "#d93843", border: "rgba(217, 56, 67, 0.3)" }
              : { bg: "rgba(45, 62, 80, 0.08)", text: "#2d3e50", border: "rgba(45, 62, 80, 0.25)" };

            const tagLabel = isStart
              ? "STARTING BASE"
              : isEnd
              ? "ENDING BALANCE"
              : isAdd
              ? "+ INFLOW"
              : "- OUTFLOW";

            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.005 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  background: isTotal ? "var(--hs-surface)" : "#ffffff",
                  border: isTotal ? "1.5px solid var(--hs-border-dark)" : "1px solid var(--hs-border)",
                  borderLeft: `4px solid ${tagColor.text}`,
                  flexWrap: "wrap",
                  gap: 10,
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: "9.5px",
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: tagColor.bg,
                        color: tagColor.text,
                        border: `1px solid ${tagColor.border}`,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {tagLabel}
                    </span>
                    <span style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--hs-primary)" }}>
                      {item.category}
                    </span>
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 3 }}>
                    {item.description} · <strong style={{ color: "var(--hs-text)" }}>{item.count} Deals</strong>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {/* Contributing Accounts Pills */}
                  <div style={{ display: "flex", gap: 4 }}>
                    {item.contributingAccounts.slice(0, 2).map((acc, aIdx) => (
                      <span
                        key={aIdx}
                        style={{
                          fontSize: "10.5px",
                          color: "var(--hs-text-muted)",
                          background: "#f1f4f8",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          border: "1px solid var(--hs-border)",
                        }}
                      >
                        {acc}
                      </span>
                    ))}
                  </div>

                  {/* Formatted Amount */}
                  <div style={{ textAlign: "right", minWidth: 100 }}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        color: tagColor.text,
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.amount > 0 && !isStart && !isEnd ? "+" : ""}
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Stage Velocity & Bottleneck Diagnostic ─────────────────── */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          border: "1px solid var(--hs-border-dark)",
          boxShadow: "var(--shadow-sm)",
          margin: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--hs-border-dark)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
                Stage Velocity &amp; Funnel Duration Bottlenecks
              </h3>
              <span style={{ fontSize: "11px", color: "var(--hs-text-muted)", background: "var(--hs-surface)", padding: "2px 8px", borderRadius: 10, border: "1px solid var(--hs-border)" }}>
                Target Benchmark vs Actual Duration
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
              Comparing average days in stage against historical benchmarks with prescriptive RevOps remedies
            </div>
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            {(["All", "Critical", "Moderate", "Optimal"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveStageFilter(f)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "4px",
                  border: activeStageFilter === f ? "none" : "1px solid var(--hs-border-dark)",
                  background: activeStageFilter === f ? "#ff5c35" : "#ffffff",
                  color: activeStageFilter === f ? "#ffffff" : "var(--hs-text)",
                  fontSize: "11.5px",
                  fontWeight: activeStageFilter === f ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stage List Cards */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredStages.map((stage) => {
            const isCrit = stage.bottleneckSeverity === "Critical";
            const isMod = stage.bottleneckSeverity === "Moderate";

            const badgeBg = isCrit
              ? "rgba(217, 56, 67, 0.1)"
              : isMod
              ? "rgba(255, 153, 0, 0.12)"
              : "rgba(0, 189, 165, 0.12)";
            const badgeColor = isCrit
              ? "#d93843"
              : isMod
              ? "#b76e00"
              : "#007a70";
            const barFill = isCrit
              ? "#d93843"
              : isMod
              ? "#ff9900"
              : "#00a38d";

            const daysDiff = (stage.avgDays - stage.benchmarkDays).toFixed(1);
            const isSlow = stage.avgDays > stage.benchmarkDays;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "16px 18px",
                  borderRadius: "8px",
                  border: isCrit ? "1.5px solid rgba(217, 56, 67, 0.35)" : "1px solid var(--hs-border-dark)",
                  background: isCrit ? "#fff9f8" : "#ffffff",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {/* Header Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "#2d3e50",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {stage.stageNumber}
                      </span>
                      <span style={{ fontSize: "14.5px", fontWeight: 800, color: "var(--hs-primary)" }}>
                        {stage.stage}
                      </span>
                    </div>

                    <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>Conversion Rate: <strong style={{ color: "var(--hs-heading)" }}>{stage.conversionRate}%</strong></span>
                      <span>•</span>
                      <span>Target Benchmark: {stage.benchmarkConversion}%</span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: stage.conversionRate >= stage.benchmarkConversion ? "#007a70" : "#d93843",
                        }}
                      >
                        ({stage.conversionRate >= stage.benchmarkConversion ? "+" : ""}
                        {stage.conversionRate - stage.benchmarkConversion}pts)
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: isCrit ? "#d93843" : "var(--hs-primary)", fontFamily: "var(--font-mono)" }}>
                        {stage.avgDays} Days Avg
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>
                        Target: {stage.benchmarkDays}d (
                        <span style={{ fontWeight: 700, color: isSlow ? "#d93843" : "#007a70" }}>
                          {isSlow ? `+${daysDiff}d slow ⚠️` : "On pace ✓"}
                        </span>
                        )
                      </div>
                    </div>

                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "12px",
                        background: badgeBg,
                        color: badgeColor,
                        fontWeight: 800,
                        fontSize: "11px",
                        letterSpacing: "0.02em",
                      }}
                    >
                      ● {stage.bottleneckSeverity}
                    </span>
                  </div>
                </div>

                {/* Dual-Bar Comparison Duration Meter */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--hs-text-muted)", marginBottom: 4 }}>
                    <span>Actual Duration: <strong>{stage.avgDays} days</strong></span>
                    <span>Target Max: <strong>{stage.benchmarkDays} days</strong> (Funnel Limit: 25d)</span>
                  </div>

                  {/* Actual Progress Bar */}
                  <div style={{ height: 8, width: "100%", background: "#eaf0f6", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (stage.avgDays / 25) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                      style={{
                        height: "100%",
                        background: barFill,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>

                {/* Prescriptive RevOps Remedy Strip */}
                <div
                  style={{
                    padding: "10px 14px",
                    background: "rgba(45, 62, 80, 0.04)",
                    borderRadius: "6px",
                    border: "1px solid var(--hs-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: "12px", color: "var(--hs-text)", lineHeight: 1.4, flex: 1, minWidth: 260 }}>
                    🎯 <strong>Prescriptive AI Remedy:</strong> {stage.recommendedAction}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {stage.stalledDeals > 0 && (
                      <span
                        style={{
                          background: "rgba(255, 153, 0, 0.14)",
                          color: "#b76e00",
                          fontSize: "11px",
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          border: "1px solid rgba(255, 153, 0, 0.3)",
                        }}
                      >
                        {stage.stalledDeals} Stalled Deals (${(stage.revenueAtRisk / 1000).toFixed(0)}K)
                      </span>
                    )}

                    <button
                      onClick={() => {
                        showToast(`⚡ Enforced automated RevOps acceleration playbooks for ${stage.stage}.`);
                        logAuditEvent({
                          actor: "Peash Rudra",
                          role: "VP Sales Ops",
                          actionType: "Funnel Acceleration Triggered",
                          targetObject: stage.stage,
                          tier: "Tier 2 (Assisted Task)",
                          status: "Success",
                          details: `Enforced prescriptive acceleration action: ${stage.recommendedAction}`,
                        });
                      }}
                      style={{
                        padding: "4px 10px",
                        background: "#ff5c35",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      ⚡ Accelerate Stage
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
