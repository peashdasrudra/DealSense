import React from "react";
import { DealSenseIcon } from "./DealSenseLogo";
import { useNavigate } from "react-router-dom";

export const HubSpotNativeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f8fa", fontFamily: "Avenir Next, Lexend Deca, Helvetica, Arial, sans-serif", color: "#33475b" }}>
      {/* ── Global Enterprise Navigation Bar ────────────────────────────── */}
      <nav style={{ 
        height: 64, 
        backgroundColor: "#ffffff", 
        borderBottom: "1px solid #dfe3eb", 
        display: "flex", 
        alignItems: "center", 
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 4px rgba(45,62,80,0.05)"
      }}>
        {/* Left: Brand & Portal Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/app/pipeline")}>
            <DealSenseIcon size={30} />
            <span style={{ fontSize: 18, fontWeight: 700, color: "#2d3e50" }}>DealSense Intelligence</span>
          </div>
          
          <div style={{ width: 1, height: 24, backgroundColor: "#dfe3eb", margin: "0 8px" }} />
          
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", backgroundColor: "#f5f8fa", borderRadius: 4, cursor: "pointer", border: "1px solid #dfe3eb" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#33475b" }}>Portal 48920193</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>

        {/* Center: Global Search */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 400 }}>
            <svg style={{ position: "absolute", left: 12, top: 10, color: "#516f90" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search deals, companies, or playbooks..." 
              style={{ width: "100%", padding: "8px 16px 8px 36px", fontSize: 13, borderRadius: 16, border: "1px solid #dfe3eb", backgroundColor: "#f5f8fa", outline: "none" }}
            />
          </div>
        </div>
        
        {/* Right: Utilities & Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#516f90" }}>
            {/* Marketplace Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ cursor: "pointer" }}><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            {/* Settings Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ cursor: "pointer" }}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            {/* Notification Bell */}
            <div style={{ position: "relative", cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, backgroundColor: "#f2545b", borderRadius: "50%" }} />
            </div>
          </div>
          
          <div style={{ width: 1, height: 24, backgroundColor: "#dfe3eb" }} />

          {/* User Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#33475b", lineHeight: 1.2 }}>Sarah Miller</span>
              <span style={{ fontSize: 11, color: "#00bda5", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, backgroundColor: "#00bda5", borderRadius: "50%" }}></span> OAuth Connected
              </span>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#ff7a59", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
              SM
            </div>
          </div>
        </div>
      </nav>

      {/* ── Secondary Navigation (Tabs) ─────────────────────────────────── */}
      <div style={{ backgroundColor: "#ffffff", padding: "0 32px", borderBottom: "1px solid #dfe3eb", display: "flex", gap: 32, alignItems: "center" }}>
        {[
          { label: "Pipeline Risk (Free)", path: "/app/pipeline", isFree: true },
          { label: "Action Queue", path: "/app/action-queue", badge: "3" },
          { label: "RevOps Playbooks", path: "/app/playbooks" },
          { label: "CRM Hygiene 🔒", path: "/app/hygiene" },
        ].map(tab => {
          const isActive = window.location.pathname === tab.path;
          return (
            <div 
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                padding: "16px 0",
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#00a4bd" : "#33475b",
                borderBottom: isActive ? "3px solid #00a4bd" : "3px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              {tab.label}
              {tab.badge && (
                <span style={{ backgroundColor: "#ff7a59", color: "#fff", padding: "2px 6px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                  {tab.badge}
                </span>
              )}
            </div>
          )
        })}

        <div style={{ marginLeft: "auto" }}>
           <button 
            onClick={() => navigate("/agency")} 
            style={{ 
              backgroundColor: "#ff7a59", 
              color: "#ffffff", 
              border: "none", 
              borderRadius: 3, 
              padding: "6px 14px", 
              fontSize: 13, 
              fontWeight: 600, 
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(255,122,89,0.3)"
            }}>
            ⭐ Upgrade to Enterprise Pro
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
};
