"""
Central path resolution for ThreatLens AI backend.

When running as a PyInstaller one-dir bundle:
  sys.frozen = True
  sys.executable = .../resources/backend/main.exe
  BASE_DIR = .../resources/backend/   ← persistent, next to main.exe

When running in dev:
  BASE_DIR = .../backend/             ← source directory
"""
import sys, os

def get_base_dir() -> str:
    if getattr(sys, 'frozen', False):
        # PyInstaller one-dir: exe is in dist/main/ or resources/backend/
        return os.path.dirname(sys.executable)
    # Dev mode: this file is in backend/
    return os.path.dirname(os.path.abspath(__file__))

BASE_DIR  = get_base_dir()
ENV_PATH  = os.path.join(BASE_DIR, '.env')
DB_PATH   = os.path.join(BASE_DIR, 'threatlens.db')
CFG_PATH  = os.path.join(BASE_DIR, 'agent_config.json')
LOG_PATH  = os.path.join(BASE_DIR, 'backend.log')
