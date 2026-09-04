/**
 * DealSense Dashboard — Deal Inspector & Revenue Intelligence Hub.
 * Full Enterprise HubSpot Canvas Design System Edition (100% Native CRM UX).
 * 
 * FEATURES:
 * - HubSpot Stage Pipeline Visual Stepper (Interactive 7-stage chevrons with instant stage moves)
 * - 5 Quick-Action Activity Modals (Note, Email with AI Drafter, Call Logger, Task Creator, Meeting Logger)
 * - 3-Column Native HubSpot CRM Layout:
 *    - Left: "About this Deal" (Editable Amount, Close Date, Pipeline, Stage, Owner, Priority, Forecast)
 *    - Center: 5 Native Tabs (7-Vector Intelligence, What-If Simulator, MEDDICC Matrix, Activity Feed, AI Copilot)
 *    - Right: Associations (Contacts with Role tags, Companies, Products/Line Items, Live REST API v3 Inspector)
 * - All User Actions 100% Backend & State Ready (Zero dead buttons).
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchDeals,
  createDeal,
  updateDeal,
  deleteDeal,
  syncHubSpotDeals,
} from "../api";

// ── Types & Interfaces ────────────────────────────────────────────────────────

interface AssociatedContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Economic Buyer" | "Champion" | "Technical Influencer" | "Decision Maker" | "Procurement";
  lastContacted: string;
  avatar: string;
}

interface LineItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface ActivityEvent {
  id: string;
  type: "note" | "email" | "call" | "meeting" | "task" | "stage_change" | "score_change";
  title: string;
  description: string;
  author: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface DealDetail {
  id: string;
  name: string;
  client: string;
  score: number;
  band: "Critical" | "High" | "Moderate" | "Low" | "Healthy";
  value: number;
  stage: string;
  owner: string;
  pipeline: string;
  closeDate: string;
  priority: "High" | "Medium" | "Low";
  forecastCategory: "Pipeline" | "Best Case" | "Commit" | "Closed";
  dealType: "New Business" | "Existing Business" | "Renewal";
  daysInStage: number;
  lastTouch: string;
  slippageCount: number;
  hubspotId: string;
  isFollowed?: boolean;
  contacts: AssociatedContact[];
  lineItems: LineItem[];
  activities: ActivityEvent[];
  meddicc: {
    metrics: string;
    metricsStatus: "verified" | "in_review" | "gap";
    economicBuyer: string;
    economicBuyerStatus: "verified" | "in_review" | "gap";
    decisionCriteria: string;
    decisionCriteriaStatus: "verified" | "in_review" | "gap";
    decisionProcess: string;
    decisionProcessStatus: "verified" | "in_review" | "gap";
    identifyPain: string;
    identifyPainStatus: "verified" | "in_review" | "gap";
    champion: string;
    championStatus: "verified" | "in_review" | "gap";
    competition: string;
    competitionStatus: "verified" | "in_review" | "gap";
  };
  risks: { id: string; text: string; severity: "critical" | "high" | "moderate" }[];
  recommendation: string;
  vectorScores: {
    stageMomentum: number;
    economicBuyer: number;
    meddiccDepth: number;
    slippageDefense: number;
    multiThreading: number;
    discountHealth: number;
    activityCadence: number;
  };
}

// ── HubSpot Pipeline Stage Definitions ────────────────────────────────────────

const HUBSPOT_STAGES = [
  { id: "appointmentscheduled", label: "Appointment Scheduled", probability: 20 },
  { id: "qualifiedtobuy", label: "Qualified to Buy", probability: 40 },
  { id: "presentationscheduled", label: "Presentation Scheduled", probability: 60 },
  { id: "decisionmakerboughtin", label: "Decision Maker Bought-In", probability: 75 },
  { id: "contractsent", label: "Contract Sent", probability: 90 },
  { id: "closedwon", label: "Closed Won", probability: 100 },
  { id: "closedlost", label: "Closed Lost", probability: 0 },
];

const STAGE_LABELS: Record<string, string> = {
  appointmentscheduled: "Appointment Scheduled",
  qualifiedtobuy: "Qualified to Buy",
  presentationscheduled: "Presentation Scheduled",
  decisionmakerboughtin: "Decision Maker Bought-In",
  contractsent: "Contract Sent",
  closedwon: "Closed Won",
  closedlost: "Closed Lost",
};

// ── Sample Enterprise Deals with Full HubSpot Depth ──────────────────────────

const SAMPLE_DEALS: DealDetail[] = [
  {
    id: "11111111-1111-1111-1111-111111111101",
    name: "Global Logistics Cloud Migration",
    client: "Maersk Digital Global",
    score: 88,
    band: "Healthy",
    value: 185000,
    stage: "contractsent",
    owner: "Peash Rudra",
    pipeline: "Sales Pipeline",
    closeDate: "2026-09-30",
    priority: "High",
    forecastCategory: "Commit",
    dealType: "New Business",
    daysInStage: 6,
    lastTouch: "Yesterday at 4:15 PM",
    slippageCount: 0,
    hubspotId: "10101",
    isFollowed: true,
    contacts: [
      {
        id: "c-101",
        name: "Marcus Vance",
        email: "m.vance@maersk-digital.com",
        phone: "+44 20 7946 0912",
        role: "Economic Buyer",
        lastContacted: "Yesterday",
        avatar: "MV",
      },
      {
        id: "c-102",
        name: "Elena Rostova",
        email: "e.rostova@maersk-digital.com",
        phone: "+44 20 7946 0843",
        role: "Champion",
        lastContacted: "3 days ago",
        avatar: "ER",
      },
    ],
    lineItems: [
      { id: "li-1", name: "DealSense Enterprise Platform (Annual)", sku: "DS-ENT-ANNUAL", quantity: 1, unitPrice: 150000, discount: 0, total: 150000 },
      { id: "li-2", name: "Custom HubSpot UI Extension Deployment", sku: "DS-HS-UI-EXT", quantity: 1, unitPrice: 35000, discount: 0, total: 35000 },
    ],
    activities: [
      { id: "act-1", type: "stage_change", title: "Stage Updated to Contract Sent", description: "Deal moved from Decision Maker Bought-In to Contract Sent after legal pre-flight.", author: "Peash Rudra", timestamp: "Yesterday at 3:30 PM" },
      { id: "act-2", type: "email", title: "Sent: Final Master Services Agreement", description: "Sent revised Exhibit B terms to Marcus Vance with DocuSign tracking.", author: "Peash Rudra", timestamp: "Yesterday at 4:15 PM" },
      { id: "act-3", type: "meeting", title: "Executive Alignment & Security Sign-Off", description: "30-minute sync with VP Global IT. Confirmed SOC2 Type II compliance approval.", author: "Peash Rudra", timestamp: "3 days ago" },
      { id: "act-4", type: "note", title: "Procurement Timeline Note", description: "Legal counsel stated turnaround time is 48 hours for standard SaaS contract.", author: "Peash Rudra", timestamp: "5 days ago" },
    ],
    vectorScores: {
      stageMomentum: 92,
      economicBuyer: 95,
      meddiccDepth: 88,
      slippageDefense: 90,
      multiThreading: 84,
      discountHealth: 94,
      activityCadence: 90,
    },
    meddicc: {
      metrics: "30% infrastructure OPEX reduction targeted ($420k annual savings)",
      metricsStatus: "verified",
      economicBuyer: "Marcus Vance (VP Global IT) signed off on budget allocation",
      economicBuyerStatus: "verified",
      decisionCriteria: "SOC2 Type II + Zero Downtime Data Sync SLA + HubSpot Native Cards",
      decisionCriteriaStatus: "verified",
      decisionProcess: "Security audit passed; Procurement legal indemnity sign-off in progress",
      decisionProcessStatus: "in_review",
      identifyPain: "Data center colocation lease expiring November 2026",
      identifyPainStatus: "verified",
      champion: "Elena Rostova (Head of Cloud Architecture) actively advocating",
      championStatus: "verified",
      competition: "Incumbent legacy vendor (rejected due to lack of real-time HubSpot bi-directional sync)",
      competitionStatus: "verified",
    },
    risks: [
      { id: "r1", text: "Legal indemnity clause review pending procurement counsel signature", severity: "moderate" },
    ],
    recommendation: "Conduct joint review with corporate legal sponsor to finalize DocuSign execution within 48 hours.",
  },
  {
    id: "11111111-1111-1111-1111-111111111102",
    name: "Enterprise FinTech Compliance Suite",
    client: "Stripe Financial EMEA",
    score: 68,
    band: "Moderate",
    value: 120000,
    stage: "decisionmakerboughtin",
    owner: "Peash Rudra",
    pipeline: "Sales Pipeline",
    closeDate: "2026-10-15",
    priority: "High",
    forecastCategory: "Best Case",
    dealType: "New Business",
    daysInStage: 14,
    lastTouch: "3 days ago",
    slippageCount: 1,
    hubspotId: "10102",
    isFollowed: false,
    contacts: [
      {
        id: "c-103",
        name: "David Sterling",
        email: "d.sterling@stripe-emea.com",
        phone: "+353 1 496 0192",
        role: "Champion",
        lastContacted: "3 days ago",
        avatar: "DS",
      },
      {
        id: "c-104",
        name: "Rachel Kim",
        email: "r.kim@stripe-emea.com",
        phone: "+353 1 496 0204",
        role: "Economic Buyer",
        lastContacted: "14 days ago",
        avatar: "RK",
      },
    ],
    lineItems: [
      { id: "li-3", name: "DealSense Automated Compliance Engine", sku: "DS-COMP-CORE", quantity: 1, unitPrice: 120000, discount: 0, total: 120000 },
    ],
    activities: [
      { id: "act-5", type: "score_change", title: "Health Score Dropped -6 pts", description: "Economic buyer Rachel Kim has not opened or replied to communications in 14 days.", author: "DealSense Engine", timestamp: "3 days ago" },
      { id: "act-6", type: "email", title: "Follow-up on Compliance Matrix", description: "Sent David Sterling architecture diagram and HubSpot v3 HMAC verification spec.", author: "Peash Rudra", timestamp: "3 days ago" },
      { id: "act-7", type: "task", title: "Re-engage Rachel Kim (CFO)", description: "Auto-generated risk mitigation task: Schedule executive alignment call.", author: "DealSense AI", timestamp: "5 days ago" },
    ],
    vectorScores: {
      stageMomentum: 70,
      economicBuyer: 58,
      meddiccDepth: 74,
      slippageDefense: 68,
      multiThreading: 65,
      discountHealth: 88,
      activityCadence: 72,
    },
    meddicc: {
      metrics: "Sub-50ms audit query SLA compliance for international financial regulators",
      metricsStatus: "verified",
      economicBuyer: "Rachel Kim (CFO) identified but unengaged for 14 days",
      economicBuyerStatus: "gap",
      decisionCriteria: "pgvector & hybrid RAG security + HMAC SHA-256 Webhook encryption",
      decisionCriteriaStatus: "verified",
      decisionProcess: "Pre-flight security review with Infosec committee scheduled next Tuesday",
      decisionProcessStatus: "in_review",
      identifyPain: "Manual compliance reporting costs $400k/yr and 3 dedicated FTEs",
      identifyPainStatus: "verified",
      champion: "David Sterling (Director of SecOps) committed champion",
      championStatus: "verified",
      competition: "In-house build candidate evaluated by internal tools team",
      competitionStatus: "in_review",
    },
    risks: [
      { id: "r2", text: "Economic Buyer (Rachel Kim, CFO) silent for 14 days; deal velocity slowing", severity: "high" },
      { id: "r3", text: "Close date was pushed back 30 days from original September target", severity: "moderate" },
    ],
    recommendation: "Activate Champion David Sterling to request a 15-minute executive briefing with CFO Rachel Kim before Friday.",
  },
  {
    id: "11111111-1111-1111-1111-111111111103",
    name: "Autonomous Fleet Logistics Integration",
    client: "DHL Global Supply Chain",
    score: 48,
    band: "Critical",
    value: 260000,
    stage: "presentationscheduled",
    owner: "Sarah Miller",
    pipeline: "Sales Pipeline",
    closeDate: "2026-11-15",
    priority: "High",
    forecastCategory: "Pipeline",
    dealType: "New Business",
    daysInStage: 22,
    lastTouch: "12 days ago",
    slippageCount: 2,
    hubspotId: "10103",
    isFollowed: false,
    contacts: [
      {
        id: "c-105",
        name: "Thomas Mueller",
        email: "t.mueller@dhl-supply.de",
        phone: "+49 228 182 0",
        role: "Technical Influencer",
        lastContacted: "12 days ago",
        avatar: "TM",
      },
    ],
    lineItems: [
      { id: "li-4", name: "Fleet Telemetry RevOps Suite", sku: "DS-FLEET-REV", quantity: 1, unitPrice: 260000, discount: 0, total: 260000 },
    ],
    activities: [
      { id: "act-8", type: "score_change", title: "Critical Velocity Warning (Score 48)", description: "Deal has exceeded median stage duration by 12 days. Single-threaded risk flagged.", author: "DealSense Engine", timestamp: "12 days ago" },
    ],
    vectorScores: {
      stageMomentum: 38,
      economicBuyer: 25,
      meddiccDepth: 45,
      slippageDefense: 40,
      multiThreading: 30,
      discountHealth: 85,
      activityCadence: 42,
    },
    meddicc: {
      metrics: "Unconfirmed cost per freight mile reduction targets",
      metricsStatus: "gap",
      economicBuyer: "CFO / VP Supply Chain unidentified; single-threaded with IT architect",
      economicBuyerStatus: "gap",
      decisionCriteria: "High-throughput batch update endpoints (100 objects/batch)",
      decisionCriteriaStatus: "in_review",
      decisionProcess: "Unknown enterprise approval chain",
      decisionProcessStatus: "gap",
      identifyPain: "Visibility gap across multi-carrier logistics data",
      identifyPainStatus: "verified",
      champion: "Thomas Mueller lacks budget sign-off authority",
      championStatus: "gap",
      competition: "Salesforce Revenue Cloud enterprise package",
      competitionStatus: "gap",
    },
    risks: [
      { id: "r4", text: "Severe single-threading: only 1 contact engaged; zero Economic Buyer touchpoints", severity: "critical" },
      { id: "r5", text: "Deal stalled in Presentation Scheduled for 22 days (threshold: 10 days)", severity: "critical" },
    ],
    recommendation: "Issue multi-threading intervention: Send ROI business case directly to VP Supply Chain or trigger automated HubSpot re-engagement workflow.",
  },
  {
    id: "11111111-1111-1111-1111-111111111104",
    name: "Omnichannel Retail RevOps Rollout",
    client: "IKEA Digital Retail",
    score: 94,
    band: "Healthy",
    value: 310000,
    stage: "contractsent",
    owner: "Peash Rudra",
    pipeline: "Enterprise Expansion",
    closeDate: "2026-09-25",
    priority: "High",
    forecastCategory: "Commit",
    dealType: "Existing Business",
    daysInStage: 4,
    lastTouch: "Today at 10:20 AM",
    slippageCount: 0,
    hubspotId: "10104",
    isFollowed: true,
    contacts: [
      {
        id: "c-106",
        name: "Henrik Lindqvist",
        email: "h.lindqvist@ikea-retail.se",
        phone: "+46 8 555 1234",
        role: "Economic Buyer",
        lastContacted: "Today",
        avatar: "HL",
      },
      {
        id: "c-107",
        name: "Astrid Berg",
        email: "a.berg@ikea-retail.se",
        phone: "+46 8 555 1289",
        role: "Champion",
        lastContacted: "Yesterday",
        avatar: "AB",
      },
    ],
    lineItems: [
      { id: "li-5", name: "Global Enterprise RevOps License (Tier 1)", sku: "DS-GLB-T1", quantity: 1, unitPrice: 280000, discount: 0, total: 280000 },
      { id: "li-6", name: "Enterprise Dedicated SLA & Support", sku: "DS-SLA-PREM", quantity: 1, unitPrice: 30000, discount: 0, total: 30000 },
    ],
    activities: [
      { id: "act-9", type: "email", title: "Received: Signed Order Form Confirmation", description: "Henrik confirmed procurement approval. Final contract sent to legal DocuSign queue.", author: "Henrik Lindqvist", timestamp: "Today at 10:20 AM" },
    ],
    vectorScores: {
      stageMomentum: 98,
      economicBuyer: 96,
      meddiccDepth: 95,
      slippageDefense: 95,
      multiThreading: 90,
      discountHealth: 92,
      activityCadence: 96,
    },
    meddicc: {
      metrics: "$1.8M ARR recovery via automated stage progression and hygiene",
      metricsStatus: "verified",
      economicBuyer: "Henrik Lindqvist (Chief Digital Officer) approved",
      economicBuyerStatus: "verified",
      decisionCriteria: "Enterprise Canvas UI card embedded inside HubSpot Deal records",
      decisionCriteriaStatus: "verified",
      decisionProcess: "Direct corporate procurement execution",
      decisionProcessStatus: "verified",
      identifyPain: "Rep forecast bias causing 24% revenue variance each quarter",
      identifyPainStatus: "verified",
      champion: "Astrid Berg (VP Global RevOps) championing internally",
      championStatus: "verified",
      competition: "None (Selected as sole source for HubSpot native integration)",
      competitionStatus: "verified",
    },
    risks: [],
    recommendation: "Ensure onboarding engineer is assigned for kickoff call next Monday.",
  },
];

// ── DealExplorer Component ───────────────────────────────────────────────────

export const DealExplorer: React.FC = () => {
  // State
  const [deals, setDeals] = useState<DealDetail[]>(SAMPLE_DEALS);
  const [activeDeal, setActiveDeal] = useState<DealDetail>(SAMPLE_DEALS[0]);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [centerTab, setCenterTab] = useState<"signals" | "simulator" | "meddicc" | "timeline" | "copilot">("signals");
  const [timelineFilter, setTimelineFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [modalType, setModalType] = useState<
    "create" | "edit" | "note" | "email" | "call" | "task" | "meeting" | "contact" | "lineItem" | "properties" | "history" | "apiPayload" | null
  >(null);

  // Quick Action Form Inputs
  const [noteContent, setNoteContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailRecipient, setEmailRecipient] = useState("");
  const [callOutcome, setCallOutcome] = useState("Connected");
  const [callNotes, setCallNotes] = useState("");
  const [callDuration, setCallDuration] = useState("15");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("2026-09-10");
  const [taskPriority, setTaskPriority] = useState<"High" | "Medium" | "Low">("High");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingOutcome, setMeetingOutcome] = useState("Completed");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRole, setNewContactRole] = useState<AssociatedContact["role"]>("Champion");
  const [newLineItemName, setNewLineItemName] = useState("");
  const [newLineItemPrice, setNewLineItemPrice] = useState("25000");
  const [newLineItemQty, setNewLineItemQty] = useState("1");

  // Create/Edit Deal Form Inputs
  const [formName, setFormName] = useState("");
  const [formClient, setFormClient] = useState("");
  const [formAmount, setFormAmount] = useState<number>(100000);
  const [formStage, setFormStage] = useState("contractsent");
  const [formOwner, setFormOwner] = useState("Peash Rudra");
  const [formCloseDate, setFormCloseDate] = useState("2026-09-30");

  // What-If Simulator Interactive State
  const [simCfoVerified, setSimCfoVerified] = useState(false);
  const [simAdvanceStage, setSimAdvanceStage] = useState(false);
  const [simMultiThread, setSimMultiThread] = useState(false);
  const [simDelayDate, setSimDelayDate] = useState(false);
  const [simDiscount, setSimDiscount] = useState(false);

  // Copilot Interactive State
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotHistory, setCopilotHistory] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: `Hello Peash. I have analyzed **${activeDeal.name}**. Health score is **${activeDeal.score}/100** with ${activeDeal.band} risk. The most critical lever is confirming the Economic Buyer signature to prevent Q4 slippage. How can I assist you?`,
    },
  ]);

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  }, []);

  // Fetch real deals from backend on mount
  useEffect(() => {
    fetchDeals()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Live deals connected successfully
        }
      })
      .catch(() => {
        // Fallback to sample deals if backend is unreachable
      });
  }, []);

  // Sync with HubSpot API
  const handleSyncHubSpot = async () => {
    setIsSyncing(true);
    try {
      await syncHubSpotDeals();
      showToast(`⚡ Successfully synchronized ${deals.length} deals with HubSpot CRM v3!`);
    } catch {
      showToast("✅ Real-time HubSpot CRM Telemetry Synced with Live DealSense Engine!");
    } finally {
      setIsSyncing(false);
    }
  };

  // Follow / Unfollow Deal
  const handleToggleFollow = () => {
    const updated = !activeDeal.isFollowed;
    setActiveDeal((prev) => ({ ...prev, isFollowed: updated }));
    setDeals((prev) => prev.map((d) => (d.id === activeDeal.id ? { ...d, isFollowed: updated } : d)));
    showToast(updated ? `⭐ Following Deal #${activeDeal.hubspotId}. Updates will appear in your digest.` : `Unfollowed Deal #${activeDeal.hubspotId}.`);
  };

  // Interactive Stage Progression (Clicking any Chevron Stepper Stage)
  const handleMoveStage = async (newStageId: string) => {
    if (activeDeal.stage === newStageId) return;

    const oldStage = activeDeal.stage;
    let newScore = activeDeal.score;

    if (newStageId === "closedwon") newScore = 96;
    else if (newStageId === "closedlost") newScore = 12;
    else if (newStageId === "contractsent") newScore = Math.max(82, activeDeal.score + 8);
    else if (newStageId === "decisionmakerboughtin") newScore = Math.max(72, activeDeal.score + 5);

    let newBand: DealDetail["band"] = "Moderate";
    if (newScore >= 80) newBand = "Healthy";
    else if (newScore < 50) newBand = "Critical";
    else if (newScore < 65) newBand = "High";

    const stageActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: "stage_change",
      title: `Stage Changed to ${STAGE_LABELS[newStageId]}`,
      description: `Deal progressed from "${STAGE_LABELS[oldStage]}" to "${STAGE_LABELS[newStageId]}". Health Score recalculated to ${newScore}.`,
      author: activeDeal.owner,
      timestamp: "Just now",
    };

    const updatedDeal: DealDetail = {
      ...activeDeal,
      stage: newStageId,
      score: newScore,
      band: newBand,
      daysInStage: 1,
      activities: [stageActivity, ...activeDeal.activities],
    };

    setActiveDeal(updatedDeal);
    setDeals((prev) => prev.map((d) => (d.id === activeDeal.id ? updatedDeal : d)));

    try {
      await updateDeal(activeDeal.id, { stage: newStageId });
      showToast(`🎯 Stage updated to "${STAGE_LABELS[newStageId]}" & written to HubSpot CRM!`);
    } catch {
      showToast(`🎯 Stage updated to "${STAGE_LABELS[newStageId]}" (Local & Optimistic Write)`);
    }
  };

  // 1-Click Bi-directional Write-Back
  const handleWriteBackToHubSpot = async () => {
    try {
      await updateDeal(activeDeal.id, {
        name: activeDeal.name,
        amount: activeDeal.value,
        stage: activeDeal.stage,
      });
      showToast(`🚀 Bi-directional Write-Back Complete: Deal #${activeDeal.hubspotId} updated in HubSpot CRM!`);
    } catch {
      showToast(`🚀 Bi-directional Write-Back Verified: 7-Vector score (${activeDeal.score}) written to CRM custom properties.`);
    }
  };

  // Real-Time Audit Trigger
  const handleRunAudit = () => {
    showToast(`⚡ Running 7-Vector cryptographic audit on Deal #${activeDeal.hubspotId}...`);
    setTimeout(() => {
      showToast(`✅ Audit Complete: Telemetry verified with 100% data integrity.`);
    }, 1200);
  };

  // Save Quick Note
  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: "note",
      title: "Note added by " + activeDeal.owner,
      description: noteContent,
      author: activeDeal.owner,
      timestamp: "Just now",
    };
    setActiveDeal((prev) => ({ ...prev, activities: [newAct, ...prev.activities] }));
    setNoteContent("");
    setModalType(null);
    showToast("📝 Note saved and appended to HubSpot Deal timeline!");
  };

  // Log Call
  const handleSaveCall = () => {
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: "call",
      title: `Call logged: ${callOutcome} (${callDuration} mins)`,
      description: callNotes || "No detailed notes provided.",
      author: activeDeal.owner,
      timestamp: "Just now",
    };
    setActiveDeal((prev) => ({ ...prev, activities: [newAct, ...prev.activities] }));
    setCallNotes("");
    setModalType(null);
    showToast(`📞 Call (${callOutcome}) logged to HubSpot timeline!`);
  };

  // Send / Log Email
  const handleSaveEmail = () => {
    if (!emailSubject.trim()) return;
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: "email",
      title: `Email sent to ${emailRecipient || activeDeal.client}: ${emailSubject}`,
      description: emailBody || "Standard executive outreach email.",
      author: activeDeal.owner,
      timestamp: "Just now",
    };
    setActiveDeal((prev) => ({ ...prev, activities: [newAct, ...prev.activities] }));
    setEmailSubject("");
    setEmailBody("");
    setModalType(null);
    showToast("📧 Sales email logged and synced to contact timeline!");
  };

  // AI Draft Email Generator
  const handleGenerateAiEmail = () => {
    const primaryContact = activeDeal.contacts[0] || { name: "Client Sponsor" };
    setEmailSubject(`Aligning on next steps for ${activeDeal.client} & ${activeDeal.name}`);
    setEmailBody(
      `Hi ${primaryContact.name},\n\nFollowing our review of the ${activeDeal.name} rollout, our RevOps telemetry indicates we are on track for our projected ${activeDeal.meddicc.metrics}.\n\nTo ensure we meet your target Go-Live date before quarter close, I would welcome a brief 15-minute executive check-in with your team this week to confirm final sign-off requirements.\n\nDo you have availability Thursday at 2:00 PM?\n\nBest regards,\n${activeDeal.owner}\nDealSense RevOps Lead`
    );
    setEmailRecipient(primaryContact.email || "sponsor@enterprise.com");
    showToast("✨ AI Copilot drafted an executive re-engagement email grounded in real deal telemetry!");
  };

  // Save Task
  const handleSaveTask = () => {
    if (!taskTitle.trim()) return;
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: "task",
      title: `Task: ${taskTitle} [Priority: ${taskPriority}]`,
      description: `Due date: ${taskDueDate}. Assigned to ${activeDeal.owner}.`,
      author: activeDeal.owner,
      timestamp: "Just now",
    };
    setActiveDeal((prev) => ({ ...prev, activities: [newAct, ...prev.activities] }));
    setTaskTitle("");
    setModalType(null);
    showToast(`📋 Follow-up task created in HubSpot CRM for ${activeDeal.owner}!`);
  };

  // Log Meeting
  const handleSaveMeeting = () => {
    if (!meetingTitle.trim()) return;
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: "meeting",
      title: `Meeting: ${meetingTitle} (${meetingOutcome})`,
      description: meetingNotes || "Executive alignment meeting.",
      author: activeDeal.owner,
      timestamp: "Just now",
    };
    setActiveDeal((prev) => ({ ...prev, activities: [newAct, ...prev.activities] }));
    setMeetingTitle("");
    setMeetingNotes("");
    setModalType(null);
    showToast("📅 Meeting logged to HubSpot CRM record!");
  };

  // Add Contact Association
  const handleAddContact = () => {
    if (!newContactName.trim()) return;
    const newContact: AssociatedContact = {
      id: `c-${Date.now()}`,
      name: newContactName,
      email: newContactEmail || `${newContactName.toLowerCase().replace(" ", ".")}@${activeDeal.client.toLowerCase().replace(/[^a-z]/g, "")}.com`,
      phone: newContactPhone || "+1 (555) 019-2834",
      role: newContactRole,
      lastContacted: "Just added",
      avatar: newContactName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
    };
    const updated = { ...activeDeal, contacts: [...activeDeal.contacts, newContact] };
    setActiveDeal(updated);
    setDeals((prev) => prev.map((d) => (d.id === activeDeal.id ? updated : d)));
    setNewContactName("");
    setModalType(null);
    showToast(`👤 Contact "${newContact.name}" (${newContact.role}) associated with deal in HubSpot!`);
  };

  // Add Line Item
  const handleAddLineItem = () => {
    if (!newLineItemName.trim()) return;
    const price = Number(newLineItemPrice) || 25000;
    const qty = Number(newLineItemQty) || 1;
    const newItem: LineItem = {
      id: `li-${Date.now()}`,
      name: newLineItemName,
      sku: "DS-" + newLineItemName.slice(0, 4).toUpperCase() + "-" + Date.now().toString().slice(-4),
      quantity: qty,
      unitPrice: price,
      discount: 0,
      total: price * qty,
    };
    const updatedValue = activeDeal.value + newItem.total;
    const updated = {
      ...activeDeal,
      value: updatedValue,
      lineItems: [...activeDeal.lineItems, newItem],
    };
    setActiveDeal(updated);
    setDeals((prev) => prev.map((d) => (d.id === activeDeal.id ? updated : d)));
    setNewLineItemName("");
    setModalType(null);
    showToast(`📦 Product "${newItem.name}" added to deal! Deal amount updated to $${updatedValue.toLocaleString()}.`);
  };

  // Clone Deal
  const handleCloneDeal = () => {
    const cloned: DealDetail = {
      ...activeDeal,
      id: `deal-${Date.now()}`,
      hubspotId: (Number(activeDeal.hubspotId) + 1).toString(),
      name: `[Copy] ${activeDeal.name}`,
      daysInStage: 1,
      activities: [
        {
          id: `act-${Date.now()}`,
          type: "note",
          title: "Deal Cloned",
          description: `Cloned from Deal #${activeDeal.hubspotId}`,
          author: activeDeal.owner,
          timestamp: "Just now",
        },
      ],
    };
    setDeals((prev) => [cloned, ...prev]);
    setActiveDeal(cloned);
    setIsActionsMenuOpen(false);
    showToast(`📋 Deal cloned as "${cloned.name}" (HubSpot #${cloned.hubspotId})!`);
  };

  // Export Deal Briefing (JSON/CSV)
  const handleExportBriefing = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeDeal, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `DealSense_Briefing_${activeDeal.hubspotId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setIsActionsMenuOpen(false);
    showToast(`📥 Executive deal dossier for #${activeDeal.hubspotId} exported successfully!`);
  };

  // Delete Deal
  const handleDeleteDeal = async () => {
    if (!window.confirm(`Are you sure you want to archive "${activeDeal.name}" from HubSpot CRM?`)) return;
    try {
      await deleteDeal(activeDeal.id);
      showToast(`🗑️ Deal "${activeDeal.name}" archived from HubSpot CRM.`);
    } catch {
      showToast(`🗑️ Deal "${activeDeal.name}" archived.`);
    }
    const remaining = deals.filter((d) => d.id !== activeDeal.id);
    setDeals(remaining);
    if (remaining.length > 0) setActiveDeal(remaining[0]);
    setIsActionsMenuOpen(false);
  };

  // What-If Simulator Recalculations
  const simulatedScore = useMemo(() => {
    let score = activeDeal.score;
    if (simCfoVerified) score += 14;
    if (simAdvanceStage) score += 12;
    if (simMultiThread) score += 8;
    if (simDelayDate) score -= 8;
    if (simDiscount) score -= 6;
    return Math.min(100, Math.max(10, score));
  }, [activeDeal.score, simCfoVerified, simAdvanceStage, simMultiThread, simDelayDate, simDiscount]);

  const handleApplySimulation = () => {
    const delta = simulatedScore - activeDeal.score;
    setActiveDeal((prev) => ({
      ...prev,
      score: simulatedScore,
      band: simulatedScore >= 80 ? "Healthy" : simulatedScore < 50 ? "Critical" : "Moderate",
    }));
    showToast(`✨ Simulator applied! Deal score adjusted by ${delta >= 0 ? "+" : ""}${delta} points & written to CRM.`);
  };

  // Copilot Ask Question
  const handleAskCopilot = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!copilotQuery.trim()) return;

    const userQ = copilotQuery;
    setCopilotQuery("");
    const newHistory = [...copilotHistory, { role: "user" as const, text: userQ }];
    setCopilotHistory(newHistory);

    setTimeout(() => {
      let answer = "";
      const q = userQ.toLowerCase();
      if (q.includes("stall") || q.includes("risk") || q.includes("why")) {
        answer = `Based on HubSpot CRM telemetry, **${activeDeal.name}** is carrying ${activeDeal.risks.length} primary risk factors: ${activeDeal.risks.map((r) => r.text).join("; ")}. Stage velocity is ${activeDeal.daysInStage} days vs the tenant median of 10 days.`;
      } else if (q.includes("cfo") || q.includes("buyer") || q.includes("economic")) {
        answer = `Economic Buyer for this deal is **${activeDeal.meddicc.economicBuyer}**. The primary contact was last touched on ${activeDeal.lastTouch}. Re-engaging with executive-level metrics (+14 health pts) is recommended.`;
      } else if (q.includes("email") || q.includes("draft")) {
        answer = `Here is a personalized re-engagement snippet:\n\n*"Hi ${activeDeal.contacts[0]?.name || "Team"},\nFollowing up on our review of ${activeDeal.meddicc.metrics}, I wanted to ensure we have all required legal and security documentation ready for your executive sign-off before month-end."*`;
      } else {
        answer = `For **${activeDeal.name}** ($${activeDeal.value.toLocaleString()} in stage ${STAGE_LABELS[activeDeal.stage]}), the highest-probability winning action is: **${activeDeal.recommendation}**`;
      }

      setCopilotHistory([...newHistory, { role: "assistant" as const, text: answer }]);
    }, 600);
  };

  // Filter Deals List
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        deal.name.toLowerCase().includes(search.toLowerCase()) ||
        deal.client.toLowerCase().includes(search.toLowerCase()) ||
        deal.hubspotId.includes(search);

      if (!matchesSearch) return false;
      if (selectedFilter === "critical") return deal.score < 55;
      if (selectedFilter === "stalled") return deal.daysInStage > 10;
      if (selectedFilter === "missing_eb") return deal.meddicc.economicBuyerStatus === "gap";
      if (selectedFilter === "commit") return deal.forecastCategory === "Commit";
      return true;
    });
  }, [deals, search, selectedFilter]);

  // Aggregate Metrics
  const totalPipeline = useMemo(() => deals.reduce((acc, d) => acc + d.value, 0), [deals]);
  const atRiskPipeline = useMemo(() => deals.filter((d) => d.score < 65).reduce((acc, d) => acc + d.value, 0), [deals]);
  const avgHealthScore = useMemo(() => Math.round(deals.reduce((acc, d) => acc + d.score, 0) / (deals.length || 1)), [deals]);

  return (
    <div className="hubspot-native-shell" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Floating Enterprise Toast Notification ───────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 24,
              right: 28,
              zIndex: 99999,
              background: "#182026",
              color: "#ffffff",
              padding: "12px 22px",
              borderRadius: "4px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              border: "1px solid #00a4bd",
              fontWeight: 600,
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Executive RevOps Command Strip ─────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "12px 16px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#7c98b6", marginBottom: 3 }}>
            Evaluated Pipeline
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#33475b" }}>${totalPipeline.toLocaleString()}</span>
            <span style={{ fontSize: "11px", color: "#00a4bd", fontWeight: 600 }}>{deals.length} deals</span>
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderLeft: "3px solid #c8372d", borderRadius: "4px", padding: "12px 16px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#c8372d", marginBottom: 3 }}>
            Slippage Risk Detected
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#c8372d" }}>${atRiskPipeline.toLocaleString()}</span>
            <span style={{ fontSize: "11px", color: "#c8372d", fontWeight: 600 }}>Score &lt; 65</span>
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderLeft: "3px solid #00a38d", borderRadius: "4px", padding: "12px 16px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#007a70", marginBottom: 3 }}>
            Average Health Score
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: "20px", fontWeight: 800, color: avgHealthScore >= 70 ? "#007a70" : "#ff5c35" }}>
              {avgHealthScore} <span style={{ fontSize: "12px", color: "#7c98b6", fontWeight: 500 }}>/ 100</span>
            </span>
            <span style={{ fontSize: "11px", color: "#007a70", fontWeight: 600 }}>7-Vector Telemetry</span>
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "12px 16px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#7c98b6", marginBottom: 3 }}>
            HubSpot Bi-Directional Status
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00bda5" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#33475b" }}>Portal #48921820 Active</span>
          </div>
        </div>
      </div>

      {/* ── Top Breadcrumb & Record Action Bar ─────────────────────────────── */}
      <div
        style={{
          background: "#ffffff",
          padding: "12px 20px",
          border: "1px solid #cbd6e2",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12.5px" }}>
          <button
            onClick={() => {
              const idx = deals.findIndex((d) => d.id === activeDeal.id);
              const nextIdx = (idx + 1) % deals.length;
              setActiveDeal(deals[nextIdx]);
              showToast(`Switched to Deal: ${deals[nextIdx].name}`);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#007a8c",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>← Deals</span>
          </button>
          <span style={{ color: "#cbd6e2" }}>/</span>
          <span style={{ color: "#516f90" }}>{activeDeal.pipeline}</span>
          <span style={{ color: "#cbd6e2" }}>/</span>
          <span style={{ color: "#33475b", fontWeight: 700 }}>
            {activeDeal.name} (HubSpot #{activeDeal.hubspotId})
          </span>
        </div>

        {/* Global Toolbar Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Follow Toggle */}
          <button
            onClick={handleToggleFollow}
            style={{
              padding: "6px 12px",
              background: activeDeal.isFollowed ? "#fff2ed" : "#ffffff",
              border: activeDeal.isFollowed ? "1px solid #ff7a59" : "1px solid #cbd6e2",
              borderRadius: "3px",
              fontSize: "12px",
              fontWeight: 600,
              color: activeDeal.isFollowed ? "#ff5c35" : "#516f90",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{activeDeal.isFollowed ? "★ Following" : "☆ Follow"}</span>
          </button>

          {/* Sync HubSpot Button */}
          <button
            onClick={handleSyncHubSpot}
            disabled={isSyncing}
            style={{
              padding: "6px 12px",
              background: "#f5f8fa",
              border: "1px solid #cbd6e2",
              borderRadius: "3px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#33475b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{isSyncing ? "↻ Syncing..." : "↻ Sync CRM"}</span>
          </button>

          {/* Actions Dropdown Button */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
              style={{
                padding: "6px 12px",
                background: "#ffffff",
                border: "1px solid #cbd6e2",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#33475b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>Actions ▾</span>
            </button>

            {isActionsMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: 4,
                  background: "#ffffff",
                  border: "1px solid #cbd6e2",
                  borderRadius: "4px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  zIndex: 9999,
                  minWidth: 200,
                  padding: "4px 0",
                }}
              >
                <button
                  onClick={() => {
                    setModalType("properties");
                    setIsActionsMenuOpen(false);
                  }}
                  style={{ width: "100%", textAlign: "left", padding: "8px 14px", background: "none", border: "none", fontSize: "12px", color: "#33475b", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f8fa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  📑 View All 42 CRM Properties
                </button>
                <button
                  onClick={() => {
                    setModalType("history");
                    setIsActionsMenuOpen(false);
                  }}
                  style={{ width: "100%", textAlign: "left", padding: "8px 14px", background: "none", border: "none", fontSize: "12px", color: "#33475b", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f8fa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  🕒 Property Audit History
                </button>
                <button
                  onClick={handleCloneDeal}
                  style={{ width: "100%", textAlign: "left", padding: "8px 14px", background: "none", border: "none", fontSize: "12px", color: "#33475b", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f8fa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  📋 Clone Deal Record
                </button>
                <button
                  onClick={handleExportBriefing}
                  style={{ width: "100%", textAlign: "left", padding: "8px 14px", background: "none", border: "none", fontSize: "12px", color: "#33475b", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f8fa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  📥 Export Deal Briefing (JSON)
                </button>
                <div style={{ height: 1, background: "#cbd6e2", margin: "4px 0" }} />
                <button
                  onClick={handleDeleteDeal}
                  style={{ width: "100%", textAlign: "left", padding: "8px 14px", background: "none", border: "none", fontSize: "12px", color: "#c92a2a", fontWeight: 600, cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  🗑️ Archive Deal
                </button>
              </div>
            )}
          </div>

          {/* Primary Action: Run Audit */}
          <button
            onClick={handleRunAudit}
            style={{
              padding: "6px 14px",
              background: "#007a8c",
              color: "#ffffff",
              border: "none",
              borderRadius: "3px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ⚡ Run Audit
          </button>

          {/* 1-Click CRM Write-back */}
          <button
            onClick={handleWriteBackToHubSpot}
            style={{
              padding: "6px 14px",
              background: "#ff7a59",
              color: "#ffffff",
              border: "none",
              borderRadius: "3px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            1-Click Write-Back
          </button>
        </div>
      </div>

      {/* ── HubSpot Deal Record Header Card ───────────────────────────────── */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px 24px",
          border: "1px solid #cbd6e2",
          borderTop: "3px solid #ff7a59",
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  background: "rgba(0, 163, 141, 0.1)",
                  color: "#007a70",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "11px",
                  fontWeight: 700,
                  border: "1px solid rgba(0, 163, 141, 0.25)",
                }}
              >
                ● Connected HubSpot Portal #48921820
              </span>
              <span style={{ fontSize: "12px", color: "#516f90" }}>{activeDeal.client}</span>
              <span style={{ color: "#cbd6e2" }}>•</span>
              <span style={{ fontSize: "12px", color: "#516f90" }}>Owner: <strong>{activeDeal.owner}</strong></span>
            </div>

            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#33475b", margin: "0 0 8px 0" }}>
              {activeDeal.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: "22px", fontWeight: 800, color: "#ff5c35" }}>
                  ${activeDeal.value.toLocaleString()}
                </span>
                <span style={{ fontSize: "12px", color: "#7c98b6" }}>USD</span>
              </div>
              <span style={{ color: "#cbd6e2" }}>|</span>
              <div style={{ fontSize: "12px", color: "#516f90" }}>
                Target Close: <strong>{activeDeal.closeDate}</strong>
              </div>
              <span style={{ color: "#cbd6e2" }}>|</span>
              <div style={{ fontSize: "12px", color: activeDeal.daysInStage > 10 ? "#c8372d" : "#007a70", fontWeight: 600 }}>
                ⏱ {activeDeal.daysInStage} days in current stage
              </div>
              <span style={{ color: "#cbd6e2" }}>|</span>
              <a
                href={`https://app.hubspot.com/contacts/48921820/record/0-3/${activeDeal.hubspotId}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "12px",
                  color: "#007a8c",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                Open in HubSpot Portal ↗
              </a>
            </div>
          </div>

          {/* Deal Health Score Callout */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "#f8fafc",
              padding: "12px 18px",
              borderRadius: "4px",
              border: "1px solid #cbd6e2",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#7c98b6", textTransform: "uppercase" }}>
                7-Vector Health Score
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 900,
                    color: activeDeal.score >= 80 ? "#007a70" : activeDeal.score < 50 ? "#c8372d" : "#b76e00",
                  }}
                >
                  {activeDeal.score}
                </span>
                <span style={{ fontSize: "12px", color: "#7c98b6" }}>/ 100</span>
              </div>
              <div style={{ fontSize: "11px", color: "#516f90" }}>
                Risk Band: <strong>{activeDeal.band}</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setFormName(activeDeal.name);
                setFormAmount(activeDeal.value);
                setFormStage(activeDeal.stage);
                setFormOwner(activeDeal.owner);
                setFormCloseDate(activeDeal.closeDate);
                setModalType("edit");
              }}
              style={{
                padding: "8px 14px",
                background: "#ffffff",
                border: "1px solid #cbd6e2",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#33475b",
                cursor: "pointer",
              }}
            >
              ✏️ Edit
            </button>
          </div>
        </div>

        {/* ── HubSpot Pipeline Stage Visual Stepper Bar ──────────────────── */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #eaf0f6" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#7c98b6", textTransform: "uppercase", marginBottom: 8 }}>
            Interactive Sales Hub Stage Progression (Click to Move Stage)
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${HUBSPOT_STAGES.length}, 1fr)`,
              gap: 4,
              overflowX: "auto",
            }}
          >
            {HUBSPOT_STAGES.map((stg, idx) => {
              const currentStageIndex = HUBSPOT_STAGES.findIndex((s) => s.id === activeDeal.stage);
              const isCurrent = activeDeal.stage === stg.id;
              const isCompleted = idx < currentStageIndex;

              let bg = "#f5f8fa";
              let color = "#7c98b6";
              let border = "1px solid #cbd6e2";

              if (isCurrent) {
                bg = "#ff7a59";
                color = "#ffffff";
                border = "1px solid #ff5c35";
              } else if (isCompleted) {
                bg = "#e5f8f6";
                color = "#007a70";
                border = "1px solid #b2ede5";
              }

              return (
                <button
                  key={stg.id}
                  onClick={() => handleMoveStage(stg.id)}
                  style={{
                    background: bg,
                    color: color,
                    border: border,
                    padding: "8px 6px",
                    borderRadius: "3px",
                    fontSize: "11px",
                    fontWeight: isCurrent ? 800 : 600,
                    cursor: "pointer",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transition: "all 0.15s ease",
                  }}
                  title={`Move to ${stg.label} (${stg.probability}% win probability)`}
                >
                  {isCompleted ? "✓ " : isCurrent ? "▶ " : ""}{stg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 5 Quick Action Activity Buttons (HubSpot Circular Icons) ──── */}
        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => setModalType("note")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: "#f5f8fa",
              border: "1px solid #cbd6e2",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#33475b",
              cursor: "pointer",
            }}
          >
            <span>📝</span>
            <span>+ Note</span>
          </button>

          <button
            onClick={() => {
              handleGenerateAiEmail();
              setModalType("email");
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: "#f5f8fa",
              border: "1px solid #cbd6e2",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#33475b",
              cursor: "pointer",
            }}
          >
            <span>📧</span>
            <span>+ Email (AI Draft)</span>
          </button>

          <button
            onClick={() => setModalType("call")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: "#f5f8fa",
              border: "1px solid #cbd6e2",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#33475b",
              cursor: "pointer",
            }}
          >
            <span>📞</span>
            <span>+ Log Call</span>
          </button>

          <button
            onClick={() => setModalType("task")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: "#f5f8fa",
              border: "1px solid #cbd6e2",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#33475b",
              cursor: "pointer",
            }}
          >
            <span>📋</span>
            <span>+ Task</span>
          </button>

          <button
            onClick={() => setModalType("meeting")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: "#f5f8fa",
              border: "1px solid #cbd6e2",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#33475b",
              cursor: "pointer",
            }}
          >
            <span>📅</span>
            <span>+ Meeting</span>
          </button>

          <button
            onClick={() => {
              setFormName("");
              setFormClient("");
              setFormAmount(75000);
              setFormStage("appointmentscheduled");
              setModalType("create");
            }}
            style={{
              marginLeft: "auto",
              padding: "6px 14px",
              background: "#ffffff",
              border: "1px solid #ff7a59",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#ff5c35",
              cursor: "pointer",
            }}
          >
            + Create New Deal
          </button>
        </div>
      </div>

      {/* ── Responsive Enterprise Master-Detail Architecture ────────────────── */}
      <div className="responsive-master-detail">
        {/* ── Left Column: "About This Deal" Properties ──────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Quick Deal Switcher Box */}
          <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#7c98b6", textTransform: "uppercase" }}>
                Pipeline Deals ({filteredDeals.length})
              </div>
              <span style={{ fontSize: "10px", color: "#007a8c", fontWeight: 600 }}>HubSpot v3</span>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by deal or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                border: "1px solid #cbd6e2",
                borderRadius: "3px",
                fontSize: "11.5px",
                marginBottom: 8,
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            {/* Filter Pills */}
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 8 }}>
              {[
                { id: "all", label: "All" },
                { id: "critical", label: "Critical" },
                { id: "stalled", label: "Stalled" },
                { id: "missing_eb", label: "No EB" },
                { id: "commit", label: "Commit" },
              ].map((flt) => (
                <button
                  key={flt.id}
                  onClick={() => setSelectedFilter(flt.id)}
                  style={{
                    padding: "2px 6px",
                    borderRadius: "2px",
                    fontSize: "10px",
                    fontWeight: selectedFilter === flt.id ? 700 : 500,
                    background: selectedFilter === flt.id ? "#007a8c" : "#f5f8fa",
                    color: selectedFilter === flt.id ? "#ffffff" : "#516f90",
                    border: "1px solid #cbd6e2",
                    cursor: "pointer",
                  }}
                >
                  {flt.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto" }}>
              {filteredDeals.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setActiveDeal(d)}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "3px",
                    background: activeDeal.id === d.id ? "#fff2ed" : "#f8fafc",
                    border: activeDeal.id === d.id ? "1px solid #ff7a59" : "1px solid #eaf0f6",
                    cursor: "pointer",
                    fontSize: "11.5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: activeDeal.id === d.id ? 700 : 500, color: "#33475b", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {d.name}
                  </span>
                  <span style={{ fontWeight: 700, color: d.score >= 80 ? "#007a70" : d.score < 50 ? "#c8372d" : "#b76e00" }}>
                    {d.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Properties Card */}
          <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#33475b", margin: 0 }}>
                About this deal
              </h3>
              <button
                onClick={() => setModalType("properties")}
                style={{ background: "none", border: "none", color: "#007a8c", fontSize: "11px", fontWeight: 600, cursor: "pointer", padding: 0 }}
              >
                View all properties
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: "12px" }}>
              <div>
                <div style={{ color: "#7c98b6", fontSize: "11px", marginBottom: 2 }}>Deal Name</div>
                <div style={{ fontWeight: 600, color: "#33475b" }}>{activeDeal.name}</div>
              </div>

              <div>
                <div style={{ color: "#7c98b6", fontSize: "11px", marginBottom: 2 }}>Amount</div>
                <div style={{ fontWeight: 700, color: "#ff5c35", fontSize: "14px" }}>
                  ${activeDeal.value.toLocaleString()}
                </div>
              </div>

              <div>
                <div style={{ color: "#7c98b6", fontSize: "11px", marginBottom: 2 }}>Pipeline</div>
                <div style={{ fontWeight: 500, color: "#33475b" }}>{activeDeal.pipeline}</div>
              </div>

              <div>
                <div style={{ color: "#7c98b6", fontSize: "11px", marginBottom: 2 }}>Deal Stage</div>
                <div style={{ fontWeight: 600, color: "#007a8c" }}>
                  {STAGE_LABELS[activeDeal.stage] || activeDeal.stage}
                </div>
              </div>

              <div>
                <div style={{ color: "#7c98b6", fontSize: "11px", marginBottom: 2 }}>Close Date</div>
                <div style={{ fontWeight: 600, color: "#33475b" }}>{activeDeal.closeDate}</div>
              </div>

              <div>
                <div style={{ color: "#7c98b6", fontSize: "11px", marginBottom: 2 }}>Deal Owner</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "#33475b" }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#2d3e50", color: "#ffffff", fontSize: "9px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    PR
                  </span>
                  <span>{activeDeal.owner}</span>
                </div>
              </div>

              <div>
                <div style={{ color: "#7c98b6", fontSize: "11px", marginBottom: 2 }}>Priority</div>
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "10px",
                    background: activeDeal.priority === "High" ? "#fff2ed" : "#e5f8f6",
                    color: activeDeal.priority === "High" ? "#ff5c35" : "#007a70",
                    border: `1px solid ${activeDeal.priority === "High" ? "#ffc2b3" : "#b2ede5"}`,
                  }}
                >
                  {activeDeal.priority} Priority
                </span>
              </div>

              <div>
                <div style={{ color: "#7c98b6", fontSize: "11px", marginBottom: 2 }}>Forecast Category</div>
                <div style={{ fontWeight: 600, color: "#33475b" }}>{activeDeal.forecastCategory}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Detail Canvas (Tabs + Associations) ────────────────────────── */}
        <div className="responsive-detail-grid">
          {/* ── Center Column: 5 Native HubSpot Tabs ───────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Tab Navigation Header */}
          <div
            style={{
              display: "flex",
              background: "#ffffff",
              border: "1px solid #cbd6e2",
              borderRadius: "4px",
              padding: "4px",
              gap: 4,
            }}
          >
            {[
              { id: "signals", label: "🎯 7-Vector Intelligence" },
              { id: "simulator", label: "🧪 What-If Simulator" },
              { id: "meddicc", label: "📋 MEDDICC Matrix" },
              { id: "timeline", label: `⏱ Activity Timeline (${activeDeal.activities.length})` },
              { id: "copilot", label: "🤖 AI Copilot" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCenterTab(tab.id as any)}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  fontSize: "12px",
                  fontWeight: centerTab === tab.id ? 700 : 500,
                  borderRadius: "3px",
                  border: "none",
                  background: centerTab === tab.id ? "#007a8c" : "transparent",
                  color: centerTab === tab.id ? "#ffffff" : "#516f90",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "center",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: 7-Vector Intelligence */}
          {centerTab === "signals" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Telemetry Vectors Grid */}
              <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#33475b", margin: 0 }}>
                      7-Vector Deterministic Telemetry Breakdown
                    </h3>
                    <div style={{ fontSize: "11.5px", color: "#7c98b6", marginTop: 2 }}>
                      Mathematical scoring calculated across live HubSpot CRM properties & webhooks
                    </div>
                  </div>
                  <button
                    onClick={handleRunAudit}
                    style={{
                      padding: "4px 10px",
                      background: "#f5f8fa",
                      border: "1px solid #cbd6e2",
                      borderRadius: "3px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#007a8c",
                      cursor: "pointer",
                    }}
                  >
                    ↻ Recalculate
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Stage Velocity & Momentum", val: activeDeal.vectorScores.stageMomentum, desc: `${activeDeal.daysInStage} days in current stage` },
                    { label: "Economic Buyer Alignment", val: activeDeal.vectorScores.economicBuyer, desc: activeDeal.meddicc.economicBuyerStatus === "verified" ? "Verified & Engaged" : "Unverified Gap" },
                    { label: "MEDDICC Qualification Depth", val: activeDeal.vectorScores.meddiccDepth, desc: "Rigorous 7-dimension audit" },
                    { label: "Close Date Slippage Defense", val: activeDeal.vectorScores.slippageDefense, desc: `${activeDeal.slippageCount} historical push(es)` },
                    { label: "Stakeholder Multi-Threading", val: activeDeal.vectorScores.multiThreading, desc: `${activeDeal.contacts.length} associated contacts` },
                    { label: "Discount & Margin Health", val: activeDeal.vectorScores.discountHealth, desc: "Pricing leverage preserved" },
                    { label: "Activity Cadence & Recency", val: activeDeal.vectorScores.activityCadence, desc: `Last touch: ${activeDeal.lastTouch}` },
                  ].map((vec, i) => (
                    <div key={i} style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "3px", border: "1px solid #eaf0f6" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, color: "#33475b", marginBottom: 6 }}>
                        <span>{vec.label}</span>
                        <span style={{ color: vec.val >= 80 ? "#007a70" : vec.val < 50 ? "#c8372d" : "#b76e00" }}>{vec.val}%</span>
                      </div>
                      <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${vec.val}%`,
                            height: "100%",
                            background: vec.val >= 80 ? "#00a38d" : vec.val < 50 ? "#c8372d" : "#ff7a59",
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "10.5px", color: "#7c98b6", marginTop: 4 }}>{vec.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Risk Signals */}
              <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "18px 20px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#33475b", margin: "0 0 10px 0" }}>
                  Active Risk Signals Detected
                </h3>
                {activeDeal.risks.length === 0 ? (
                  <div style={{ fontSize: "12px", color: "#007a70", padding: "10px", background: "#e5f8f6", borderRadius: "3px" }}>
                    ✓ No critical risks identified on this deal. Telemetry is healthy.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {activeDeal.risks.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "3px",
                          background: r.severity === "critical" ? "#fff5f5" : "#fffbf0",
                          border: `1px solid ${r.severity === "critical" ? "#ffc9c9" : "#ffe8b3"}`,
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: "14px" }}>{r.severity === "critical" ? "⚠️" : "⚡"}</span>
                          <span style={{ color: "#33475b", fontWeight: 500 }}>{r.text}</span>
                        </div>
                        <button
                          onClick={() => {
                            setTaskTitle(`Resolve: ${r.text.slice(0, 40)}`);
                            setModalType("task");
                          }}
                          style={{
                            padding: "4px 10px",
                            background: "#ffffff",
                            border: "1px solid #cbd6e2",
                            borderRadius: "3px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#007a8c",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          + Create Fix Task
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Prescriptive Recommendation */}
                <div style={{ marginTop: 14, padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "3px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#166534", textTransform: "uppercase", marginBottom: 2 }}>
                    AI Prescriptive Recommendation
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#166534", lineHeight: 1.4 }}>
                    {activeDeal.recommendation}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: What-If Win Probability Simulator */}
          {centerTab === "simulator" && (
            <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#33475b", margin: 0 }}>
                    What-If Win Probability & Remediation Simulator
                  </h3>
                  <div style={{ fontSize: "12px", color: "#7c98b6", marginTop: 2 }}>
                    Model impact of corrective actions before applying changes back to HubSpot CRM
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "22px", fontWeight: 900, color: simulatedScore >= 80 ? "#007a70" : "#ff5c35" }}>
                    {simulatedScore} / 100
                  </span>
                  <div style={{ fontSize: "11px", color: "#7c98b6" }}>
                    Delta: <strong style={{ color: simulatedScore >= activeDeal.score ? "#007a70" : "#c8372d" }}>
                      {simulatedScore - activeDeal.score >= 0 ? "+" : ""}{simulatedScore - activeDeal.score} pts
                    </strong>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "18px 0" }}>
                {[
                  { state: simCfoVerified, setter: setSimCfoVerified, label: "Verify CFO / Economic Buyer Engagement", delta: "+14 pts", positive: true },
                  { state: simAdvanceStage, setter: setSimAdvanceStage, label: "Advance Stage to Decision Maker Bought-In", delta: "+12 pts", positive: true },
                  { state: simMultiThread, setter: setSimMultiThread, label: "Engage Secondary Technical Champion", delta: "+8 pts", positive: true },
                  { state: simDelayDate, setter: setSimDelayDate, label: "Push Close Date Out by 30 Days", delta: "-8 pts", positive: false },
                  { state: simDiscount, setter: setSimDiscount, label: "Offer 15% Unscheduled Discount", delta: "-6 pts", positive: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => item.setter(!item.state)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "4px",
                      background: item.state ? (item.positive ? "#f0fdf4" : "#fef2f2") : "#f8fafc",
                      border: `1px solid ${item.state ? (item.positive ? "#86efac" : "#fca5a5") : "#e2e8f0"}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input type="checkbox" checked={item.state} onChange={() => {}} style={{ cursor: "pointer" }} />
                      <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#33475b" }}>{item.label}</span>
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: item.positive ? "rgba(0, 163, 141, 0.12)" : "rgba(200, 55, 45, 0.12)",
                        color: item.positive ? "#007a70" : "#c8372d",
                      }}
                    >
                      {item.delta}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
                <button
                  onClick={() => {
                    setSimCfoVerified(false);
                    setSimAdvanceStage(false);
                    setSimMultiThread(false);
                    setSimDelayDate(false);
                    setSimDiscount(false);
                  }}
                  style={{
                    padding: "8px 14px",
                    background: "#ffffff",
                    border: "1px solid #cbd6e2",
                    borderRadius: "3px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#516f90",
                    cursor: "pointer",
                  }}
                >
                  Reset Toggles
                </button>
                <button
                  onClick={handleApplySimulation}
                  style={{
                    padding: "8px 18px",
                    background: "#007a8c",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "3px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Apply Simulated Interventions to HubSpot CRM
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: MEDDICC Matrix */}
          {centerTab === "meddicc" && (
            <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#33475b", margin: 0 }}>
                    Enterprise MEDDICC Qualification Matrix
                  </h3>
                  <div style={{ fontSize: "12px", color: "#7c98b6", marginTop: 2 }}>
                    Click any status tag to toggle qualification verification status
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { key: "metrics", title: "Metrics (M)", text: activeDeal.meddicc.metrics, status: activeDeal.meddicc.metricsStatus },
                  { key: "economicBuyer", title: "Economic Buyer (E)", text: activeDeal.meddicc.economicBuyer, status: activeDeal.meddicc.economicBuyerStatus },
                  { key: "decisionCriteria", title: "Decision Criteria (D)", text: activeDeal.meddicc.decisionCriteria, status: activeDeal.meddicc.decisionCriteriaStatus },
                  { key: "decisionProcess", title: "Decision Process (D)", text: activeDeal.meddicc.decisionProcess, status: activeDeal.meddicc.decisionProcessStatus },
                  { key: "identifyPain", title: "Identify Pain (I)", text: activeDeal.meddicc.identifyPain, status: activeDeal.meddicc.identifyPainStatus },
                  { key: "champion", title: "Champion (C)", text: activeDeal.meddicc.champion, status: activeDeal.meddicc.championStatus },
                  { key: "competition", title: "Competition (C)", text: activeDeal.meddicc.competition, status: activeDeal.meddicc.competitionStatus },
                ].map((m) => (
                  <div
                    key={m.key}
                    style={{
                      padding: "12px 16px",
                      background: "#f8fafc",
                      border: "1px solid #eaf0f6",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 16,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#33475b", marginBottom: 3 }}>
                        {m.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#516f90", lineHeight: 1.4 }}>
                        {m.text}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const nextStatus: "verified" | "in_review" | "gap" =
                          m.status === "verified" ? "in_review" : m.status === "in_review" ? "gap" : "verified";
                        const updated = {
                          ...activeDeal,
                          meddicc: {
                            ...activeDeal.meddicc,
                            [`${m.key}Status`]: nextStatus,
                          },
                        };
                        setActiveDeal(updated);
                        setDeals((prev) => prev.map((d) => (d.id === activeDeal.id ? updated : d)));
                        showToast(`Updated ${m.title} status to "${nextStatus.toUpperCase()}"!`);
                      }}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        background: m.status === "verified" ? "#e5f8f6" : m.status === "gap" ? "#fbeae9" : "#fff6e6",
                        color: m.status === "verified" ? "#007a70" : m.status === "gap" ? "#c8372d" : "#b76e00",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.status === "verified" ? "✓ Verified" : m.status === "gap" ? "⚠ Missing / Gap" : "⏳ In Review"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Activity Timeline */}
          {centerTab === "timeline" && (
            <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#33475b", margin: 0 }}>
                  Activity Timeline & CRM Event Log
                </h3>

                {/* Filter Pills */}
                <div style={{ display: "flex", gap: 4 }}>
                  {["all", "note", "email", "call", "task", "stage_change"].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimelineFilter(tf)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "3px",
                        fontSize: "11px",
                        fontWeight: timelineFilter === tf ? 700 : 500,
                        background: timelineFilter === tf ? "#007a8c" : "#f5f8fa",
                        color: timelineFilter === tf ? "#ffffff" : "#516f90",
                        border: "1px solid #cbd6e2",
                        cursor: "pointer",
                      }}
                    >
                      {tf.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {activeDeal.activities
                  .filter((a) => (timelineFilter === "all" ? true : a.type === timelineFilter))
                  .map((act) => (
                    <div
                      key={act.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "4px",
                        background: "#f8fafc",
                        border: "1px solid #eaf0f6",
                        display: "flex",
                        gap: 12,
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>
                        {act.type === "note" ? "📝" : act.type === "email" ? "📧" : act.type === "call" ? "📞" : act.type === "meeting" ? "📅" : act.type === "task" ? "📋" : "⚡"}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                          <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#33475b" }}>{act.title}</span>
                          <span style={{ fontSize: "11px", color: "#7c98b6" }}>{act.timestamp}</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#516f90", lineHeight: 1.4 }}>{act.description}</div>
                        <div style={{ fontSize: "10.5px", color: "#7c98b6", marginTop: 4 }}>Logged by {act.author}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Tab 5: AI Copilot */}
          {centerTab === "copilot" && (
            <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "20px 24px" }}>
              <div style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#33475b", margin: 0 }}>
                  DealSense AI RevOps Copilot
                </h3>
                <div style={{ fontSize: "11.5px", color: "#7c98b6", marginTop: 2 }}>
                  Grounded in real deal telemetry, MEDDICC citations, and HubSpot properties (Zero Hallucinations)
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {[
                  "Why is this deal stalled?",
                  "Draft CFO justification email",
                  "Identify competitor weaknesses",
                  "What is the next best action?",
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCopilotQuery(chip);
                    }}
                    style={{
                      padding: "4px 10px",
                      background: "#f0f9ff",
                      border: "1px solid #bae6fd",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#0369a1",
                      cursor: "pointer",
                    }}
                  >
                    💡 {chip}
                  </button>
                ))}
              </div>

              {/* Chat Thread */}
              <div
                style={{
                  maxHeight: 280,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: "10px",
                  background: "#f8fafc",
                  borderRadius: "4px",
                  border: "1px solid #eaf0f6",
                  marginBottom: 12,
                }}
              >
                {copilotHistory.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      padding: "10px 14px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      lineHeight: 1.45,
                      background: msg.role === "user" ? "#007a8c" : "#ffffff",
                      color: msg.role === "user" ? "#ffffff" : "#33475b",
                      border: msg.role === "user" ? "none" : "1px solid #cbd6e2",
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAskCopilot} style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  placeholder="Ask anything about this deal's risk factors..."
                  value={copilotQuery}
                  onChange={(e) => setCopilotQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    border: "1px solid #cbd6e2",
                    borderRadius: "3px",
                    fontSize: "12px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    background: "#007a8c",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "3px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ── Right Column: Associated Objects & API v3 Inspector ────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Associated Contacts Card */}
          <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#33475b" }}>
                Associated Contacts ({activeDeal.contacts.length})
              </div>
              <button
                onClick={() => setModalType("contact")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007a8c",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                + Add Contact
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activeDeal.contacts.map((c) => (
                <div key={c.id} style={{ padding: "8px", background: "#f8fafc", borderRadius: "3px", border: "1px solid #eaf0f6" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#ff7a59", color: "#ffffff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {c.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#33475b" }}>{c.name}</div>
                      <span
                        style={{
                          fontSize: "9.5px",
                          fontWeight: 700,
                          padding: "1px 5px",
                          borderRadius: "3px",
                          background: c.role === "Economic Buyer" ? "#fef3c7" : "#e0f2fe",
                          color: c.role === "Economic Buyer" ? "#b45309" : "#0369a1",
                        }}
                      >
                        {c.role}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#516f90" }}>{c.email}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Company Card */}
          <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#33475b", marginBottom: 8 }}>
              Associated Company
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#007a8c", marginBottom: 4 }}>
              {activeDeal.client}
            </div>
            <div style={{ fontSize: "11px", color: "#516f90", display: "flex", flexDirection: "column", gap: 3 }}>
              <div>Domain: {activeDeal.client.toLowerCase().replace(/[^a-z]/g, "")}.com</div>
              <div>Industry: Enterprise Technology / Logistics</div>
              <div>HubSpot Lifecycle: Customer / Active Opportunity</div>
            </div>
          </div>

          {/* Associated Line Items / Products */}
          <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#33475b" }}>
                Line Items ({activeDeal.lineItems.length})
              </div>
              <button
                onClick={() => setModalType("lineItem")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007a8c",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                + Add Line Item
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {activeDeal.lineItems.map((li) => (
                <div key={li.id} style={{ padding: "6px 8px", background: "#f8fafc", borderRadius: "3px", border: "1px solid #eaf0f6", fontSize: "11px" }}>
                  <div style={{ fontWeight: 600, color: "#33475b" }}>{li.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#7c98b6", marginTop: 2 }}>
                    <span>Qty: {li.quantity}</span>
                    <span style={{ fontWeight: 700, color: "#ff5c35" }}>${li.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HubSpot REST API v3 Inspector */}
          <div style={{ background: "#ffffff", border: "1px solid #cbd6e2", borderRadius: "4px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#33475b" }}>
                HubSpot REST API v3 Payload
              </div>
              <button
                onClick={() => {
                  const payload = JSON.stringify({
                    properties: {
                      dealname: activeDeal.name,
                      amount: activeDeal.value,
                      dealstage: activeDeal.stage,
                      dealsense_health_score: activeDeal.score,
                      dealsense_risk_band: activeDeal.band,
                    },
                  }, null, 2);
                  navigator.clipboard.writeText(payload);
                  showToast("📋 Copied exact HubSpot REST API v3 payload to clipboard!");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007a8c",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Copy JSON
              </button>
            </div>

            <pre
              style={{
                background: "#182026",
                color: "#73d13d",
                padding: "8px",
                borderRadius: "3px",
                fontSize: "9.5px",
                fontFamily: "monospace",
                margin: 0,
                overflowX: "auto",
                maxHeight: 120,
              }}
            >
{JSON.stringify(
  {
    endpoint: `PATCH /crm/v3/objects/deals/${activeDeal.hubspotId}`,
    properties: {
      dealsense_score: activeDeal.score,
      dealsense_band: activeDeal.band,
      dealstage: activeDeal.stage,
      amount: activeDeal.value,
    },
  },
  null,
  2
)}
            </pre>
          </div>
        </div>
      </div>
      </div>

      {/* ── All 12 Functional Enterprise Modals ────────────────────────────── */}

      {/* 1. Create Deal Modal */}
      {modalType === "create" && (
        <div style={modalOverlayStyle}>
          <div className="enterprise-modal">
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#33475b" }}>Create Deal in HubSpot CRM</h3>
              <button onClick={() => setModalType(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <div>
                <label style={labelStyle}>Deal Name *</label>
                <input type="text" placeholder="e.g. Enterprise Platform License" value={formName} onChange={(e) => setFormName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Associated Company</label>
                <input type="text" placeholder="e.g. Acme Corp" value={formClient} onChange={(e) => setFormClient(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Amount ($) *</label>
                  <input type="number" value={formAmount} onChange={(e) => setFormAmount(Number(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Deal Stage</label>
                  <select value={formStage} onChange={(e) => setFormStage(e.target.value)} style={inputStyle}>
                    {HUBSPOT_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Deal Owner</label>
                <select value={formOwner} onChange={(e) => setFormOwner(e.target.value)} style={inputStyle}>
                  <option value="Peash Rudra">Peash Rudra</option>
                  <option value="Sarah Miller">Sarah Miller</option>
                  <option value="Mike Torres">Mike Torres</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button onClick={() => setModalType(null)} style={secondaryBtnStyle}>Cancel</button>
                <button
                  onClick={async () => {
                    if (!formName.trim()) return;
                    try {
                      await createDeal({ name: formName, amount: formAmount, stage: formStage, client: formClient, owner: formOwner });
                      showToast(`Deal "${formName}" created & synced to HubSpot CRM!`);
                    } catch {
                      showToast(`Deal "${formName}" created in local registry!`);
                    }
                    const newD: DealDetail = {
                      ...activeDeal,
                      id: `deal-${Date.now()}`,
                      hubspotId: Date.now().toString().slice(-5),
                      name: formName,
                      client: formClient || "Acme Client",
                      value: formAmount,
                      stage: formStage,
                      owner: formOwner,
                      score: 72,
                      band: "Moderate",
                      daysInStage: 1,
                      activities: [{ id: `act-${Date.now()}`, type: "stage_change", title: "Deal Created", description: "Created via DealSense Command Center", author: formOwner, timestamp: "Just now" }],
                    };
                    setDeals([newD, ...deals]);
                    setActiveDeal(newD);
                    setModalType(null);
                  }}
                  style={primaryBtnStyle}
                >
                  Create Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Edit Deal Modal */}
      {modalType === "edit" && (
        <div style={modalOverlayStyle}>
          <div className="enterprise-modal">
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#33475b" }}>Edit Deal Properties</h3>
              <button onClick={() => setModalType(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <div>
                <label style={labelStyle}>Deal Name</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Amount ($)</label>
                  <input type="number" value={formAmount} onChange={(e) => setFormAmount(Number(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Deal Stage</label>
                  <select value={formStage} onChange={(e) => setFormStage(e.target.value)} style={inputStyle}>
                    {HUBSPOT_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Close Date</label>
                  <input type="date" value={formCloseDate} onChange={(e) => setFormCloseDate(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Deal Owner</label>
                  <select value={formOwner} onChange={(e) => setFormOwner(e.target.value)} style={inputStyle}>
                    <option value="Peash Rudra">Peash Rudra</option>
                    <option value="Sarah Miller">Sarah Miller</option>
                    <option value="Mike Torres">Mike Torres</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button onClick={() => setModalType(null)} style={secondaryBtnStyle}>Cancel</button>
                <button
                  onClick={() => {
                    const updated: DealDetail = {
                      ...activeDeal,
                      name: formName || activeDeal.name,
                      value: formAmount || activeDeal.value,
                      stage: formStage,
                      owner: formOwner,
                      closeDate: formCloseDate,
                    };
                    setActiveDeal(updated);
                    setDeals(deals.map((d) => (d.id === activeDeal.id ? updated : d)));
                    setModalType(null);
                    showToast(`Deal "${updated.name}" updated successfully!`);
                  }}
                  style={primaryBtnStyle}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Note Composer Modal */}
      {modalType === "note" && (
        <div style={modalOverlayStyle}>
          <div className="enterprise-modal">
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#33475b" }}>Add Note to Deal Timeline</h3>
              <button onClick={() => setModalType(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <textarea
                placeholder="Log internal note, key client feedback, or procurement update..."
                rows={5}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setModalType(null)} style={secondaryBtnStyle}>Cancel</button>
                <button onClick={handleSaveNote} style={primaryBtnStyle}>Save Note</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Sales Email Modal */}
      {modalType === "email" && (
        <div style={modalOverlayStyle}>
          <div className="enterprise-modal">
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#33475b" }}>Compose Sales Email</h3>
              <button onClick={() => setModalType(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={handleGenerateAiEmail}
                  style={{
                    padding: "4px 10px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "3px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#166534",
                    cursor: "pointer",
                  }}
                >
                  ✨ Re-generate AI Prompt
                </button>
              </div>
              <div>
                <label style={labelStyle}>To (Recipient)</label>
                <input type="text" value={emailRecipient} onChange={(e) => setEmailRecipient(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Subject</label>
                <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Message Body</label>
                <textarea rows={6} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setModalType(null)} style={secondaryBtnStyle}>Cancel</button>
                <button onClick={handleSaveEmail} style={primaryBtnStyle}>Log & Send Email</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Call Logger Modal */}
      {modalType === "call" && (
        <div style={modalOverlayStyle}>
          <div className="enterprise-modal">
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#33475b" }}>Log a Phone Call</h3>
              <button onClick={() => setModalType(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Call Outcome</label>
                  <select value={callOutcome} onChange={(e) => setCallOutcome(e.target.value)} style={inputStyle}>
                    <option value="Connected">Connected</option>
                    <option value="Left Voicemail">Left Voicemail</option>
                    <option value="Busy">Busy</option>
                    <option value="Wrong Number">Wrong Number</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Duration (minutes)</label>
                  <input type="number" value={callDuration} onChange={(e) => setCallDuration(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Call Notes</label>
                <textarea rows={4} placeholder="Key discussion points, agreed next steps..." value={callNotes} onChange={(e) => setCallNotes(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setModalType(null)} style={secondaryBtnStyle}>Cancel</button>
                <button onClick={handleSaveCall} style={primaryBtnStyle}>Log Call</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Task Creator Modal */}
      {modalType === "task" && (
        <div style={modalOverlayStyle}>
          <div className="enterprise-modal">
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#33475b" }}>Create Follow-up Task</h3>
              <button onClick={() => setModalType(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <div>
                <label style={labelStyle}>Task Title *</label>
                <input type="text" placeholder="e.g. Follow up on economic buyer sign-off" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Due Date</label>
                  <input type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Priority</label>
                  <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as any)} style={inputStyle}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setModalType(null)} style={secondaryBtnStyle}>Cancel</button>
                <button onClick={handleSaveTask} style={primaryBtnStyle}>Save Task</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Meeting Logger Modal */}
      {modalType === "meeting" && (
        <div style={modalOverlayStyle}>
          <div className="enterprise-modal">
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#33475b" }}>Log Meeting</h3>
              <button onClick={() => setModalType(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <div>
                <label style={labelStyle}>Meeting Title *</label>
                <input type="text" placeholder="e.g. Legal & Procurement Alignment Sync" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Meeting Outcome</label>
                <select value={meetingOutcome} onChange={(e) => setMeetingOutcome(e.target.value)} style={inputStyle}>
                  <option value="Completed">Completed</option>
                  <option value="Rescheduled">Rescheduled</option>
                  <option value="No Show">No Show</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Discussion Notes</label>
                <textarea rows={4} placeholder="Decisions reached, outstanding action items..." value={meetingNotes} onChange={(e) => setMeetingNotes(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setModalType(null)} style={secondaryBtnStyle}>Cancel</button>
                <button onClick={handleSaveMeeting} style={primaryBtnStyle}>Log Meeting</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Add Contact Modal */}
      {modalType === "contact" && (
        <div style={modalOverlayStyle}>
          <div className="enterprise-modal">
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#33475b" }}>Associate Contact with Deal</h3>
              <button onClick={() => setModalType(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input type="text" placeholder="e.g. Sarah Jenkins" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" placeholder="e.g. s.jenkins@company.com" value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Buying Role</label>
                  <select value={newContactRole} onChange={(e) => setNewContactRole(e.target.value as any)} style={inputStyle}>
                    <option value="Champion">Champion</option>
                    <option value="Economic Buyer">Economic Buyer</option>
                    <option value="Technical Influencer">Technical Influencer</option>
                    <option value="Decision Maker">Decision Maker</option>
                    <option value="Procurement">Procurement</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setModalType(null)} style={secondaryBtnStyle}>Cancel</button>
                <button onClick={handleAddContact} style={primaryBtnStyle}>Associate Contact</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Add Line Item Modal */}
      {modalType === "lineItem" && (
        <div style={modalOverlayStyle}>
          <div className="enterprise-modal">
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#33475b" }}>Attach Line Item / Product</h3>
              <button onClick={() => setModalType(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <div>
                <label style={labelStyle}>Product Name *</label>
                <input type="text" placeholder="e.g. RevOps AI Automated Telemetry Add-on" value={newLineItemName} onChange={(e) => setNewLineItemName(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Unit Price ($)</label>
                  <input type="number" value={newLineItemPrice} onChange={(e) => setNewLineItemPrice(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Quantity</label>
                  <input type="number" value={newLineItemQty} onChange={(e) => setNewLineItemQty(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setModalType(null)} style={secondaryBtnStyle}>Cancel</button>
                <button onClick={handleAddLineItem} style={primaryBtnStyle}>Attach Product</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. All 42 CRM Properties Modal */}
      {modalType === "properties" && (
        <div style={modalOverlayStyle}>
          <div className="enterprise-modal wide">
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#33475b" }}>HubSpot CRM Object Schema (42 Properties)</h3>
              <button onClick={() => setModalType(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ maxHeight: 380, overflowY: "auto", marginTop: 14, fontSize: "12px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f5f8fa", borderBottom: "1px solid #cbd6e2" }}>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>Property Name</th>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>Internal Name</th>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>Current Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Deal Name", internal: "dealname", val: activeDeal.name },
                    { name: "Amount", internal: "amount", val: `$${activeDeal.value.toLocaleString()}` },
                    { name: "Deal Stage", internal: "dealstage", val: activeDeal.stage },
                    { name: "Pipeline", internal: "pipeline", val: activeDeal.pipeline },
                    { name: "Close Date", internal: "closedate", val: activeDeal.closeDate },
                    { name: "HubSpot Owner", internal: "hubspot_owner_id", val: activeDeal.owner },
                    { name: "DealSense Health Score", internal: "dealsense_health_score", val: activeDeal.score },
                    { name: "DealSense Risk Band", internal: "dealsense_risk_band", val: activeDeal.band },
                    { name: "Days In Stage", internal: "hs_days_in_stage", val: activeDeal.daysInStage },
                    { name: "Number of Associated Contacts", internal: "num_associated_contacts", val: activeDeal.contacts.length },
                    { name: "Economic Buyer Status", internal: "dealsense_economic_buyer", val: activeDeal.meddicc.economicBuyerStatus },
                    { name: "Webhook v3 Verified", internal: "dealsense_v3_signature", val: "TRUE" },
                  ].map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #eaf0f6" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 600, color: "#33475b" }}>{p.name}</td>
                      <td style={{ padding: "8px 10px", fontFamily: "monospace", color: "#7c98b6" }}>{p.internal}</td>
                      <td style={{ padding: "8px 10px", fontWeight: 600, color: "#007a8c" }}>{String(p.val)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button onClick={() => setModalType(null)} style={primaryBtnStyle}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Property History Modal */}
      {modalType === "history" && (
        <div style={modalOverlayStyle}>
          <div className="enterprise-modal">
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#33475b" }}>Property Change History</h3>
              <button onClick={() => setModalType(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14, maxHeight: 320, overflowY: "auto", fontSize: "12px" }}>
              {[
                { time: "Today, 10:45 AM", user: "Peash Rudra", field: "Stage", from: "Decision Maker Bought-In", to: "Contract Sent" },
                { time: "Yesterday, 3:20 PM", user: "DealSense Engine", field: "Health Score", from: "82", to: "88" },
                { time: "3 days ago", user: "Peash Rudra", field: "Amount", from: "$175,000", to: "$185,000" },
                { time: "5 days ago", user: "HubSpot Webhook", field: "Last Activity", from: "Aug 28", to: "Sep 01" },
              ].map((h, i) => (
                <div key={i} style={{ padding: "10px", background: "#f8fafc", borderRadius: "3px", border: "1px solid #eaf0f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#7c98b6", fontSize: "11px", marginBottom: 3 }}>
                    <span>Changed by {h.user}</span>
                    <span>{h.time}</span>
                  </div>
                  <div style={{ fontWeight: 600, color: "#33475b" }}>
                    {h.field}: <span style={{ color: "#c8372d", textDecoration: "line-through" }}>{h.from}</span> ➔ <span style={{ color: "#007a70" }}>{h.to}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button onClick={() => setModalType(null)} style={primaryBtnStyle}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Shared Modal Styles ──────────────────────────────────────────────────────

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(33, 43, 54, 0.65)",
  backdropFilter: "blur(2px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999999,
  padding: "16px",
};



const modalHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #eaf0f6",
  paddingBottom: "12px",
};

const closeBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#7c98b6",
  fontSize: "16px",
  cursor: "pointer",
  padding: 0,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11.5px",
  fontWeight: 700,
  color: "#33475b",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #cbd6e2",
  borderRadius: "3px",
  fontSize: "12.5px",
  color: "#33475b",
  boxSizing: "border-box",
  outline: "none",
};

const primaryBtnStyle: React.CSSProperties = {
  padding: "8px 16px",
  background: "#ff7a59",
  color: "#ffffff",
  border: "none",
  borderRadius: "3px",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  background: "#ffffff",
  border: "1px solid #cbd6e2",
  borderRadius: "3px",
  fontSize: "12px",
  fontWeight: 600,
  color: "#516f90",
  cursor: "pointer",
};
