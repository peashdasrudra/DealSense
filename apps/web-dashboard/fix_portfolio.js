const fs = require("fs");

const filePath = "c:/Users/USER/Desktop/AiXpertLabs/DealSense/apps/web-dashboard/src/pages/PortfolioOverview.tsx";
let content = fs.readFileSync(filePath, "utf-8");

// Fix banner flex
content = content.replace(
  /style=\{\{\s*background:\s*"#ffffff",\s*padding:\s*"20px 24px",\s*border:\s*"1px solid var\(--hs-border-dark\)",\s*borderTop:\s*"3px solid var\(--hs-primary\)",\s*marginBottom:\s*"var\(--sp-5\)",\s*boxShadow:\s*"var\(--shadow-sm\)",\s*\}\}/g,
  `style={{
            background: "#ffffff",
            padding: "24px 28px",
            border: "1px solid var(--hs-border-dark)",
            borderTop: "3px solid var(--hs-primary)",
            boxShadow: "var(--shadow-sm)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            height: "100%",
            minHeight: "320px",
          }}`
);

// Fix banner button colors to match white theme
content = content.replace(
  /background: "rgba\(255,255,255,0\.1\)", color: "#fff"/g,
  'background: "#f8f9fa", color: "var(--hs-text)"'
);
content = content.replace(
  /border: "1px solid rgba\(255,255,255,0\.2\)"/g,
  'border: "1px solid var(--hs-border-dark)"'
);

// Fix chart height
content = content.replace(
  /<div className="card-body" style=\{\{ height: "calc\(100% - 60px\)", padding: "10px 20px" \}\}>/g,
  '<div className="card-body" style={{ flex: 1, padding: "10px 20px 20px" }}>'
);
content = content.replace(
  /style=\{\{ height: "100%", margin: 0 \}\}/g,
  'style={{ height: "100%", margin: 0, display: "flex", flexDirection: "column", minHeight: "320px" }}'
);
content = content.replace(
  /<div className="card-header" style=\{\{ paddingBottom: 0 \}\}>/g,
  '<div className="card-header" style={{ paddingBottom: 0, borderBottom: "none" }}>'
);

fs.writeFileSync(filePath, content, "utf-8");
console.log("Updated PortfolioOverview.tsx");
