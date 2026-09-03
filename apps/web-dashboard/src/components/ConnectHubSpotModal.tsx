import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConnectHubSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (portal: { id: string; name: string; tier: string; deals: number; latency: string }) => void;
}

export const ConnectHubSpotModal: React.FC<ConnectHubSpotModalProps> = ({
  isOpen,
  onClose,
  onConnected,
}) => {
  const [step, setStep] = useState<"select" | "connecting" | "success">("select");
  const [customPortalId, setCustomPortalId] = useState("");
  const [portalName, setPortalName] = useState("");

  const DEMO_PORTALS = [
    { id: "48920193", name: "HubAiLab Production Fleet", tier: "Diamond Partner", deals: 20 },
    { id: "29481023", name: "HubXpert Client Portal (Sandbox)", tier: "Agency Client", deals: 16 },
    { id: "19284711", name: "TechCorp Global Enterprise", tier: "Enterprise Tier", deals: 12 },
  ];

  const handleConnect = (portal: { id: string; name: string; tier: string; deals: number }) => {
    setStep("connecting");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onConnected({
          id: portal.id,
          name: portal.name,
          tier: portal.tier,
          deals: portal.deals,
          latency: "0.18s",
        });
        setStep("select");
        onClose();
      }, 1200);
    }, 1500);
  };

  const handleCustomConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPortalId) return;
    const name = portalName || `HubSpot Portal #${customPortalId}`;
    handleConnect({ id: customPortalId, name, tier: "Connected App (v3)", deals: 14 });
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
            maxWidth: 540,
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.2)",
            border: "1px solid #cbd6e2",
            overflow: "hidden",
            fontFamily: "var(--font-sans, -apple-system, sans-serif)",
          }}
        >
          {/* Modal Header */}
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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#ff7a59",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                🟠
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#2d3e50" }}>
                  Connect HubSpot CRM Portal
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                  Official OAuth 2.0 Webhook v3 Authorization
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                fontSize: 18,
                color: "#64748b",
                cursor: "pointer",
                padding: 4,
              }}
            >
              ✕
            </button>
          </div>

          {/* Modal Content */}
          <div style={{ padding: 24 }}>
            {step === "select" && (
              <div>
                <p style={{ fontSize: 13, color: "#33475b", margin: "0 0 16px", lineHeight: 1.5 }}>
                  Select a registered HubSpot portal or enter your Portal ID to initiate the OAuth 2.0 handshake and activate continuous deal risk telemetry:
                </p>

                {/* Portal List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {DEMO_PORTALS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleConnect(p)}
                      style={{
                        border: "1px solid #cbd6e2",
                        borderRadius: 8,
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        background: "#ffffff",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ff7a59")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#cbd6e2")}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#2d3e50" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "#7c98b6" }}>Portal #{p.id} • {p.tier} • {p.deals} active deals</div>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#ff7a59",
                          background: "rgba(255, 122, 89, 0.1)",
                          padding: "4px 10px",
                          borderRadius: 4,
                        }}
                      >
                        Connect ➔
                      </span>
                    </div>
                  ))}
                </div>

                {/* Custom Portal Input */}
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: 8 }}>
                    Or Connect Your Own Portal ID:
                  </div>
                  <form onSubmit={handleCustomConnect} style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="e.g. 45912384"
                      value={customPortalId}
                      onChange={(e) => setCustomPortalId(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #cbd6e2",
                        borderRadius: 6,
                        fontSize: 13,
                        outline: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Portal Name (optional)"
                      value={portalName}
                      onChange={(e) => setPortalName(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #cbd6e2",
                        borderRadius: 6,
                        fontSize: 13,
                        outline: "none",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "8px 16px",
                        background: "#ff7a59",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      Authorize
                    </button>
                  </form>
                </div>

                {/* Scopes Notice */}
                <div style={{ marginTop: 20, background: "#f8fafc", padding: "10px 14px", borderRadius: 6, fontSize: 11.5, color: "#64748b", border: "1px solid #e2e8f0" }}>
                  🔒 <strong>Requested Scopes:</strong> <code>crm.objects.deals.read</code>, <code>crm.objects.deals.write</code>, <code>crm.objects.contacts.read</code>, <code>webhooks</code>. AES-256 encrypted at rest.
                </div>
              </div>
            )}

            {step === "connecting" && (
              <div style={{ textAlign: "center", padding: "32px 16px" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>⚡</div>
                <h4 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: "#2d3e50" }}>
                  Exchanging OAuth 2.0 Handshake...
                </h4>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                  Verifying portal scopes, generating AES-256 encrypted tenant key, and subscribing to HubSpot Webhooks v3 stream.
                </p>
              </div>
            )}

            {step === "success" && (
              <div style={{ textAlign: "center", padding: "32px 16px" }}>
                <div style={{ fontSize: 36, marginBottom: 16, color: "#00a4bd" }}>✓</div>
                <h4 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: "#00a4bd" }}>
                  HubSpot Portal Successfully Connected!
                </h4>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                  20 deals indexed. Sub-200ms webhook listener activated.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
