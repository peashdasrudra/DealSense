/**
 * DealSense Dashboard — App Shell & Global RevOps Navigation.
 * Official HubSpot Canvas Design System Edition with Quick Search & Drawer Overlays.
 */

import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { LoadingScreen } from "./components/LoadingScreen";
import { PortfolioOverview } from "./pages/PortfolioOverview";
import { RevenueForecast } from "./pages/RevenueForecast";
import { DealExplorer } from "./pages/DealExplorer";
import { ActionQueue } from "./pages/ActionQueue";
import { CrmHygiene } from "./pages/CrmHygiene";
import { RepPerformance } from "./pages/RepPerformance";
import { RiskHeatmap } from "./pages/RiskHeatmap";
import { ClientHealth } from "./pages/ClientHealth";
import { AuditLog } from "./pages/AuditLog";
import { Settings } from "./pages/Settings";
import { MutualActionPlan } from "./pages/MutualActionPlan";
import { CompetitiveIntelligence } from "./pages/CompetitiveIntelligence";
import { CaseStudy } from "./pages/CaseStudy";
import { DealWarRoom } from "./pages/DealWarRoom";
import { RevOpsPlaybooks } from "./pages/RevOpsPlaybooks";
import { DealDrawer, DealData } from "./components/DealDrawer";

// ── Page Title Mapping ───────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, { title: string; breadcrumb: string }> = {
  "/": { title: "Pipeline Overview", breadcrumb: "Overview" },
  "/forecast": { title: "Revenue Forecast & Simulation", breadcrumb: "Forecast" },
  "/deals": { title: "Deal Inspector & Dossiers", breadcrumb: "Deals" },
  "/war-room": { title: "Deal War Room (QBR)", breadcrumb: "War Room" },
  "/heatmap": { title: "Pipeline Risk Heatmap", breadcrumb: "Heatmap" },
  "/actions": { title: "Action Approval Queue", breadcrumb: "Actions" },
  "/map": { title: "Mutual Action Plans (MAP)", breadcrumb: "MAP" },
  "/battlecards": { title: "Competitive Battlecards & Objections", breadcrumb: "Battlecards" },
  "/playbooks": { title: "Autonomous RevOps Playbooks", breadcrumb: "Playbooks" },
  "/hygiene": { title: "CRM Hygiene & Remediation", breadcrumb: "Hygiene" },
  "/reps": { title: "Rep Risk Profiles & Coaching", breadcrumb: "Reps" },
  "/clients": { title: "Client Health Scorecards", breadcrumb: "Clients" },
  "/case-study": { title: "Executive Architecture Case Study", breadcrumb: "Case Study" },
  "/portfolio": { title: "Executive Architecture Case Study", breadcrumb: "Portfolio" },
  "/audit": { title: "Audit & Compliance Trail", breadcrumb: "Audit" },
  "/settings": { title: "Settings & Scoring Weights", breadcrumb: "Settings" },
};

const SEARCHABLE_DEALS = [
  { id: "deal-101", name: "Orion Cloud Migration", client: "TechCorp Inc.", score: 23, band: "Critical", value: 150000, stage: "Proposal Sent", owner: "Sarah Miller" },
  { id: "deal-102", name: "Quantum Security Suite", client: "FinanceGo Ltd.", score: 31, band: "Critical", value: 280000, stage: "Negotiation", owner: "James Reynolds" },
  { id: "deal-103", name: "Horizon Data Platform", client: "RetailMax", score: 35, band: "Critical", value: 95000, stage: "Qualification", owner: "Lisa Chen" },
  { id: "deal-104", name: "Apex CRM Integration", client: "LogiPro Solutions", score: 62, band: "Moderate", value: 120000, stage: "Proposal Sent", owner: "Mike Torres" },
  { id: "deal-105", name: "Crown Global Enterprise", client: "LogiPro Solutions", score: 92, band: "Healthy", value: 400000, stage: "Contract", owner: "Mike Torres" },
  { id: "deal-106", name: "Nebula Analytics Engine", client: "HealthFirst Corp.", score: 44, band: "High", value: 210000, stage: "Discovery", owner: "Sarah Miller" },
];

export const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<DealData | null>(null);
  const [isNavigatingHome, setIsNavigatingHome] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredSearchDeals = SEARCHABLE_DEALS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageMeta = PAGE_TITLES[location.pathname] || {
    title: "DealSense Intelligence",
    breadcrumb: "Dashboard",
  };

  const handleSelectDealFromSearch = (deal: typeof SEARCHABLE_DEALS[0]) => {
    setSelectedDeal({
      id: deal.id,
      name: deal.name,
      client: deal.client,
      score: deal.score,
      band: deal.band as any,
      value: deal.value,
      stage: deal.stage,
      owner: deal.owner,
      closeDate: "Dec 15, 2026",
      daysInStage: 18,
      risks: ["Economic buyer silent for 14d", "Close date pushed 2x"],
      recommendation: "Auto-trigger executive alignment sequence to CFO.",
    });
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleNavigateHome = () => {
    setIsNavigatingHome(true);
    navigate("/");
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      {isNavigatingHome && (
        <LoadingScreen isLoading={isNavigatingHome} onFinish={() => setIsNavigatingHome(false)} />
      )}

      <TopBar
        title={pageMeta.title}
        breadcrumb={pageMeta.breadcrumb}
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateHome={handleNavigateHome}
      />

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Sidebar 
          onClose={() => setSidebarOpen(false)}
          onNavigateHome={handleNavigateHome}
        />
      </div>

      <main className="main-viewport">
        <div className="page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <Routes location={location}>
                <Route path="/" element={<PortfolioOverview />} />
                <Route path="/forecast" element={<RevenueForecast />} />
                <Route path="/deals" element={<DealExplorer />} />
                <Route path="/war-room" element={<DealWarRoom />} />
                <Route path="/heatmap" element={<RiskHeatmap />} />
                <Route path="/actions" element={<ActionQueue />} />
                <Route path="/map" element={<MutualActionPlan />} />
                <Route path="/battlecards" element={<CompetitiveIntelligence />} />
                <Route path="/playbooks" element={<RevOpsPlaybooks />} />
                <Route path="/hygiene" element={<CrmHygiene />} />
                <Route path="/reps" element={<RepPerformance />} />
                <Route path="/clients" element={<ClientHealth />} />
                <Route path="/case-study" element={<CaseStudy />} />
                <Route path="/portfolio" element={<CaseStudy />} />
                <Route path="/audit" element={<AuditLog />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(18, 69, 72, 0.4)",
                backdropFilter: "blur(4px)",
                zIndex: 300,
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                position: "fixed",
                top: "20%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                maxWidth: "540px",
                background: "#ffffff",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 310,
                overflow: "hidden",
                border: "1px solid var(--hs-border-dark)",
              }}
            >
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--hs-border-dark)", display: "flex", alignItems: "center", gap: 10 }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--hs-primary)" strokeWidth={2}>
                  <circle cx={11} cy={11} r={8} />
                  <line x1={21} y1={21} x2={16.65} y2={16.65} />
                </svg>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search deals, accounts, reps, or risk signals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    color: "var(--hs-text)",
                  }}
                />
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsSearchOpen(false)}
                  style={{ padding: "2px 8px" }}
                >
                  ESC
                </button>
              </div>

              <div style={{ maxHeight: "320px", overflowY: "auto", padding: "8px" }}>
                {filteredSearchDeals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => handleSelectDealFromSearch(deal)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hs-surface)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--hs-primary)", fontSize: "13.5px" }}>
                        {deal.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--hs-text-muted)" }}>
                        {deal.client} · Rep: {deal.owner} · ${(deal.value / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <span className="risk-pill" data-band={deal.band} style={{ fontSize: "10.5px" }}>
                      Score: {deal.score}
                    </span>
                  </div>
                ))}

                {filteredSearchDeals.length === 0 && (
                  <div style={{ textAlign: "center", padding: "24px", color: "var(--hs-text-muted)", fontSize: "13px" }}>
                    No matching pipeline records found.
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Global Deal Inspection Drawer ─────────────────────────────── */}
      <DealDrawer
        deal={selectedDeal}
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
      />

      {/* ── Mobile Bottom Navigation Bar ──────────────────────────────── */}
      <MobileBottomNav onOpenMenu={() => setSidebarOpen(true)} />
    </div>
  );
};
