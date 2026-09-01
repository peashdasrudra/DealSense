const fs = require("fs");
const path = require("path");

const basePath = "c:/Users/USER/Desktop/AiXpertLabs/DealSense/apps/web-dashboard/src/pages";
const files = fs.readdirSync(basePath).filter(f => f.endsWith(".tsx"));

for (const f of files) {
  const filePath = path.join(basePath, f);
  let content = fs.readFileSync(filePath, "utf-8");
  
  // Replace the teal background and border with orange versions matching HubSpot #ff7a59
  content = content.replace(/rgba\(0, 164, 189, 0\.1\)/g, "rgba(255, 122, 89, 0.1)");
  content = content.replace(/rgba\(0, 164, 189, 0\.4\)/g, "rgba(255, 122, 89, 0.3)");
  
  fs.writeFileSync(filePath, content, "utf-8");
}
console.log("Fixed badge colors.");
