import React from "react";
import { Link } from "react-router-dom";

export const TermsOfService: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "48px 24px 80px", fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)", color: "#1e293b" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "48px 40px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: 24, fontSize: 13, color: "#64748b" }}>
          <Link to="/" style={{ color: "#ff5c35", textDecoration: "none", fontWeight: 600 }}>← Back to DealSense</Link>
        </div>

        {/* Header */}
        <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: 24, marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", background: "rgba(0, 164, 189, 0.1)", borderRadius: 20, color: "#00a4bd", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
            HubSpot Certified Application Terms
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Terms of Service</h1>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Effective Date: September 4, 2026 • Version 2.4 (Enterprise Edition)</p>
        </div>

        {/* Content Sections */}
        <div style={{ lineHeight: 1.7, fontSize: 15, color: "#334155", display: "flex", flexDirection: "column", gap: 28 }}>
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>1. Acceptance of Terms</h2>
            <p>
              By installing the DealSense application from the HubSpot App Marketplace or accessing any DealSense API services, you and the legal entity you represent agree to be bound by these Terms of Service. If you do not agree, do not install or use the integration.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>2. Description of Service & Free Tier Access</h2>
            <p>
              DealSense provides revenue intelligence, deterministic deal risk analysis, and pipeline health diagnostics. 
            </p>
            <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
              <li><strong>Marketplace Free Tier:</strong> Provides basic deal risk scoring (0-100), stalled deal flagging, and single-threaded contact alerts inside your native HubSpot deal cards at no charge.</li>
              <li><strong>Commercial / Agency Retainer Tiers:</strong> Premium custom workflow automation, automated MEDDICC extractions, and white-label agency deployment are governed under separate commercial service agreements.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>3. HubSpot Account Authorization & API Limits</h2>
            <p>
              To provide risk analysis, DealSense requires authorized OAuth 2.0 access to your HubSpot portal. You represent that you are authorized to grant this access. DealSense adheres strictly to HubSpot API rate limits (100 requests per 10-second sliding window) and employs exponential backoff and batch read/update architectures to preserve your portal&rsquo;s operational integrity.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>4. Intellectual Property Rights</h2>
            <p>
              DealSense, including its deterministic scoring algorithm, 7-vector telemetry model, custom React Canvas cards, and proprietary workflow actions, remains the exclusive intellectual property of <strong>Peash Das Rudra</strong> and HubAiLab. You retain 100% ownership of your proprietary CRM data.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>5. Service Level & Disclaimers</h2>
            <p>
              While DealSense maintains 99.9% uptime architecture, the services are provided &ldquo;as is&rdquo;. Predictive deal scoring models and revenue risk indicators are advisory analytical tools designed to augment sales judgment and should not be construed as financial guarantees.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>6. Termination & App Uninstall</h2>
            <p>
              You may terminate these terms at any time by uninstalling DealSense from your HubSpot Connected Apps settings. Upon uninstallation, DealSense immediately severs API connectivity and permanently revokes your portal tokens.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>7. Governing Law & Support</h2>
            <p>
              For legal notices, enterprise SLAs, or technical support, please contact:
            </p>
            <div style={{ background: "#f8fafc", padding: "16px 20px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 700 }}>HubAiLab Legal & Enterprise Support</p>
              <p style={{ margin: "0 0 4px", fontSize: 14 }}>Lead Architect: Peash Das Rudra</p>
              <p style={{ margin: 0, fontSize: 14 }}>Email: <a href="mailto:peashdasrudra@gmail.com" style={{ color: "#ff5c35", fontWeight: 600 }}>peashdasrudra@gmail.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
