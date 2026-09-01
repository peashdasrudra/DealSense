/**
 * ActionCards — Tiered action recommendation cards with approval/rejection flows.
 * Canvas Design System Edition.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Recommendation {
  id: string;
  tier: string;
  title: string;
  description: string;
  rationale: string;
  impact_estimate: string;
  status: string;
}

interface ActionCardsProps {
  recommendations: Recommendation[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const TIER_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  tier_1: { label: "Observe", color: "var(--hs-text-muted)", bg: "var(--hs-border)", icon: "👁" },
  tier_2: { label: "Notify", color: "var(--tier-2)", bg: "var(--hs-surface-hover)", icon: "🔔" },
  tier_3: { label: "Assist", color: "var(--tier-3)", bg: "var(--hs-surface-hover)", icon: "🤝" },
  tier_4: { label: "Act", color: "var(--tier-4)", bg: "var(--hs-surface-hover)", icon: "⚡" },
};

export const ActionCards: React.FC<ActionCardsProps> = ({
  recommendations,
  onApprove,
  onReject,
}) => {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
      {recommendations.map((rec, idx) => {
        const tier = TIER_META[rec.tier] || TIER_META.tier_1;
        const isConfirming = confirmingId === rec.id;
        const needsApproval = rec.tier === "tier_3" || rec.tier === "tier_4";

        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            style={{
              background: "var(--hs-background)",
              border: "1px solid var(--hs-border)",
              borderLeft: `3px solid ${tier.color}`,
              borderRadius: "var(--radius-sm)",
              padding: "var(--sp-4)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--sp-2)", marginBottom: "var(--sp-2)" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 8px",
                  borderRadius: "var(--radius-pill)",
                  background: tier.bg,
                  color: tier.color,
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginTop: 2,
                }}
              >
                {tier.icon} {tier.label}
              </span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--hs-text)", lineHeight: 1.3 }}>
                {rec.title}
              </span>
            </div>

            {/* Description */}
            <div style={{ fontSize: "13px", color: "var(--hs-text)", marginBottom: "var(--sp-2)", lineHeight: 1.5 }}>
              {rec.description}
            </div>

            {/* Rationale (collapsed visually) */}
            {rec.rationale && (
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--hs-text-muted)",
                  lineHeight: 1.45,
                  marginBottom: "var(--sp-3)",
                  paddingLeft: "var(--sp-2)",
                  borderLeft: "2px solid var(--hs-border)",
                }}
              >
                {rec.rationale}
              </div>
            )}

            {/* Footer: Impact + Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--sp-3)" }}>
              {rec.impact_estimate ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "11px", color: "var(--hs-text-muted)" }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  {rec.impact_estimate}
                </div>
              ) : <div />}

              <div>
                <AnimatePresence mode="wait">
                  {isConfirming ? (
                    <motion.div
                      key="confirm-row"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      style={{ display: "flex", gap: "var(--sp-2)", alignItems: "center" }}
                    >
                      <span style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>
                        Confirm?
                      </span>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          onApprove?.(rec.id);
                          setConfirmingId(null);
                        }}
                      >
                        ✓ Approve
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setConfirmingId(null)}
                      >
                        ✕
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default-row"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      style={{ display: "flex", gap: "var(--sp-2)" }}
                    >
                      {needsApproval && rec.status === "pending" && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setConfirmingId(rec.id)}
                        >
                          {rec.tier === "tier_4" ? "⚡ Execute" : "✓ Approve"}
                        </button>
                      )}

                      {needsApproval && rec.status === "pending" && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onReject?.(rec.id)}
                        >
                          Dismiss
                        </button>
                      )}

                      {rec.status === "approved" && (
                        <span className="badge" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
                          ✓ Approved
                        </span>
                      )}

                      {rec.status === "executed" && (
                        <span className="badge" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
                          ⚡ Executed
                        </span>
                      )}

                      {rec.status === "rejected" && (
                        <span className="badge" style={{ background: "var(--danger-bg)", color: "var(--danger)" }}>
                          ✕ Dismissed
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
