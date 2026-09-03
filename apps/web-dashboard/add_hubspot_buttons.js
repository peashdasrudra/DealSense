const fs = require("fs");
const path = require("path");

const basePath = path.resolve(__dirname, "src/pages");
const files = fs.readdirSync(basePath).filter(f => f.endsWith(".tsx") && f !== "PortfolioOverview.tsx");

const hubspotButtons = `
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <button
              style={{
                padding: "6px 14px",
                background: "#ffffff",
                color: "var(--hs-text)",
                border: "1px solid var(--hs-border-dark)",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s"
              }}
            >
              Export Report
            </button>
            <button
              style={{
                padding: "6px 14px",
                background: "#ff7a59",
                color: "#ffffff",
                border: "none",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s"
              }}
            >
              Create Action
            </button>
          </div>`;

for (const f of files) {
  const filePath = path.join(basePath, f);
  let content = fs.readFileSync(filePath, "utf-8");
  
  // 1. Convert blue Revops Pipeline Telemetry to orange
  content = content.replace(/background: "rgba\(0, 164, 189, 0\.1\)", color: "#00a4bd", border: "1px solid rgba\(0, 164, 189, 0\.2\)"/g, 
                            'background: "rgba(255, 92, 53, 0.1)", color: "#ff7a59", border: "1px solid rgba(255, 92, 53, 0.2)"');
                            
  content = content.replace(/background: "rgba\(0, 164, 189, 0\.25\)", color: "#00a4bd"/g, 
                            'background: "rgba(255, 92, 53, 0.1)", color: "#ff7a59"');
                            
  content = content.replace(/color: "#00a4bd"/g, 'color: "#ff7a59"');

  // 2. Inject HubSpot Buttons if not already present
  if (!content.includes("Export Report")) {
    // Find the end of the text div inside the header
    const match = content.match(/<\/p>\s*<\/div>/);
    if (match) {
      content = content.replace(/<\/p>\s*<\/div>/, `</p>\n          </div>${hubspotButtons}`);
    }
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log("Updated", f);
}
