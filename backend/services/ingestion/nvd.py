import httpx, asyncio, os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()
NVD_BASE = "https://services.nvd.nist.gov/rest/json/cves/2.0"

async def fetch_recent_cves(hours_back: int = 72) -> list:
    now   = datetime.utcnow()
    start = now - timedelta(hours=hours_back)

    # NVD requires exactly this format
    params = {
        "pubStartDate": start.strftime("%Y-%m-%dT%H:%M:%S.000"),
        "pubEndDate":   now.strftime("%Y-%m-%dT%H:%M:%S.000"),
        "resultsPerPage": 50,
    }

    api_key = os.getenv("NVD_API_KEY", "")
    headers = {}
    if api_key:
        headers["apiKey"] = api_key   # NVD wants it in the header, not params

    print(f"Calling NVD: {start.strftime('%Y-%m-%d')} → {now.strftime('%Y-%m-%d')}")
    await asyncio.sleep(6)  # mandatory — NVD rate limits hard

    async with httpx.AsyncClient(timeout=40) as client:
        resp = await client.get(NVD_BASE, params=params, headers=headers)

    # Debug — print what NVD actually returned
    print(f"NVD status: {resp.status_code}")
    print(f"NVD response preview: {resp.text[:300]}")

    if resp.status_code != 200:
        print(f"NVD error {resp.status_code}: {resp.text[:200]}")
        return []

    if not resp.text.strip():
        print("NVD returned empty body — retrying without API key")
        return await _fetch_without_key(params)

    try:
        data = resp.json()
    except Exception as e:
        print(f"JSON parse failed: {e}")
        print(f"Raw response: {resp.text[:500]}")
        return []

    return _parse_cves(data)


async def _fetch_without_key(params: dict) -> list:
    """Fallback — NVD works without a key, just slower"""
    await asyncio.sleep(6)
    async with httpx.AsyncClient(timeout=40) as client:
        resp = await client.get(NVD_BASE, params=params)
    if resp.status_code != 200 or not resp.text.strip():
        print(f"Fallback also failed: {resp.status_code}")
        return []
    try:
        return _parse_cves(resp.json())
    except Exception as e:
        print(f"Fallback JSON parse failed: {e}")
        return []


def _parse_cves(data: dict) -> list:
    results = []
    for item in data.get("vulnerabilities", []):
        cve  = item.get("cve", {})
        cvss = _extract_cvss(cve)

        desc = ""
        for d in cve.get("descriptions", []):
            if d.get("lang") == "en":
                desc = d.get("value", "")
                break

        if not desc:
            continue  # skip CVEs with no English description

        results.append({
            "id":         f"nvd-{cve.get('id', 'unknown')}",
            "cve":        cve.get("id", ""),
            "title":      desc[:150],
            "source":     "NVD",
            "origin":     "GLOBAL",
            "cvss_score": cvss,
            "raw_data":   desc[:3000],
        })

    print(f"Parsed {len(results)} CVEs from NVD")
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
    return 5.0  # default if no score found