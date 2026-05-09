from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.threat import Threat
from services.scoring import score_threat, score_to_severity
from services.llm import summarize_threat
from services.mitre import map_to_mitre
import uuid, json
from datetime import datetime

router = APIRouter(prefix="/api/incidents", tags=["incidents"])
sio_server = None   # injected from main.py

@router.post("/ingest")
async def ingest_incident(event: dict, db: AsyncSession = Depends(get_db)):
    event["origin"] = "ENDPOINT"
    score    = score_threat(event)
    severity = score_to_severity(score / 10)
    summary  = await summarize_threat(json.dumps(event))
    mitre    = map_to_mitre(event.get("message","") + " " + event.get("type",""))

    threat = Threat(
        id             = str(uuid.uuid4()),
        title          = event.get("message", "Endpoint event")[:200],
        origin         = "ENDPOINT",
        source         = "AGENT",
        severity       = severity,
        cvss_score     = event.get("cvss_score", 8.0),
        priority_score = score,
        ai_summary     = summary,
        mitre_tags     = json.dumps(mitre),
        raw_data       = json.dumps(event),
        machine        = event.get("machine","Unknown"),
        created_at     = datetime.utcnow()
    )
    db.add(threat)
    await db.commit()

    # Push real-time update to dashboard
    if sio_server:
        await sio_server.emit("new_incident", {
            "id": threat.id, "title": threat.title,
            "severity": threat.severity, "machine": threat.machine,
            "score": score
        })

    return {"status": "processed", "id": threat.id, "score": score}

@router.get("/")
async def get_incidents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Threat).where(Threat.origin=="ENDPOINT")
        .order_by(Threat.created_at.desc())
    )
    threats = result.scalars().all()
    return [t.__dict__ for t in threats]