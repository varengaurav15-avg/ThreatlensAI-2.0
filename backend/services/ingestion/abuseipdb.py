import httpx, os
from dotenv import load_dotenv
from _paths import ENV_PATH

load_dotenv(dotenv_path=ENV_PATH, override=False)

async def get_malicious_ips(limit: int = 100) -> list:
    headers = {"Key": os.getenv("ABUSEIPDB_API_KEY", ""), "Accept": "application/json"}
    params  = {"confidenceMinimum": 90, "limit": limit}
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            "https://api.abuseipdb.com/api/v2/blacklist",
            headers=headers, params=params
        )
        data = resp.json()
    return [item["ipAddress"] for item in data.get("data", [])]
