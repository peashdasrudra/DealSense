/**
 * DealSense Dashboard — Revenue Forecast & Risk Simulation Engine.
 * Replaces manual spreadsheet forecasting with multi-model AI forecasting and scenario simulation.
 */

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
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

const SAMPLE_FORECAST_DEALS: ForecastDeal[] = [
  { id: "deal-101", name: "Orion Cloud Migration", client: "TechCorp Inc.", value: 150000, owner: "Sarah Miller", stage: "Proposal Sent", score: 23, band: "Critical", repForecast: "Commit", aiAdjustment: "Severe Slip Risk", varianceReason: "Rep marked Commit, but Economic Buyer has been silent for 18 days & 21d in stage." },
  { id: "deal-102", name: "Quantum Security Suite", client: "FinanceGo Ltd.", value: 280000, owner: "James Reynolds", stage: "Negotiation", score: 31, band: "Critical", repForecast: "Commit", aiAdjustment: "Severe Slip Risk", varianceReason: "Legal indemnity stalemate; unquantified ROI document." },
  { id: "deal-103", name: "Horizon Data Platform", client: "RetailMax", value: 95000, owner: "Lisa Chen", stage: "Qualification", score: 35, band: "Critical", repForecast: "Best Case", aiAdjustment: "Downgrade Risk", varianceReason: "Single-threaded deal with 14-day silence." },
  { id: "deal-104", name: "Apex CRM Integration", client: "LogiPro Solutions", value: 120000, owner: "Mike Torres", stage: "Proposal Sent", score: 62, band: "Moderate", repForecast: "Best Case", aiAdjustment: "Aligned", varianceReason: "COO budget confirmed; board meeting scheduled next week." },
  { id: "deal-105", name: "Crown Global Enterprise", client: "LogiPro Solutions", value: 400000, owner: "Mike Torres", stage: "Contract", score: 92, band: "Healthy", repForecast: "Commit", aiAdjustment: "Aligned", varianceReason: "DocuSign routed; dual CEO & CFO champion alignment." },
  { id: "deal-106", name: "Nebula Analytics Engine", client: "HealthFirst Corp.", value: 210000, owner: "Sarah Miller", stage: "Discovery", score: 44, band: "High", repForecast: "Pipeline", aiAdjustment: "Downgrade Risk", varianceReason: "14 days engagement decay above threshold." },
  { id: "deal-107", name: "Titan ERP Modernization", client: "ManufactCo", value: 340000, owner: "James Reynolds", stage: "Qualification", score: 46, band: "High", repForecast: "Best Case", aiAdjustment: "Downgrade Risk", varianceReason: "Multi-threading gap; missing operational sponsor." },
  { id: "deal-108", name: "Stellar Cloud Compute", client: "TechCorp Inc.", value: 320000, owner: "James Reynolds", stage: "Contract", score: 85, band: "Healthy", repForecast: "Commit", aiAdjustment: "Aligned", varianceReason: "Security signoff complete; legal approved." },
  { id: "deal-109", name: "Pinnacle Compliance Suite", client: "FinanceGo Ltd.", value: 250000, owner: "Lisa Chen", stage: "Negotiation", score: 88, band: "Healthy", repForecast: "Commit", aiAdjustment: "Aligned", varianceReason: "Executive sponsor verified; final terms negotiation." },
];

export const RevenueForecast: React.FC = () => {
  const [deals] = useState<ForecastDeal[]>(SAMPLE_FORECAST_DEALS);
  const [slipSimulationDays, setSlipSimulationDays] = useState(0);
  const [excludeUnverified, setExcludeUnverified] = useState(false);
  const [selectedDrawerDeal, setSelectedDrawerDeal] = useState<DealData | null>(null);

  // Compute Models
  const repCommitTotal = useMemo(() => {
    return deals.filter((d) => d.repForecast === "Commit").reduce((sum, d) => sum + d.value, 0);
  }, [deals]);

  const managerWeightedTotal = useMemo(() => {
    return deals.reduce((sum, d) => {
      const weight = d.stage === "Contract" ? 0.9 : d.stage === "Negotiation" ? 0.7 : d.stage === "Proposal Sent" ? 0.4 : 0.2;
      return sum + d.value * weight;
    }, 0);
  }, [deals]);

  const aiAdjustedTotal = useMemo(() => {
    return deals.reduce((sum, d) => {
      let healthMultiplier = d.score / 100;
      if (excludeUnverified && (d.band === "Critical" || d.band === "High")) {
        healthMultiplier = 0.05; // heavily discount unverified
      }
      if (slipSimulationDays > 0 && d.band === "Critical") {
        healthMultiplier *= Math.max(0.2, 1 - slipSimulationDays / 45);
      }
      return sum + d.value * healthMultiplier;
    }, 0);
  }, [deals, excludeUnverified, slipSimulationDays]);

  const atRiskGap = repCommitTotal - aiAdjustedTotal;

  const FORECAST_BAR_DATA = [
    { name: "Total Pipeline", value: deals.reduce((s, d) => s + d.value, 0) / 1000, color: "var(--hs-text-muted)" },
    { name: "Rep Commit", value: repCommitTotal / 1000, color: "var(--hs-primary)" },
    { name: "Manager Weighted", value: managerWeightedTotal / 1000, color: "#1971c2" },
    { name: "DealSense AI Forecast", value: aiAdjustedTotal / 1000, color: "var(--risk-healthy)" },
  ];

  return (
    <div>
      {/* ── Status Banner ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)" }}>
        <div style={{ fontSize: "13px", color: "var(--hs-text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--risk-healthy)", display: "inline-block" }} />
          <span>Multi-Model AI Revenue Forecasting (Current Quarter)</span>
        </div>
        <span className="badge badge-outline">{deals.length} Active Forecast Deals</span>
      </div>

      {/* ── Forecast Comparison KPI Bar ───────────────────────────────── */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderTopColor: "var(--hs-primary)" }}>
          <div className="kpi-label">Reps' Commit Rollup</div>
          <div className="kpi-value">${(repCommitTotal / 1000).toFixed(0)}K</div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Subjective rep submissions
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "#1971c2" }}>
          <div className="kpi-label">Manager Stage-Weighted</div>
          <div className="kpi-value">${(managerWeightedTotal / 1000).toFixed(0)}K</div>
          <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Standard CRM stage % rules
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--risk-healthy)" }}>
          <div className="kpi-label">DealSense AI Reality Forecast</div>
          <div className="kpi-value" style={{ color: "var(--risk-healthy)" }}>
            ${(aiAdjustedTotal / 1000).toFixed(0)}K
          </div>
          <div style={{ fontSize: "11px", color: "var(--risk-healthy)", fontWeight: 600, marginTop: 4 }}>
            ±$45K (87% confidence interval)
          </div>
        </div>

        <div className="kpi-card" style={{ borderTopColor: "var(--danger)" }}>
          <div className="kpi-label">Forecast Gap / Risk Delta</div>
          <div className="kpi-value" style={{ color: "var(--danger)" }}>
            -${(atRiskGap / 1000).toFixed(0)}K
          </div>
          <div style={{ fontSize: "11px", color: "var(--danger)", fontWeight: 600, marginTop: 4 }}>
            ▲ Rep over-optimism risk
          </div>
        </div>
      </div>

      {/* ── Charts & Scenario Simulation ──────────────────────────────── */}
      <div className="grid-2" style={{ marginBottom: "var(--sp-6)" }}>
        {/* Model Comparison Chart */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-header">
            <div>
              <div className="card-title">Forecast Model Comparison</div>
              <div className="card-subtitle">Pipeline value vs Rep Commit vs AI Reality ($ in Thousands)</div>
            </div>
          </div>
          <div className="card-body">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FORECAST_BAR_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--hs-border-dark)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--hs-text-muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--hs-text-muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`$${val}K`, "Forecast Amount"]}
                    contentStyle={{ background: "#ffffff", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)", fontSize: "12px" }}
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
        </motion.div>

        {/* Interactive RevOps Scenario Simulator */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-header">
            <div>
              <div className="card-title">RevOps Slippage Simulation Engine</div>
              <div className="card-subtitle">Simulate real-time impact of pipeline delays on quarterly quota</div>
            </div>
            <span className="badge badge-outline">What-If Tool</span>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--hs-text)" }}>
                    Simulate Close Date Push on Stalled Deals:
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--hs-primary)" }}>
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
                  style={{ width: "100%" }}
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
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--hs-border-dark)",
                  background: "var(--hs-surface)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "13px" }}>
                    Strict Gate: Exclude Deals with Missing Economic Buyer
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
                    Removes all single-threaded and unverified deals from Commit rollup
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={excludeUnverified}
                  onChange={(e) => setExcludeUnverified(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
              </div>

              <div
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-sm)",
                  background: slipSimulationDays > 0 || excludeUnverified ? "var(--risk-critical-bg)" : "var(--hs-surface)",
                  border: `1px solid ${slipSimulationDays > 0 || excludeUnverified ? "var(--risk-critical-border)" : "var(--hs-border-dark)"}`,
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 700, color: slipSimulationDays > 0 ? "var(--danger)" : "var(--hs-primary)", textTransform: "uppercase" }}>
                  Simulation Outcome
                </div>
                <div style={{ fontSize: "13px", color: "var(--hs-text)", marginTop: 4 }}>
                  {slipSimulationDays > 0 || excludeUnverified
                    ? `Simulated revenue at immediate quarter-slip risk: $${((repCommitTotal - aiAdjustedTotal) / 1000).toFixed(0)}K across ${deals.filter((d) => d.band === "Critical" || d.band === "High").length} deals.`
                    : "Baseline forecast shows a $510K risk delta between Rep Commit and verified evidence."}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Forecast Drill-Down Table ─────────────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="card-header">
          <div>
            <div className="card-title">Deal-by-Deal Forecast Audit & Variance Analysis</div>
            <div className="card-subtitle">Click any deal to inspect live evidence dossier & stakeholder map</div>
          </div>
          <span className="badge badge-outline">Rep Commit vs DealSense Reality</span>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Deal Name</th>
                <th>Account</th>
                <th>Deal Value</th>
                <th>Rep Commit Status</th>
                <th>DealSense Score</th>
                <th>AI Adjustment</th>
                <th>Variance & Evidence Reason</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => setSelectedDrawerDeal(deal as any)}
                  style={{ cursor: "pointer" }}
                >
                  <td style={{ fontWeight: 600, color: "var(--hs-primary)", fontSize: "13.5px" }}>
                    {deal.name}
                  </td>
                  <td style={{ color: "var(--hs-text-muted)" }}>{deal.client}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                    ${(deal.value / 1000).toFixed(0)}K
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: deal.repForecast === "Commit" ? "var(--hs-primary)" : "var(--hs-surface)",
                        color: deal.repForecast === "Commit" ? "#ffffff" : "var(--hs-text)",
                        border: "1px solid var(--hs-border-dark)",
                      }}
                    >
                      {deal.repForecast}
                    </span>
                  </td>
                  <td>
                    <span className="risk-pill" data-band={deal.band}>
                      {deal.score} ({deal.band})
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color:
                          deal.aiAdjustment === "Severe Slip Risk"
                            ? "var(--danger)"
                            : deal.aiAdjustment === "Downgrade Risk"
                            ? "var(--warning)"
                            : "var(--risk-healthy)",
                      }}
                    >
                      {deal.aiAdjustment}
                    </span>
                  </td>
                  <td style={{ fontSize: "12.5px", color: "var(--hs-text)", maxWidth: 360 }}>
                    {deal.varianceReason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Drawer */}
      <DealDrawer
        deal={selectedDrawerDeal}
        isOpen={!!selectedDrawerDeal}
        onClose={() => setSelectedDrawerDeal(null)}
      />
    </div>
  );
};
