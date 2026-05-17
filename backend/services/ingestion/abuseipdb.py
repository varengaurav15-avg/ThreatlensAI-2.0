import httpx, os, logging
from dotenv import load_dotenv
from _paths import ENV_PATH

load_dotenv(dotenv_path=ENV_PATH, override=False)
logger = logging.getLogger("abuseipdb")


async def get_ip_threats(limit: int = 50) -> list:
    api_key = os.getenv("ABUSEIPDB_API_KEY", "")
    if not api_key:
        logger.warning("ABUSEIPDB_API_KEY not set")
        return []

    headers = {"Key": api_key, "Accept": "application/json"}
    params  = {"confidenceMinimum": 75, "limit": limit}

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                "https://api.abuseipdb.com/api/v2/blacklist",
                headers=headers, params=params
            )
        logger.info("AbuseIPDB response: HTTP %s", resp.status_code)
        if resp.status_code != 200:
            logger.warning("AbuseIPDB error: %s", resp.text[:200])
            return []
        data = resp.json()
    except Exception as e:
        logger.error("AbuseIPDB request failed: %s", e)
        return []

    results = []
    for item in data.get("data", []):
        ip = item.get("ipAddress", "unknown")
        confidence = item.get("abuseConfidenceScore", 0)
        country = item.get("countryCode", "??")
        threat = {
            "id":         "abuseipdb-" + ip.replace(".", "-"),
            "cve":        None,
            "title":      "Malicious IP " + ip + " (" + country + ") confidence " + str(confidence) + "%",
            "source":     "AbuseIPDB",
            "origin":     "GLOBAL",
            "cvss_score": 7.5,
            "epss_score": round(confidence / 100, 2),
            "raw_data":   str(item)[:3000],
        }
        results.append(threat)

    logger.info("AbuseIPDB returned %d IP threats", len(results))
    return results


async def get_malicious_ips(limit: int = 100) -> list:
    threats = await get_ip_threats(limit=limit)
    return [t["title"].split()[2] for t in threats]
