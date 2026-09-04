const fs = require('fs');

let path = 'apps/web-dashboard/src/pages/HubSpotNativePipeline.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Import Replacement
content = content.replace(
  'import { ExecutiveAuditModal } from "../components/ExecutiveAuditModal";',
  'import { HubSpotNativeExecutiveAuditModal } from "../components/HubSpotNativeExecutiveAuditModal";'
);

// 2. Component Usage Replacement
const target = `<ExecutiveAuditModal
        deals={deals}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        portalId={activePortal.id}
        portalName={activePortal.name}
      />`;
      
const replacement = `<HubSpotNativeExecutiveAuditModal
        deals={deals}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        portalId={activePortal.id}
        portalName={activePortal.name}
      />`;

content = content.replace(target, replacement);

fs.writeFileSync(path, content, 'utf8');
