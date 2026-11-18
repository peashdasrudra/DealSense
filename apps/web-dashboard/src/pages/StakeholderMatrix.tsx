/**
 * DealSense — Multi-Threading Stakeholder Power Matrix.
 * Premium Enterprise Edition.
 * Identifies single-threaded pipeline risks, unengaged CFOs, and buying committee gaps across active enterprise deals.
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalDeals, updateDeal, logAuditEvent, DealItem } from "../api";

export interface Stakeholder {
  id: string;
  name: string;
  title: string;
  role: "Economic Buyer" | "Champion" | "Technical Evaluator" | "Procurement / Legal" | "Blocker";
  sentiment: "Strong Advocate" | "Neutral" | "Skeptical / Blocker" | "Silent / Unengaged";
  lastTouch: string;
  email: string;
  influenceLevel: "High" | "Medium" | "Low";
}

export interface DealMultiThreading {
  id: string;
  dealName: string;
  client: string;
  value: number;
  stage: string;
  riskScore: number;
  coverageScore: number; // 0 to 100
  engagedCount: number;
  totalRequired: number;
  status: "Single-Threaded (Fragile)" | "Partial Coverage" | "Fully Multi-Threaded";
  stakeholders: Stakeholder[];
}

const ROLE_BADGES: Record<string, { bg: string; color: string; border: string }> = {
  "Economic Buyer": { bg: "rgba(45, 62, 80, 0.08)", color: "#2d3e50", border: "rgba(45, 62, 80, 0.25)" },
  "Champion": { bg: "rgba(0, 164, 189, 0.1)", color: "#007a8c", border: "rgba(0, 164, 189, 0.3)" },
  "Technical Evaluator": { bg: "rgba(124, 58, 237, 0.08)", color: "#6d28d9", border: "rgba(124, 58, 237, 0.25)" },
  "Procurement / Legal": { bg: "rgba(245, 158, 11, 0.1)", color: "#b45309", border: "rgba(245, 158, 11, 0.3)" },
  "Blocker": { bg: "rgba(239, 68, 68, 0.1)", color: "#b91c1c", border: "rgba(239, 68, 68, 0.3)" },
};

const SENTIMENT_STYLES: Record<string, { bg: string; color: string; border: string; icon: string }> = {
  "Strong Advocate": { bg: "rgba(0, 189, 165, 0.12)", color: "#007a70", border: "rgba(0, 189, 165, 0.35)", icon: "🟢" },
  "Neutral": { bg: "rgba(0, 164, 189, 0.1)", color: "#007a8c", border: "rgba(0, 164, 189, 0.25)", icon: "🔵" },
  "Skeptical / Blocker": { bg: "rgba(242, 84, 91, 0.12)", color: "#d93843", border: "rgba(242, 84, 91, 0.35)", icon: "🔴" },
  "Silent / Unengaged": { bg: "rgba(245, 194, 107, 0.18)", color: "#b76e00", border: "rgba(245, 194, 107, 0.4)", icon: "🟠" },
};

function computeCoverage(stakeholders: Stakeholder[]): {
  coverageScore: number;
  status: "Single-Threaded (Fragile)" | "Partial Coverage" | "Fully Multi-Threaded";
  engagedCount: number;
} {
  const total = Math.max(3, stakeholders.length);
  const engaged = stakeholders.filter((s) => s.sentiment === "Strong Advocate" || s.sentiment === "Neutral").length;
  const hasEB = stakeholders.some((s) => s.role === "Economic Buyer" && s.sentiment !== "Silent / Unengaged");
  const hasChampion = stakeholders.some((s) => s.role === "Champion" && s.sentiment === "Strong Advocate");

  let score = Math.round((engaged / total) * 65);
  if (hasEB) score += 20;
  if (hasChampion) score += 15;
  score = Math.min(100, Math.max(15, score));

  const status = score < 50 ? "Single-Threaded (Fragile)" : score < 80 ? "Partial Coverage" : "Fully Multi-Threaded";
  return { coverageScore: score, status, engagedCount: engaged };
}

function formatDealsForMatrix(deals: DealItem[]): DealMultiThreading[] {
  return deals.map((d) => {
    let rawContacts: any[] = (d.contacts as any[]) || [];
    if (rawContacts.length === 0) {
      rawContacts = [
        {
          id: `s-1-${d.id}`,
          name: "Marcus Vance",
          title: "VP Global Infrastructure",
          role: "Economic Buyer",
          sentiment: d.score < 50 ? "Silent / Unengaged" : "Strong Advocate",
          lastContacted: d.score < 50 ? "18 days ago" : "Today",
          email: `m.vance@${d.client.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
          influenceLevel: "High",
        },
        {
          id: `s-2-${d.id}`,
          name: "Elena Rostova",
          title: "Head of Cloud SecOps",
          role: "Champion",
          sentiment: "Strong Advocate",
          lastContacted: "Yesterday",
          email: `e.rostova@${d.client.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
          influenceLevel: "High",
        },
        {
          id: `s-3-${d.id}`,
          name: "Julian Thorne",
          title: "General Counsel & Procurement",
          role: "Procurement / Legal",
          sentiment: d.score < 60 ? "Neutral" : "Strong Advocate",
          lastContacted: "2 days ago",
          email: `j.thorne@${d.client.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
          influenceLevel: "Medium",
        },
      ];
    }

    const stakeholders: Stakeholder[] = rawContacts.map((c: any, i: number) => ({
      id: c.id || `s-${d.id}-${i}`,
      name: c.name || "Enterprise Contact",
      title: c.title || (c.role === "Economic Buyer" ? "Chief Financial Officer" : "VP Infrastructure"),
      role: (c.role as any) || (i === 0 ? "Economic Buyer" : i === 1 ? "Champion" : "Technical Evaluator"),
      sentiment: (c.sentiment as any) || (d.score >= 80 ? "Strong Advocate" : d.score < 50 ? "Silent / Unengaged" : "Neutral"),
      lastTouch: c.lastContacted || c.lastTouch || d.lastTouch || "Today",
      email: c.email || `contact@${d.client.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      influenceLevel: (c.influenceLevel as any) || (i === 0 ? "High" : i === 1 ? "High" : "Medium"),
    }));

    const { coverageScore, status, engagedCount } = computeCoverage(stakeholders);

    return {
      id: d.id,
      dealName: d.name,
      client: d.client,
      value: d.value,
      stage: d.stage,
      riskScore: d.score,
      coverageScore,
      engagedCount,
      totalRequired: 4,
      status,
      stakeholders,
    };
  });
}

export const StakeholderMatrix: React.FC = () => {
  const [deals, setDeals] = useState<DealMultiThreading[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Single-Threaded" | "Multi-Threaded">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [outreachAlert, setOutreachAlert] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newContact, setNewContact] = useState({
    name: "",
    title: "",
    role: "Technical Evaluator" as Stakeholder["role"],
    sentiment: "Neutral" as Stakeholder["sentiment"],
    email: "",
    influenceLevel: "Medium" as Stakeholder["influenceLevel"],
  });

  const loadMatrix = () => {
    const localDeals = getLocalDeals();
    const formatted = formatDealsForMatrix(localDeals);
    setDeals(formatted);
    if (!selectedDealId && formatted.length > 0) {
      setSelectedDealId(formatted[0].id);
    }
  };

  useEffect(() => {
    loadMatrix();
    const handleUpdate = () => loadMatrix();
    window.addEventListener("dealsense:deals-updated", handleUpdate);
    return () => window.removeEventListener("dealsense:deals-updated", handleUpdate);
  }, []);

  const selectedDeal = useMemo(
    () => deals.find((d) => d.id === selectedDealId) || deals[0],
    [deals, selectedDealId]
  );

  const singleThreadedDeals = useMemo(() => deals.filter((d) => d.status.includes("Single-Threaded")), [deals]);
  const singleThreadedCount = singleThreadedDeals.length;
  const singleThreadedARR = useMemo(() => singleThreadedDeals.reduce((sum, d) => sum + d.value, 0), [singleThreadedDeals]);

  const avgStakeholders = useMemo(() => {
    if (deals.length === 0) return "3.2";
    return (deals.reduce((s, d) => s + d.stakeholders.length, 0) / deals.length).toFixed(1);
  }, [deals]);

  const filteredDeals = useMemo(() => {
    return deals.filter((d) => {
      const matchSearch =
        d.dealName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.client.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
      if (activeFilter === "Single-Threaded") return d.status.includes("Single-Threaded");
      if (activeFilter === "Multi-Threaded") return d.status.includes("Fully");
      return true;
    });
  }, [deals, searchQuery, activeFilter]);

  const handleTriggerOutreach = (stakeholder: Stakeholder) => {
    if (!selectedDeal) return;
    const updatedStakeholders = selectedDeal.stakeholders.map((s) =>
      s.id === stakeholder.id
        ? { ...s, lastTouch: "Just now", sentiment: s.sentiment === "Silent / Unengaged" ? ("Neutral" as const) : s.sentiment }
        : s
    );

    updateDeal(selectedDeal.id, { contacts: updatedStakeholders as any });
    logAuditEvent({
      actor: "Peash Rudra",
      role: "Enterprise AE Lead",
      actionType: "HubSpot Sequence Write-Back",
      targetObject: `Deal #${selectedDeal.id} (${stakeholder.name})`,
      tier: "Tier 2 (Assisted Task)",
      status: "Success",
      details: `Dispatched peer-to-peer executive outreach sequence to ${stakeholder.name} (${stakeholder.title}) via HubSpot Sequence integration.`,
    });

    setOutreachAlert(`✓ Executive peer-to-peer sequence dispatched to ${stakeholder.name} (${stakeholder.title}) via HubSpot Sequence integration.`);
    setTimeout(() => setOutreachAlert(null), 3800);
  };

  const handleChangeSentiment = (stakeholderId: string, newSentiment: Stakeholder["sentiment"]) => {
    if (!selectedDeal) return;
    const updatedStakeholders = selectedDeal.stakeholders.map((s) =>
      s.id === stakeholderId ? { ...s, sentiment: newSentiment } : s
    );

    updateDeal(selectedDeal.id, { contacts: updatedStakeholders as any });
    logAuditEvent({
      actor: "Peash Rudra",
      role: "VP Sales Ops",
      actionType: "Stakeholder Sentiment Update",
      targetObject: `Deal #${selectedDeal.id}`,
      tier: "Tier 1 (Continuous Telemetry)",
      status: "Success",
      details: `Updated stakeholder sentiment for contact ID ${stakeholderId} to "${newSentiment}". Recomputed buying committee coverage score.`,
    });

    setOutreachAlert(`✓ Updated stakeholder sentiment to "${newSentiment}". Buying committee score re-analyzed.`);
    setTimeout(() => setOutreachAlert(null), 3200);
  };

  const handleDeleteContact = (stakeholderId: string) => {
    if (!selectedDeal) return;
    const updatedStakeholders = selectedDeal.stakeholders.filter((s) => s.id !== stakeholderId);
    updateDeal(selectedDeal.id, { contacts: updatedStakeholders as any });
    logAuditEvent({
      actor: "Peash Rudra",
      role: "VP Sales Ops",
      actionType: "Stakeholder Contact Removed",
      targetObject: `Deal #${selectedDeal.id}`,
      tier: "Tier 2 (Assisted Task)",
      status: "Success",
      details: `Removed contact ID ${stakeholderId} from ${selectedDeal.dealName} buying committee map.`,
    });
    setOutreachAlert(`✓ Contact removed from ${selectedDeal.dealName}.`);
    setTimeout(() => setOutreachAlert(null), 3000);
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal || !newContact.name.trim()) return;

    const contactToAdd: Stakeholder = {
      id: `s-${Date.now()}`,
      name: newContact.name.trim(),
      title: newContact.title.trim() || "Enterprise Decision Stakeholder",
      role: newContact.role,
      sentiment: newContact.sentiment,
      email: newContact.email.trim() || `contact@${selectedDeal.client.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      influenceLevel: newContact.influenceLevel,
      lastTouch: "Just added",
    };

    const updatedStakeholders = [...selectedDeal.stakeholders, contactToAdd];
    updateDeal(selectedDeal.id, { contacts: updatedStakeholders as any });
    logAuditEvent({
      actor: "Peash Rudra",
      role: "Enterprise AE Lead",
      actionType: "Stakeholder Graph Ingestion",
      targetObject: `Deal #${selectedDeal.id} (${contactToAdd.name})`,
      tier: "Tier 2 (Assisted Task)",
      status: "Success",
      details: `Added new stakeholder contact ${contactToAdd.name} (${contactToAdd.title} - ${contactToAdd.role}) to ${selectedDeal.dealName}.`,
    });

    setShowAddModal(false);
    setNewContact({
      name: "",
      title: "",
      role: "Technical Evaluator",
      sentiment: "Neutral",
      email: "",
      influenceLevel: "Medium",
    });

    setOutreachAlert(`✓ Added ${contactToAdd.name} (${contactToAdd.role}) to ${selectedDeal.dealName} buying committee.`);
    setTimeout(() => setOutreachAlert(null), 3500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Standardized Header ───────────────────────────────────────── */}
      <div className="page-header-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="page-header-badge-row">
              <span className="page-header-badge" style={{ background: "rgba(255, 92, 53, 0.08)", color: "#ff5c35", borderColor: "rgba(255, 92, 53, 0.25)" }}>
                ● STAKEHOLDER MULTI-THREADING ENGINE
              </span>
            </div>
            <h2 className="page-header-title">
              Multi-Threading &amp; Stakeholder Power Matrix
            </h2>
            <p className="page-header-desc">
              Map buying committees across active enterprise opportunities. Detect single-threaded deals, unblock silent CFOs, and trigger peer-to-peer executive outreach.
            </p>
          </div>

          <div className="page-header-actions">
            <div style={{ display: "flex", gap: 4, background: "var(--hs-surface-hover)", padding: 3, borderRadius: "var(--radius-sm)", border: "1px solid var(--hs-border-dark)" }}>
              {(["All", "Single-Threaded", "Multi-Threaded"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    border: "none",
                    background: activeFilter === f ? "#ff5c35" : "transparent",
                    color: activeFilter === f ? "#ffffff" : "var(--hs-text)",
                    fontSize: "11.5px",
                    fontWeight: activeFilter === f ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {outreachAlert && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 12,
              padding: "8px 14px",
              background: "rgba(0, 189, 165, 0.12)",
              border: "1px solid rgba(0, 189, 165, 0.3)",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              fontWeight: 600,
              color: "#007a70",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{outreachAlert}</span>
          </motion.div>
        )}
      </div>

      {/* ── Premium Enterprise KPI Grid ────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <div
          className="kpi-card"
          style={{
            background: "#ffffff",
            padding: "16px 18px",
            borderRadius: "8px",
            border: "1px solid var(--hs-border-dark)",
            borderTop: "3px solid #d93843",
            boxShadow: "var(--shadow-sm)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Single-Threaded Deals
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(217, 56, 67, 0.1)", color: "#d93843", padding: "2px 6px", borderRadius: 4 }}>
              RISK ALERT
            </span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#d93843", fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}>
            {singleThreadedCount} Deals
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#d93843", fontWeight: 700 }}>▲ Missing</span> Economic Buyer coverage
          </div>
        </div>

        <div
          className="kpi-card"
          style={{
            background: "#ffffff",
            padding: "16px 18px",
            borderRadius: "8px",
            border: "1px solid var(--hs-border-dark)",
            borderTop: "3px solid #ff5c35",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Single-Threaded ARR Exposure
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(255, 92, 53, 0.1)", color: "#ff5c35", padding: "2px 6px", borderRadius: 4 }}>
              AT STAKE
            </span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#2d3e50", fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}>
            ${(singleThreadedARR / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Resting on 1 single champion contact
          </div>
        </div>

        <div
          className="kpi-card"
          style={{
            background: "#ffffff",
            padding: "16px 18px",
            borderRadius: "8px",
            border: "1px solid var(--hs-border-dark)",
            borderTop: "3px solid #00a4bd",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Avg Multi-Threaded Win Rate
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(0, 164, 189, 0.1)", color: "#007a8c", padding: "2px 6px", borderRadius: 4 }}>
              +48.2%
            </span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#007a8c", fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}>
            76.4%
          </div>
          <div style={{ fontSize: "11.5px", color: "#007a8c", marginTop: 4, fontWeight: 600 }}>
            ▲ +48pts higher vs single-threaded deals
          </div>
        </div>

        <div
          className="kpi-card"
          style={{
            background: "#ffffff",
            padding: "16px 18px",
            borderRadius: "8px",
            border: "1px solid var(--hs-border-dark)",
            borderTop: "3px solid #007a70",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Avg Stakeholders Engaged
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(0, 122, 112, 0.1)", color: "#007a70", padding: "2px 6px", borderRadius: 4 }}>
              BENCHMARK 3.8
            </span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#007a70", fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}>
            {avgStakeholders} <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--hs-text-muted)" }}>/ Deal</span>
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", marginTop: 4 }}>
            Enterprise benchmark is 3.8 contacts
          </div>
        </div>
      </div>

      {/* ── 2-Column Command Workspace ───────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 380px) 1fr", gap: 16, alignItems: "start" }}>
        
        {/* Left Column: Opportunities Under Review */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "8px",
            border: "1px solid var(--hs-border-dark)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Card Header & Search */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--hs-border-dark)", background: "#ffffff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
                  Opportunities Under Review ({filteredDeals.length})
                </h3>
                <span style={{ fontSize: "11px", color: "var(--hs-text-muted)" }}>
                  Select deal to inspect buying committee
                </span>
              </div>
            </div>

            {/* Search Input */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by deal or account..."
                style={{
                  width: "100%",
                  padding: "6px 10px 6px 30px",
                  fontSize: "12px",
                  border: "1px solid var(--hs-border-dark)",
                  borderRadius: "6px",
                  background: "var(--hs-background)",
                  outline: "none",
                }}
              />
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--hs-text-muted)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: "absolute", left: 9, top: 9 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          {/* Deal List Scroll View */}
          <div style={{ maxHeight: "620px", overflowY: "auto", padding: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filteredDeals.map((deal) => {
                const isSelected = selectedDeal?.id === deal.id;
                const isSingle = deal.status.includes("Single-Threaded");
                const isFull = deal.status.includes("Fully");

                return (
                  <motion.div
                    key={deal.id}
                    onClick={() => setSelectedDealId(deal.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "6px",
                      border: isSelected ? "2px solid #ff5c35" : "1px solid var(--hs-border)",
                      background: isSelected ? "#fffaf8" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: isSelected ? "0 2px 8px rgba(255, 92, 53, 0.12)" : "none",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: "13px", color: isSelected ? "#ff5c35" : "var(--hs-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {deal.dealName}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                          {deal.client} · <span style={{ textTransform: "capitalize" }}>{deal.stage}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--hs-heading)", fontFamily: "var(--font-mono)" }}>
                          ${(deal.value / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Badges */}
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10.5px", marginBottom: 4 }}>
                        <span style={{ color: "var(--hs-text-muted)", fontWeight: 600 }}>
                          Committee: <strong>{deal.engagedCount}/{deal.stakeholders.length} Engaged</strong>
                        </span>
                        <span
                          style={{
                            fontWeight: 800,
                            color: isSingle ? "#d93843" : isFull ? "#007a70" : "#b76e00",
                          }}
                        >
                          ● {isSingle ? "Single-Threaded" : isFull ? "Fully Multi-Threaded" : "Partial Coverage"}
                        </span>
                      </div>

                      {/* Mini Bar */}
                      <div style={{ width: "100%", height: 4, background: "#eaf0f6", borderRadius: 2, overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${deal.coverageScore}%`,
                            background: isSingle ? "#d93843" : isFull ? "#00a4bd" : "#ff9900",
                            borderRadius: 2,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Buying Committee Org & Power Matrix */}
        {selectedDeal ? (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "8px",
              border: "1px solid var(--hs-border-dark)",
              boxShadow: "var(--shadow-sm)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--hs-border-dark)",
                background: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--hs-text-muted)", textTransform: "uppercase" }}>
                    Buying Committee Map
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--hs-border-dark)" }}>•</span>
                  <span style={{ fontSize: "11.5px", color: "var(--hs-text-muted)", fontWeight: 600 }}>
                    {selectedDeal.client}
                  </span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--hs-heading)", margin: 0 }}>
                  {selectedDeal.dealName}
                </h3>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {/* Coverage Pill */}
                <div
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    background: selectedDeal.coverageScore >= 80 ? "rgba(0, 189, 165, 0.1)" : "rgba(242, 84, 91, 0.1)",
                    border: `1px solid ${selectedDeal.coverageScore >= 80 ? "rgba(0, 189, 165, 0.3)" : "rgba(242, 84, 91, 0.3)"}`,
                    color: selectedDeal.coverageScore >= 80 ? "#007a70" : "#d93843",
                    fontSize: "11.5px",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: selectedDeal.coverageScore >= 80 ? "#007a70" : "#d93843" }} />
                  {selectedDeal.coverageScore}% Coverage
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  style={{
                    padding: "6px 14px",
                    background: "#ff5c35",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(255, 92, 53, 0.25)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>+ Add Stakeholder</span>
                </button>
              </div>
            </div>

            {/* Prescriptive Diagnostic Strip */}
            <div
              style={{
                padding: "10px 18px",
                background: "rgba(0, 164, 189, 0.06)",
                borderBottom: "1px solid rgba(0, 164, 189, 0.18)",
                fontSize: "12px",
                color: "#007a8c",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>💡</span>
              <span>
                <strong>AI Multi-Threading Telemetry:</strong>{" "}
                {selectedDeal.coverageScore >= 80
                  ? "Buying committee is fully engaged across Economic Buyer, Champion, and Legal. Win probability is safeguarded (+48pts)."
                  : "Critical coverage gap: Economic Buyer engagement is unverified or silent. Dispatch executive peer-to-peer sequence immediately."}
              </span>
            </div>

            {/* Stakeholder Cards Container */}
            <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedDeal.stakeholders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--hs-text-muted)" }}>
                  <div style={{ fontSize: "28px", marginBottom: 8 }}>👥</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--hs-heading)" }}>
                    No Buying Committee Members Mapped
                  </div>
                  <p style={{ fontSize: "12px", maxWidth: 360, margin: "4px auto 14px" }}>
                    Single-threaded deals carry a 64% higher slippage rate. Click below to add key enterprise decision makers.
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary btn-sm"
                    style={{ background: "#ff5c35", fontWeight: 700 }}
                  >
                    + Add First Stakeholder
                  </button>
                </div>
              ) : (
                selectedDeal.stakeholders.map((s) => {
                  const roleStyle = ROLE_BADGES[s.role] || { bg: "#f1f4f8", color: "#33475b", border: "#cbd6e2" };
                  const sentimentStyle = SENTIMENT_STYLES[s.sentiment] || { bg: "#f1f4f8", color: "#33475b", border: "#cbd6e2", icon: "⚪" };
                  const isSilent = s.sentiment.includes("Silent");
                  const isBlocker = s.sentiment.includes("Blocker");

                  // Visual initials
                  const initials = s.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "8px",
                        border: isSilent || isBlocker ? "1px solid rgba(217, 56, 67, 0.3)" : "1px solid var(--hs-border-dark)",
                        background: isSilent || isBlocker ? "#fff9f8" : "#ffffff",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 12,
                        transition: "all 0.15s ease",
                      }}
                    >
                      {/* Left: Avatar + Details */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 260 }}>
                        {/* Avatar Initials Pill */}
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: s.role === "Economic Buyer" ? "#2d3e50" : s.role === "Champion" ? "#00a4bd" : "#7c3aed",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "13px",
                            flexShrink: 0,
                            position: "relative",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {initials}
                          <span
                            style={{
                              position: "absolute",
                              bottom: -1,
                              right: -1,
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: isSilent ? "#b76e00" : isBlocker ? "#d93843" : "#00a38d",
                              border: "2px solid #ffffff",
                            }}
                          />
                        </div>

                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--hs-heading)" }}>
                              {s.name}
                            </span>
                            <span
                              style={{
                                background: roleStyle.bg,
                                color: roleStyle.color,
                                border: `1px solid ${roleStyle.border}`,
                                padding: "2px 7px",
                                borderRadius: "4px",
                                fontSize: "9.5px",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {s.role}
                            </span>
                          </div>

                          <div style={{ fontSize: "12px", color: "var(--hs-text-muted)", marginTop: 2 }}>
                            {s.title} · <span style={{ color: "var(--hs-primary)" }}>{s.email}</span>
                          </div>

                          {/* Meta line: Touch date & Influence */}
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, fontSize: "11px", color: "var(--hs-text-muted)" }}>
                            <span>
                              Last touch: <strong style={{ color: isSilent ? "#d93843" : "var(--hs-heading)" }}>{s.lastTouch}</strong>
                            </span>
                            <span>•</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                              Influence:
                              <span style={{ display: "inline-flex", gap: 2, marginLeft: 2 }}>
                                <span style={{ width: 4, height: 10, borderRadius: 1, background: "#00a4bd" }} />
                                <span style={{ width: 4, height: 10, borderRadius: 1, background: s.influenceLevel === "Low" ? "#cbd6e2" : "#00a4bd" }} />
                                <span style={{ width: 4, height: 10, borderRadius: 1, background: s.influenceLevel === "High" ? "#00a4bd" : "#cbd6e2" }} />
                              </span>
                              <strong style={{ color: "var(--hs-heading)", marginLeft: 2 }}>{s.influenceLevel}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Interactive Sentiment Pill & Actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        {/* Sentiment Selector */}
                        <div style={{ position: "relative" }}>
                          <select
                            value={s.sentiment}
                            onChange={(e) => handleChangeSentiment(s.id, e.target.value as any)}
                            style={{
                              appearance: "none",
                              padding: "6px 26px 6px 10px",
                              fontSize: "11.5px",
                              fontWeight: 700,
                              borderRadius: "6px",
                              border: `1px solid ${sentimentStyle.border}`,
                              background: sentimentStyle.bg,
                              color: sentimentStyle.color,
                              cursor: "pointer",
                              outline: "none",
                            }}
                          >
                            <option value="Strong Advocate">🟢 Strong Advocate</option>
                            <option value="Neutral">🔵 Neutral</option>
                            <option value="Skeptical / Blocker">🔴 Skeptical / Blocker</option>
                            <option value="Silent / Unengaged">🟠 Silent / Unengaged</option>
                          </select>
                          <span style={{ position: "absolute", right: 8, top: 7, pointerEvents: "none", fontSize: "9px", color: sentimentStyle.color }}>
                            ▼
                          </span>
                        </div>

                        {/* 1-Click Peer-to-Peer Sequence Dispatch */}
                        {(isSilent || isBlocker || s.role === "Economic Buyer") && (
                          <button
                            onClick={() => handleTriggerOutreach(s)}
                            title="Dispatch automated HubSpot peer-to-peer executive outreach sequence"
                            style={{
                              padding: "6px 12px",
                              background: "#ff5c35",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "11.5px",
                              fontWeight: 700,
                              cursor: "pointer",
                              boxShadow: "0 2px 6px rgba(255, 92, 53, 0.25)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <span>⚡ Sequence</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteContact(s.id)}
                          title="Remove contact from buying committee"
                          style={{
                            background: "transparent",
                            border: "1px solid var(--hs-border-dark)",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            padding: "6px 8px",
                            color: "var(--hs-text-muted)",
                            transition: "all 0.15s ease",
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Add Stakeholder Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(45, 62, 80, 0.45)", zIndex: 400, backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 10 }}
              style={{
                position: "fixed",
                top: "14%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                maxWidth: "520px",
                background: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0 20px 40px rgba(45, 62, 80, 0.25)",
                zIndex: 410,
                overflow: "hidden",
                border: "1px solid var(--hs-border-dark)",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  background: "#ffffff",
                  borderBottom: "1px solid var(--hs-border-dark)",
                  borderTop: "3px solid #ff5c35",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: "16px", color: "var(--hs-heading)" }}>
                    Add Stakeholder Contact
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--hs-text-muted)" }}>
                    Associated Deal: {selectedDeal?.dealName}
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--hs-text-muted)" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddContactSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 4 }}>
                    Contact Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Richard Vance"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", fontSize: "12.5px", border: "1px solid var(--hs-border-dark)", borderRadius: "6px" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 4 }}>
                    Job Title / Organizational Position
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Financial Officer or VP Engineering"
                    value={newContact.title}
                    onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", fontSize: "12.5px", border: "1px solid var(--hs-border-dark)", borderRadius: "6px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 4 }}>
                      Committee Role
                    </label>
                    <select
                      value={newContact.role}
                      onChange={(e) => setNewContact({ ...newContact, role: e.target.value as any })}
                      style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid var(--hs-border-dark)", borderRadius: "6px" }}
                    >
                      <option value="Economic Buyer">Economic Buyer</option>
                      <option value="Champion">Champion</option>
                      <option value="Technical Evaluator">Technical Evaluator</option>
                      <option value="Procurement / Legal">Procurement / Legal</option>
                      <option value="Blocker">Blocker</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 4 }}>
                      Initial Sentiment
                    </label>
                    <select
                      value={newContact.sentiment}
                      onChange={(e) => setNewContact({ ...newContact, sentiment: e.target.value as any })}
                      style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid var(--hs-border-dark)", borderRadius: "6px" }}
                    >
                      <option value="Strong Advocate">🟢 Strong Advocate</option>
                      <option value="Neutral">🔵 Neutral</option>
                      <option value="Skeptical / Blocker">🔴 Skeptical / Blocker</option>
                      <option value="Silent / Unengaged">🟠 Silent / Unengaged</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 4 }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", fontSize: "12.5px", border: "1px solid var(--hs-border-dark)", borderRadius: "6px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--hs-primary)", display: "block", marginBottom: 4 }}>
                      Influence Level
                    </label>
                    <select
                      value={newContact.influenceLevel}
                      onChange={(e) => setNewContact({ ...newContact, influenceLevel: e.target.value as any })}
                      style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid var(--hs-border-dark)", borderRadius: "6px" }}
                    >
                      <option value="High">High (Final Sign-off)</option>
                      <option value="Medium">Medium (Evaluator)</option>
                      <option value="Low">Low (Individual User)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{
                      padding: "8px 16px",
                      background: "#ffffff",
                      border: "1px solid var(--hs-border-dark)",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: "8px 20px",
                      background: "#ff5c35",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(255, 92, 53, 0.25)",
                    }}
                  >
                    Add to Committee
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
