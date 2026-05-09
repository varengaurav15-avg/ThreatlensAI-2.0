import shutil, os
from pathlib import Path

QUARANTINE = Path.home() / ".threatlens" / "quarantine"
QUARANTINE.mkdir(parents=True, exist_ok=True)

def quarantine_file(filepath: str) -> dict:
    try:
        src  = Path(filepath)
        dest = QUARANTINE / src.name
        shutil.move(str(src), str(dest))
        os.chmod(str(dest), 0o000)
        return {"success": True, "action": f"Quarantined {src.name}"}
    except Exception as e:
        return {"success": False, "action": str(e)}