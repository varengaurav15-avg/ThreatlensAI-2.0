from fastapi import APIRouter
from _paths import CFG_PATH, ENV_PATH
import json, os

router = APIRouter(prefix="/api/config", tags=["config"])

@router.post("/permissions")
async def save_permissions(config: dict):
    api_key = config.get("apiKey", "").strip()
    if api_key:
        _write_env("OPENAI_API_KEY", api_key)
        os.environ["OPENAI_API_KEY"] = api_key
    with open(CFG_PATH, "w") as f:
        json.dump(config, f, indent=2)
    return {"status": "saved"}

@router.get("/permissions")
async def get_permissions():
    try:
        with open(CFG_PATH) as f:
            cfg = json.load(f)
        if not cfg.get("apiKey"):
            cfg["apiKey"] = os.getenv("OPENAI_API_KEY", "")
        return cfg
    except Exception:
        return {
            "process": True, "network": True, "filesystem": True, "logs": True,
            "responseMode": "conservative", "aiEnabled": True,
            "apiKey": os.getenv("OPENAI_API_KEY", ""), "startOnBoot": False,
            "notifications": {"desktop": True, "tray": True, "sound": False},
            "folders": ["Documents", "Desktop", "Downloads"], "exclusions": [],
        }

def _write_env(key: str, value: str):
    lines, found = [], False
    if os.path.exists(ENV_PATH):
        with open(ENV_PATH) as f:
            lines = f.readlines()
    new_lines = []
    for line in lines:
        if line.startswith(f"{key}="):
            new_lines.append(f"{key}={value}\n"); found = True
        else:
            new_lines.append(line)
    if not found:
        new_lines.append(f"{key}={value}\n")
    with open(ENV_PATH, "w") as f:
        f.writelines(new_lines)
