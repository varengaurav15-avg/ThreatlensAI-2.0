"""
Hybrid Analysis sandbox integration (CrowdStrike).
Free API — full behavioral sandbox, threat scores, network indicators.
Sign up at: https://www.hybrid-analysis.com
"""
import httpx, os, logging, asyncio
from dotenv import load_dotenv
from _paths import ENV_PATH

load_dotenv(dotenv_path=ENV_PATH, override=False)
logger = logging.getLogger("sandbox")

BASE_URL    = "https://www.hybrid-analysis.com/api/v2"
ENVIRONMENT = 110   # Windows 10 64-bit

VERDICT_MAP = {
    "malicious":   ("CRITICAL", 9.5),
    "suspicious":  ("HIGH",     7.0),
    "whitelisted": ("LOW",      1.0),
    "no specific threat": ("LOW", 2.0),
    "unknown":     ("MEDIUM",  5.0),
}


def _key() -> str:
    return os.getenv("HYBRID_ANALYSIS_API_KEY", "").strip()


def _headers() -> dict:
    return {
        "api-key":    _key(),
        "User-Agent": "Falcon Sandbox",
        "accept":     "application/json",
    }


async def submit_file(file_path: str) -> dict:
    """
    Submit a file to Hybrid Analysis sandbox.
    Returns {"job_id": str, "sha256": str, "error": str|None}
    """
    if not _key():
        return {"error": "HYBRID_ANALYSIS_API_KEY not set. Add it in Settings."}

    if not os.path.isfile(file_path):
        return {"error": f"File not found: {file_path}"}

    file_size = os.path.getsize(file_path)
    if file_size > 100 * 1024 * 1024:   # 100 MB limit
        return {"error": "File too large (max 100 MB)"}

    try:
        with open(file_path, "rb") as f:
            file_bytes = f.read()

        filename = os.path.basename(file_path)

        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                f"{BASE_URL}/submit/file",
                headers=_headers(),
                data={"environment_id": ENVIRONMENT},
                files={"file": (filename, file_bytes, "application/octet-stream")},
            )

        logger.info("Sandbox submit HTTP %s", resp.status_code)

        if resp.status_code not in (200, 201):
            return {"error": f"Submission failed: HTTP {resp.status_code} — {resp.text[:200]}"}

        data = resp.json()
        job_id = data.get("job_id", "")
        sha256 = data.get("sha256", "")

        if not job_id:
            return {"error": "No job_id returned from Hybrid Analysis"}

        logger.info("Sandbox job submitted: job_id=%s sha256=%s", job_id, sha256)
        return {"job_id": job_id, "sha256": sha256, "error": None}

    except Exception as e:
        logger.error("Sandbox submit error: %s", e)
        return {"error": str(e)}


async def get_report(job_id: str) -> dict:
    """
    Poll for sandbox report. Returns parsed result or {"state": "in_progress"}.
    """
    if not _key():
        return {"error": "API key not set"}

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(
                f"{BASE_URL}/report/{job_id}/summary",
                headers=_headers(),
            )

        if resp.status_code == 404:
            return {"state": "in_progress"}

        if resp.status_code != 200:
            return {"error": f"HTTP {resp.status_code}"}

        data = resp.json()
        state = data.get("state", "unknown")

        if state not in ("SUCCESS", "ERROR"):
            return {"state": "in_progress", "raw_state": state}

        # Parse the report
        verdict_raw = (data.get("verdict") or "unknown").lower()
        verdict_label, threat_score = VERDICT_MAP.get(verdict_raw, ("MEDIUM", 5.0))

        # Network indicators
        network = data.get("network_mode", "")
        domains  = [h.get("domain", "") for h in (data.get("domains") or [])[:5]]
        hosts    = [h.get("ip", "")     for h in (data.get("hosts")   or [])[:5]]

        # MITRE ATT&CK
        mitre_tags = []
        for a in (data.get("mitre_attcks") or []):
            t = a.get("tactic") or a.get("technique", "")
            if t:
                mitre_tags.append(t)

        # Signatures
        sigs = [s.get("name", "") for s in (data.get("signatures") or [])[:8] if s.get("name")]

        report = {
            "state":        "complete",
            "verdict":      verdict_label,
            "threat_score": threat_score,
            "verdict_raw":  verdict_raw,
            "analysis_url": f"https://www.hybrid-analysis.com/sample/{data.get('sha256', '')}",
            "sha256":       data.get("sha256", ""),
            "av_detect":    data.get("av_detect", 0),          # % of AVs that flagged it
            "threat_level": data.get("threat_level", 0),       # 0-2
            "signatures":   sigs,
            "domains":      [d for d in domains if d],
            "hosts":        [h for h in hosts    if h],
            "mitre_tags":   mitre_tags,
            "environment":  data.get("environment_description", "Windows 10 64-bit"),
            "duration":     data.get("total_processes", 0),
        }

        logger.info("Sandbox complete: verdict=%s score=%s av_detect=%s%%",
                    verdict_label, threat_score, report["av_detect"])
        return report

    except Exception as e:
        logger.error("get_report error: %s", e)
        return {"error": str(e)}


async def analyze_file(file_path: str, poll_interval: int = 20, max_wait: int = 300) -> dict:
    """
    Full flow: submit → poll until complete → return report.
    max_wait = 300 s (5 min). Returns the final report dict.
    """
    submit = await submit_file(file_path)
    if submit.get("error"):
        return submit

    job_id = submit["job_id"]
    waited = 0

    while waited < max_wait:
        await asyncio.sleep(poll_interval)
        waited += poll_interval
        result = await get_report(job_id)

        if result.get("state") == "complete":
            result["job_id"] = job_id
            return result
        if result.get("error"):
            return result
        logger.info("Sandbox job %s still running (%ds elapsed)…", job_id, waited)

    return {"error": f"Analysis timed out after {max_wait}s", "job_id": job_id}
