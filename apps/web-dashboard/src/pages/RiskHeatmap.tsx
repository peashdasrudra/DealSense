/**
 * DealSense Dashboard — Risk Heatmap Page.
 * Canvas Design System Edition.
 * Wired to Real FastAPI Backend with graceful Enterprise fallback.
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDeals } from "../api";
import { DealDrawer, DealData } from "../components/DealDrawer";

const BANDS = ["Critical", "High", "Moderate", "Low", "Healthy"];

interface HeatmapDeal {
  name: string;
  client: string;
  score: number;
  value: number;
  owner: string;
  stage: string;
  band: string;
}

const SAMPLE_HEATMAP_DEALS: HeatmapDeal[] = [
  { name: "Orion Cloud Migration", client: "TechCorp Inc.", score: 23, value: 150000, owner: "Sarah Miller", stage: "Proposal", band: "Critical" },
  { name: "Quantum Security Suite", client: "FinanceGo Ltd.", score: 31, value: 280000, owner: "James Reynolds", stage: "Negotiation", band: "Critical" },
  { name: "Horizon Data Platform", client: "RetailMax", score: 35, value: 95000, owner: "Lisa Chen", stage: "Qualification", band: "Critical" },
  { name: "Apex CRM Integration", client: "LogiPro Solutions", score: 38, value: 120000, owner: "Mike Torres", stage: "Proposal", band: "Critical" },
  { name: "Nebula Analytics", client: "HealthFirst Corp.", score: 44, value: 210000, owner: "Sarah Miller", stage: "Discovery", band: "High" },
  { name: "Titan ERP Modern", client: "ManufactCo", score: 46, value: 340000, owner: "James Reynolds", stage: "Qualification", band: "High" },
  { name: "Atlas Data Warehouse", client: "TechCorp Inc.", score: 48, value: 180000, owner: "Lisa Chen", stage: "Proposal", band: "High" },
  { name: "Pulse Monitoring", client: "HealthFirst Corp.", score: 50, value: 75000, owner: "Mike Torres", stage: "Discovery", band: "High" },
  { name: "Zenith Analytics", client: "FinanceGo Ltd.", score: 52, value: 160000, owner: "Sarah Miller", stage: "Negotiation", band: "High" },
  { name: "Nova Integration", client: "RetailMax", score: 55, value: 90000, owner: "James Reynolds", stage: "Qualification", band: "Moderate" },
  { name: "Summit Platform", client: "LogiPro Solutions", score: 58, value: 220000, owner: "Lisa Chen", stage: "Proposal", band: "Moderate" },
  { name: "Vortex Security", client: "ManufactCo", score: 60, value: 130000, owner: "Mike Torres", stage: "Negotiation", band: "Moderate" },
  { name: "Echo Analytics", client: "TechCorp Inc.", score: 62, value: 95000, owner: "Sarah Miller", stage: "Contract", band: "Moderate" },
  { name: "Prism Dashboard", client: "FinanceGo Ltd.", score: 65, value: 140000, owner: "James Reynolds", stage: "Discovery", band: "Moderate" },
  { name: "Cascade CRM", client: "LogiPro Solutions", score: 72, value: 110000, owner: "Lisa Chen", stage: "Proposal", band: "Low" },
  { name: "Delta Platform", client: "RetailMax", score: 75, value: 200000, owner: "Mike Torres", stage: "Negotiation", band: "Low" },
  { name: "Forge Automation", client: "ManufactCo", score: 78, value: 175000, owner: "Sarah Miller", stage: "Contract", band: "Low" },
  { name: "Stellar Cloud", client: "TechCorp Inc.", score: 85, value: 320000, owner: "James Reynolds", stage: "Contract", band: "Healthy" },
  { name: "Pinnacle Suite", client: "FinanceGo Ltd.", score: 88, value: 250000, owner: "Lisa Chen", stage: "Negotiation", band: "Healthy" },
  { name: "Crown Enterprise", client: "LogiPro Solutions", score: 92, value: 400000, owner: "Mike Torres", stage: "Contract", band: "Healthy" },
];

const BAND_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Critical: { bg: "var(--danger-bg)", border: "var(--danger)", text: "var(--danger)" },
  High: { bg: "var(--warning-bg)", border: "var(--warning)", text: "var(--warning)" },
  Moderate: { bg: "#e7f5ff", border: "#1971c2", text: "#1971c2" },
  Low: { bg: "var(--success-bg)", border: "var(--success)", text: "var(--success)" },
  Healthy: { bg: "var(--success-bg)", border: "var(--success)", text: "var(--success)" },
};

export const RiskHeatmap: React.FC = () => {
  const [deals, setDeals] = useState<HeatmapDeal[]>(SAMPLE_HEATMAP_DEALS);
  const [selectedCell, setSelectedCell] = useState<{ stage: string; band: string } | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [selectedDrawerDeal, setSelectedDrawerDeal] = useState<DealData | null>(null);

  useEffect(() => {
    fetchDeals()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            ...d,
            band: (d.band || "Moderate").charAt(0).toUpperCase() + (d.band || "Moderate").slice(1).toLowerCase(),
          }));
          setDeals(mapped);
          setIsLive(true);
        }
      })
      .catch((err) => {
        console.warn("Using sample risk heatmap matrix intelligence:", err);
      });
  }, []);

  const STAGES = useMemo(() => {
    const baseStages = ["Discovery", "Qualification", "Proposal", "Negotiation", "Contract"];
    const foundStages = Array.from(new Set(deals.map((d) => d.stage)));
    for (const s of foundStages) {
      if (!baseStages.includes(s) && s) baseStages.push(s);
    }
    return baseStages;
  }, [deals]);

  const getCellDeals = (stage: string, band: string) =>
    deals.filter((d) => d.stage === stage && d.band === band);

  const getCellValue = (stage: string, band: string) =>
    getCellDeals(stage, band).reduce((s, d) => s + (d.value || 0), 0);

  const selectedDeals = selectedCell
    ? getCellDeals(selectedCell.stage, selectedCell.band)
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      {/* ── Header Card ───────────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #124548 0%, #062b2e 100%)",
          color: "#ffffff",
          padding: "26px 30px",
          border: "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge" style={{ background: "rgba(0, 164, 189, 0.25)", color: "#7de2ea", border: "1px solid #00a4bd", fontWeight: 700 }}>
                ● REVOPS PIPELINE TELEMETRY
              </span>
              <span style={{ fontSize: "12px", color: "#a5c2c4" }}>Stage vs Severity Matrix</span>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "4px 0 6px" }}>
              Pipeline Risk Heatmap
            </h2>
            <p style={{ fontSize: "13.5px", color: "#d9e8e8", margin: 0, maxWidth: 680 }}>
              Visualize deal concentration across risk severity and pipeline stages. Identify critical choke points where high-value deals are rotting.
            </p>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)" }}>
        <div style={{ fontSize: "13px", color: "var(--hs-text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: isLive ? "var(--success)" : "var(--hs-primary)", display: "inline-block" }} />
          <span>{isLive ? "Live Pipeline Risk Matrix" : "AI Risk Distribution Matrix (Demo Active)"}</span>
        </div>
        <span className="badge badge-outline">{deals.length} total deals mapped</span>
      </div>

      {/* ── Heatmap Grid ─────────────────────────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "var(--sp-6)" }}
      >
        <div className="card-header">
          <div>
            <div className="card-title">Pipeline × Risk Matrix</div>
            <div className="card-subtitle">Click any cell to inspect deal intelligence</div>
          </div>
        </div>
        <div className="card-body" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 6 }}>
            <thead>
              <tr>
                <th style={{ width: 100, fontSize: "11px", color: "var(--hs-text-muted)", textAlign: "left", padding: "0 8px 8px", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "none" }}>
                  Risk ↓ / Stage →
                </th>
                {STAGES.map((stage) => (
                  <th
                    key={stage}
                    style={{
                      fontSize: "12px",
                      color: "var(--hs-text)",
                      fontWeight: 600,
                      padding: "0 0 8px",
                      textAlign: "center",
                      borderBottom: "none",
                    }}
                  >
                    {stage}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BANDS.map((band, bandIdx) => (
                <tr key={band}>
                  <td
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: BAND_COLORS[band]?.text || "var(--hs-text)",
                      padding: "0 8px",
                      verticalAlign: "middle",
                      borderBottom: "none",
                    }}
                  >
                    {band}
                  </td>
                  {STAGES.map((stage, stageIdx) => {
                    const cellDeals = getCellDeals(stage, band);
                    const value = getCellValue(stage, band);
                    const isSelected = selectedCell?.stage === stage && selectedCell?.band === band;
                    const colors = BAND_COLORS[band] || { bg: "var(--hs-surface)", border: "var(--hs-border)", text: "var(--hs-text)" };

                    return (
                      <td key={stage} style={{ padding: 0, borderBottom: "none" }}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (bandIdx * STAGES.length + stageIdx) * 0.02, duration: 0.2 }}
                          onClick={() => cellDeals.length > 0 && setSelectedCell({ stage, band })}
                          style={{
                            height: 72,
                            minWidth: 80,
                            borderRadius: "var(--radius-sm)",
                            background: cellDeals.length > 0 ? colors.bg : "var(--hs-surface)",
                            border: `2px solid ${isSelected ? colors.border : (cellDeals.length > 0 ? "transparent" : "var(--hs-border-dark)")}`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: cellDeals.length > 0 ? "pointer" : "default",
                            transition: "all 150ms ease",
                          }}
                          whileHover={cellDeals.length > 0 ? { borderColor: colors.border } : {}}
                        >
                          {cellDeals.length > 0 ? (
                            <>
                              <span
                                style={{
                                  fontSize: "20px",
                                  fontWeight: 700,
                                  color: colors.text,
                                  lineHeight: 1,
                                }}
                              >
                                {cellDeals.length}
                              </span>
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "var(--hs-text-muted)",
                                  fontVariantNumeric: "tabular-nums",
                                  marginTop: 4,
                                  fontWeight: 500,
                                }}
                              >
                                ${(value / 1000).toFixed(0)}K
                              </span>
                            </>
                          ) : (
                            <span style={{ fontSize: "14px", color: "var(--hs-border-dark)" }}>—</span>
                          )}
                        </motion.div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Selected Cell Detail ──────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCell && selectedDeals.length > 0 && (
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 16, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card-header">
              <div>
                <div className="card-title">
                  {selectedCell.stage} — {selectedCell.band} Risk
                </div>
                <div className="card-subtitle">
                  {selectedDeals.length} deal{selectedDeals.length > 1 ? "s" : ""} totaling $
                  {(selectedDeals.reduce((s, d) => s + (d.value || 0), 0) / 1000).toFixed(0)}K
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedCell(null)}
              >
                ✕ Close
              </button>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Deal</th>
                    <th>Client</th>
                    <th>Score</th>
                    <th>Value</th>
                    <th>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDeals.map((deal) => (
                    <tr
                      key={deal.name}
                      onClick={() =>
                        setSelectedDrawerDeal({
                          id: deal.name.toLowerCase().replace(/\s+/g, "-"),
                          name: deal.name,
                          client: deal.client,
                          score: deal.score,
                          band: deal.band,
                          value: deal.value,
                          stage: deal.stage,
                          owner: deal.owner,
                        })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ fontWeight: 600, color: "var(--hs-primary)", fontSize: 13 }}>{deal.name}</td>
                      <td style={{ color: "var(--hs-text-muted)" }}>{deal.client}</td>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: BAND_COLORS[deal.band]?.text }}>
                          {deal.score}
                        </span>
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>${((deal.value || 0) / 1000).toFixed(0)}K</td>
                      <td>{deal.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Global Deal Inspection Drawer ── */}
      <DealDrawer
        deal={selectedDrawerDeal}
        isOpen={!!selectedDrawerDeal}
        onClose={() => setSelectedDrawerDeal(null)}
      />
    </div>
  );
};
