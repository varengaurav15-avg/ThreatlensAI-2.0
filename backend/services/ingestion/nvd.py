import httpx, asyncio, os
from dotenv import load_dotenv
from _paths import ENV_PATH
from datetime import datetime, timedelta

load_dotenv(dotenv_path=ENV_PATH, override=False)
NVD_BASE = "https://services.nvd.nist.gov/rest/json/cves/2.0"

async def fetch_recent_cves(hours_back: int = 72) -> list:
    now   = datetime.utcnow()
    start = now - timedelta(hours=hours_back)
    params = {
        "pubStartDate": start.strftime("%Y-%m-%dT%H:%M:%S.000"),
        "pubEndDate":   now.strftime("%Y-%m-%dT%H:%M:%S.000"),
        "resultsPerPage": 50,
    }
    api_key = os.getenv("NVD_API_KEY", "")
    headers = {"apiKey": api_key} if api_key else {}
    print(f"Calling NVD: {start.strftime('%Y-%m-%d')} → {now.strftime('%Y-%m-%d')}")
    await asyncio.sleep(6)
    async with httpx.AsyncClient(timeout=40) as client:
        resp = await client.get(NVD_BASE, params=params, headers=headers)
    print(f"NVD status: {resp.status_code}")
    if resp.status_code != 200 or not resp.text.strip():
        return []
    try:
        return _parse_cves(resp.json())
    except Exception as e:
        print(f"NVD parse error: {e}")
        return []

def _parse_cves(data: dict) -> list:
    results = []
    for item in data.get("vulnerabilities", []):
        cve  = item.get("cve", {})
        cvss = _extract_cvss(cve)
        desc = next((d["value"] for d in cve.get("descriptions", []) if d.get("lang") == "en"), "")
        if not desc:
            continue
        results.append({
            "id":         f"nvd-{cve.get('id','unknown')}",
            "cve":        cve.get("id", ""),
            "title":      desc[:150],
            "source":     "NVD",
            "origin":     "GLOBAL",
            "cvss_score": cvss,
            "raw_data":   desc[:3000],
        })
    print(f"Parsed {len(results)} CVEs")
    return results

def _extract_cvss(cve: dict) -> float:
    metrics = cve.get("metrics", {})
    for key in ["cvssMetricV31", "cvssMetricV30", "cvssMetricV2"]:
        m = metrics.get(key)
        if m:
            try:
                return float(m[0]["cvssData"]["baseScore"])
            except (KeyError, IndexError, TypeError):
                continue
    return 5.0
