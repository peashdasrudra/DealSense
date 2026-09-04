import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const [key, setKey] = useState("");
  const { login, isAdmin, logout } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key) {
      login(key);
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
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
          padding: "32px 16px",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            margin: "auto",
            background: "#ffffff",
            borderRadius: 14,
            width: "100%",
            maxWidth: 400,
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.2)",
            border: "1px solid #cbd6e2",
            overflow: "hidden",
            fontFamily: "var(--font-sans, -apple-system, sans-serif)",
          }}
        >
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
                Single Server Admin Login
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                Enter your master API key to exit Demo Mode
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
            {isAdmin ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#33475b", marginBottom: 20 }}>
                  You are currently logged in with an Admin API Key.
                </p>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "10px 16px",
                    background: "#e11d48",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Logout (Return to Demo Mode)
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#33475b", display: "block", marginBottom: 4 }}>
                    Master API Key
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter API Key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #cbd6e2",
                      borderRadius: 6,
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "10px 16px",
                    background: "#ff5c35",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    marginTop: 8,
                  }}
                >
                  Login to Live Server
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
