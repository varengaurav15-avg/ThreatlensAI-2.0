@echo off
setlocal enabledelayedexpansion
title ThreatLens AI — Build

echo.
echo ================================================
echo   ThreatLens AI — Windows Build Script
echo ================================================
echo.

:: ── STEP 1: Check prerequisites ─────────────────
echo [1/5] Checking prerequisites...

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found in PATH. Install Python 3.11+ and retry.
    pause & exit /b 1
)

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found in PATH. Install Node 18+ and retry.
    pause & exit /b 1
)

echo       OK — Python and Node found.
echo.

:: ── STEP 2: Python venv + backend deps ──────────
echo [2/5] Setting up Python venv and installing backend dependencies...

cd backend

if not exist venv (
    echo       Creating venv...
    python -m venv venv
)

call venv\Scripts\activate.bat

venv\Scripts\python.exe -m pip install --upgrade pip --quiet
venv\Scripts\python.exe -m pip install -r requirements.txt --quiet

if %errorlevel% neq 0 (
    echo ERROR: pip install failed.
    pause & exit /b 1
)

echo       OK — Backend dependencies installed.
echo.

:: ── STEP 3: PyInstaller — bundle backend ────────
echo [3/5] Bundling Python backend with PyInstaller...

if exist dist rmdir /s /q dist
if exist build rmdir /s /q build

venv\Scripts\python.exe -m PyInstaller backend.spec --noconfirm

if %errorlevel% neq 0 (
    echo ERROR: PyInstaller build failed.
    pause & exit /b 1
)

echo       OK — Backend bundled to backend\dist\main\
echo.
cd ..

:: ── STEP 4: Vite — build frontend ───────────────
echo [4/5] Building React frontend...

cd frontend

call npm install --silent
if %errorlevel% neq 0 (
    echo ERROR: npm install failed in frontend.
    pause & exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Vite build failed.
    pause & exit /b 1
)

echo       OK — Frontend built to frontend\dist\
echo.
cd ..

:: ── STEP 5: Electron-builder — create setup.exe ─
echo [5/5] Packaging with electron-builder (NSIS installer)...

cd electron

call npm install --silent
if %errorlevel% neq 0 (
    echo ERROR: npm install failed in electron.
    pause & exit /b 1
)

call npx electron-builder --win

if %errorlevel% neq 0 (
    echo ERROR: electron-builder failed.
    pause & exit /b 1
)

cd ..

echo.
echo ================================================
echo   BUILD COMPLETE
echo   Installer: dist-installers\ThreatLens AI Setup*.exe
echo ================================================
echo.
pause
