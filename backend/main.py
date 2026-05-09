from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from database import init_db
from routers import threats, incidents, brief, config
from scheduler import start_scheduler
import routers.incidents as inc_router
import uvicorn

# Socket.io server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# Inject sio into incidents router so it can push real-time updates
inc_router.sio_server = sio

app = FastAPI(title="ThreatLens AI", version="1.0.0")
app.add_middleware(CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Register all routes
app.include_router(threats.router)
app.include_router(incidents.router)
app.include_router(brief.router)
app.include_router(config.router)

@app.on_event("startup")
async def startup():
    await init_db()
    start_scheduler()
    print("ThreatLens backend ready")

@app.get("/health")
async def health():
    return {"status": "ok"}

# Wrap with socket.io
socket_app = socketio.ASGIApp(sio, app)

if __name__ == "__main__":
    uvicorn.run("main:socket_app", host="127.0.0.1", port=8000, reload=False)