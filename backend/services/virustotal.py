import httpx, os
from dotenv import load_dotenv
from _paths import ENV_PATH

load_dotenv(dotenv_path=ENV_PATH, override=False)

VT_BASE = "https://www.virustotal.com/api/v3"


def _headers() -> dict:
    return {"x-apikey": os.getenv("VIRUSTOTAL_API_KEY", "")}


def _verdict(malicious: int) -> str:
    if malicious >= 5:
        return "MALICIOUS"
    if malicious >= 1:
        return "SUSPICIOUS"
    return "CLEAN"


async def scan_url(url: str) -> dict:
    """Submit a URL to VirusTotal and return a verdict dict."""
    api_key = os.getenv("VIRUSTOTAL_API_KEY", "")
    if not api_key:
        return {"verdict": "UNKNOWN", "positives": 0, "total": 0, "error": "No API key"}
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                f"{VT_BASE}/urls",
                headers=_headers(),
                data={"url": url},
            )
            if resp.status_code not in (200, 201):
                return {"verdict": "UNKNOWN", "positives": 0, "total": 0}
            analysis_id = resp.json().get("data", {}).get("id", "")
            if not analysis_id:
                return {"verdict": "UNKNOWN", "positives": 0, "total": 0}
            result_resp = await client.get(
                f"{VT_BASE}/analyses/{analysis_id}",
                headers=_headers(),
            )
        stats      = result_resp.json().get("data", {}).get("attributes", {}).get("stats", {})
        malicious  = stats.get("malicious", 0)
        total      = sum(stats.values()) if stats else 0
        return {"verdict": _verdict(malicious), "positives": malicious, "total": total}
    except Exception as e:
        return {"verdict": "UNKNOWN", "positives": 0, "total": 0, "error": str(e)}


async def lookup_hash(file_hash: str) -> dict:
    """Look up a file hash in VirusTotal."""
    api_key = os.getenv("VIRUSTOTAL_API_KEY", "")
    if not api_key:
        return {"verdict": "UNKNOWN", "positives": 0, "total": 0, "error": "No API key"}
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{VT_BASE}/files/{file_hash}",
                headers=_headers(),
            )
        if resp.status_code != 200:
            return {"verdict": "UNKNOWN", "positives": 0, "total": 0}
        attrs     = resp.json().get("data", {}).get("attributes", {})
        stats     = attrs.get("last_analysis_stats", {})
        malicious = stats.get("malicious", 0)
        total     = sum(stats.values()) if stats else 0
        return {
            "verdict":   _verdict(malicious),
            "positives": malicious,
            "total":     total,
            "name":      attrs.get("meaningful_name", file_hash),
        }
    except Exception as e:
        return {"verdict": "UNKNOWN", "positives": 0, "total": 0, "error": str(e)}
