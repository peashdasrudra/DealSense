const fs = require('fs');

// 1. Fix HubSpotNativeActionQueue (remove handleReject completely if unused, or add a fake use)
let aqPath = 'apps/web-dashboard/src/pages/HubSpotNativeActionQueue.tsx';
let aqContent = fs.readFileSync(aqPath, 'utf8');
aqContent = aqContent.replace(/const handleReject = \([^)]+\) => \{[^}]+\};/s, '');
fs.writeFileSync(aqPath, aqContent, 'utf8');

// 2. Fix HubSpotNativePlaybooks (add missing state)
let pbPath = 'apps/web-dashboard/src/pages/HubSpotNativePlaybooks.tsx';
let pbContent = fs.readFileSync(pbPath, 'utf8');
if (!pbContent.includes('const [isUpgradeModalOpen')) {
    pbContent = pbContent.replace('const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);', 
    'const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);\n  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);');
}
pbContent = pbContent.replace(/import \{ ProGate \} from "\.\.\/components\/ProGate";\n/g, '');
fs.writeFileSync(pbPath, pbContent, 'utf8');

// 3. Fix HubSpotNativePipeline (change ExecutiveAuditModal to HubSpotNativeExecutiveAuditModal)
let pPath = 'apps/web-dashboard/src/pages/HubSpotNativePipeline.tsx';
let pContent = fs.readFileSync(pPath, 'utf8');
pContent = pContent.replace(/<ExecutiveAuditModal\s+deals=\{deals\}\s+isOpen=\{isAuditModalOpen\}\s+onClose=\{\(\) => setIsAuditModalOpen\(false\)\}\s+portalId=\{activePortal\.id\}\s+portalName=\{activePortal\.name\}\s+\/>/s,
`<HubSpotNativeExecutiveAuditModal 
        deals={deals}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        portalId={activePortal.id}
        portalName={activePortal.name}
      />`
);
pContent = pContent.replace('import { ExecutiveAuditModal } from "../components/ExecutiveAuditModal";', 'import { HubSpotNativeExecutiveAuditModal } from "../components/HubSpotNativeExecutiveAuditModal";');
fs.writeFileSync(pPath, pContent, 'utf8');
