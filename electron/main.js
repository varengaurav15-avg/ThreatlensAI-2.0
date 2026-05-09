const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, dialog } = require('electron')
const path   = require('path')
const { spawn } = require('child_process')
const fs     = require('fs')
const http   = require('http')

let mainWindow, tray, backendProcess

const IS_DEV = !app.isPackaged

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
    backendExe  = path.join(process.resourcesPath, 'backend', 'main.exe')
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

  // Copy .env from resources into the backend CWD so dotenv finds it
  if (!IS_DEV) {
    const envSrc = path.join(process.resourcesPath, 'backend', '.env')
    const envDst = path.join(backendCwd, '.env')
    if (fs.existsSync(envSrc) && !fs.existsSync(envDst)) {
      try { fs.copyFileSync(envSrc, envDst) } catch(e) { /* ignore */ }
    }
  }

  backendProcess = spawn(backendExe, backendArgs, {
    cwd: backendCwd,
    windowsHide: true,
    env: { ...process.env }
  })

  backendProcess.stdout.on('data', d => console.log(`[backend] ${d}`))
  backendProcess.stderr.on('data', d => console.error(`[backend-err] ${d}`))
  backendProcess.on('error', err => console.error('Failed to start backend:', err))
  backendProcess.on('exit', code => console.log(`Backend exited: ${code}`))
}

// ── WAIT FOR BACKEND HEALTH ───────────────────────────────────
// Poll /health until it responds (up to 30 s) before opening the window.
// Beats a fixed 2 s delay — backend can be slow on first boot.
function waitForBackend(callback, attempts = 0) {
  const MAX = 60  // 60 × 500 ms = 30 s
  if (attempts >= MAX) {
    console.warn('Backend did not respond in 30 s — opening window anyway')
    callback()
    return
  }
  const req = http.get('http://127.0.0.1:8000/health', res => {
    if (res.statusCode === 200) {
      console.log('Backend ready ✓')
      callback()
    } else {
      setTimeout(() => waitForBackend(callback, attempts + 1), 500)
    }
  })
  req.on('error', () => setTimeout(() => waitForBackend(callback, attempts + 1), 500))
  req.setTimeout(400, () => { req.destroy(); setTimeout(() => waitForBackend(callback, attempts + 1), 500) })
}

// ── WINDOW CREATION ──────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280, height: 800,
    minWidth: 1024, minHeight: 700,
    title: 'ThreatLens AI',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
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

  // Tray icon
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
        { label: 'Quit', click: () => app.quit() }
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
  if (backendProcess) backendProcess.kill()
})

app.on('activate', () => { if (mainWindow) mainWindow.show() })

// ── IPC ──────────────────────────────────────────────────────
ipcMain.on('show-notification', (_, { title, body }) => {
  if (Notification.isSupported()) new Notification({ title, body }).show()
})
