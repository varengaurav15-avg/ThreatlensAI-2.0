from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import text
from _paths import DB_PATH
import logging

logger = logging.getLogger("database")

DATABASE_URL = f"sqlite+aiosqlite:///{DB_PATH}"

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database ready at %s", DB_PATH)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


async def upsert_threats(threats: list) -> int:
    """
    Bulk INSERT OR REPLACE threats into the DB.
    Returns number of rows actually saved.
    Each dict must have all threat columns as keys.
    """
    if not threats:
        return 0

    saved = 0
    async with AsyncSessionLocal() as db:
        try:
            for t in threats:
                await db.execute(text("""
                    INSERT OR REPLACE INTO threats
                        (id, cve, title, origin, source, severity,
                         cvss_score, epss_score, priority_score,
                         asset_match, mitre_tags, ai_summary, raw_data,
                         machine, resolved, auto_responded, response_log, created_at)
                    VALUES
                        (:id, :cve, :title, :origin, :source, :severity,
                         :cvss_score, :epss_score, :priority_score,
                         :asset_match, :mitre_tags, :ai_summary, :raw_data,
                         :machine, :resolved, :auto_responded, :response_log, :created_at)
                """), t)
                saved += 1
            await db.commit()
            logger.info("upsert_threats: saved %d rows", saved)
        except Exception as e:
            logger.error("upsert_threats failed: %s", e)
            await db.rollback()

    return saved
