const fs = require('fs');

let aqPath = 'apps/web-dashboard/src/pages/HubSpotNativeActionQueue.tsx';
let content = fs.readFileSync(aqPath, 'utf8');

// Fix the return statement
content = content.replace(/return \(\s*<>\s*<NativeUpgradeModal[^>]*>\s*<div\s*<NativeUpgradeModal[^>]*> style=\{\{ flex: 1 \}\}>/s, 
`return (
    <>
      <NativeUpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} featureName="Action Queue Write-back" />
      <div style={{ flex: 1 }}>`);
fs.writeFileSync(aqPath, content, 'utf8');

let pbPath = 'apps/web-dashboard/src/pages/HubSpotNativePlaybooks.tsx';
let pbContent = fs.readFileSync(pbPath, 'utf8');
pbContent = pbContent.replace(/return \(\s*<>\s*<NativeUpgradeModal[^>]*>\s*<div\s*<NativeUpgradeModal[^>]*> style=\{\{ flex: 1 \}\}>/s, 
`return (
    <>
      <NativeUpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} featureName="Automated Playbooks" />
      <div style={{ flex: 1 }}>`);
fs.writeFileSync(pbPath, pbContent, 'utf8');
