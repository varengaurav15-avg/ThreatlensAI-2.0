from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.threat import Threat
from services.llm import generate_morning_brief
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/brief", tags=["brief"])

@router.get("/today")
async def get_brief(db: AsyncSession = Depends(get_db)):
    since  = datetime.utcnow() - timedelta(hours=24)
    result = await db.execute(
        select(Threat)
        .where(Threat.created_at >= since)
        .order_by(Threat.priority_score.desc())
        .limit(20)
    )
    threats = result.scalars().all()
    data    = [{"title":t.title,"severity":t.severity,
                "score":t.priority_score,"summary":t.ai_summary} for t in threats]
    brief   = await generate_morning_brief(data)
    return {"brief": brief, "generated_at": datetime.utcnow(), "count": len(threats)}