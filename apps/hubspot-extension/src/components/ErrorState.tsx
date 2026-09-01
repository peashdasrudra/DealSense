/**
 * ErrorState — Premium error display with retry action.
 */

import React from "react";
import { motion } from "framer-motion";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Unable to load deal intelligence",
  onRetry,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 16,
      }}
    >
      {/* Error icon */}
      <motion.div
        animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--ds-risk-critical-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        ⚠️
      </motion.div>

      <div>
        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ds-text-primary)", marginBottom: 4 }}>
          Something went wrong
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--ds-text-tertiary)", maxWidth: 260, lineHeight: 1.5 }}>
          {message}
        </div>
      </div>

      {onRetry && (
        <motion.button
          className="ds-btn ds-btn-primary"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRetry}
        >
          ↻ Retry Analysis
        </motion.button>
      )}
    </motion.div>
  );
};
