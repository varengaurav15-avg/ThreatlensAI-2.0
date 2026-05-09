from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.threat import Threat
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/sources", tags=["sources"])

@router.get("/")
async def get_sources(db: AsyncSession = Depends(get_db)):
    now  = datetime.utcnow()
    day  = now - timedelta(hours=24)
    result = await db.execute(select(Threat).where(Threat.created_at >= day))
    recent = result.scalars().all()

    def _count(src): return len([t for t in recent if t.source == src])
    def _match(src): return len([t for t in recent if t.source == src and t.asset_match])
    def _last(src):
        hits = [t for t in recent if t.source == src]
        if not hits: return "--"
        latest = max(hits, key=lambda t: t.created_at)
        delta  = (now - latest.created_at).total_seconds()
        if delta < 60:   return "Just now"
        if delta < 3600: return f"{int(delta//60)} min ago"
        return f"{int(delta//3600)} h ago"

    return [
        {"name":"NVD CVE API",      "url":"services.nvd.nist.gov",    "icon":"🛡","color":"#38bdf8","interval":"15 min",    "status":"ACTIVE","count":_count("NVD"),    "matched":_match("NVD"),    "lastSync":_last("NVD")},
        {"name":"AlienVault OTX",   "url":"otx.alienvault.com",        "icon":"👁","color":"#a78bfa","interval":"30 min",    "status":"ACTIVE","count":_count("OTX"),    "matched":_match("OTX"),    "lastSync":_last("OTX")},
        {"name":"AbuseIPDB",        "url":"abuseipdb.com",             "icon":"🌐","color":"#fb923c","interval":"20 min",    "status":"ACTIVE","count":_count("AbuseIPDB"),"matched":_match("AbuseIPDB"),"lastSync":_last("AbuseIPDB")},
        {"name":"RSS Threat Feeds", "url":"Krebs · BleepingComputer",  "icon":"📰","color":"#34d399","interval":"60 min",    "status":"ACTIVE","count":_count("RSS"),    "matched":_match("RSS"),    "lastSync":_last("RSS")},
        {"name":"Endpoint Agents",  "url":"Monitoring local machine",  "icon":"💻","color":"#f472b6","interval":"Real-time", "status":"ACTIVE","count":_count("AGENT"),  "matched":_match("AGENT"),  "lastSync":_last("AGENT")},
        {"name":"EPSS API",         "url":"first.org/epss",            "icon":"📊","color":"#fbbf24","interval":"Daily",     "status":"ACTIVE","count":_count("EPSS"),   "matched":_match("EPSS"),   "lastSync":_last("EPSS")},
    ]
