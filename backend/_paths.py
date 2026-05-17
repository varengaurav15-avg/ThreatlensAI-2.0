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
    """Directory for writable assets (DB/logs/config). For frozen builds, we use the user's home directory to bypass Program Files permission blocks."""
    if getattr(sys, 'frozen', False):
        user_dir = os.path.join(os.path.expanduser("~"), ".threatlens")
        os.makedirs(user_dir, exist_ok=True)
        return user_dir
    return os.path.dirname(os.path.abspath(__file__))

def get_bundle_dir() -> str:
    """PyInstaller _MEIPASS — where data files (including .env) are bundled."""
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))

import shutil

BASE_DIR   = get_base_dir()
BUNDLE_DIR = get_bundle_dir()

# Writable configuration directory setup in frozen builds
if getattr(sys, 'frozen', False):
    os.makedirs(BASE_DIR, exist_ok=True)
    env_target = os.path.join(BASE_DIR, '.env')
    # Copy the template .env to the user's home directory if not present
    if not os.path.exists(env_target):
        env_source = os.path.join(BUNDLE_DIR, '.env')
        if os.path.exists(env_source):
            try:
                shutil.copy(env_source, env_target)
            except Exception:
                pass
    ENV_PATH = env_target
else:
    ENV_PATH = os.path.join(BUNDLE_DIR, '.env')

DB_PATH   = os.path.join(BASE_DIR, 'threatlens.db')
CFG_PATH  = os.path.join(BASE_DIR, 'agent_config.json')
LOG_PATH  = os.path.join(BASE_DIR, 'backend.log')
