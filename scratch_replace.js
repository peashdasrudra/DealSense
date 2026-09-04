const fs = require('fs');

const files = [
    { path: 'apps/web-dashboard/src/pages/HubSpotNativeActionQueue.tsx', oldName: 'ActionQueue', newName: 'HubSpotNativeActionQueue' },
    { path: 'apps/web-dashboard/src/pages/HubSpotNativePlaybooks.tsx', oldName: 'RevOpsPlaybooks', newName: 'HubSpotNativePlaybooks' }
];

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

for (const file of files) {
    let content = fs.readFileSync(file.path, 'utf8');
    content = content.replace(`export const ${file.oldName}: React.FC = () => {`, `export const ${file.newName}: React.FC = () => {`);
    
    // Also remove the <ProGate> wrapper since we will gate execution, not the view
    content = content.replace(/<ProGate[^>]*>/g, '<div style={{ flex: 1 }}>');
    content = content.replace(/<\/ProGate>/g, '</div>');

    for (const [oldStr, newStr] of Object.entries(replacements)) {
        content = content.split(oldStr).join(newStr);
    }
    fs.writeFileSync(file.path, content, 'utf8');
}
