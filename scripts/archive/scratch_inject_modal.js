const fs = require('fs');

// 1. Inject Modal into ActionQueue
let actionQueuePath = 'apps/web-dashboard/src/pages/HubSpotNativeActionQueue.tsx';
let aqContent = fs.readFileSync(actionQueuePath, 'utf8');

// Add import
if (!aqContent.includes('NativeUpgradeModal')) {
    aqContent = aqContent.replace('import { fetchActions', 'import { NativeUpgradeModal } from "../components/NativeUpgradeModal";\nimport { fetchActions');
}

// Add state
if (!aqContent.includes('const [isUpgradeModalOpen')) {
    aqContent = aqContent.replace('const [actions, setActions] = useState', 'const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);\n  const [actions, setActions] = useState');
}

// Replace button onClick handlers to open modal instead of executing
aqContent = aqContent.replace(/onClick=\{\(\) => handleDecision\(item.id, "approved"\)\}/g, 'onClick={() => setIsUpgradeModalOpen(true)}');
aqContent = aqContent.replace(/onClick=\{\(\) => handleDecision\(item.id, "rejected"\)\}/g, 'onClick={() => setIsUpgradeModalOpen(true)}');
aqContent = aqContent.replace(/<div className="flex-col gap-6">/g, '<NativeUpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} featureName="HubSpot Automation" />\n      <div className="flex-col gap-6">');
// Note: If flex-col gap-6 isn't the wrapper, I'll inject it just inside the return statement:
aqContent = aqContent.replace('return (\n    <div', 'return (\n    <div\n      <NativeUpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} featureName="HubSpot Automation" />');
// Wait, return ( <div ... ) structure might vary. Let's just do a generic replacement after `return (`
aqContent = aqContent.replace(/return \(\s*<div/i, 'return (\n    <>\n      <NativeUpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} featureName="Action Queue Write-back" />\n      <div');
aqContent = aqContent.replace(/(\n\s*)<\/div>\n\s*\);/i, '$1</div>\n    </>\n  );');

fs.writeFileSync(actionQueuePath, aqContent, 'utf8');


// 2. Inject Modal into Playbooks
let playbooksPath = 'apps/web-dashboard/src/pages/HubSpotNativePlaybooks.tsx';
let pbContent = fs.readFileSync(playbooksPath, 'utf8');

if (!pbContent.includes('NativeUpgradeModal')) {
    pbContent = pbContent.replace('import { motion', 'import { NativeUpgradeModal } from "../components/NativeUpgradeModal";\nimport { motion');
}

if (!pbContent.includes('const [isUpgradeModalOpen')) {
    pbContent = pbContent.replace('const [selectedPlaybook', 'const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);\n  const [selectedPlaybook');
}

pbContent = pbContent.replace(/onClick=\{handleDeploy\}/g, 'onClick={() => setIsUpgradeModalOpen(true)}');
pbContent = pbContent.replace(/return \(\s*<div/i, 'return (\n    <>\n      <NativeUpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} featureName="Automated Playbooks" />\n      <div');
pbContent = pbContent.replace(/(\n\s*)<\/div>\n\s*\);/i, '$1</div>\n    </>\n  );');

fs.writeFileSync(playbooksPath, pbContent, 'utf8');
