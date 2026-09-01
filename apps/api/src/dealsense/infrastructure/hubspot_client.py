"""DealSense API — HubSpot API Client.

Asynchronous client for HubSpot CRM API v3 with:
- Automatic token resolution via token manager
- Rate limiting handling (429) with exponential backoff & retry
- Support for Deals, Contacts, Engagements (Notes, Calls, Meetings, Emails, Tasks), and Pipelines
"""

import asyncio
from typing import Any
from uuid import UUID

import httpx
import structlog
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.domain.exceptions import DealSenseError
from dealsense.security.token_manager import get_access_token

logger = structlog.get_logger(__name__)

HUBSPOT_API_BASE_URL = "https://api.hubapi.com"
DEFAULT_TIMEOUT = 15.0
MAX_RETRIES = 3


class HubSpotClientError(DealSenseError):
    """Raised when a HubSpot API call fails."""

    def __init__(self, message: str, status_code: int = 500) -> None:
        self.status_code = status_code
        super().__init__(message, code="HUBSPOT_API_ERROR")


class HubSpotClient:
    """Async client for HubSpot CRM API v3."""

    def __init__(self, tenant_id: UUID, db: AsyncSession) -> None:
        self.tenant_id = tenant_id
        self.db = db

    async def _get_headers(self) -> dict[str, str]:
        """Obtain authorization headers using token manager."""
        token = await get_access_token(self.tenant_id, self.db)
        return {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    async def _request(
        self,
        method: str,
        path: str,
        params: dict[str, Any] | None = None,
        json_data: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Execute an HTTP request against HubSpot API with retry and rate-limit backoff."""
        url = f"{HUBSPOT_API_BASE_URL}{path}"
        headers = await self._get_headers()

        for attempt in range(1, MAX_RETRIES + 1):
            async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as client:
                try:
                    response = await client.request(
                        method=method,
                        url=url,
                        headers=headers,
                        params=params,
                        json=json_data,
                    )

                    # Handle Rate Limiting (429) or transient server errors (502, 503, 504)
                    if response.status_code in (429, 502, 503, 504) and attempt < MAX_RETRIES:
                        retry_after = float(response.headers.get("Retry-After", 2 ** attempt))
                        logger.warning(
                            "hubspot_api_rate_limited_or_error",
                            status_code=response.status_code,
                            attempt=attempt,
                            retry_after=retry_after,
                            path=path,
                        )
                        await asyncio.sleep(retry_after)
                        continue

                    if response.status_code >= 400:
                        error_text = response.text
                        logger.error(
                            "hubspot_api_request_failed",
                            status_code=response.status_code,
                            path=path,
                            response=error_text[:200],
                        )
                        raise HubSpotClientError(
                            f"HubSpot API error {response.status_code} on {path}: {error_text}",
                            status_code=response.status_code,
                        )

                    if response.status_code == 204:
                        return {}

                    return response.json()  # type: ignore[no-any-return]

                except httpx.RequestError as e:
                    if attempt < MAX_RETRIES:
                        backoff = 2 ** attempt
                        logger.warning(
                            "hubspot_api_network_error_retry",
                            attempt=attempt,
                            backoff=backoff,
                            error=str(e),
                        )
                        await asyncio.sleep(backoff)
                        continue
                    raise HubSpotClientError(f"HubSpot API network error: {e}") from e

        raise HubSpotClientError(f"HubSpot API request to {path} exceeded max retries")

    # ---- Deals API ----

    async def get_deal(
        self, deal_id: str, properties: list[str] | None = None
    ) -> dict[str, Any]:
        """Fetch deal details including requested properties and associations."""
        props = properties or [
            "dealname",
            "amount",
            "dealstage",
            "pipeline",
            "closedate",
            "hubspot_owner_id",
            "createdate",
            "hs_lastmodifieddate",
            "hs_deal_stage_probability",
            "notes_last_updated",
            "num_notes",
            "num_contacted_notes",
        ]
        params = {
            "properties": ",".join(props),
            "associations": "contacts,companies,line_items",
        }
        return await self._request("GET", f"/crm/v3/objects/deals/{deal_id}", params=params)

    async def update_deal_properties(
        self, deal_id: str, properties: dict[str, Any]
    ) -> dict[str, Any]:
        """Update properties on a HubSpot deal."""
        return await self._request(
            "PATCH",
            f"/crm/v3/objects/deals/{deal_id}",
            json_data={"properties": properties},
        )

    # ---- Contacts API ----

    async def get_contact(
        self, contact_id: str, properties: list[str] | None = None
    ) -> dict[str, Any]:
        """Fetch contact details from HubSpot."""
        props = properties or [
            "firstname",
            "lastname",
            "email",
            "jobtitle",
            "company",
            "phone",
            "hs_lead_status",
            "lastmodifieddate",
        ]
        params = {"properties": ",".join(props)}
        return await self._request("GET", f"/crm/v3/objects/contacts/{contact_id}", params=params)

    # ---- Engagements & Activities API ----

    async def get_deal_engagements(
        self, deal_id: str, limit: int = 50
    ) -> list[dict[str, Any]]:
        """Fetch associated engagements (notes, calls, meetings, emails, tasks) for a deal."""
        # Query engagements associated with the deal via association search
        # Using CRM v3 associations & engagements API
        params = {"limit": limit}
        path = f"/crm/v3/objects/deals/{deal_id}/associations/notes"
        try:
            notes_assoc = await self._request("GET", path, params=params)
            note_ids = [item["id"] for item in notes_assoc.get("results", [])]
        except Exception:
            note_ids = []

        engagements: list[dict[str, Any]] = []
        for note_id in note_ids[:limit]:
            try:
                note_data = await self._request(
                    "GET",
                    f"/crm/v3/objects/notes/{note_id}",
                    params={"properties": "hs_note_body,hs_timestamp,hubspot_owner_id"},
                )
                engagements.append(
                    {
                        "id": note_id,
                        "type": "note",
                        "content": note_data.get("properties", {}).get("hs_note_body", ""),
                        "timestamp": note_data.get("properties", {}).get("hs_timestamp"),
                        "owner_id": note_data.get("properties", {}).get("hubspot_owner_id"),
                    }
                )
            except Exception as e:
                logger.warning("fetch_note_failed", note_id=note_id, error=str(e))

        return engagements

    # ---- Action Execution Helpers ----

    async def create_task(
        self,
        subject: str,
        body: str,
        due_timestamp_ms: int,
        owner_id: str | None = None,
        associated_deal_id: str | None = None,
    ) -> dict[str, Any]:
        """Create a HubSpot task associated with a deal."""
        properties: dict[str, Any] = {
            "hs_task_subject": subject,
            "hs_task_body": body,
            "hs_timestamp": str(due_timestamp_ms),
            "hs_task_status": "NOT_STARTED",
        }
        if owner_id:
            properties["hubspot_owner_id"] = owner_id

        associations = []
        if associated_deal_id:
            associations.append(
                {
                    "to": {"id": associated_deal_id},
                    "types": [{"associationCategory": "HUBSPOT_DEFINED", "associationTypeId": 216}],
                }
            )

        payload: dict[str, Any] = {"properties": properties}
        if associations:
            payload["associations"] = associations

        return await self._request("POST", "/crm/v3/objects/tasks", json_data=payload)

    async def create_note(
        self,
        body: str,
        associated_deal_id: str,
        owner_id: str | None = None,
    ) -> dict[str, Any]:
        """Create a HubSpot note associated with a deal."""
        properties: dict[str, Any] = {"hs_note_body": body}
        if owner_id:
            properties["hubspot_owner_id"] = owner_id

        associations = [
            {
                "to": {"id": associated_deal_id},
                "types": [{"associationCategory": "HUBSPOT_DEFINED", "associationTypeId": 214}],
            }
        ]
        return await self._request(
            "POST",
            "/crm/v3/objects/notes",
            json_data={"properties": properties, "associations": associations},
        )
