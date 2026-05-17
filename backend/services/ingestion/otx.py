import httpx, os, logging
from dotenv import load_dotenv
from _paths import ENV_PATH

load_dotenv(dotenv_path=ENV_PATH, override=False)
logger = logging.getLogger("otx")

ENDPOINTS = [
    "https://otx.alienvault.com/api/v1/pulses/activity",
    "https://otx.alienvault.com/api/v1/pulses/subscribed",
]

async def fetch_pulses() -> list:
    api_key = os.getenv("OTX_API_KEY", "")
    if not api_key:
        logger.warning("OTX_API_KEY not set")
        return []

    headers = {"X-OTX-API-KEY": api_key}
    results = []

    async with httpx.AsyncClient(timeout=20) as client:
        for url in ENDPOINTS:
            try:
                resp = await client.get(url, headers=headers)
                name = url.split("/")[-1]
                logger.info("OTX %s: HTTP %s", name, resp.status_code)
                if resp.status_code != 200:
                    continue
                pulses = resp.json().get("results", [])
                if not pulses:
                    continue
                for pulse in pulses[:20]:
                    pid = pulse.get("id", "")
                    if not pid:
                        continue
                    results.append({
                        "id":         "otx-" + str(pid),
                        "cve":        None,
                        "title":      pulse.get("name", "OTX Pulse")[:150],
                        "source":     "OTX",
                        "origin":     "GLOBAL",
                        "cvss_score": 7.0,
                        "epss_score": 0.2,
                        "raw_data":   str(pulse)[:3000],
                        "lat":        30 + (hash(pid) % 40) - 20,
                        "lng":        -10 + (hash(pid) % 100) - 50,
                    })
                logger.info("OTX fetched %d pulses", len(results))
                break
            except Exception as e:
                logger.error("OTX error: %s", e)

    return results
