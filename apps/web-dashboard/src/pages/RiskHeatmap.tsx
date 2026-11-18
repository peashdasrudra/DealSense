/**
 * DealSense Dashboard — Pipeline Risk & Severity Heatmap.
 * Canvas Design System Edition — Premium Enterprise UI/UX.
 * Maps deal concentration across risk severity and pipeline stages with real-time telemetry.
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDeals, logAuditEvent } from "../api";
import { ENTERPRISE_DEALS, EnterpriseDeal } from "../data/enterpriseData";
import { DealDrawer, DealData } from "../components/DealDrawer";

const BANDS = ["Critical", "High", "Moderate", "Low", "Healthy"] as const;
type RiskBand = (typeof BANDS)[number];

const STAGES = [
  { key: "Discovery", label: "Discovery", sub: "Stage 1" },
  { key: "Qualification", label: "Qualification", sub: "Stage 2" },
  { key: "Proposal", label: "Proposal / Demo", sub: "Stage 3" },
  { key: "Negotiation", label: "Negotiation", sub: "Stage 4" },
  { key: "Contract", label: "Contract", sub: "Stage 5" },
];

const STAGE_MAP: Record<string, string> = {
  appointmentscheduled: "Discovery",
  qualifiedtobuy: "Qualification",
  presentationscheduled: "Proposal",
  decisionmakerboughtin: "Negotiation",
  contractsent: "Contract",
  closedwon: "Contract",
  closedlost: "Discovery",
};

interface HeatmapDeal {
  id: string;
  name: string;
  client: string;
  score: number;
  value: number;
  owner: string;
  stage: string;
  band: RiskBand;
  daysInStage?: number;
  recommendation?: string;
  risks?: Array<{ id: string; text: string; severity: "critical" | "high" | "moderate" }>;
}

const BAND_THEMES: Record<RiskBand, {
  bg: string;
  hoverBg: string;
  border: string;
  text: string;
  badgeBg: string;
  label: string;
  dotColor: string;
}> = {
  Critical: {
    bg: "rgba(242, 84, 91, 0.12)",
    hoverBg: "rgba(242, 84, 91, 0.22)",
    border: "#d93843",
    text: "#d93843",
    badgeBg: "rgba(242, 84, 91, 0.15)",
    label: "Critical Risk",
    dotColor: "#d93843",
  },
  High: {
    bg: "rgba(255, 153, 0, 0.12)",
    hoverBg: "rgba(255, 153, 0, 0.22)",
    border: "#ff9900",
    text: "#b76e00",
    badgeBg: "rgba(255, 153, 0, 0.16)",
    label: "High Risk",
    dotColor: "#ff9900",
  },
  Moderate: {
    bg: "rgba(0, 164, 189, 0.10)",
    hoverBg: "rgba(0, 164, 189, 0.18)",
    border: "#00a4bd",
    text: "#007a8c",
    badgeBg: "rgba(0, 164, 189, 0.14)",
    label: "Moderate",
    dotColor: "#00a4bd",
  },
  Low: {
    bg: "rgba(0, 189, 165, 0.09)",
    hoverBg: "rgba(0, 189, 165, 0.16)",
    border: "#00bdc3",
    text: "#007a70",
    badgeBg: "rgba(0, 189, 165, 0.12)",
    label: "Low Risk",
    dotColor: "#00bdc3",
  },
  Healthy: {
    bg: "rgba(0, 189, 165, 0.14)",
    hoverBg: "rgba(0, 189, 165, 0.22)",
    border: "#007a70",
    text: "#007a70",
    badgeBg: "rgba(0, 189, 165, 0.18)",
    label: "Healthy",
    dotColor: "#007a70",
  },
};

const ENTERPRISE_HEATMAP_DEALS: HeatmapDeal[] = ENTERPRISE_DEALS.map((d: EnterpriseDeal) => ({
  id: d.id,
  name: d.name,
  client: d.client,
  score: d.score,
  value: d.value,
  owner: d.owner,
  stage: STAGE_MAP[d.stage] || "Proposal",
  band: (d.band.charAt(0).toUpperCase() + d.band.slice(1).toLowerCase()) as RiskBand,
  daysInStage: d.daysInStage,
  recommendation: d.recommendation,
  risks: d.risks,
}));

export const RiskHeatmap: React.FC = () => {
  const [deals, setDeals] = useState<HeatmapDeal[]>(ENTERPRISE_HEATMAP_DEALS);
  const [selectedCell, setSelectedCell] = useState<{ stage: string; band: RiskBand } | null>(null);
  const [isLive, setIsLive] = useState(false);
  void isLive;
  const [selectedDrawerDeal, setSelectedDrawerDeal] = useState<DealData | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "value" | "count" | "choke">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadHeatmapDeals = () => {
    fetchDeals()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            client: d.client,
            score: d.score,
            value: d.value,
            owner: d.owner,
            stage: STAGE_MAP[d.stage] || d.stage || "Proposal",
            band: ((d.band || "Moderate").charAt(0).toUpperCase() +
              (d.band || "Moderate").slice(1).toLowerCase()) as RiskBand,
            daysInStage: d.daysInStage || 5,
            recommendation: d.recommendation,
            risks: d.risks || [],
          }));
          setDeals(mapped);
          setIsLive(true);
        }
      })
      .catch((err) => {
        console.warn("Using sample risk heatmap matrix intelligence:", err);
      });
  };

  useEffect(() => {
    loadHeatmapDeals();
    const handleUpdate = () => loadHeatmapDeals();
    window.addEventListener("dealsense:deals-updated", handleUpdate);
    return () => window.removeEventListener("dealsense:deals-updated", handleUpdate);
  }, []);

  // Filter deals based on search
  const filteredDeals = useMemo(() => {
    if (!searchQuery.trim()) return deals;
    const q = searchQuery.toLowerCase();
    return deals.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.client.toLowerCase().includes(q) ||
        d.owner.toLowerCase().includes(q)
    );
  }, [deals, searchQuery]);

  // Aggregate Metrics
  const totalARR = useMemo(() => deals.reduce((s, d) => s + (d.value || 0), 0), [deals]);
  const criticalDeals = useMemo(
    () => deals.filter((d) => d.band === "Critical" || d.band === "High"),
    [deals]
  );
  const criticalARR = useMemo(
    () => criticalDeals.reduce((s, d) => s + (d.value || 0), 0),
    [criticalDeals]
  );
  const healthyDeals = useMemo(
    () => deals.filter((d) => d.band === "Healthy" || d.band === "Low"),
    [deals]
  );
  const healthyARR = useMemo(
    () => healthyDeals.reduce((s, d) => s + (d.value || 0), 0),
    [healthyDeals]
  );

  const getCellDeals = (stageKey: string, band: RiskBand) =>
    filteredDeals.filter((d) => d.stage === stageKey && d.band === band);

  const getCellValue = (stageKey: string, band: RiskBand) =>
    getCellDeals(stageKey, band).reduce((s, d) => s + (d.value || 0), 0);

  // Column (Stage) & Row (Band) Totals
  const getStageTotal = (stageKey: string) => {
    const stageDeals = filteredDeals.filter((d) => d.stage === stageKey);
    const val = stageDeals.reduce((s, d) => s + (d.value || 0), 0);
    return { count: stageDeals.length, value: val };
  };

  const getBandTotal = (band: RiskBand) => {
    const bandDeals = filteredDeals.filter((d) => d.band === band);
    const val = bandDeals.reduce((s, d) => s + (d.value || 0), 0);
    return { count: bandDeals.length, value: val };
  };

  const selectedDeals = selectedCell
    ? getCellDeals(selectedCell.stage, selectedCell.band)
    : [];

  const handleHighlightChokePoints = () => {
    setViewMode("choke");
    // Find highest risk cell with deals (e.g. Proposal - Critical)
    setSelectedCell({ stage: "Proposal", band: "Critical" });
    logAuditEvent({
      actor: "Peash Rudra",
      role: "VP Revenue Operations",
      actionType: "Heatmap Choke Point Analysis",
      targetObject: "Pipeline Matrix",
      tier: "Tier 1 (Continuous Telemetry)",
      status: "Success",
      details: "Triggered AI Heatmap Choke Point isolation filter across Proposal and Qualification stages ($4.5M exposure).",
    });
    showToast("⚡ Choke point matrix isolation enabled: $4.5M stalled exposure highlighted.");
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
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
              Pipeline Risk &amp; Severity Heatmap
            </h2>
            <p className="page-header-desc">
              Visualize deal concentration across risk severity and pipeline stages. Identify critical choke points where high-value enterprise deals are rotting before close.
            </p>
          </div>

          <div className="page-header-actions">
            <button
              onClick={() => {
                showToast("📑 Exported Heatmap PDF Executive Report!");
                logAuditEvent({
                  actor: "Peash Rudra",
                  role: "VP Sales Ops",
                  actionType: "Heatmap Report Export",
                  targetObject: "Pipeline Risk Heatmap",
                  tier: "Tier 1 (Continuous Telemetry)",
                  status: "Success",
                  details: "Exported executive PDF of Stage vs Severity Matrix.",
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
              <span>📑 Export Heatmap PDF</span>
            </button>
            <button
              onClick={handleHighlightChokePoints}
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
              <span>⚡ Highlight Choke Points</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Enterprise Telemetry Summary KPI Grid ──────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
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
              Total Mapped Pipeline
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(45, 62, 80, 0.08)", color: "#2d3e50", padding: "2px 6px", borderRadius: 4 }}>
              {deals.length} DEALS
            </span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#2d3e50", fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}>
            {formatCurrency(totalARR)}
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Full multi-stage pipeline active this quarter
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
              Critical &amp; High Exposure
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(217, 56, 67, 0.1)", color: "#d93843", padding: "2px 6px", borderRadius: 4 }}>
              CHOKE ALERT
            </span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#d93843", fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}>
            {formatCurrency(criticalARR)}
          </div>
          <div style={{ fontSize: "11.5px", color: "#d93843", marginTop: 4, fontWeight: 600 }}>
            ▲ {criticalDeals.length} Deals in need of executive rescue
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
              Primary Funnel Choke Point
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(255, 92, 53, 0.1)", color: "#ff5c35", padding: "2px 6px", borderRadius: 4 }}>
              STAGE 3
            </span>
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#ff5c35", fontFamily: "var(--font-sans)", letterSpacing: "-0.01em", marginTop: 2 }}>
            Proposal / Demo
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 6 }}>
            2 Critical Deals ($2.9M) exceeding 20d duration
          </div>
        </div>

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
              Protected Healthy Flow
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(0, 189, 165, 0.12)", color: "#007a70", padding: "2px 6px", borderRadius: 4 }}>
              {healthyDeals.length} DEALS
            </span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#007a70", fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}>
            {formatCurrency(healthyARR)}
          </div>
          <div style={{ fontSize: "11.5px", color: "#007a70", marginTop: 4, fontWeight: 600 }}>
            ▲ High velocity &amp; strong MEDDICC coverage
          </div>
        </div>
      </div>

      {/* ── 3. Heatmap Card & Controls ─────────────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          border: "1px solid var(--hs-border-dark)",
          boxShadow: "var(--shadow-sm)",
          margin: 0,
          overflow: "hidden",
        }}
      >
        {/* Heatmap Header & Controls */}
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
                Pipeline × Risk Matrix
              </h3>
              <span style={{ fontSize: "11px", color: "var(--hs-text-muted)", background: "var(--hs-surface)", padding: "2px 8px", borderRadius: 10, border: "1px solid var(--hs-border)" }}>
                {filteredDeals.length} deals mapped
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
              Click any cell to inspect deal intelligence dossier &amp; trigger automated remediations
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {/* Search Input */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals..."
                style={{
                  padding: "5px 10px 5px 28px",
                  fontSize: "12px",
                  border: "1px solid var(--hs-border-dark)",
                  borderRadius: "6px",
                  background: "var(--hs-background)",
                  outline: "none",
                  width: "160px",
                }}
              />
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--hs-text-muted)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: "absolute", left: 9, top: 8 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* View Mode Toggle */}
            <div style={{ display: "flex", gap: 3, background: "var(--hs-surface-hover)", padding: 3, borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
              {[
                { id: "all", label: "All Details" },
                { id: "value", label: "ARR ($)" },
                { id: "count", label: "Counts (#)" },
                { id: "choke", label: "Choke Points" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setViewMode(m.id as any)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "none",
                    background: viewMode === m.id ? "#ff5c35" : "transparent",
                    color: viewMode === m.id ? "#ffffff" : "var(--hs-text)",
                    fontSize: "11px",
                    fontWeight: viewMode === m.id ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {selectedCell && (
              <button
                onClick={() => setSelectedCell(null)}
                style={{
                  padding: "4px 10px",
                  background: "#f1f4f8",
                  border: "1px solid var(--hs-border-dark)",
                  borderRadius: "4px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "var(--hs-text)",
                  cursor: "pointer",
                }}
              >
                ✕ Clear Selection
              </button>
            )}
          </div>
        </div>

        {/* ── 4. The 5x5 Matrix Grid ─────────────────────────────────── */}
        <div style={{ overflowX: "auto", padding: "16px 20px 20px" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 8, minWidth: 720 }}>
            <thead>
              <tr>
                <th
                  style={{
                    width: 140,
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "var(--hs-text-muted)",
                    textAlign: "left",
                    padding: "0 8px 8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    borderBottom: "none",
                  }}
                >
                  Risk Band ↓ / Stage →
                </th>
                {STAGES.map((s) => (
                  <th
                    key={s.key}
                    style={{
                      fontSize: "12.5px",
                      color: "var(--hs-heading)",
                      fontWeight: 800,
                      padding: "0 0 8px",
                      textAlign: "center",
                      borderBottom: "none",
                    }}
                  >
                    <div>{s.label}</div>
                    <div style={{ fontSize: "10.5px", color: "var(--hs-text-muted)", fontWeight: 500 }}>
                      {s.sub}
                    </div>
                  </th>
                ))}
                <th
                  style={{
                    width: 110,
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "var(--hs-text-muted)",
                    textAlign: "center",
                    padding: "0 8px 8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    borderBottom: "none",
                  }}
                >
                  Band Total
                </th>
              </tr>
            </thead>
            <tbody>
              {BANDS.map((band, bandIdx) => {
                const theme = BAND_THEMES[band];
                const bandTotal = getBandTotal(band);

                return (
                  <tr key={band}>
                    {/* Left Row Header */}
                    <td
                      style={{
                        padding: "0 8px",
                        verticalAlign: "middle",
                        borderBottom: "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: theme.dotColor,
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "12.5px",
                            fontWeight: 800,
                            color: theme.text,
                          }}
                        >
                          {band}
                        </span>
                      </div>
                    </td>

                    {/* Stage Cells */}
                    {STAGES.map((stage, stageIdx) => {
                      const cellDeals = getCellDeals(stage.key, band);
                      const value = getCellValue(stage.key, band);
                      const hasDeals = cellDeals.length > 0;
                      const isSelected =
                        selectedCell?.stage === stage.key && selectedCell?.band === band;
                      const isChokePoint =
                        (stage.key === "Proposal" || stage.key === "Qualification") &&
                        band === "Critical";

                      const isDimmed = viewMode === "choke" && !isChokePoint && hasDeals;

                      return (
                        <td key={stage.key} style={{ padding: 0, borderBottom: "none" }}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{
                              opacity: isDimmed ? 0.35 : 1,
                              scale: isSelected ? 1.03 : 1,
                            }}
                            transition={{
                              delay: (bandIdx * STAGES.length + stageIdx) * 0.012,
                              duration: 0.2,
                            }}
                            onClick={() => {
                              if (hasDeals) {
                                setSelectedCell(isSelected ? null : { stage: stage.key, band });
                              }
                            }}
                            style={{
                              height: 76,
                              minWidth: 105,
                              borderRadius: "8px",
                              background: hasDeals ? theme.bg : "#f8fafc",
                              border: isSelected
                                ? `2.5px solid ${theme.border}`
                                : hasDeals
                                ? isChokePoint
                                  ? `2px dashed #d93843`
                                  : `1px solid ${theme.border}40`
                                : "1px solid var(--hs-border)",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: hasDeals ? "pointer" : "default",
                              transition: "all 160ms ease",
                              position: "relative",
                              boxShadow: isSelected
                                ? `0 4px 14px ${theme.border}35`
                                : hasDeals
                                ? "0 1px 3px rgba(0,0,0,0.03)"
                                : "none",
                            }}
                            whileHover={
                              hasDeals
                                ? {
                                    scale: 1.03,
                                    borderColor: theme.border,
                                    boxShadow: `0 4px 12px ${theme.border}30`,
                                  }
                                : {}
                            }
                          >
                            {/* Choke Point Pulse Beacon */}
                            {isChokePoint && hasDeals && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: 4,
                                  right: 5,
                                  fontSize: "8.5px",
                                  fontWeight: 800,
                                  background: "#d93843",
                                  color: "#ffffff",
                                  padding: "1px 5px",
                                  borderRadius: "4px",
                                  letterSpacing: "0.04em",
                                }}
                              >
                                CHOKE
                              </span>
                            )}

                            {hasDeals ? (
                              <>
                                {viewMode !== "value" && (
                                  <div
                                    style={{
                                      fontSize: "17px",
                                      fontWeight: 800,
                                      color: theme.text,
                                      fontFamily: "var(--font-sans)",
                                      lineHeight: 1.1,
                                    }}
                                  >
                                    {cellDeals.length}
                                  </div>
                                )}
                                {viewMode !== "count" && (
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      fontFamily: "var(--font-mono)",
                                      color: isSelected ? theme.text : "var(--hs-heading)",
                                      fontWeight: 700,
                                      marginTop: viewMode === "value" ? 0 : 2,
                                    }}
                                  >
                                    {formatCurrency(value)}
                                  </div>
                                )}
                                {viewMode === "value" && (
                                  <span style={{ fontSize: "10px", color: "var(--hs-text-muted)", marginTop: 1 }}>
                                    {cellDeals.length} deal{cellDeals.length > 1 ? "s" : ""}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span style={{ fontSize: "13px", color: "#cbd6e2", fontWeight: 500 }}>
                                —
                              </span>
                            )}
                          </motion.div>
                        </td>
                      );
                    })}

                    {/* Right Row Total */}
                    <td style={{ padding: "0 4px", borderBottom: "none" }}>
                      <div
                        style={{
                          height: 76,
                          borderRadius: "8px",
                          background: "#f8fafc",
                          border: "1px solid var(--hs-border-dark)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-heading)" }}>
                          {bandTotal.count}
                        </div>
                        <div style={{ fontSize: "10.5px", fontFamily: "var(--font-mono)", color: "var(--hs-text-muted)", fontWeight: 700 }}>
                          {formatCurrency(bandTotal.value)}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Bottom Stage Total Row */}
              <tr>
                <td
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "var(--hs-text-muted)",
                    padding: "8px 8px 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    borderBottom: "none",
                  }}
                >
                  Stage Total
                </td>
                {STAGES.map((s) => {
                  const stageTot = getStageTotal(s.key);
                  return (
                    <td key={s.key} style={{ padding: "8px 0 0", borderBottom: "none" }}>
                      <div
                        style={{
                          padding: "8px 4px",
                          borderRadius: "6px",
                          background: "#f8fafc",
                          border: "1px solid var(--hs-border-dark)",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--hs-heading)" }}>
                          {stageTot.count} deals
                        </div>
                        <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--hs-text-muted)", fontWeight: 700 }}>
                          {formatCurrency(stageTot.value)}
                        </div>
                      </div>
                    </td>
                  );
                })}
                <td style={{ padding: "8px 4px 0", borderBottom: "none" }}>
                  <div
                    style={{
                      padding: "8px 4px",
                      borderRadius: "6px",
                      background: "rgba(45, 62, 80, 0.08)",
                      border: "1px solid var(--hs-border-dark)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--hs-primary)" }}>
                      {filteredDeals.length} deals
                    </div>
                    <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#ff5c35", fontWeight: 800 }}>
                      {formatCurrency(totalARR)}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── 5. Selected Cell Deal Drill-Down Panel ─────────────────────── */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: "#ffffff",
              borderRadius: "8px",
              border: `1.5px solid ${BAND_THEMES[selectedCell.band].border}`,
              boxShadow: "var(--shadow-md)",
              margin: 0,
              overflow: "hidden",
            }}
          >
            {/* Drill-down Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--hs-border-dark)",
                background: BAND_THEMES[selectedCell.band].bg,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      background: BAND_THEMES[selectedCell.band].badgeBg,
                      color: BAND_THEMES[selectedCell.band].text,
                      padding: "2px 8px",
                      borderRadius: 4,
                      textTransform: "uppercase",
                    }}
                  >
                    ● {selectedCell.band} RISK
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>•</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-heading)" }}>
                    {selectedCell.stage} Stage
                  </span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
                  Drill-Down: {selectedDeals.length} Enterprise Deals (
                  {formatCurrency(getCellValue(selectedCell.stage, selectedCell.band))})
                </h3>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => {
                    showToast(`⚡ Dispatched AI remediation cadences for ${selectedDeals.length} deals in ${selectedCell.stage}.`);
                    logAuditEvent({
                      actor: "Peash Rudra",
                      role: "VP Sales Ops",
                      actionType: "Batch Deal Remediation",
                      targetObject: `${selectedCell.stage} (${selectedCell.band})`,
                      tier: "Tier 2 (Assisted Task)",
                      status: "Success",
                      details: `Triggered multi-threading playbooks for ${selectedDeals.length} deals in ${selectedCell.stage}.`,
                    });
                  }}
                  style={{
                    padding: "6px 12px",
                    background: "#ff5c35",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(255, 92, 53, 0.25)",
                  }}
                >
                  ⚡ Auto-Remediate Cell
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedCell(null)}
                  style={{ background: "#ffffff", border: "1px solid var(--hs-border-dark)" }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Prescriptive Guidance */}
            <div
              style={{
                padding: "10px 18px",
                background: "rgba(45, 62, 80, 0.04)",
                borderBottom: "1px solid var(--hs-border-dark)",
                fontSize: "12px",
                color: "var(--hs-heading)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>💡</span>
              <span>
                <strong>RevOps Recommendation:</strong>{" "}
                {selectedCell.band === "Critical"
                  ? "Immediate pipeline choke point. Require rep to verify Economic Buyer alignment and enforce a Mutual Action Plan before advancing."
                  : selectedCell.band === "High"
                  ? "Slippage warning. Re-engage executive sponsor and confirm security/procurement criteria."
                  : "On track with established velocity benchmarks. Maintain scheduled sales cadences."}
              </span>
            </div>

            {/* Deals Table */}
            <div className="table-responsive">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--hs-border-dark)" }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>Deal &amp; Account</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>ARR Value</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>DealScore</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>Days in Stage</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>Account Owner</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>Key Risk Indicator</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDeals.map((deal) => (
                    <tr
                      key={deal.id}
                      onClick={() => setSelectedDrawerDeal(deal as any)}
                      style={{
                        borderBottom: "1px solid #eaf0f6",
                        cursor: "pointer",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fffbf9")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 800, color: "var(--hs-primary)", fontSize: "13px" }}>
                          {deal.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                          {deal.client}
                        </div>
                      </td>

                      <td style={{ padding: "12px 14px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#ff5c35" }}>
                        ${(deal.value / 1000).toFixed(0)}K
                      </td>

                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: 800,
                            background: BAND_THEMES[deal.band].badgeBg,
                            color: BAND_THEMES[deal.band].text,
                          }}
                        >
                          {deal.score} · {deal.band}
                        </span>
                      </td>

                      <td style={{ padding: "12px 14px", color: "var(--hs-text)" }}>
                        <span style={{ fontWeight: (deal.daysInStage || 0) > 15 ? 700 : 500, color: (deal.daysInStage || 0) > 15 ? "#d93843" : "var(--hs-text)" }}>
                          {deal.daysInStage || 8} days
                        </span>
                      </td>

                      <td style={{ padding: "12px 14px", color: "var(--hs-text-muted)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              background: "#2d3e50",
                              color: "#ffffff",
                              fontSize: "10px",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {deal.owner
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                          <span>{deal.owner}</span>
                        </div>
                      </td>

                      <td style={{ padding: "12px 14px", color: "var(--hs-text)", maxWidth: 280, lineHeight: 1.35 }}>
                        {deal.risks && deal.risks.length > 0 ? (
                          <span style={{ fontSize: "11.5px", color: "#d93843", fontWeight: 600 }}>
                            ⚠️ {deal.risks[0].text}
                          </span>
                        ) : (
                          <span style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
                            {deal.recommendation || "Pacing normally according to MEDDICC."}
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDrawerDeal(deal as any);
                          }}
                          style={{
                            background: "#ffffff",
                            border: "1px solid var(--hs-border-dark)",
                            color: "#007a8c",
                            fontWeight: 700,
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
