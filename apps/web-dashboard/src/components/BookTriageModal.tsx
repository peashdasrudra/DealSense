/**
 * DealSense — Executive Pipeline Triage & Retainer Consultation Booking Modal.
 * High-converting lead magnet interface for $99 Pilot Triage & $2,500/mo RevOps Retainers.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

interface BookTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: "pilot-99" | "retainer-2500";
  dealCount?: number;
  atRiskCapital?: string;
}

export const BookTriageModal: React.FC<BookTriageModalProps> = ({
  isOpen,
  onClose,
  initialTier = "pilot-99",
  dealCount = 9,
  atRiskCapital = "$1.61M",
}) => {
  const [selectedTier, setSelectedTier] = useState<"pilot-99" | "retainer-2500">(initialTier);
  const [fullName, setFullName] = useState("Alex Rivera");
  const [workEmail, setWorkEmail] = useState("alex.rivera@enterprise.com");
  const [companyName, setCompanyName] = useState("Enterprise TechCorp");
  const [portalId] = useState("48920193");
  const [selectedDate, setSelectedDate] = useState("Tomorrow · 2:00 PM EST");
  const [notes, setNotes] = useState("Need immediate triage for 3 stalled enterprise deals in Proposal stage.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(18, 69, 72, 0.6)",
        backdropFilter: "blur(6px)",
        padding: "16px",
      }}
      onClick={handleResetAndClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        style={{
          width: "100%",
          maxWidth: "580px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "14px",
          boxShadow: "0 24px 64px -12px rgba(9, 33, 36, 0.35)",
          border: "1px solid #cbd6e2",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
            borderTopLeftRadius: "14px",
            borderTopRightRadius: "14px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  background: "rgba(255, 92, 53, 0.12)",
                  color: "#ff5c35",
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Lead RevOps Architect Session
              </span>
              <span style={{ fontSize: "12px", color: "#64748b" }}>With Peash Das Rudra</span>
            </div>
            <h2 style={{ fontSize: "19px", fontWeight: 800, color: "#092124", margin: 0 }}>
              Schedule High-Ticket Pipeline Risk Triage
            </h2>
          </div>
          <button
            onClick={handleResetAndClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "15px",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px" }}>
          {isSuccess ? (
            <div style={{ textAlign: "center", padding: "24px 12px" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "rgba(0, 189, 165, 0.15)",
                  color: "#007a70",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  margin: "0 auto 16px",
                  border: "2px solid #00bda5",
                }}
              >
                ✓
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#092124", marginBottom: 8 }}>
                Triage Session Confirmed!
              </h3>
              <p style={{ fontSize: "13.5px", color: "#64748b", maxWidth: 440, margin: "0 auto 20px", lineHeight: 1.55 }}>
                Lead RevOps Architect <strong>Peash Das Rudra</strong> has received your dossier for <strong>Portal #{portalId}</strong>. A calendar invite and prep briefing have been dispatched to <strong>{workEmail}</strong>.
              </p>
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "16px",
                  maxWidth: 420,
                  margin: "0 auto 24px",
                  textAlign: "left",
                  fontSize: "12.5px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#64748b" }}>Reserved Slot:</span>
                  <strong style={{ color: "#092124" }}>{selectedDate}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#64748b" }}>Target Pipeline:</span>
                  <strong style={{ color: "#ff5c35" }}>{atRiskCapital} across {dealCount} deals</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Selected Service:</span>
                  <strong style={{ color: "#007a70" }}>{selectedTier === "pilot-99" ? "$99 Emergency Triage Pilot" : "$2,500/mo RevOps Retainer"}</strong>
                </div>
              </div>
              <button
                onClick={handleResetAndClose}
                style={{
                  padding: "10px 24px",
                  background: "#ff5c35",
                  color: "#ffffff",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Return to Command Center
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Target Pipeline Callout */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(255, 92, 53, 0.08) 0%, rgba(0, 164, 189, 0.08) 100%)",
                  border: "1px solid rgba(255, 92, 53, 0.25)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#ff5c35", textTransform: "uppercase" }}>
                    Detected Pipeline Slippage Risk
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#092124" }}>
                    {atRiskCapital} At Risk · {dealCount} Stalled Deals
                  </div>
                </div>
                <span
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd6e2",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#33475b",
                  }}
                >
                  Portal #{portalId}
                </span>
              </div>

              {/* Service Selection Tabs */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#33475b", display: "block", marginBottom: 6 }}>
                  Select Engagement Model:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div
                    onClick={() => setSelectedTier("pilot-99")}
                    style={{
                      border: selectedTier === "pilot-99" ? "2px solid #ff5c35" : "1px solid #cbd6e2",
                      background: selectedTier === "pilot-99" ? "rgba(255, 92, 53, 0.04)" : "#ffffff",
                      borderRadius: "8px",
                      padding: "12px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "13px", color: "#092124" }}>$99 Pilot Triage</strong>
                      <span style={{ fontSize: "10px", background: "#ff5c35", color: "#ffffff", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>WEDGE</span>
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: 4 }}>
                      48-hr deep dive. Unstick 1 deal or 100% refund.
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedTier("retainer-2500")}
                    style={{
                      border: selectedTier === "retainer-2500" ? "2px solid #00a4bd" : "1px solid #cbd6e2",
                      background: selectedTier === "retainer-2500" ? "rgba(0, 164, 189, 0.04)" : "#ffffff",
                      borderRadius: "8px",
                      padding: "12px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "13px", color: "#092124" }}>$2,500/mo Retainer</strong>
                      <span style={{ fontSize: "10px", background: "#00a4bd", color: "#ffffff", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>PARTNER</span>
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: 4 }}>
                      Dedicated RevOps Architect & fleet telemetry.
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#33475b", display: "block", marginBottom: 4 }}>
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd6e2",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#33475b", display: "block", marginBottom: 4 }}>
                    Work Email (HubSpot Admin)
                  </label>
                  <input
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd6e2",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#33475b", display: "block", marginBottom: 4 }}>
                    Company / Agency Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd6e2",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#33475b", display: "block", marginBottom: 4 }}>
                    Target Triage Time
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd6e2",
                      fontSize: "13px",
                      background: "#ffffff",
                      boxSizing: "border-box",
                    }}
                  >
                    <option>Tomorrow · 11:00 AM EST</option>
                    <option>Tomorrow · 2:00 PM EST</option>
                    <option>Day After Tomorrow · 10:00 AM EST</option>
                    <option>Day After Tomorrow · 3:30 PM EST</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#33475b", display: "block", marginBottom: 4 }}>
                  Current Bottlenecks & Specific Deals to Triage
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: "1px solid #cbd6e2",
                    fontSize: "12.5px",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: "12px",
                  background: selectedTier === "pilot-99" ? "#ff5c35" : "#00a4bd",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "8px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(255, 92, 53, 0.25)",
                  transition: "all 0.15s ease",
                  marginTop: "4px",
                }}
              >
                {isSubmitting
                  ? "Reserving Session with Peash..."
                  : selectedTier === "pilot-99"
                  ? "Book $99 Triage Session (Find $25K Or It's Free)"
                  : "Apply for Premier $2,500/mo RevOps Fleet Retainer"}
              </button>

              <div style={{ textAlign: "center", fontSize: "11px", color: "#64748b" }}>
                🔒 100% Confidential · Covered under Mutual NDA · Direct with Peash Das Rudra
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
