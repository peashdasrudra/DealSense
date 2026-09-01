/**
 * DealSense — Pipeline Waterfall & Stage Velocity Bottleneck Engine.
 * Built for RevOps leaders and CROs to track pipeline inflows, slippages, stage stagnation, and velocity leaks.
 */

import React, { useState } from "react";

interface WaterfallItem {
  category: string;
  amount: number;
  type: "start" | "add" | "subtract" | "end";
  count: number;
  description: string;
}

interface StageVelocity {
  stage: string;
  avgDays: number;
  benchmarkDays: number;
  conversionRate: number;
  benchmarkConversion: number;
  stalledDeals: number;
  revenueAtRisk: number;
  bottleneckSeverity: "Critical" | "Moderate" | "Optimal";
  recommendedAction: string;
}

const WATERFALL_DATA: WaterfallItem[] = [
  { category: "Starting Pipeline (Nov 1)", amount: 2450000, type: "start", count: 24, description: "Pipeline brought forward into the month" },
  { category: "+ Inbound & SDR Created", amount: 620000, type: "add", count: 8, description: "New qualified deals added this month" },
  { category: "+ Stage Expansion", amount: 140000, type: "add", count: 3, description: "Upsell & seat additions on active proposals" },
  { category: "− Closed Won Revenue", amount: -480000, type: "subtract", count: 4, description: "Successfully executed contracts" },
  { category: "− Pushed / Slipped Close Dates", amount: -390000, type: "subtract", count: 5, description: "Deals pushed past current calendar month" },
  { category: "− Closed Lost / Ghosted", amount: -210000, type: "subtract", count: 3, description: "Lost to competitor or budget freeze" },
  { category: "Ending Active Pipeline", amount: 2130000, type: "end", count: 23, description: "Current active deals closing this quarter" },
];

const STAGE_VELOCITY_DATA: StageVelocity[] = [
  {
    stage: "1. Discovery Call",
    avgDays: 7.2,
    benchmarkDays: 9.0,
    conversionRate: 72,
    benchmarkConversion: 65,
    stalledDeals: 1,
    revenueAtRisk: 45000,
    bottleneckSeverity: "Optimal",
    recommendedAction: "Pacing ahead of target. Maintain current SDR qualification criteria.",
  },
  {
    stage: "2. Technical Validation",
    avgDays: 21.4,
    benchmarkDays: 12.0,
    conversionRate: 54,
    benchmarkConversion: 62,
    stalledDeals: 4,
    revenueAtRisk: 380000,
    bottleneckSeverity: "Critical",
    recommendedAction: "Pre-seed standard Infosec & SOC2 packages to eliminate 9 days of security review delay.",
  },
  {
    stage: "3. Proposal Sent",
    avgDays: 18.6,
    benchmarkDays: 10.0,
    conversionRate: 48,
    benchmarkConversion: 58,
    stalledDeals: 5,
    revenueAtRisk: 420000,
    bottleneckSeverity: "Critical",
    recommendedAction: "Enforce Mutual Action Plan (MAP) requirement before sending proposal pricing.",
  },
  {
    stage: "4. Negotiation & Legal",
    avgDays: 16.2,
    benchmarkDays: 11.0,
    conversionRate: 68,
    benchmarkConversion: 75,
    stalledDeals: 3,
    revenueAtRisk: 510000,
    bottleneckSeverity: "Moderate",
    recommendedAction: "Offer pre-approved fallback redline terms for cyber indemnification.",
  },
  {
    stage: "5. Contract Ready",
    avgDays: 4.1,
    benchmarkDays: 5.0,
    conversionRate: 91,
    benchmarkConversion: 90,
    stalledDeals: 0,
    revenueAtRisk: 0,
    bottleneckSeverity: "Optimal",
    recommendedAction: "DocuSign turnaround is healthy. Maintain automated reminder cadences.",
  },
];

export const PipelineWaterfall: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"This Month" | "This Quarter" | "Year to Date">("This Month");
  const [activeStageFilter, setActiveStageFilter] = useState<string>("All");

  const totalSlippedRevenue = Math.abs(WATERFALL_DATA.find((w) => w.category.includes("Pushed"))?.amount || 0);
  const totalCreatedRevenue = WATERFALL_DATA.find((w) => w.category.includes("Created"))?.amount || 0;
  const criticalBottleneckRevenue = STAGE_VELOCITY_DATA.filter((s) => s.bottleneckSeverity === "Critical").reduce((sum, s) => sum + s.revenueAtRisk, 0);

  const filteredStages = activeStageFilter === "All" ? STAGE_VELOCITY_DATA : STAGE_VELOCITY_DATA.filter((s) => s.bottleneckSeverity === activeStageFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      {/* ── Header Card ───────────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          padding: "20px 24px",
          border: "1px solid var(--hs-border-dark)",
          borderTop: "3px solid var(--hs-primary)",
          marginBottom: "var(--sp-5)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge" style={{ background: "rgba(255, 122, 89, 0.1)", color: "#ff7a59", border: "1px solid #00a4bd", fontWeight: 700 }}>
                ● REVOPS PIPELINE TELEMETRY
              </span>
              <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>HubSpot Webhook Stream Ingestion</span>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--hs-heading)", margin: "4px 0 6px" }}>
              Pipeline Waterfall & Stage Velocity Bottleneck Diagnostic
            </h2>
            <p style={{ fontSize: "13.5px", color: "var(--hs-text)", margin: 0, maxWidth: 680 }}>
              Track pipeline creation, stage duration decay, and deal slippage across every stage of your sales funnel. Surface exact bottlenecks before they derail quarterly revenue targets.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <button
              style={{
                padding: "6px 14px",
                background: "#ffffff",
                color: "var(--hs-text)",
                border: "1px solid var(--hs-border-dark)",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s"
              }}
            >
              Export Forecast
            </button>
            <button
              style={{
                padding: "6px 14px",
                background: "#ff5c35",
                color: "#ffffff",
                border: "none",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s"
              }}
            >
              Run Simulation
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, background: "rgba(255, 255, 255, 0.1)", padding: 4, borderRadius: "var(--radius-sm)" }}>
            {(["This Month", "This Quarter", "Year to Date"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTimeframe(t)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: selectedTimeframe === t ? "#ff5c35" : "transparent",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: selectedTimeframe === t ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Row ───────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card" style={{ borderTopColor: "var(--risk-healthy)" }}>
          <div className="kpi-title">New Pipeline Created</div>
          <div className="kpi-value" style={{ color: "var(--risk-healthy)" }}>
            +${(totalCreatedRevenue / 1000).toFixed(0)}K
          </div>
          <div className="kpi-subtitle">8 new qualified opportunities</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--danger)" }}>
          <div className="kpi-title">Pipeline Slipped / Pushed</div>
          <div className="kpi-value" style={{ color: "var(--danger)" }}>
            −${(totalSlippedRevenue / 1000).toFixed(0)}K
          </div>
          <div className="kpi-subtitle">5 deals pushed past current month</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#ff5c35" }}>
          <div className="kpi-title">Bottleneck Revenue Exposure</div>
          <div className="kpi-value" style={{ color: "#ff5c35" }}>
            ${(criticalBottleneckRevenue / 1000).toFixed(0)}K
          </div>
          <div className="kpi-subtitle">Stalled in Tech Eval & Proposal</div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--hs-primary)" }}>
          <div className="kpi-title">Average Sales Cycle</div>
          <div className="kpi-value">67.5 Days</div>
          <div className="kpi-subtitle">+9.2 days above target benchmark</div>
        </div>
      </div>

      {/* ── Pipeline Waterfall Breakdown ──────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Pipeline Movement Waterfall ({selectedTimeframe})</div>
            <div className="card-subtitle">Detailed inflow, outflow, and net pipeline velocity dynamics</div>
          </div>
          <span className="badge" style={{ background: "var(--hs-surface)", color: "var(--hs-primary)", fontWeight: 700 }}>
            $2.13M Active Pipeline
          </span>
        </div>
        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {WATERFALL_DATA.map((item, idx) => {
            const isAdd = item.type === "add";
            const isSub = item.type === "subtract";
            const isTotal = item.type === "start" || item.type === "end";
            const color = isAdd ? "var(--risk-healthy)" : isSub ? "var(--danger)" : "var(--hs-primary)";

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: isTotal ? "var(--hs-surface)" : "#ffffff",
                  border: isTotal ? "1.5px solid var(--hs-border-dark)" : "1px solid var(--hs-border)",
                  borderLeft: `4px solid ${color}`,
                }}
              >
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--hs-primary)" }}>
                    {item.category}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
                    {item.description} · {item.count} Deals
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "15px", fontWeight: 800, color }}>
                    {item.amount > 0 && item.type !== "start" && item.type !== "end" ? "+" : ""}
                    ${(Math.abs(item.amount) / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Stage Velocity & Bottleneck Diagnostic ────────────────────── */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Stage Velocity & Funnel Duration Bottlenecks</div>
            <div className="card-subtitle">Comparing actual days in stage against historical benchmarks</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["All", "Critical", "Moderate", "Optimal"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveStageFilter(f)}
                className={`btn ${activeStageFilter === f ? "btn-primary" : "btn-secondary"} btn-sm`}
                style={{ fontSize: "11px", padding: "3px 8px" }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="card-body">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filteredStages.map((stage) => {
              const isCrit = stage.bottleneckSeverity === "Critical";
              const isMod = stage.bottleneckSeverity === "Moderate";
              const badgeBg = isCrit ? "var(--risk-critical-bg)" : isMod ? "var(--risk-high-bg)" : "var(--risk-healthy-bg)";
              const badgeColor = isCrit ? "var(--danger)" : isMod ? "var(--warning)" : "var(--risk-healthy)";

              return (
                <div
                  key={stage.stage}
                  style={{
                    padding: "16px 18px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--hs-border-dark)",
                    background: isCrit ? "rgba(201, 42, 42, 0.02)" : "#ffffff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: "14.5px", fontWeight: 800, color: "var(--hs-primary)" }}>
                        {stage.stage}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                        Conversion: <strong>{stage.conversionRate}%</strong> (Benchmark: {stage.benchmarkConversion}%)
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: isCrit ? "var(--danger)" : "var(--hs-primary)" }}>
                          {stage.avgDays} Days Avg
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>
                          Target: {stage.benchmarkDays}d ({stage.avgDays > stage.benchmarkDays ? `+${(stage.avgDays - stage.benchmarkDays).toFixed(1)}d slow` : "On pace"})
                        </div>
                      </div>

                      <span className="badge" style={{ background: badgeBg, color: badgeColor, fontWeight: 700, fontSize: "10.5px" }}>
                        {stage.bottleneckSeverity}
                      </span>
                    </div>
                  </div>

                  {/* Visual Duration Comparison Bar */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ height: 6, width: "100%", background: "var(--hs-surface)", borderRadius: 3, overflow: "hidden", position: "relative" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(100, (stage.avgDays / 25) * 100)}%`,
                          background: isCrit ? "var(--danger)" : isMod ? "var(--warning)" : "var(--risk-healthy)",
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>

                  {/* RevOps Prescriptive Action */}
                  <div style={{ padding: "8px 12px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ fontSize: "12px", color: "var(--hs-text)", lineHeight: 1.4 }}>
                      🎯 <strong>RevOps Remedy:</strong> {stage.recommendedAction}
                    </div>
                    {stage.stalledDeals > 0 && (
                      <span className="badge" style={{ background: "var(--risk-high-bg)", color: "var(--warning)", fontSize: "10px", fontWeight: 700 }}>
                        {stage.stalledDeals} Stalled Deals (${(stage.revenueAtRisk / 1000).toFixed(0)}K)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
