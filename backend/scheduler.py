from apscheduler.schedulers.asyncio import AsyncIOScheduler
from services.ingestion.nvd import fetch_recent_cves
from services.ingestion.epss import get_epss_scores
from services.scoring import score_threat, score_to_severity
from services.llm import summarize_threat
from services.mitre import map_to_mitre
from database import AsyncSessionLocal
from models.threat import Threat
import json
from datetime import datetime

scheduler = AsyncIOScheduler()

async def fetch_and_store_cves():
    print("Polling NVD...")
    try:
        cves = await fetch_recent_cves(hours_back=24)
        cve_ids = [c["cve"] for c in cves if c.get("cve")]
        epss_map = await get_epss_scores(cve_ids)

        async with AsyncSessionLocal() as db:
            for cve in cves:
                cve["epss_score"]     = epss_map.get(cve.get("cve", ""), 0.1)
                cve["priority_score"] = score_threat(cve)
                cve["severity"]       = score_to_severity(cve["cvss_score"])
                cve["mitre_tags"]     = json.dumps(map_to_mitre(cve["title"]))
                cve["ai_summary"]     = await summarize_threat(cve["raw_data"])
                cve["created_at"]     = datetime.utcnow()

                threat = Threat(
                    id=cve["id"],
                    **{k: v for k, v in cve.items() if k != "id"}
                )
                db.merge(threat)
            await db.commit()
        print("Stored " + str(len(cves)) + " CVEs")
    except Exception as e:
        print("NVD poll failed: " + str(e))

def start_scheduler():
    scheduler.add_job(fetch_and_store_cves, 'interval', minutes=15, id='nvd_poll')
    scheduler.start()
    print("Scheduler started")