import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { DealSenseIcon } from "../components/DealSenseLogo";

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const state = params.get("state");

      if (!code || !state) {
        setStatus("error");
        setErrorMessage("Missing authorization code or state from HubSpot.");
        return;
      }

      try {
        const apiBase = (import.meta as any).env?.VITE_API_URL
          ? `${(import.meta as any).env.VITE_API_URL}/api/v1`
          : "/api/v1";

        // Production redirect_uri must exactly match what's registered in HubSpot
        // and what was used in the authorize URL. Never use window.location.origin
        // as it may differ between environments.
        const redirectUri = "https://dealsense.peash.tech/oauth/callback";
        const response = await fetch(`${apiBase}/oauth/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, state, redirect_uri: redirectUri }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || errorData.detail || `OAuth exchange failed (HTTP ${response.status})`
          );
        }
        
        const responseData = await response.json();
        if (responseData.tenant_id) {
          localStorage.setItem("dealsense_tenant_id", responseData.tenant_id);
          sessionStorage.setItem("dealsense_oauth_state", "authenticated"); // simple flag for App.tsx
        }

        setStatus("success");
        setTimeout(() => {
          navigate("/pipeline");
        }, 1500);

      } catch (err: any) {
        console.error("Backend OAuth exchange failed:", err);
        setStatus("error");
        setErrorMessage(err.message || "Failed to connect HubSpot.");
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--hs-background)", fontFamily: "var(--font-sans)", overflow: "hidden" }}>
      
      {/* Decorative Glows */}
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(255, 122, 89, 0.08) 0%, rgba(255, 122, 89, 0) 70%)", borderRadius: "50%", filter: "blur(60px)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(0, 164, 189, 0.06) 0%, rgba(0, 164, 189, 0) 70%)", borderRadius: "50%", filter: "blur(80px)", zIndex: 0 }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ background: "var(--hs-surface)", padding: "48px 40px", borderRadius: "var(--radius-xl)", border: "1px solid var(--hs-border-dark)", boxShadow: "var(--shadow-xl)", width: "100%", maxWidth: 440, textAlign: "center", zIndex: 10 }}
      >
        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <DealSenseIcon size={48} />
        </div>

        {status === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--hs-primary)", marginBottom: 12 }}>Connecting to HubSpot...</h2>
            <p style={{ fontSize: 15, color: "var(--hs-text-muted)" }}>Please wait while we securely exchange your authorization code and provision your tenant.</p>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "linear", repeat: Infinity }}
                style={{ width: 32, height: 32, border: "3px solid var(--hs-accent-subtle)", borderTopColor: "var(--hs-accent)", borderRadius: "50%" }} 
              />
            </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--success)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>✓</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--hs-primary)", marginBottom: 12 }}>Connection Successful!</h2>
            <p style={{ fontSize: 15, color: "var(--hs-text-muted)" }}>Your HubSpot portal is now securely linked. Redirecting to your dashboard...</p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--danger)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>!</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--hs-primary)", marginBottom: 12 }}>Authentication Failed</h2>
            <p style={{ fontSize: 15, color: "var(--danger)", marginBottom: 24 }}>{errorMessage}</p>
            <button
              onClick={() => navigate("/login")}
              style={{ padding: "12px 24px", background: "var(--hs-surface-hover)", color: "var(--hs-text)", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-md)", fontWeight: 700, cursor: "pointer" }}
            >
              Return to Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
