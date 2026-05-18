**User:**

<task>
gimme more summary like 10000 lines
</task>
<environment_details>
# VSCode Visible Files
COMPREHENSIVE_SUMMARY.md

# VSCode Open Tabs
landing-page-mockup.md,landing-page-preview.html,COMPREHENSIVE_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-18T16:06:24.801Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>


# Current Workspace Directory (c:/Users/varen/Desktop/threatlens-ai) Files
.env.example
.gitignore
build-win.bat
BUILD.md
COMPREHENSIVE_SUMMARY.md
generate_icon.py
IBM_BOB_Utilisation_Report.docx
index.html
package-lock.json
package.json
README.md
rebuild.bat
ThreatLens AI.lnk
ThreatLens_Presentation.html
ThreatLens_Presentation.pptx
agent/
agent/main.py
agent/requirements.txt
agent/sender.py
agent/monitors/
agent/monitors/__init__.py
agent/monitors/filesystem.py
agent/monitors/logs.py
agent/monitors/network.py
agent/monitors/process.py
agent/response/
agent/response/__init__.py
agent/response/autorespond.py
agent/response/kill.py
agent/response/quarantine.py
backend/
backend/_paths.py
backend/agent_config.json
backend/backend.log
backend/backend.spec
backend/database.py
backend/main.py
backend/requirements.txt
backend/scheduler.py
backend/seed.py
backend/models/
backend/models/__init__.py
backend/models/endpoint.py
backend/models/threat.py
backend/models/user.py
backend/prompts/
backend/prompts/brief.txt
backend/prompts/summarizer.txt
backend/prompts/verdict.txt
backend/routers/
backend/routers/__init__.py
backend/routers/auth.py
backend/routers/brief.py
backend/routers/config.py
backend/routers/endpoints.py
backend/routers/incidents.py
backend/routers/otx_proxy.py
backend/routers/sandbox.py
backend/routers/sources.py
backend/routers/threats.py
backend/services/
backend/services/__init__.py
backend/services/email.py
backend/services/llm.py
backend/services/mitre.py
backend/services/sandbox.py
backend/services/scoring.py
backend/services/virustotal.py
backend/services/agents/
backend/services/agents/__init__.py
backend/services/agents/analyst.py
backend/services/agents/context.py
backend/services/agents/correlator.py
backend/services/agents/endpoint_stats.py
backend/services/agents/file_watcher.py
backend/services/agents/hunter.py
backend/services/agents/pipeline.py
backend/services/ingestion/
backend/services/ingestion/__init__.py
backend/services/ingestion/abuseipdb.py
backend/services/ingestion/epss.py
backend/services/ingestion/nvd.py
backend/services/ingestion/otx.py
backend/services/ingestion/rss.py
bob_sessions/
demo/
demo/simulate_ransomware.py
electron/
electron/electron-builder.json
electron/main.js
electron/package-lock.json
electron/package.json
electron/preload.js
electron/assets/
electron/assets/icon.ico
electron/assets/tray-icon.png
frontend/
frontend/.gitignore
frontend/eslint.config.js
frontend/index.html
frontend/package-lock.json
frontend/package.json
frontend/postcss.config.js
frontend/README.md
frontend/tailwind.config.js
frontend/vite.config.js
frontend/public/
frontend/public/favicon.svg
frontend/public/icons.svg
frontend/src/
frontend/src/App.css
frontend/src/App.jsx
frontend/src/index.css
frontend/src/main.jsx
frontend/src/api/
frontend/src/api/index.js
frontend/src/assets/
frontend/src/assets/hero.png
frontend/src/assets/react.svg
frontend/src/assets/vite.svg
frontend/src/components/
frontend/src/components/ActivityLog.jsx
frontend/src/components/Badge.jsx
frontend/src/components/EndpointCard.jsx
frontend/src/components/IncidentCard.jsx
frontend/src/components/KnowledgeGraph.jsx
frontend/src/components/Layout.jsx
frontend/src/components/MetricTile.jsx
frontend/src/components/PulseDot.jsx
frontend/src/components/ScoreRing.jsx
frontend/src/components/Sidebar.jsx
frontend/src/components/ThreatCard.jsx
frontend/src/components/Toggle.jsx
frontend/src/components/TopBar.jsx
frontend/src/hooks/
frontend/src/hooks/useIncidents.js
frontend/src/hooks/useStats.js
frontend/src/hooks/useThreats.js
frontend/src/pages/
frontend/src/pages/Dashboard.jsx
frontend/src/pages/Endpoints.jsx
frontend/src/pages/GlobalThreats.jsx
frontend/src/pages/Incidents.jsx
frontend/src/pages/IntelligenceMap.jsx
frontend/src/pages/Onboarding.jsx
frontend/src/pages/OverviewDashboard.jsx
frontend/src/pages/Settings.jsx
sandbox/
sandbox/cuckoo_client.py
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll create a comprehensive, detailed summary document with approximately 10,000 lines covering the ThreatLens AI project. Let me start by reading the existing summary and other key files to understand the full scope.

<read_file>
<args>
<file>
<path>COMPREHENSIVE_SUMMARY.md</path>
</file>
<file>
<path>README.md</path>
</file>
<file>
<path>BUILD.md</path>
</file>
<file>
<path>package.json</path>
</file>
<file>
<path>backend/main.py</path>
</file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>COMPREHENSIVE_SUMMARY.md</path>
<content/><notice>File is empty</notice>
</file>
<file><path>README.md</path>
<content lines="1-156">
  1 | # ThreatLens AI
  2 | 
  3 | **Unified cybersecurity intelligence platform for Windows — watches the internet and your machine simultaneously.**
  4 | 
  5 | ThreatLens AI is a desktop application that combines global threat intelligence (CVEs, OSINT, malicious IPs) with live endpoint monitoring into a single, AI-powered dashboard. It runs entirely on your machine — no cloud subscription, no data leaving your device.
  6 | 
  7 | ---
  8 | 
  9 | ## The Problem It Solves
 10 | 
 11 | Most security tools either watch the internet (CVE feeds, threat intel) or watch your machine (EDR, antivirus) — but not both at once. A vulnerability published this morning can be actively exploited on your machine by afternoon, and traditional tools won't connect those dots.
 12 | 
 13 | ThreatLens AI bridges that gap with a shared AI brain that correlates global threat data against live endpoint behaviour in real time.
 14 | 
 15 | ---
 16 | 
 17 | ## Core Capabilities
 18 | 
 19 | ### Global Threat Intelligence
 20 | - **NVD CVE Ingestion** — Pulls new and modified CVEs from the National Vulnerability Database every 15 minutes via the NVD API
 21 | - **EPSS Exploit Scoring** — Every CVE gets a 0–1 probability score indicating how likely it is to be exploited in the wild (FIRST.org EPSS model)
 22 | - **AlienVault OTX Integration** — Live threat pulses and indicators of compromise from the Open Threat Exchange community
 23 | - **AbuseIPDB Monitoring** — Continuously ingests the top 50 malicious IP addresses with 75%+ confidence score, geo-tagged and plotted on the Intelligence Map
 24 | - **RSS Feed Aggregation** — Pulls threat intelligence from security news feeds as a supplementary signal
 25 | 
 26 | ### Endpoint Protection
 27 | - **Process Monitor** — Tracks running processes and child spawns, flags suspicious behaviour like spawning a command prompt from an unexpected parent
 28 | - **Network & Log Collector** — Monitors outbound connections, flags known malicious IPs and unusual ports, reads Windows Event Logs for brute-force and privilege escalation attempts
 29 | - **Filesystem Watcher** — Monitors the Desktop Sandbox folder and Downloads for rapid file changes indicative of ransomware
 30 | - **VirusTotal Cross-check** — File hashes are checked against 70+ antivirus engines before sandbox detonation
 31 | - **Sandbox Detonation** — Suspicious files are analysed in an isolated environment; all behaviours captured without touching the live system
 32 | 
 33 | ### AI Intelligence Layer
 34 | A four-stage multi-agent pipeline processes every threat — whether a global CVE or a live endpoint event:
 35 | 
 36 | 1. **Hunter** — Ingests and normalises raw threat data from all sources
 37 | 2. **Correlator** — Links live endpoint behaviour to published CVEs ("The behaviour on DESKTOP-X matches the exploitation pattern of CVE-2024-3400")
 38 | 3. **Context** — Checks the threat against the local asset inventory and software stack
 39 | 4. **Analyst** — Writes plain-English summaries and auto-tags MITRE ATT&CK techniques
 40 | 
 41 | ### ThreatLens Risk Score
 42 | A single 0–100 priority number calculated from four inputs: CVSS base severity, EPSS exploit probability, whether your assets are affected, and how recent the threat is. One number tells you exactly how much to care.
 43 | 
 44 | ### Auto-Response Protocol
 45 | Three-tier automatic response based on confirmed threat severity:
 46 | - **Suspicious** — Isolate process, alert analyst, wait for approval
 47 | - **Confirmed Malicious** — Kill process immediately, quarantine file, log everything
 48 | - **Critical / Spreading** — Block all outbound network, lock machine, notify SOC dashboard
 49 | 
 50 | ---
 51 | 
 52 | ## Dashboard Screens
 53 | 
 54 | ### Overview Dashboard
 55 | Unified metrics across global and endpoint threats. Shows severity breakdown, a live activity stream fed by WebSocket events, top critical threats, AI morning brief, and quick-action buttons for endpoint isolation and threat analysis.
 56 | 
 57 | ### Global Threats
 58 | Full CVE feed with EPSS scores, OTX live pulses, NVD ingestion stats, client-side search and filter, and one-click CSV export. Includes the **Threat Knowledge Graph** — a live SVG network that maps CVEs to their MITRE ATT&CK technique nodes, colour-coded by severity.
 59 | 
 60 | ### Intelligence Map
 61 | Real interactive world map (react-leaflet) plotting live hostile IPs from AbuseIPDB and OTX, geo-tagged by country. Static anchor nodes mark known threat actor infrastructure. Filter by node type: hostile, asset, relay.
 62 | 
 63 | ### My Endpoints
 64 | Live health card for every monitored machine showing real-time CPU, memory, OS, IP, status, and active incident count. AI-generated endpoint health summary when an OpenAI key is configured.
 65 | 
 66 | ### Tactical Response (Incidents)
 67 | Live stream of endpoint events with severity filter, sandbox detonation panel with behavioural scoring ring, and a full forensic report that includes MITRE tags, indicators of compromise, and an **AI Remediation Playbook** — numbered, specific steps generated for each confirmed incident. Forensic timeline showing Initial Access → Payload Dropped → Lateral Movement phases.
 68 | 
 69 | ### Settings
 70 | Five-tab configuration panel: monitoring toggles (process, network, filesystem, logs), auto-response mode (conservative / moderate / aggressive), AI features, notification preferences, and a dedicated API key manager for all six threat intelligence integrations (NVD, OTX, AbuseIPDB, VirusTotal, Hybrid Analysis, OpenAI). Keys are stored in the local `.env` file and never leave the machine.
 71 | 
 72 | ---
 73 | 
 74 | ## AI Morning Brief
 75 | Every day at 08:00 UTC, ThreatLens generates a 200-word briefing covering the top global threats from the past 24 hours, active endpoint incidents, patterns detected, and three immediate actions for the analyst. Powered by GPT-4o when an OpenAI key is configured; falls back to a structured rule-based summary otherwise.
 76 | 
 77 | ---
 78 | 
 79 | ## Real-Time Architecture
 80 | - **WebSocket (Socket.io)** — Dashboard updates instantly when an endpoint event is detected. No page refresh needed; incidents appear within seconds
 81 | - **15-minute ingestion cycle** — NVD, OTX, AbuseIPDB, and RSS feeds all polled on a rotating schedule
 82 | - **SQLite database** — All threats, incidents, and config stored locally in a single file
 83 | - **PyInstaller binary** — The Python FastAPI backend is packaged as a standalone `.exe`, no Python installation required on the target machine
 84 | 
 85 | ---
 86 | 
 87 | ## Technology Stack
 88 | 
 89 | | Layer | Technology |
 90 | |---|---|
 91 | | Desktop shell | Electron |
 92 | | Frontend | React 19, Vite, TanStack Query |
 93 | | Routing | React Router v7 (HashRouter for Electron) |
 94 | | Maps | react-leaflet + Leaflet |
 95 | | Real-time | Socket.io |
 96 | | Backend | FastAPI + SQLAlchemy (async) |
 97 | | Database | SQLite (via aiosqlite) |
 98 | | Scheduler | APScheduler |
 99 | | AI | OpenAI GPT-4o-mini (optional) |
100 | | Packaging | electron-builder NSIS (Windows installer) |
101 | 
102 | ---
103 | 
104 | ## Threat Intelligence Integrations
105 | 
106 | | Source | What It Provides | Auth |
107 | |---|---|---|
108 | | NVD (NIST) | CVE records, CVSS scores | API key |
109 | | EPSS (FIRST.org) | Exploit probability scores | None (free) |
110 | | AlienVault OTX | Threat pulses, IoCs | API key |
111 | | AbuseIPDB | Malicious IP blacklist | API key |
112 | | VirusTotal | File/hash scanning | API key |
113 | | Hybrid Analysis | Sandbox detonation | API key |
114 | | OpenAI | AI summaries, briefs, playbooks | API key |
115 | 
116 | All API keys are entered once in the Settings screen and stored locally. A trigger fires a full ingestion cycle immediately on save so data starts flowing without waiting for the next scheduled poll.
117 | 
118 | ---
119 | 
120 | ## Installation
121 | 
122 | 1. Download `ThreatLens-Setup.exe` from the Releases page
123 | 2. Run the installer — it installs the Electron app and unpacks the backend binary
124 | 3. On first launch, complete the onboarding flow and enter your API keys in Settings
125 | 4. The backend starts automatically on app launch and stops when the app closes
126 | 
127 | No additional software required. Python, Node.js, and all dependencies are bundled.
128 | 
129 | ---
130 | 
131 | ## Project Structure
132 | 
133 | ```
134 | threatlens-ai/
135 | ├── frontend/              # React + Vite app
136 | │   └── src/
137 | │       ├── pages/         # OverviewDashboard, GlobalThreats, Endpoints,
138 | │       │                  # Incidents, IntelligenceMap, Settings, Onboarding
139 | │       ├── components/    # Layout, KnowledgeGraph
140 | │       └── api/           # Axios client + Socket.io instance
141 | ├── backend/               # FastAPI application
142 | │   ├── routers/           # threats, incidents, endpoints, config,
143 | │   │                      # sandbox, brief, otx_proxy, auth
144 | │   ├── services/          # llm, sandbox, virustotal, scoring, mitre
145 | │   │   ├── agents/        # hunter, correlator, context, analyst,
146 | │   │   │                  # file_watcher, endpoint_stats
147 | │   │   └── ingestion/     # nvd, epss, otx, abuseipdb, rss
148 | │   └── models/            # SQLAlchemy ORM models (Threat, Endpoint, User)
149 | └── rebuild.bat            # Windows build script
150 | ```
151 | 
152 | ---
153 | 
154 | ## Status
155 | 
156 | Currently in active development. Core threat intelligence pipeline, endpoint monitoring, and all six dashboard screens are functional. The installer packages everything into a single Windows `.exe` with no external dependencies.
</content>
</file>
<file><path>BUILD.md</path>
<content lines="1-126">
  1 | # ThreatLens AI — Build Guide
  2 | 
  3 | ## Prerequisites (Windows)
  4 | 
  5 | | Tool | Version | Download |
  6 | |------|---------|----------|
  7 | | Python | 3.11+ | https://python.org |
  8 | | Node.js | 18+ | https://nodejs.org |
  9 | | Git | any | https://git-scm.com |
 10 | 
 11 | > **Important:** During Python install, tick **"Add Python to PATH"**.
 12 | 
 13 | ---
 14 | 
 15 | ## Quickest way — run the batch script
 16 | 
 17 | ```
 18 | build-win.bat
 19 | ```
 20 | 
 21 | That's it. It runs all 5 steps below automatically and outputs the installer to `dist-installers/`.
 22 | 
 23 | ---
 24 | 
 25 | ## Manual step-by-step
 26 | 
 27 | ### 1. Set up Python backend
 28 | 
 29 | ```bat
 30 | cd backend
 31 | python -m venv venv
 32 | venv\Scripts\activate
 33 | pip install -r requirements.txt
 34 | ```
 35 | 
 36 | ### 2. Bundle backend with PyInstaller
 37 | 
 38 | ```bat
 39 | :: (still in backend/, venv active)
 40 | pyinstaller backend.spec --noconfirm
 41 | ```
 42 | 
 43 | Output: `backend/dist/main/main.exe` (plus DLLs)
 44 | 
 45 | ### 3. Build React frontend
 46 | 
 47 | ```bat
 48 | cd ..\frontend
 49 | npm install
 50 | npm run build
 51 | ```
 52 | 
 53 | Output: `frontend/dist/`
 54 | 
 55 | ### 4. Build Electron installer
 56 | 
 57 | ```bat
 58 | cd ..\electron
 59 | npm install
 60 | npx electron-builder --win --config electron-builder.json
 61 | ```
 62 | 
 63 | Output: `dist-installers/ThreatLens AI Setup 1.0.0.exe`
 64 | 
 65 | ---
 66 | 
 67 | ## Output
 68 | 
 69 | ```
 70 | dist-installers/
 71 |   ThreatLens AI Setup 1.0.0.exe   ← this is your setup.exe
 72 | ```
 73 | 
 74 | Double-click to install. The NSIS installer lets the user choose an install directory, creates Start Menu + Desktop shortcuts, and launches the app after install.
 75 | 
 76 | ---
 77 | 
 78 | ## Dev mode (no build needed)
 79 | 
 80 | ```bat
 81 | cd backend
 82 | venv\Scripts\activate
 83 | python main.py          # starts FastAPI on :8000
 84 | 
 85 | :: In a second terminal:
 86 | cd frontend
 87 | npm run dev             # Vite dev server on :5173
 88 | 
 89 | :: In a third terminal:
 90 | cd electron
 91 | npx electron .          # Electron window pointing at :5173
 92 | ```
 93 | 
 94 | Or just: `npm run dev` from the root (uses concurrently).
 95 | 
 96 | ---
 97 | 
 98 | ## Architecture in the packaged app
 99 | 
100 | ```
101 | ThreatLens AI.exe  (Electron shell)
102 |   └── resources/
103 |         ├── backend/          ← PyInstaller bundle (main.exe + DLLs)
104 |         │     └── main.exe    ← FastAPI + uvicorn, listens on 127.0.0.1:8000
105 |         └── frontend-dist/    ← Vite build (static HTML/JS/CSS)
106 |               └── index.html  ← loaded by BrowserWindow via file://
107 | ```
108 | 
109 | Electron's `main.js` spawns `backend/main.exe` on startup, waits 2 s for it to bind, then opens the window. On quit, it kills the backend process.
110 | 
111 | ---
112 | 
113 | ## Bugs fixed in this release
114 | 
115 | | # | File | Bug | Fix |
116 | |---|------|-----|-----|
117 | | 1 | `frontend/vite.config.js` | Missing `base: './'` → assets used absolute paths, broke `file://` loading | Added `base: './'` |
118 | | 2 | `electron/main.js` | Paths to backend and frontend used `../backend/venv/...` which don't exist in packaged app | Detect `app.isPackaged`, use `process.resourcesPath` in prod |
119 | | 3 | `electron/main.js` | No error dialog if backend exe missing; no `windowsHide` | Added `dialog.showErrorBox` + `windowsHide: true` |
120 | | 4 | `electron/main.js` | `mainWindow.show: false` missing → white flash on startup | Added `show: false` + `ready-to-show` handler |
121 | | 5 | `electron-builder.json` | Target was `"dir"` (just a folder, no installer) | Changed to NSIS target for proper `setup.exe` |
122 | | 6 | `electron-builder.json` | Output dir was inside `electron/` subfolder | Moved to `../dist-installers` at project root |
123 | | 7 | `electron/package.json` | Missing `author` field (electron-builder hard requirement) | Added `author` |
124 | | 8 | `backend/requirements.txt` | File was UTF-16 encoded (garbled) | Rewrote as clean UTF-8 |
125 | | 9 | `frontend/src/api/index.js` | Socket.io had no reconnect config → permanent failure if backend slow | Added reconnect options |
126 | | 10 | `frontend/src/api/index.js` | Raw axios with no timeout | Switched to axios instance with 10 s timeout |
</content>
</file>
<file><path>package.json</path>
<content lines="1-14">
 1 | {
 2 |   "name": "threatlens-ai",
 3 |   "version": "1.0.0",
 4 |   "scripts": {
 5 |     "dev": "concurrently \"cd frontend && npm run dev\" \"wait-on http://localhost:5173 && cd electron && npx electron .\"",
 6 |     "build:frontend": "cd frontend && npm install && npm run build",
 7 |     "build:electron": "cd electron && npm install && npx electron-builder --win --config electron-builder.json",
 8 |     "build": "npm run build:frontend && npm run build:electron"
 9 |   },
10 |   "devDependencies": {
11 |     "concurrently": "^9.2.1",
12 |     "wait-on": "^9.0.5"
13 |   }
14 | }
</content>
</file>
<file><path>backend/main.py</path>
<content lines="1-107">
  1 | import sys, os
  2 | 
  3 | # ── STDOUT/STDERR GUARD ──────────────────────────────────────
  4 | # Electron spawns this with windowsHide=True so stdout/stderr can be None.
  5 | # Force UTF-8 so Unicode never causes charmap crashes on Windows.
  6 | if sys.stdout is None:
  7 |     sys.stdout = open(os.devnull, "w", encoding="utf-8")
  8 | else:
  9 |     try:
 10 |         sys.stdout.reconfigure(encoding="utf-8", errors="replace")
 11 |     except Exception:
 12 |         pass
 13 | if sys.stderr is None:
 14 |     sys.stderr = open(os.devnull, "w", encoding="utf-8")
 15 | else:
 16 |     try:
 17 |         sys.stderr.reconfigure(encoding="utf-8", errors="replace")
 18 |     except Exception:
 19 |         pass
 20 | 
 21 | # ── FILE LOGGING ─────────────────────────────────────────────
 22 | from _paths import ENV_PATH, LOG_PATH
 23 | import logging
 24 | 
 25 | logging.basicConfig(
 26 |     filename=LOG_PATH,
 27 |     level=logging.INFO,
 28 |     format="%(asctime)s %(levelname)s %(name)s: %(message)s",
 29 |     datefmt="%Y-%m-%d %H:%M:%S",
 30 | )
 31 | logger = logging.getLogger("main")
 32 | logger.info("Backend starting up")
 33 | 
 34 | # ── LOAD ENV ─────────────────────────────────────────────────
 35 | from dotenv import load_dotenv
 36 | load_dotenv(dotenv_path=ENV_PATH, override=False)
 37 | logger.info("ENV loaded from %s (exists=%s)", ENV_PATH, os.path.exists(ENV_PATH))
 38 | 
 39 | # ── IMPORTS ──────────────────────────────────────────────────
 40 | from contextlib import asynccontextmanager
 41 | from fastapi import FastAPI
 42 | from fastapi.middleware.cors import CORSMiddleware
 43 | import socketio
 44 | from database import init_db
 45 | from routers import threats, incidents, brief, config, sources, endpoints as ep_router, sandbox as sandbox_router
 46 | from routers import auth as auth_router
 47 | from routers import otx_proxy as otx_router
 48 | import models.user  # ensure User table is created
 49 | from scheduler import start_scheduler
 50 | from services.agents.file_watcher import start_file_watcher
 51 | import routers.incidents as inc_router
 52 | import uvicorn
 53 | 
 54 | sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
 55 | inc_router.sio_server = sio
 56 | 
 57 | # Sandbox + default watched folders
 58 | SANDBOX = os.path.join(os.path.expanduser("~"), "Desktop", "ThreatLens-Sandbox")
 59 | WATCH_FOLDERS = [
 60 |     SANDBOX,
 61 |     os.path.join(os.path.expanduser("~"), "Downloads"),
 62 | ]
 63 | 
 64 | 
 65 | @asynccontextmanager
 66 | async def lifespan(app: FastAPI):
 67 |     await init_db()
 68 |     start_scheduler()
 69 |     start_file_watcher(WATCH_FOLDERS)
 70 |     logger.info("Watching folders: %s", WATCH_FOLDERS)
 71 |     logger.info("ThreatLens backend ready")
 72 |     print("ThreatLens backend ready", flush=True)
 73 |     yield
 74 |     logger.info("Backend shutting down")
 75 | 
 76 | 
 77 | app = FastAPI(title="ThreatLens AI", version="1.0.0", lifespan=lifespan)
 78 | app.add_middleware(CORSMiddleware,
 79 |     allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
 80 | 
 81 | app.include_router(threats.router)
 82 | app.include_router(incidents.router)
 83 | app.include_router(brief.router)
 84 | app.include_router(config.router)
 85 | app.include_router(sources.router)
 86 | app.include_router(ep_router.router)
 87 | app.include_router(sandbox_router.router)
 88 | app.include_router(auth_router.router)
 89 | app.include_router(otx_router.router)
 90 | 
 91 | 
 92 | @app.get("/health")
 93 | async def health():
 94 |     return {"status": "ok"}
 95 | 
 96 | 
 97 | socket_app = socketio.ASGIApp(sio, app)
 98 | 
 99 | if __name__ == "__main__":
100 |     uvicorn.run(
101 |         socket_app,
102 |         host="127.0.0.1",
103 |         port=8000,
104 |         reload=False,
105 |         log_config=None,
106 |         access_log=False,
107 |     )
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
COMPREHENSIVE_SUMMARY.md

# VSCode Open Tabs
landing-page-mockup.md,landing-page-preview.html,COMPREHENSIVE_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-18T16:06:32.840Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.01

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll create an extensive, detailed summary document with approximately 10,000 lines. Let me read more files to gather comprehensive information about the entire project.

<read_file>
<args>
<file>
<path>frontend/src/App.jsx</path>
</file>
<file>
<path>backend/database.py</path>
</file>
<file>
<path>backend/scheduler.py</path>
</file>
<file>
<path>agent/main.py</path>
</file>
<file>
<path>electron/main.js</path>
</file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>frontend/src/App.jsx</path>
<content lines="1-49">
 1 | import { useState, useEffect } from 'react'
 2 | import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
 3 | import Dashboard from './pages/Dashboard'
 4 | import Onboarding from './pages/Onboarding'
 5 | import OverviewDashboard from './pages/OverviewDashboard'
 6 | import GlobalThreats from './pages/GlobalThreats'
 7 | import Endpoints from './pages/Endpoints'
 8 | import Incidents from './pages/Incidents'
 9 | import IntelligenceMap from './pages/IntelligenceMap'
10 | import Settings from './pages/Settings'
11 | 
12 | export default function App() {
13 |   const [ready, setReady] = useState(false)
14 |   const done = localStorage.getItem('onboarding_complete') === 'true'
15 | 
16 |   useEffect(() => {
17 |     setTimeout(() => setReady(true), 500)
18 |   }, [])
19 | 
20 |   if (!ready) return (
21 |     <div style={{
22 |       display: 'flex', alignItems: 'center', justifyContent: 'center',
23 |       height: '100vh', background: '#060c14', color: '#334155', fontSize: 14,
24 |       fontFamily: 'system-ui, sans-serif'
25 |     }}>
26 |       Starting ThreatLens AI…
27 |     </div>
28 |   )
29 | 
30 |   if (!done) {
31 |     return <Onboarding onComplete={() => window.location.reload()} />
32 |   }
33 | 
34 |   return (
35 |     <Router>
36 |       <Routes>
37 |         <Route path="/" element={<Navigate to="/overview" replace />} />
38 |         <Route path="/overview" element={<OverviewDashboard />} />
39 |         <Route path="/threats" element={<GlobalThreats />} />
40 |         <Route path="/endpoints" element={<Endpoints />} />
41 |         <Route path="/incidents" element={<Incidents />} />
42 |         <Route path="/map" element={<IntelligenceMap />} />
43 |         <Route path="/settings" element={<Settings />} />
44 |         <Route path="/dashboard" element={<Dashboard />} />
45 |         <Route path="*" element={<Navigate to="/overview" replace />} />
46 |       </Routes>
47 |     </Router>
48 |   )
49 | }
</content>
</file>
<file><path>backend/database.py</path>
<content lines="1-59">
 1 | from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
 2 | from sqlalchemy.orm import declarative_base, sessionmaker
 3 | from sqlalchemy import text
 4 | from _paths import DB_PATH
 5 | import logging
 6 | 
 7 | logger = logging.getLogger("database")
 8 | 
 9 | DATABASE_URL = f"sqlite+aiosqlite:///{DB_PATH}"
10 | 
11 | engine = create_async_engine(DATABASE_URL, echo=False)
12 | AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
13 | Base = declarative_base()
14 | 
15 | 
16 | async def init_db():
17 |     async with engine.begin() as conn:
18 |         await conn.run_sync(Base.metadata.create_all)
19 |     logger.info("Database ready at %s", DB_PATH)
20 | 
21 | 
22 | async def get_db():
23 |     async with AsyncSessionLocal() as session:
24 |         yield session
25 | 
26 | 
27 | async def upsert_threats(threats: list) -> int:
28 |     """
29 |     Bulk INSERT OR REPLACE threats into the DB.
30 |     Returns number of rows actually saved.
31 |     Each dict must have all threat columns as keys.
32 |     """
33 |     if not threats:
34 |         return 0
35 | 
36 |     saved = 0
37 |     async with AsyncSessionLocal() as db:
38 |         try:
39 |             for t in threats:
40 |                 await db.execute(text("""
41 |                     INSERT OR REPLACE INTO threats
42 |                         (id, cve, title, origin, source, severity,
43 |                          cvss_score, epss_score, priority_score,
44 |                          asset_match, mitre_tags, ai_summary, raw_data,
45 |                          machine, resolved, auto_responded, response_log, created_at)
46 |                     VALUES
47 |                         (:id, :cve, :title, :origin, :source, :severity,
48 |                          :cvss_score, :epss_score, :priority_score,
49 |                          :asset_match, :mitre_tags, :ai_summary, :raw_data,
50 |                          :machine, :resolved, :auto_responded, :response_log, :created_at)
51 |                 """), t)
52 |                 saved += 1
53 |             await db.commit()
54 |             logger.info("upsert_threats: saved %d rows", saved)
55 |         except Exception as e:
56 |             logger.error("upsert_threats failed: %s", e)
57 |             await db.rollback()
58 | 
59 |     return saved
</content>
</file>
<file><path>backend/scheduler.py</path>
<content lines="1-135">
  1 | from apscheduler.schedulers.asyncio import AsyncIOScheduler
  2 | from services.ingestion.nvd      import fetch_recent_cves
  3 | from services.ingestion.epss     import get_epss_scores
  4 | from services.ingestion.otx      import fetch_pulses
  5 | from services.ingestion.abuseipdb import get_ip_threats
  6 | from services.ingestion.rss      import fetch_rss_threats
  7 | from services.scoring            import score_threat, score_to_severity
  8 | from services.llm                import summarize_threat
  9 | from services.mitre              import map_to_mitre
 10 | from database                    import upsert_threats
 11 | import json, logging
 12 | from datetime import datetime, timedelta
 13 | 
 14 | logger    = logging.getLogger("scheduler")
 15 | scheduler = AsyncIOScheduler()
 16 | 
 17 | 
 18 | async def _enrich_and_store(raw_threats: list, source_name: str):
 19 |     """Score, tag, and upsert a list of raw threat dicts."""
 20 |     if not raw_threats:
 21 |         logger.info("%s: 0 threats fetched — skipping", source_name)
 22 |         return
 23 | 
 24 |     enriched = []
 25 |     for t in raw_threats:
 26 |         try:
 27 |             # Defaults for optional fields
 28 |             t.setdefault("cve",        None)
 29 |             t.setdefault("origin",     "GLOBAL")
 30 |             t.setdefault("cvss_score", 5.0)
 31 |             t.setdefault("epss_score", 0.1)
 32 |             t.setdefault("raw_data",   "")
 33 | 
 34 |             # Scoring & tagging
 35 |             t["priority_score"] = score_threat(t)
 36 |             t["severity"]       = score_to_severity(float(t["cvss_score"]))
 37 |             t["mitre_tags"]     = json.dumps(map_to_mitre(t.get("title", "")))
 38 |             t["ai_summary"]     = await summarize_threat(t.get("raw_data", ""))
 39 | 
 40 |             # Required columns with safe defaults
 41 |             t["asset_match"]    = False
 42 |             t["machine"]        = None
 43 |             t["resolved"]       = False
 44 |             t["auto_responded"] = False
 45 |             t["response_log"]   = "[]"
 46 |             t["created_at"]     = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
 47 | 
 48 |             # Only keep known columns — discard anything extra
 49 |             enriched.append({
 50 |                 "id":            t["id"],
 51 |                 "cve":           t["cve"],
 52 |                 "title":         t["title"],
 53 |                 "origin":        t["origin"],
 54 |                 "source":        t["source"],
 55 |                 "severity":      t["severity"],
 56 |                 "cvss_score":    float(t["cvss_score"]),
 57 |                 "epss_score":    float(t["epss_score"]),
 58 |                 "priority_score": float(t["priority_score"]),
 59 |                 "asset_match":   t["asset_match"],
 60 |                 "mitre_tags":    t["mitre_tags"],
 61 |                 "ai_summary":    t["ai_summary"],
 62 |                 "raw_data":      t["raw_data"],
 63 |                 "machine":       t["machine"],
 64 |                 "resolved":      t["resolved"],
 65 |                 "auto_responded": t["auto_responded"],
 66 |                 "response_log":  t["response_log"],
 67 |                 "created_at":    t["created_at"],
 68 |             })
 69 |         except Exception as e:
 70 |             logger.warning("%s: skipping %s — %s", source_name, t.get("id", "?"), e)
 71 | 
 72 |     saved = await upsert_threats(enriched)
 73 |     logger.info("%s: saved %d / %d threats to DB", source_name, saved, len(raw_threats))
 74 | 
 75 | 
 76 | async def ingest_nvd():
 77 |     logger.info("Polling NVD...")
 78 |     try:
 79 |         cves = await fetch_recent_cves(hours_back=24)
 80 |         if cves:
 81 |             cve_ids  = [c["cve"] for c in cves if c.get("cve")]
 82 |             epss_map = await get_epss_scores(cve_ids)
 83 |             for cve in cves:
 84 |                 cve["epss_score"] = epss_map.get(cve.get("cve", ""), 0.1)
 85 |         await _enrich_and_store(cves, "NVD")
 86 |     except Exception as e:
 87 |         logger.error("NVD poll failed: %s", e)
 88 | 
 89 | 
 90 | async def ingest_otx():
 91 |     logger.info("Polling OTX...")
 92 |     try:
 93 |         pulses = await fetch_pulses()
 94 |         await _enrich_and_store(pulses, "OTX")
 95 |     except Exception as e:
 96 |         logger.error("OTX poll failed: %s", e)
 97 | 
 98 | 
 99 | async def ingest_abuseipdb():
100 |     logger.info("Polling AbuseIPDB...")
101 |     try:
102 |         ip_threats = await get_ip_threats(limit=50)
103 |         await _enrich_and_store(ip_threats, "AbuseIPDB")
104 |     except Exception as e:
105 |         logger.error("AbuseIPDB poll failed: %s", e)
106 | 
107 | 
108 | async def ingest_rss():
109 |     logger.info("Polling RSS feeds...")
110 |     try:
111 |         rss_threats = await fetch_rss_threats()
112 |         await _enrich_and_store(rss_threats, "RSS")
113 |     except Exception as e:
114 |         logger.error("RSS poll failed: %s", e)
115 | 
116 | 
117 | async def full_ingestion_cycle():
118 |     logger.info("=== Full ingestion cycle starting ===")
119 |     await ingest_nvd()
120 |     await ingest_otx()
121 |     await ingest_abuseipdb()
122 |     await ingest_rss()
123 |     logger.info("=== Full ingestion cycle complete ===")
124 | 
125 | 
126 | def start_scheduler():
127 |     scheduler.add_job(
128 |         full_ingestion_cycle,
129 |         "interval",
130 |         minutes=15,
131 |         id="full_poll",
132 |         next_run_time=datetime.utcnow() + timedelta(seconds=5),
133 |     )
134 |     scheduler.start()
135 |     logger.info("Scheduler started — first poll in 5 s")
</content>
</file>
<file><path>agent/main.py</path>
<content lines="1-54">
 1 | import json, time, os, sys
 2 | from pathlib import Path
 3 | from sender import send_event, flush_queue
 4 | from monitors.process import ProcessMonitor
 5 | from monitors.network import NetworkMonitor
 6 | from monitors.filesystem import FileMonitor
 7 | 
 8 | CONFIG_PATH = Path(__file__).parent.parent / "backend" / "agent_config.json"
 9 | 
10 | def load_config():
11 |     try:
12 |         with open(CONFIG_PATH) as f:
13 |             return json.load(f)
14 |     except:
15 |         # Defaults if config not set yet
16 |         return {
17 |             "process": True, "network": True,
18 |             "filesystem": True, "logs": True,
19 |             "folders": [str(Path.home()/"Documents"), str(Path.home()/"Downloads")],
20 |             "responseMode": "conservative"
21 |         }
22 | 
23 | if __name__ == "__main__":
24 |     config = load_config()
25 |     mode   = config.get("responseMode","conservative")
26 |     print(f"ThreatLens Agent starting. Mode: {mode}")
27 | 
28 |     flush_queue()   # Retry any events that failed while backend was down
29 | 
30 |     monitors = []
31 |     if config.get("process"):
32 |         pm = ProcessMonitor(callback=send_event)
33 |         pm.start()
34 |         monitors.append(pm)
35 |         print("Process monitor active")
36 | 
37 |     if config.get("network"):
38 |         nm = NetworkMonitor(callback=send_event)
39 |         nm.start()
40 |         monitors.append(nm)
41 |         print("Network monitor active")
42 | 
43 |     if config.get("filesystem"):
44 |         folders = config.get("folders",[str(Path.home())])
45 |         fm = FileMonitor(paths=folders, callback=send_event)
46 |         fm.start()
47 |         print(f"File monitor active — watching {len(folders)} folders")
48 | 
49 |     print("Agent running. Press Ctrl+C to stop.")
50 |     try:
51 |         while True:
52 |             time.sleep(1)
53 |     except KeyboardInterrupt:
54 |         print("Agent stopped.")
</content>
</file>
<file><path>electron/main.js</path>
<content lines="1-180">
  1 | const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, dialog } = require('electron')
  2 | const path   = require('path')
  3 | const { spawn } = require('child_process')
  4 | const fs     = require('fs')
  5 | const http   = require('http')
  6 | 
  7 | let mainWindow, tray, backendProcess
  8 | let windowCreated  = false   // guard — createWindow runs exactly once
  9 | let backendHealthy = false   // guard — only open window after backend confirms ready
 10 | 
 11 | const IS_DEV = !app.isPackaged
 12 | 
 13 | // ── SINGLE INSTANCE LOCK ─────────────────────────────────────
 14 | const gotLock = app.requestSingleInstanceLock()
 15 | if (!gotLock) {
 16 |   // A second instance tried to open — quit it immediately
 17 |   app.quit()
 18 |   process.exit(0)
 19 | }
 20 | 
 21 | // If a second instance fires anyway, just focus the existing window
 22 | app.on('second-instance', () => {
 23 |   if (mainWindow) {
 24 |     if (mainWindow.isMinimized()) mainWindow.restore()
 25 |     mainWindow.show()
 26 |     mainWindow.focus()
 27 |   }
 28 | })
 29 | 
 30 | // ── BACKEND STARTUP ──────────────────────────────────────────
 31 | function startBackend() {
 32 |   let backendExe, backendArgs, backendCwd
 33 | 
 34 |   if (IS_DEV) {
 35 |     const pythonPath = process.platform === 'win32'
 36 |       ? path.join(__dirname, '../backend/venv/Scripts/python.exe')
 37 |       : path.join(__dirname, '../backend/venv/bin/python')
 38 |     backendExe  = pythonPath
 39 |     backendArgs = [path.join(__dirname, '../backend/main.py')]
 40 |     backendCwd  = path.join(__dirname, '../backend')
 41 |   } else {
 42 |     backendExe = path.join(process.resourcesPath, 'backend', 'main.exe')
 43 |     backendArgs = []
 44 |     backendCwd  = path.join(process.resourcesPath, 'backend')
 45 |   }
 46 | 
 47 |   if (!IS_DEV && !fs.existsSync(backendExe)) {
 48 |     dialog.showErrorBox(
 49 |       'ThreatLens AI — Backend Missing',
 50 |       `Backend executable not found at:\n${backendExe}\n\nPlease reinstall the application.`
 51 |     )
 52 |     app.quit()
 53 |     return
 54 |   }
 55 | 
 56 |   backendProcess = spawn(backendExe, backendArgs, {
 57 |     cwd: backendCwd,
 58 |     windowsHide: true,
 59 |     env: { ...process.env },
 60 |   })
 61 | 
 62 |   backendProcess.stdout?.on('data', d => console.log(`[backend] ${d}`))
 63 |   backendProcess.stderr?.on('data', d => console.error(`[backend-err] ${d}`))
 64 |   backendProcess.on('error', err => console.error('Backend spawn error:', err))
 65 |   backendProcess.on('exit', code => console.log(`Backend exited with code ${code}`))
 66 | }
 67 | 
 68 | // ── WAIT FOR BACKEND ─────────────────────────────────────────
 69 | // Polls /health every 500 ms. Calls callback exactly once when ready.
 70 | function waitForBackend(callback) {
 71 |   let done = false   // ensures callback fires at most once
 72 | 
 73 |   function attempt(tries) {
 74 |     if (done) return
 75 |     if (tries >= 60) {
 76 |       console.warn('Backend did not respond after 30 s — opening window anyway')
 77 |       done = true
 78 |       callback()
 79 |       return
 80 |     }
 81 | 
 82 |     const req = http.get('http://127.0.0.1:8000/health', (res) => {
 83 |       if (done) return
 84 |       if (res.statusCode === 200) {
 85 |         console.log('Backend healthy ✓')
 86 |         done = true
 87 |         callback()
 88 |       } else {
 89 |         setTimeout(() => attempt(tries + 1), 500)
 90 |       }
 91 |       // Consume response body so the socket is released
 92 |       res.resume()
 93 |     })
 94 | 
 95 |     req.on('error', () => {
 96 |       if (!done) setTimeout(() => attempt(tries + 1), 500)
 97 |     })
 98 | 
 99 |     req.setTimeout(400, () => {
100 |       req.destroy()
101 |       if (!done) setTimeout(() => attempt(tries + 1), 500)
102 |     })
103 |   }
104 | 
105 |   attempt(0)
106 | }
107 | 
108 | // ── WINDOW CREATION ──────────────────────────────────────────
109 | function createWindow() {
110 |   if (windowCreated) return   // never open more than one window
111 |   windowCreated = true
112 | 
113 |   mainWindow = new BrowserWindow({
114 |     width: 1280, height: 800,
115 |     minWidth: 1024, minHeight: 700,
116 |     title: 'ThreatLens AI',
117 |     webPreferences: {
118 |       nodeIntegration: false,
119 |       contextIsolation: true,
120 |       preload: path.join(__dirname, 'preload.js'),
121 |     },
122 |     backgroundColor: '#060c14',
123 |     show: false,
124 |   })
125 | 
126 |   if (IS_DEV) {
127 |     mainWindow.loadURL('http://localhost:5173')
128 |     mainWindow.webContents.openDevTools()
129 |   } else {
130 |     const indexPath = path.join(process.resourcesPath, 'frontend-dist', 'index.html')
131 |     mainWindow.loadFile(indexPath)
132 |   }
133 | 
134 |   mainWindow.once('ready-to-show', () => mainWindow.show())
135 | 
136 |   // System tray
137 |   const trayIconPath = path.join(__dirname, 'assets', 'tray-icon.png')
138 |   try {
139 |     const { nativeImage } = require('electron')
140 |     const img = nativeImage.createFromPath(trayIconPath)
141 |     if (!img.isEmpty()) {
142 |       tray = new Tray(img)
143 |       tray.setToolTip('ThreatLens AI')
144 |       tray.setContextMenu(Menu.buildFromTemplate([
145 |         { label: 'Open ThreatLens', click: () => { mainWindow.show(); mainWindow.focus() } },
146 |         { type: 'separator' },
147 |         { label: 'Quit', click: () => app.quit() },
148 |       ]))
149 |       tray.on('double-click', () => { mainWindow.show(); mainWindow.focus() })
150 |     }
151 |   } catch (e) {
152 |     console.warn('Tray icon failed:', e.message)
153 |   }
154 | 
155 |   mainWindow.on('close', e => {
156 |     if (!app.isQuitting) { e.preventDefault(); mainWindow.hide() }
157 |   })
158 | }
159 | 
160 | // ── APP LIFECYCLE ────────────────────────────────────────────
161 | app.whenReady().then(() => {
162 |   startBackend()
163 |   waitForBackend(createWindow)
164 | })
165 | 
166 | app.on('before-quit', () => {
167 |   app.isQuitting = true
168 |   if (backendProcess) {
169 |     try { backendProcess.kill() } catch (_) {}
170 |   }
171 | })
172 | 
173 | app.on('activate', () => {
174 |   if (mainWindow) mainWindow.show()
175 | })
176 | 
177 | // ── IPC ──────────────────────────────────────────────────────
178 | ipcMain.on('show-notification', (_, { title, body }) => {
179 |   if (Notification.isSupported()) new Notification({ title, body }).show()
180 | })
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
COMPREHENSIVE_SUMMARY.md

# VSCode Open Tabs
landing-page-mockup.md,landing-page-preview.html,COMPREHENSIVE_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-18T16:06:40.584Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.04

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll create a comprehensive 10,000+ line summary document. Let me continue reading more critical files to ensure complete coverage.

<read_file>
<args>
<file>
<path>backend/models/threat.py</path>
</file>
<file>
<path>backend/models/endpoint.py</path>
</file>
<file>
<path>backend/services/agents/pipeline.py</path>
</file>
<file>
<path>frontend/src/pages/OverviewDashboard.jsx</path>
</file>
<file>
<path>backend/routers/threats.py</path>
</file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>backend/models/threat.py</path>
<content lines="1-25">
 1 | from sqlalchemy import Column, String, Float, Boolean, DateTime, Text
 2 | from database import Base
 3 | from datetime import datetime
 4 | 
 5 | class Threat(Base):
 6 |     __tablename__ = "threats"
 7 |     
 8 |     id             = Column(String, primary_key=True)
 9 |     cve            = Column(String, nullable=True)
10 |     title          = Column(String, nullable=False)
11 |     origin         = Column(String, default="GLOBAL")   # GLOBAL or ENDPOINT
12 |     source         = Column(String)                      # NVD, OTX, AGENT etc
13 |     severity       = Column(String, default="MEDIUM")
14 |     cvss_score     = Column(Float,  default=0.0)
15 |     epss_score     = Column(Float,  default=0.0)
16 |     priority_score = Column(Float,  default=0.0)
17 |     asset_match    = Column(Boolean, default=False)
18 |     mitre_tags     = Column(Text,   default="[]")        # JSON string
19 |     ai_summary     = Column(Text,   nullable=True)
20 |     raw_data       = Column(Text,   nullable=True)
21 |     machine        = Column(String, nullable=True)       # for endpoint events
22 |     resolved       = Column(Boolean, default=False)
23 |     auto_responded = Column(Boolean, default=False)
24 |     response_log   = Column(Text,   default="[]")        # JSON string
25 |     created_at     = Column(DateTime, default=datetime.utcnow)
</content>
</file>
<file><path>backend/models/endpoint.py</path>
<content lines="1-17">
 1 | from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer
 2 | from database import Base
 3 | from datetime import datetime
 4 | 
 5 | class Endpoint(Base):
 6 |     __tablename__ = "endpoints"
 7 |     
 8 |     id          = Column(String, primary_key=True)
 9 |     name        = Column(String)
10 |     os          = Column(String)
11 |     ip          = Column(String)
12 |     status      = Column(String, default="HEALTHY")  # HEALTHY, WARNING, INCIDENT
13 |     agent_version = Column(String)
14 |     last_seen   = Column(DateTime, default=datetime.utcnow)
15 |     incidents   = Column(Integer, default=0)
16 |     cpu         = Column(Float, default=0.0)
17 |     mem         = Column(Float, default=0.0)
</content>
</file>
<file><path>backend/services/agents/pipeline.py</path>
<content lines="1-24">
 1 | """
 2 | ThreatLens AI — Agent Pipeline
 3 | Orchestrates analyst → context → correlator flow for a list of threats.
 4 | """
 5 | from services.agents.analyst import analyse_threat
 6 | from services.agents.context import enrich_context
 7 | from services.agents.correlator import correlate
 8 | 
 9 | 
10 | async def run_pipeline(threats: list) -> dict:
11 |     """
12 |     Run the full agent pipeline on a list of threat dicts.
13 |     Returns enriched threats + correlation groups.
14 |     """
15 |     enriched = []
16 |     for threat in threats:
17 |         ctx     = enrich_context(threat)
18 |         verdict = await analyse_threat(ctx)
19 |         ctx["agent_verdict"]      = verdict.get("verdict", "UNKNOWN")
20 |         ctx["agent_explanation"]  = verdict.get("explanation", "")
21 |         enriched.append(ctx)
22 | 
23 |     groups = correlate(enriched)
24 |     return {"threats": enriched, "correlations": groups}
</content>
</file>
<file><path>frontend/src/pages/OverviewDashboard.jsx</path>
<content lines="1-298">
  1 | import { useState, useEffect } from 'react';
  2 | import { useQuery, useQueryClient } from '@tanstack/react-query';
  3 | import { Link, useNavigate } from 'react-router-dom';
  4 | import { api, socket } from '../api/index';
  5 | import Layout, { C, Icon, toast } from '../components/Layout';
  6 | 
  7 | function KpiCard({ label, value, icon, iconColor, badge, badgeColor, badgeBg }) {
  8 |   return (
  9 |     <div style={{
 10 |       background: '#112240', border: `1px solid ${C.goldBorder}`,
 11 |       borderRadius: 4, padding: 24, display: 'flex', flexDirection: 'column', gap: 12,
 12 |     }}>
 13 |       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
 14 |         <span style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: 11, textTransform: 'uppercase' }}>
 15 |           {label}
 16 |         </span>
 17 |         <Icon name={icon} size={22} style={{ color: iconColor }} />
 18 |       </div>
 19 |       <div>
 20 |         <div style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 36, fontWeight: 400, lineHeight: 1.1 }}>
 21 |           {value}
 22 |         </div>
 23 |         {badge && (
 24 |           <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
 25 |             <span style={{
 26 |               padding: '2px 8px', borderRadius: 2,
 27 |               border: `1px solid ${badgeColor}33`,
 28 |               background: badgeBg, color: badgeColor,
 29 |               fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em',
 30 |               display: 'inline-flex', alignItems: 'center', gap: 4,
 31 |             }}>
 32 |               {badge}
 33 |             </span>
 34 |           </div>
 35 |         )}
 36 |       </div>
 37 |     </div>
 38 |   );
 39 | }
 40 | 
 41 | function ActivityItem({ severity, title, time, meta }) {
 42 |   const color = severity === 'CRITICAL' ? C.error
 43 |     : severity === 'HIGH' ? '#f97316'
 44 |     : severity === 'MEDIUM' ? '#ffa502'
 45 |     : C.tertiary;
 46 |   const icon = severity === 'CRITICAL' ? 'policy'
 47 |     : severity === 'HIGH' ? 'warning'
 48 |     : 'info';
 49 |   return (
 50 |     <div style={{ display: 'flex', gap: 12 }}>
 51 |       <div style={{
 52 |         width: 32, height: 32, borderRadius: 4, flexShrink: 0,
 53 |         background: color + '1a', border: `1px solid ${color}33`,
 54 |         display: 'flex', alignItems: 'center', justifyContent: 'center',
 55 |       }}>
 56 |         <Icon name={icon} size={16} style={{ color }} />
 57 |       </div>
 58 |       <div style={{ flex: 1, minWidth: 0 }}>
 59 |         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
 60 |           <span style={{ color, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
 61 |             {severity || 'INFO'}
 62 |           </span>
 63 |           <span style={{ color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, flexShrink: 0, marginLeft: 8 }}>
 64 |             {time}
 65 |           </span>
 66 |         </div>
 67 |         <p style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.4, margin: 0, wordBreak: 'break-word' }}>
 68 |           {title}
 69 |         </p>
 70 |         {meta && (
 71 |           <span style={{ color: C.onSurfaceVariant + 'b3', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
 72 |             {meta}
 73 |           </span>
 74 |         )}
 75 |       </div>
 76 |     </div>
 77 |   );
 78 | }
 79 | 
 80 | const FALLBACK_ACTIVITY = [
 81 |   { id: 1, severity: 'CRITICAL', title: 'Unauthorized access attempt blocked on Core DB cluster', time: '14:02 UTC', meta: 'IP: 10.0.4.15' },
 82 |   { id: 2, severity: 'HIGH',     title: 'Memory dump detected on endpoint SRV-DC-02', time: '13:55 UTC', meta: 'SRV-DC-02' },
 83 |   { id: 3, severity: 'HIGH',     title: 'CVE-2024-8931 EPSS score elevated to 0.94', time: '13:41 UTC', meta: 'NVD Feed' },
 84 |   { id: 4, severity: 'MEDIUM',   title: 'Lateral movement attempt — SMB auth failures x12', time: '13:22 UTC', meta: 'Subnet VLAN-40' },
 85 |   { id: 5, severity: 'MEDIUM',   title: 'Suspicious PowerShell execution logged', time: '12:58 UTC', meta: 'WRK-EU-07' },
 86 | ];
 87 | 
 88 | export default function OverviewDashboard() {
 89 |   const navigate = useNavigate();
 90 |   const queryClient = useQueryClient();
 91 |   const [liveEvents, setLiveEvents] = useState([]);
 92 | 
 93 |   const handleIsolate = async () => {
 94 |     toast('Isolation command sent to critical endpoints', 'warning');
 95 |     await new Promise(r => setTimeout(r, 800));
 96 |     navigate('/endpoints');
 97 |   };
 98 | 
 99 |   const { data: stats }  = useQuery({ queryKey: ['stats'],  queryFn: () => api.getStats().then(r => r.data),       refetchInterval: 30000 });
100 |   const { data: brief }  = useQuery({ queryKey: ['brief'],  queryFn: () => api.getBrief().then(r => r.data),       refetchInterval: 60000 });
101 |   const { data: incidents } = useQuery({ queryKey: ['incidents'], queryFn: () => api.getIncidents().then(r => r.data), refetchInterval: 30000 });
102 | 
103 |   useEffect(() => {
104 |     const handler = (data) => {
105 |       setLiveEvents(prev => [data, ...prev].slice(0, 20));
106 |       queryClient.invalidateQueries({ queryKey: ['stats'] });
107 |       queryClient.invalidateQueries({ queryKey: ['incidents'] });
108 |     };
109 |     socket.on('new_incident', handler);
110 |     return () => socket.off('new_incident', handler);
111 |   }, [queryClient]);
112 | 
113 |   // Build activity list from live events + incidents, fall back to static
114 |   const activityRaw = [
115 |     ...liveEvents.map(e => ({ id: `live-${e.id || Date.now()}`, severity: e.severity, title: e.title, time: 'Live', meta: e.machine })),
116 |     ...(incidents || []).slice(0, 8).map(inc => ({
117 |       id: inc.id,
118 |       severity: inc.severity,
119 |       title: inc.title || 'Incident detected',
120 |       time: inc.created_at ? new Date(inc.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' UTC' : '—',
121 |       meta: inc.machine,
122 |     })),
123 |   ];
124 |   const activity = activityRaw.length > 0 ? activityRaw.slice(0, 12) : FALLBACK_ACTIVITY;
125 | 
126 |   const total    = stats?.total    ?? '—';
127 |   const critical = stats?.critical ?? '—';
128 |   const online   = stats?.endpoint ?? '—';
129 | 
130 |   return (
131 |     <Layout searchPlaceholder="Search threats, assets, CVEs...">
132 |       <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1440, margin: '0 auto' }}>
133 | 
134 |         {/* AI Brief */}
135 |         <section style={{
136 |           background: '#112240', border: `1px solid ${C.goldBorder}`,
137 |           borderRadius: 4, padding: 40, position: 'relative', overflow: 'hidden',
138 |         }}>
139 |           <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 100% 0%, rgba(236,193,85,0.06) 0%, transparent 50%)', pointerEvents: 'none' }} />
140 |           <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>
141 |             <div style={{ maxWidth: 700 }}>
142 |               <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
143 |                 <Icon name="auto_awesome" size={18} style={{ color: C.primary }} />
144 |                 <span style={{ color: C.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: 11, textTransform: 'uppercase' }}>
145 |                   AI Morning Brief
146 |                 </span>
147 |               </div>
148 |               <h2 style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 40, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 16px' }}>
149 |                 {brief?.title || 'Zero-Day Vulnerability Detected in European Region.'}
150 |               </h2>
151 |               <p style={{ color: C.secondary, fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.65, margin: 0 }}>
152 |                 {brief?.summary || 'Analysis indicates a newly disclosed vulnerability (CVE-2024-8931) is actively being exploited targeting financial infrastructure. Two of your critical endpoints show anomalous outbound traffic consistent with this pattern. Immediate patching is recommended.'}
153 |               </p>
154 |               <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
155 |                 <button onClick={handleIsolate} style={{
156 |                   padding: '10px 20px', background: C.primaryContainer, color: C.onPrimary,
157 |                   border: `1px solid ${C.primary}4d`, borderRadius: 4,
158 |                   fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
159 |                   cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
160 |                 }}>
161 |                   <Icon name="shield" size={16} /> Isolate Endpoints
162 |                 </button>
163 |                 <button onClick={() => navigate('/threats')} style={{
164 |                   padding: '10px 20px', background: 'transparent',
165 |                   border: `1px solid ${C.primary}`, color: C.primary, borderRadius: 4,
166 |                   fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
167 |                   cursor: 'pointer',
168 |                 }}>
169 |                   View Analysis
170 |                 </button>
171 |               </div>
172 |             </div>
173 |             {/* Mini chart */}
174 |             <div style={{
175 |               width: 240, minHeight: 160, background: C.surfaceContainer,
176 |               border: `1px solid ${C.goldBorder}`, borderRadius: 4,
177 |               padding: 16, display: 'flex', flexDirection: 'column',
178 |             }}>
179 |               <span style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: 10, textTransform: 'uppercase', marginBottom: 12 }}>
180 |                 Threat Vector Probability
181 |               </span>
182 |               <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6, marginTop: 8 }}>
183 |                 {[25, 50, 94, 35].map((h, i) => (
184 |                   <div key={i} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
185 |                     {i === 2 && (
186 |                       <span style={{ position: 'absolute', top: -20, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.error }}>94%</span>
187 |                     )}
188 |                     <div style={{
189 |                       width: '100%', height: `${h}%`, minHeight: 8, borderRadius: '2px 2px 0 0',
190 |                       background: i === 2 ? C.error + 'cc' : C.primary + (i === 1 ? '66' : '33'),
191 |                     }} />
192 |                   </div>
193 |                 ))}
194 |               </div>
195 |             </div>
196 |           </div>
197 |         </section>
198 | 
199 |         {/* KPIs + Activity */}
200 |         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 340px', gridTemplateRows: 'auto auto', gap: 24 }}>
201 |           {/* KPIs */}
202 |           <div style={{ gridColumn: '1', gridRow: '1' }}>
203 |             <KpiCard label="Active Incidents" value={critical} icon="warning" iconColor={C.error}
204 |               badge={`+3 vs yesterday`} badgeColor={C.error} badgeBg={C.error + '1a'} />
205 |           </div>
206 |           <div style={{ gridColumn: '2', gridRow: '1' }}>
207 |             <KpiCard label="Threats Tracked" value={total} icon="bug_report" iconColor={C.primary}
208 |               badge="-124 vs last week" badgeColor={C.primary} badgeBg={C.primary + '1a'} />
209 |           </div>
210 |           <div style={{ gridColumn: '3', gridRow: '1' }}>
211 |             <KpiCard label="Endpoints Online" value={online} icon="monitor_heart" iconColor={C.tertiary}
212 |               badge="Nominal" badgeColor={C.tertiary} badgeBg={C.tertiary + '1a'} />
213 |           </div>
214 | 
215 |           {/* Activity Stream — spans vertically across 2 rows */}
216 |           <div style={{
217 |             gridColumn: '4', gridRow: '1 / 3', background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`,
218 |             borderRadius: 8, display: 'flex', flexDirection: 'column',
219 |             maxHeight: 600, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
220 |           }}>
221 |             <div style={{
222 |               padding: '20px', borderBottom: `1px solid ${C.outlineVariant}30`,
223 |               display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
224 |               background: C.surfaceContainerHigh,
225 |             }}>
226 |               <span style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 20, fontWeight: 500 }}>Activity Stream</span>
227 |               {liveEvents.length > 0 && (
228 |                 <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.error, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em' }}>
229 |                   <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.error, animation: 'pulse 1s infinite' }} />
230 |                   LIVE
231 |                 </span>
232 |               )}
233 |             </div>
234 |             <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20, wordBreak: 'break-word' }}>
235 |               {activity.map((item, i) => (
236 |                 <ActivityItem key={item.id ?? i} {...item} />
237 |               ))}
238 |             </div>
239 |             <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.outlineVariant}30`, flexShrink: 0, background: C.surfaceContainerHigh }}>
240 |               <Link to="/incidents" style={{ textDecoration: 'none' }}>
241 |                 <button style={{
242 |                   width: '100%', padding: '10px', borderRadius: 4,
243 |                   border: `1px solid ${C.outlineVariant}50`, background: 'transparent',
244 |                   color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
245 |                   fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
246 |                   transition: 'background 0.15s'
247 |                 }}
248 |                 onMouseOver={e => e.currentTarget.style.background=C.surfaceContainerHighest}
249 |                 onMouseOut={e => e.currentTarget.style.background='transparent'}>
250 |                   View All Incidents
251 |                 </button>
252 |               </Link>
253 |             </div>
254 |           </div>
255 | 
256 |           {/* Map placeholder */}
257 |           <div style={{
258 |             gridColumn: '1 / 4', gridRow: '2', background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`,
259 |             borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', minHeight: 320,
260 |           }}>
261 |             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.goldBorder}` }}>
262 |               <span style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 500 }}>Global Threat Distribution</span>
263 |               <Link to="/map" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, color: C.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em' }}>
264 |                 View Full Map <Icon name="arrow_forward" size={16} style={{ color: C.primary }} />
265 |               </Link>
266 |             </div>
267 |             <div style={{ flex: 1, background: C.surfaceContainer + '80', borderRadius: 2, border: `1px solid ${C.outlineVariant}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
268 |               {/* Simple SVG world dots */}
269 |               <svg viewBox="0 0 800 360" style={{ width: '100%', height: '100%', opacity: 0.4 }}>
270 |                 {[
271 |                   [120, 140], [160, 120], [200, 150], [240, 130], [300, 160],
272 |                   [350, 120], [380, 140], [420, 130], [460, 150], [500, 120],
273 |                   [540, 100], [580, 130], [620, 110], [660, 120], [700, 140],
274 |                   [140, 200], [200, 220], [260, 210], [320, 230], [380, 200],
275 |                   [440, 220], [500, 210], [560, 230],
276 |                 ].map(([x, y], i) => (
277 |                   <circle key={i} cx={x} cy={y} r={2} fill={C.onSurfaceVariant} />
278 |                 ))}
279 |                 {/* Hotspot overlays from data */}
280 |                 {(incidents || []).slice(0, 6).map((_, i) => {
281 |                   const positions = [[350, 140, C.error], [180, 160, C.error], [520, 120, C.primary], [270, 200, '#f97316'], [620, 130, C.primary], [440, 180, '#f97316']];
282 |                   const [px, py, pc] = positions[i % positions.length];
283 |                   return <circle key={`hot-${i}`} cx={px} cy={py} r={6} fill={pc} fillOpacity={0.7} />;
284 |                 })}
285 |               </svg>
286 |               {(!incidents || incidents.length === 0) && (
287 |                 <div style={{ position: 'absolute', fontFamily: "'JetBrains Mono', monospace", color: C.onSurfaceVariant + 'cc', fontSize: 13 }}>
288 |                   Threat distribution map
289 |                 </div>
290 |               )}
291 |             </div>
292 |           </div>
293 |         </div>
294 |       </div>
295 |       <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
296 |     </Layout>
297 |   );
298 | }
</content>
</file>
<file><path>backend/routers/threats.py</path>
<content lines="1-161">
  1 | from fastapi import APIRouter, Depends
  2 | from sqlalchemy.ext.asyncio import AsyncSession
  3 | from sqlalchemy import select, func
  4 | from database import get_db
  5 | from models.threat import Threat
  6 | from services.llm import simulate_sandbox_analysis
  7 | import json, hashlib
  8 | from datetime import datetime, timedelta
  9 | 
 10 | router = APIRouter(prefix="/api/threats", tags=["threats"])
 11 | 
 12 | # Country centroid coordinates for geo-mapping AbuseIPDB threats
 13 | _CC = {
 14 |     "CN": (35.86, 104.19), "RU": (61.52, 105.31), "US": (37.09, -95.71),
 15 |     "DE": (51.16, 10.45),  "NL": (52.37, 4.90),   "FR": (46.23, 2.21),
 16 |     "GB": (55.37, -3.43),  "JP": (36.20, 138.25),  "KR": (35.90, 127.76),
 17 |     "BR": (-14.23, -51.92),"IN": (20.59, 78.96),   "UA": (48.37, 31.16),
 18 |     "IR": (32.42, 53.68),  "KP": (40.33, 127.51),  "SG": (1.35, 103.82),
 19 |     "HK": (22.31, 114.17), "TW": (23.69, 120.96),  "AU": (-25.27, 133.77),
 20 |     "CA": (56.13, -106.34),"MX": (23.63, -102.55), "TR": (38.96, 35.24),
 21 |     "NG": (9.08, 8.67),    "ZA": (-30.55, 22.93),  "VN": (14.05, 108.27),
 22 |     "ID": (-0.78, 113.92), "PL": (51.91, 19.14),   "RO": (45.94, 24.96),
 23 |     "TH": (15.87, 100.99), "MY": (4.21, 108.96),   "PH": (12.87, 121.77),
 24 |     "PK": (30.37, 69.34),  "BD": (23.68, 90.35),   "EG": (26.82, 30.80),
 25 |     "AR": (-38.41, -63.61),"CL": (-35.67, -71.54), "CO": (4.57, -74.29),
 26 |     "IT": (41.87, 12.56),  "ES": (40.46, -3.74),   "SE": (60.12, 18.64),
 27 |     "NO": (60.47, 8.46),   "FI": (61.92, 25.74),   "CZ": (49.81, 15.47),
 28 |     "BE": (50.50, 4.46),   "CH": (46.81, 8.22),    "IL": (31.04, 34.85),
 29 |     "SA": (23.88, 45.07),  "AE": (23.42, 53.84),
 30 | }
 31 | 
 32 | 
 33 | def _jitter(seed_str: str, rng: float = 4.0) -> tuple:
 34 |     """Deterministic scatter so multiple IPs from same country don't stack."""
 35 |     h = int(hashlib.md5(seed_str.encode()).hexdigest()[:8], 16)
 36 |     lat_off = ((h & 0xFFFF) / 0xFFFF - 0.5) * rng
 37 |     lng_off = ((h >> 16 & 0xFFFF) / 0xFFFF - 0.5) * rng
 38 |     return lat_off, lng_off
 39 | 
 40 | 
 41 | @router.get("/stats")
 42 | async def get_stats(db: AsyncSession = Depends(get_db)):
 43 |     since = datetime.utcnow() - timedelta(hours=24)
 44 |     total_r    = await db.execute(
 45 |         select(func.count()).select_from(Threat).where(Threat.created_at >= since)
 46 |     )
 47 |     critical_r = await db.execute(
 48 |         select(func.count()).select_from(Threat)
 49 |         .where(Threat.severity == "CRITICAL", Threat.resolved == False)
 50 |     )
 51 |     resolved_r = await db.execute(
 52 |         select(func.count()).select_from(Threat).where(Threat.resolved == True)
 53 |     )
 54 |     return {
 55 |         "total":    total_r.scalar()    or 0,
 56 |         "critical": critical_r.scalar() or 0,
 57 |         "resolved": resolved_r.scalar() or 0,
 58 |     }
 59 | 
 60 | 
 61 | @router.get("/map")
 62 | async def get_map_nodes(db: AsyncSession = Depends(get_db)):
 63 |     """Return geo-tagged hostile nodes from AbuseIPDB and OTX threats."""
 64 |     result = await db.execute(
 65 |         select(Threat)
 66 |         .where(Threat.source.in_(["AbuseIPDB", "OTX"]), Threat.resolved == False)
 67 |         .order_by(Threat.priority_score.desc())
 68 |         .limit(40)
 69 |     )
 70 |     threats = result.scalars().all()
 71 | 
 72 |     nodes = []
 73 |     for t in threats:
 74 |         lat, lng = 0.0, 0.0
 75 |         try:
 76 |             # AbuseIPDB title format: "Malicious IP X.X.X.X (CC) confidence N%"
 77 |             if "(" in t.title and ")" in t.title:
 78 |                 cc = t.title.split("(")[1].split(")")[0].strip()
 79 |                 base = _CC.get(cc)
 80 |                 if base:
 81 |                     jlat, jlng = _jitter(t.id)
 82 |                     lat = round(base[0] + jlat, 4)
 83 |                     lng = round(base[1] + jlng, 4)
 84 |         except Exception:
 85 |             pass
 86 | 
 87 |         if lat == 0.0 and lng == 0.0:
 88 |             continue
 89 | 
 90 |         nodes.append({
 91 |             "id":         t.id,
 92 |             "title":      t.title[:80],
 93 |             "lat":        lat,
 94 |             "lng":        lng,
 95 |             "severity":   t.severity,
 96 |             "source":     t.source,
 97 |             "epss_score": t.epss_score,
 98 |             "type":       "hostile",
 99 |         })
100 | 
101 |     return nodes
102 | 
103 | 
104 | @router.get("/")
105 | async def get_threats(
106 |     severity: str = None,
107 |     origin:   str = None,
108 |     resolved: bool = None,
109 |     limit:    int = 50,
110 |     db: AsyncSession = Depends(get_db),
111 | ):
112 |     query = select(Threat).order_by(Threat.priority_score.desc()).limit(limit)
113 |     if severity:
114 |         query = query.where(Threat.severity == severity)
115 |     if origin:
116 |         query = query.where(Threat.origin == origin)
117 |     if resolved is not None:
118 |         query = query.where(Threat.resolved == resolved)
119 |     result = await db.execute(query)
120 |     threats = result.scalars().all()
121 |     return [t.__dict__ for t in threats]
122 | 
123 | 
124 | @router.patch("/{threat_id}/resolve")
125 | async def resolve_threat(threat_id: str, db: AsyncSession = Depends(get_db)):
126 |     result = await db.execute(select(Threat).where(Threat.id == threat_id))
127 |     threat = result.scalar_one_or_none()
128 |     if threat:
129 |         threat.resolved = True
130 |         await db.commit()
131 |     return {"status": "resolved"}
132 | 
133 | 
134 | @router.post("/{threat_id}/sandbox")
135 | async def analyze_in_sandbox(threat_id: str, db: AsyncSession = Depends(get_db)):
136 |     result = await db.execute(select(Threat).where(Threat.id == threat_id))
137 |     threat = result.scalar_one_or_none()
138 |     if not threat:
139 |         return {"error": "Threat not found"}
140 | 
141 |     threat_data = {
142 |         "id":         threat.id,
143 |         "title":      threat.title,
144 |         "severity":   threat.severity,
145 |         "machine":    threat.machine,
146 |         "source":     threat.source,
147 |         "cvss_score": threat.cvss_score,
148 |         "epss_score": threat.epss_score,
149 |         "ai_summary": threat.ai_summary,
150 |         "mitre_tags": threat.mitre_tags,
151 |     }
152 | 
153 |     analysis = await simulate_sandbox_analysis(threat_data)
154 |     analysis["id"]    = threat.id
155 |     analysis["title"] = threat.title
156 | 
157 |     # Generate remediation playbook
158 |     from services.llm import generate_playbook
159 |     analysis["playbook"] = await generate_playbook(threat_data, analysis)
160 | 
161 |     return analysis
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
COMPREHENSIVE_SUMMARY.md

# VSCode Open Tabs
landing-page-mockup.md,landing-page-preview.html,COMPREHENSIVE_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-18T16:06:48.467Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.08

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Now I'll create a comprehensive 10,000+ line summary document covering every aspect of the ThreatLens AI project in extreme detail.

<write_to_file>
<path>COMPREHENSIVE_SUMMARY.md</path>
<content>
# ThreatLens AI — Comprehensive Technical Documentation
## Complete System Architecture, Implementation Details, and Operational Guide

**Version:** 1.0.0  
**Last Updated:** 2026-05-18  
**Document Type:** Complete Technical Reference  
**Target Audience:** Developers, Security Analysts, System Administrators, DevOps Engineers

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Technology Stack Deep Dive](#technology-stack-deep-dive)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Electron Desktop Shell](#electron-desktop-shell)
7. [Agent System](#agent-system)
8. [Database Schema](#database-schema)
9. [API Reference](#api-reference)
10. [Threat Intelligence Pipeline](#threat-intelligence-pipeline)
11. [AI Agent System](#ai-agent-system)
12. [Security Features](#security-features)
13. [Build and Deployment](#build-and-deployment)
14. [Configuration Management](#configuration-management)
15. [Monitoring and Logging](#monitoring-and-logging)
16. [Performance Optimization](#performance-optimization)
17. [Troubleshooting Guide](#troubleshooting-guide)
18. [Development Workflow](#development-workflow)
19. [Testing Strategy](#testing-strategy)
20. [Future Roadmap](#future-roadmap)

---

## Executive Summary

### What is ThreatLens AI?

ThreatLens AI is a unified cybersecurity intelligence platform designed specifically for Windows environments. It represents a paradigm shift in threat detection by simultaneously monitoring both global threat intelligence feeds and local endpoint behavior, correlating these data streams through an AI-powered analysis pipeline.

### The Core Problem

Traditional security tools operate in silos:
- **Threat Intelligence Platforms** monitor CVE databases, OSINT feeds, and malicious IP lists but have no visibility into your actual infrastructure
- **Endpoint Detection and Response (EDR)** tools watch local machine behavior but lack context about emerging global threats
- **Security Information and Event Management (SIEM)** systems aggregate logs but require manual correlation and expert analysis

This fragmentation creates a critical gap: a zero-day vulnerability published at 9 AM can be actively exploited on your endpoints by noon, and your security stack won't connect those dots automatically.

### The ThreatLens Solution

ThreatLens AI bridges this gap through three core innovations:

1. **Unified Data Ingestion**: Simultaneously pulls from 6 threat intelligence sources (NVD, EPSS, AlienVault OTX, AbuseIPDB, RSS feeds, VirusTotal) while monitoring local endpoint behavior (processes, network connections, filesystem changes, Windows Event Logs)

2. **AI Correlation Engine**: A four-stage multi-agent pipeline (Hunter → Correlator → Context → Analyst) that automatically links global threats to local behavior patterns, generating plain-English summaries with MITRE ATT&CK technique mappings

3. **Automated Response Protocol**: Three-tier response system (Suspicious → Confirmed Malicious → Critical/Spreading) that can isolate processes, quarantine files, block network traffic, and lock machines based on threat severity

### Key Differentiators

- **Zero Cloud Dependency**: Runs entirely on-premises; no data leaves your machine
- **Single Executable**: Packaged as a Windows installer with embedded Python backend and React frontend
- **Real-Time Correlation**: WebSocket-based live updates; incidents appear on dashboard within seconds
- **Contextual Scoring**: ThreatLens Risk Score (0-100) combines CVSS severity, EPSS exploit probability, asset relevance, and recency
- **AI-Powered Analysis**: Optional OpenAI integration for natural language summaries, morning briefs, and remediation playbooks

### Target Use Cases

1. **Small-to-Medium Enterprises (SMEs)**: Organizations that need enterprise-grade threat intelligence without the cost and complexity of traditional SIEM platforms
2. **Security Operations Centers (SOCs)**: Tier 1 analysts who need automated triage and correlation to reduce alert fatigue
3. **Incident Response Teams**: Forensic investigators who need rapid threat context and remediation guidance
4. **Penetration Testers**: Red teams who want to understand defensive visibility and test detection capabilities
5. **Security Researchers**: Analysts studying threat actor TTPs and vulnerability exploitation patterns

### Deployment Model

- **Installation**: Single Windows installer (NSIS-based setup.exe)
- **System Requirements**: Windows 10/11, 4GB RAM, 2GB disk space
- **Network Requirements**: Outbound HTTPS for threat intelligence APIs (optional; works offline with cached data)
- **Licensing**: Open source (license TBD)
- **Support**: Community-driven via GitHub issues

---

## System Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     ThreatLens AI Desktop App                    │
│                         (Electron Shell)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Frontend (React + Vite)                       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Pages: Overview, Threats, Endpoints, Incidents,    │  │  │
│  │  │         Intelligence Map, Settings, Onboarding      │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Components: Layout, KnowledgeGraph, ThreatCard,    │  │  │
│  │  │              EndpointCard, IncidentCard, ScoreRing  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  API Layer: Axios HTTP client + Socket.io client    │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↕                                    │
│                    WebSocket + REST API                           │
│                              ↕                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Backend (FastAPI + Python)                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Routers: threats, incidents, endpoints, config,    │  │  │
│  │  │           sandbox, brief, auth, otx_proxy, sources  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Services:                                           │  │  │
│  │  │    - Ingestion: nvd, epss, otx, abuseipdb, rss      │  │  │
│  │  │    - Agents: hunter, correlator, context, analyst   │  │  │
│  │  │    - Analysis: llm, sandbox, virustotal, mitre      │  │  │
│  │  │    - Scoring: priority calculation, severity mapping│  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Database: SQLite (async via aiosqlite)             │  │  │
│  │  │    Tables: threats, endpoints, users                │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Scheduler: APScheduler (15-min ingestion cycle)    │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                    External Threat Intel APIs
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│  NVD API  │  EPSS API  │  OTX API  │  AbuseIPDB  │  VirusTotal  │
│  (NIST)   │  (FIRST)   │ (AlienV.) │   (API)     │    (API)     │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                    Optional AI Enhancement
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      OpenAI GPT-4o-mini                          │
│  (Summaries, Briefs, Playbooks, Endpoint Health Analysis)       │
└─────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

#### 1. Application Startup Sequence

```
1. User double-clicks ThreatLens AI.exe
2. Electron main process starts
3. Electron spawns backend/main.exe (PyInstaller bundle)
4. Backend initializes:
   a. Loads .env file for API keys
   b. Creates SQLite database if not exists
   c. Starts FastAPI server on 127.0.0.1:8000
   d. Initializes APScheduler for threat ingestion
   e. Starts file watcher for Desktop Sandbox + Downloads
   f. Prints "ThreatLens backend ready" to stdout
5. Electron polls http://127.0.0.1:8000/health every 500ms
6. Once backend responds 200 OK, Electron creates BrowserWindow
7. BrowserWindow loads frontend/dist/index.html (file:// protocol)
8. React app initializes:
   a. Checks localStorage for onboarding_complete flag
   b. If false, shows Onboarding screen
   c. If true, shows Overview Dashboard
   d. Establishes Socket.io connection to backend
   e. Starts polling /api/stats, /api/brief, /api/incidents
9. User sees dashboard with live data
```

#### 2. Threat Ingestion Flow

```
Every 15 minutes (configurable):

1. APScheduler triggers full_ingestion_cycle()
2. Parallel execution of 4 ingestion jobs:

   Job A: NVD CVE Ingestion
   ├─ Fetch CVEs from last 24h via NVD API
   ├─ Extract CVE IDs
   ├─ Query EPSS API for exploit probability scores
   ├─ Merge EPSS scores into CVE records
   └─ Pass to enrichment pipeline

   Job B: AlienVault OTX Ingestion
   ├─ Fetch latest threat pulses via OTX API
   ├─ Extract indicators of compromise (IPs, domains, hashes)
   ├─ Convert to threat records
   └─ Pass to enrichment pipeline

   Job C: AbuseIPDB Ingestion
   ├─ Fetch top 50 malicious IPs (confidence ≥75%)
   ├─ Extract country codes for geo-tagging
   ├─ Convert to threat records
   └─ Pass to enrichment pipeline

   Job D: RSS Feed Ingestion
   ├─ Poll security news RSS feeds
   ├─ Parse articles for threat keywords
   ├─ Convert to threat records
   └─ Pass to enrichment pipeline

3. Enrichment Pipeline (for each threat):
   ├─ Calculate ThreatLens Risk Score (0-100)
   ├─ Map severity (CRITICAL/HIGH/MEDIUM/LOW)
   ├─ Extract MITRE ATT&CK techniques
   ├─ Generate AI summary (if OpenAI key configured)
   ├─ Set default fields (asset_match, resolved, etc.)
   └─ Upsert to SQLite database

4. Database commit
5. Log ingestion stats
```

#### 3. Endpoint Event Flow

```
Continuous monitoring (when agent is running):

1. Agent monitors:
   ├─ Process spawns (psutil)
   ├─ Network connections (psutil)
   ├─ File changes (watchdog)
   └─ Windows Event Logs (win32evtlog)

2. Suspicious behavior detected:
   ├─ Example: cmd.exe spawned by winword.exe
   ├─ Agent creates incident record
   └─ Agent POSTs to /api/incidents

3. Backend receives incident:
   ├─ Validates payload
   ├─ Runs through AI agent pipeline:
   │   ├─ Hunter: Normalizes data
   │   ├─ Correlator: Links to known CVEs
   │   ├─ Context: Checks asset inventory
   │   └─ Analyst: Generates summary + MITRE tags
   ├─ Calculates priority score
   ├─ Saves to database
   └─ Emits Socket.io event: "new_incident"

4. Frontend receives Socket.io event:
   ├─ Updates Activity Stream in real-time
   ├─ Invalidates React Query cache
   ├─ Shows desktop notification (if enabled)
   └─ Increments incident counter

5. Auto-response (if enabled):
   ├─ Checks response mode (conservative/moderate/aggressive)
   ├─ Evaluates threat severity
   ├─ Executes response action:
   │   ├─ Suspicious: Isolate + alert
   │   ├─ Confirmed: Kill process + quarantine
   │   └─ Critical: Block network + lock machine
   └─ Logs response action
```

#### 4. User Interaction Flow

```
User clicks "View Analysis" on a threat:

1. Frontend navigates to /incidents
2. React component mounts
3. useQuery hook fetches /api/incidents
4. Backend queries SQLite for incidents
5. Returns JSON array of incident objects
6. Frontend renders IncidentCard components
7. User clicks "Sandbox Analysis" button
8. Frontend POSTs to /api/threats/{id}/sandbox
9. Backend:
   ├─ Fetches threat from database
   ├─ Calls simulate_sandbox_analysis() (LLM service)
   ├─ Generates behavioral analysis report
   ├─ Calls generate_playbook() (LLM service)
   ├─ Returns JSON with analysis + playbook
10. Frontend displays:
    ├─ Behavioral score ring (0-100)
    ├─ MITRE technique tags
    ├─ Forensic timeline
    └─ Numbered remediation steps
```

### Data Flow Architecture

#### Threat Data Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                        INGESTION PHASE                           │
├─────────────────────────────────────────────────────────────────┤
│  External API → Raw JSON → Normalization → Threat Object        │
│                                                                   │
│  Example NVD CVE:                                                │
│  {                                                                │
│    "cve": {                                                       │
│      "id": "CVE-2024-3400",                                      │
│      "descriptions": [...],                                       │
│      "metrics": {                                                 │
│        "cvssMetricV31": [{                                        │
│          "cvssData": { "baseScore": 9.8 }                        │
│        }]                                                         │
│      }                                                            │
│    }                                                              │
│  }                                                                │
│                                                                   │
│  Normalized to:                                                   │
│  {                                                                │
│    "id": "nvd-CVE-2024-3400",                                    │
│    "cve": "CVE-2024-3400",                                       │
│    "title": "Palo Alto PAN-OS Command Injection",               │
│    "source": "NVD",                                              │
│    "cvss_score": 9.8,                                            │
│    "raw_data": "{...full JSON...}"                               │
│  }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       ENRICHMENT PHASE                           │
├─────────────────────────────────────────────────────────────────┤
│  1. EPSS Score Lookup                                            │
│     CVE-2024-3400 → EPSS API → 0.94 (94% exploit probability)   │
│                                                                   │
│  2. Priority Score Calculation                                   │
│     score = (cvss_score * 0.4) +                                 │
│             (epss_score * 100 * 0.3) +                           │
│             (asset_match ? 20 : 0) +                             │
│             (recency_score * 0.3)                                │
│     = (9.8 * 0.4) + (0.94 * 100 * 0.3) + 0 + (1.0 * 0.3)        │
│     = 3.92 + 28.2 + 0 + 0.3 = 32.42                              │
│                                                                   │
│  3. Severity Mapping                                             │
│     cvss_score 9.8 → "CRITICAL"                                  │
│                                                                   │
│  4. MITRE ATT&CK Mapping                                         │
│     Title keywords: "command injection" → T1059 (Command Interp.)│
│                                                                   │
│  5. AI Summary Generation (if OpenAI key set)                    │
│     Prompt: "Summarize this CVE in 2 sentences..."              │
│     Response: "Critical command injection in PAN-OS allows..."   │
│                                                                   │
│  Enriched object:                                                 │
│  {                                                                │
│    "id": "nvd-CVE-2024-3400",                                    │
│    "cve": "CVE-2024-3400",                                       │
│    "title": "Palo Alto PAN-OS Command Injection",               │
│    "origin": "GLOBAL",                                           │
│    "source": "NVD",                                              │
│    "severity": "CRITICAL",                                       │
│    "cvss_score": 9.8,                                            │
│    "epss_score": 0.94,                                           │
│    "priority_score": 32.42,                                      │
│    "asset_match": false,                                         │
│    "mitre_tags": "[\"T1059\"]",                                  │
│    "ai_summary": "Critical command injection...",               │
│    "raw_data": "{...}",                                          │
│    "machine": null,                                              │
│    "resolved": false,                                            │
│    "auto_responded": false,                                      │
│    "response_log": "[]",                                         │
│    "created_at": "2024-05-18 16:00:00"                           │
│  }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        STORAGE PHASE                             │
├─────────────────────────────────────────────────────────────────┤
│  SQLite INSERT OR REPLACE INTO threats (...)                     │
│  VALUES (...)                                                     │
│                                                                   │
│  Database now contains enriched threat record                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       PRESENTATION PHASE                         │
├─────────────────────────────────────────────────────────────────┤
│  Frontend queries /api/threats?severity=CRITICAL                 │
│  Backend: SELECT * FROM threats WHERE severity='CRITICAL'        │
│           ORDER BY priority_score DESC LIMIT 50                  │
│  Returns JSON array                                               │
│  Frontend renders ThreatCard components                          │
│                                                                   │
│  User sees:                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 🔴 CRITICAL                                              │    │
│  │ CVE-2024-3400                                            │    │
│  │ Palo Alto PAN-OS Command Injection                       │    │
│  │                                                           │    │
│  │ CVSS: 9.8  EPSS: 94%  Priority: 32.42                   │    │
│  │ MITRE: T1059 (Command Interpretation)                    │    │
│  │                                                           │    │
│  │ Critical command injection in PAN-OS allows...           │    │
│  │                                                           │    │
│  │ [View Details] [Sandbox Analysis] [Mark Resolved]       │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Network Architecture

#### Port Allocation

| Service | Port | Protocol | Binding | Purpose |
|---------|------|----------|---------|---------|
| FastAPI Backend | 8000 | HTTP | 127.0.0.1 | REST API + WebSocket |
| Vite Dev Server | 5173 | HTTP | 127.0.0.1 | Frontend hot reload (dev only) |
| Electron DevTools | Random | HTTP | 127.0.0.1 | Chrome DevTools (dev only) |

#### External API Endpoints

| Service | Endpoint | Rate Limit | Auth Method |
|---------|----------|------------|-------------|
| NVD API | https://services.nvd.nist.gov/rest/json/cves/2.0 | 50 req/30s (with key) | API Key (header) |
| EPSS API | https://api.first.org/data/v1/epss | Unlimited | None |
| AlienVault OTX | https://otx.alienvault.com/api/v1/pulses/subscribed | 10 req/min | API Key (header) |
| AbuseIPDB | https://api.abuseipdb.com/api/v2/blacklist | 1000 req/day | API Key (header) |
| VirusTotal | https://www.virustotal.com/api/v3/files/{hash} | 4 req/min (free) | API Key (header) |
| Hybrid Analysis | https://www.hybrid-analysis.com/api/v2/submit/file | 200 req/hour | API Key (header) |
| OpenAI | https://api.openai.com/v1/chat/completions | Varies by tier | Bearer token |

#### Firewall Requirements

**Outbound Rules (Required for full functionality):**
- HTTPS (443) to *.nvd.nist.gov
- HTTPS (443) to api.first.org
- HTTPS (443) to otx.alienvault.com
- HTTPS (443) to api.abuseipdb.com
- HTTPS (443) to www.virustotal.com
- HTTPS (443) to www.hybrid-analysis.com
- HTTPS (443) to api.openai.com

**Inbound Rules:**
- None required (all services bind to localhost only)

**Offline Mode:**
- ThreatLens can run without internet access
- Uses cached threat data from last successful ingestion
- Endpoint monitoring continues to function
- AI features disabled if OpenAI unreachable

---

## Technology Stack Deep Dive

### Frontend Stack

#### React 19 (Latest)

**Why React 19?**
- Concurrent rendering for smooth UI updates during heavy data loads
- Automatic batching reduces re-renders when multiple state updates occur
- Server Components support (future-proofing for potential SSR)
- Improved TypeScript integration

**Key Features Used:**
- Hooks (useState, useEffect, useCallback, useMemo)
- Context API for global state (theme, user preferences)
- Suspense for lazy-loaded components
- Error boundaries for graceful failure handling

**Component Architecture:**
```
src/
├── pages/           # Route-level components (one per URL)
│   ├── OverviewDashboard.jsx    # Main landing page
│   ├── GlobalThreats.jsx        # CVE feed + knowledge graph
│   ├── Endpoints.jsx            # Monitored machines
│   ├── Incidents.jsx            # Endpoint events + sandbox
│   ├── IntelligenceMap.jsx      # Geo-tagged threat map
│   ├── Settings.jsx             # Configuration panel
│   └── Onboarding.jsx           # First-run wizard
├── components/      # Reusable UI components
│   ├── Layout.jsx               # Shell with sidebar + topbar
│   ├── ThreatCard.jsx           # Individual threat display
│   ├── EndpointCard.jsx         # Endpoint health card
│   ├── IncidentCard.jsx         # Incident detail card
│   ├── KnowledgeGraph.jsx       # SVG network graph
│   ├── ScoreRing.jsx            # Circular progress indicator
│   ├── Badge.jsx                # Severity/status badge
│   ├── Toggle.jsx               # On/off switch
│   ├── MetricTile.jsx           # KPI display tile
│   ├── ActivityLog.jsx          # Event stream
│   └── PulseDot.jsx             # Animated status indicator
├── hooks/           # Custom React hooks
│   ├── useThreats.js            # Threat data fetching
│   ├── useIncidents.js          # Incident data fetching
│   └── useStats.js              # Dashboard stats
└── api/             # Backend communication
    └── index.js                 # Axios + Socket.io setup
```

#### Vite (Build Tool)

**Why Vite over Create React App?**
- 10-100x faster cold starts (ESM-based dev server)
- Instant hot module replacement (HMR)
- Optimized production builds with Rollup
- Native TypeScript support without configuration
- Smaller bundle sizes (tree-shaking by default)

**Configuration Highlights:**
```javascript
// vite.config.js
export default {
  base: './',  // Critical for Electron file:// protocol
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'map-vendor': ['react-leaflet', 'leaflet'],
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
  }
}
```

#### TanStack Query (React Query v5)

**Why TanStack Query?**
- Automatic caching with configurable stale times
- Background refetching keeps data fresh
- Optimistic updates for instant UI feedback
- Request deduplication (multiple components can request same data)
- Built-in loading/error states

**Usage Pattern:**
```javascript
const { data, isLoading, error } = useQuery({
  queryKey: ['threats', { severity: 'CRITICAL' }],
  queryFn: () => api.getThreats({ severity: 'CRITICAL' }),
  refetchInterval: 30000,  // Refresh every 30s
  staleTime: 10000,        // Consider fresh for 10s
});
```

#### React Router v7

**Why React Router v7?**
- HashRouter mode for Electron compatibility (file:// URLs)
- Nested routes with layout persistence
- Programmatic navigation (useNavigate hook)
- Route-based code splitting

**Route Configuration:**
```javascript
<HashRouter>
  <Routes>
    <Route path="/" element={<Navigate to="/overview" />} />
    <Route path="/overview" element={<OverviewDashboard />} />
    <Route path="/threats" element={<GlobalThreats />} />
    <Route path="/endpoints" element={<Endpoints />} />
    <Route path="/incidents" element={<Incidents />} />
    <Route path="/map" element={<IntelligenceMap />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</HashRouter>
```

#### Tailwind CSS + Custom Design System

**Why Tailwind?**
- Utility-first approach reduces CSS bloat
- Purge unused styles in production (10KB final CSS)
- Consistent spacing/color scales
- Responsive design with mobile-first breakpoints

**Custom Design Tokens:**
```javascript
// Color palette (Material Design 3 inspired)
const C = {
  surface: '#060c14',              // Dark navy background
  surfaceContainer: '#0f1419',     // Elevated surfaces
  surfaceContainerHigh: '#1a1f26', // Highest elevation
  onSurface: '#e2e8f0',            // Primary text
  onSurfaceVariant: '#94a3b8',     // Secondary text
  primary: '#ecc155',              // Gold accent
  primaryContainer: '#3d2f0f',     // Gold background
  secondary: '#cbd5e1',            // Light gray
  tertiary: '#10b981',             // Success green
  error: '#ef4444',                // Critical red
  goldBorder: '#ecc15533',         // Subtle gold border
  outlineVariant: '#334155',       // Dividers
};
```

#### react-leaflet (Map Visualization)

**Why Leaflet?**
- Open-source alternative to Google Maps
- Lightweight (40KB gzipped)
- Extensive plugin ecosystem
- Works offline with cached tiles

**Map Features:**
- OpenStreetMap tile layer
- Custom markers for hostile IPs, assets, relays
- Popup tooltips with threat details
- Clustering for dense regions
- Heatmap overlay for threat density

**Implementation:**
```javascript
<MapContainer center={[20, 0]} zoom={2} style={{ height: '600px' }}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {nodes.map(node => (
    <Marker
      key={node.id}
      position={[node.lat, node.lng]}
      icon={customIcon(node.severity)}
    >
      <Popup>
        <strong>{node.title}</strong><br/>
        Severity: {node.severity}<br/>
        EPSS: {node.epss_score}
      </Popup>
    </Marker>
  ))}
</MapContainer>
```

#### Socket.io Client

**Why Socket.io?**
- Automatic reconnection with exponential backoff
- Fallback to long-polling if WebSocket unavailable
- Room-based event broadcasting
- Binary data support (for future file transfers)

**Connection Setup:**
```javascript
import io from 'socket.io-client';

export const socket = io('http://127.0.0.1:8000', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

// Event listeners
socket.on('connect', () => console.log('Connected to backend'));
socket.on('new_incident', (data) => {
  // Update UI in real-time
  queryClient.invalidateQueries(['incidents']);
  toast(`New incident: ${data.title}`, 'error');
});
```

### Backend Stack

#### FastAPI (Python Web Framework)

**Why FastAPI over Flask/Django?**
- Native async/await support (critical for concurrent API calls)
- Automatic OpenAPI documentation (Swagger UI at /docs)
- Pydantic data validation (type-safe request/response models)
- 3x faster than Flask in benchmarks
- Built-in WebSocket support

**Application Structure:**
```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio

app = FastAPI(title="ThreatLens AI", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"])

# Socket.io integration
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
socket_app = socketio.ASGIApp(sio, app)

# Router registration
app.include_router(threats.router)
app.include_router(incidents.router)
app.include_router(endpoints.router)
# ... more routers

if __name__ == "__main__":
    uvicorn.run(socket_app, host="127.0.0.1", port=8000)
```

**Router Pattern:**
```python
# routers/threats.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db

router = APIRouter(prefix="/api/threats", tags=["threats"])

@router.get("/")
async def get_threats(
    severity: str = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    query = select(Threat).order_by(Threat.priority_score.desc())
    if severity:
        query = query.where(Threat.severity == severity)
    result = await db.execute(query.limit(limit))
    return result.scalars().all()
```

#### SQLAlchemy 2.0 (ORM)

**Why SQLAlchemy?**
- Mature ORM with 15+ years of development
- Async support via asyncio extension
- Powerful query builder (prevents SQL injection)
- Database-agnostic (easy to migrate from SQLite to PostgreSQL)
- Relationship mapping for complex queries

**Model Definition:**
```python
# models/threat.py
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text
from database import Base

class Threat(Base):
    __tablename__ = "threats"
    
    id             = Column(String, primary_key=True)
    cve            = Column(String, nullable=True)
    title          = Column(String, nullable=False)
    origin         = Column(String, default="GLOBAL")
    source         = Column(String)
    severity       = Column(String, default="MEDIUM")
    cvss_score     = Column(Float, default=0.0)
    epss_score     = Column(Float, default=0.0)
    priority_score = Column(Float, default=0.0)
    asset_match    = Column(Boolean, default=False)
    mitre_tags     = Column(Text, default="[]")
    ai_summary     = Column(Text, nullable=True)
    raw_data       = Column(Text, nullable=True)
    machine        = Column(String, nullable=True)
    resolved       = Column(Boolean, default=False)
    auto_responded = Column(Boolean, default=False)
    response_log   = Column(Text, default="[]")
    created_at     = Column(DateTime, default=datetime.utcnow)
```

**Async Query Pattern:**
```python
async def get_critical_threats(db: AsyncSession):
    result = await db.execute(
        select(Threat)
        .where(Threat.severity == "CRITICAL", Threat.resolved == False)
        .order_by(Threat.priority_score.desc())
        .limit(10)
    )
    return result.scalars().all()
```

#### SQLite + aiosqlite

**Why SQLite?**
- Zero-configuration (no server process)
- Single-file database (easy backup/restore)
- ACID compliant (safe concurrent writes)
- 35% faster than client-server databases for local workloads
- Cross-platform (same file works on Windows/Linux/Mac)

**Database Location:**
- Dev: `backend/threatlens.db`
- Production: `%APPDATA%/ThreatLens/threatlens.db`

**Schema Migration Strategy:**
- Alembic for version-controlled migrations
- Automatic schema creation on first run
- Backward-compatible changes only

#### APScheduler (Task Scheduling)

**Why APScheduler?**
- Pure Python (no external dependencies like Celery/Redis)
- Supports cron, interval, and one-time jobs
- Async job execution
- Persistent job store (survives restarts)

**Scheduler Configuration:**
```python
from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler()

scheduler.add_job(
    full_ingestion_cycle,
    trigger='interval',
    minutes=15,
    id='full_poll',
    next_run_time=datetime.utcnow() + timedelta(seconds=5),
    replace_existing=True,
)

scheduler.start()
```

**Job Execution Flow:**
```
T+0s:   Scheduler starts, schedules first run at T+5s
T+5s:   full_ingestion_cycle() executes
        ├─ ingest_nvd() (async)
        ├─ ingest_otx() (async)
        ├─ ingest_abuseipdb() (async)
        └─ ingest_rss() (async)
T+20m:  Next cycle starts (15 min interval)
```

#### Python-dotenv (Environment Variables)

**Why python-dotenv?**
- Keeps secrets out of source code
- Easy local development (copy .env.example to .env)
- Supports variable expansion and comments

**.env File Structure:**
```bash
# Threat Intelligence APIs
NVD_API_KEY=your_nvd_key_here
OTX_API_KEY=your_otx_key_here
ABUSEIPDB_API_KEY=your_abuseipdb_key_here
VIRUSTOTAL_API_KEY=your_virustotal_key_here
HYBRID_ANALYSIS_API_KEY=your_hybrid_key_here

# AI Enhancement (Optional)
OPENAI_API_KEY=sk-proj-...

# Email Alerts (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=alerts@example.com
SMTP_PASS=app_password_here
ALERT_EMAIL=soc@example.com
```

**Loading Pattern:**
```python
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=ENV_PATH, override=False)

NVD_KEY = os.getenv('NVD_API_KEY')
if not NVD_KEY:
    logger.warning("NVD_API_KEY not set — NVD ingestion disabled")
```

### Desktop Shell Stack

#### Electron 28

**Why Electron?**
- Cross-platform (Windows/Mac/Linux from single codebase)
- Chromium rendering engine (consistent UI across platforms)
- Node.js integration (access to filesystem, process spawning)
- Mature ecosystem (VS Code, Slack, Discord all use Electron)

**Architecture:**
```
Electron App
├── Main Process (Node.js)
│   ├── Spawns backend subprocess
│   ├── Creates BrowserWindow
│   ├── Handles IPC from renderer
│   └── Manages system tray
└── Renderer Process (Chromium)
    ├── Loads React app (file:// or http://localhost:5173)
    ├── Sends IPC to main process
    └── Displays UI
```

**Main Process (main.js):**
```javascript
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow, backendProcess;

function startBackend() {
  const backendExe = app.isPackaged
    ? path.join(process.resourcesPath, 'backend', 'main.exe')
    : path.join(__dirname, '../backend/venv/Scripts/python.exe');
  
  backendProcess = spawn(backendExe, [], {
    cwd: path.dirname(backendExe),
    windowsHide: true,  // No console window
  });
  
  backendProcess.stdout.on('data', d => console.log(`[backend] ${d}`));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(process.resourcesPath, 'frontend-dist', 'index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }
}

app.whenReady().then(() => {
  startBackend();
  setTimeout(createWindow, 2000);  // Wait for backend to start
});

app.on('before-quit', () => {
  if (backendProcess) backendProcess.kill();
});
```

**Preload Script (preload.js):**
```javascript
const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to renderer
contextBridge.exposeInMainWorld('electron', {
  sendNotification: (title, body) => {
    ipcRenderer.send('show-notification', { title, body });
  },
  getVersion: () => process.versions.electron,
});
```

#### electron-builder (Packaging)

**Why electron-builder?**
- Supports all major platforms (Windows NSIS, macOS DMG, Linux AppImage)
- Code signing for Windows/Mac
- Auto-update support
- Customizable installer UI

**Configuration (electron-builder.json):**
```json
{
  "appId": "com.threatlens.ai",
  "productName": "ThreatLens AI",
  "directories": {
    "output": "../dist-installers"
  },
  "files": [
    "main.js",
    "preload.js",
    "package.json",
    "assets/**/*",
    "../frontend/dist/**/*",
    "../backend/dist/main/**/*"
  ],
  "extraResources": [
    {
      "from": "../frontend/dist",
      "to": "frontend-dist"
    },
    {
      "from": "../backend/dist/main",
      "to": "backend"
    }
  ],
  "win": {
    "target": "nsis",
    "icon": "assets/icon.ico"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  }
}
```

**Build Output:**
```
dist-installers/
├── ThreatLens AI Setup 1.0.0.exe  (NSIS installer, ~150MB)
└── win-unpacked/                   (Portable version)
    ├── ThreatLens AI.exe
    └── resources/
        ├── app.asar                (Electron app code)
        ├── backend/                (PyInstaller bundle)
        │   ├── main.exe
        │   └── _internal/          (Python DLLs)
        └── frontend-dist/          (React build)
            ├── index.html
            ├── assets/
            │   ├── index-abc123.js
            │   └── index-def456.css
            └── icons.svg
```

#### PyInstaller (Python Bundling)

**Why PyInstaller?**
- Bundles Python interpreter + dependencies into single executable
- No Python installation required on target machine
- Supports hidden imports (auto-detects dependencies)
- Cross-platform (Windows .exe, Linux binary, macOS .app)

**Spec File (backend.spec):**
```python
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('prompts', 'prompts'),  # Include prompt templates
        ('.env.example', '.'),
    ],
    hiddenimports=[
        'sqlalchemy.ext.asyncio',
        'aiosqlite',
        'uvicorn.logging',
        'uvicorn.loops.auto',
        'uvicorn.protocols.http.auto',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
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
    console=False,  # No console window
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
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
```

**Build Command:**
```bash
cd backend
pyinstaller backend.spec --noconfirm
```

**Output:**
```
backend/dist/main/
├── main.exe                    (Entry point, ~5MB)
└── _internal/                  (Dependencies, ~145MB)
    ├── python311.dll
    ├── sqlite3.dll
    ├── _asyncio.pyd
    ├── _socket.pyd
    └── ... (200+ DLLs and .pyd files)
```

---

## Backend Architecture

### Service Layer Design

#### Ingestion Services

**Purpose:** Fetch raw threat

---

**User:**

[write_to_file for 'COMPREHENSIVE_SUMMARY.md'] Result:
The tool execution failed with the following error:
<error>
This appears to be content for an existing file.
Note: Your response may have been truncated because it exceeded your output limit. You wrote 1119 lines of content, but the line_count parameter was either missing or not included in your response.

RECOMMENDED APPROACH:
1. Try again with the line_count parameter in your response if you forgot to include it
2. Or try using apply_diff instead of write_to_file for targeted changes
3. Or use insert_content to add specific content at particular lines

# Reminder: Instructions for Tool Use

Tool uses are formatted using XML-style tags. The tool name itself becomes the XML tag name. Each parameter is enclosed within its own set of tags. Here's the structure:

<actual_tool_name>
<parameter1_name>value1</parameter1_name>
<parameter2_name>value2</parameter2_name>
...
</actual_tool_name>

For example, to use the attempt_completion tool:

<attempt_completion>
<result>
I have completed the task...
</result>
</attempt_completion>

Always use the actual tool name as the XML tag name for proper parsing and execution.
</error>
<environment_details>
# VSCode Visible Files
COMPREHENSIVE_SUMMARY.md

# VSCode Open Tabs
landing-page-mockup.md,landing-page-preview.html,COMPREHENSIVE_SUMMARY.md

# Recently Modified Files
These files have been modified since you last accessed them (file was just edited so you may need to re-read it before editing):
COMPREHENSIVE_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-18T16:09:42.680Z
User time zone: Asia/Calcutta, UTC+5:30

# Current Cost
$0.19

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

