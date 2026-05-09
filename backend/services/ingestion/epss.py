import httpx

async def get_epss_scores(cve_ids: list) -> dict:
    if not cve_ids:
        return {}
    ids = ",".join(cve_ids)
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(f"https://api.first.org/data/v1/epss?cve={ids}")
        data = resp.json()
    return {
        item["cve"]: float(item["epss"])
        for item in data.get("data", [])
    }