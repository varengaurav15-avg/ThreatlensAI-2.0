from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.threat import Threat
from services.llm import generate_morning_brief
from datetime import datetime, timedelta
import os

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
    data = [
        {"title": t.title, "severity": t.severity,
         "score": t.priority_score, "summary": t.ai_summary}
        for t in threats
    ]

    # Only call LLM if an API key is configured — otherwise return a summary
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key:
        counts = {}
        for t in threats:
            counts[t.severity] = counts.get(t.severity, 0) + 1
        parts = [f"{v} {k}" for k, v in counts.items()]
        summary = (
            f"Last 24 hours: {len(threats)} threats detected "
            + (f"({', '.join(parts)})." if parts else "(no data yet).")
            + " Add your OpenAI API key in Settings → AI Configuration to enable full AI briefings."
        )
        brief = summary
    else:
        brief = await generate_morning_brief(data)

    return {"brief": brief, "generated_at": datetime.utcnow(), "count": len(threats)}
