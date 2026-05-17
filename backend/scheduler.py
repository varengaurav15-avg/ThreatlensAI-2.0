from apscheduler.schedulers.asyncio import AsyncIOScheduler
from services.ingestion.nvd      import fetch_recent_cves
from services.ingestion.epss     import get_epss_scores
from services.ingestion.otx      import fetch_pulses
from services.ingestion.abuseipdb import get_ip_threats
from services.ingestion.rss      import fetch_rss_threats
from services.scoring            import score_threat, score_to_severity
from services.llm                import summarize_threat
from services.mitre              import map_to_mitre
from database                    import upsert_threats
import json, logging
from datetime import datetime, timedelta

logger    = logging.getLogger("scheduler")
scheduler = AsyncIOScheduler()


async def _enrich_and_store(raw_threats: list, source_name: str):
    """Score, tag, and upsert a list of raw threat dicts."""
    if not raw_threats:
        logger.info("%s: 0 threats fetched — skipping", source_name)
        return

    enriched = []
    for t in raw_threats:
        try:
            # Defaults for optional fields
            t.setdefault("cve",        None)
            t.setdefault("origin",     "GLOBAL")
            t.setdefault("cvss_score", 5.0)
            t.setdefault("epss_score", 0.1)
            t.setdefault("raw_data",   "")

            # Scoring & tagging
            t["priority_score"] = score_threat(t)
            t["severity"]       = score_to_severity(float(t["cvss_score"]))
            t["mitre_tags"]     = json.dumps(map_to_mitre(t.get("title", "")))
            t["ai_summary"]     = await summarize_threat(t.get("raw_data", ""))

            # Required columns with safe defaults
            t["asset_match"]    = False
            t["machine"]        = None
            t["resolved"]       = False
            t["auto_responded"] = False
            t["response_log"]   = "[]"
            t["created_at"]     = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

            # Only keep known columns — discard anything extra
            enriched.append({
                "id":            t["id"],
                "cve":           t["cve"],
                "title":         t["title"],
                "origin":        t["origin"],
                "source":        t["source"],
                "severity":      t["severity"],
                "cvss_score":    float(t["cvss_score"]),
                "epss_score":    float(t["epss_score"]),
                "priority_score": float(t["priority_score"]),
                "asset_match":   t["asset_match"],
                "mitre_tags":    t["mitre_tags"],
                "ai_summary":    t["ai_summary"],
                "raw_data":      t["raw_data"],
                "machine":       t["machine"],
                "resolved":      t["resolved"],
                "auto_responded": t["auto_responded"],
                "response_log":  t["response_log"],
                "created_at":    t["created_at"],
            })
        except Exception as e:
            logger.warning("%s: skipping %s — %s", source_name, t.get("id", "?"), e)

    saved = await upsert_threats(enriched)
    logger.info("%s: saved %d / %d threats to DB", source_name, saved, len(raw_threats))


async def ingest_nvd():
    logger.info("Polling NVD...")
    try:
        cves = await fetch_recent_cves(hours_back=24)
        if cves:
            cve_ids  = [c["cve"] for c in cves if c.get("cve")]
            epss_map = await get_epss_scores(cve_ids)
            for cve in cves:
                cve["epss_score"] = epss_map.get(cve.get("cve", ""), 0.1)
        await _enrich_and_store(cves, "NVD")
    except Exception as e:
        logger.error("NVD poll failed: %s", e)


async def ingest_otx():
    logger.info("Polling OTX...")
    try:
        pulses = await fetch_pulses()
        await _enrich_and_store(pulses, "OTX")
    except Exception as e:
        logger.error("OTX poll failed: %s", e)


async def ingest_abuseipdb():
    logger.info("Polling AbuseIPDB...")
    try:
        ip_threats = await get_ip_threats(limit=50)
        await _enrich_and_store(ip_threats, "AbuseIPDB")
    except Exception as e:
        logger.error("AbuseIPDB poll failed: %s", e)


async def ingest_rss():
    logger.info("Polling RSS feeds...")
    try:
        rss_threats = await fetch_rss_threats()
        await _enrich_and_store(rss_threats, "RSS")
    except Exception as e:
        logger.error("RSS poll failed: %s", e)


async def full_ingestion_cycle():
    logger.info("=== Full ingestion cycle starting ===")
    await ingest_nvd()
    await ingest_otx()
    await ingest_abuseipdb()
    await ingest_rss()
    logger.info("=== Full ingestion cycle complete ===")


def start_scheduler():
    scheduler.add_job(
        full_ingestion_cycle,
        "interval",
        minutes=15,
        id="full_poll",
        next_run_time=datetime.utcnow() + timedelta(seconds=5),
    )
    scheduler.start()
    logger.info("Scheduler started — first poll in 5 s")
