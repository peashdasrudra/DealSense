const fs = require("fs");
const path = require("path");

const pages = [
  {
    name: "RevenueForecast.tsx",
    badgeSub: "Revenue Forecast",
    title: "Multi-Model AI Revenue Forecasting",
    desc: "Compare rep-committed forecasts against manager stage-weighted and AI-adjusted projections. Detect pipeline risks before they impact the quarter.",
    removePattern: /\{\/\* ── Status Banner ──.*?<\/div>\n\s*<\/div>/s
  },
  {
    name: "DealExplorer.tsx",
    badgeSub: "Deal Dossiers & MEDDICC",
    title: "Deal Inspector & Pipeline Intelligence",
    desc: "Deep dive into individual deal dossiers. Review automated MEDDICC scoring, surface hidden risk factors, and trigger executive interventions.",
    removePattern: null
  },
  {
    name: "DealWarRoom.tsx",
    badgeSub: "Executive Deal Review",
    title: "Deal War Room & Executive QBR Decision Matrix",
    desc: "Live decision hub for closing high-ticket stalled deals this month. Evaluate single-threaded risks, unblock economic buyers, and trigger interventions.",
    removePattern: /\{\/\* ── War Room Header ──.*?<\/div>\n\s*<\/div>\n\s*<\/div>/s
  },
  {
    name: "StakeholderMatrix.tsx",
    badgeSub: "Buying Committee Fragility",
    title: "Stakeholder Power Matrix",
    desc: "Detect single-threaded fragility. Ensure economic buyers, champions, and legal contacts are engaged before committing deals to the forecast.",
    removePattern: /\{\/\* ── Header ──.*?<\/div>\n\s*<\/div>\n\s*<\/div>/s
  },
  {
    name: "RiskHeatmap.tsx",
    badgeSub: "Stage vs Severity Matrix",
    title: "Pipeline Risk Heatmap",
    desc: "Visualize deal concentration across risk severity and pipeline stages. Identify critical choke points where high-value deals are rotting.",
    removePattern: null
  },
  {
    name: "ActionQueue.tsx",
    badgeSub: "Action Batching & Approval",
    title: "Action Approval Queue",
    desc: "Review, approve, and dispatch automated RevOps interventions. DealSense algorithms suggest the optimal action to unstick pipeline bottlenecks.",
    removePattern: null
  },
  {
    name: "CrmHygiene.tsx",
    badgeSub: "Automated Data Remediation",
    title: "CRM Hygiene & Remediation Engine",
    desc: "Detect missing properties, stale close dates, and unassigned deals autonomously. Fix pipeline data integrity issues before they skew your forecast.",
    removePattern: null
  },
  {
    name: "MutualActionPlan.tsx",
    badgeSub: "Client Onboarding & Alignment",
    title: "Mutual Action Plans (MAPs)",
    desc: "Collaborative buyer-seller playbooks. Sync milestones with HubSpot tasks, track execution speed, and eliminate late-stage legal delays.",
    removePattern: /<div style=\{\{\s*fontSize: "13px".*?<\/div>/s
  },
  {
    name: "CompetitiveIntelligence.tsx",
    badgeSub: "Competitive Battlecards",
    title: "AI-Powered Competitive Intelligence",
    desc: "Equip your reps with real-time battlecards. Counter objections, highlight key differentiators, and track win rates against major competitors.",
    removePattern: /\{\/\* ── Top Header ──.*?<\/div>\n\s*<\/div>/s
  },
  {
    name: "RepPerformance.tsx",
    badgeSub: "Rep Coaching & Enablement",
    title: "Rep Performance & Coaching",
    desc: "Identify coaching opportunities across your sales floor. Analyze velocity gaps, win rates, and pipeline generation per AE.",
    removePattern: /\{\/\* ── Top Header ──.*?<\/div>\n\s*<\/div>/s
  },
  {
    name: "ClientHealth.tsx",
    badgeSub: "Customer Success & Churn Risk",
    title: "Client Health & Expansion Radar",
    desc: "Monitor post-sale product adoption and stakeholder sentiment. Proactively address churn risks and identify white-space expansion opportunities.",
    removePattern: /\{\/\* ── Top Header ──.*?<\/div>\n\s*<\/div>/s
  }
];

const basePath = "c:/Users/USER/Desktop/AiXpertLabs/DealSense/apps/web-dashboard/src/pages";

const generateHeader = (badgeSub, title, desc) => `
      {/* ── Enterprise Header ─────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #124548 0%, #062b2e 100%)",
          color: "#ffffff",
          padding: "20px 24px",
          border: "none",
          marginBottom: "var(--sp-5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge" style={{ background: "rgba(0, 164, 189, 0.25)", color: "#7de2ea", border: "1px solid rgba(0, 164, 189, 0.4)", fontWeight: 700, padding: "2px 8px", fontSize: "9.5px", letterSpacing: "0.05em" }}>
                ● REVOPS PIPELINE TELEMETRY
              </span>
              <span style={{ fontSize: "11.5px", color: "#a5c2c4", fontWeight: 500 }}>${badgeSub}</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
              ${title}
            </h2>
            <p style={{ fontSize: "13px", color: "#d9e8e8", margin: 0, maxWidth: 680, lineHeight: 1.5 }}>
              ${desc}
            </p>
          </div>
        </div>
      </div>
`;

for (const p of pages) {
  const filePath = path.join(basePath, p.name);
  if (!fs.existsSync(filePath)) {
    console.log("Not found:", p.name);
    continue;
  }
  let content = fs.readFileSync(filePath, "utf-8");

  // Step 1: Remove old mini headers / generic headers if they exist
  if (p.removePattern) {
    content = content.replace(p.removePattern, "");
  }

  // Also remove any existing "Header Card" or "Enterprise Header" to ensure idempotency
  const existingHeaderRegex = /\{\/\* ── (?:Header Card|Enterprise Header|War Room Header|Header) ──.*?<\/div>\n\s*<\/div>\n\s*<\/div>/s;
  content = content.replace(existingHeaderRegex, "");
  
  const returnDivRegex = /return\s*\(\s*(<div[^>]*>)/;
  const match = content.match(returnDivRegex);
  
  if (match) {
    const headerStr = generateHeader(p.badgeSub, p.title, p.desc);
    content = content.replace(returnDivRegex, `return (\n  $1${headerStr}`);
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("Updated", p.name);
  } else {
    console.log("Could not find return div in", p.name);
  }
}
