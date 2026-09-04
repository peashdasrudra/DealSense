import React from "react";
import { DealSenseIcon } from "./DealSenseLogo";
import { useNavigate } from "react-router-dom";

export const HubSpotNativeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f8fa", fontFamily: "Avenir Next, Lexend Deca, Helvetica, Arial, sans-serif", color: "#33475b" }}>
      {/* Top Navigation Bar mimicking HubSpot Canvas */}
      <nav style={{ 
        height: 60, 
        backgroundColor: "#ffffff", 
        borderBottom: "1px solid #dfe3eb", 
        display: "flex", 
        alignItems: "center", 
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 2px 4px rgba(45,62,80,0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <DealSenseIcon size={28} />
          <span style={{ fontSize: 18, fontWeight: 700, color: "#2d3e50" }}>DealSense Intelligence</span>
        </div>
        
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
          <a href="https://dealsense.peash.tech" target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "#00a4bd", textDecoration: "none", fontWeight: 600 }}>
            Help & Documentation
          </a>
          <button 
            onClick={() => navigate("/agency")} 
            style={{ 
              backgroundColor: "#ff7a59", 
              color: "#ffffff", 
              border: "none", 
              borderRadius: 3, 
              padding: "6px 16px", 
              fontSize: 14, 
              fontWeight: 600, 
              cursor: "pointer" 
            }}>
            Upgrade to Enterprise Pro
          </button>
        </div>
      </nav>

      {/* Sub Navigation (Tabs) */}
      <div style={{ backgroundColor: "#ffffff", padding: "0 24px", borderBottom: "1px solid #dfe3eb", display: "flex", gap: 32 }}>
        {[
          { label: "Pipeline Risk (Free)", path: "/app/pipeline" },
          { label: "Action Queue 🔒", path: "/app/action-queue" },
          { label: "RevOps Playbooks 🔒", path: "/app/playbooks" },
          { label: "CRM Hygiene 🔒", path: "/app/hygiene" },
        ].map(tab => {
          const isActive = window.location.pathname === tab.path;
          return (
            <div 
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                padding: "16px 0",
                fontSize: 15,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#00a4bd" : "#33475b",
                borderBottom: isActive ? "3px solid #00a4bd" : "3px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </div>
          )
        })}
      </div>

      {/* Main Content Area */}
      <main style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
};
