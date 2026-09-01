/**
 * DealSense Dashboard — App Shell.
 * Canvas Design System Edition.
 */

import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { Sidebar } from "./components/Sidebar";
import { PortfolioOverview } from "./pages/PortfolioOverview";
import { ClientHealth } from "./pages/ClientHealth";
import { ActionQueue } from "./pages/ActionQueue";
import { RiskHeatmap } from "./pages/RiskHeatmap";
import { DealExplorer } from "./pages/DealExplorer";
import { AuditLog } from "./pages/AuditLog";
import { Settings } from "./pages/Settings";

// ── Page Title Mapping ───────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, { title: string; breadcrumb: string }> = {
  "/": { title: "Portfolio Overview", breadcrumb: "Dashboard / Portfolio" },
  "/clients": { title: "Client Health", breadcrumb: "Dashboard / Clients" },
  "/deals": { title: "Deal Explorer", breadcrumb: "Dashboard / Deals" },
  "/actions": { title: "Action Queue", breadcrumb: "Dashboard / Actions" },
  "/heatmap": { title: "Risk Heatmap", breadcrumb: "Dashboard / Heatmap" },
  "/audit": { title: "Audit Log", breadcrumb: "System / Audit" },
  "/settings": { title: "Settings & Calibration", breadcrumb: "System / Settings" },
};

export const App: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageInfo = PAGE_TITLES[location.pathname] || { title: "DealSense", breadcrumb: "Dashboard" };

  return (
    <div className="layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(31,31,31,0.5)",
            zIndex: 90,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              className="mobile-nav-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div>
              <div className="main-header-breadcrumb">{pageInfo.breadcrumb}</div>
              <h1 className="main-header-title">{pageInfo.title}</h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Search Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--hs-surface)",
                border: "1px solid var(--hs-border-dark)",
                borderRadius: "var(--radius-sm)",
                padding: "6px 12px",
              }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--hs-text-disabled)" strokeWidth={2}>
                <circle cx={11} cy={11} r={8} />
                <line x1={21} y1={21} x2={16.65} y2={16.65} />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 14,
                  width: 140,
                  color: "var(--hs-text)",
                }}
              />
            </div>

            {/* Profile Avatar */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--hs-primary)",
                color: "var(--hs-on-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              AX
            </div>
          </div>
        </header>

        <div className="page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Routes location={location}>
                <Route path="/" element={<PortfolioOverview />} />
                <Route path="/clients" element={<ClientHealth />} />
                <Route path="/actions" element={<ActionQueue />} />
                <Route path="/heatmap" element={<RiskHeatmap />} />
                <Route path="/deals" element={<DealExplorer />} />
                <Route path="/audit" element={<AuditLog />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
