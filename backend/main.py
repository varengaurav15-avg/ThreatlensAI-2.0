import sys, os

# ── STDOUT/STDERR GUARD ──────────────────────────────────────
# Electron spawns this with windowsHide=True so stdout/stderr can be None
if sys.stdout is None:
    sys.stdout = open(os.devnull, "w")
if sys.stderr is None:
    sys.stderr = open(os.devnull, "w")

# ── FILE LOGGING ─────────────────────────────────────────────
# Write all logs to a file so we can diagnose issues in production
from _paths import ENV_PATH, LOG_PATH
import logging

logging.basicConfig(
    filename=LOG_PATH,
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("main")
logger.info("Backend starting…")

# ── LOAD ENV ─────────────────────────────────────────────────
from dotenv import load_dotenv
load_dotenv(dotenv_path=ENV_PATH, override=False)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from database import init_db
from routers import threats, incidents, brief, config, sources
from scheduler import start_scheduler
import routers.incidents as inc_router
import uvicorn

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
inc_router.sio_server = sio

app = FastAPI(title="ThreatLens AI", version="1.0.0")
app.add_middleware(CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(threats.router)
app.include_router(incidents.router)
app.include_router(brief.router)
app.include_router(config.router)
app.include_router(sources.router)

@app.on_event("startup")
async def startup():
    await init_db()
    start_scheduler()
    logger.info("ThreatLens backend ready")
    print("ThreatLens backend ready", flush=True)

@app.get("/health")
async def health():
    return {"status": "ok"}

socket_app = socketio.ASGIApp(sio, app)

if __name__ == "__main__":
    uvicorn.run(
        "main:socket_app",
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_config=None,
        access_log=False,
    )
