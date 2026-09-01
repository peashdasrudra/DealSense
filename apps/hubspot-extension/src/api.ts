// apps/hubspot-extension/src/api.ts
export const API_BASE = "/api/v1";

// For development without a real HubSpot token exchange, we use a fixed mock Tenant ID
export const MOCK_TENANT_ID = "00000000-0000-0000-0000-000000000001";
export const MOCK_DEAL_ID = "00000000-0000-0000-0000-000000000002";

export async function fetchDealSnapshot(dealId: string = MOCK_DEAL_ID, tenantId: string = MOCK_TENANT_ID) {
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

export async function submitActionDecision(actionId: string, decision: "approve" | "reject", tenantId: string = MOCK_TENANT_ID) {
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
