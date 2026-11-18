/**
 * DealSense — Ultra-Premium Animated Loading Screen & Brand Transition.
 * Features glowing sprocket halo, live telemetry initialization sequence, and spring progress bar.
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DealSenseIcon } from "./DealSenseLogo";

interface LoadingScreenProps {
  isLoading: boolean;
  onFinish?: () => void;
  message?: string;
}

const STEPS = [
  "Connecting to HubSpot Webhook Stream...",
  "Calibrating 0–100 Deterministic Risk Models...",
  "Synthesizing 20 Active Deals & MEDDICC Vectors...",
  "Revenue Intelligence Engine Ready.",
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  onFinish,
  message,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isLoading) return;

    setStepIndex(0);
    setProgress(20);

    const timer1 = setTimeout(() => {
      setStepIndex(1);
      setProgress(55);
    }, 180);

    const timer2 = setTimeout(() => {
      setStepIndex(2);
      setProgress(85);
    }, 360);

    const timer3 = setTimeout(() => {
      setStepIndex(3);
      setProgress(100);
    }, 540);

    const timerEnd = setTimeout(() => {
      if (onFinish) onFinish();
    }, 720);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerEnd);
    };
  }, [isLoading, onFinish]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="dealsense-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            background: "linear-gradient(135deg, #124548 0%, #062b2e 100%)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            color: "#ffffff",
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            style={{
              position: "absolute",
              width: "360px",
              height: "360px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255, 92, 53, 0.18) 0%, rgba(0, 164, 189, 0.08) 50%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Central Animated Logo Container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            {/* Spinning Gradient Halo Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              style={{
                position: "absolute",
                top: -14,
                width: 76,
                height: 76,
                borderRadius: "50%",
                border: "2px dashed rgba(255, 92, 53, 0.4)",
                borderTopColor: "#ff5c35",
                borderRightColor: "#00a4bd",
              }}
            />

            {/* Glowing Center Logo */}
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                backdropFilter: "blur(8px)",
              }}
            >
              <DealSenseIcon size={34} />
            </div>

            {/* Brand Title */}
            <div style={{ marginTop: 18, textAlign: "center" }}>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                }}
              >
                <span style={{ color: "#ffffff" }}>Deal</span>
                <span style={{ color: "#ff5c35" }}>Sense</span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#9ba7a8",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginTop: 3,
                }}
              >
                Autonomous Revenue Intelligence
              </div>
            </div>
          </motion.div>

          {/* Progress Bar Container */}
          <div style={{ width: "100%", maxWidth: 280, marginBottom: 16 }}>
            <div
              style={{
                height: 4,
                width: "100%",
                background: "rgba(255, 255, 255, 0.12)",
                borderRadius: 99,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <motion.div
                initial={{ width: "10%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut", duration: 0.2 }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #ff5c35 0%, #ff7a59 50%, #00a4bd 100%)",
                  borderRadius: 99,
                  boxShadow: "0 0 12px rgba(255, 92, 53, 0.6)",
                }}
              />
            </div>
          </div>

          {/* Dynamic Telemetry Status Step */}
          <div
            style={{
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              color: "#e6f0f0",
              textAlign: "center",
              minHeight: 20,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c35", display: "inline-block" }} />
            <span>{message || STEPS[stepIndex]}</span>
          </div>

          {/* Bottom Security Assurance */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              fontSize: "11px",
              color: "#6e8a8c",
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <span>🔒 AES-256 Token Encryption</span>
            <span>•</span>
            <span>⚡ Sub-200ms Webhook Stream</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
