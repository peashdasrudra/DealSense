import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DealSenseIcon } from "../components/DealSenseLogo";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleOAuthLogin = () => {
    setIsAuthenticating(true);

    // Dynamically select redirect_uri matching registered URLs in HubSpot Developer Portal
    const redirectUri =
      window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
        ? "http://localhost:3000/oauth/callback"
        : "https://dealsense.peash.tech/oauth/callback";

    const clientId = "b70e4bd1-26ac-4470-b6e6-c06d8b4c7920";
    const scopes =
      "crm.objects.deals.read crm.objects.deals.write crm.objects.contacts.read crm.objects.companies.read crm.schemas.deals.read crm.objects.notes.read crm.objects.notes.write crm.objects.owners.read timeline";

    const directAuthUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes)}&response_type=code`;

    sessionStorage.setItem("dealsense_oauth_state", "direct_install");
    window.location.href = directAuthUrl;
  };

  const handleGuestLogin = () => {
    // Set mock guest token or flag in local storage
    localStorage.setItem("dealsense_guest_mode", "true");
    navigate("/pipeline");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc",
        fontFamily: "var(--font-sans)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── 1. Sophisticated Ambient Lighting & Micro-Grid ─────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(148, 163, 184, 0.28) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 65% at 50% 45%, black 20%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 65% at 50% 45%, black 20%, transparent 85%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Warm Peach Ambient Radial Glow behind the central card */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          maxWidth: "100vw",
          height: "500px",
          background:
            "radial-gradient(ellipse 65% 55% at 50% 40%, rgba(255, 92, 53, 0.08) 0%, rgba(255, 122, 89, 0.03) 45%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Subtle Teal Accent Glow in corner */}
      <div
        style={{
          position: "absolute",
          bottom: "-5%",
          right: "5%",
          width: "450px",
          height: "450px",
          background:
            "radial-gradient(circle, rgba(0, 189, 165, 0.04) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── 2. Premium Frosted Header ───────────────────────────────────────── */}
      <header
        style={{
          padding: "18px clamp(20px, 5vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          zIndex: 10,
          position: "relative",
        }}
      >
        <div
          style={{
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            userSelect: "none",
          }}
          onClick={() => navigate("/")}
        >
          <DealSenseIcon size={30} />
          <div
            style={{
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#1e293b" }}>Deal</span>
            <span style={{ color: "#ff5c35", fontWeight: 800 }}>Sense</span>
          </div>
        </div>

        {/* Minimalist Header Right Status & Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: "20px",
              background: "rgba(0, 189, 165, 0.08)",
              border: "1px solid rgba(0, 189, 165, 0.25)",
              fontSize: 11.5,
              fontWeight: 600,
              color: "#007a70",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00bda5",
                boxShadow: "0 0 6px rgba(0, 189, 165, 0.8)",
              }}
            />
            Live Ingestion SLA 0.18s
          </div>

          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 10px",
              borderRadius: 8,
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            Overview
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17l9.2-9.2M17 17V7.8H7.8" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── 3. Centered Auth Card Container ──────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 18px",
          zIndex: 10,
          position: "relative",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            padding: "clamp(32px, 5vw, 46px) clamp(24px, 5vw, 40px)",
            borderRadius: 22,
            border: "1px solid rgba(226, 232, 240, 0.9)",
            boxShadow:
              "0 2px 4px rgba(0, 0, 0, 0.02), 0 12px 32px -4px rgba(45, 62, 80, 0.07), 0 24px 64px -12px rgba(45, 62, 80, 0.05), inset 0 1px 0 rgba(255, 255, 255, 1)",
            width: "100%",
            maxWidth: 436,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Top Specular Highlight */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255, 92, 53, 0.45), transparent)",
            }}
          />

          {/* ── A. Jewel-like Lock Icon ───────────────────────────────────── */}
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              margin: "0 auto 20px",
              background:
                "linear-gradient(135deg, rgba(255, 92, 53, 0.12) 0%, rgba(255, 122, 89, 0.04) 100%)",
              border: "1.5px solid rgba(255, 92, 53, 0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ff5c35",
              boxShadow:
                "0 6px 18px -2px rgba(255, 92, 53, 0.14), inset 0 1px 1px rgba(255, 255, 255, 0.8)",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="3"
                ry="3"
                fill="rgba(255, 92, 53, 0.06)"
              />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16.5" r="1.25" fill="#ff5c35" stroke="none" />
            </svg>
          </div>

          {/* ── B. Title & Subtitle ───────────────────────────────────────── */}
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              marginBottom: 8,
              lineHeight: 1.2,
            }}
          >
            Sign In
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "#64748b",
              marginBottom: 28,
              lineHeight: 1.55,
              maxWidth: 340,
              marginInline: "auto",
            }}
          >
            Connect your HubSpot portal to access live revenue intelligence, or explore the interactive demo.
          </p>

          {/* ── C. Action Buttons ─────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* HubSpot Primary Button */}
            <motion.button
              whileHover={{ scale: 1.015, translateY: -1 }}
              whileTap={{ scale: 0.985 }}
              onClick={handleOAuthLogin}
              disabled={isAuthenticating}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 11,
                width: "100%",
                padding: "14px 20px",
                background: "linear-gradient(135deg, #ff5c35 0%, #ff7a59 100%)",
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                border: "1px solid rgba(255, 92, 53, 0.4)",
                borderRadius: 12,
                cursor: isAuthenticating ? "not-allowed" : "pointer",
                boxShadow:
                  "0 4px 16px rgba(255, 92, 53, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
                transition: "all 0.2s ease",
              }}
            >
              {isAuthenticating ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    style={{ animation: "spin 1s linear infinite" }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span>Connecting to HubSpot...</span>
                </div>
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                      fill="#ffffff"
                    />
                    <path
                      d="M15.4283 14.1543L15.3792 14.1166L15.3403 14.0736C14.7337 13.3855 13.9189 12.8727 12.9863 12.5976C12.0538 12.3225 11.0371 12.2954 10.0468 12.5204L9.9922 12.5332V11.4643L10.0468 11.4772C11.0371 11.7022 12.0538 11.675 12.9863 11.4C13.9189 11.1249 14.7337 10.6121 15.3403 9.92404L15.3792 9.881L15.4283 9.8433C16.1557 9.29419 16.6433 8.48784 16.8208 7.5756C16.9983 6.66336 16.8523 5.7067 16.4042 4.88118C15.9562 4.05566 15.2343 3.41443 14.3644 3.06822C13.4944 2.72201 12.5339 2.69343 11.6506 2.98774L11.5977 3.00551V1.95679H9.41804V3.00551L9.36511 2.98774C8.48186 2.69343 7.52136 2.72201 6.65141 3.06822C5.78147 3.41443 5.05953 4.05566 4.61149 4.88118C4.16345 5.7067 4.01751 6.66336 4.195 7.5756C4.37248 8.48784 4.86008 9.29419 5.58742 9.8433L5.6365 9.881L5.67543 9.92404C6.28205 10.6121 7.09687 11.1249 8.02943 11.4C8.96199 11.675 9.9787 11.7022 10.969 11.4772L11.0236 11.4643V12.5332L10.969 12.5461C9.9787 12.3211 8.96199 12.3483 8.02943 12.6234C7.09687 12.8985 6.28205 13.4113 5.67543 14.0994L5.6365 14.1424L5.58742 14.1801C4.86008 14.7292 4.37248 15.5356 4.195 16.4478C4.01751 17.36 4.16345 18.3167 4.61149 19.1422C5.05953 19.9677 5.78147 20.609 6.65141 20.9552C7.52136 21.3014 8.48186 21.33 9.36511 21.0357L9.41804 21.0179V22.0666H11.5977V21.0179L11.6506 21.0357C12.5339 21.33 13.4944 21.3014 14.3644 20.9552C15.2343 20.609 15.9562 19.9677 16.4042 19.1422C16.8523 18.3167 16.9983 17.36 16.8208 16.4478C16.6433 15.5356 16.1557 14.7292 15.4283 14.1801L15.3792 14.1424L15.4283 14.1543Z"
                      fill="#ff5c35"
                    />
                  </svg>
                  <span>Connect HubSpot</span>
                </>
              )}
            </motion.button>

            {/* Gradient Minimalist Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                margin: "4px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "linear-gradient(to right, transparent, rgba(226, 232, 240, 0.9))",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                OR
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "linear-gradient(to left, transparent, rgba(226, 232, 240, 0.9))",
                }}
              />
            </div>

            {/* Guest / Demo Button */}
            <motion.button
              whileHover={{ scale: 1.015, translateY: -1 }}
              whileTap={{ scale: 0.985 }}
              onClick={handleGuestLogin}
              disabled={isAuthenticating}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                padding: "14px 20px",
                background: "#ffffff",
                color: "#1e293b",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                border: "1.5px solid #e2e8f0",
                borderRadius: 12,
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(15, 23, 42, 0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(15, 23, 42, 0.04)";
              }}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>View Interactive Demo</span>
            </motion.button>
          </div>

          {/* ── D. Terms & Privacy Notice ─────────────────────────────────── */}
          <div
            style={{
              marginTop: 26,
              fontSize: 12.5,
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            By continuing, you agree to DealSense's{" "}
            <span
              onClick={() => navigate("/terms")}
              style={{
                color: "#ff5c35",
                cursor: "pointer",
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Terms of Service
            </span>{" "}
            and{" "}
            <span
              onClick={() => navigate("/privacy")}
              style={{
                color: "#ff5c35",
                cursor: "pointer",
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Privacy Policy
            </span>
            .
          </div>

          {/* ── E. Minimalist Enterprise Trust Indicators ──────────────────── */}
          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: "1px solid rgba(226, 232, 240, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              fontSize: 11.5,
              color: "#94a3b8",
              fontWeight: 500,
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              256-Bit TLS
            </span>
            <span>·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              SOC2 Ready
            </span>
            <span>·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff5c35"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              HubSpot App Partner
            </span>
          </div>
        </motion.div>

        {/* ── 4. Subtle Minimalist Bottom Fleet Link ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{
            marginTop: 20,
            fontSize: 12.5,
            color: "#64748b",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>Managing multiple client portals?</span>
          <span
            onClick={() => navigate("/agency")}
            style={{
              color: "#007a70",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            Claim Agency Discount →
          </span>
        </motion.div>
      </main>
    </div>
  );
};

