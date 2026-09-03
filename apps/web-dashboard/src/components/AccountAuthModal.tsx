import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccountAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; email: string; role: string; initials: string };
  onUserSwitch: (user: { name: string; email: string; role: string; initials: string }) => void;
}

export const AccountAuthModal: React.FC<AccountAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserSwitch,
}) => {
  const [activeTab, setActiveTab] = useState<"switch" | "custom">("switch");
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  const PRESET_ACCOUNTS = [
    {
      name: "Peash Das Rudra",
      email: "peashdasrudra@gmail.com",
      role: "Lead RevOps Architect & Creator",
      initials: "PR",
      badge: "HubAiLab Super Admin",
    },
    {
      name: "Tonmoy (CTO) / Evaluator",
      email: "tonmoy@hubxpert.com",
      role: "HubXpert Technical Evaluator",
      initials: "TX",
      badge: "Hiring Evaluation Mode",
    },
    {
      name: "Alex Morgan",
      email: "alex@hubailab.com",
      role: "Agency Fleet Manager",
      initials: "AM",
      badge: "Fleet Partner",
    },
  ];

  const handleSelectAccount = (account: typeof PRESET_ACCOUNTS[0]) => {
    onUserSwitch(account);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail) return;
    const parts = customName.trim().split(" ");
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : customName.slice(0, 2).toUpperCase();
    onUserSwitch({
      name: customName,
      email: customEmail,
      role: "CRM Administrator",
      initials,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(18, 69, 72, 0.65)",
          backdropFilter: "blur(6px)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#ffffff",
            borderRadius: 14,
            width: "100%",
            maxWidth: 500,
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.2)",
            border: "1px solid #cbd6e2",
            overflow: "hidden",
            fontFamily: "var(--font-sans, -apple-system, sans-serif)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 24px",
              background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#2d3e50" }}>
                Account Authentication & Session
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                Switch active operator profile or test hiring evaluation mode
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ background: "transparent", border: "none", fontSize: 18, color: "#64748b", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: 24 }}>
            {/* Active Account Pill */}
            <div style={{ padding: "12px 16px", background: "#f1f5f9", borderRadius: 8, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#ff5c35", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>
                {currentUser.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#ff5c35" }}>Active Session</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#2d3e50" }}>{currentUser.name}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{currentUser.email} • {currentUser.role}</div>
              </div>
            </div>

            {/* Tab switch */}
            <div style={{ display: "flex", gap: 8, borderBottom: "1px solid #e2e8f0", paddingBottom: 12, marginBottom: 16 }}>
              <button
                onClick={() => setActiveTab("switch")}
                style={{
                  background: activeTab === "switch" ? "rgba(255, 92, 53, 0.1)" : "transparent",
                  color: activeTab === "switch" ? "#ff5c35" : "#64748b",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                Preset Profiles
              </button>
              <button
                onClick={() => setActiveTab("custom")}
                style={{
                  background: activeTab === "custom" ? "rgba(255, 92, 53, 0.1)" : "transparent",
                  color: activeTab === "custom" ? "#ff5c35" : "#64748b",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                Sign In With Custom User
              </button>
            </div>

            {activeTab === "switch" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PRESET_ACCOUNTS.map((acc) => (
                  <div
                    key={acc.email}
                    onClick={() => handleSelectAccount(acc)}
                    style={{
                      border: currentUser.email === acc.email ? "2px solid #ff5c35" : "1px solid #cbd6e2",
                      background: currentUser.email === acc.email ? "rgba(255, 92, 53, 0.03)" : "#ffffff",
                      borderRadius: 8,
                      padding: "12px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#00a4bd", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                        {acc.initials}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#2d3e50" }}>{acc.name}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{acc.email} • {acc.role}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#ff5c35", background: "rgba(255, 92, 53, 0.1)", padding: "2px 8px", borderRadius: 10 }}>
                      {acc.badge}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "custom" && (
              <form onSubmit={handleCustomSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#33475b", display: "block", marginBottom: 4 }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd6e2", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#33475b", display: "block", marginBottom: 4 }}>Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@company.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd6e2", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "10px 16px",
                    background: "#00a4bd",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    marginTop: 8,
                  }}
                >
                  Confirm & Sign In
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
