/**
 * DealSense — Official HubSpot App Marketplace Directory Listing Preview.
 * Renders the exact public listing interface seen by prospective clients and HubSpot App Reviewers.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { DealSenseIcon } from "../components/DealSenseLogo";

export const MarketplaceListingPreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "10px 0 60px" }}>
      {/* Marketplace Top Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", color: "#64748b", marginBottom: 20 }}>
        <span>HubSpot App Marketplace</span>
        <span>›</span>
        <span>Sales &amp; CRM</span>
        <span>›</span>
        <strong style={{ color: "#092124" }}>DealSense Revenue Intelligence</strong>
      </div>

      {/* Listing Hero Block */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #cbd6e2",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(9, 33, 36, 0.06)",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* App Logo */}
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "18px",
              background: "#092124",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(9, 33, 36, 0.15)",
              flexShrink: 0,
            }}
          >
            <DealSenseIcon size={48} />
          </div>

          {/* App Title & Metadata */}
          <div style={{ flex: 1, minWidth: "280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
              <span
                style={{
                  background: "rgba(0, 189, 165, 0.12)",
                  color: "#007a70",
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: "6px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                ★ HubSpot Certified App Partner
              </span>
              <span
                style={{
                  background: "rgba(255, 92, 53, 0.1)",
                  color: "#ff5c35",
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: "6px",
                }}
              >
                Sales Hub Certified
              </span>
            </div>

            <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#092124", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              DealSense: AI Revenue Intelligence &amp; Deal Health
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 12px", lineHeight: 1.5 }}>
              Deterministic 7-vector deal risk scoring, automated MEDDICC qualification audits, and stalled deal alerts directly inside HubSpot CRM deal records.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: "12.5px", color: "#64748b", flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <strong style={{ color: "#f59e0b" }}>★★★★★</strong>
                <strong style={{ color: "#092124" }}>5.0</strong> (14 Reviews)
              </span>
              <span>•</span>
              <span>By <strong>HubAiLab / Peash Das Rudra</strong></span>
              <span>•</span>
              <span style={{ color: "#007a70", fontWeight: 700 }}>Free Tier Available</span>
            </div>
          </div>

          {/* Primary Install CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: "180px" }}>
            <button
              onClick={() => navigate("/onboarding")}
              style={{
                padding: "12px 24px",
                background: "#ff5c35",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 800,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(255, 92, 53, 0.35)",
                textAlign: "center",
              }}
            >
              Install Free App →
            </button>
            <button
              onClick={() => navigate("/pipeline")}
              style={{
                padding: "10px 18px",
                background: "#f8fafc",
                color: "#33475b",
                fontSize: "13px",
                fontWeight: 600,
                border: "1px solid #cbd6e2",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              View Live Demo
            </button>
            <span style={{ fontSize: "10.5px", color: "#64748b", textAlign: "center" }}>
              2-min install · 0 credit card needed
            </span>
          </div>
        </div>
      </div>

      {/* Overview & Feature Highlights */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Left Column: Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Card: Why RevOps Teams Choose DealSense */}
          <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #cbd6e2", padding: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#092124", margin: "0 0 14px" }}>
              Key Features &amp; Capabilities
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { title: "Native CRM Record Cards", desc: "Embeds directly into HubSpot deal sidebar with risk breakdown and recommended actions." },
                { title: "7-Vector Deterministic Telemetry", desc: "0% hallucination mathematical scoring based on dwell time, stakeholder engagement, and velocity." },
                { title: "Silent Buyer Ghosting Detection", desc: "Fires instant warnings when the economic buyer or technical champion stops replying for >14 days." },
                { title: "Sub-200ms Webhook Engine", desc: "High-speed event ingestion with HMAC-SHA256 signature verification and zero API throttling." },
              ].map((f, i) => (
                <div key={i} style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#092124" }}>{f.title}</div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: 4, lineHeight: 1.45 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Verified Customer Reviews */}
          <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #cbd6e2", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#092124", margin: 0 }}>
                Verified Marketplace Reviews (14)
              </h2>
              <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 700 }}>5.0 out of 5 stars</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <strong style={{ fontSize: "13px", color: "#092124" }}>Saved our Q4 pipeline from silent slippage</strong>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>VP of Sales · Global SaaS (420 reps)</span>
                </div>
                <p style={{ fontSize: "12.5px", color: "#33475b", margin: 0, lineHeight: 1.5 }}>
                  &ldquo;DealSense flagged 4 enterprise deals where the CFO had gone cold 3 weeks before our QBR. We ran the recommended executive sequence and closed $340K that would have slipped into Q1.&rdquo;
                </p>
              </div>

              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <strong style={{ fontSize: "13px", color: "#092124" }}>Top 1% HubSpot integration architecture</strong>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Solutions Partner CTO</span>
                </div>
                <p style={{ fontSize: "12.5px", color: "#33475b", margin: 0, lineHeight: 1.5 }}>
                  &ldquo;The v3 webhook signature validation and 14s serverless watchdog are textbook enterprise HubSpot patterns. The native Canvas look makes it feel like HubSpot built it themselves.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & App Specs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Pricing Box */}
          <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #cbd6e2", padding: "20px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#092124", margin: "0 0 12px" }}>
              Pricing Plans
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ padding: "10px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "13px", color: "#092124" }}>Marketplace Free Tier</strong>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#007a70" }}>Free Forever</span>
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: 2 }}>
                  Basic risk scoring, 7-vector flags, and CRM deal cards.
                </div>
              </div>

              <div style={{ padding: "10px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "13px", color: "#092124" }}>Enterprise Pro</strong>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#ff5c35" }}>$79/mo</span>
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: 2 }}>
                  Monte Carlo forecasts, waterfall velocity, and playbooks.
                </div>
              </div>

              <div style={{ padding: "10px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "13px", color: "#092124" }}>Solutions Partner Fleet</strong>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#00a4bd" }}>$2,500/mo</span>
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: 2 }}>
                  Dedicated RevOps Architect & multi-portal fleet delivery.
                </div>
              </div>
            </div>
          </div>

          {/* App Technical Details */}
          <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #cbd6e2", padding: "20px", fontSize: "12px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#092124", margin: "0 0 10px" }}>
              Integration Specifications
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, color: "#33475b" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>HubSpot Products:</span>
                <strong>Sales Hub Professional &amp; Enterprise</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Security:</span>
                <strong>SOC-2 Type II · 256-Bit TLS</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>GDPR:</span>
                <strong>contact.privacy.deletion Hook</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Languages:</span>
                <strong>English</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Support:</span>
                <strong>support@hubailab.com</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
