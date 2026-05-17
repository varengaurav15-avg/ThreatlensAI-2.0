@echo off
setlocal enabledelayedexpansion
title ThreatLens AI — Quick Rebuild

echo.
echo ================================================
echo   ThreatLens AI — Quick Rebuild
echo ================================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 ( echo ERROR: Node.js not found. & pause & exit /b 1 )

:: ── Step 0: Kill everything that could lock the folder
echo [0/3] Releasing locked files...

:: Kill known process names
taskkill /F /IM "ThreatLens AI.exe"  >nul 2>&1
taskkill /F /IM "ThreatLens.exe"     >nul 2>&1
taskkill /F /IM "electron.exe"       >nul 2>&1

:: Use PowerShell to kill ANY process whose exe is inside win-unpacked
powershell -NoProfile -Command ^
  "Get-Process | Where-Object { $_.Path -like '*win-unpacked*' } | Stop-Process -Force" ^
  >nul 2>&1

timeout /t 3 /nobreak >nul

:: Take ownership + grant full access to win-unpacked, then delete it
set UNPACKED=%~dp0dist-installers\win-unpacked
if exist "%UNPACKED%" (
    echo       Taking ownership of win-unpacked...
    takeown /F "%UNPACKED%" /R /D Y >nul 2>&1
    icacls "%UNPACKED%" /grant "%USERNAME%":F /T /C >nul 2>&1
    echo       Deleting win-unpacked...
    rmdir /s /q "%UNPACKED%" >nul 2>&1
    if exist "%UNPACKED%" (
        echo       rmdir failed — trying robocopy empty-folder trick...
        mkdir "%TEMP%\empty_dir_threatlens" >nul 2>&1
        robocopy "%TEMP%\empty_dir_threatlens" "%UNPACKED%" /MIR /NJH /NJS /NFL /NDL >nul 2>&1
        rmdir /s /q "%UNPACKED%" >nul 2>&1
        rmdir /s /q "%TEMP%\empty_dir_threatlens" >nul 2>&1
    )
)
echo       OK — folder cleared.
echo.

:: ── Step 1: Build React frontend
echo [1/3] Building React frontend (Vite)...
cd /d "%~dp0frontend"

if exist dist ( rmdir /s /q dist )

call npm install --silent
if %errorlevel% neq 0 ( echo ERROR: npm install failed. & pause & exit /b 1 )

call npm run build
if %errorlevel% neq 0 ( echo ERROR: Vite build failed. & pause & exit /b 1 )

echo       OK — frontend\dist\ ready.
echo.

:: ── Step 2: Electron deps
echo [2/3] Installing electron dependencies...
cd /d "%~dp0electron"
call npm install --silent
if %errorlevel% neq 0 ( echo ERROR: npm install failed. & pause & exit /b 1 )
echo       OK.
echo.

:: ── Step 3: Package
echo [3/3] Packaging installer...
call npx electron-builder --win --config electron-builder.json
if %errorlevel% neq 0 ( echo ERROR: electron-builder failed. & pause & exit /b 1 )

cd /d "%~dp0"
echo.
echo ================================================
echo   DONE!  dist-installers\ThreatLens AI Setup 1.0.0.exe
echo ================================================
echo.
pause
