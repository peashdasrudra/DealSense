import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface NativeUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export const NativeUpgradeModal: React.FC<NativeUpgradeModalProps> = ({ isOpen, onClose, featureName }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(45,62,80,0.6)", backdropFilter: "blur(2px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{ 
              position: "relative", 
              backgroundColor: "#ffffff", 
              borderRadius: 8, 
              width: "100%", 
              maxWidth: 480, 
              padding: 32,
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              border: "1px solid #dfe3eb",
              textAlign: "center"
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#ff7a59", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 24px", boxShadow: "0 4px 12px rgba(255,122,89,0.3)" }}>
              🔒
            </div>
            
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#33475b", marginBottom: 12, marginTop: 0 }}>
              Unlock {featureName} Automation
            </h2>
            
            <p style={{ fontSize: 14, color: "#516f90", lineHeight: 1.6, marginBottom: 24 }}>
              You are currently viewing the DealSense Intelligence read-only tier. 
              To execute automated workflows and push remediation actions directly to your HubSpot CRM, upgrade to the Enterprise Pro tier.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button 
                onClick={() => navigate("/agency")}
                style={{ backgroundColor: "#ff7a59", color: "#fff", padding: "12px 24px", borderRadius: 4, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", boxShadow: "0 2px 4px rgba(255,122,89,0.2)" }}
              >
                Upgrade to Enterprise Pro
              </button>
              <button 
                onClick={onClose}
                style={{ backgroundColor: "transparent", color: "#516f90", padding: "12px 24px", borderRadius: 4, fontSize: 14, fontWeight: 600, border: "1px solid #dfe3eb", cursor: "pointer" }}
              >
                Continue Viewing Insights (Free)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
