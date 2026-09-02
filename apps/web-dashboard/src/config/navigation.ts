/**
 * DealSense Centralized Navigation & Links Registry.
 *
 * Single Source of Truth for:
 * 1. All Application Routes (Landing, Agency Fleet, Dashboard, War Room, Forecast, etc.)
 * 2. Section Anchors (Pricing, FAQ, Guarantee, Features, Architecture)
 * 3. Contact Channels (Architect Email, LinkedIn, GitHub, Monorepo)
 * 4. Helper navigation & smooth scrolling functions
 */

export interface NavLinkItem {
  id: string;
  label: string;
  path: string;
  category: "Landing & Marketing" | "Core Intelligence" | "Risk Governance" | "Architecture & Docs" | "External & Contact";
  type: "route" | "anchor" | "external" | "action";
  description: string;
  badge?: string;
}

// ── 1. Application Routes ───────────────────────────────────────────────────

export const APP_ROUTES = {
  // Public & Conversion Surfaces
  LANDING: "/",
  AGENCY_FLEET: "/agency",
  CASE_STUDY: "/case-study",
  NAV_TEST: "/nav-test",

  // Core Platform Pages
  PIPELINE: "/pipeline",
  FORECAST: "/forecast",
  DEALS: "/deals",
  WAR_ROOM: "/war-room",
  WATERFALL: "/waterfall",
  STAKEHOLDERS: "/stakeholders",
  HEATMAP: "/heatmap",
  ACTIONS: "/actions",
  MAP: "/map",
  BATTLECARDS: "/battlecards",
  PLAYBOOKS: "/playbooks",
  HYGIENE: "/hygiene",
  REPS: "/reps",
  CLIENTS: "/clients",
  AUDIT: "/audit",
  SETTINGS: "/settings",
} as const;

// ── 2. Section Anchors ──────────────────────────────────────────────────────

export const SECTION_ANCHORS = {
  PRICING_MATRIX: "pricing-matrix",
  FAQ: "faq",
  GUARANTEE: "guarantee",
  FEATURES: "features",
  HOW_IT_WORKS: "how-it-works",
  AGENCY_COCKPIT: "cockpit",
  AGENCY_PRICING: "pricing",
  AGENCY_COMPARISON: "comparison",
} as const;

// ── 3. Contact & Architect Channels ─────────────────────────────────────────

export const CONTACT_LINKS = {
  ARCHITECT_NAME: "Peash Das Rudra",
  ARCHITECT_ROLE: "Lead AI Architect · AiXpert Labs",
  EMAIL: "peashdasrudra@gmail.com",
  EMAIL_AUDIT: "mailto:peashdasrudra@gmail.com?subject=DealSense%20Pilot%20Risk%20Audit%20Inquiry",
  EMAIL_AGENCY: "mailto:peashdasrudra@gmail.com?subject=DealSense%20Agency%20Fleet%20Arbitrage%20Inquiry",
  EMAIL_CUSTOM_APP: "mailto:peashdasrudra@gmail.com?subject=Custom%20AI%20HubSpot%20App%20Inquiry%20($1500%20Sprint)",
  EMAIL_MEETING: "mailto:peashdasrudra@gmail.com?subject=DealSense%201-on-1%20Architecture%20Call%20Request",
  LINKEDIN: "https://www.linkedin.com/in/peashdasrudra",
  GITHUB: "https://github.com/peashdasrudra",
  REPO: "https://github.com/peashdasrudra/DealSense",
} as const;

// ── 4. Complete Testable Links Registry ──────────────────────────────────────

export const ALL_NAV_ITEMS: NavLinkItem[] = [
  // Landing & Marketing
  {
    id: "nav-landing",
    label: "Main Landing Page",
    path: "/",
    category: "Landing & Marketing",
    type: "route",
    description: "Public landing page with live telemetry, product tour, comparison dock, and pricing.",
  },
  {
    id: "nav-agency",
    label: "Agency Partner Fleet",
    path: "/agency",
    category: "Landing & Marketing",
    type: "route",
    badge: "72% OFF",
    description: "Multi-tenant white-label arbitrage portal with interactive client switcher.",
  },
  {
    id: "nav-pricing-anchor",
    label: "Pricing Matrix Section",
    path: "/#pricing-matrix",
    category: "Landing & Marketing",
    type: "anchor",
    description: "Scrolls directly to 3-tier software ownership pricing cards ($99, $1.5K, $3.5K).",
  },
  {
    id: "nav-faq-anchor",
    label: "Interactive FAQ Accordion",
    path: "/#faq",
    category: "Landing & Marketing",
    type: "anchor",
    description: "Scrolls directly to interactive expandable FAQ accordion.",
  },
  {
    id: "nav-guarantee-anchor",
    label: "$25K Revenue Guarantee & Architect Hub",
    path: "/#guarantee",
    category: "Landing & Marketing",
    type: "anchor",
    description: "Scrolls directly to Lead Architect contact hub & guarantee.",
  },

  // Core Intelligence Pages
  {
    id: "nav-pipeline",
    label: "Pipeline Dashboard",
    path: "/pipeline",
    category: "Core Intelligence",
    type: "route",
    description: "Overview dashboard with deal health cards, onboarding ribbon, and active triage.",
  },
  {
    id: "nav-deals",
    label: "Deal Inspector & Dossiers",
    path: "/deals",
    category: "Core Intelligence",
    type: "route",
    description: "7-vector deterministic risk scoring table with slide-over drawer inspections.",
  },
  {
    id: "nav-forecast",
    label: "Revenue Simulation & Forecast",
    path: "/forecast",
    category: "Core Intelligence",
    type: "route",
    description: "Monte Carlo weighted probability scenarios and quarter-end slippage simulation.",
  },
  {
    id: "nav-war-room",
    label: "Deal War Room (QBR)",
    path: "/war-room",
    category: "Core Intelligence",
    type: "route",
    description: "Executive MEDDICC scrutiny engine with automated rep action plan generator.",
  },
  {
    id: "nav-waterfall",
    label: "Pipeline Waterfall & Velocity",
    path: "/waterfall",
    category: "Core Intelligence",
    type: "route",
    description: "Stage-by-stage pipeline progression velocity and deal stall metrics.",
  },

  // Risk Governance
  {
    id: "nav-stakeholders",
    label: "Stakeholder Power Matrix",
    path: "/stakeholders",
    category: "Risk Governance",
    type: "route",
    description: "Influence vs. sentiment grid identifying silent economic buyer risks.",
  },
  {
    id: "nav-heatmap",
    label: "Pipeline Risk Heatmap",
    path: "/heatmap",
    category: "Risk Governance",
    type: "route",
    description: "Multi-dimensional visual matrix of deals grouped by risk severity & owner.",
  },
  {
    id: "nav-actions",
    label: "Action Approval Queue",
    path: "/actions",
    category: "Risk Governance",
    type: "route",
    description: "AI deal rescue recommendations requiring 1-click human approval.",
  },
  {
    id: "nav-map",
    label: "Mutual Action Plans (MAP)",
    path: "/map",
    category: "Risk Governance",
    type: "route",
    description: "Shared buyer milestones, contract checklists, and legal sign-off tracker.",
  },
  {
    id: "nav-battlecards",
    label: "Competitive Battlecards",
    path: "/battlecards",
    category: "Risk Governance",
    type: "route",
    description: "Live competitor landmine detection with objection handling scripts.",
  },
  {
    id: "nav-playbooks",
    label: "Autonomous Playbooks",
    path: "/playbooks",
    category: "Risk Governance",
    type: "route",
    description: "Automated trigger-action remediation workflows for HubSpot deals.",
  },
  {
    id: "nav-hygiene",
    label: "CRM Hygiene & Remediation",
    path: "/hygiene",
    category: "Risk Governance",
    type: "route",
    description: "Stale field scanner, overdue tasks, and missing contact audit.",
  },
  {
    id: "nav-reps",
    label: "Rep Risk Profiles",
    path: "/reps",
    category: "Risk Governance",
    type: "route",
    description: "Individual sales rep forecast accuracy and deal slippage propensity.",
  },
  {
    id: "nav-clients",
    label: "Client Health Scorecards",
    path: "/clients",
    category: "Risk Governance",
    type: "route",
    description: "Account-level multi-deal retention and expansion health monitoring.",
  },
  {
    id: "nav-audit",
    label: "Audit & Compliance Trail",
    path: "/audit",
    category: "Risk Governance",
    type: "route",
    description: "Immutable log of all AI risk calculations and HubSpot write-backs.",
  },
  {
    id: "nav-settings",
    label: "Settings & Weighting Engine",
    path: "/settings",
    category: "Risk Governance",
    type: "route",
    description: "Custom scoring weight sliders, webhook URLs, and API credentials.",
  },

  // Architecture & Docs
  {
    id: "nav-case-study",
    label: "Architecture Case Study",
    path: "/case-study",
    category: "Architecture & Docs",
    type: "route",
    description: "Full production monorepo technical dossier with architecture diagrams.",
  },
  {
    id: "nav-test-page",
    label: "Interactive Link & CTA Test Suite",
    path: "/nav-test",
    category: "Architecture & Docs",
    type: "route",
    badge: "DEV TOOL",
    description: "Live tester tool to verify all buttons, CTAs, anchors, and modal triggers.",
  },

  // External & Contact Channels
  {
    id: "nav-mail-meeting",
    label: "Book 1-on-1 Call (Lead Architect)",
    path: CONTACT_LINKS.EMAIL_MEETING,
    category: "External & Contact",
    type: "external",
    description: "Opens default email client with pre-filled subject to book architecture call.",
  },
  {
    id: "nav-linkedin",
    label: "LinkedIn Profile (Peash Das Rudra)",
    path: CONTACT_LINKS.LINKEDIN,
    category: "External & Contact",
    type: "external",
    description: "Direct link to Lead AI Architect LinkedIn profile.",
  },
  {
    id: "nav-github-profile",
    label: "GitHub Profile",
    path: CONTACT_LINKS.GITHUB,
    category: "External & Contact",
    type: "external",
    description: "Direct link to creator's GitHub profile.",
  },
  {
    id: "nav-github-repo",
    label: "GitHub Monorepo Source Code",
    path: CONTACT_LINKS.REPO,
    category: "External & Contact",
    type: "external",
    description: "Direct link to DealSense monorepo repository.",
  },
];

// ── 5. Robust Smooth Scrolling Helper ────────────────────────────────────────

/**
 * Smoothly scrolls to an element on the current page with top header offset compensation.
 * If target element is not found, smoothly scrolls to top.
 */
export function scrollToSection(elementId: string, headerOffset = 74): boolean {
  const cleanId = elementId.replace(/^#/, "");
  const target = document.getElementById(cleanId);

  if (target) {
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth",
    });
    return true;
  }

  return false;
}

/**
 * Universal Navigation Helper:
 * If navigating to an anchor on the same page, scrolls smoothly.
 * If navigating to another page with an anchor (e.g. `/#pricing-matrix`), navigates and scrolls.
 */
export function navigateToDestination(
  destination: string,
  currentPath: string,
  navigateFn: (path: string) => void
): void {
  if (destination.startsWith("mailto:") || destination.startsWith("http://") || destination.startsWith("https://")) {
    window.open(destination, "_blank", "noopener,noreferrer");
    return;
  }

  if (destination.includes("#")) {
    const [pathPart, hashPart] = destination.split("#");
    const targetPath = pathPart || "/";

    if (currentPath === targetPath) {
      scrollToSection(hashPart);
    } else {
      navigateFn(destination);
    }
    return;
  }

  navigateFn(destination);
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}
