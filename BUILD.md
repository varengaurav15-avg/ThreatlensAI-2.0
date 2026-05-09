# ThreatLens AI — Build Guide

## Prerequisites (Windows)

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.11+ | https://python.org |
| Node.js | 18+ | https://nodejs.org |
| Git | any | https://git-scm.com |

> **Important:** During Python install, tick **"Add Python to PATH"**.

---

## Quickest way — run the batch script

```
build-win.bat
```

That's it. It runs all 5 steps below automatically and outputs the installer to `dist-installers/`.

---

## Manual step-by-step

### 1. Set up Python backend

```bat
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Bundle backend with PyInstaller

```bat
:: (still in backend/, venv active)
pyinstaller backend.spec --noconfirm
```

Output: `backend/dist/main/main.exe` (plus DLLs)

### 3. Build React frontend

```bat
cd ..\frontend
npm install
npm run build
```

Output: `frontend/dist/`

### 4. Build Electron installer

```bat
cd ..\electron
npm install
npx electron-builder --win --config electron-builder.json
```

Output: `dist-installers/ThreatLens AI Setup 1.0.0.exe`

---

## Output

```
dist-installers/
  ThreatLens AI Setup 1.0.0.exe   ← this is your setup.exe
```

Double-click to install. The NSIS installer lets the user choose an install directory, creates Start Menu + Desktop shortcuts, and launches the app after install.

---

## Dev mode (no build needed)

```bat
cd backend
venv\Scripts\activate
python main.py          # starts FastAPI on :8000

:: In a second terminal:
cd frontend
npm run dev             # Vite dev server on :5173

:: In a third terminal:
cd electron
npx electron .          # Electron window pointing at :5173
```

Or just: `npm run dev` from the root (uses concurrently).

---

## Architecture in the packaged app

```
ThreatLens AI.exe  (Electron shell)
  └── resources/
        ├── backend/          ← PyInstaller bundle (main.exe + DLLs)
        │     └── main.exe    ← FastAPI + uvicorn, listens on 127.0.0.1:8000
        └── frontend-dist/    ← Vite build (static HTML/JS/CSS)
              └── index.html  ← loaded by BrowserWindow via file://
```

Electron's `main.js` spawns `backend/main.exe` on startup, waits 2 s for it to bind, then opens the window. On quit, it kills the backend process.

---

## Bugs fixed in this release

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `frontend/vite.config.js` | Missing `base: './'` → assets used absolute paths, broke `file://` loading | Added `base: './'` |
| 2 | `electron/main.js` | Paths to backend and frontend used `../backend/venv/...` which don't exist in packaged app | Detect `app.isPackaged`, use `process.resourcesPath` in prod |
| 3 | `electron/main.js` | No error dialog if backend exe missing; no `windowsHide` | Added `dialog.showErrorBox` + `windowsHide: true` |
| 4 | `electron/main.js` | `mainWindow.show: false` missing → white flash on startup | Added `show: false` + `ready-to-show` handler |
| 5 | `electron-builder.json` | Target was `"dir"` (just a folder, no installer) | Changed to NSIS target for proper `setup.exe` |
| 6 | `electron-builder.json` | Output dir was inside `electron/` subfolder | Moved to `../dist-installers` at project root |
| 7 | `electron/package.json` | Missing `author` field (electron-builder hard requirement) | Added `author` |
| 8 | `backend/requirements.txt` | File was UTF-16 encoded (garbled) | Rewrote as clean UTF-8 |
| 9 | `frontend/src/api/index.js` | Socket.io had no reconnect config → permanent failure if backend slow | Added reconnect options |
| 10 | `frontend/src/api/index.js` | Raw axios with no timeout | Switched to axios instance with 10 s timeout |
