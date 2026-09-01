/**
 * HealthGauge — Animated radial arc displaying deal health score (0–100).
 * Canvas Design System Edition.
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HealthGaugeProps {
  score: number;
  riskBand: string;
  delta?: number | null;
  confidence?: number;
  size?: number;
}

const RISK_COLORS: Record<string, string> = {
  critical: "var(--risk-critical)",
  high: "var(--risk-high)",
  moderate: "var(--risk-moderate)",
  low: "var(--risk-low)",
  healthy: "var(--risk-healthy)",
};

const RISK_LABELS: Record<string, string> = {
  critical: "Critical",
  high: "High Risk",
  moderate: "Moderate",
  low: "Low Risk",
  healthy: "Healthy",
};

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  score,
  riskBand,
  delta = null,
  confidence = 1.0,
  size = 164,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = RISK_COLORS[riskBand] || RISK_COLORS.moderate;
  const label = RISK_LABELS[riskBand] || riskBand;

  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270° arc
  const dashOffset = arcLength - (arcLength * animatedScore) / 100;

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      {/* SVG Arc */}
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(135deg)" }}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--hs-border)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
      </svg>

      {/* Center label */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -48%)",
          textAlign: "center",
        }}
      >
        <motion.div
          key={score}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            fontSize: "36px",
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            color: "var(--hs-text)",
            lineHeight: 1,
          }}
        >
          {score}
        </motion.div>

        <div
          style={{
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: color,
            marginTop: 4,
          }}
        >
          {label}
        </div>

        {/* Delta badge */}
        <AnimatePresence>
          {delta !== null && delta !== undefined && delta !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              style={{ marginTop: 6, display: "flex", justifyContent: "center" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 6px",
                  borderRadius: "var(--radius-pill)",
                  fontSize: "10px",
                  fontWeight: 600,
                  background: delta > 0 ? "var(--success-bg)" : "var(--danger-bg)",
                  color: delta > 0 ? "var(--success)" : "var(--danger)",
                }}
              >
                {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confidence ring */}
      {confidence < 1.0 && (
        <div
          style={{
            position: "absolute",
            bottom: 6,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ fontSize: "10px", color: "var(--hs-text-disabled)" }}>
            {Math.round(confidence * 100)}% conf
          </span>
        </div>
      )}
    </div>
  );
};
