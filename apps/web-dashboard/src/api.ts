// apps/web-dashboard/src/api.ts
export const API_BASE = (import.meta as any).env?.VITE_API_URL
  ? `${(import.meta as any).env.VITE_API_URL}/api/v1`
  : "/api/v1";

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

export async function createDeal(
  dealData: { name: string; amount: number; stage: string; client?: string; owner?: string },
  tenantId: string = MOCK_TENANT_ID
) {
  const response = await fetch(`${API_BASE}/deals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": tenantId,
    },
    body: JSON.stringify(dealData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create deal: ${response.statusText}`);
  }

  return response.json();
}

export async function updateDeal(
  dealId: string,
  dealData: { name?: string; amount?: number; stage?: string; client?: string; owner?: string },
  tenantId: string = MOCK_TENANT_ID
) {
  const response = await fetch(`${API_BASE}/deals/${dealId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": tenantId,
    },
    body: JSON.stringify(dealData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update deal: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteDeal(dealId: string, tenantId: string = MOCK_TENANT_ID) {
  const response = await fetch(`${API_BASE}/deals/${dealId}`, {
    method: "DELETE",
    headers: {
      "X-Tenant-ID": tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete deal: ${response.statusText}`);
  }

  return response.json();
}

export async function syncHubSpotDeals(tenantId: string = MOCK_TENANT_ID) {
  const response = await fetch(`${API_BASE}/deals/sync-hubspot`, {
    method: "POST",
    headers: {
      "X-Tenant-ID": tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to sync HubSpot deals: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchDealSnapshot(dealId: string, tenantId: string = MOCK_TENANT_ID) {
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
