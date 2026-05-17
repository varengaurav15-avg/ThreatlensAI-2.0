from fastapi import APIRouter, BackgroundTasks
from services.sandbox import submit_file, get_report, analyze_file
import logging

router = APIRouter(prefix="/api/sandbox", tags=["sandbox"])
logger = logging.getLogger("sandbox_router")

# In-memory store for job results (keyed by job_id)
_results: dict[str, dict] = {}


@router.post("/analyze")
async def start_analysis(payload: dict, background_tasks: BackgroundTasks):
    """
    Start a sandbox analysis for a file path.
    Returns job_id immediately. Poll /api/sandbox/result/{job_id} for status.
    Body: { "file_path": "C:\\...\\suspicious.exe" }
    """
    file_path = payload.get("file_path", "").strip()
    if not file_path:
        return {"error": "file_path is required"}

    # Submit immediately to get job_id
    submit = await submit_file(file_path)
    if submit.get("error"):
        return submit

    job_id = submit.get("job_id") or submit.get("submission_id", "")
    if not job_id:
        return {"error": "No job_id returned from sandbox service"}
    _results[job_id] = {"state": "in_progress", "job_id": job_id}

    # Poll in background
    async def _poll(jid: str, fp: str):
        result = await analyze_file(fp)
        _results[jid] = result

    background_tasks.add_task(_poll, job_id, file_path)

    return {"job_id": job_id, "state": "in_progress", "sha256": submit.get("sha256", "")}


@router.get("/result/{job_id}")
async def get_result(job_id: str):
    """Poll this endpoint every 15 s until state == 'complete'."""
    if job_id in _results:
        return _results[job_id]
    # Not in cache — try fetching directly
    return await get_report(job_id)
