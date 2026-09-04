// apps/web-dashboard/src/api.ts
export const API_BASE = (import.meta as any).env?.VITE_API_URL
  ? `${(import.meta as any).env.VITE_API_URL}/api/v1`
  : "/api/v1";

export const DEFAULT_TENANT_ID = "00000000-0000-0000-0000-000000000001";

const getTenantId = (overrideId?: string) => {
  if (overrideId && overrideId !== DEFAULT_TENANT_ID) return overrideId;
  const stored = localStorage.getItem("dealsense_tenant_id");
  return stored || DEFAULT_TENANT_ID;
};

export async function fetchDeals(tenantId?: string) {
  const response = await fetch(`${API_BASE}/deals`, {
    headers: {
      "X-Tenant-ID": getTenantId(tenantId),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch deals: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchActions(tenantId?: string) {
  const response = await fetch(`${API_BASE}/actions`, {
    headers: {
      "X-Tenant-ID": getTenantId(tenantId),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch actions: ${response.statusText}`);
  }

  return response.json();
}

export async function submitActionDecision(actionId: string, decision: "approve" | "reject", tenantId?: string) {
  const response = await fetch(`${API_BASE}/actions/${actionId}/decision`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": getTenantId(tenantId),
    },
    body: JSON.stringify({ decision, reason: "" }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit action decision: ${response.statusText}`);
  }

  return response.json();
}

export async function executeAction(actionId: string, tenantId?: string) {
  const response = await fetch(`${API_BASE}/actions/${actionId}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": getTenantId(tenantId),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to execute action: ${response.statusText}`);
  }

  return response.json();
}

export async function createDeal(
  dealData: { name: string; amount: number; stage: string; client?: string; owner?: string },
  tenantId: string = DEFAULT_TENANT_ID
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
  tenantId: string = DEFAULT_TENANT_ID
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

export async function deleteDeal(dealId: string, tenantId: string = DEFAULT_TENANT_ID) {
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

export async function syncHubSpotDeals(tenantId: string = DEFAULT_TENANT_ID) {
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

export async function fetchDealSnapshot(dealId: string, tenantId: string = DEFAULT_TENANT_ID) {
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
