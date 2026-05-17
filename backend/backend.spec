# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec for ThreatLens AI backend

import os, sys
from PyInstaller.utils.hooks import collect_all, collect_submodules

block_cipher = None

datas    = []
binaries = []
hiddenimports = []

# ── Third-party packages with dynamic imports ─────────────────
for pkg in ['fastapi', 'uvicorn', 'starlette', 'sqlalchemy', 'aiosqlite',
            'python_socketio', 'python_engineio', 'apscheduler',
            'httpx', 'pydantic', 'anyio', 'sniffio',
            'dotenv', 'python_dotenv']:
    try:
        d, b, h = collect_all(pkg)
        datas    += d
        binaries += b
        hiddenimports += h
    except Exception:
        pass

# ── Local app packages — must be listed so PyInstaller finds them ──
# Add the backend directory itself to the path so relative imports work.
LOCAL_PKGS = [
    '_paths',
    'database',
    'models', 'models.threat', 'models.endpoint', 'models.user',
    'routers', 'routers.threats', 'routers.incidents',
    'routers.brief', 'routers.config', 'routers.sources',
    'routers.auth', 'routers.otx_proxy',
    'scheduler',
    'services', 'services.llm', 'services.mitre', 'services.scoring',
    'services.virustotal',
    'services.ingestion', 'services.ingestion.nvd', 'services.ingestion.epss',
    'services.ingestion.otx', 'services.ingestion.abuseipdb',
    'services.ingestion.rss',
    'services.agents', 'services.agents.analyst', 'services.agents.context',
    'services.agents.correlator', 'services.agents.hunter', 'services.agents.pipeline',
    'services.agents.endpoint_stats', 'services.agents.file_watcher',
    'services.sandbox',
    'routers.endpoints', 'routers.sandbox',
]
hiddenimports += LOCAL_PKGS

# ── Extra stdlib / third-party hidden imports ─────────────────
hiddenimports += [
    'aiosqlite',
    'asyncio',
    'uvicorn.logging',
    'uvicorn.loops', 'uvicorn.loops.auto',
    'uvicorn.protocols', 'uvicorn.protocols.http', 'uvicorn.protocols.http.auto',
    'uvicorn.protocols.websockets', 'uvicorn.protocols.websockets.auto',
    'uvicorn.lifespan', 'uvicorn.lifespan.on',
    'fastapi.middleware.cors',
    'sqlalchemy.dialects.sqlite',
    'sqlalchemy.ext.asyncio',
    'apscheduler.schedulers.asyncio',
    'apscheduler.executors.asyncio',
    'psutil', 'requests',
    'json', 'logging', 'pathlib',
    'email.mime.multipart', 'email.mime.text',
]

# ── Data files ────────────────────────────────────────────────
datas += [
    ('prompts',          'prompts'),
    ('agent_config.json', '.'),
    ('.env',             '.'),
]

a = Analysis(
    ['main.py'],
    # Include backend dir so all local packages are importable
    pathex=[os.path.abspath('.')],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['tkinter', 'matplotlib', 'scipy', 'PIL', 'cv2'],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='main',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,   # Keep console=True so errors are visible during debugging
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='main',
)
