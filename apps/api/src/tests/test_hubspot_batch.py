"""Test suite for HubSpotClient batch operations and rate-limiting retry backoff."""

from unittest.mock import AsyncMock, patch
from uuid import uuid4

import httpx
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from dealsense.infrastructure.hubspot_client import HubSpotClient


@pytest.fixture
def mock_db() -> AsyncMock:
    return AsyncMock(spec=AsyncSession)


@pytest.fixture
def hubspot_client(mock_db: AsyncMock) -> HubSpotClient:
    tenant_id = uuid4()
    with patch("dealsense.infrastructure.hubspot_client.get_access_token", new_callable=AsyncMock) as mock_token:
        mock_token.return_value = "mock-access-token"
        client = HubSpotClient(tenant_id=tenant_id, db=mock_db)
        return client


class TestHubSpotBatchUpdates:
    """Test suite for batch updates on HubSpot deals."""

    @pytest.mark.asyncio
    async def test_batch_update_empty_list(self, hubspot_client: HubSpotClient) -> None:
        """Empty input list should immediately return empty results without network call."""
        results = await hubspot_client.batch_update_deals([])
        assert results == []

    @pytest.mark.asyncio
    async def test_batch_update_single_chunk(self, hubspot_client: HubSpotClient) -> None:
        """Inputs <= 100 should execute in a single batch request."""
        deal_updates = [
            {"id": f"deal-{i}", "properties": {"dealsense_health_score": str(70 + i)}}
            for i in range(10)
        ]

        expected_response = {
            "status": "COMPLETE",
            "results": [{"id": d["id"], "properties": d["properties"]} for d in deal_updates],
        }

        with patch.object(hubspot_client, "_request", new_callable=AsyncMock) as mock_req:
            mock_req.return_value = expected_response
            results = await hubspot_client.batch_update_deals(deal_updates)

            assert len(results) == 10
            mock_req.assert_called_once_with(
                "POST",
                "/crm/v3/objects/deals/batch/update",
                json_data={"inputs": deal_updates},
            )

    @pytest.mark.asyncio
    async def test_batch_update_auto_chunking_over_100(self, hubspot_client: HubSpotClient) -> None:
        """Inputs > 100 (e.g. 235 deals) must partition into 100-item chunks."""
        total_deals = 235
        deal_updates = [
            {"id": f"deal-{i}", "properties": {"dealsense_health_score": "80"}}
            for i in range(total_deals)
        ]

        with patch.object(hubspot_client, "_request", new_callable=AsyncMock) as mock_req:
            # Return chunked results matching the slice sizes
            def fake_request(method, path, **kwargs):
                inputs = kwargs.get("json_data", {}).get("inputs", [])
                return {"status": "COMPLETE", "results": [{"id": item["id"]} for item in inputs]}

            mock_req.side_effect = fake_request
            results = await hubspot_client.batch_update_deals(deal_updates)

            assert len(results) == total_deals
            # 235 items -> 3 chunks (100, 100, 35)
            assert mock_req.call_count == 3

    @pytest.mark.asyncio
    async def test_rate_limiting_429_exponential_backoff(self, hubspot_client: HubSpotClient) -> None:
        """Verify 429 response triggers backoff sleep and subsequent retry."""
        tenant_id = uuid4()
        with (
            patch("dealsense.infrastructure.hubspot_client.get_access_token", new_callable=AsyncMock) as mock_token,
            patch("asyncio.sleep", new_callable=AsyncMock) as mock_sleep,
            patch("httpx.AsyncClient.request", new_callable=AsyncMock) as mock_http_req,
        ):
            mock_token.return_value = "mock-token"

            # 1st call: 429 Rate Limit with Retry-After 1.5s
            resp_429 = httpx.Response(
                status_code=429,
                headers={"Retry-After": "1.5"},
                request=httpx.Request("POST", "https://api.hubapi.com/crm/v3/objects/deals/batch/update"),
            )
            # 2nd call: 200 OK
            resp_200 = httpx.Response(
                status_code=200,
                json={"results": [{"id": "deal-1"}]},
                request=httpx.Request("POST", "https://api.hubapi.com/crm/v3/objects/deals/batch/update"),
            )
            mock_http_req.side_effect = [resp_429, resp_200]

            client = HubSpotClient(tenant_id=tenant_id, db=AsyncMock(spec=AsyncSession))
            results = await client.batch_update_deals([{"id": "deal-1", "properties": {}}])

            assert len(results) == 1
            assert mock_http_req.call_count == 2
            mock_sleep.assert_called_once_with(1.5)
