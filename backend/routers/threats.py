from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models.threat import Threat

router = APIRouter(prefix="/api/threats", tags=["threats"])

@router.get("/")
async def get_threats(
    severity: str = None,
    origin:   str = None,
    resolved: bool = None,
    limit:    int = 50,
    db: AsyncSession = Depends(get_db)
):
    query = select(Threat).order_by(Threat.priority_score.desc()).limit(limit)
    if severity: query = query.where(Threat.severity == severity)
    if origin:   query = query.where(Threat.origin   == origin)
    if resolved is not None: query = query.where(Threat.resolved == resolved)
    result = await db.execute(query)
    threats = result.scalars().all()
    return [t.__dict__ for t in threats]

@router.patch("/{threat_id}/resolve")
async def resolve_threat(threat_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Threat).where(Threat.id == threat_id))
    threat = result.scalar_one_or_none()
    if threat:
        threat.resolved = True
        await db.commit()
    return {"status": "resolved"}

@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Threat))
    all_t  = result.scalars().all()
    return {
        "total":    len(all_t),
        "critical": len([t for t in all_t if t.severity=="CRITICAL" and not t.resolved]),
        "endpoint": len([t for t in all_t if t.origin=="ENDPOINT" and not t.resolved]),
        "resolved": len([t for t in all_t if t.resolved]),
        "global":   len([t for t in all_t if t.origin=="GLOBAL"]),
    }