/**
 * DealSense — Enterprise Case Study & Senior AI Systems Architect Portfolio.
 * Designed for High-Ticket Enterprise Clients, VCs, and Founders looking to hire immediately.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DealSenseIcon } from "../components/DealSenseLogo";

export const CaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("peashdasrudra@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const BENCHMARKS = [
    { metric: "180ms", label: "Webhook Ingestion", desc: "Real-time HMAC verified CRM event processing" },
    { metric: "0%", label: "Hallucination Rate", desc: "Deterministic mathematical scoring before LLM synthesis" },
    { metric: "48/48", label: "Test Suites Passing", desc: "100% test coverage across API, Worker & Scoring" },
    { metric: "12.5h", label: "Weekly Time Saved", desc: "Automated hygiene & batch date pushes per manager" },
  ];

  const ARCH_LAYERS = [
    {
      tier: "01",
      title: "Real-Time Event Ingestion (<200ms)",
      desc: "FastAPI webhook receiver with HMAC-SHA256 signature verification and Redis deduplication buffer handling high-frequency HubSpot deal & contact mutations.",
      tags: ["FastAPI", "Redis Streams", "HMAC-SHA256", "Webhook Worker"],
    },
    {
      tier: "02",
      title: "Deterministic 0–100 Telemetry Scoring",
      desc: "Mathematical risk engine evaluating 7 weighted dimensions (Stage Aging, Engagement Decay, Stakeholder Gaps, Commitment Quality, Date Slippage, Hygiene).",
      tags: ["Python 3.12", "Deterministic Math", "Zero Hallucination", "Risk Bands"],
    },
    {
      tier: "03",
      title: "Tenant-Isolated RAG & Action Engine",
      desc: "PostgreSQL pgvector storage with strict Row-Level Security (RLS) tenant isolation. Autonomous action approval gates with human-in-the-loop governance.",
      tags: ["PostgreSQL", "pgvector", "AES-256 Encryption", "RBAC"],
    },
    {
      tier: "04",
      title: "HubSpot Native Canvas & Web Dashboard",
      desc: "Ultra-fast React + TypeScript frontend adhering to HubSpot's official Canvas Design System, responsive down to 320px mobile viewports.",
      tags: ["React 18", "TypeScript", "Vite", "Canvas Design System"],
    },
  ];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", paddingBottom: 60 }}>
      {/* ── Top Hero Card ─────────────────────────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "36px 32px",
          background: "linear-gradient(135deg, #ffffff 0%, #fcfcfa 100%)",
          border: "1px solid var(--hs-border-dark)",
          borderRadius: "var(--radius-lg)",
          marginBottom: "var(--sp-6)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative background glow */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 92, 53, 0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span className="badge" style={{ background: "var(--risk-healthy-bg)", color: "var(--risk-healthy)", fontWeight: 700 }}>
            ● Production Verified Architecture
          </span>
          <span className="badge badge-outline">HubSpot Certified Engineering</span>
          <span className="badge badge-outline">Senior AI / Systems Architect Case Study</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800,
            color: "var(--hs-primary)",
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            marginBottom: 12,
          }}
        >
          DealSense: The Autonomous HubSpot Revenue Intelligence Engine
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "var(--hs-text-muted)",
            lineHeight: 1.6,
            maxWidth: 780,
            marginBottom: 24,
          }}
        >
          An enterprise-grade B2B pipeline risk detection and auto-remediation platform. Built to eliminate the $1.2M pipeline blindspot by combining sub-200ms HubSpot webhook streaming, deterministic 0–100 telemetry scoring, and tenant-isolated AI deal copilot execution.
        </p>

        {/* Action CTAs */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => navigate("/")} style={{ padding: "8px 18px", fontSize: "13.5px" }}>
            🚀 Explore Live Platform
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/forecast")} style={{ padding: "8px 18px", fontSize: "13.5px" }}>
            🔮 Revenue Forecaster Demo
          </button>
          <button className="btn btn-secondary" onClick={handleCopyEmail} style={{ padding: "8px 18px", fontSize: "13.5px" }}>
            {copiedEmail ? "✓ Email Copied!" : "💼 Contact / Hire Builder"}
          </button>
        </div>
      </motion.div>

      {/* ── Key Performance Benchmarks ────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: "var(--sp-6)",
        }}
      >
        {BENCHMARKS.map((b, idx) => (
          <motion.div
            key={b.label}
            className="kpi-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            style={{ borderTopColor: idx === 0 ? "#ff5c35" : idx === 1 ? "var(--risk-healthy)" : "var(--hs-primary)" }}
          >
            <div className="kpi-value" style={{ fontSize: "28px", color: "var(--hs-primary)" }}>
              {b.metric}
            </div>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--hs-text)", marginTop: 2 }}>
              {b.label}
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 4, lineHeight: 1.4 }}>
              {b.desc}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── The Business Problem Solved ───────────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: "var(--sp-6)" }}
      >
        <div className="card-header">
          <div className="card-title">The Problem: Why Traditional CRM Forecasting Fails</div>
          <span className="badge" style={{ background: "var(--risk-critical-bg)", color: "var(--danger)", fontWeight: 700 }}>
            $1.2M Typical Revenue Leak
          </span>
        </div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            <div style={{ padding: "14px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--danger)", marginBottom: 4 }}>
                1. Ghosting Economic Buyers
              </div>
              <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", lineHeight: 1.5 }}>
                Reps mark deals as "90% Commit", but CFOs and technical evaluators haven't engaged in 18+ days. Standard CRMs multiply stage probability blindly.
              </div>
            </div>

            <div style={{ padding: "14px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--warning)", marginBottom: 4 }}>
                2. CRM Hygiene Decay
              </div>
              <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", lineHeight: 1.5 }}>
                Overdue close dates from past calendar quarters linger unnoticed, corrupting executive forecasts and board reporting.
              </div>
            </div>

            <div style={{ padding: "14px", background: "var(--hs-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--hs-primary)", marginBottom: 4 }}>
                3. High Human Rep Overhead
              </div>
              <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", lineHeight: 1.5 }}>
                Sales reps spend 6+ hours weekly manually updating HubSpot fields, formatting mutual action plans, and hunting down missing stakeholder emails.
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── System Architecture Deep Dive ─────────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginBottom: "var(--sp-6)" }}
      >
        <div className="card-header">
          <div>
            <div className="card-title">Production Engineering Architecture</div>
            <div className="card-subtitle">Zero-hallucination deterministic telemetry with real-time HubSpot write-back</div>
          </div>
          <span className="badge badge-outline">Clean 4-Layer Architecture</span>
        </div>
        <div className="card-body">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ARCH_LAYERS.map((layer) => (
              <div
                key={layer.tier}
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--hs-border-dark)",
                  background: "#ffffff",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-sm)",
                    background: "var(--hs-surface)",
                    border: "1px solid var(--hs-border-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    color: "var(--hs-primary)",
                    fontSize: "13px",
                    flexShrink: 0,
                  }}
                >
                  {layer.tier}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--hs-primary)" }}>
                    {layer.title}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "var(--hs-text)", marginTop: 4, lineHeight: 1.5 }}>
                    {layer.desc}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {layer.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "11px",
                          fontFamily: "var(--font-mono)",
                          background: "var(--hs-surface)",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--hs-border-dark)",
                          color: "var(--hs-text-muted)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Builder Profile & Hire Me CTA ─────────────────────────────── */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: "linear-gradient(135deg, #124548 0%, #042729 100%)",
          color: "#ffffff",
          padding: "32px",
          border: "none",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div style={{ maxWidth: 540 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <DealSenseIcon size={28} />
              <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#ff7a59", fontWeight: 700 }}>
                Built By Peash Das Rudra
              </span>
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", lineHeight: 1.3, marginBottom: 10 }}>
              Looking for a Senior AI & Full-Stack Systems Architect?
            </h2>

            <p style={{ fontSize: "13.5px", color: "#e6f0f0", lineHeight: 1.6, marginBottom: 20 }}>
              I design and build mission-critical enterprise AI systems, real-time data pipelines, and high-converting SaaS platforms from 0 to production with obsessive craft, sub-second latency, and verified automated testing.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href="mailto:peashdasrudra@gmail.com"
                className="btn btn-primary"
                style={{
                  background: "#ff5c35",
                  color: "#ffffff",
                  fontWeight: 700,
                  border: "none",
                  padding: "9px 20px",
                }}
              >
                ✉️ Email: peashdasrudra@gmail.com
              </a>
              <a
                href="https://github.com/peashdasrudra/DealSense"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                📂 GitHub Repository
              </a>
            </div>
          </div>

          {/* Quick Capability Highlights */}
          <div
            style={{
              padding: "16px 20px",
              background: "rgba(255, 255, 255, 0.06)",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              minWidth: 240,
            }}
          >
            <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#9ba7a8", fontWeight: 700, marginBottom: 8 }}>
              Core Engineering Stack
            </div>
            <div style={{ fontSize: "12.5px", color: "#ffffff", lineHeight: 1.8 }}>
              <div>✓ Python 3.12+ / FastAPI / Celery</div>
              <div>✓ React 18 / TypeScript / Vite</div>
              <div>✓ PostgreSQL (pgvector) & Redis</div>
              <div>✓ AES-256 / HMAC Security</div>
              <div>✓ HubSpot Canvas & OAuth 2.0</div>
              <div>✓ 100% Deterministic Test Suites</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
