import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ProGateProps {
  children: React.ReactNode;
  featureName: string;
  description: string;
}

export const ProGate: React.FC<ProGateProps> = ({ children, featureName, description }) => {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "80vh", overflow: "hidden" }}>
      <div 
        style={{ 
          filter: "blur(7px) grayscale(30%)", 
          opacity: 0.6, 
          pointerEvents: "none", 
          userSelect: "none",
          height: "100%",
          overflow: "hidden"
        }}
      >
        {children}
      </div>

      <div style={{ 
        position: "absolute", 
        inset: 0, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "rgba(255, 255, 255, 0.3)", 
        backdropFilter: "blur(2px)",
        zIndex: 100 
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{ 
            background: "#ffffff", 
            padding: "40px 48px", 
            borderRadius: 16, 
            boxShadow: "0 20px 40px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.05)", 
            maxWidth: 480, 
            textAlign: "center",
            border: "1px solid rgba(0,0,0,0.08)"
          }}
        >
          <div style={{ 
            width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #ff7a59 0%, #ff5c35 100%)", 
            color: "white", display: "flex", alignItems: "center", justifyContent: "center", 
            fontSize: 28, margin: "0 auto 24px", boxShadow: "0 8px 16px rgba(255, 122, 89, 0.3)"
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 style={{ margin: "0 0 12px", fontSize: 24, fontWeight: 800, color: "#2d3e50" }}>{featureName}</h2>
          <p style={{ margin: "0 0 32px", fontSize: 15, color: "#64748b", lineHeight: 1.5 }}>
            {description}
          </p>
          <button 
            onClick={() => navigate("/agency")}
            style={{ 
              background: "#ff7a59", color: "#fff", border: "none", padding: "14px 28px", 
              borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer",
              width: "100%", transition: "all 0.2s ease-in-out", boxShadow: "0 4px 6px rgba(255, 122, 89, 0.2)"
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 12px rgba(255, 122, 89, 0.3)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px rgba(255, 122, 89, 0.2)"; }}
          >
            Upgrade to Enterprise Pro
          </button>
        </motion.div>
      </div>
    </div>
  );
};
