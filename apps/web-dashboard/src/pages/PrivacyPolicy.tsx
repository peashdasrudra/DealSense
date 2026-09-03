import React from "react";
import { Link } from "react-router-dom";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "48px 24px 80px", fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)", color: "#1e293b" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "48px 40px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: 24, fontSize: 13, color: "#64748b" }}>
          <Link to="/" style={{ color: "#ff5c35", textDecoration: "none", fontWeight: 600 }}>← Back to DealSense</Link>
        </div>

        {/* Header */}
        <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: 24, marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", background: "rgba(255, 92, 53, 0.1)", borderRadius: 20, color: "#ff5c35", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
            HubSpot App Marketplace Compliance & GDPR Policy
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Privacy & Data Governance Policy</h1>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Effective Date: September 4, 2026 • Version 2.4 (Marketplace Certified Edition)</p>
        </div>

        {/* Content Sections */}
        <div style={{ lineHeight: 1.7, fontSize: 15, color: "#334155", display: "flex", flexDirection: "column", gap: 28 }}>
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>1. Introduction & Scope</h2>
            <p>
              DealSense by HubAiLab (&ldquo;DealSense&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) provides autonomous revenue intelligence, deal health diagnostics, and RevOps workflow integrations natively for HubSpot CRM portals. This Privacy Policy governs the collection, processing, encryption, and deletion of customer CRM data processed through our application and HubSpot integrations.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>2. HubSpot CRM Data We Process</h2>
            <p>
              When an authorized HubSpot super-admin installs DealSense via the official HubSpot App Marketplace OAuth 2.0 flow, we process only the minimum scopes necessary to compute deterministic risk scores:
            </p>
            <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
              <li><strong>Deal Metadata:</strong> Deal stage, amount, close date, pipeline stage timestamps, and Deal ID.</li>
              <li><strong>Engagement Telemetry:</strong> Timestamps of recent touchpoints (calls, meetings, emails) to compute communication decay and ghosting risk vectors.</li>
              <li><strong>Contact Association:</strong> Anonymized contact role identifiers to calculate single-threading risk.</li>
            </ul>
            <p style={{ fontSize: 14, background: "#f1f5f9", padding: "12px 16px", borderRadius: 8, borderLeft: "4px solid #00a4bd" }}>
              <strong>Zero Raw Email Body Stored:</strong> DealSense does not store raw customer email message contents or personal sensitive credentials. Engagements are analyzed in-flight to compute numerical risk factors.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>3. Encryption & Data Security Architecture</h2>
            <p>
              All customer data is guarded with multi-layer enterprise security standards:
            </p>
            <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
              <li><strong>At Rest:</strong> All HubSpot OAuth refresh and access tokens are encrypted using military-grade AES-256-GCM / Fernet cryptography with per-tenant isolation.</li>
              <li><strong>In Transit:</strong> All HTTP traffic enforces TLS 1.3 encryption. All incoming HubSpot webhooks are cryptographically authenticated via HubSpot v3 HMAC-SHA256 signature verification.</li>
              <li><strong>Multi-Tenant Isolation:</strong> Data between different HubSpot portals is partitioned by strict Tenant ID row-level security.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>4. GDPR & CCPA Compliance (Right to Erasure)</h2>
            <p>
              In accordance with GDPR Article 17 (&ldquo;Right to Erasure&rdquo;) and HubSpot Marketplace Certification standards, DealSense operates dedicated automated privacy endpoints:
            </p>
            <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
              <li><strong>Automated Contact Deletion:</strong> Upon receiving a HubSpot <code>contact.privacy.deletion</code> webhook event, all cached records, vectors, and associations belonging to that contact ID are permanently wiped within 48 hours.</li>
              <li><strong>App Uninstall Disconnection:</strong> Upon receiving an <code>app.uninstall</code> webhook event from HubSpot, all active OAuth tokens for that portal are instantly revoked and deleted.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>5. Data Retention & Tenant Deletion</h2>
            <p>
              Tenants may request complete deletion of their account and historical deal score logs at any time by contacting our security team. Upon confirmed termination of service, all database records tied to the portal ID are permanently purged.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>6. Contact & Data Protection Officer</h2>
            <p>
              For privacy inquiries, GDPR data subject requests, or security audits, contact:
            </p>
            <div style={{ background: "#f8fafc", padding: "16px 20px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 700 }}>Peash Das Rudra — Data Protection & Systems Architect</p>
              <p style={{ margin: "0 0 4px", fontSize: 14 }}>HubAiLab / DealSense Security Operations</p>
              <p style={{ margin: 0, fontSize: 14, color: "#ff5c35" }}>Email: <a href="mailto:peashdasrudra@gmail.com" style={{ color: "#ff5c35", fontWeight: 600 }}>peashdasrudra@gmail.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
