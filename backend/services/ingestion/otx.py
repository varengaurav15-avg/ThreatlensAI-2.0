import httpx, os
from dotenv import load_dotenv
from _paths import ENV_PATH

load_dotenv(dotenv_path=ENV_PATH, override=False)

async def fetch_pulses() -> list:
    headers = {"X-OTX-API-KEY": os.getenv("OTX_API_KEY", "")}
    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(
            "https://otx.alienvault.com/api/v1/pulses/subscribed",
            headers=headers
        )
        data = resp.json()
    results = []
    for pulse in data.get("results", [])[:20]:
        results.append({
            "id":         f"otx-{pulse['id']}",
            "title":      pulse["name"],
            "source":     "OTX",
            "origin":     "GLOBAL",
            "severity":   "HIGH",
            "cvss_score": 7.0,
            "raw_data":   str(pulse)[:3000]
        })
    return results
