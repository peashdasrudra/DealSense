/**
 * DealSense — Enterprise HubSpot-Native Telemetry Loader & Skeleton System.
 * Clean, lightweight, and engineered for sub-200ms perceptual feedback.
 */

import React from "react";
import { motion } from "framer-motion";
import { DealSenseIcon } from "./DealSenseLogo";

interface EnterpriseLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "fullscreen";
}

export const EnterpriseLoader: React.FC<EnterpriseLoaderProps> = ({
  message = "Ingesting HubSpot Pipeline Telemetry...",
  size = "md",
}) => {
  if (size === "fullscreen") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(6px)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            background: "#ffffff",
            padding: "24px 32px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--hs-border-dark)",
            borderTop: "3px solid #ff5c35",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            maxWidth: "340px",
            textAlign: "center",
          }}
        >
          <div style={{ position: "relative", width: 44, height: 44 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                border: "2px solid rgba(255, 92, 53, 0.15)",
                borderTopColor: "#ff5c35",
              }}
            />
            <DealSenseIcon size={44} />
          </div>

          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--hs-heading)" }}>
              DealSense Intelligence
            </div>
            <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
              {message}
            </div>
          </div>

          {/* Micro Telemetry Bar */}
          <div
            style={{
              width: "100%",
              height: 3,
              background: "var(--hs-surface)",
              borderRadius: 99,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <motion.div
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
              }}
              style={{
                width: "45%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, #ff5c35, transparent)",
                borderRadius: 99,
              }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 20px",
        gap: "12px",
      }}
    >
      <div style={{ position: "relative", width: 36, height: 36 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            border: "2px solid rgba(255, 92, 53, 0.2)",
            borderTopColor: "#ff5c35",
          }}
        />
        <DealSenseIcon size={36} />
      </div>
      <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--hs-text-muted)" }}>
        {message}
      </div>
    </div>
  );
};
