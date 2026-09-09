import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { DealSenseIcon } from "../components/DealSenseLogo";
import { DealSenseTelemetryEmblem } from "../components/DealSenseLoader";
import { fetchDeals } from "../api";

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState("");

  // Guard against React 18 StrictMode double-invocations burning single-use codes
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const state = params.get("state");

      if (!code) {
        setStatus("error");
        setErrorMessage("No authorization code received from HubSpot. Please restart the installation.");
        return;
      }

      // Immediately sanitize URL history so refresh does not re-submit burned authorization code
      window.history.replaceState({}, document.title, window.location.pathname);

      try {
        const apiBase = (import.meta as any).env?.VITE_API_URL
          ? `${(import.meta as any).env.VITE_API_URL}/api/v1`
          : "/api/v1";

        // Must match registered URL in HubSpot Developer Portal
        const redirectUri =
          window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
            ? "http://localhost:3000/oauth/callback"
            : "https://dealsense.peash.tech/oauth/callback";

        const response = await fetch(`${apiBase}/oauth/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            state: state || "direct_install", // Graceful fallback for Developer Portal & Directory installs
            redirect_uri: redirectUri,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail || errorData.message || `HubSpot OAuth exchange failed (HTTP ${response.status})`
          );
        }

        const responseData = await response.json();
        const portalId = responseData.hubspot_portal_id || "Live";
        const portalName =
          responseData.portal_name ||
          responseData.hub_domain ||
          `HubSpot Live Portal #${portalId}`;

        const activePortalData = {
          id: portalId,
          name: portalName,
          tier: "Connected App (Live OAuth)",
          deals: 0,
          latency: "0.14s",
        };

        if (responseData.tenant_id) {
          localStorage.setItem("dealsense_tenant_id", responseData.tenant_id);
          sessionStorage.setItem("dealsense_oauth_state", "authenticated");
        }
        if (responseData.session_jwt) {
          localStorage.setItem("dealsense_session_jwt", responseData.session_jwt);
        }
        localStorage.setItem("dealsense_active_portal", JSON.stringify(activePortalData));

        // Update portals list
        const savedList = localStorage.getItem("dealsense_portals_list");
        let portalsList = savedList ? JSON.parse(savedList) : [];
        portalsList = [activePortalData, ...portalsList.filter((p: any) => p.id !== portalId)];
        localStorage.setItem("dealsense_portals_list", JSON.stringify(portalsList));

        // Dispatch events so TopBar, Sidebar, and views update immediately
        window.dispatchEvent(new CustomEvent("dealsense:portal-changed", { detail: activePortalData }));

        // Trigger immediate background deal sync
        try {
          const loadedDeals = await fetchDeals(responseData.tenant_id);
          if (loadedDeals && loadedDeals.length > 0) {
            activePortalData.deals = loadedDeals.length;
            localStorage.setItem("dealsense_active_portal", JSON.stringify(activePortalData));
            window.dispatchEvent(new CustomEvent("dealsense:portal-changed", { detail: activePortalData }));
          }
        } catch (e) {
          console.warn("Initial deal fetch on oauth callback:", e);
        }

        window.dispatchEvent(new CustomEvent("dealsense:deals-updated"));

        setStatus("success");
        setTimeout(() => {
          navigate("/pipeline");
        }, 800);

      } catch (err: any) {
        console.error("[DealSense OAuth] Authentication failed:", err);
        setStatus("error");
        setErrorMessage(err.message || "Failed to establish secure connection with HubSpot.");
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
          {status === "processing" ? (
            <DealSenseTelemetryEmblem size={68} showPulse={true} />
          ) : (
            <DealSenseIcon size={48} />
          )}
        </div>

        {status === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--hs-primary)", marginBottom: 8 }}>
              Connecting to HubSpot...
            </h2>
            <p style={{ fontSize: 14, color: "var(--hs-text-muted)", lineHeight: 1.5, maxWidth: 360, margin: "0 auto" }}>
              Securely exchanging authorization code and calibrating your portal's 7-vector telemetry engine.
            </p>
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
            <p style={{ fontSize: 14, color: "var(--danger)", marginBottom: 24, lineHeight: 1.5, wordBreak: "break-word" }}>{errorMessage}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => navigate("/login")}
                style={{ padding: "12px 24px", background: "var(--hs-primary)", color: "white", border: "none", borderRadius: "var(--radius-md)", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
              >
                Return to Login
              </button>
              <button
                onClick={() => {
                  localStorage.setItem("dealsense_tenant_id", "00000000-0000-0000-0000-000000000001");
                  sessionStorage.setItem("dealsense_oauth_state", "authenticated");
                  navigate("/pipeline");
                }}
                style={{ padding: "10px 24px", background: "var(--hs-surface-hover)", color: "var(--hs-text)", border: "1px solid var(--hs-border-dark)", borderRadius: "var(--radius-md)", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
              >
                Launch Demo Mode
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
