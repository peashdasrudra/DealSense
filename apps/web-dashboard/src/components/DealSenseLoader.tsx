/**
 * DealSense — Luxury Live Animated Telemetry Loader.
 * High-performance SVG gyroscopic rings, pulsing telemetry core, and ambient glassmorphic HUD.
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DealSenseLoaderProps {
  variant?: "fullscreen" | "overlay" | "inline";
  message?: string;
  subMessage?: string;
  size?: "sm" | "md" | "lg";
}

export const DealSenseTelemetryEmblem: React.FC<{ size?: number; showPulse?: boolean }> = ({
  size = 64,
  showPulse = true,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Ambient Breathing Glow */}
      {showPulse && (
        <>
          <div
            style={{
              position: "absolute",
              width: size * 1.3,
              height: size * 1.3,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255, 92, 53, 0.28) 0%, rgba(0, 189, 165, 0.12) 50%, transparent 70%)",
              filter: "blur(12px)",
              animation: "dealsense-ambient-breath 2.2s ease-in-out infinite alternate",
              pointerEvents: "none",
            }}
          />
          {/* Expanding Radar Ripple */}
          <div
            style={{
              position: "absolute",
              width: size * 0.9,
              height: size * 0.9,
              borderRadius: "50%",
              border: "1.5px solid rgba(255, 92, 53, 0.4)",
              animation: "dealsense-radar-ripple 2s cubic-bezier(0.1, 0.2, 0.4, 1) infinite",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* SVG Gyroscopic Telemetry Rings */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="coralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5c35" />
            <stop offset="100%" stopColor="#ff9068" />
          </linearGradient>
          <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00bda5" />
            <stop offset="100%" stopColor="#00e5c9" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Ring: Rotating Dashed Ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="rgba(226, 232, 240, 0.85)"
          strokeWidth="1.2"
        />
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="url(#coralGrad)"
          strokeWidth="2.2"
          strokeDasharray="24 16 38 12 10 20"
          strokeLinecap="round"
          filter="url(#glow)"
          style={{
            transformOrigin: "50% 50%",
            animation: "dealsense-spin-clockwise 3.6s linear infinite",
          }}
        />

        {/* Middle Ring: Counter-rotating Teal Telemetry Arc with Satellite Node */}
        <circle
          cx="50"
          cy="50"
          r="37"
          fill="none"
          stroke="url(#tealGrad)"
          strokeWidth="1.8"
          strokeDasharray="50 180"
          strokeLinecap="round"
          style={{
            transformOrigin: "50% 50%",
            animation: "dealsense-spin-counter 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        />

        {/* Orbiting Satellite Node 1 */}
        <g
          style={{
            transformOrigin: "50% 50%",
            animation: "dealsense-spin-clockwise 2.2s linear infinite",
          }}
        >
          <circle cx="50" cy="13" r="3.2" fill="#00bda5" filter="url(#glow)" />
          <circle cx="50" cy="13" r="1.5" fill="#ffffff" />
        </g>

        {/* Orbiting Satellite Node 2 (Coral) */}
        <g
          style={{
            transformOrigin: "50% 50%",
            animation: "dealsense-spin-counter 3.2s linear infinite",
          }}
        >
          <circle cx="87" cy="50" r="3" fill="#ff5c35" filter="url(#glow)" />
          <circle cx="87" cy="50" r="1.2" fill="#ffffff" />
        </g>

        {/* Inner Tech Crosshair Reticles */}
        <line x1="50" y1="2" x2="50" y2="7" stroke="rgba(255, 92, 53, 0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="50" y1="93" x2="50" y2="98" stroke="rgba(255, 92, 53, 0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="50" x2="7" y2="50" stroke="rgba(0, 189, 165, 0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="93" y1="50" x2="98" y2="50" stroke="rgba(0, 189, 165, 0.5)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Central Branded Logo Core */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: size * 0.46,
          height: size * 0.46,
          borderRadius: "50%",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 4px 12px rgba(255, 92, 53, 0.22), 0 1px 3px rgba(0,0,0,0.08), inset 0 1px 1px #ffffff",
          animation: "dealsense-core-float 2.2s ease-in-out infinite alternate",
        }}
      >
        <img
          src="/logo_icon.png"
          alt="DealSense"
          style={{
            width: size * 0.32,
            height: size * 0.32,
            objectFit: "contain",
            filter: "drop-shadow(0 1px 4px rgba(255, 92, 53, 0.4))",
          }}
        />
      </div>
    </div>
  );
};

export const DealSenseLoader: React.FC<DealSenseLoaderProps> = ({
  variant = "overlay",
  message = "Syncing Revenue Telemetry...",
  subMessage = "7-Vector Deterministic Telemetry Engine",
}) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92;
        return prev + Math.floor(Math.random() * 18 + 8);
      });
    }, 90);
    return () => clearInterval(interval);
  }, []);

  if (variant === "inline") {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 16px",
          borderRadius: 12,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
        }}
      >
        <DealSenseTelemetryEmblem size={34} showPulse={false} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{message}</span>
          {subMessage && (
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>{subMessage}</span>
          )}
        </div>
      </div>
    );
  }

  const isFullscreen = variant === "fullscreen";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isFullscreen
          ? "rgba(248, 250, 252, 0.98)"
          : "rgba(248, 250, 252, 0.72)",
        backdropFilter: isFullscreen ? "blur(24px)" : "blur(10px)",
        WebkitBackdropFilter: isFullscreen ? "blur(24px)" : "blur(10px)",
        pointerEvents: "all",
      }}
    >
      {/* Background Dot Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(148, 163, 184, 0.28) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 80%)",
          pointerEvents: "none",
        }}
      />

      {/* Floating Frosted Glass Telemetry Capsule */}
      <motion.div
        initial={{ scale: 0.92, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: -8, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "36px 44px",
          borderRadius: 24,
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          boxShadow:
            "0 20px 48px -12px rgba(45, 62, 80, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 1)",
          maxWidth: 380,
          width: "calc(100vw - 40px)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Top Shimmer Light */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(255, 92, 53, 0.6), transparent)",
          }}
        />

        {/* Live Animated Telemetry Core */}
        <DealSenseTelemetryEmblem size={74} showPulse={true} />

        {/* Brand Wordmark & Dynamic Status */}
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#1e293b" }}>Deal</span>
            <span style={{ color: "#ff5c35", fontWeight: 800 }}>Sense</span>
          </div>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13.5,
              fontWeight: 600,
              color: "#334155",
              letterSpacing: "-0.01em",
            }}
          >
            {message}
          </p>

          {subMessage && (
            <span
              style={{
                fontSize: 11.5,
                color: "#64748b",
                fontWeight: 500,
                letterSpacing: "0.01em",
              }}
            >
              {subMessage}
            </span>
          )}
        </div>

        {/* Laser Progress Bar */}
        <div
          style={{
            width: "100%",
            height: 3.5,
            background: "rgba(226, 232, 240, 0.7)",
            borderRadius: 4,
            marginTop: 22,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, #ff5c35 0%, #ff7a59 50%, #00bda5 100%)",
              borderRadius: 4,
              transition: "width 0.16s cubic-bezier(0.16, 1, 0.3, 1)",
              position: "relative",
              boxShadow: "0 0 10px rgba(255, 92, 53, 0.6)",
            }}
          >
            {/* Glowing Laser Head */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: -2,
                bottom: -2,
                width: 6,
                background: "#ffffff",
                borderRadius: "50%",
                boxShadow: "0 0 8px #ffffff, 0 0 12px #ff5c35",
              }}
            />
          </div>
        </div>

        {/* Live Status Badge */}
        <div
          style={{
            marginTop: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "3px 10px",
            borderRadius: 20,
            background: "rgba(0, 189, 165, 0.08)",
            border: "1px solid rgba(0, 189, 165, 0.2)",
            fontSize: 11,
            fontWeight: 600,
            color: "#007a70",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#00bda5",
              boxShadow: "0 0 6px #00bda5",
            }}
          />
          HubSpot Ingestion SLA &lt;180ms
        </div>
      </motion.div>
    </motion.div>
  );
};
