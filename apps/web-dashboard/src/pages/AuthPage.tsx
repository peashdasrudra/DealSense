import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DealSenseIcon } from "../components/DealSenseLogo";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleOAuthLogin = async (_provider: "hubspot" | "google") => {
    if (_provider !== "hubspot") {
      alert("Only HubSpot OAuth is supported in this demo.");
      return;
    }
    
    setIsAuthenticating(true);
    try {
      // @ts-ignore
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const redirectUri = window.location.origin + "/oauth/callback"; 
      const response = await fetch(`${apiUrl}/api/v1/oauth/authorize?redirect_uri=${encodeURIComponent(redirectUri)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch authorization URL");
      }
      const data = await response.json();
      
      // Redirect to HubSpot
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error(err);
      alert("Failed to initiate HubSpot authentication. Check API connection.");
      setIsAuthenticating(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc", fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
      {/* Simple Header */}
      <div style={{ padding: "24px 48px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}>
        <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }} onClick={() => navigate("/")}>
          <DealSenseIcon size={32} />
          <span style={{ fontSize: 20, fontWeight: 900, color: "#092124", letterSpacing: "-0.02em" }}>DealSense</span>
        </div>
      </div>

      {/* Auth Container */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ background: "#ffffff", padding: "48px 40px", borderRadius: 24, border: "1px solid #e2e8f0", boxShadow: "0 20px 40px rgba(0,0,0,0.04)", width: "100%", maxWidth: 440, textAlign: "center" }}>
          
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#092124", marginBottom: 12 }}>Welcome back</h1>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32 }}>Sign in to access your DealSense dashboard and pipeline telemetry.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* HubSpot OAuth Button */}
            <button
              onClick={() => handleOAuthLogin("hubspot")}
              disabled={isAuthenticating}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                width: "100%",
                padding: "14px",
                background: "#ff7a59", // HubSpot Orange
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 700,
                border: "none",
                borderRadius: 12,
                cursor: isAuthenticating ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(255, 122, 89, 0.2)"
              }}
            >
              {isAuthenticating ? (
                "Redirecting to HubSpot..."
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#ff7a59"/>
                    <path d="M15.4283 14.1543L15.3792 14.1166L15.3403 14.0736C14.7337 13.3855 13.9189 12.8727 12.9863 12.5976C12.0538 12.3225 11.0371 12.2954 10.0468 12.5204L9.9922 12.5332V11.4643L10.0468 11.4772C11.0371 11.7022 12.0538 11.675 12.9863 11.4C13.9189 11.1249 14.7337 10.6121 15.3403 9.92404L15.3792 9.881L15.4283 9.8433C16.1557 9.29419 16.6433 8.48784 16.8208 7.5756C16.9983 6.66336 16.8523 5.7067 16.4042 4.88118C15.9562 4.05566 15.2343 3.41443 14.3644 3.06822C13.4944 2.72201 12.5339 2.69343 11.6506 2.98774L11.5977 3.00551V1.95679H9.41804V3.00551L9.36511 2.98774C8.48186 2.69343 7.52136 2.72201 6.65141 3.06822C5.78147 3.41443 5.05953 4.05566 4.61149 4.88118C4.16345 5.7067 4.01751 6.66336 4.195 7.5756C4.37248 8.48784 4.86008 9.29419 5.58742 9.8433L5.6365 9.881L5.67543 9.92404C6.28205 10.6121 7.09687 11.1249 8.02943 11.4C8.96199 11.675 9.9787 11.7022 10.969 11.4772L11.0236 11.4643V12.5332L10.969 12.5461C9.9787 12.3211 8.96199 12.3483 8.02943 12.6234C7.09687 12.8985 6.28205 13.4113 5.67543 14.0994L5.6365 14.1424L5.58742 14.1801C4.86008 14.7292 4.37248 15.5356 4.195 16.4478C4.01751 17.36 4.16345 18.3167 4.61149 19.1422C5.05953 19.9677 5.78147 20.609 6.65141 20.9552C7.52136 21.3014 8.48186 21.33 9.36511 21.0357L9.41804 21.0179V22.0666H11.5977V21.0179L11.6506 21.0357C12.5339 21.33 13.4944 21.3014 14.3644 20.9552C15.2343 20.609 15.9562 19.9677 16.4042 19.1422C16.8523 18.3167 16.9983 17.36 16.8208 16.4478C16.6433 15.5356 16.1557 14.7292 15.4283 14.1801L15.3792 14.1424L15.4283 14.1543Z" fill="white"/>
                  </svg>
                  <span>Continue with HubSpot</span>
                </>
              )}
            </button>

            {/* Google OAuth Button */}
            <button
              onClick={() => handleOAuthLogin("google")}
              disabled={isAuthenticating}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                width: "100%",
                padding: "14px",
                background: "#ffffff",
                color: "#334155",
                fontSize: 15,
                fontWeight: 700,
                border: "1px solid #cbd5e1",
                borderRadius: 12,
                cursor: isAuthenticating ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div style={{ marginTop: 32, fontSize: 13, color: "#94a3b8" }}>
            By continuing, you agree to DealSense's <span onClick={() => navigate("/terms")} style={{ color: "#ff5c35", cursor: "pointer", textDecoration: "underline" }}>Terms of Service</span> and <span onClick={() => navigate("/privacy")} style={{ color: "#ff5c35", cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>
  );
};
