import os, httpx
from fastapi import APIRouter

router = APIRouter(prefix="/api/otx", tags=["otx"])

OTX_BASE = "https://otx.alienvault.com/api/v1"


@router.get("/pulses")
async def otx_pulses(limit: int = 20, page: int = 1):
    key = os.getenv("OTX_API_KEY", "")
    async with httpx.AsyncClient(timeout=12) as client:
        r = await client.get(
            f"{OTX_BASE}/pulses/subscribed",
            params={"limit": limit, "page": page},
            headers={"X-OTX-API-KEY": key},
        )
    return r.json()
