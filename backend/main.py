import sys, os

# ── STDOUT/STDERR GUARD ──────────────────────────────────────
# Electron spawns this with windowsHide=True so stdout/stderr can be None.
# Force UTF-8 so Unicode never causes charmap crashes on Windows.
if sys.stdout is None:
    sys.stdout = open(os.devnull, "w", encoding="utf-8")
else:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
if sys.stderr is None:
    sys.stderr = open(os.devnull, "w", encoding="utf-8")
else:
    try:
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# ── FILE LOGGING ─────────────────────────────────────────────
from _paths import ENV_PATH, LOG_PATH
import logging

logging.basicConfig(
    filename=LOG_PATH,
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("main")
logger.info("Backend starting up")

# ── LOAD ENV ─────────────────────────────────────────────────
from dotenv import load_dotenv
load_dotenv(dotenv_path=ENV_PATH, override=False)
logger.info("ENV loaded from %s (exists=%s)", ENV_PATH, os.path.exists(ENV_PATH))

# ── IMPORTS ──────────────────────────────────────────────────
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from database import init_db
from routers import threats, incidents, brief, config, sources, endpoints as ep_router, sandbox as sandbox_router
from routers import auth as auth_router
from routers import otx_proxy as otx_router
import models.user  # ensure User table is created
from scheduler import start_scheduler
from services.agents.file_watcher import start_file_watcher
import routers.incidents as inc_router
import uvicorn

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
inc_router.sio_server = sio

# Sandbox + default watched folders
SANDBOX = os.path.join(os.path.expanduser("~"), "Desktop", "ThreatLens-Sandbox")
WATCH_FOLDERS = [
    SANDBOX,
    os.path.join(os.path.expanduser("~"), "Downloads"),
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    start_scheduler()
    start_file_watcher(WATCH_FOLDERS)
    logger.info("Watching folders: %s", WATCH_FOLDERS)
    logger.info("ThreatLens backend ready")
    print("ThreatLens backend ready", flush=True)
    yield
    logger.info("Backend shutting down")


app = FastAPI(title="ThreatLens AI", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(threats.router)
app.include_router(incidents.router)
app.include_router(brief.router)
app.include_router(config.router)
app.include_router(sources.router)
app.include_router(ep_router.router)
app.include_router(sandbox_router.router)
app.include_router(auth_router.router)
app.include_router(otx_router.router)


@app.get("/health")
async def health():
    return {"status": "ok"}


socket_app = socketio.ASGIApp(sio, app)

if __name__ == "__main__":
    uvicorn.run(
        socket_app,
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_config=None,
        access_log=False,
    )
