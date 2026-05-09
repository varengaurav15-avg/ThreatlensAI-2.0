from fastapi import APIRouter
import json, os

router = APIRouter(prefix="/api/config", tags=["config"])
CONFIG_PATH = "./agent_config.json"

@router.post("/permissions")
async def save_permissions(config: dict):
    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)
    return {"status": "saved"}

@router.get("/permissions")
async def get_permissions():
    try:
        with open(CONFIG_PATH) as f:
            return json.load(f)
    except:
        return {"process":True,"network":True,"filesystem":True,"logs":True,
                "responseMode":"conservative","aiEnabled":True}