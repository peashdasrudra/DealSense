/**
 * DealSense Dashboard — Client Health Grid Page.
 * Canvas Design System Edition.
 * Wired to Real FastAPI Backend with graceful Enterprise fallback.
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchDeals } from "../api";

const SAMPLE_CLIENTS = [
  {
    name: "TechCorp Inc.",
    dealCount: 12,
    totalValue: 1240000,
    avgScore: 58,
    riskDist: { critical: 2, high: 3, moderate: 4, low: 2, healthy: 1 },
    worstDeal: { name: "Orion Cloud Migration", score: 23, band: "critical" },
  },
  {
    name: "FinanceGo Ltd.",
    dealCount: 8,
    totalValue: 890000,
    avgScore: 72,
    riskDist: { critical: 0, high: 1, moderate: 3, low: 2, healthy: 2 },
    worstDeal: { name: "Quantum Security Suite", score: 44, band: "high" },
  },
  {
    name: "RetailMax",
    dealCount: 6,
    totalValue: 560000,
    avgScore: 45,
    riskDist: { critical: 1, high: 2, moderate: 2, low: 1, healthy: 0 },
    worstDeal: { name: "Horizon Data Platform", score: 35, band: "critical" },
  },
  {
    name: "LogiPro Solutions",
    dealCount: 9,
    totalValue: 720000,
    avgScore: 81,
    riskDist: { critical: 0, high: 0, moderate: 2, low: 4, healthy: 3 },
    worstDeal: { name: "Apex CRM Integration", score: 62, band: "moderate" },
  },
  {
    name: "HealthFirst Corp.",
    dealCount: 5,
    totalValue: 430000,
    avgScore: 66,
    riskDist: { critical: 0, high: 1, moderate: 2, low: 1, healthy: 1 },
    worstDeal: { name: "Nebula Analytics Engine", score: 46, band: "high" },
  },
  {
    name: "ManufactCo",
    dealCount: 7,
    totalValue: 950000,
    avgScore: 54,
    riskDist: { critical: 1, high: 2, moderate: 2, low: 1, healthy: 1 },
    worstDeal: { name: "Titan ERP Modernization", score: 38, band: "critical" },
  },
];

const RISK_COLORS: Record<string, string> = {
  critical: "var(--danger)",
  high: "var(--warning)",
  moderate: "#1971c2",
  low: "var(--success)",
  healthy: "var(--success)",
};

const getScoreColor = (score: number) => {
  if (score < 30) return "var(--danger)";
  if (score < 50) return "var(--warning)";
  if (score < 65) return "#1971c2";
  if (score < 80) return "var(--success)";
  return "var(--success)";
};

export const ClientHealth: React.FC = () => {
  const [clients, setClients] = useState<any[]>(SAMPLE_CLIENTS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchDeals()
      .then((data) => {
        if (data && data.length > 0) {
          const deals = data;
          const clientMap: Record<string, any[]> = {};
          deals.forEach((d: any) => {
            const c = d.client || "Unknown Client";
            if (!clientMap[c]) clientMap[c] = [];
            clientMap[c].push(d);
          });

          const aggregatedClients = Object.entries(clientMap).map(([name, clientDeals]) => {
            const dealCount = clientDeals.length;
            const totalValue = clientDeals.reduce((sum, d) => sum + (d.value || 0), 0);
            const avgScore = Math.round(clientDeals.reduce((sum, d) => sum + d.score, 0) / dealCount);
            
            const riskDist: Record<string, number> = { critical: 0, high: 0, moderate: 0, low: 0, healthy: 0 };
            clientDeals.forEach(d => {
              const b = (d.band || "moderate").toLowerCase();
              if (riskDist[b] !== undefined) riskDist[b]++;
              else riskDist["moderate"]++;
            });

            const sortedByScore = [...clientDeals].sort((a, b) => a.score - b.score);
            const worstDeal = sortedByScore[0];

            return {
              name,
              dealCount,
              totalValue,
              avgScore,
              riskDist,
              worstDeal: {
                name: worstDeal.name,
                score: worstDeal.score,
                band: (worstDeal.band || "moderate").toLowerCase(),
              },
            };
          });

          aggregatedClients.sort((a, b) => a.avgScore - b.avgScore);
          setClients(aggregatedClients);
          setIsLive(true);
        }
      })
      .catch((err) => {
        console.warn("Using sample clients intelligence:", err);
      });
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)" }}>
        <div style={{ fontSize: "13px", color: "var(--hs-text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: isLive ? "var(--success)" : "var(--hs-primary)", display: "inline-block" }} />
          <span>{isLive ? "Live CRM Accounts Synced" : "Portfolio Account Intelligence (Demo Active)"}</span>
        </div>
        <span className="badge badge-outline">{clients.length} key accounts</span>
      </div>

      <div className="grid-3">
        {clients.map((client, idx) => {
          const distValues = Object.values(client.riskDist) as number[];
          const total = distValues.reduce((s: number, v: number) => s + v, 0) || 1;
          const scoreColor = getScoreColor(client.avgScore);

          return (
            <motion.div
              key={client.name}
              className="card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              style={{ cursor: "pointer", transition: "all 0.2s" }}
              whileHover={{ y: -2, boxShadow: "var(--shadow-md)", borderColor: "var(--hs-border-dark)" }}
            >
              <div className="card-body">
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--hs-text)", marginBottom: 4 }}>
                      {client.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>
                      {client.dealCount} deals · ${(client.totalValue / 1000000).toFixed(1)}M pipeline
                    </div>
                  </div>

                  {/* Score ring */}
                  <div style={{ position: "relative" }}>
                    <svg width={52} height={52} style={{ transform: "rotate(-90deg)" }}>
                      <circle cx={26} cy={26} r={21} fill="none" stroke="var(--hs-border-dark)" strokeWidth={4} />
                      <motion.circle
                        cx={26}
                        cy={26}
                        r={21}
                        fill="none"
                        stroke={scoreColor}
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 21}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 21 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 21 * (1 - client.avgScore / 100) }}
                        transition={{ delay: 0.2 + idx * 0.05, duration: 1.0, ease: "easeOut" }}
                      />
                    </svg>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "14px",
                        fontWeight: 800,
                        color: scoreColor,
                      }}
                    >
                      {client.avgScore}
                    </div>
                  </div>
                </div>

                {/* Risk distribution bar */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, fontWeight: 500 }}>
                    Risk Distribution
                  </div>
                  <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden" }}>
                    {Object.entries(client.riskDist).map(([band, count]: [string, any]) => (
                      <motion.div
                        key={band}
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / total) * 100}%` }}
                        transition={{ delay: 0.4 + idx * 0.05, duration: 0.6, ease: "easeOut" }}
                        style={{ background: RISK_COLORS[band] }}
                      />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    {Object.entries(client.riskDist)
                      .filter(([, count]: [string, any]) => count > 0)
                      .map(([band, count]: [string, any]) => (
                        <span
                          key={band}
                          style={{
                            fontSize: "11px",
                            color: RISK_COLORS[band],
                            fontWeight: 600,
                          }}
                        >
                          {count} {band.charAt(0).toUpperCase()}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Worst deal */}
                {client.worstDeal && (
                  <div
                    style={{
                      padding: "12px",
                      background: "var(--hs-surface-hover)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--hs-border)",
                      borderLeft: `4px solid ${RISK_COLORS[client.worstDeal.band] || "var(--hs-primary)"}`,
                    }}
                  >
                    <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, fontWeight: 500 }}>
                      Lowest Health Deal
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--hs-text)" }}>
                        {client.worstDeal.name}
                      </span>
                      <span
                        className="risk-pill"
                        data-band={client.worstDeal.band}
                      >
                        {client.worstDeal.score}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
