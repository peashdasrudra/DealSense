import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ALL_NAV_ITEMS, NavLinkItem, CONTACT_LINKS, navigateToDestination } from "../config/navigation";

export const NavTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lastTested, setLastTested] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["All", "Landing & Marketing", "Core Intelligence", "Risk Governance", "Architecture & Docs", "External & Contact"];

  const filteredItems = selectedCategory === "All"
    ? ALL_NAV_ITEMS
    : ALL_NAV_ITEMS.filter((item) => item.category === selectedCategory);

  const handleTestLink = (item: NavLinkItem) => {
    setLastTested(item.id);
    if (item.type === "external") {
      window.open(item.path, "_blank", "noopener,noreferrer");
    } else {
      navigateToDestination(item.path, window.location.pathname, navigate);
    }
  };

  const handleCopyLink = (item: NavLinkItem) => {
    const fullUrl = item.path.startsWith("http") || item.path.startsWith("mailto:")
      ? item.path
      : `${window.location.origin}${item.path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)", fontFamily: "var(--font-sans)" }}>
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(18, 69, 72, 0.08)", border: "1px solid rgba(18, 69, 72, 0.2)", padding: "4px 12px", borderRadius: "9999px", marginBottom: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#124548", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            CENTRALIZED LINK & CTA TEST SUITE
          </span>
        </div>
        <h1 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 900, color: "#092124", letterSpacing: "-0.035em", margin: "0 0 8px", fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
          Navigation & CTA Verification Dock
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0, maxWidth: 720, lineHeight: 1.5 }}>
          Test every page route, section anchor, architect contact channel, and conversion CTA in one single verified dashboard. All links are managed centrally in <code>src/config/navigation.ts</code>.
        </p>
      </div>

      {/* ── Category Filters ────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
              border: selectedCategory === cat ? "1.5px solid #ff5c35" : "1px solid #cbd5e1",
              background: selectedCategory === cat ? "rgba(255, 92, 53, 0.1)" : "#ffffff",
              color: selectedCategory === cat ? "#ff5c35" : "#475569",
              transition: "all 0.15s ease",
            }}
          >
            {cat} ({cat === "All" ? ALL_NAV_ITEMS.length : ALL_NAV_ITEMS.filter((i) => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* ── Links & CTA Grid ─────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
        {filteredItems.map((item) => {
          const isTested = lastTested === item.id;
          const isCopied = copiedId === item.id;

          return (
            <motion.div
              key={item.id}
              layout
              style={{
                background: "#ffffff",
                border: isTested ? "1.5px solid #10b981" : "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "16px 18px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 12,
                transition: "all 0.2s ease",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#092124", fontFamily: "'Outfit', sans-serif" }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span style={{ fontSize: "9px", fontWeight: 800, background: "rgba(255,92,53,0.12)", color: "#ff5c35", border: "1px solid rgba(255,92,53,0.3)", padding: "1px 5px", borderRadius: "4px" }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background:
                        item.type === "route"
                          ? "rgba(56, 189, 248, 0.12)"
                          : item.type === "anchor"
                          ? "rgba(139, 92, 246, 0.12)"
                          : "rgba(16, 185, 129, 0.12)",
                      color:
                        item.type === "route"
                          ? "#0284c7"
                          : item.type === "anchor"
                          ? "#7c3aed"
                          : "#059669",
                    }}
                  >
                    {item.type}
                  </span>
                </div>

                <div style={{ fontSize: "11.5px", color: "#64748b", lineHeight: 1.45, marginBottom: 8 }}>
                  {item.description}
                </div>

                <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#0f766e", background: "#f0fdfa", padding: "4px 8px", borderRadius: "6px", wordBreak: "break-all" }}>
                  {item.path}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
                <button
                  onClick={() => handleTestLink(item)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "linear-gradient(135deg, #092124 0%, #124548 100%)",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <span>⚡ Test Navigation</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => handleCopyLink(item)}
                  style={{
                    padding: "8px 12px",
                    background: "#f8fafc",
                    color: isCopied ? "#059669" : "#475569",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: isCopied ? "1px solid #10b981" : "1px solid #cbd5e1",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  title="Copy Destination URL"
                >
                  {isCopied ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick Reference Monorepo Footer ──────────────────────────── */}
      <div style={{ marginTop: 36, padding: "20px", background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 800, color: "#092124" }}>
            Lead AI Architect: Peash Das Rudra
          </div>
          <div style={{ fontSize: "11.5px", color: "#64748b" }}>
            All link configurations can be modified centrally in <code>src/config/navigation.ts</code>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a
            href={CONTACT_LINKS.REPO}
            target="_blank"
            rel="noreferrer"
            style={{ padding: "7px 14px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "12px", fontWeight: 700, color: "#092124", textDecoration: "none" }}
          >
            GitHub Monorepo ↗
          </a>
          <button
            onClick={() => navigate("/")}
            style={{ padding: "7px 14px", background: "linear-gradient(135deg, #ff6b48 0%, #ff5c35 100%)", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
          >
            Back to Landing Page →
          </button>
        </div>
      </div>
    </div>
  );
};
