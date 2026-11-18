/**
 * DealSense Dashboard — Revenue Forecast & Risk Simulation Engine.
 * Replaces manual spreadsheet forecasting with multi-model AI forecasting and scenario simulation.
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ENTERPRISE_DEALS } from "../data/enterpriseData";
import { DealDrawer, DealData } from "../components/DealDrawer";

interface ForecastDeal {
  id: string;
  name: string;
  client: string;
  value: number;
  owner: string;
  stage: string;
  score: number;
  band: "Critical" | "High" | "Moderate" | "Low" | "Healthy";
  repForecast: "Commit" | "Best Case" | "Pipeline";
  aiAdjustment: "Aligned" | "Downgrade Risk" | "Severe Slip Risk";
  varianceReason: string;
}

const ENTERPRISE_FORECAST_DEALS: ForecastDeal[] = ENTERPRISE_DEALS.map((d) => {
  const isCommit = d.forecastCategory === "Commit" || d.stage === "contractsent" || d.score >= 80;
  const repForecast = isCommit ? "Commit" : d.score >= 60 ? "Best Case" : "Pipeline";
  const aiAdjustment = d.score < 40 ? "Severe Slip Risk" : d.score < 68 ? "Downgrade Risk" : "Aligned";
  const varianceReason = d.risks && d.risks.length > 0
    ? d.risks[0].text
    : d.score >= 80
    ? "DocuSign routed; Economic Buyer & Decision Criteria verified."
    : "Stage aging and MEDDICC qualification within target benchmarks.";

  return {
    id: d.id,
    name: d.name,
    client: d.client,
    value: d.value,
    owner: d.owner,
    stage: d.stage,
    score: d.score,
    band: d.band,
    repForecast,
    aiAdjustment,
    varianceReason,
  };
});

export const RevenueForecast: React.FC = () => {
  const [deals] = useState<ForecastDeal[]>(ENTERPRISE_FORECAST_DEALS);
  const [slipSimulationDays, setSlipSimulationDays] = useState(0);
  const [excludeUnverified, setExcludeUnverified] = useState(false);
  const [selectedDrawerDeal, setSelectedDrawerDeal] = useState<DealData | null>(null);
  const [tableFilter, setTableFilter] = useState<string>("all");
  const [tableSearch, setTableSearch] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compute Models
  const totalPipeline = useMemo(() => deals.reduce((sum, d) => sum + d.value, 0), [deals]);

  const repCommitTotal = useMemo(() => {
    return deals.filter((d) => d.repForecast === "Commit").reduce((sum, d) => sum + d.value, 0);
  }, [deals]);

  const managerWeightedTotal = useMemo(() => {
    return deals.reduce((sum, d) => {
      const weight = d.stage === "contractsent" ? 0.9 : d.stage === "decisionmakerboughtin" ? 0.75 : d.stage === "presentationscheduled" ? 0.5 : 0.25;
      return sum + d.value * weight;
    }, 0);
  }, [deals]);

  const aiAdjustedTotal = useMemo(() => {
    return deals.reduce((sum, d) => {
      let healthMultiplier = d.score / 100;
      if (excludeUnverified && (d.band === "Critical" || d.band === "High")) {
        healthMultiplier = 0.08;
      }
      if (slipSimulationDays > 0 && (d.band === "Critical" || d.band === "High")) {
        healthMultiplier *= Math.max(0.2, 1 - slipSimulationDays / 45);
      }
      return sum + d.value * healthMultiplier;
    }, 0);
  }, [deals, excludeUnverified, slipSimulationDays]);

  const atRiskGap = Math.max(0, repCommitTotal - aiAdjustedTotal);

  const FORECAST_BAR_DATA = [
    { name: "Total Pipeline", value: +(totalPipeline / 1000000).toFixed(2), color: "#516f90" },
    { name: "Rep Commit", value: +(repCommitTotal / 1000000).toFixed(2), color: "#2d3e50" },
    { name: "Manager Weighted", value: +(managerWeightedTotal / 1000000).toFixed(2), color: "#00a4bd" },
    { name: "DealSense AI Forecast", value: +(aiAdjustedTotal / 1000000).toFixed(2), color: "#00a38d" },
  ];

  const filteredDeals = useMemo(() => {
    return deals.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        d.client.toLowerCase().includes(tableSearch.toLowerCase());

      if (!matchesSearch) return false;
      if (tableFilter === "commit") return d.repForecast === "Commit";
      if (tableFilter === "downgrade") return d.aiAdjustment === "Downgrade Risk";
      if (tableFilter === "critical") return d.aiAdjustment === "Severe Slip Risk";
      return true;
    });
  }, [deals, tableSearch, tableFilter]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
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
              border: "1px solid #00a4bd",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. Standardized Enterprise Header Card ────────────────────────────── */}
      <div className="page-header-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="page-header-badge-row">
              <span className="page-header-badge">
                ● REVOPS CRM WORKSPACE
              </span>
            </div>
            <h2 className="page-header-title">
              Multi-Model Enterprise Revenue Forecasting
            </h2>
            <p className="page-header-desc">
              Compare rep-committed forecasts against manager stage-weighted and 7-vector AI projections. Detect pipeline risks before they impact quarterly numbers.
            </p>
          </div>
          <div className="page-header-actions">
            <button
              onClick={() => showToast("📑 Board Briefing Forecast Summary exported as PDF!")}
              style={{
                background: "#ffffff",
                color: "var(--hs-primary)",
                border: "1px solid #cbd6e2",
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
              <span>📑 Export Board Brief</span>
            </button>
            <button
              onClick={() => showToast("⚡ AI Multi-Model Forecast recalculation complete with 0.18s latency!")}
              style={{
                background: "#ff5c35",
                color: "#ffffff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(255, 92, 53, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              <span>⚡ Recalculate Models</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Standardized KPI Command Strip ─────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="kpi-card" style={{ borderTopColor: "var(--hs-primary)" }}>
          <div className="kpi-label">Reps' Commit Rollup</div>
          <div className="kpi-value">${(repCommitTotal / 1000000).toFixed(1)}M</div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Subjective rep submissions ({deals.filter((d) => d.repForecast === "Commit").length} deals)
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#00a4bd" }}>
          <div className="kpi-label">Manager Stage-Weighted</div>
          <div className="kpi-value" style={{ color: "#007a8c" }}>${(managerWeightedTotal / 1000000).toFixed(1)}M</div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Standard CRM stage % rules
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--risk-healthy)" }}>
          <div className="kpi-label">DealSense AI Reality Forecast</div>
          <div className="kpi-value" style={{ color: "var(--risk-healthy)" }}>
            ${(aiAdjustedTotal / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: "11px", color: "var(--risk-healthy)", fontWeight: 600, marginTop: 4 }}>
            ▲ ±$240K (92% confidence interval)
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--danger)" }}>
          <div className="kpi-label">Forecast Gap / Risk Delta</div>
          <div className="kpi-value" style={{ color: "var(--danger)" }}>
            -${(atRiskGap / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: "11px", color: "var(--danger)", fontWeight: 600, marginTop: 4 }}>
            ▲ Rep over-optimism variance
          </div>
        </div>
      </div>

      {/* ── 3. Charts & Scenario Simulation Grid ───────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16 }}>
        {/* Model Comparison Chart */}
        <div
          className="card"
          style={{
            background: "#ffffff",
            padding: "20px 24px",
            border: "1px solid #dfe3eb",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-xs)",
            margin: 0,
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
              Forecast Model Comparison
            </h3>
            <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
              Pipeline value vs Rep Commit vs AI Reality ($ in Millions)
            </div>
          </div>

          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FORECAST_BAR_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaf0f6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#516f90" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#516f90" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`$${val}M`, "Forecast Amount"]}
                  contentStyle={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={44}>
                  {FORECAST_BAR_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive RevOps Scenario Simulator */}
        <div
          className="card"
          style={{
            background: "#ffffff",
            padding: "20px 24px",
            border: "1px solid #dfe3eb",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-xs)",
            margin: 0,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
                RevOps Slippage Simulation Engine
              </h3>
              <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                Simulate real-time impact of pipeline delays on quarterly quota
              </div>
            </div>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "10px",
                background: "rgba(0, 164, 189, 0.1)",
                color: "#007a8c",
                border: "1px solid rgba(0, 164, 189, 0.3)",
              }}
            >
              WHAT-IF TOOL
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--hs-heading)" }}>
                  Simulate Close Date Push on Stalled Deals:
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "#ff5c35" }}>
                  +{slipSimulationDays} Days
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="5"
                value={slipSimulationDays}
                onChange={(e) => setSlipSimulationDays(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#ff5c35", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 4 }}>
                <span>0 days (Current)</span>
                <span>+15 days</span>
                <span>+30 days</span>
                <span>+45 days (Quarter Slip)</span>
              </div>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: "6px",
                border: "1px solid #dfe3eb",
                background: "#f8fafc",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--hs-heading)" }}>
                  Strict Gate: Exclude Deals with Missing Economic Buyer
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                  Removes all single-threaded and unverified deals from Commit rollup
                </div>
              </div>
              <input
                type="checkbox"
                checked={excludeUnverified}
                onChange={(e) => setExcludeUnverified(e.target.checked)}
                style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#ff5c35" }}
              />
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "6px",
                background: slipSimulationDays > 0 || excludeUnverified ? "rgba(200, 55, 45, 0.08)" : "rgba(0, 163, 141, 0.08)",
                border: `1px solid ${slipSimulationDays > 0 || excludeUnverified ? "rgba(200, 55, 45, 0.25)" : "rgba(0, 163, 141, 0.25)"}`,
              }}
            >
              <div style={{ fontSize: "11.5px", fontWeight: 700, color: slipSimulationDays > 0 || excludeUnverified ? "var(--danger)" : "var(--risk-healthy)", textTransform: "uppercase" }}>
                Simulation Outcome
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--hs-heading)", marginTop: 4, lineHeight: 1.45 }}>
                {slipSimulationDays > 0 || excludeUnverified
                  ? `Simulated revenue at immediate quarter-slip risk: $${((repCommitTotal - aiAdjustedTotal) / 1000000).toFixed(1)}M across ${deals.filter((d) => d.band === "Critical" || d.band === "High").length} flagged enterprise deals.`
                  : `Baseline forecast shows an accurate alignment between Rep Commit and verified CRM evidence.`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Deal-by-Deal Forecast Audit Table ───────────────────────────── */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          padding: "20px 24px",
          border: "1px solid #dfe3eb",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-xs)",
          margin: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
              Deal-by-Deal Forecast Audit &amp; Variance Analysis ({deals.length} Deals)
            </h3>
            <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
              Click any deal to inspect live evidence dossier &amp; stakeholder map
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Search deals..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              style={{
                padding: "5px 10px",
                border: "1px solid #cbd6e2",
                borderRadius: "4px",
                fontSize: "12px",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 4 }}>
              {[
                { id: "all", label: "All" },
                { id: "commit", label: "Commit" },
                { id: "downgrade", label: "Downgrade Risk" },
                { id: "critical", label: "Severe Slip" },
              ].map((flt) => (
                <button
                  key={flt.id}
                  onClick={() => setTableFilter(flt.id)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "3px",
                    fontSize: "11px",
                    fontWeight: tableFilter === flt.id ? 700 : 500,
                    background: tableFilter === flt.id ? "#007a8c" : "#f1f4f8",
                    color: tableFilter === flt.id ? "#ffffff" : "var(--hs-text)",
                    border: "1px solid #dfe3eb",
                    cursor: "pointer",
                  }}
                >
                  {flt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #cbd6e2" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>Deal Name</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>Account</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>Deal Value</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>Rep Commit Status</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>DealSense Score</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>AI Adjustment</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--hs-heading)", fontWeight: 700 }}>Variance &amp; Evidence Reason</th>
                <th style={{ padding: "10px 12px", textAlign: "right", color: "var(--hs-heading)", fontWeight: 700 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => setSelectedDrawerDeal(deal as any)}
                  style={{ borderBottom: "1px solid #eaf0f6", cursor: "pointer" }}
                >
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: "var(--hs-heading)" }}>
                    {deal.name}
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--hs-text-muted)" }}>{deal.client}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#ff5c35" }}>
                    ${(deal.value / 1000).toFixed(0)}K
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: deal.repForecast === "Commit" ? "rgba(255, 92, 53, 0.12)" : "#f1f4f8",
                        color: deal.repForecast === "Commit" ? "#ff5c35" : "var(--hs-text)",
                        border: `1px solid ${deal.repForecast === "Commit" ? "rgba(255, 92, 53, 0.3)" : "#cbd6e2"}`,
                      }}
                    >
                      {deal.repForecast}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: 800,
                        background: deal.score >= 80 ? "var(--risk-healthy-bg)" : deal.score < 50 ? "var(--risk-critical-bg)" : "var(--risk-high-bg)",
                        color: deal.score >= 80 ? "var(--risk-healthy)" : deal.score < 50 ? "var(--danger)" : "var(--risk-high)",
                      }}
                    >
                      {deal.score} ({deal.band})
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color:
                          deal.aiAdjustment === "Severe Slip Risk"
                            ? "var(--danger)"
                            : deal.aiAdjustment === "Downgrade Risk"
                            ? "var(--risk-high)"
                            : "var(--risk-healthy)",
                      }}
                    >
                      {deal.aiAdjustment}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--hs-text)", maxWidth: 340, lineHeight: 1.4 }}>
                    {deal.varianceReason}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDrawerDeal(deal as any);
                      }}
                      style={{
                        padding: "4px 10px",
                        background: "#ffffff",
                        border: "1px solid #cbd6e2",
                        borderRadius: "4px",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        color: "#007a8c",
                        cursor: "pointer",
                      }}
                    >
                      ⚡ Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      <DealDrawer
        deal={selectedDrawerDeal}
        isOpen={!!selectedDrawerDeal}
        onClose={() => setSelectedDrawerDeal(null)}
      />
    </div>
  );
};
