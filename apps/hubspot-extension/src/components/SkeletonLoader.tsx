/**
 * SkeletonLoader — Shimmer loading state matching the DealSense card layout.
 */

import React from "react";
import { motion } from "framer-motion";

export const SkeletonLoader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 20 }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div className="ds-skeleton" style={{ width: 32, height: 32, borderRadius: "50%" }} />
        <div>
          <div className="ds-skeleton" style={{ width: 140, height: 14, marginBottom: 6 }} />
          <div className="ds-skeleton" style={{ width: 200, height: 10 }} />
        </div>
      </div>

      {/* Gauge placeholder */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <div className="ds-skeleton" style={{ width: 148, height: 148, borderRadius: "50%" }} />
      </div>

      {/* MEDDICC grid placeholder */}
      <div style={{ marginBottom: 24 }}>
        <div className="ds-skeleton" style={{ width: 100, height: 10, marginBottom: 12 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="ds-skeleton" style={{ height: 56, borderRadius: 8 }} />
          ))}
        </div>
      </div>

      {/* Signals placeholder */}
      <div className="ds-skeleton" style={{ width: 80, height: 10, marginBottom: 12 }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="ds-skeleton"
          style={{ height: 52, borderRadius: 8, marginBottom: 6 }}
        />
      ))}

      {/* Actions placeholder */}
      <div className="ds-skeleton" style={{ width: 100, height: 10, marginTop: 20, marginBottom: 12 }} />
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="ds-skeleton"
          style={{ height: 88, borderRadius: 10, marginBottom: 8 }}
        />
      ))}
    </motion.div>
  );
};
