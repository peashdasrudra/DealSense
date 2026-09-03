/**
 * DealSense — Elite Agency Case Study & Instant Deployment Page.
 * Designed to make HubSpot Agency Owners immediately feel: "Not deploying this is leaving money on the table."
 * 
 * Structure:
 * 1. Hero — Quantified problem statement + immediate CTA
 * 2. The Problem Agency Owners Face (empathy)
 * 3. What DealSense Solves (before/after transformation)
 * 4. 15-Module Live Platform Overview (proof of depth)
 * 5. Technical Architecture (credibility)
 * 6. Agency Revenue Calculator (greed trigger)
 * 7. Pricing with extreme value delta
 * 8. FAQ + Final CTA
 * 9. Order Modal
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DealSenseIcon } from "../components/DealSenseLogo";
import { Footer } from "../components/Footer";

/* ────────────────────── DATA ────────────────────── */

const PROBLEMS = [
  { before: "Reps manually update HubSpot deal stages 2–3 weeks late", after: "Real-time webhook ingestion scores every deal within 180ms" },
  { before: "$1.2M+ pipeline slips discovered during QBR — after the quarter closes", after: "Autonomous alerts fire the moment a deal stalls or a CFO goes silent" },
  { before: "Forecasting is a spreadsheet guess — managers pad 30% because they don't trust CRM data", after: "Monte Carlo simulation gives Commit, Manager, and AI Reality scenarios" },
  { before: "Single-threaded deals collapse when one champion leaves", after: "Stakeholder Power Matrix detects single-threading and triggers executive outreach" },
  { before: "Agency RevOps consultants charge $5K/month for manual pipeline reviews", after: "Deploy a white-label AI engine under your brand, charge $2.5K/mo retainer, keep 100% margin" },
];

const MODULES = [
  { icon: "📊", name: "Pipeline Overview", desc: "Macro portfolio health with 0–100 deterministic risk scoring" },
  { icon: "🔮", name: "Revenue Forecast", desc: "Monte Carlo simulation — Commit vs Best Case vs AI Reality" },
  { icon: "🌊", name: "Pipeline Waterfall", desc: "Monthly inflow/outflow tracking and stage duration decay analysis" },
  { icon: "🎯", name: "Deal Inspector", desc: "Filterable deal dossier table with CSV export and drawer drill-down" },
  { icon: "🛡️", name: "Deal War Room", desc: "Friday QBR-grade pipeline review with 1-click executive interventions" },
  { icon: "👥", name: "Stakeholder Matrix", desc: "Buying committee org chart — detect single-threaded fragility" },
  { icon: "🔥", name: "Risk Heatmap", desc: "Stage × severity matrix visualizing where pipeline is rotting" },
  { icon: "⚡", name: "Action Queue", desc: "1-click batch deal rescue approvals with Slack/Teams preview" },
  { icon: "🗺️", name: "Mutual Action Plans", desc: "Buyer-seller shared milestone tracker with public buyer links" },
  { icon: "⚔️", name: "Competitive Battlecards", desc: "Talk tracks and objection scripts vs Gong, Clari, Native HubSpot" },
  { icon: "🤖", name: "RevOps Playbooks", desc: "Conditional trigger automations — CFO silence, date slip, champion exit" },
  { icon: "🧹", name: "CRM Hygiene Engine", desc: "Automated missing buyer detection and stale date auto-remediation" },
  { icon: "👥", name: "Rep Coaching", desc: "Rep risk index and stage velocity bottleneck identification" },
  { icon: "🏢", name: "Client Health", desc: "Account churn risk scoring and expansion pipeline tracker" },
  { icon: "📋", name: "Audit & Compliance", desc: "Full action audit trail for governance and SOC2 readiness" },
];

const ARCH_LAYERS = [
  { label: "Webhooks", tech: "FastAPI · Redis Streams · HMAC-SHA256", detail: "Sub-200ms cryptographically verified real-time event ingestion from HubSpot CRM" },
  { label: "Scoring", tech: "Python 3.14 · NumPy · 7 Vectors", detail: "0% hallucination deterministic math — stage velocity, engagement decay, MEDDICC, multi-threading" },
  { label: "Canvas UI", tech: "React 18 · TypeScript · Framer Motion", detail: "Native HubSpot CRM sidebar card + standalone web dashboard with mobile-first responsive design" },
  { label: "Multi-Tenant", tech: "PostgreSQL · RLS · pgvector · AES-256", detail: "Row-level security isolation per portal, encrypted OAuth tokens, tenant-scoped vector retrieval" },
];

const PACKAGES = [
  {
    id: "micro_audit",
    name: "Pilot Deal Risk Audit Dossier",
    price: "$99",
    crossed: "$5,000",
    timeline: "24–48h",
    tagline: "What enterprise consultancies charge $5,000 for",
    guarantee: "If we don't find $25K+ in at-risk pipeline → instant 100% refund",
    features: [
      "50 Active Deals Scored (full 7-vector deterministic breakdown)",
      "CFO Ghosting Detection (identifies unengaged economic buyers)",
      "Executive PDF Dossier (board-ready deal triage briefing)",
      "10-Min Loom Walkthrough (senior architect strategic review)",
      "48-Hour SLA Turnaround (guaranteed fast audit delivery)",
      "Find $25K Or It's Free (100% no-risk money-back guarantee)",
    ],
    cta: "Start $99 Risk Audit",
    highlight: false,
  },
  {
    id: "agency_single",
    name: "HubSpot Agency Fleet",
    price: "$1,500",
    crossed: "$8,500",
    timeline: "24h SLA",
    tagline: "Bill 10 clients $2,500/mo = $300,000/yr ARR (200x ROI)",
    guarantee: "100% White-Label · 0 Monthly Platform Tax Forever",
    features: [
      "Manage up to 15 Client Portals (master switcher cockpit)",
      "100% Agency White-Label (revops.youragency.com + custom logo)",
      "Embedded HubSpot Canvas Card (lives native inside client CRM)",
      "Sub-200ms Webhook Stream (Redis Streams real-time event engine)",
      "1-Click Executive QBR Dossier (automated board-ready PDF briefing)",
      "1-Click Batch CRM Hygiene (auto-remediation writebacks to HubSpot)",
    ],
    cta: "Deploy Partner Fleet ($1,500)",
    highlight: false,
  },
  {
    id: "agency_fleet",
    name: "Elite Master Fleet & Monorepo",
    price: "$3,500",
    crossed: "$24,000",
    timeline: "Instant Handover",
    tagline: "Build a $500K+ ARR RevOps Practice on 95% Margin",
    guarantee: "100% Full Monorepo Source Ownership + 1-Hr Architect SLA",
    features: [
      "UNLIMITED Multi-Tenant Portals (zero client or volume caps)",
      "100% Monorepo Source Code (FastAPI, React 18, Postgres 16, Redis)",
      "Private Cloud VPC Deployment (AWS, GCP, DigitalOcean, or On-Prem)",
      "Row-Level Security (RLS) partition engine (GDPR & UK DPA compliant)",
      "Custom Canvas Extension SDK (build bespoke HubSpot CRM widgets)",
      "1-on-1 Architect Slack SLA (direct 1-hour senior lead response)",
    ],
    cta: "Claim Elite Master Fleet ($3,500)",
    highlight: true,
  },
];

const FAQS = [
  { q: "How long does deployment take?", a: "The $99 audit takes under 48 hours. Full portal deployments take 5 business days, and Agency Fleet is delivered in 10 business days." },
  { q: "Do my clients need to install anything?", a: "No. 1-click official HubSpot read-only OAuth. Zero code changes or client IT tickets required." },
  { q: "Can I white-label this under my agency brand?", a: "Yes. 100% white-labeled on your domain (e.g. revops.youragency.com) with your logo, colors, and embedded CRM card." },
  { q: "What if it doesn't find enough at-risk pipeline?", a: "100% money-back guarantee. If our audit doesn't surface at least $25,000 in pipeline risk, receive an immediate full refund." },
  { q: "How is the risk score calculated?", a: "7 deterministic mathematical vectors (velocity decay, buyer ghosting, slip frequency, MEDDICC completeness). Zero LLM hallucinations." },
  { q: "Do I get the source code?", a: "Yes. Complete FastAPI, React 18, PostgreSQL 16, and Redis monorepo handover with lifetime commercial ownership." },
];

/* ────────────────────── COMPONENT ────────────────────── */

export const CaseStudy: React.FC = () => {
  const navigate = useNavigate();
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("micro_audit");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [clientCount, setClientCount] = useState(5);
  const [retainerFee, setRetainerFee] = useState(2500);
  const [orderForm, setOrderForm] = useState({ name: "", email: "", company: "", portalId: "", tier: "micro_audit" });
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const activePackage = PACKAGES.find((p) => p.id === selectedPkg) || PACKAGES[0];
  const annualRevenue = clientCount * retainerFee * 12;
  const deploymentCost = selectedPkg === "agency_fleet" ? 1490 : selectedPkg === "agency_single" ? 490 : 99;
  const roi = Math.round(annualRevenue / deploymentCost);

  const handleOpenOrder = (pkgId: string) => {
    const tierMap: Record<string, string> = {
      micro_audit: "audit-99",
      agency_single: "deploy-1500",
      agency_fleet: "agency-3500",
    };
    navigate(`/checkout?tier=${tierMap[pkgId] || "audit-99"}`);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSubmitted(true);
    setTimeout(() => { setOrderSubmitted(false); setOrderModalOpen(false); }, 3200);
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  /* Shared section heading style */
  const sectionTitle = (text: string, sub: string) => (
    <div style={{ textAlign: "center", marginBottom: 36 }}>
      <h2 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, color: "var(--hs-primary)", letterSpacing: "-0.03em", marginBottom: 8 }}>{text}</h2>
      <p style={{ fontSize: "14px", color: "var(--hs-text-muted)", maxWidth: 620, margin: "0 auto", lineHeight: 1.6 }}>{sub}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: 100 }}>

      {/* ═══════════════════ SECTION 1: HERO ═══════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "clamp(28px, 5vw, 52px) clamp(20px, 4vw, 44px)",
          background: "linear-gradient(135deg, #124548 0%, #062b2e 100%)",
          borderRadius: "var(--radius-lg)",
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
          color: "#ffffff",
        }}
      >
        {/* Decorative gradient orb */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,92,53,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", padding: "4px 12px 4px 8px", borderRadius: "var(--radius-pill)" }}>
            <DealSenseIcon size={18} />
            <span style={{ fontSize: "11.5px", fontWeight: 800, letterSpacing: "-0.01em" }}>
              Deal<span style={{ color: "#ff5c35" }}>Sense</span> <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500, marginLeft: 4 }}>Enterprise Platform</span>
            </span>
          </div>
          <span style={{ background: "rgba(5,150,105,0.25)", color: "#6ee7b7", border: "1px solid rgba(5,150,105,0.4)", padding: "4px 12px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 700 }}>● 48/48 Tests Passing · Production Ready</span>
          <span style={{ background: "rgba(255,92,53,0.2)", color: "#fbbf24", border: "1px solid rgba(255,92,53,0.3)", padding: "4px 12px", borderRadius: "var(--radius-pill)", fontSize: "11px", fontWeight: 700 }}>15-Module Revenue Intelligence Platform</span>
        </div>

        <h1 style={{ fontSize: "clamp(26px, 4.5vw, 46px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.04em", marginBottom: 16, maxWidth: 820 }}>
          Stop Losing $1.2M+ in Pipeline Every Quarter.
        </h1>
        <p style={{ fontSize: "clamp(14px, 1.8vw, 17px)", color: "rgba(255,255,255,0.85)", lineHeight: 1.65, maxWidth: 780, marginBottom: 32 }}>
          DealSense is the autonomous HubSpot revenue intelligence engine that scores every deal in real-time, surfaces hidden pipeline leaks before they kill your quarter, and lets you white-label the entire platform under your agency brand — generating <strong style={{ color: "#fbbf24" }}>$240K+/year in recurring retainer revenue</strong> from a single deployment.
        </p>

        {/* CTA Row */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          {/* Primary: Live Dashboard */}
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "13px 26px",
              background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
              color: "#ffffff",
              fontSize: "14.5px",
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1), 0 6px 20px rgba(255, 92, 53, 0.4), inset 0 1px 0 rgba(255,255,255,0.35)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Launch Live Dashboard</span>
            <span style={{ fontSize: "13px", opacity: 0.85, marginLeft: 2 }}>→</span>
          </button>

          {/* Secondary: Start $99 Pilot Audit */}
          <button
            onClick={() => handleOpenOrder("micro_audit")}
            style={{
              padding: "13px 22px",
              background: "#ffffff",
              color: "#124548",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              border: "1px solid #ffffff",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15), inset 0 1px 0 #ffffff",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: "rgba(255,92,53,0.15)", color: "#ff5c35", fontSize: "11px", fontWeight: 800 }}>⚡</span>
            <span>Start $99 Pilot Audit</span>
          </button>

          {/* Tertiary: See Pricing */}
          <button
            onClick={() => scrollTo("pricing")}
            style={{
              padding: "13px 20px",
              background: "rgba(255, 255, 255, 0.08)",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "13.5px",
              fontWeight: 600,
              fontFamily: "var(--font-heading)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "var(--radius-sm)",
              backdropFilter: "blur(8px)",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            See Pricing & Tiers ↓
          </button>
        </div>

        {/* Trust bar */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", marginTop: 24, fontSize: "12px", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
          <span>🔒 1-Click HubSpot OAuth</span>
          <span>🛡️ 100% Money-Back Guarantee</span>
          <span>⚡ 24–48h Turnaround</span>
          <span>📜 Full Source Code Ownership</span>
        </div>
      </motion.div>

      {/* ═══════════════════ SECTION 2: THE PROBLEM ═══════════════════ */}
      {sectionTitle("The Problem Every Agency Owner Knows Too Well", "Your clients are bleeding pipeline revenue — and they don't even know it until the quarter ends.")}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))", gap: 12, marginBottom: 48 }}>
        {PROBLEMS.map((p, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
            borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--hs-border-dark)",
          }}>
            <div style={{ padding: "16px 18px", background: "var(--risk-critical-bg)", borderRight: "1px solid var(--risk-critical-border)" }}>
              <div style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--danger)", marginBottom: 6 }}>❌ WITHOUT DEALSENSE</div>
              <div style={{ fontSize: "12.5px", color: "var(--hs-text)", lineHeight: 1.5 }}>{p.before}</div>
            </div>
            <div style={{ padding: "16px 18px", background: "var(--risk-healthy-bg)" }}>
              <div style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--risk-healthy)", marginBottom: 6 }}>✓ WITH DEALSENSE</div>
              <div style={{ fontSize: "12.5px", color: "var(--hs-text)", lineHeight: 1.5 }}>{p.after}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════ SECTION 3: 15-MODULE PLATFORM ═══════════════════ */}
      {sectionTitle("15 Production Modules — Explore Them Live Right Now", "Every module below is functional and interactive. Click \"Launch Live Dashboard\" above to explore.")}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12, marginBottom: 48 }}>
        {MODULES.map((m) => (
          <div key={m.name} style={{
            padding: "16px", borderRadius: "var(--radius-md)", background: "var(--hs-surface)",
            border: "1px solid var(--hs-border-dark)", transition: "all 0.15s ease",
          }}>
            <div style={{ fontSize: "22px", marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--hs-primary)", marginBottom: 4 }}>{m.name}</div>
            <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", lineHeight: 1.45 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      {/* ═══════════════════ SECTION 4: ARCHITECTURE ═══════════════════ */}
      {sectionTitle("Production Architecture — Not a Prototype", "4-layer enterprise stack engineered for HubSpot Solutions Partners running real client pipelines.")}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 48 }}>
        {ARCH_LAYERS.map((l, i) => (
          <div key={l.label} style={{
            padding: "20px", borderRadius: "var(--radius-md)", background: "var(--hs-surface)",
            border: "1px solid var(--hs-border-dark)", borderTop: `3px solid ${i === 0 ? "#ff5c35" : i === 1 ? "var(--risk-healthy)" : i === 2 ? "#2563eb" : "var(--hs-primary)"}`,
          }}>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--hs-text-muted)", marginBottom: 6 }}>Layer {i + 1}</div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--hs-primary)", marginBottom: 4 }}>{l.label}</div>
            <div style={{ fontSize: "11px", color: "var(--hs-accent)", fontFamily: "var(--font-mono)", marginBottom: 8, fontWeight: 600 }}>{l.tech}</div>
            <div style={{ fontSize: "12.5px", color: "var(--hs-text-muted)", lineHeight: 1.5 }}>{l.detail}</div>
          </div>
        ))}
      </div>

      {/* ═══════════════════ SECTION 5: AGENCY REVENUE CALCULATOR ═══════════════════ */}
      {sectionTitle("Your Agency Revenue Calculator", "See exactly how much recurring revenue you could generate by white-labeling DealSense.")}

      <div className="card" style={{ marginBottom: 48 }}>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28, alignItems: "center" }}>
          <div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 6 }}>Number of Client Portals: <strong style={{ color: "#ff5c35" }}>{clientCount}</strong></label>
              <input type="range" min={1} max={25} value={clientCount} onChange={(e) => setClientCount(+e.target.value)} style={{ width: "100%", accentColor: "#ff5c35" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 6 }}>Monthly Retainer per Client: <strong style={{ color: "#ff5c35" }}>${retainerFee.toLocaleString()}</strong></label>
              <input type="range" min={500} max={5000} step={250} value={retainerFee} onChange={(e) => setRetainerFee(+e.target.value)} style={{ width: "100%", accentColor: "#ff5c35" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: "16px", background: "var(--risk-healthy-bg)", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid var(--risk-healthy-border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--risk-healthy)", marginBottom: 4 }}>Annual Revenue</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--risk-healthy)" }}>${(annualRevenue / 1000).toFixed(0)}K</div>
            </div>
            <div style={{ padding: "16px", background: "var(--hs-accent-subtle)", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,92,53,0.2)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "#ff5c35", marginBottom: 4 }}>Your ROI</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#ff5c35" }}>{roi}×</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ SECTION 6: PRICING ═══════════════════ */}
      <div id="pricing">
        {sectionTitle("Deployment Packages — Extreme Value Delta", "What agencies charge $5,000–$9,000 for, you get for a fraction. Full money-back guarantee on every tier.")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 48 }}>
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} style={{
            padding: "28px 24px", borderRadius: "var(--radius-lg)",
            background: pkg.highlight ? "linear-gradient(135deg, #124548 0%, #062b2e 100%)" : "var(--hs-surface)",
            color: pkg.highlight ? "#fff" : "var(--hs-text)",
            border: pkg.highlight ? "2px solid #ff5c35" : "1px solid var(--hs-border-dark)",
            position: "relative", display: "flex", flexDirection: "column",
            boxShadow: pkg.highlight ? "0 8px 30px rgba(255,92,53,0.2)" : "var(--shadow-sm)",
          }}>
            {pkg.highlight && (
              <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "#ff5c35", color: "#fff", padding: "3px 16px", borderRadius: "0 0 8px 8px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase" }}>
                Most Popular
              </div>
            )}

            <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: 4, marginTop: pkg.highlight ? 12 : 0 }}>{pkg.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: "32px", fontWeight: 800, color: pkg.highlight ? "#fbbf24" : "#ff5c35" }}>{pkg.price}</span>
              <span style={{ fontSize: "14px", textDecoration: "line-through", color: pkg.highlight ? "rgba(255,255,255,0.5)" : "var(--hs-text-disabled)" }}>{pkg.crossed}</span>
            </div>
            <div style={{ fontSize: "12px", color: pkg.highlight ? "rgba(255,255,255,0.75)" : "var(--hs-text-muted)", marginBottom: 6 }}>
              {pkg.timeline} delivery · {pkg.tagline}
            </div>
            <div style={{
              fontSize: "11.5px", fontWeight: 600, padding: "8px 10px", borderRadius: "var(--radius-sm)", marginBottom: 16,
              background: pkg.highlight ? "rgba(5,150,105,0.2)" : "var(--risk-healthy-bg)",
              color: pkg.highlight ? "#6ee7b7" : "var(--risk-healthy)",
              border: pkg.highlight ? "1px solid rgba(5,150,105,0.3)" : "1px solid var(--risk-healthy-border)",
            }}>
              🛡️ {pkg.guarantee}
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {pkg.features.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: "12.5px", lineHeight: 1.4, color: pkg.highlight ? "rgba(255,255,255,0.9)" : "var(--hs-text)" }}>
                  <span style={{ color: pkg.highlight ? "#6ee7b7" : "var(--risk-healthy)", flexShrink: 0 }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleOpenOrder(pkg.id)}
              style={{
                width: "100%", padding: "13px", fontSize: "14px", fontWeight: 700, border: "none",
                fontFamily: "var(--font-heading)",
                borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "all 0.2s ease",
                background: pkg.highlight ? "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)" : "linear-gradient(180deg, #185a5e 0%, #124548 100%)",
                color: "#fff",
                boxShadow: pkg.highlight ? "0 1px 2px rgba(0,0,0,0.1), 0 4px 16px rgba(255,92,53,0.4), inset 0 1px 0 rgba(255,255,255,0.35)" : "var(--shadow-sm), inset 0 1px 0 rgba(255,255,255,0.2)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span>{pkg.cta}</span>
              <span>→</span>
            </button>
          </div>
        ))}
      </div>

      {/* ═══════════════════ SECTION 7: FAQ ═══════════════════ */}
      {sectionTitle("Frequently Asked Questions", "Everything you need to know before deploying.")}

      <div style={{ marginBottom: 48 }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--hs-border-dark)" }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                width: "100%", padding: "16px 4px", background: "none", border: "none", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left",
                fontSize: "14px", fontWeight: 700, color: "var(--hs-primary)", fontFamily: "var(--font-sans)",
              }}
            >
              <span>{faq.q}</span>
              <span style={{ fontSize: "18px", transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", flexShrink: 0, marginLeft: 12 }}>+</span>
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "0 4px 16px", fontSize: "13px", color: "var(--hs-text-muted)", lineHeight: 1.65 }}>
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* ═══════════════════ SECTION 8: FINAL CTA ═══════════════════ */}
      <div style={{
        padding: "clamp(28px, 5vw, 48px) clamp(20px, 4vw, 40px)", borderRadius: "var(--radius-lg)",
        background: "linear-gradient(135deg, #124548 0%, #062b2e 100%)", textAlign: "center", color: "#fff",
      }}>
        <h2 style={{ fontSize: "clamp(22px, 3.5vw, 34px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>
          Your Competitors Are Already Deploying AI Revenue Intelligence.
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", maxWidth: 640, margin: "0 auto 28px", lineHeight: 1.6 }}>
          Every quarter you wait, your agency clients lose another $300K+ in pipeline slippage that you could have caught and charged premium retainers for.
        </p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <button
            onClick={() => handleOpenOrder("micro_audit")}
            style={{
              padding: "14px 28px",
              background: "linear-gradient(180deg, #ff6b48 0%, #ff5c35 100%)",
              color: "#fff",
              fontSize: "14.5px",
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1), 0 6px 20px rgba(255, 92, 53, 0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span>⚡ Start $99 Risk-Free Audit</span>
            <span>→</span>
          </button>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "14px 24px",
              background: "#ffffff",
              color: "#124548",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              border: "1px solid #ffffff",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15), inset 0 1px 0 #ffffff",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Explore Live Dashboard</span>
          </button>
        </div>
        <div style={{ marginTop: 20, fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
          🛡️ 100% Money-Back Guarantee · 📜 Full Source Code Ownership · ⚡ 24–48h Delivery
        </div>
      </div>

      {/* ═══════════════════ ORDER MODAL ═══════════════════ */}
      <AnimatePresence>
        {orderModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOrderModalOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(18,69,72,0.55)", backdropFilter: "blur(4px)", zIndex: 400 }}
            />
            <motion.div
              className="order-modal-container"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
            >
              <div className="modal-drag-pill" />
              <div className="order-modal-header">
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--hs-primary)", lineHeight: 1.2 }}>{activePackage.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 3 }}>
                    <strong style={{ color: "#ff5c35", fontSize: "14px" }}>{activePackage.price}</strong> · {activePackage.timeline} · 🛡️ Money-Back Guarantee
                  </div>
                </div>
                <button onClick={() => setOrderModalOpen(false)} style={{ background: "var(--hs-background)", border: "1px solid var(--hs-border-dark)", width: 32, height: 32, borderRadius: "50%", fontSize: "14px", cursor: "pointer", color: "var(--hs-text-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
              </div>

              <div className="order-modal-body">
                {orderSubmitted ? (
                  <div style={{ textAlign: "center", padding: "32px 16px" }}>
                    <div style={{ fontSize: "40px", marginBottom: 12 }}>🎉</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--hs-primary)", marginBottom: 8 }}>Order Confirmed!</div>
                    <div style={{ fontSize: "13px", color: "var(--hs-text)", lineHeight: 1.6, marginBottom: 16 }}>
                      I'll review your requirements and send your HubSpot onboarding link to <strong>{orderForm.email}</strong> within 2 hours.
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--risk-healthy)", fontWeight: 700, padding: "8px", background: "var(--risk-healthy-bg)", borderRadius: "var(--radius-sm)" }}>
                      🛡️ Backed by 100% Money-Back Guarantee
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitOrder} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", marginBottom: 4 }}>Your Full Name *</label>
                      <input required type="text" placeholder="e.g. Alex Morgan" value={orderForm.name} onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })} className="modal-form-input" />
                    </div>
                    <div className="modal-input-grid">
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", marginBottom: 4 }}>Work Email *</label>
                        <input required type="email" placeholder="alex@agency.com" value={orderForm.email} onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })} className="modal-form-input" />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", marginBottom: 4 }}>Agency Name *</label>
                        <input required type="text" placeholder="e.g. Apex RevOps" value={orderForm.company} onChange={(e) => setOrderForm({ ...orderForm, company: e.target.value })} className="modal-form-input" />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", marginBottom: 4 }}>Deployment Package</label>
                      <select value={orderForm.tier} onChange={(e) => { setOrderForm({ ...orderForm, tier: e.target.value }); setSelectedPkg(e.target.value); }} className="modal-form-input">
                        {PACKAGES.map((p) => (<option key={p.id} value={p.id}>{p.name} — {p.price}</option>))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--hs-primary)", marginBottom: 4 }}>HubSpot Portal ID (Optional)</label>
                      <input type="text" placeholder="e.g. #48921820" value={orderForm.portalId} onChange={(e) => setOrderForm({ ...orderForm, portalId: e.target.value })} className="modal-form-input" />
                    </div>
                    <div style={{ padding: "10px 12px", background: "var(--hs-background)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)", fontSize: "11.5px", color: "var(--hs-text-muted)", lineHeight: 1.5 }}>
                      🔒 <strong>Zero-Risk:</strong> You'll receive an invoice and 1-click HubSpot OAuth onboarding link. 100% money-back guarantee.
                    </div>
                    <button type="submit" style={{ width: "100%", padding: "14px", fontWeight: 800, background: "#ff5c35", color: "#fff", fontSize: "14px", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", boxShadow: "0 4px 14px rgba(255,92,53,0.35)" }}>
                      🚀 {activePackage.price === "$99" ? "Pay $99 & Start Audit" : `Confirm Order (${activePackage.price})`}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div style={{ marginTop: 64, marginInline: "-24px", marginBottom: "-100px" }}>
        <Footer />
      </div>
    </div>
  );
};
