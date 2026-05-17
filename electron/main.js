const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, dialog } = require('electron')
const path   = require('path')
const { spawn } = require('child_process')
const fs     = require('fs')
const http   = require('http')

let mainWindow, tray, backendProcess
let windowCreated  = false   // guard — createWindow runs exactly once
let backendHealthy = false   // guard — only open window after backend confirms ready

const IS_DEV = !app.isPackaged

// ── SINGLE INSTANCE LOCK ─────────────────────────────────────
const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  // A second instance tried to open — quit it immediately
  app.quit()
  process.exit(0)
}

// If a second instance fires anyway, just focus the existing window
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.show()
    mainWindow.focus()
  }
})

// ── BACKEND STARTUP ──────────────────────────────────────────
function startBackend() {
  let backendExe, backendArgs, backendCwd

  if (IS_DEV) {
    const pythonPath = process.platform === 'win32'
      ? path.join(__dirname, '../backend/venv/Scripts/python.exe')
      : path.join(__dirname, '../backend/venv/bin/python')
    backendExe  = pythonPath
    backendArgs = [path.join(__dirname, '../backend/main.py')]
    backendCwd  = path.join(__dirname, '../backend')
  } else {
    backendExe = path.join(process.resourcesPath, 'backend', 'main.exe')
    backendArgs = []
    backendCwd  = path.join(process.resourcesPath, 'backend')
  }

  if (!IS_DEV && !fs.existsSync(backendExe)) {
    dialog.showErrorBox(
      'ThreatLens AI — Backend Missing',
      `Backend executable not found at:\n${backendExe}\n\nPlease reinstall the application.`
    )
    app.quit()
    return
  }

  backendProcess = spawn(backendExe, backendArgs, {
    cwd: backendCwd,
    windowsHide: true,
    env: { ...process.env },
  })

  backendProcess.stdout?.on('data', d => console.log(`[backend] ${d}`))
  backendProcess.stderr?.on('data', d => console.error(`[backend-err] ${d}`))
  backendProcess.on('error', err => console.error('Backend spawn error:', err))
  backendProcess.on('exit', code => console.log(`Backend exited with code ${code}`))
}

// ── WAIT FOR BACKEND ─────────────────────────────────────────
// Polls /health every 500 ms. Calls callback exactly once when ready.
function waitForBackend(callback) {
  let done = false   // ensures callback fires at most once

  function attempt(tries) {
    if (done) return
    if (tries >= 60) {
      console.warn('Backend did not respond after 30 s — opening window anyway')
      done = true
      callback()
      return
    }

    const req = http.get('http://127.0.0.1:8000/health', (res) => {
      if (done) return
      if (res.statusCode === 200) {
        console.log('Backend healthy ✓')
        done = true
        callback()
      } else {
        setTimeout(() => attempt(tries + 1), 500)
      }
      // Consume response body so the socket is released
      res.resume()
    })

    req.on('error', () => {
      if (!done) setTimeout(() => attempt(tries + 1), 500)
    })

    req.setTimeout(400, () => {
      req.destroy()
      if (!done) setTimeout(() => attempt(tries + 1), 500)
    })
  }

  attempt(0)
}

// ── WINDOW CREATION ──────────────────────────────────────────
function createWindow() {
  if (windowCreated) return   // never open more than one window
  windowCreated = true

  mainWindow = new BrowserWindow({
    width: 1280, height: 800,
    minWidth: 1024, minHeight: 700,
    title: 'ThreatLens AI',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#060c14',
    show: false,
  })

  if (IS_DEV) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    const indexPath = path.join(process.resourcesPath, 'frontend-dist', 'index.html')
    mainWindow.loadFile(indexPath)
  }

  mainWindow.once('ready-to-show', () => mainWindow.show())

  // System tray
  const trayIconPath = path.join(__dirname, 'assets', 'tray-icon.png')
  try {
    const { nativeImage } = require('electron')
    const img = nativeImage.createFromPath(trayIconPath)
    if (!img.isEmpty()) {
      tray = new Tray(img)
      tray.setToolTip('ThreatLens AI')
      tray.setContextMenu(Menu.buildFromTemplate([
        { label: 'Open ThreatLens', click: () => { mainWindow.show(); mainWindow.focus() } },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() },
      ]))
      tray.on('double-click', () => { mainWindow.show(); mainWindow.focus() })
    }
  } catch (e) {
    console.warn('Tray icon failed:', e.message)
  }

  mainWindow.on('close', e => {
    if (!app.isQuitting) { e.preventDefault(); mainWindow.hide() }
  })
}

// ── APP LIFECYCLE ────────────────────────────────────────────
app.whenReady().then(() => {
  startBackend()
  waitForBackend(createWindow)
})

app.on('before-quit', () => {
  app.isQuitting = true
  if (backendProcess) {
    try { backendProcess.kill() } catch (_) {}
  }
})

app.on('activate', () => {
  if (mainWindow) mainWindow.show()
})

// ── IPC ──────────────────────────────────────────────────────
ipcMain.on('show-notification', (_, { title, body }) => {
  if (Notification.isSupported()) new Notification({ title, body }).show()
})
