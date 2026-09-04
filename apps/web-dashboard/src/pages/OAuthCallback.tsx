import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
        // @ts-ignore
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/api/v1/oauth/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to complete OAuth exchange");
        }

        setStatus("success");
        // Redirect to native app dashboard after successful connection
        setTimeout(() => {
          navigate("/app/pipeline");
        }, 1500);

      } catch (err: any) {
        console.error("OAuth Exchange Error:", err);
        setStatus("error");
        setErrorMessage(err.message || "An unknown error occurred during authentication.");
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background: "#ffffff", padding: "48px 40px", borderRadius: 24, border: "1px solid #e2e8f0", boxShadow: "0 20px 40px rgba(0,0,0,0.04)", width: "100%", maxWidth: 440, textAlign: "center" }}>
        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <DealSenseIcon size={48} />
        </div>

        {status === "processing" && (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#092124", marginBottom: 12 }}>Connecting to HubSpot...</h2>
            <p style={{ fontSize: 15, color: "#64748b" }}>Please wait while we securely exchange your authorization code and provision your tenant.</p>
            {/* Loading spinner */}
            <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 24, height: 24, border: "3px solid rgba(255, 92, 53, 0.2)", borderTopColor: "#ff5c35", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#10b981", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>✓</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#092124", marginBottom: 12 }}>Connection Successful!</h2>
            <p style={{ fontSize: 15, color: "#64748b" }}>Your HubSpot portal is now securely linked. Redirecting to setup...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#ef4444", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>!</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#092124", marginBottom: 12 }}>Authentication Failed</h2>
            <p style={{ fontSize: 15, color: "#ef4444", marginBottom: 24 }}>{errorMessage}</p>
            <button
              onClick={() => navigate("/login")}
              style={{ padding: "12px 24px", background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};
