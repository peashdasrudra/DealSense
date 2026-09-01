const fs = require("fs");
const path = require("path");

const basePath = "c:/Users/USER/Desktop/AiXpertLabs/DealSense/apps/web-dashboard/src/pages";

const pageSpecificText = {
  "DealWarRoom.tsx": ["Export Brief", "Create Intervention"],
  "PipelineWaterfall.tsx": ["Export Forecast", "Run Simulation"],
  "ActionQueue.tsx": ["Export Queue", "Approve All"],
  "ClientHealth.tsx": ["Export Report", "Log Activity"],
  "CompetitiveIntelligence.tsx": ["Export Battlecard", "Add Competitor"],
  "CrmHygiene.tsx": ["Export Hygiene Report", "Run Auto-Clean"],
  "DealExplorer.tsx": ["Export Deal List", "Create Deal"],
  "MutualActionPlan.tsx": ["Export MAP", "Add Milestone"],
  "RepPerformance.tsx": ["Export Performance", "Schedule Coaching"],
  "RevenueForecast.tsx": ["Export Forecast", "Adjust Targets"],
  "RevOpsPlaybooks.tsx": ["Export Playbook", "Create Playbook"],
  "RiskHeatmap.tsx": ["Export Heatmap", "Log Risk"],
  "StakeholderMatrix.tsx": ["Export Matrix", "Add Stakeholder"],
  "AuditLog.tsx": ["Export Log", "Filter Events"],
  "Settings.tsx": ["Export Config", "Save Changes"]
};

const files = fs.readdirSync(basePath).filter(f => f.endsWith(".tsx"));

for (const f of files) {
  const filePath = path.join(basePath, f);
  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;

  // Change HubSpot orange #ff7a59 to #ff5c35 for buttons
  if (content.includes('background: "#ff7a59"')) {
    content = content.replace(/background: "#ff7a59"/g, 'background: "#ff5c35"');
    modified = true;
  }

  // Rename buttons
  if (pageSpecificText[f]) {
    const [btn1, btn2] = pageSpecificText[f];
    if (content.includes("Export Report") && content.includes("Create Action")) {
      content = content.replace("Export Report", btn1).replace("Create Action", btn2);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("Updated", f);
  }
}

// Special fix for DealWarRoom duplicate header
const warRoomPath = path.join(basePath, "DealWarRoom.tsx");
let warRoomContent = fs.readFileSync(warRoomPath, "utf-8");

const oldHeaderStart = "{/* ── War Room Header ───────────────────────────────────────────── */}";
if (warRoomContent.includes(oldHeaderStart)) {
  // Regex to remove the entire block from the old header comment to the closing div of that card
  // This uses a non-greedy match to find the end of the card div that wraps it
  const regex = /\{\/\* ── War Room Header[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/;
  warRoomContent = warRoomContent.replace(regex, "");
  fs.writeFileSync(warRoomPath, warRoomContent, "utf-8");
  console.log("Removed duplicate header in DealWarRoom");
}
