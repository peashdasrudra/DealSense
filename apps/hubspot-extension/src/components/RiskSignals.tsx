/**
 * RiskSignals — Staggered-animated list of deal risk signals with severity dots.
 * Canvas Design System Edition.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RiskSignal {
  signal_name: string;
  category: string;
  severity: string;
  score: number;
  weight: number;
  weighted_score: number;
  evidence: string;
  recommendation: string;
}

interface RiskSignalsProps {
  signals: RiskSignal[];
  maxVisible?: number;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "var(--risk-critical)",
  high: "var(--risk-high)",
  moderate: "var(--risk-moderate)",
  low: "var(--risk-low)",
  healthy: "var(--risk-healthy)",
};

export const RiskSignals: React.FC<RiskSignalsProps> = ({
  signals,
  maxVisible = 5,
}) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const sorted = [...signals].sort((a, b) => b.weighted_score - a.weighted_score);
  const visible = showAll ? sorted : sorted.slice(0, maxVisible);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
      {visible.map((signal, idx) => {
        const color = SEVERITY_COLORS[signal.severity] || SEVERITY_COLORS.moderate;
        const isExpanded = expandedIdx === idx;

        return (
          <motion.div
            key={signal.signal_name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            onClick={() => setExpandedIdx(isExpanded ? null : idx)}
            style={{
              background: "var(--hs-background)",
              border: "1px solid var(--hs-border)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--sp-3)",
              cursor: "pointer",
            }}
            whileHover={{ borderColor: "var(--hs-border-dark)" }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--sp-3)" }}>
              {/* Severity dot */}
              <motion.div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                  marginTop: 6,
                  flexShrink: 0,
                }}
                animate={
                  signal.severity === "critical"
                    ? { scale: [1, 1.3, 1] }
                    : {}
                }
                transition={{ duration: 1.2, repeat: Infinity }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--hs-text)", textTransform: "capitalize" }}>
                  {signal.signal_name.replace(/_/g, " ")}
                </div>
                <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {signal.evidence}
                </div>
              </div>

              <div style={{ fontSize: "14px", fontWeight: 600, color, fontFamily: "var(--font-mono)" }}>
                {signal.weighted_score.toFixed(1)}
              </div>

              {/* Expand chevron */}
              <motion.svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--hs-text-muted)"
                strokeWidth={2}
                strokeLinecap="round"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ flexShrink: 0, marginTop: 2 }}
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </div>

            {/* Expanded detail panel */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      paddingTop: "var(--sp-3)",
                      marginTop: "var(--sp-3)",
                      borderTop: "1px solid var(--hs-border)",
                    }}
                  >
                    <div style={{ display: "flex", gap: "var(--sp-6)", marginBottom: "var(--sp-2)" }}>
                      <div>
                        <div style={{ fontSize: "10px", color: "var(--hs-text-disabled)", textTransform: "uppercase", letterSpacing: "1px" }}>Category</div>
                        <div style={{ fontSize: "12px", color: "var(--hs-text)", fontWeight: 500, textTransform: "capitalize" }}>{signal.category.replace(/_/g, " ")}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "var(--hs-text-disabled)", textTransform: "uppercase", letterSpacing: "1px" }}>Weight</div>
                        <div style={{ fontSize: "12px", color: "var(--hs-text)", fontWeight: 500 }}>{signal.weight}×</div>
                      </div>
                    </div>

                    <div style={{ fontSize: "13px", color: "var(--hs-text-muted)", lineHeight: 1.5, marginBottom: "var(--sp-3)" }}>
                      <strong>Evidence:</strong> {signal.evidence}
                    </div>

                    {signal.recommendation && (
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--hs-text)",
                          lineHeight: 1.5,
                          padding: "var(--sp-3)",
                          background: "var(--hs-surface-hover)",
                          borderRadius: "var(--radius-sm)",
                          borderLeft: `3px solid ${color}`,
                        }}
                      >
                        💡 {signal.recommendation}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Show more/less toggle */}
      {sorted.length > maxVisible && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowAll(!showAll)}
          style={{ alignSelf: "center", marginTop: "var(--sp-2)" }}
        >
          {showAll ? "Show fewer" : `View ${sorted.length - maxVisible} more signals`}
        </button>
      )}
    </div>
  );
};
