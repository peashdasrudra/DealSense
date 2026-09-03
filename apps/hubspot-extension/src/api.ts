// apps/hubspot-extension/src/api.ts
export const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || "https://dealsense-api-6o2h.onrender.com/api/v1";

// Multi-tenant production header fallback
export const DEFAULT_TENANT_ID = "00000000-0000-0000-0000-000000000001";
export const DEFAULT_DEAL_ID = "00000000-0000-0000-0000-000000000002";

export async function fetchDealSnapshot(dealId: string = DEFAULT_DEAL_ID, tenantId: string = DEFAULT_TENANT_ID) {
  const response = await fetch(`${API_BASE}/deals/${dealId}/snapshot`, {
    headers: {
      "X-Tenant-ID": tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch deal snapshot: ${response.statusText}`);
  }

  return response.json();
}

export async function triggerDealEvaluation(dealId: string = DEFAULT_DEAL_ID, tenantId: string = DEFAULT_TENANT_ID, portalId?: string) {
  const response = await fetch(`${API_BASE}/deals/${dealId}/score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": tenantId,
    },
    body: JSON.stringify({
      deal_id: dealId,
      portal_id: portalId,
      properties: {},
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to evaluate deal: ${response.statusText}`);
  }

  return response.json();
}

export async function submitActionDecision(actionId: string, decision: "approve" | "reject", tenantId: string = DEFAULT_TENANT_ID) {
  const response = await fetch(`${API_BASE}/actions/${actionId}/decision`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": tenantId,
    },
    body: JSON.stringify({ decision, reason: "" }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit action decision: ${response.statusText}`);
  }

  return response.json();
}
