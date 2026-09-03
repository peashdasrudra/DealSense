import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_LINKS } from "../config/navigation";
import { PAYMENT_GATEWAY_CONFIG, CURRENCIES, SupportedCurrency } from "../config/payment";
import { DealSenseIcon } from "../components/DealSenseLogo";

// ── Types & Tier Data ────────────────────────────────────────────────────────

export type TierKey = "agency-3500" | "deploy-1500" | "audit-99" | "custom-app";

interface BaseTierPlan {
  id: TierKey;
  name: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  popular?: boolean;
  baseUsdPrice: number;
  baseUsdListPrice: number;
  discountPercentage: number;
  description: string;
  deliverables: { icon: string; title: string; subtitle: string }[];
  deliveryTime: string;
  licenseType: string;
}

const PRICING_TIERS: Record<TierKey, BaseTierPlan> = {
  "agency-3500": {
    id: "agency-3500",
    name: "Elite Master Fleet (Agency Arbitrage)",
    tagline: "Multi-tenant white-label CRM engine for RevOps agencies & HubSpot partners.",
    badge: "RECOMMENDED · ARBITRAGE",
    badgeColor: "#ff5c35",
    popular: true,
    baseUsdPrice: 3500,
    baseUsdListPrice: 12500,
    discountPercentage: 72,
    description: "Deploy dedicated deal intelligence across 10+ client portals at £1,200/mo or €1,400/mo each with $0 monthly software tax.",
    deliveryTime: "Instant License & Full Monorepo Handover (24h Setup SLA)",
    licenseType: "Unlimited Multi-Tenant Perpetual Commercial License",
    deliverables: [
      { icon: "👑", title: "Unlimited Multi-Tenant Client Portals", subtitle: "Isolated multi-client workspace switcher with custom domain white-labeling" },
      { icon: "💎", title: "100% Full Monorepo Source Code Handover", subtitle: "Production-ready FastAPI, React 18, PostgreSQL 16, Redis Streams architecture" },
      { icon: "🛡️", title: "Custom Canvas SDK Extension Generator", subtitle: "HubSpot CRM iframe card with your agency brand logo, themes, and styles" },
      { icon: "⚡", title: "Row-Level Security (RLS) Partition Engine", subtitle: "Deterministic multi-client database isolation fully compliant with GDPR and UK DPA" },
      { icon: "📈", title: "Agency Arbitrage Playbook & Proposals", subtitle: "Client audit proposal templates, slide decks, and pricing models to close retainers" },
      { icon: "🚀", title: "Dedicated 1-on-1 Direct SLA Channel", subtitle: "Private Slack channel with Lead AI Architect Peash Das Rudra (1-hour response SLA)" },
    ],
  },
  "deploy-1500": {
    id: "deploy-1500",
    name: "Single Portal Production Stack",
    tagline: "Dedicated AI revenue telemetry for 1 enterprise HubSpot portal.",
    badge: "ENTERPRISE ONE-TIME",
    badgeColor: "#059669",
    baseUsdPrice: 1500,
    baseUsdListPrice: 5000,
    discountPercentage: 70,
    description: "Deploy dedicated AI deal scoring and CRM remediation for your own company with 100% source code ownership.",
    deliveryTime: "Instant License & GitHub Handover (24h Setup SLA)",
    licenseType: "Single Production Portal Lifetime Perpetual License",
    deliverables: [
      { icon: "📦", title: "100% Monorepo Source Code Handover", subtitle: "Complete backend, frontend, worker, and database migrations for private hosting" },
      { icon: "🛡️", title: "HubSpot CRM Canvas Card Extension", subtitle: "Embedded native deal risk card displaying real-time 7-vector scoring inside CRM" },
      { icon: "⚡", title: "180ms Deterministic Scoring Engine", subtitle: "0% hallucination telemetry evaluating stakeholder sentiment, single-threading & cadence" },
      { icon: "🔒", title: "Private Cloud VPC Deployment", subtitle: "Self-hosted Docker Compose / AWS / GCP / EU-Frankfurt / London deployment scripts" },
      { icon: "💳", title: "Zero Ongoing Monthly SaaS Tax", subtitle: "No per-seat fees or platform taxes forever ($0 ongoing software fee)" },
      { icon: "👨‍💻", title: "1-on-1 Senior Architect Onboarding", subtitle: "60-minute live architectural walkthrough and pipeline onboarding session" },
    ],
  },
  "audit-99": {
    id: "audit-99",
    name: "Pilot Deal Risk Audit Dossier",
    tagline: "7-vector pipeline scrutiny delivered in 24–48 hours with $25K guarantee.",
    badge: "RISK-FREE PILOT",
    badgeColor: "#0284c7",
    baseUsdPrice: 99,
    baseUsdListPrice: 500,
    discountPercentage: 80,
    description: "Read-only OAuth connection. If our audit does not uncover at least £20,000 / €25,000 in deal slippage, 100% instant refund.",
    deliveryTime: "Delivered in 24–48 Hours",
    licenseType: "Single Pipeline Executive Audit & Diagnostic Dossier",
    deliverables: [
      { icon: "🔍", title: "Full 7-Vector Pipeline Scrutiny", subtitle: "Detailed evaluation of every active deal over $10K in your HubSpot CRM" },
      { icon: "⚠️", title: "Silent Buyer Disengagement Flags", subtitle: "Identifies economic buyers ghosting reps and single-threaded vulnerability" },
      { icon: "📊", title: "Executive Board-Ready PDF Dossier", subtitle: "CFO-grade diagnostic report highlighting immediate revenue recovery actions" },
      { icon: "🎥", title: "10-Minute Personal Video Walkthrough", subtitle: "Recorded executive synthesis by Lead AI Architect Peash Das Rudra" },
      { icon: "🛡️", title: "100% Read-Only OAuth Connection", subtitle: "Zero write-access or modification to your HubSpot records" },
      { icon: "💰", title: "$25,000 Slippage Catch Guarantee", subtitle: "If we don't catch $25K+ in deal risk, receive a 100% full money-back refund" },
    ],
  },
  "custom-app": {
    id: "custom-app",
    name: "Custom AI HubSpot App Sprint",
    tagline: "Bespoke HubSpot CRM Canvas card or custom AI engine in 5–10 business days.",
    badge: "RAPID SPRINT",
    badgeColor: "#7c3aed",
    baseUsdPrice: 1500,
    baseUsdListPrice: 5000,
    discountPercentage: 70,
    description: "Custom AI copilot, specialized scoring algorithms, or Redis streaming pipeline tailored to your unique sales process.",
    deliveryTime: "5–10 Business Day Delivery Turnaround",
    licenseType: "Custom Bespoke IP with 100% Full Source Code Handover",
    deliverables: [
      { icon: "🛠️", title: "Custom HubSpot CRM Canvas Card", subtitle: "Tailored to your specific sales stages, custom objects, and rep coaching workflows" },
      { icon: "⚡", title: "Custom AI Deal Intelligence Engine", subtitle: "Fine-tuned algorithms mapped to your ICP, sales methodology (MEDDPICC/SPIN)" },
      { icon: "📦", title: "100% Full Source Code Handover", subtitle: "Complete repository access and automated CI/CD deployment pipeline" },
      { icon: "🛡️", title: "HubSpot API Webhook Resiliency", subtitle: "Sub-200ms real-time event processing with Redis Streams backpressure" },
      { icon: "🔒", title: "$0 Ongoing Platform Tax Forever", subtitle: "Self-hosted private cloud infrastructure with zero third-party lock-in" },
      { icon: "👨‍💻", title: "Direct Lead Architect Coordination", subtitle: "Direct sprint alignment with Lead Architect Peash Das Rudra" },
    ],
  },
};

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Multi-Currency State
  const [currency, setCurrency] = useState<SupportedCurrency>("USD");
  const currencyConfig = CURRENCIES[currency];

  // Selected Tier State
  const initialTierParam = (searchParams.get("tier") as TierKey) || "agency-3500";
  const [selectedTierKey, setSelectedTierKey] = useState<TierKey>(
    PRICING_TIERS[initialTierParam] ? initialTierParam : "agency-3500"
  );

  // Mobile Deliverables Accordion State
  const [isDeliverablesExpanded, setIsDeliverablesExpanded] = useState(true);

  // Manual & Setup Guide Modal Toggle
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Corporate Procurement Form State
  const [formData, setFormData] = useState({
    fullName: "Sarah Miller",
    workEmail: "sarah.miller@enterprise-revops.com",
    companyName: "Apex Global Growth Ltd",
    hubspotPortalId: "#8941029",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectTier = (tier: TierKey) => {
    setSelectedTierKey(tier);
    setSearchParams({ tier });
  };

  const selectedTier = PRICING_TIERS[selectedTierKey];

  // Dynamic Price Conversions
  const convertedPrice = Math.round(selectedTier.baseUsdPrice * currencyConfig.rate);
  const convertedListPrice = Math.round(selectedTier.baseUsdListPrice * currencyConfig.rate);
  const formattedPrice = `${currencyConfig.symbol}${convertedPrice.toLocaleString()}`;
  const formattedListPrice = `${currencyConfig.symbol}${convertedListPrice.toLocaleString()}`;
  const formattedSavings = `${currencyConfig.symbol}${(convertedListPrice - convertedPrice).toLocaleString()}`;

  const handleProceedToPayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const lemonLink = (PAYMENT_GATEWAY_CONFIG.LEMON_SQUEEZY_LINKS as Record<string, string>)[selectedTierKey];
    const stripeLink = (PAYMENT_GATEWAY_CONFIG.STRIPE_PAYMENT_LINKS as Record<string, string>)[selectedTierKey];
    
    const isLiveLemon = lemonLink && lemonLink.includes("lemonsqueezy.com/checkout/buy/");
    const isLiveStripe = stripeLink && !stripeLink.includes("test_");

    const liveLink = isLiveLemon ? lemonLink : isLiveStripe ? stripeLink : null;

    if (liveLink) {
      const url = new URL(liveLink);
      if (formData.workEmail) url.searchParams.set("checkout[email]", formData.workEmail);
      if (formData.fullName) url.searchParams.set("checkout[name]", formData.fullName);
      if (formData.workEmail) url.searchParams.set("prefilled_email", formData.workEmail);
      if (formData.fullName) url.searchParams.set("client_reference_id", formData.fullName);
      window.location.href = url.toString();
      return;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      alert("Connecting to Lemon Squeezy payment terminal...");
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a", fontFamily: "var(--font-sans)", paddingBottom: "130px" }}>
      
      {/* ── 1. Top Enterprise Mobile-Native Navigation Bar ──────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid #e2e8f0",
          zIndex: 1000,
          padding: "10px clamp(12px, 3.5vw, 28px)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          {/* Logo & Platform Name */}
          <div
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}
            title="Return to DealSense Homepage"
          >
            <DealSenseIcon size={34} />
            <div>
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#092124", letterSpacing: "-0.03em", fontFamily: "'Outfit', sans-serif" }}>
                Deal<span style={{ color: "#ff5c35" }}>Sense</span>
              </span>
            </div>
          </div>

          {/* Right Controls: Compact Currency Switcher + Back */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Currency Switcher */}
            <div style={{ display: "flex", background: "#f1f5f9", padding: "2px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
              {(Object.keys(CURRENCIES) as SupportedCurrency[]).map((cCode) => {
                const c = CURRENCIES[cCode];
                const isActive = currency === cCode;
                return (
                  <button
                    key={cCode}
                    type="button"
                    onClick={() => setCurrency(cCode)}
                    style={{
                      padding: "4px 7px",
                      borderRadius: "6px",
                      border: "none",
                      background: isActive ? "#ffffff" : "transparent",
                      color: isActive ? "#092124" : "#64748b",
                      fontWeight: isActive ? 800 : 600,
                      fontSize: "11.5px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>{c.flag}</span>
                    <span style={{ display: "inline-block" }}>{c.code}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => navigate("/")}
              style={{
                padding: "6px 10px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "7px",
                fontSize: "11.5px",
                fontWeight: 700,
                color: "#475569",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. Top Trust & Compliance Micro-Ribbon ─────────────────────── */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "8px clamp(12px, 3vw, 24px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6, fontSize: "11px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#475569" }}>
            <span style={{ color: "#059669", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              PSD2 SCA 3D-Secure
            </span>
            <span style={{ color: "#cbd5e1" }}>•</span>
            <span style={{ color: "#64748b" }}>Lemon Squeezy MoR</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#059669", fontWeight: 700 }}>
            <span>🟢 0% B2B VAT Reverse-Charge</span>
          </div>
        </div>
      </div>

      {/* ── 3. Main Split-Screen Checkout Body ─────────────────────────── */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(16px, 3.5vw, 36px) clamp(12px, 3vw, 24px)" }}>
        
        {/* ── 1. Mobile-Native Horizontal Snap-Scroll Package Cards ───── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "0 2px" }}>
            <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              CHOOSE PRODUCTION PACKAGE
            </span>
            <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#059669" }}>
              $0 Monthly SaaS Tax
            </span>
          </div>

          {/* Horizontal Snap Scroll Container on Mobile */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 10,
              overflowX: "auto",
              paddingBottom: 4,
              WebkitOverflowScrolling: "touch",
            }}
          >
            {(Object.keys(PRICING_TIERS) as TierKey[]).map((tierKey) => {
              const tier = PRICING_TIERS[tierKey];
              const isSelected = selectedTierKey === tierKey;
              const tierPrice = Math.round(tier.baseUsdPrice * currencyConfig.rate);
              const tierList = Math.round(tier.baseUsdListPrice * currencyConfig.rate);

              return (
                <button
                  key={tierKey}
                  type="button"
                  onClick={() => handleSelectTier(tierKey)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: isSelected ? "2px solid #ff5c35" : "1.5px solid #e2e8f0",
                    background: isSelected ? "#ffffff" : "#fdfefe",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected ? "0 6px 18px -3px rgba(255, 92, 53, 0.18), 0 2px 4px rgba(0,0,0,0.03)" : "0 1px 2px rgba(0,0,0,0.02)",
                    position: "relative",
                    minWidth: "220px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: "11.5px", fontWeight: 800, color: isSelected ? "#ff5c35" : "#475569" }}>
                      {tier.name.split(" ")[0]} {tier.name.split(" ")[1]}
                    </span>
                    {tier.popular && (
                      <span style={{ fontSize: "8.5px", fontWeight: 800, background: "#ff5c35", color: "#ffffff", padding: "1px 5px", borderRadius: "3px" }}>
                        POPULAR
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    <span style={{ fontSize: "20px", fontWeight: 900, color: "#092124", fontFamily: "'Outfit', sans-serif" }}>
                      {currencyConfig.symbol}{tierPrice.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "11px", color: "#94a3b8", textDecoration: "line-through", fontWeight: 600 }}>
                      {currencyConfig.symbol}{tierList.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#059669", marginLeft: "auto" }}>
                      Save {tier.discountPercentage}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. Two-Column Review & Procurement Layout ───────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, alignItems: "flex-start" }}>
          
          {/* ── Left Column: Scope of Work & Deliverables Review ──────── */}
          <div>
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e2e8f0",
                borderRadius: "16px",
                padding: "18px 16px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
                marginBottom: 16,
              }}
            >
              {/* Tier Headline Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 800, color: selectedTier.badgeColor, background: `${selectedTier.badgeColor}15`, border: `1px solid ${selectedTier.badgeColor}35`, padding: "2px 7px", borderRadius: "9999px", textTransform: "uppercase" }}>
                    {selectedTier.badge}
                  </span>
                  <h2 style={{ fontSize: "19px", fontWeight: 900, color: "#092124", margin: "6px 0 2px", fontFamily: "'Outfit', sans-serif" }}>
                    {selectedTier.name}
                  </h2>
                  <p style={{ fontSize: "12.5px", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                    {selectedTier.tagline}
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "24px", fontWeight: 900, color: "#092124", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                    {formattedPrice}
                  </div>
                  <div style={{ fontSize: "10.5px", fontWeight: 600, color: "#64748b" }}>flat one-time</div>
                </div>
              </div>

              {/* Applied Discount Tag */}
              <div style={{ padding: "8px 12px", background: "rgba(255, 92, 53, 0.08)", border: "1px solid rgba(255, 92, 53, 0.22)", borderRadius: "8px", fontSize: "11.5px", fontWeight: 800, color: "#ff5c35", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>🏷️ Coupon: FOUNDER-{selectedTier.discountPercentage}% (Applied)</span>
                <span>Save {formattedSavings}</span>
              </div>

              {/* Mobile-Friendly Deliverables Accordion Header */}
              <div
                onClick={() => setIsDeliverablesExpanded(!isDeliverablesExpanded)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  cursor: "pointer",
                  borderTop: "1px solid #f1f5f9",
                  borderBottom: isDeliverablesExpanded ? "1px solid #f1f5f9" : "none",
                  marginBottom: isDeliverablesExpanded ? 12 : 0,
                }}
              >
                <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#092124", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  What's Included ({selectedTier.deliverables.length} Deliverables)
                </span>
                <span style={{ fontSize: "12px", color: "#ff5c35", fontWeight: 800 }}>
                  {isDeliverablesExpanded ? "Hide ▲" : "View ▼"}
                </span>
              </div>

              {/* Comprehensive Deliverables Matrix */}
              <AnimatePresence>
                {isDeliverablesExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}
                  >
                    {selectedTier.deliverables.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "12px", lineHeight: 1.4 }}>
                        <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                        <div>
                          <strong style={{ color: "#092124", fontWeight: 800 }}>{item.title}:</strong>{" "}
                          <span style={{ color: "#475569" }}>{item.subtitle}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lead AI Architect & Guarantee Card */}
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #092124 0%, #ff5c35 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "14px", flexShrink: 0, border: "2px solid #ffffff", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                  PR
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#092124" }}>Peash Das Rudra</span>
                    <span style={{ fontSize: "8.5px", fontWeight: 800, color: "#059669", background: "rgba(16,185,129,0.1)", padding: "1px 5px", borderRadius: "3px" }}>LEAD ARCHITECT</span>
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#64748b", lineHeight: 1.35, marginTop: 1 }}>
                    HubAiLab Author · 100% Guaranteed 24h Setup SLA
                  </div>
                  <div style={{ marginTop: 2 }}>
                    <a
                      href={CONTACT_LINKS.ONBOARDING_CALENDLY}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "10.5px", fontWeight: 700, color: "#166534", textDecoration: "none" }}
                    >
                      📅 View Onboarding Calendar →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Enterprise Procurement & Direct Checkout ── */}
          <div>
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e2e8f0",
                borderRadius: "16px",
                padding: "clamp(18px, 4vw, 28px)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: "16px", fontWeight: 900, color: "#092124", margin: 0 }}>
                  Billing & Procurement Review
                </h3>
                <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#059669", background: "#ecfdf5", padding: "2px 7px", borderRadius: "5px" }}>
                  Instant Handover
                </span>
              </div>

              {/* Corporate Procurement Form */}
              <form onSubmit={handleProceedToPayment} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#092124", marginBottom: 3 }}>Full Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{ width: "100%", padding: "12px 12px", border: "1.5px solid #cbd5e1", borderRadius: "9px", fontSize: "16px", outline: "none", background: "#fdfefe", WebkitAppearance: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#092124", marginBottom: 3 }}>Work Email *</label>
                  <input
                    required
                    type="email"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    style={{ width: "100%", padding: "12px 12px", border: "1.5px solid #cbd5e1", borderRadius: "9px", fontSize: "16px", outline: "none", background: "#fdfefe", WebkitAppearance: "none" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#092124", marginBottom: 3 }}>Company / Agency *</label>
                    <input
                      required
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      style={{ width: "100%", padding: "12px 12px", border: "1.5px solid #cbd5e1", borderRadius: "9px", fontSize: "16px", outline: "none", background: "#fdfefe", WebkitAppearance: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#092124", marginBottom: 3 }}>HubSpot Portal ID</label>
                    <input
                      type="text"
                      value={formData.hubspotPortalId}
                      onChange={(e) => setFormData({ ...formData, hubspotPortalId: e.target.value })}
                      style={{ width: "100%", padding: "12px 12px", border: "1.5px solid #cbd5e1", borderRadius: "9px", fontSize: "16px", outline: "none", background: "#fdfefe", WebkitAppearance: "none" }}
                    />
                  </div>
                </div>

                {/* Accepted Payment Methods Pill Showcase */}
                <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "9px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#475569", textTransform: "uppercase" }}>
                      Accepted Payment Rails:
                    </span>
                    <span style={{ fontSize: "9.5px", fontWeight: 700, color: "#059669" }}>
                      256-Bit TLS
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: "9.5px", fontWeight: 800, background: "#092124", color: "#fff", padding: "2px 5px", borderRadius: "3px" }}>VISA</span>
                    <span style={{ fontSize: "9.5px", fontWeight: 800, background: "#ff5c35", color: "#fff", padding: "2px 5px", borderRadius: "3px" }}>Mastercard</span>
                    <span style={{ fontSize: "9.5px", fontWeight: 800, background: "#0284c7", color: "#fff", padding: "2px 5px", borderRadius: "3px" }}>AMEX</span>
                    <span style={{ fontSize: "9.5px", fontWeight: 800, background: "#000000", color: "#fff", padding: "2px 5px", borderRadius: "3px" }}>Apple Pay</span>
                    <span style={{ fontSize: "9.5px", fontWeight: 800, background: "#000000", color: "#fff", padding: "2px 5px", borderRadius: "3px" }}>Google Pay</span>
                    <span style={{ fontSize: "9.5px", fontWeight: 800, background: "#003087", color: "#fff", padding: "2px 5px", borderRadius: "3px" }}>PayPal</span>
                    <span style={{ fontSize: "9.5px", fontWeight: 800, background: "#cc0066", color: "#fff", padding: "2px 5px", borderRadius: "3px" }}>iDEAL</span>
                    <span style={{ fontSize: "9.5px", fontWeight: 800, background: "#059669", color: "#fff", padding: "2px 5px", borderRadius: "3px" }}>SEPA</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div style={{ borderTop: "1.5px solid #f1f5f9", paddingTop: 10, marginTop: 2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: 4 }}>
                    <span>List License Value ({currencyConfig.code})</span>
                    <span style={{ textDecoration: "line-through" }}>{formattedListPrice}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#059669", fontWeight: 700, marginBottom: 4 }}>
                    <span>Applied Founder Discount</span>
                    <span>-{formattedSavings}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: 8 }}>
                    <span>EU/UK Reverse-Charge VAT</span>
                    <span style={{ color: "#059669", fontWeight: 700 }}>{currencyConfig.symbol}0.00 (0% Tax)</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1.5px solid #e2e8f0", paddingTop: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: "15px", fontWeight: 900, color: "#092124" }}>Total Due</span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "24px", fontWeight: 900, color: "#ff5c35", fontFamily: "'Outfit', sans-serif" }}>
                        {formattedPrice}
                      </span>
                      <span style={{ fontSize: "10.5px", color: "#64748b", display: "block" }}>
                        flat one-time fee
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Action Button (In Form for Desktop / Scrolling) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "15px",
                    background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 800,
                    border: "none",
                    borderRadius: "11px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 20px rgba(255, 92, 53, 0.42), inset 0 1px 0 rgba(255,255,255,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    opacity: isSubmitting ? 0.8 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <span>Connecting to Payment Terminal...</span>
                  ) : (
                    <span>🔒 Complete {formattedPrice} Order →</span>
                  )}
                </button>

                <div style={{ textAlign: "center", fontSize: "11px", color: "#64748b", marginTop: 2, lineHeight: 1.35 }}>
                  🔒 Payments securely processed by Lemon Squeezy Merchant of Record.<br />
                  Immediate B2B invoice dispatch & 100% Money-Back Guarantee.
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* ── 4. Mobile-Native Sticky Bottom Action Bar (Mobile Only, 100% Unclipped) ── */}
      <style>{`
        @media (min-width: 769px) {
          .checkout-mobile-dock {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .checkout-mobile-dock {
            display: flex !important;
          }
        }
      `}</style>
      <div
        className="checkout-mobile-dock"
        style={{
          position: "fixed",
          bottom: "16px",
          left: "12px",
          right: "12px",
          maxWidth: "480px",
          margin: "0 auto",
          boxSizing: "border-box",
          background: "#ffffff",
          borderRadius: "16px",
          border: "1.5px solid #cbd5e1",
          zIndex: 10000,
          padding: "12px 16px",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, boxSizing: "border-box" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Total ({selectedTier.name.split(" ")[0]})
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 1 }}>
              <span style={{ fontSize: "22px", fontWeight: 900, color: "#ff5c35", fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>
                {formattedPrice}
              </span>
              <span style={{ fontSize: "10.5px", color: "#059669", fontWeight: 800 }}>
                (Save {selectedTier.discountPercentage}%)
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleProceedToPayment()}
            style={{
              padding: "12px 20px",
              background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 800,
              border: "none",
              borderRadius: "10px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(255, 92, 53, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {isSubmitting ? (
              <span>Connecting...</span>
            ) : (
              <span>Proceed to Pay →</span>
            )}
          </button>
        </div>
      </div>

      {/* ── 5. Merchant Payout Setup Guide Modal ───────────────────────── */}
      <AnimatePresence>
        {showSetupGuide && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(9, 33, 36, 0.6)",
              backdropFilter: "blur(6px)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
            onClick={() => setShowSetupGuide(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                maxWidth: 680,
                width: "100%",
                padding: "24px 20px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "20px" }}>🏦</span>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#092124", margin: 0 }}>
                    Direct Bangladesh Bank Payout Setup
                  </h3>
                </div>
                <button
                  onClick={() => setShowSetupGuide(false)}
                  style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontWeight: 800 }}
                >
                  ✕
                </button>
              </div>

              <div style={{ fontSize: "13px", color: "#475569", lineHeight: 1.55 }}>
                <p style={{ margin: "0 0 12px" }}>
                  Follow these <strong>3 simple steps</strong> to receive all credit card, iDEAL, SEPA, and Google Pay payments from UK & European buyers directly into your <strong>Bangladeshi Bank Account or Visa Card</strong>:
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                  <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <strong style={{ color: "#092124" }}>Step 1: Create a Free LemonSqueezy or Stripe Account</strong>
                    <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: 2 }}>
                      Sign up at <strong>lemonsqueezy.com</strong> or <strong>stripe.com</strong> ($0 monthly fee, 0 setup fee).
                    </div>
                  </div>

                  <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <strong style={{ color: "#092124" }}>Step 2: Connect Your Bangladeshi Bank Account</strong>
                    <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: 2 }}>
                      In <strong>Settings ➔ Payouts</strong>, add your <strong>BRAC Bank, Dutch-Bangla Bank (DBBL), City Bank, EBL</strong> or <strong>Dual-Currency Visa Card</strong>.
                    </div>
                  </div>

                  <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <strong style={{ color: "#092124" }}>Step 3: Paste Your 3 Payment Links</strong>
                    <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: 2 }}>
                      Paste your generated links in <code>src/config/payment.ts</code>. LemonSqueezy handles all UK/EU VAT and pays you in BDT!
                    </div>
                  </div>
                </div>

                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "9px 12px", borderRadius: "8px", fontSize: "11.5px", color: "#166534" }}>
                  ✅ <strong>Zero Intermediary Platform Tax:</strong> 100% of your earnings belong to you and settle automatically.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
