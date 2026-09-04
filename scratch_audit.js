const fs = require('fs');

let path = 'apps/web-dashboard/src/components/HubSpotNativeExecutiveAuditModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// Rename component and remove BookTriageModal imports
content = content.replace('export const ExecutiveAuditModal: React.FC', 'import { NativeUpgradeModal } from "./NativeUpgradeModal";\n\nexport const HubSpotNativeExecutiveAuditModal: React.FC');
content = content.replace(/import \{ BookTriageModal \} from "\.\/BookTriageModal";\n?/g, '');

// Swap booking state with upgrade state
content = content.replace('const [isBookingOpen, setIsBookingOpen] = useState(false);', 'const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);');
content = content.replace(/const \[bookingTier, setBookingTier\] = useState<"audit-99" \| "retainer">[^;]+;/g, '');
content = content.replace(/const openBooking = \([^)]+\) => \{[^}]+\};\n?/g, '');

// Find the bottom section containing the Agency Services and replace it
const agencyServicesStart = content.indexOf('{/* -- BOTTOM CALL TO ACTION -- */}');
const closingTags = content.indexOf('</motion.div>');
if (agencyServicesStart !== -1 && closingTags !== -1) {
    const prefix = content.substring(0, agencyServicesStart);
    const suffix = content.substring(closingTags);
    const replacement = `{/* -- BOTTOM CALL TO ACTION -- */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #dfe3eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#33475b" }}>Automate Remediation Workflows</div>
                <div style={{ fontSize: "13px", color: "#516f90", marginTop: 4 }}>Instantly write back action plans to HubSpot CRM.</div>
              </div>
              <button 
                onClick={() => setIsUpgradeOpen(true)}
                style={{ backgroundColor: "#ff7a59", color: "#ffffff", border: "none", borderRadius: 3, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 4px rgba(255,122,89,0.3)" }}
              >
                ⭐ Upgrade to Enterprise Pro
              </button>
            </div>
          </div>
        `;
    content = prefix + replacement + suffix;
}

// Remove BookTriageModal component instantiation at the bottom
content = content.replace(/\{\/\* Booking Sub-Modal \*\/\}\s*<BookTriageModal[\s\S]*?\/>/g, '');

// Inject the Upgrade modal before the closing fragment
content = content.replace(/<\/>\s*\);\s*\};/s, 
`  <NativeUpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} featureName="Automated Remediation & Sync" />\n    </>\n  );\n};`);

// Run Light-Mode Replacements
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
    'color: "#00d0ea"': 'color: "#00a4bd"',
    'background: "rgba(0, 164, 189, 0.15)"': 'background: "#e5f5f8"',
    'color: "rgba(255,255,255,0.6)"': 'color: "#516f90"'
};

for (const [oldStr, newStr] of Object.entries(replacements)) {
    content = content.split(oldStr).join(newStr);
}

fs.writeFileSync(path, content, 'utf8');
