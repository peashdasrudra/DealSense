const fs = require('fs');

let aqPath = 'apps/web-dashboard/src/pages/HubSpotNativeActionQueue.tsx';
let content = fs.readFileSync(aqPath, 'utf8');

// 1. Rename Component & Remove ProGate imports/wrappers
content = content.replace('export const ActionQueue: React.FC', 'export const HubSpotNativeActionQueue: React.FC');
content = content.replace('import { ProGate } from "../components/ProGate";', 'import { NativeUpgradeModal } from "../components/NativeUpgradeModal";');

// State
content = content.replace('const [actions, setActions] = useState<ActionItem[]>', 'const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);\n  const [actions, setActions] = useState<ActionItem[]>');

// Remove ProGate wrapper explicitly
content = content.replace(/<ProGate[^>]*>/, '');
content = content.replace(/<\/ProGate>$/, '');

// Replace return statement to wrap with Fragment and add Modal
content = content.replace('return (', 'return (\n    <>\n      <NativeUpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} featureName="Action Queue Write-back" />');

// Replace closing return tag properly (since we removed ProGate, the outer tag was <ProGate>, now we need to close </>)
content = content.replace(/;\n$/, ';\n'); // Just to anchor
let lines = content.split('\n');
for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('</ProGate>')) {
        lines[i] = lines[i].replace('</ProGate>', '</>');
        break;
    }
}
content = lines.join('\n');


// Action Buttons -> open upgrade modal instead of executing
content = content.replace(/onClick=\{\(\) => handleApprove\(action\.id\)\}/g, 'onClick={() => setIsUpgradeModalOpen(true)}');
content = content.replace(/onClick=\{\(\) => handleReject\(action\.id\)\}/g, 'onClick={() => setIsUpgradeModalOpen(true)}');

// Light Mode Replacements
const replacements = {
    'var(--hs-background)': '#ffffff',
    'var(--hs-border-dark)': '#dfe3eb',
    'var(--hs-border)': '#dfe3eb',
    'var(--hs-text-muted)': '#516f90',
    'var(--hs-text)': '#33475b',
    'background: "#092124"': 'background: "#f5f8fa"',
    'background: "#0f172a"': 'background: "#ffffff"',
    'background: "#1e293b"': 'background: "#ffffff"',
    'color: "#ffffff"': 'color: "#33475b"',
    'color: "#f8fafc"': 'color: "#33475b"',
    'color: "#94a3b8"': 'color: "#516f90"',
    'border: "1px solid rgba(255,255,255,0.1)"': 'border: "1px solid #dfe3eb"',
    'border: "1px solid rgba(255,255,255,0.05)"': 'border: "1px solid #dfe3eb"',
    'var(--danger)': '#f2545b',
    'var(--warning)': '#f5c26b',
    'var(--success)': '#00bda5',
    'var(--hs-primary)': '#ff7a59',
};

for (const [oldStr, newStr] of Object.entries(replacements)) {
    content = content.split(oldStr).join(newStr);
}

fs.writeFileSync(aqPath, content, 'utf8');
