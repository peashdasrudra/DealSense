import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DealSenseIcon } from "../components/DealSenseLogo";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleOAuthLogin = async () => {
    setIsAuthenticating(true);
    try {
      const apiBase = (import.meta as any).env?.VITE_API_URL
        ? `${(import.meta as any).env.VITE_API_URL}/api/v1`
        : "/api/v1";

      // Production redirect_uri — must match the registered URL in HubSpot
      const redirectUri = "https://dealsense.peash.tech/oauth/callback";
      const response = await fetch(
        `${apiBase}/oauth/authorize?redirect_uri=${encodeURIComponent(redirectUri)}`
      );

      if (!response.ok) {
        throw new Error("Failed to generate authorization URL");
      }

      const data = await response.json();
      sessionStorage.setItem("dealsense_oauth_state", data.state);
      window.location.href = data.authorization_url;
    } catch (err) {
      console.warn("Failed to initiate OAuth flow", err);
      setIsAuthenticating(false);
    }
  };

  const handleGuestLogin = () => {
    // Set a mock guest token or flag in local storage
    localStorage.setItem("dealsense_guest_mode", "true");
    navigate("/pipeline");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--hs-background)", fontFamily: "var(--font-sans)", overflow: "hidden" }}>
      
      {/* Decorative Background Glows */}
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(255, 122, 89, 0.08) 0%, rgba(255, 122, 89, 0) 70%)", borderRadius: "50%", filter: "blur(60px)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(0, 164, 189, 0.06) 0%, rgba(0, 164, 189, 0) 70%)", borderRadius: "50%", filter: "blur(80px)", zIndex: 0 }} />

      {/* Simple Header */}
      <div style={{ padding: "24px 48px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--hs-border)", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", zIndex: 10 }}>
        <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }} onClick={() => navigate("/")}>
          <DealSenseIcon size={32} />
          <span style={{ fontSize: 20, fontWeight: 800, color: "var(--hs-primary)", letterSpacing: "-0.02em" }}>DealSense</span>
        </div>
      </div>

      {/* Auth Container */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", zIndex: 10 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: "var(--hs-surface)", padding: "48px 40px", borderRadius: "var(--radius-xl)", border: "1px solid var(--hs-border-dark)", boxShadow: "var(--shadow-xl)", width: "100%", maxWidth: 440, textAlign: "center" }}
        >
          
          <div style={{ background: "var(--hs-accent-subtle)", width: 64, height: 64, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "var(--hs-accent)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--hs-primary)", marginBottom: 12 }}>Sign In</h1>
          <p style={{ fontSize: 15, color: "var(--hs-text-muted)", marginBottom: 32, lineHeight: 1.5 }}>Connect your HubSpot portal to access live revenue intelligence, or explore the interactive demo.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* HubSpot OAuth Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOAuthLogin}
              disabled={isAuthenticating}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                width: "100%",
                padding: "16px",
                background: "var(--hs-accent)", 
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 600,
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: isAuthenticating ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(255, 122, 89, 0.25)"
              }}
            >
              {isAuthenticating ? (
                "Redirecting..."
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#ffffff"/>
                    <path d="M15.4283 14.1543L15.3792 14.1166L15.3403 14.0736C14.7337 13.3855 13.9189 12.8727 12.9863 12.5976C12.0538 12.3225 11.0371 12.2954 10.0468 12.5204L9.9922 12.5332V11.4643L10.0468 11.4772C11.0371 11.7022 12.0538 11.675 12.9863 11.4C13.9189 11.1249 14.7337 10.6121 15.3403 9.92404L15.3792 9.881L15.4283 9.8433C16.1557 9.29419 16.6433 8.48784 16.8208 7.5756C16.9983 6.66336 16.8523 5.7067 16.4042 4.88118C15.9562 4.05566 15.2343 3.41443 14.3644 3.06822C13.4944 2.72201 12.5339 2.69343 11.6506 2.98774L11.5977 3.00551V1.95679H9.41804V3.00551L9.36511 2.98774C8.48186 2.69343 7.52136 2.72201 6.65141 3.06822C5.78147 3.41443 5.05953 4.05566 4.61149 4.88118C4.16345 5.7067 4.01751 6.66336 4.195 7.5756C4.37248 8.48784 4.86008 9.29419 5.58742 9.8433L5.6365 9.881L5.67543 9.92404C6.28205 10.6121 7.09687 11.1249 8.02943 11.4C8.96199 11.675 9.9787 11.7022 10.969 11.4772L11.0236 11.4643V12.5332L10.969 12.5461C9.9787 12.3211 8.96199 12.3483 8.02943 12.6234C7.09687 12.8985 6.28205 13.4113 5.67543 14.0994L5.6365 14.1424L5.58742 14.1801C4.86008 14.7292 4.37248 15.5356 4.195 16.4478C4.01751 17.36 4.16345 18.3167 4.61149 19.1422C5.05953 19.9677 5.78147 20.609 6.65141 20.9552C7.52136 21.3014 8.48186 21.33 9.36511 21.0357L9.41804 21.0179V22.0666H11.5977V21.0179L11.6506 21.0357C12.5339 21.33 13.4944 21.3014 14.3644 20.9552C15.2343 20.609 15.9562 19.9677 16.4042 19.1422C16.8523 18.3167 16.9983 17.36 16.8208 16.4478C16.6433 15.5356 16.1557 14.7292 15.4283 14.1801L15.3792 14.1424L15.4283 14.1543Z" fill="#ff7a59"/>
                  </svg>
                  <span>Connect HubSpot</span>
                </>
              )}
            </motion.button>

            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "8px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--hs-border)" }} />
              <span style={{ fontSize: 12, color: "var(--hs-text-disabled)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "var(--hs-border)" }} />
            </div>

            {/* Guest / Demo Button */}
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "var(--hs-surface-hover)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGuestLogin}
              disabled={isAuthenticating}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                width: "100%",
                padding: "16px",
                background: "var(--hs-surface)",
                color: "var(--hs-text)",
                fontSize: 16,
                fontWeight: 600,
                border: "1px solid var(--hs-border-dark)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>View Interactive Demo</span>
            </motion.button>
          </div>

          <div style={{ marginTop: 32, fontSize: 13, color: "var(--hs-text-muted)" }}>
            By continuing, you agree to DealSense's <span onClick={() => navigate("/terms")} style={{ color: "var(--hs-accent)", cursor: "pointer", fontWeight: 500 }}>Terms of Service</span> and <span onClick={() => navigate("/privacy")} style={{ color: "var(--hs-accent)", cursor: "pointer", fontWeight: 500 }}>Privacy Policy</span>.
          </div>
        </motion.div>
      </div>
    </div>
  );
};
