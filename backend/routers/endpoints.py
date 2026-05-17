from fastapi import APIRouter
from sqlalchemy import select
from database import AsyncSessionLocal
from models.threat import Threat
from services.agents.endpoint_stats import (
    get_machine_name, get_local_ip, get_os_name, get_stats
)
from services.llm import _chat, _key

router = APIRouter(prefix="/api/endpoints", tags=["endpoints"])


@router.get("/")
async def get_endpoints():
    """Returns live stats for the local machine as an endpoint."""
    stats = get_stats()

    # Count unresolved endpoint incidents
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Threat).where(
                Threat.origin  == "ENDPOINT",
                Threat.resolved == False,
            )
        )
        active_incidents = result.scalars().all()

    incident_count = len(active_incidents)
    status = "INCIDENT" if incident_count > 0 else "HEALTHY"

    return [{
        "id":        1,
        "name":      get_machine_name(),
        "os":        get_os_name(),
        "ip":        get_local_ip(),
        "status":    status,
        "lastSeen":  "Live",
        "incidents": incident_count,
        "agent":     "v1.0.0",
        "cpu":       stats["cpu"],
        "mem":       stats["mem"],
    }]

@router.get("/summary")
async def get_endpoint_summary():
    """Generates an AI summary of the endpoint's current state."""
    stats = get_stats()
    
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Threat).where(Threat.origin == "ENDPOINT", Threat.resolved == False)
        )
        incidents = result.scalars().all()
        
    incident_count = len(incidents)
    incident_details = ", ".join([t.title for t in incidents]) if incident_count > 0 else "None"
    
    raw_state = f"""
    Endpoint: {get_machine_name()} ({get_os_name()})
    IP: {get_local_ip()}
    CPU: {stats['cpu']}%
    Memory: {stats['mem']}%
    Active Incidents: {incident_count} ({incident_details})
    """
    
    if not _key():
        return {"summary": f"Endpoint is {'HEALTHY' if incident_count == 0 else 'CRITICAL'}. CPU at {stats['cpu']}%, Memory at {stats['mem']}%. Active incidents: {incident_count}. Add OpenAI API key for AI analysis."}
        
    summary = await _chat(
        "You are an expert SOC Analyst monitoring a critical endpoint. Write a 3 sentence health report based on the provided state. Be analytical and professional.",
        raw_state,
        max_tokens=150
    )
    
    return {"summary": summary}
