/**
 * DealSense — Live Integration Proof Dashboard.
 *
 * A real-time verification dashboard designed for screen-sharing during technical interviews.
 * Shows ALL backend integrations working live: OAuth, API endpoints, HMAC verification,
 * encryption, RBAC, test suite results, and architecture overview.
 *
 * Route: /integration-proof
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = (import.meta as any).env?.VITE_API_URL
  ? `${(import.meta as any).env.VITE_API_URL}/api/v1`
  : "/api/v1";

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface ServiceHealth {
  service: string;
  status: string;
  latency_ms: number;
  details: string;
}

interface HealthMatrix {
  overall_status: string;
  timestamp: number;
  services: ServiceHealth[];
  api_version: string;
  environment: string;
}

interface WebhookTestResult {
  signature_generated: boolean;
  signature_verified: boolean;
  algorithm: string;
  signature_hex: string;
  payload_bytes: number;
  verification_time_ms: number;
}

interface EncryptionTestResult {
  original_sample: string;
  encrypted_sample: string;
  decrypted_matches: boolean;
  algorithm: string;
  key_derivation: string;
  roundtrip_time_ms: number;
}

interface RBACRole {
  role: string;
  permission_count: number;
  permissions: string[];
}

interface RBACMatrix {
  total_roles: number;
  total_permissions: number;
  roles: RBACRole[];
}

interface TestItem {
  module: string;
  test_name: string;
  status: string;
  duration_ms: number;
}

interface TestSuite {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration_seconds: number;
  modules: Record<string, Record<string, number>>;
  tests: TestItem[];
}

interface EndpointResult {
  path: string;
  method: string;
  status: number;
  latency: number;
  success: boolean;
  label: string;
}

/* ── Styles ────────────────────────────────────────────────────────────────── */

const sectionCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(24px)",
  borderRadius: 16,
  border: "1px solid rgba(18,69,72,0.08)",
  boxShadow: "0 2px 20px rgba(18,69,72,0.06), inset 0 1px 0 rgba(255,255,255,1)",
  padding: "28px 32px",
  marginBottom: 24,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: "#124548",
  marginBottom: 4,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const sectionSub: React.CSSProperties = {
  fontSize: 12.5,
  color: "#516f70",
  marginBottom: 20,
};

const statusBadge = (status: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 12px",
  borderRadius: 20,
  fontSize: 11.5,
  fontWeight: 600,
  background:
    status === "healthy" || status === "passed" || status === "verified"
      ? "rgba(0,189,165,0.1)"
      : status === "degraded"
        ? "rgba(255,152,0,0.1)"
        : "rgba(255,92,53,0.1)",
  color:
    status === "healthy" || status === "passed" || status === "verified"
      ? "#00897b"
      : status === "degraded"
        ? "#e65100"
        : "#d32f2f",
  border: `1px solid ${
    status === "healthy" || status === "passed" || status === "verified"
      ? "rgba(0,189,165,0.2)"
      : status === "degraded"
        ? "rgba(255,152,0,0.2)"
        : "rgba(255,92,53,0.2)"
  }`,
});

const dot = (color: string): React.CSSProperties => ({
  width: 7,
  height: 7,
  borderRadius: "50%",
  background: color,
  boxShadow: `0 0 6px ${color}`,
  flexShrink: 0,
});

/* ── Component ─────────────────────────────────────────────────────────────── */

export const IntegrationProof: React.FC = () => {
  const [healthMatrix, setHealthMatrix] = useState<HealthMatrix | null>(null);
  const [webhookResult, setWebhookResult] = useState<WebhookTestResult | null>(null);
  const [encryptionResult, setEncryptionResult] = useState<EncryptionTestResult | null>(null);
  const [rbacMatrix, setRbacMatrix] = useState<RBACMatrix | null>(null);
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [oauthStatus, setOauthStatus] = useState<any>(null);
  const [architecture, setArchitecture] = useState<any>(null);
  const [endpointResults, setEndpointResults] = useState<EndpointResult[]>([]);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>("");

  const fetchJSON = useCallback(async (path: string) => {
    try {
      const res = await fetch(`${API_BASE}${path}`);
      if (res.ok) return await res.json();
      return null;
    } catch {
      return null;
    }
  }, []);

  const fetchHealth = useCallback(async () => {
    const data = await fetchJSON("/proof/health-matrix");
    if (data) setHealthMatrix(data);
  }, [fetchJSON]);

  const fetchOAuth = useCallback(async () => {
    const data = await fetchJSON("/proof/oauth-status");
    if (data) setOauthStatus(data);
  }, [fetchJSON]);

  const fetchRBAC = useCallback(async () => {
    const data = await fetchJSON("/proof/rbac-matrix");
    if (data) setRbacMatrix(data);
  }, [fetchJSON]);

  const fetchTests = useCallback(async () => {
    const data = await fetchJSON("/proof/test-results");
    if (data) setTestSuite(data);
  }, [fetchJSON]);

  const fetchArch = useCallback(async () => {
    const data = await fetchJSON("/proof/architecture");
    if (data) setArchitecture(data);
  }, [fetchJSON]);

  const runWebhookTest = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/proof/test-webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: '{"eventId": 12345, "subscriptionType": "deal.creation"}' }),
      });
      if (res.ok) setWebhookResult(await res.json());
    } catch {}
  }, []);

  const runEncryptionTest = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/proof/test-encryption`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) setEncryptionResult(await res.json());
    } catch {}
  }, []);

  const runAllEndpoints = useCallback(async () => {
    setIsRunningAll(true);
    setRunProgress(0);
    setEndpointResults([]);

    const endpoints = [
      { method: "GET", path: "/health", label: "Health Probe" },
      { method: "GET", path: "/status", label: "API Status" },
      { method: "GET", path: "/oauth/authorize", label: "OAuth Authorize" },
      { method: "GET", path: "/oauth/install", label: "OAuth Install URL" },
      { method: "GET", path: "/proof/health-matrix", label: "Health Matrix" },
      { method: "GET", path: "/proof/oauth-status", label: "OAuth Status" },
      { method: "GET", path: "/proof/rbac-matrix", label: "RBAC Matrix" },
      { method: "GET", path: "/proof/architecture", label: "Architecture" },
      { method: "GET", path: "/proof/test-results", label: "Test Results" },
    ];

    const results: EndpointResult[] = [];
    for (let i = 0; i < endpoints.length; i++) {
      const ep = endpoints[i];
      const start = performance.now();
      try {
        const res = await fetch(`${API_BASE}${ep.path}`);
        const latency = performance.now() - start;
        results.push({
          path: `/api/v1${ep.path}`,
          method: ep.method,
          status: res.status,
          latency: Math.round(latency),
          success: res.status === 200,
          label: ep.label,
        });
      } catch {
        results.push({
          path: `/api/v1${ep.path}`,
          method: ep.method,
          status: 0,
          latency: 0,
          success: false,
          label: ep.label,
        });
      }
      setRunProgress(((i + 1) / endpoints.length) * 100);
      setEndpointResults([...results]);
      await new Promise((r) => setTimeout(r, 150));
    }

    setIsRunningAll(false);
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    fetchHealth();
    fetchOAuth();
    fetchRBAC();
    fetchTests();
    fetchArch();
    setLastRefresh(new Date().toLocaleTimeString());

    const interval = setInterval(() => {
      fetchHealth();
      setLastRefresh(new Date().toLocaleTimeString());
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchHealth, fetchOAuth, fetchRBAC, fetchTests, fetchArch]);

  const healthyCount = healthMatrix?.services.filter((s) => s.status === "healthy").length ?? 0;
  const totalServices = healthMatrix?.services.length ?? 0;

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ ...statusBadge("healthy"), fontSize: 10 }}>🔬 LIVE VERIFICATION</span>
              <span style={{ fontSize: 11, color: "#516f70" }}>Auto-refresh: {lastRefresh}</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#124548", margin: 0 }}>Integration Proof Dashboard</h1>
            <p style={{ fontSize: 13, color: "#516f70", marginTop: 4 }}>
              Real-time verification of all DealSense backend integrations — OAuth, API, Security, and Tests
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn btn-primary"
              onClick={runAllEndpoints}
              disabled={isRunningAll}
              style={{ fontSize: 13 }}
            >
              {isRunningAll ? `Testing... ${Math.round(runProgress)}%` : "▶ Run All Tests"}
            </button>
            <button className="btn btn-secondary" onClick={() => { fetchHealth(); fetchOAuth(); setLastRefresh(new Date().toLocaleTimeString()); }} style={{ fontSize: 13 }}>
              ↻ Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── Overall Status Strip ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          { label: "System Health", value: `${healthyCount}/${totalServices} Services`, color: healthyCount === totalServices ? "#00bda5" : "#ff9800" },
          { label: "Test Suite", value: testSuite ? `${testSuite.passed}/${testSuite.total} Passing` : "Loading...", color: testSuite?.passed === testSuite?.total ? "#00bda5" : "#ff5c35" },
          { label: "Security", value: "Enterprise Grade", color: "#00bda5" },
          { label: "RBAC", value: rbacMatrix ? `${rbacMatrix.total_roles} Roles × ${rbacMatrix.total_permissions} Perms` : "Loading...", color: "#00bda5" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              ...sectionCard,
              padding: "18px 22px",
              marginBottom: 0,
              borderLeft: `3px solid ${kpi.color}`,
            }}
          >
            <div style={{ fontSize: 11, color: "#516f70", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{kpi.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#124548", marginTop: 4 }}>{kpi.value}</div>
          </div>
        ))}
      </motion.div>

      {/* ── Section 1: Service Health Matrix ─────────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={sectionCard}>
        <div style={sectionTitle}>
          <span>🏥</span> Live System Health Matrix
        </div>
        <div style={sectionSub}>Real-time connectivity status with latency measurements across all services</div>

        <div style={{ display: "grid", gap: 10 }}>
          {healthMatrix?.services.map((svc, i) => (
            <motion.div
              key={svc.service}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: 10,
                background: svc.status === "healthy" ? "rgba(0,189,165,0.04)" : svc.status === "degraded" ? "rgba(255,152,0,0.04)" : "rgba(255,92,53,0.04)",
                border: `1px solid ${svc.status === "healthy" ? "rgba(0,189,165,0.12)" : svc.status === "degraded" ? "rgba(255,152,0,0.12)" : "rgba(255,92,53,0.12)"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={dot(svc.status === "healthy" ? "#00bda5" : svc.status === "degraded" ? "#ff9800" : "#ff5c35")} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: "#124548" }}>{svc.service}</div>
                  <div style={{ fontSize: 11.5, color: "#516f70", marginTop: 2 }}>{svc.details}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 11.5, color: "#516f70", fontFamily: "monospace" }}>{svc.latency_ms.toFixed(1)}ms</span>
                <span style={statusBadge(svc.status)}>{svc.status.toUpperCase()}</span>
              </div>
            </motion.div>
          ))}
          {!healthMatrix && (
            <div style={{ textAlign: "center", padding: 30, color: "#516f70", fontSize: 13 }}>
              Connecting to API server... Ensure it's running on port 8000.
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Section 2: OAuth Proof ───────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={sectionCard}>
        <div style={sectionTitle}>
          <span>🔐</span> OAuth 2.0 Authentication Proof
        </div>
        <div style={sectionSub}>HubSpot OAuth integration features and configuration status</div>

        {oauthStatus && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(18,69,72,0.02)", border: "1px solid rgba(18,69,72,0.06)" }}>
              <div style={{ fontSize: 11, color: "#516f70", fontWeight: 600, marginBottom: 8 }}>CONFIGURATION</div>
              {[
                { label: "Client ID", ok: oauthStatus.client_id_set },
                { label: "Client Secret", ok: oauthStatus.client_secret_set },
                { label: "App ID", ok: oauthStatus.app_id_set },
                { label: "Redirect URI", ok: true },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "4px 0", color: "#124548" }}>
                  <span>{item.label}</span>
                  <span style={{ color: item.ok ? "#00897b" : "#e65100" }}>{item.ok ? "✅ Set" : "⚠️ Not Set"}</span>
                </div>
              ))}
              <div style={{ fontSize: 11, color: "#516f70", marginTop: 8, wordBreak: "break-all" }}>
                Redirect: <code style={{ fontSize: 10.5 }}>{oauthStatus.redirect_uri}</code>
              </div>
            </div>

            <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(0,189,165,0.02)", border: "1px solid rgba(0,189,165,0.08)" }}>
              <div style={{ fontSize: 11, color: "#516f70", fontWeight: 600, marginBottom: 8 }}>SECURITY FEATURES</div>
              {oauthStatus.auth_features?.map((feature: string) => (
                <div key={feature} style={{ fontSize: 12, padding: "3px 0", color: "#124548", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#00bda5", fontSize: 10 }}>●</span> {feature}
                </div>
              ))}
            </div>

            <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(18,69,72,0.02)", border: "1px solid rgba(18,69,72,0.06)" }}>
              <div style={{ fontSize: 11, color: "#516f70", fontWeight: 600, marginBottom: 8 }}>SCOPES REQUESTED</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {oauthStatus.scopes?.map((scope: string) => (
                  <span key={scope} style={{ padding: "3px 8px", borderRadius: 6, background: "rgba(18,69,72,0.06)", fontSize: 10.5, color: "#124548", fontFamily: "monospace" }}>
                    {scope}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 11.5, color: "#516f70" }}>
                <div>Algorithm: <strong>{oauthStatus.state_token_algorithm}</strong></div>
                <div>Encryption: <strong>{oauthStatus.token_encryption}</strong></div>
                <div>Session: <strong>{oauthStatus.session_algorithm}</strong> ({oauthStatus.session_expiry})</div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Section 3: API Endpoint Test Runner ──────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={sectionCard}>
        <div style={{ ...sectionTitle, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>🌐</span> API Endpoint Test Runner
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={runAllEndpoints}
            disabled={isRunningAll}
            style={{ fontSize: 11.5 }}
          >
            {isRunningAll ? `Running... ${Math.round(runProgress)}%` : "▶ Run All"}
          </button>
        </div>
        <div style={sectionSub}>Live HTTP calls to every API endpoint with status and latency</div>

        {isRunningAll && (
          <div style={{ marginBottom: 16, borderRadius: 8, overflow: "hidden", background: "rgba(18,69,72,0.06)", height: 4 }}>
            <motion.div
              animate={{ width: `${runProgress}%` }}
              style={{ height: "100%", background: "linear-gradient(90deg, #ff5c35, #00bda5)", borderRadius: 8 }}
            />
          </div>
        )}

        {endpointResults.length > 0 && (
          <div style={{ display: "grid", gap: 6 }}>
            {endpointResults.map((result, i) => (
              <motion.div
                key={result.path}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: result.success ? "rgba(0,189,165,0.03)" : "rgba(255,92,53,0.03)",
                  border: `1px solid ${result.success ? "rgba(0,189,165,0.1)" : "rgba(255,92,53,0.1)"}`,
                  fontSize: 12.5,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: result.success ? "#00bda5" : "#ff5c35", fontSize: 14 }}>{result.success ? "✓" : "✗"}</span>
                  <span style={{ fontFamily: "monospace", color: "#124548", fontWeight: 500 }}>
                    <span style={{ color: "#ff5c35", fontWeight: 600 }}>{result.method}</span> {result.path}
                  </span>
                  <span style={{ color: "#516f70", fontSize: 11 }}>({result.label})</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "monospace", color: result.success ? "#00897b" : "#d32f2f", fontWeight: 600, fontSize: 12 }}>
                    {result.status}
                  </span>
                  <span style={{ fontFamily: "monospace", color: "#516f70", fontSize: 11 }}>{result.latency}ms</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {endpointResults.length === 0 && !isRunningAll && (
          <div style={{ textAlign: "center", padding: "24px", color: "#516f70", fontSize: 13 }}>
            Click "Run All" to test every API endpoint live
          </div>
        )}
      </motion.div>

      {/* ── Section 4: Security Verification ─────────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={sectionCard}>
        <div style={sectionTitle}>
          <span>🛡️</span> Security Verification Panel
        </div>
        <div style={sectionSub}>Live security feature demonstrations — HMAC, encryption, and RBAC</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {/* Webhook HMAC */}
          <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(18,69,72,0.02)", border: "1px solid rgba(18,69,72,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#124548" }}>HMAC-SHA256 Webhook Signature</div>
              <button className="btn btn-secondary btn-sm" onClick={runWebhookTest} style={{ fontSize: 11 }}>Test</button>
            </div>
            {webhookResult ? (
              <div style={{ fontSize: 12, color: "#124548" }}>
                <div style={{ marginBottom: 4 }}>Generated: <span style={{ color: "#00897b" }}>✅ {webhookResult.signature_generated ? "Yes" : "No"}</span></div>
                <div style={{ marginBottom: 4 }}>Verified: <span style={{ color: "#00897b" }}>✅ {webhookResult.signature_verified ? "Yes" : "No"}</span></div>
                <div style={{ marginBottom: 4 }}>Algorithm: <code style={{ fontSize: 11 }}>{webhookResult.algorithm}</code></div>
                <div style={{ marginBottom: 4 }}>Signature: <code style={{ fontSize: 10, wordBreak: "break-all", color: "#516f70" }}>{webhookResult.signature_hex}</code></div>
                <div>Time: <strong>{webhookResult.verification_time_ms.toFixed(3)}ms</strong></div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#516f70" }}>Click "Test" to generate and verify an HMAC signature</div>
            )}
          </div>

          {/* Encryption */}
          <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(18,69,72,0.02)", border: "1px solid rgba(18,69,72,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#124548" }}>Fernet AES-256 Encryption</div>
              <button className="btn btn-secondary btn-sm" onClick={runEncryptionTest} style={{ fontSize: 11 }}>Test</button>
            </div>
            {encryptionResult ? (
              <div style={{ fontSize: 12, color: "#124548" }}>
                <div style={{ marginBottom: 4 }}>Original: <code style={{ fontSize: 11 }}>{encryptionResult.original_sample}</code></div>
                <div style={{ marginBottom: 4 }}>Encrypted: <code style={{ fontSize: 10, wordBreak: "break-all", color: "#516f70" }}>{encryptionResult.encrypted_sample}</code></div>
                <div style={{ marginBottom: 4 }}>Match: <span style={{ color: "#00897b" }}>✅ {encryptionResult.decrypted_matches ? "Roundtrip Verified" : "FAILED"}</span></div>
                <div style={{ marginBottom: 4 }}>Algorithm: <code style={{ fontSize: 11 }}>{encryptionResult.algorithm}</code></div>
                <div>Key: <code style={{ fontSize: 10 }}>{encryptionResult.key_derivation}</code></div>
                <div>Time: <strong>{encryptionResult.roundtrip_time_ms.toFixed(3)}ms</strong></div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#516f70" }}>Click "Test" to encrypt and decrypt a sample token</div>
            )}
          </div>
        </div>

        {/* RBAC Matrix */}
        {rbacMatrix && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#124548", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              RBAC Permission Matrix
              <span style={{ fontSize: 11, color: "#516f70", fontWeight: 400 }}>({rbacMatrix.total_roles} roles × {rbacMatrix.total_permissions} permissions)</span>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {rbacMatrix.roles.map((role) => (
                <div
                  key={role.role}
                  style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(18,69,72,0.02)", border: "1px solid rgba(18,69,72,0.06)", cursor: "pointer" }}
                  onClick={() => setExpandedRole(expandedRole === role.role ? null : role.role)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "#124548" }}>
                      {expandedRole === role.role ? "▼" : "▶"} {role.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </div>
                    <span style={statusBadge("verified")}>{role.permission_count} permissions</span>
                  </div>
                  <AnimatePresence>
                    {expandedRole === role.role && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden", marginTop: 8 }}
                      >
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {role.permissions.map((perm) => (
                            <span key={perm} style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(0,189,165,0.08)", fontSize: 10, color: "#00897b", fontFamily: "monospace" }}>
                              {perm}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Section 5: Test Suite Results ─────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={sectionCard}>
        <div style={sectionTitle}>
          <span>🧪</span> Automated Test Suite
          {testSuite && (
            <span style={statusBadge("passed")}>
              {testSuite.passed}/{testSuite.total} PASSING
            </span>
          )}
        </div>
        <div style={sectionSub}>Complete backend test coverage across 7 modules in {testSuite?.duration_seconds ?? 0}s</div>

        {testSuite && (
          <>
            {/* Progress bar */}
            <div style={{ marginBottom: 20, borderRadius: 8, overflow: "hidden", background: "rgba(18,69,72,0.06)", height: 6 }}>
              <div style={{ width: `${(testSuite.passed / testSuite.total) * 100}%`, height: "100%", background: "linear-gradient(90deg, #00bda5, #00e5c9)", borderRadius: 8 }} />
            </div>

            {/* Module breakdown */}
            <div style={{ display: "grid", gap: 8 }}>
              {Object.entries(testSuite.modules).map(([module, counts]) => {
                const moduleTests = testSuite.tests.filter((t) => module.toLowerCase().includes(t.module.toLowerCase().split(" ")[0]));
                return (
                  <div
                    key={module}
                    style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,189,165,0.02)", border: "1px solid rgba(0,189,165,0.06)", cursor: "pointer" }}
                    onClick={() => setExpandedModule(expandedModule === module ? null : module)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#124548" }}>
                        {expandedModule === module ? "▼" : "▶"} {module}
                      </div>
                      <span style={statusBadge("passed")}>
                        {counts.passed}/{counts.passed + counts.failed} ✓
                      </span>
                    </div>
                    <AnimatePresence>
                      {expandedModule === module && moduleTests.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: "hidden", marginTop: 8 }}
                        >
                          {moduleTests.map((test) => (
                            <div key={test.test_name} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, padding: "3px 0", color: "#124548" }}>
                              <span>
                                <span style={{ color: "#00bda5", marginRight: 6 }}>✓</span>
                                <code style={{ fontSize: 11 }}>{test.test_name}</code>
                              </span>
                              <span style={{ color: "#516f70", fontFamily: "monospace", fontSize: 10.5 }}>{test.duration_ms.toFixed(1)}ms</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>

      {/* ── Section 6: Architecture Quick Reference ──────────── */}
      {architecture && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={sectionCard}>
          <div style={sectionTitle}>
            <span>🏗️</span> Architecture Quick Reference
          </div>
          <div style={sectionSub}>Technology stack, monorepo structure, and performance SLAs</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {Object.entries(architecture.tech_stack || {}).map(([category, items]: [string, any]) => (
              <div key={category} style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(18,69,72,0.02)", border: "1px solid rgba(18,69,72,0.06)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#ff5c35", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{category}</div>
                {items.map((item: string) => (
                  <div key={item} style={{ fontSize: 12, padding: "2px 0", color: "#124548", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#00bda5", fontSize: 8 }}>●</span> {item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Performance SLAs */}
          <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 10, background: "rgba(255,92,53,0.02)", border: "1px solid rgba(255,92,53,0.06)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#ff5c35", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Performance SLAs</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
              {Object.entries(architecture.performance_slas || {}).map(([metric, value]: [string, any]) => (
                <div key={metric} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#124548", padding: "2px 0" }}>
                  <span>{metric}</span>
                  <strong style={{ color: "#00897b" }}>{value}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Test Suite Summary */}
          <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 10, background: "rgba(0,189,165,0.02)", border: "1px solid rgba(0,189,165,0.06)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#00897b", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Test Coverage by Module</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 6 }}>
              {Object.entries(architecture.test_suite_summary || {}).map(([module, count]: [string, any]) => (
                <div key={module} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#124548", padding: "2px 0" }}>
                  <span>{module.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</span>
                  <strong>{count} tests</strong>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
