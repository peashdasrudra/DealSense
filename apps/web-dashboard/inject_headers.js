const fs = require("fs");
const path = require("path");

const files = [
  {
    name: "RiskHeatmap.tsx",
    title: "Pipeline Risk Heatmap",
    badgeTitle: "● REVOPS PIPELINE TELEMETRY",
    badgeSub: "Stage vs Severity Matrix",
    desc: "Visualize deal concentration across risk severity and pipeline stages. Identify critical choke points where high-value deals are rotting."
  },
  {
    name: "StakeholderMatrix.tsx",
    title: "Stakeholder Power Matrix",
    badgeTitle: "● REVOPS PIPELINE TELEMETRY",
    badgeSub: "Buying Committee Fragility",
    desc: "Detect single-threaded fragility. Ensure economic buyers, champions, and legal contacts are engaged before committing deals to the forecast."
  },
  {
    name: "DealWarRoom.tsx",
    title: "Deal War Room",
    badgeTitle: "● REVOPS PIPELINE TELEMETRY",
    badgeSub: "Executive Deal Review",
    desc: "Conduct QBR-grade Friday pipeline reviews. Rapidly drill into high-value at-risk deals and trigger executive multi-threading interventions."
  }
];

const basePath = path.resolve(__dirname, "src/pages");

for (const file of files) {
  const filePath = path.join(basePath, file.name);
  let content = fs.readFileSync(filePath, "utf-8");

  const headerHtml = `
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      {/* ── Header Card ───────────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #124548 0%, #062b2e 100%)",
          color: "#ffffff",
          padding: "26px 30px",
          border: "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge" style={{ background: "rgba(0, 164, 189, 0.25)", color: "#7de2ea", border: "1px solid #00a4bd", fontWeight: 700 }}>
                ${file.badgeTitle}
              </span>
              <span style={{ fontSize: "12px", color: "#a5c2c4" }}>${file.badgeSub}</span>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "4px 0 6px" }}>
              ${file.title}
            </h2>
            <p style={{ fontSize: "13.5px", color: "#d9e8e8", margin: 0, maxWidth: 680 }}>
              ${file.desc}
            </p>
          </div>
        </div>
      </div>
  `;

  // find the first return (
  // and replace the following <div> with the new header
  const regex = /return\s*\(\s*<div[^>]*>/;
  const match = content.match(regex);
  
  if (match) {
    // Only apply if it doesn't already have Header Card
    if (!content.includes("Header Card")) {
      content = content.replace(regex, match[0].replace(/<div[^>]*>/, headerHtml));
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(\`Updated \${file.name}\`);
    } else {
      console.log(\`Already updated \${file.name}\`);
    }
  } else {
    console.log(\`Could not find return statement in \${file.name}\`);
  }
}
