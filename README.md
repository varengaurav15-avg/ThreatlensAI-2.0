# ThreatLens AI

**Unified cybersecurity intelligence platform for Windows — watches the internet and your machine simultaneously.**

ThreatLens AI is a desktop application that combines global threat intelligence (CVEs, OSINT, malicious IPs) with live endpoint monitoring into a single, AI-powered dashboard. It runs entirely on your machine — no cloud subscription, no data leaving your device.

---

## The Problem It Solves

Most security tools either watch the internet (CVE feeds, threat intel) or watch your machine (EDR, antivirus) — but not both at once. A vulnerability published this morning can be actively exploited on your machine by afternoon, and traditional tools won't connect those dots.

ThreatLens AI bridges that gap with a shared AI brain that correlates global threat data against live endpoint behaviour in real time.

---

## Core Capabilities

### Global Threat Intelligence
- **NVD CVE Ingestion** — Pulls new and modified CVEs from the National Vulnerability Database every 15 minutes via the NVD API
- **EPSS Exploit Scoring** — Every CVE gets a 0–1 probability score indicating how likely it is to be exploited in the wild (FIRST.org EPSS model)
- **AlienVault OTX Integration** — Live threat pulses and indicators of compromise from the Open Threat Exchange community
- **AbuseIPDB Monitoring** — Continuously ingests the top 50 malicious IP addresses with 75%+ confidence score, geo-tagged and plotted on the Intelligence Map
- **RSS Feed Aggregation** — Pulls threat intelligence from security news feeds as a supplementary signal

### Endpoint Protection
- **Process Monitor** — Tracks running processes and child spawns, flags suspicious behaviour like spawning a command prompt from an unexpected parent
- **Network & Log Collector** — Monitors outbound connections, flags known malicious IPs and unusual ports, reads Windows Event Logs for brute-force and privilege escalation attempts
- **Filesystem Watcher** — Monitors the Desktop Sandbox folder and Downloads for rapid file changes indicative of ransomware
- **VirusTotal Cross-check** — File hashes are checked against 70+ antivirus engines before sandbox detonation
- **Sandbox Detonation** — Suspicious files are analysed in an isolated environment; all behaviours captured without touching the live system

### AI Intelligence Layer
A four-stage multi-agent pipeline processes every threat — whether a global CVE or a live endpoint event:

1. **Hunter** — Ingests and normalises raw threat data from all sources
2. **Correlator** — Links live endpoint behaviour to published CVEs ("The behaviour on DESKTOP-X matches the exploitation pattern of CVE-2024-3400")
3. **Context** — Checks the threat against the local asset inventory and software stack
4. **Analyst** — Writes plain-English summaries and auto-tags MITRE ATT&CK techniques

### ThreatLens Risk Score
A single 0–100 priority number calculated from four inputs: CVSS base severity, EPSS exploit probability, whether your assets are affected, and how recent the threat is. One number tells you exactly how much to care.

### Auto-Response Protocol
Three-tier automatic response based on confirmed threat severity:
- **Suspicious** — Isolate process, alert analyst, wait for approval
- **Confirmed Malicious** — Kill process immediately, quarantine file, log everything
- **Critical / Spreading** — Block all outbound network, lock machine, notify SOC dashboard

---

## Dashboard Screens

### Overview Dashboard
Unified metrics across global and endpoint threats. Shows severity breakdown, a live activity stream fed by WebSocket events, top critical threats, AI morning brief, and quick-action buttons for endpoint isolation and threat analysis.

### Global Threats
Full CVE feed with EPSS scores, OTX live pulses, NVD ingestion stats, client-side search and filter, and one-click CSV export. Includes the **Threat Knowledge Graph** — a live SVG network that maps CVEs to their MITRE ATT&CK technique nodes, colour-coded by severity.

### Intelligence Map
Real interactive world map (react-leaflet) plotting live hostile IPs from AbuseIPDB and OTX, geo-tagged by country. Static anchor nodes mark known threat actor infrastructure. Filter by node type: hostile, asset, relay.

### My Endpoints
Live health card for every monitored machine showing real-time CPU, memory, OS, IP, status, and active incident count. AI-generated endpoint health summary when an OpenAI key is configured.

### Tactical Response (Incidents)
Live stream of endpoint events with severity filter, sandbox detonation panel with behavioural scoring ring, and a full forensic report that includes MITRE tags, indicators of compromise, and an **AI Remediation Playbook** — numbered, specific steps generated for each confirmed incident. Forensic timeline showing Initial Access → Payload Dropped → Lateral Movement phases.

### Settings
Five-tab configuration panel: monitoring toggles (process, network, filesystem, logs), auto-response mode (conservative / moderate / aggressive), AI features, notification preferences, and a dedicated API key manager for all six threat intelligence integrations (NVD, OTX, AbuseIPDB, VirusTotal, Hybrid Analysis, OpenAI). Keys are stored in the local `.env` file and never leave the machine.

---

## AI Morning Brief
Every day at 08:00 UTC, ThreatLens generates a 200-word briefing covering the top global threats from the past 24 hours, active endpoint incidents, patterns detected, and three immediate actions for the analyst. Powered by GPT-4o when an OpenAI key is configured; falls back to a structured rule-based summary otherwise.

---

## Real-Time Architecture
- **WebSocket (Socket.io)** — Dashboard updates instantly when an endpoint event is detected. No page refresh needed; incidents appear within seconds
- **15-minute ingestion cycle** — NVD, OTX, AbuseIPDB, and RSS feeds all polled on a rotating schedule
- **SQLite database** — All threats, incidents, and config stored locally in a single file
- **PyInstaller binary** — The Python FastAPI backend is packaged as a standalone `.exe`, no Python installation required on the target machine

---

## Technology Stack

| Layer | Technology |
|---|---|
| Desktop shell | Electron |
| Frontend | React 19, Vite, TanStack Query |
| Routing | React Router v7 (HashRouter for Electron) |
| Maps | react-leaflet + Leaflet |
| Real-time | Socket.io |
| Backend | FastAPI + SQLAlchemy (async) |
| Database | SQLite (via aiosqlite) |
| Scheduler | APScheduler |
| AI | OpenAI GPT-4o-mini (optional) |
| Packaging | electron-builder NSIS (Windows installer) |

---

## Threat Intelligence Integrations

| Source | What It Provides | Auth |
|---|---|---|
| NVD (NIST) | CVE records, CVSS scores | API key |
| EPSS (FIRST.org) | Exploit probability scores | None (free) |
| AlienVault OTX | Threat pulses, IoCs | API key |
| AbuseIPDB | Malicious IP blacklist | API key |
| VirusTotal | File/hash scanning | API key |
| Hybrid Analysis | Sandbox detonation | API key |
| OpenAI | AI summaries, briefs, playbooks | API key |

All API keys are entered once in the Settings screen and stored locally. A trigger fires a full ingestion cycle immediately on save so data starts flowing without waiting for the next scheduled poll.

---

## Installation

1. Download `ThreatLens-Setup.exe` from the Releases page
2. Run the installer — it installs the Electron app and unpacks the backend binary
3. On first launch, complete the onboarding flow and enter your API keys in Settings
4. The backend starts automatically on app launch and stops when the app closes

No additional software required. Python, Node.js, and all dependencies are bundled.

---

## Project Structure

```
threatlens-ai/
├── frontend/              # React + Vite app
│   └── src/
│       ├── pages/         # OverviewDashboard, GlobalThreats, Endpoints,
│       │                  # Incidents, IntelligenceMap, Settings, Onboarding
│       ├── components/    # Layout, KnowledgeGraph
│       └── api/           # Axios client + Socket.io instance
├── backend/               # FastAPI application
│   ├── routers/           # threats, incidents, endpoints, config,
│   │                      # sandbox, brief, otx_proxy, auth
│   ├── services/          # llm, sandbox, virustotal, scoring, mitre
│   │   ├── agents/        # hunter, correlator, context, analyst,
│   │   │                  # file_watcher, endpoint_stats
│   │   └── ingestion/     # nvd, epss, otx, abuseipdb, rss
│   └── models/            # SQLAlchemy ORM models (Threat, Endpoint, User)
└── rebuild.bat            # Windows build script
```

---

## Status

Currently in active development. Core threat intelligence pipeline, endpoint monitoring, and all six dashboard screens are functional. The installer packages everything into a single Windows `.exe` with no external dependencies.
