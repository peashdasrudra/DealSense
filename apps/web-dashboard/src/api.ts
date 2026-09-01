// apps/web-dashboard/src/api.ts
export const API_BASE = "/api/v1";

export const MOCK_TENANT_ID = "00000000-0000-0000-0000-000000000001";

export async function fetchDeals(tenantId: string = MOCK_TENANT_ID) {
  const response = await fetch(`${API_BASE}/deals`, {
    headers: {
      "X-Tenant-ID": tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch deals: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchActions(tenantId: string = MOCK_TENANT_ID) {
  const response = await fetch(`${API_BASE}/actions`, {
    headers: {
      "X-Tenant-ID": tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch actions: ${response.statusText}`);
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

export async function executeAction(actionId: string, tenantId: string = MOCK_TENANT_ID) {
  const response = await fetch(`${API_BASE}/actions/${actionId}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to execute action: ${response.statusText}`);
  }

  return response.json();
}
