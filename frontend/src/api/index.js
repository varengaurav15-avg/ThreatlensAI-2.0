import axios from 'axios'
import { io } from 'socket.io-client'

// Port is fixed at 8000. Electron's main.js starts the backend on this port.
// If you ever need a dynamic port, pass it via window.electronAPI or an env var at build time.
const BASE = 'http://127.0.0.1:8000'

// Socket.io: reconnect automatically, don't block the app if the backend is slow to start
export const socket = io(BASE, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: Infinity,
  autoConnect: true,
})

// Axios instance with a 10 s timeout so requests don't hang indefinitely
const http = axios.create({
  baseURL: BASE,
  timeout: 10_000,
})

export const api = {
  getThreats:    (p)  => http.get('/api/threats', { params: p }),
  getStats:      ()   => http.get('/api/threats/stats'),
  getIncidents:  ()   => http.get('/api/incidents'),
  getBrief:      ()   => http.get('/api/brief/today'),
  getConfig:     ()   => http.get('/api/config/permissions'),
  saveConfig:    (d)  => http.post('/api/config/permissions', d),
  resolveThreat: (id) => http.patch(`/api/threats/${id}/resolve`),
  getSources:    ()   => http.get('/api/sources'),
}