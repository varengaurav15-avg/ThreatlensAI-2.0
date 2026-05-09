import asyncio
from database import init_db, AsyncSessionLocal
from models.threat import Threat
from services.ingestion.nvd import fetch_recent_cves
from services.ingestion.epss import get_epss_scores
from services.scoring import score_threat, score_to_severity
from services.llm import summarize_threat
from services.mitre import map_to_mitre
import json
from datetime import datetime

async def seed():
    await init_db()
    print("Fetching real CVEs for seed...")

    cves = await fetch_recent_cves(hours_back=72)
    print(f"Got {len(cves)} CVEs. Scoring and summarizing...")

    cve_ids  = [c["cve"] for c in cves if c.get("cve")]
    epss_map = await get_epss_scores(cve_ids)

    async with AsyncSessionLocal() as db:
        for i, cve in enumerate(cves[:30]):
            cve["epss_score"]     = epss_map.get(cve.get("cve",""), 0.1)
            cve["priority_score"] = score_threat(cve)
            cve["severity"]       = score_to_severity(cve["cvss_score"])
            cve["mitre_tags"]     = json.dumps(map_to_mitre(cve["title"]))
            cve["ai_summary"]     = await summarize_threat(cve["raw_data"])
            cve["created_at"]     = datetime.utcnow()

            threat = Threat(id=cve["id"], **{k:v for k,v in cve.items() if k!="id"})
            db.merge(threat)
            print(f"[{i+1}/30] {cve['cve']} — {cve['severity']}")

        await db.commit()
    print("Seed complete. Dashboard ready.")

asyncio.run(seed())