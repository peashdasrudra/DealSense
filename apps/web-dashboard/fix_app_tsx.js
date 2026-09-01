const fs = require("fs");
const path = require("path");

const appPath = "c:/Users/USER/Desktop/AiXpertLabs/DealSense/apps/web-dashboard/src/App.tsx";
let content = fs.readFileSync(appPath, "utf-8");

// 1. Add body scroll lock effect
const effectStr = `
  useEffect(() => {
    if (sidebarOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen, isSearchOpen]);
`;

if (!content.includes("document.body.style.overflow")) {
  content = content.replace("  const pageMeta =", effectStr + "\n  const pageMeta =");
}

// 2. Fix sidebar backdrop z-index
content = content.replace(
  /backdropFilter: "blur\(4px\)",\s*zIndex: 110/g,
  'backdropFilter: "blur(4px)",\n            zIndex: 1999'
);

// 3. Fix Search Modal centering & animation 
// Replace the broken transform/scale animation with one that preserves translateX
const oldSearchModal = `            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                position: "fixed",
                top: "20%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                maxWidth: "540px",
                background: "#ffffff",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 310,
                overflow: "hidden",
                border: "1px solid var(--hs-border-dark)",
              }}
            >`;

const newSearchModal = `            <motion.div
              initial={{ x: "-50%", y: -10, scale: 0.95, opacity: 0 }}
              animate={{ x: "-50%", y: 0, scale: 1, opacity: 1 }}
              exit={{ x: "-50%", y: -10, scale: 0.95, opacity: 0 }}
              style={{
                position: "fixed",
                top: "15%",
                left: "50%",
                width: "90%",
                maxWidth: "540px",
                background: "#ffffff",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 310,
                overflow: "hidden",
                border: "1px solid var(--hs-border-dark)",
              }}
            >`;

if (content.includes("transform: \"translateX(-50%)\"")) {
  content = content.replace(oldSearchModal, newSearchModal);
}

fs.writeFileSync(appPath, content, "utf-8");
console.log("App.tsx fixed.");
