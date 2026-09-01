"""DealSense API — v1 Router.

Aggregates all v1 endpoint routers into a single API router.
"""

from fastapi import APIRouter

from dealsense.api.v1.actions import router as actions_router
from dealsense.api.v1.deals import router as deals_router
from dealsense.api.v1.oauth import router as oauth_router
from dealsense.api.v1.webhooks import router as webhooks_router

api_v1_router = APIRouter(tags=["v1"])

# Register sub-routers
api_v1_router.include_router(oauth_router)
api_v1_router.include_router(webhooks_router)
api_v1_router.include_router(deals_router)
api_v1_router.include_router(actions_router)


@api_v1_router.get("/status")
async def api_status() -> dict[str, str]:
    """API v1 status check."""
    return {
        "api": "v1",
        "status": "operational",
        "product": "DealSense",
    }
