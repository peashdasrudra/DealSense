/**
 * DealSense Dashboard — Portfolio Overview Page.
 * Canvas Design System Edition.
 * Wired to Real FastAPI Backend with graceful Enterprise fallback.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { fetchDeals } from "../api";

import { DealDrawer, DealData } from "../components/DealDrawer";

// ── Default Enterprise Sample Deals (used if DB has no seed data yet) ────────
const SAMPLE_DEALS = [
  { id: "1", name: "Orion Cloud Migration", client: "TechCorp Inc.", score: 23, band: "Critical", value: 150000, owner: "Sarah Miller", stage: "Proposal" },
  { id: "2", name: "Quantum Security Suite", client: "FinanceGo Ltd.", score: 31, band: "Critical", value: 280000, owner: "James Reynolds", stage: "Negotiation" },
  { id: "3", name: "Horizon Data Platform", client: "RetailMax", score: 35, band: "Critical", value: 95000, owner: "Lisa Chen", stage: "Qualification" },
  { id: "4", name: "Apex CRM Integration", client: "LogiPro Solutions", score: 38, band: "Critical", value: 120000, owner: "Mike Torres", stage: "Proposal" },
  { id: "5", name: "Nebula Analytics Engine", client: "HealthFirst Corp.", score: 44, band: "High", value: 210000, owner: "Sarah Miller", stage: "Discovery" },
  { id: "6", name: "Titan ERP Modernization", client: "ManufactCo", score: 46, band: "High", value: 340000, owner: "James Reynolds", stage: "Qualification" },
  { id: "7", name: "Atlas Data Warehouse", client: "TechCorp Inc.", score: 48, band: "High", value: 180000, owner: "Lisa Chen", stage: "Proposal" },
  { id: "8", name: "Pulse Infrastructure Monitoring", client: "HealthFirst Corp.", score: 50, band: "High", value: 75000, owner: "Mike Torres", stage: "Discovery" },
  { id: "9", name: "Zenith Portfolio Analytics", client: "FinanceGo Ltd.", score: 52, band: "High", value: 160000, owner: "Sarah Miller", stage: "Negotiation" },
  { id: "10", name: "Nova Multi-Cloud Integration", client: "RetailMax", score: 55, band: "Moderate", value: 90000, owner: "James Reynolds", stage: "Qualification" },
  { id: "11", name: "Summit Workflow Platform", client: "LogiPro Solutions", score: 58, band: "Moderate", value: 220000, owner: "Lisa Chen", stage: "Proposal" },
  { id: "12", name: "Vortex Cyber Defense", client: "ManufactCo", score: 60, band: "Moderate", value: 130000, owner: "Mike Torres", stage: "Negotiation" },
  { id: "13", name: "Echo Enterprise Voice", client: "TechCorp Inc.", score: 62, band: "Moderate", value: 95000, owner: "Sarah Miller", stage: "Contract" },
  { id: "14", name: "Prism Real-Time BI", client: "FinanceGo Ltd.", score: 65, band: "Moderate", value: 140000, owner: "James Reynolds", stage: "Discovery" },
  { id: "15", name: "Cascade Customer Success", client: "LogiPro Solutions", score: 72, band: "Low", value: 110000, owner: "Lisa Chen", stage: "Proposal" },
  { id: "16", name: "Delta Global Commerce", client: "RetailMax", score: 75, band: "Low", value: 200000, owner: "Mike Torres", stage: "Negotiation" },
  { id: "17", name: "Forge Assembly IoT", client: "ManufactCo", score: 78, band: "Low", value: 175000, owner: "Sarah Miller", stage: "Contract" },
  { id: "18", name: "Stellar Cloud Compute", client: "TechCorp Inc.", score: 85, band: "Healthy", value: 320000, owner: "James Reynolds", stage: "Contract" },
  { id: "19", name: "Pinnacle Compliance Suite", client: "FinanceGo Ltd.", score: 88, band: "Healthy", value: 250000, owner: "Lisa Chen", stage: "Negotiation" },
  { id: "20", name: "Crown Global Enterprise", client: "LogiPro Solutions", score: 92, band: "Healthy", value: 400000, owner: "Mike Torres", stage: "Contract" },
];

const TREND_DATA = [
  { date: "Jan", score: 62, value: 3200 },
  { date: "Feb", score: 65, value: 3400 },
  { date: "Mar", score: 59, value: 3100 },
  { date: "Apr", score: 63, value: 3600 },
  { date: "May", score: 71, value: 3900 },
  { date: "Jun", score: 68, value: 4200 },
  { date: "Jul", score: 72, value: 4100 },
  { date: "Aug", score: 68, value: 4200 },
];

const BAND_COLORS: Record<string, string> = {
  Critical: "var(--danger)",
  High: "var(--warning)",
  Moderate: "#1971c2",
  Low: "var(--success)",
  Healthy: "var(--success)",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--hs-background)",
        border: "1px solid var(--hs-border)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 14px",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} style={{ fontSize: "12px", color: entry.color || "var(--hs-primary)", fontWeight: 600 }}>
          {entry.name}: {entry.name === "value" ? `$${(entry.value / 1000).toFixed(0)}K` : entry.value}
        </div>
      ))}
    </div>
  );
};

export const PortfolioOverview: React.FC = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<any[]>(SAMPLE_DEALS);
  const [selectedDrawerDeal, setSelectedDrawerDeal] = useState<DealData | null>(null);

  useEffect(() => {
    fetchDeals()
      .then((data) => {
        if (data && data.length > 0) {
          setDeals(data);
        }
      })
      .catch((err) => {
        console.warn("Backend deal endpoint not yet seeded, displaying active sample intelligence:", err);
      });
  }, []);

  // Compute KPIs
  const pipelineValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const avgScore = deals.length > 0 ? Math.round(deals.reduce((sum, d) => sum + d.score, 0) / deals.length) : 0;
  
  const atRiskDeals = deals.filter(d => ["Critical", "High", "critical", "high"].includes(d.band));
  const atRiskValue = atRiskDeals.reduce((sum, d) => sum + (d.value || 0), 0);

  const KPI_DATA = [
    { label: "Pipeline Value", value: `$${(pipelineValue / 1000000).toFixed(1)}M`, trend: "+12%", direction: "up" as const, accent: "var(--success)" },
    { label: "Avg Health Score", value: avgScore.toString(), trend: "+3pts", direction: "up" as const, accent: "var(--hs-primary)" },
    { label: "At-Risk Value", value: `$${(atRiskValue / 1000).toFixed(0)}K`, trend: "-5%", direction: "down" as const, accent: "var(--danger)" },
    { label: "Active Deals", value: deals.length.toString(), trend: "+4", direction: "up" as const, accent: "var(--warning)" },
  ];

  // Compute Risk Distribution
  const riskCounts: Record<string, number> = { Critical: 0, High: 0, Moderate: 0, Low: 0, Healthy: 0 };
  deals.forEach(d => {
    const rawBand = d.band || "Moderate";
    const b = rawBand.charAt(0).toUpperCase() + rawBand.slice(1).toLowerCase();
    if (riskCounts[b] !== undefined) riskCounts[b]++;
    else riskCounts["Moderate"]++;
  });
  const RISK_DISTRIBUTION = Object.keys(riskCounts).map(band => ({
    band,
    count: riskCounts[band],
    color: BAND_COLORS[band],
  }));

  const AT_RISK_DEALS = [...atRiskDeals].sort((a, b) => a.score - b.score).slice(0, 8);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      {/* ── Top Row: Onboarding + Health Trend ─────────────────────── */}
      <div className="grid-2" style={{ alignItems: "stretch" }}>
        
        {/* DealSense Onboarding Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-md)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid var(--hs-border-dark)",
            borderTop: "3px solid #ff5c35",
            boxShadow: "var(--shadow-sm)",
            position: "relative",
            overflow: "hidden",
            minHeight: "240px",
          }}
        >
          <div style={{ position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,92,53,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ background: "rgba(5,150,105,0.1)", color: "var(--risk-healthy)", border: "1px solid rgba(5,150,105,0.25)", padding: "3px 9px", borderRadius: "var(--radius-pill)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>● Webhook Synced</span>
              <span style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>Portal #48921820</span>
            </div>
            <h2 style={{ fontSize: "19px", fontWeight: 800, color: "var(--hs-heading)", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Welcome to DealSense Intelligence</h2>
            <p style={{ fontSize: "13px", color: "var(--hs-text-muted)", margin: 0, lineHeight: 1.55 }}>
              You're viewing a live interactive demo of the DealSense Revenue Operations engine. Navigate through the modules to explore predictive deal scoring, pipeline waterfalls, and autonomous CRM hygiene.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/deals")}
              style={{
                padding: "8px 18px", background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)", color: "#fff", fontSize: "13px", fontWeight: 700,
                border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", boxShadow: "0 2px 6px rgba(255,92,53,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
                display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.2s ease"
              }}
            >
              <span>Get Started</span>
              <span>→</span>
            </button>
            <a
              href="/case-study"
              style={{
                padding: "8px 16px", background: "#ffffff", color: "var(--hs-text)", fontSize: "12.5px", fontWeight: 600,
                border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-sm)", cursor: "pointer",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.2s ease",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <span>Read Case Study</span>
              <span>↗</span>
            </a>
          </div>
        </motion.div>

        {/* Health Score Trend */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          style={{ height: "100%", margin: 0, display: "flex", flexDirection: "column", minHeight: "240px" }}
        >
          <div className="card-header" style={{ paddingBottom: 0, borderBottom: "none" }}>
            <div>
              <div className="card-title">Health Score Trend</div>
              <div className="card-subtitle">Average deal health across portfolio</div>
            </div>
          </div>
          <div className="card-body" style={{ flex: 1, padding: "10px 20px 20px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--hs-primary)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="var(--hs-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--hs-border-dark)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--hs-text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "var(--hs-text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--hs-primary)"
                  strokeWidth={2}
                  fill="url(#scoreGrad)"
                  dot={{ fill: "var(--hs-primary)", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--hs-background)", fill: "var(--hs-primary)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── KPI Grid ─────────────────────────────────────────────────── */}
      <div className="kpi-grid">
        {KPI_DATA.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            className="kpi-card"
            style={{ borderTopColor: kpi.accent }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
          >
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "11px",
                fontWeight: 600,
                marginTop: 4,
                padding: "2px 6px",
                borderRadius: "var(--radius-pill)",
                background: kpi.direction === "up" ? "var(--success-bg)" : "var(--danger-bg)",
                color: kpi.direction === "up" ? "var(--success)" : "var(--danger)",
              }}
            >
              {kpi.direction === "up" ? "▲" : "▼"} {kpi.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Risk Distribution Row ──────────────────────────────────────── */}
      <div className="grid-2" style={{ marginBottom: "var(--sp-6)" }}>
        {/* Risk Distribution */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <div className="card-header">
            <div>
              <div className="card-title">Risk Distribution</div>
              <div className="card-subtitle">Current deal count by risk band</div>
            </div>
          </div>
          <div className="card-body">
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RISK_DISTRIBUTION} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--hs-border-dark)" />
                  <XAxis dataKey="band" tick={{ fontSize: 11, fill: "var(--hs-text-muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--hs-text-muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--hs-surface-hover)" }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                    {RISK_DISTRIBUTION.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stacked distribution bar */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden" }}>
                {RISK_DISTRIBUTION.map((r) => {
                  const total = deals.length || 1;
                  return (
                    <div
                      key={r.band}
                      style={{ width: `${(r.count / total) * 100}%`, background: r.color }}
                    />
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                {RISK_DISTRIBUTION.map((r) => (
                  <div key={r.band} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} />
                    <span style={{ fontSize: 11, color: "var(--hs-text-muted)", fontWeight: 500 }}>
                      {r.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Placeholder or Action Summary can go here if needed, but we'll leave it empty for now. 
            Because it's a grid-2, the Risk Distribution will take 50% width and not look stretched. */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
          <motion.div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "var(--sp-6)", textAlign: "center" }}>
            <span style={{ fontSize: 32, marginBottom: 8 }}>⚡</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>System Health Optimal</h3>
            <p style={{ fontSize: 13, color: "var(--hs-text-muted)", margin: 0, maxWidth: 240 }}>No critical system alerts. 48 deals synced successfully with real-time webhook ingestion.</p>
          </motion.div>
        </div>
      </div>

      {/* ── At-Risk Deals Section (Adaptive Desktop Table + Mobile Cards) ── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <div className="card-header">
          <div>
            <div className="card-title">Deals Requiring Immediate Attention</div>
            <div className="card-subtitle">Prioritized by health risk score</div>
          </div>
          <span className="badge badge-outline">{atRiskDeals.length} at risk</span>
        </div>

        {/* 1. Desktop & Tablet Responsive Table */}
        <div className="desktop-deal-table table-responsive">
          <table>
            <thead>
              <tr>
                <th>Deal</th>
                <th>Client</th>
                <th>Score</th>
                <th>Risk Band</th>
                <th>Value</th>
                <th>Owner</th>
                <th style={{ textAlign: "right", paddingRight: 16 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {AT_RISK_DEALS.map((deal, idx) => {
                const b = (deal.band || "High").toLowerCase();
                return (
                  <motion.tr
                    key={deal.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.04, duration: 0.2 }}
                    onClick={() => setSelectedDrawerDeal(deal)}
                    style={{ cursor: "pointer" }}
                  >
                    <td style={{ fontWeight: 600, color: "var(--hs-primary)", fontSize: 13 }}>{deal.name}</td>
                    <td style={{ color: "var(--hs-text-muted)" }}>{deal.client}</td>
                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          color:
                            deal.score < 30
                              ? "var(--danger)"
                              : deal.score < 50
                              ? "var(--warning)"
                              : "#1971c2",
                        }}
                      >
                        {deal.score}
                      </span>
                    </td>
                    <td>
                      <span className="risk-pill" data-band={b}>
                        {deal.band}
                      </span>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>${(deal.value / 1000).toFixed(0)}K</td>
                    <td>{deal.owner}</td>
                    <td style={{ textAlign: "right", paddingRight: 16 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDrawerDeal(deal);
                        }}
                      >
                        ⚡ Inspect
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 2. Mobile-Native Deal Cards (<640px) */}
        <div className="mobile-deal-cards">
          {AT_RISK_DEALS.map((deal) => {
            const b = (deal.band || "High").toLowerCase();
            return (
              <div
                key={deal.name}
                className="mobile-deal-card"
                onClick={() => setSelectedDrawerDeal(deal)}
              >
                <div className="mobile-deal-card-header">
                  <div className="mobile-deal-card-title">{deal.name}</div>
                  <span className="risk-pill" data-band={b}>
                    {deal.score} · {deal.band}
                  </span>
                </div>

                <div className="mobile-deal-card-meta">
                  <span>{deal.client}</span>
                  <span>•</span>
                  <strong style={{ color: "var(--hs-primary)" }}>${(deal.value / 1000).toFixed(0)}K</strong>
                  <span>•</span>
                  <span>{deal.owner}</span>
                </div>

                <button
                  className="btn btn-secondary btn-sm mobile-deal-inspect-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDrawerDeal(deal);
                  }}
                >
                  ⚡ Inspect Deal Dossier
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Global Deal Inspection Drawer ── */}
      <DealDrawer
        deal={selectedDrawerDeal}
        isOpen={!!selectedDrawerDeal}
        onClose={() => setSelectedDrawerDeal(null)}
      />
    </div>
  );
};
