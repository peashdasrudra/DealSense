/**
 * MeddiccMatrix — Interactive MEDDICC qualification status grid.
 * Canvas Design System Edition.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MeddiccField {
  dimension: string;
  status: "confirmed" | "identified" | "unknown" | "missing";
  confidence: number;
  evidence: string;
}

interface MeddiccMatrixProps {
  fields: MeddiccField[];
}

const DIMENSION_META: Record<string, { letter: string; label: string }> = {
  metrics: { letter: "M", label: "Metrics" },
  economic_buyer: { letter: "E", label: "Econ Buyer" },
  decision_criteria: { letter: "D", label: "Criteria" },
  decision_process: { letter: "D", label: "Process" },
  identify_pain: { letter: "I", label: "Pain" },
  champion: { letter: "C", label: "Champion" },
  competition: { letter: "C", label: "Compete" },
};

const STATUS_ICONS: Record<string, string> = {
  confirmed: "✓",
  identified: "◐",
  unknown: "?",
  missing: "✕",
};

export const MeddiccMatrix: React.FC<MeddiccMatrixProps> = ({ fields }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Fill in default 7 if fewer
  const allDimensions = [
    "metrics", "economic_buyer", "decision_criteria",
    "decision_process", "identify_pain", "champion", "competition",
  ];

  const fieldMap = new Map(fields.map((f) => [f.dimension, f]));

  return (
    <div className="meddicc-grid">
      {allDimensions.map((dim, idx) => {
        const field = fieldMap.get(dim);
        const meta = DIMENSION_META[dim] || { letter: "?", label: dim };
        const status = field?.status || "unknown";
        const confidence = field?.confidence || 0;
        const icon = STATUS_ICONS[status];

        // Map status to our semantic CSS risk variables
        let colorVar = "var(--hs-text-disabled)";
        if (status === "confirmed") colorVar = "var(--risk-healthy)";
        if (status === "identified") colorVar = "var(--risk-moderate)";
        if (status === "missing") colorVar = "var(--risk-critical)";

        return (
          <motion.div
            key={dim}
            className="meddicc-pill"
            data-status={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ position: "relative" }}
          >
            {/* Status icon top-right */}
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                fontSize: "10px",
                fontWeight: 700,
                color: colorVar,
                lineHeight: 1,
              }}
            >
              {icon}
            </span>

            {/* Letter */}
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                color: "var(--hs-text)",
                lineHeight: 1.2,
              }}
            >
              {meta.letter}
            </span>

            {/* Label */}
            <span style={{ fontSize: "11px", color: "var(--hs-text-muted)", fontWeight: 500 }}>
              {meta.label}
            </span>

            {/* Confidence bar */}
            <div
              style={{
                width: "100%",
                height: 3,
                background: "var(--hs-border)",
                borderRadius: "var(--radius-pill)",
                marginTop: 6,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence * 100}%` }}
                transition={{ delay: 0.2 + idx * 0.05, duration: 0.5, ease: "easeOut" }}
                style={{ height: "100%", background: colorVar }}
              />
            </div>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredIdx === idx && field?.evidence && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 8px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 220,
                    background: "var(--hs-text)",
                    color: "var(--hs-background)",
                    padding: "var(--sp-3)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "12px",
                    lineHeight: 1.5,
                    zIndex: 10,
                    boxShadow: "var(--shadow-md)",
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4, color: "var(--hs-on-primary)" }}>
                    {meta.label}
                  </div>
                  <div>{field.evidence}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
