import httpx, asyncio, os, logging
from dotenv import load_dotenv
from _paths import ENV_PATH
from datetime import datetime, timedelta

load_dotenv(dotenv_path=ENV_PATH, override=False)
logger = logging.getLogger("nvd")
NVD_BASE = "https://services.nvd.nist.gov/rest/json/cves/2.0"


async def fetch_recent_cves(hours_back: int = 72) -> list:
    now   = datetime.utcnow()
    start = now - timedelta(hours=hours_back)
    params = {
        "pubStartDate":   start.strftime("%Y-%m-%dT%H:%M:%S.000"),
        "pubEndDate":     now.strftime("%Y-%m-%dT%H:%M:%S.000"),
        "resultsPerPage": 50,
    }
    api_key = os.getenv("NVD_API_KEY", "")
    headers = {"apiKey": api_key} if api_key else {}

    await asyncio.sleep(2)
    logger.info("Calling NVD API (last %sh)", hours_back)
    try:
        async with httpx.AsyncClient(timeout=40) as client:
            resp = await client.get(NVD_BASE, params=params, headers=headers)
        logger.info("NVD response: %s", resp.status_code)
        if resp.status_code != 200 or not resp.text.strip():
            logger.warning("NVD returned %s — skipping", resp.status_code)
            return []
        return _parse_cves(resp.json())
    except Exception as e:
        logger.error("NVD request failed: %s", e)
        return []


def _parse_cves(data: dict) -> list:
    results = []
    for item in data.get("vulnerabilities", []):
        cve  = item.get("cve", {})
        cvss = _extract_cvss(cve)
        desc = next(
            (d["value"] for d in cve.get("descriptions", []) if d.get("lang") == "en"),
            ""
        )
        if not desc:
            continue
        results.append({
            "id":         "nvd-" + cve.get("id", "unknown"),
            "cve":        cve.get("id", ""),
            "title":      desc[:150],
            "source":     "NVD",
            "origin":     "GLOBAL",
            "cvss_score": cvss,
            "raw_data":   desc[:3000],
        })
    logger.info("NVD parsed %d CVEs", len(results))
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
