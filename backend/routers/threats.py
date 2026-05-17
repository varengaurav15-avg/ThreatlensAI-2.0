from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models.threat import Threat
from services.llm import simulate_sandbox_analysis
import json, hashlib
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/threats", tags=["threats"])

# Country centroid coordinates for geo-mapping AbuseIPDB threats
_CC = {
    "CN": (35.86, 104.19), "RU": (61.52, 105.31), "US": (37.09, -95.71),
    "DE": (51.16, 10.45),  "NL": (52.37, 4.90),   "FR": (46.23, 2.21),
    "GB": (55.37, -3.43),  "JP": (36.20, 138.25),  "KR": (35.90, 127.76),
    "BR": (-14.23, -51.92),"IN": (20.59, 78.96),   "UA": (48.37, 31.16),
    "IR": (32.42, 53.68),  "KP": (40.33, 127.51),  "SG": (1.35, 103.82),
    "HK": (22.31, 114.17), "TW": (23.69, 120.96),  "AU": (-25.27, 133.77),
    "CA": (56.13, -106.34),"MX": (23.63, -102.55), "TR": (38.96, 35.24),
    "NG": (9.08, 8.67),    "ZA": (-30.55, 22.93),  "VN": (14.05, 108.27),
    "ID": (-0.78, 113.92), "PL": (51.91, 19.14),   "RO": (45.94, 24.96),
    "TH": (15.87, 100.99), "MY": (4.21, 108.96),   "PH": (12.87, 121.77),
    "PK": (30.37, 69.34),  "BD": (23.68, 90.35),   "EG": (26.82, 30.80),
    "AR": (-38.41, -63.61),"CL": (-35.67, -71.54), "CO": (4.57, -74.29),
    "IT": (41.87, 12.56),  "ES": (40.46, -3.74),   "SE": (60.12, 18.64),
    "NO": (60.47, 8.46),   "FI": (61.92, 25.74),   "CZ": (49.81, 15.47),
    "BE": (50.50, 4.46),   "CH": (46.81, 8.22),    "IL": (31.04, 34.85),
    "SA": (23.88, 45.07),  "AE": (23.42, 53.84),
}


def _jitter(seed_str: str, rng: float = 4.0) -> tuple:
    """Deterministic scatter so multiple IPs from same country don't stack."""
    h = int(hashlib.md5(seed_str.encode()).hexdigest()[:8], 16)
    lat_off = ((h & 0xFFFF) / 0xFFFF - 0.5) * rng
    lng_off = ((h >> 16 & 0xFFFF) / 0xFFFF - 0.5) * rng
    return lat_off, lng_off


@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    since = datetime.utcnow() - timedelta(hours=24)
    total_r    = await db.execute(
        select(func.count()).select_from(Threat).where(Threat.created_at >= since)
    )
    critical_r = await db.execute(
        select(func.count()).select_from(Threat)
        .where(Threat.severity == "CRITICAL", Threat.resolved == False)
    )
    resolved_r = await db.execute(
        select(func.count()).select_from(Threat).where(Threat.resolved == True)
    )
    return {
        "total":    total_r.scalar()    or 0,
        "critical": critical_r.scalar() or 0,
        "resolved": resolved_r.scalar() or 0,
    }


@router.get("/map")
async def get_map_nodes(db: AsyncSession = Depends(get_db)):
    """Return geo-tagged hostile nodes from AbuseIPDB and OTX threats."""
    result = await db.execute(
        select(Threat)
        .where(Threat.source.in_(["AbuseIPDB", "OTX"]), Threat.resolved == False)
        .order_by(Threat.priority_score.desc())
        .limit(40)
    )
    threats = result.scalars().all()

    nodes = []
    for t in threats:
        lat, lng = 0.0, 0.0
        try:
            # AbuseIPDB title format: "Malicious IP X.X.X.X (CC) confidence N%"
            if "(" in t.title and ")" in t.title:
                cc = t.title.split("(")[1].split(")")[0].strip()
                base = _CC.get(cc)
                if base:
                    jlat, jlng = _jitter(t.id)
                    lat = round(base[0] + jlat, 4)
                    lng = round(base[1] + jlng, 4)
        except Exception:
            pass

        if lat == 0.0 and lng == 0.0:
            continue

        nodes.append({
            "id":         t.id,
            "title":      t.title[:80],
            "lat":        lat,
            "lng":        lng,
            "severity":   t.severity,
            "source":     t.source,
            "epss_score": t.epss_score,
            "type":       "hostile",
        })

    return nodes


@router.get("/")
async def get_threats(
    severity: str = None,
    origin:   str = None,
    resolved: bool = None,
    limit:    int = 50,
    db: AsyncSession = Depends(get_db),
):
    query = select(Threat).order_by(Threat.priority_score.desc()).limit(limit)
    if severity:
        query = query.where(Threat.severity == severity)
    if origin:
        query = query.where(Threat.origin == origin)
    if resolved is not None:
        query = query.where(Threat.resolved == resolved)
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


@router.post("/{threat_id}/sandbox")
async def analyze_in_sandbox(threat_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Threat).where(Threat.id == threat_id))
    threat = result.scalar_one_or_none()
    if not threat:
        return {"error": "Threat not found"}

    threat_data = {
        "id":         threat.id,
        "title":      threat.title,
        "severity":   threat.severity,
        "machine":    threat.machine,
        "source":     threat.source,
        "cvss_score": threat.cvss_score,
        "epss_score": threat.epss_score,
        "ai_summary": threat.ai_summary,
        "mitre_tags": threat.mitre_tags,
    }

    analysis = await simulate_sandbox_analysis(threat_data)
    analysis["id"]    = threat.id
    analysis["title"] = threat.title

    # Generate remediation playbook
    from services.llm import generate_playbook
    analysis["playbook"] = await generate_playbook(threat_data, analysis)

    return analysis
