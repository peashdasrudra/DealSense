import React from "react";
import { useNavigate } from "react-router-dom";
import { DealSenseIcon } from "../components/DealSenseLogo";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", color: "#0f172a", overflowX: "hidden" }}>
      {/* Navbar */}
      <nav style={{ padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => navigate("/")}>
          <DealSenseIcon size={32} />
          <span style={{ fontSize: 22, fontWeight: 900, color: "#092124", letterSpacing: "-0.03em" }}>DealSense</span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span onClick={() => navigate("/agency")} style={{ cursor: "pointer", fontWeight: 600, color: "#475569" }}>Pricing</span>
          <span onClick={() => navigate("/privacy")} style={{ cursor: "pointer", fontWeight: 600, color: "#475569" }}>Privacy</span>
          <button onClick={() => navigate("/onboarding")} style={{ padding: "10px 24px", background: "#ff5c35", color: "#ffffff", borderRadius: 8, fontWeight: 700, border: "none", cursor: "pointer" }}>Install to HubSpot</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "120px 24px 80px", textAlign: "center", background: "linear-gradient(135deg, #092124 0%, #124548 100%)", color: "#ffffff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", padding: "6px 16px", background: "rgba(255, 92, 53, 0.15)", border: "1px solid rgba(255, 92, 53, 0.3)", color: "#ff8c6b", borderRadius: 999, fontSize: 13, fontWeight: 800, textTransform: "uppercase", marginBottom: 24 }}>
            Official HubSpot App Marketplace Partner
          </div>
          <h1 style={{ fontSize: "clamp(42px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
            Stop Losing Deals to <span style={{ color: "#ff5c35" }}>Silence</span>.
          </h1>
          <p style={{ fontSize: 20, color: "#cbd5e1", marginBottom: 40, lineHeight: 1.6, maxWidth: 680, margin: "0 auto 40px" }}>
            DealSense is the autonomous Revenue Intelligence engine that analyzes your HubSpot pipeline, predicts deal slippage, and executes automated remediation playbooks.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button onClick={() => navigate("/onboarding")} style={{ padding: "16px 32px", background: "#ff5c35", color: "#ffffff", fontSize: 16, fontWeight: 800, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 8px 24px rgba(255,92,53,0.3)" }}>
              Install Free in HubSpot CRM
            </button>
            <button onClick={() => navigate("/pipeline")} style={{ padding: "16px 32px", background: "rgba(255,255,255,0.1)", color: "#ffffff", fontSize: 16, fontWeight: 800, borderRadius: 12, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>
              View Live Demo Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: "#092124", marginBottom: 16 }}>Enterprise-Grade Revenue Telemetry</h2>
            <p style={{ fontSize: 18, color: "#64748b" }}>Everything you need to secure your pipeline and dominate your quarter.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
            {[
              { icon: "🎯", title: "Pipeline Risk Overview", desc: "Visualize your entire pipeline's health score instantly. Know exactly which deals are slipping before your reps do." },
              { icon: "🧠", title: "AI Deal Inspector", desc: "Deep-dive into individual deals. Analyze communication cadence, stakeholder engagement, and close date drift automatically." },
              { icon: "⚡", title: "Autonomous Playbooks", desc: "Automate CRM hygiene and trigger Slack alerts for stalled deals. Never let a qualified opportunity slip through the cracks again." },
              { icon: "🛡️", title: "Competitive Battlecards", desc: "Equip your reps with real-time, AI-generated competitive intel perfectly mapped to the deal's specific challenges." },
            ].map((f, i) => (
              <div key={i} style={{ background: "#ffffff", padding: 40, borderRadius: 24, border: "1px solid #e2e8f0", boxShadow: "0 12px 24px rgba(0,0,0,0.03)" }}>
                <div style={{ fontSize: 40, marginBottom: 20 }}>{f.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#092124", marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section style={{ padding: "80px 24px", background: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#092124", marginBottom: 24 }}>Bank-Grade Security for Your CRM Data</h2>
          <p style={{ fontSize: 18, color: "#64748b", marginBottom: 40 }}>Fully compliant with global privacy standards and official HubSpot marketplace requirements.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#00a4bd" }}>✓ SOC 2 Type II Compliant</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#00a4bd" }}>✓ GDPR Ready</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#00a4bd" }}>✓ AES-256 Encryption</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#00a4bd" }}>✓ Zero Email Body Stored</span>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section style={{ padding: "120px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 48, fontWeight: 900, color: "#092124", marginBottom: 24 }}>Ready to rescue your pipeline?</h2>
        <p style={{ fontSize: 20, color: "#64748b", marginBottom: 40 }}>Install the free core intelligence tier in 60 seconds.</p>
        <button onClick={() => navigate("/onboarding")} style={{ padding: "18px 40px", background: "#092124", color: "#ffffff", fontSize: 18, fontWeight: 800, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 12px 32px rgba(9,33,36,0.2)" }}>
          Install App to HubSpot
        </button>
      </section>
    </div>
  );
};
