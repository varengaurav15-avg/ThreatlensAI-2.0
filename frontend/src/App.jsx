import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import OverviewDashboard from './pages/OverviewDashboard'
import GlobalThreats from './pages/GlobalThreats'
import Endpoints from './pages/Endpoints'
import Incidents from './pages/Incidents'
import IntelligenceMap from './pages/IntelligenceMap'
import Settings from './pages/Settings'

export default function App() {
  const [ready, setReady] = useState(false)
  const done = localStorage.getItem('onboarding_complete') === 'true'

  useEffect(() => {
    setTimeout(() => setReady(true), 500)
  }, [])

  if (!ready) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#060c14', color: '#334155', fontSize: 14,
      fontFamily: 'system-ui, sans-serif'
    }}>
      Starting ThreatLens AI…
    </div>
  )

  if (!done) {
    return <Onboarding onComplete={() => window.location.reload()} />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewDashboard />} />
        <Route path="/threats" element={<GlobalThreats />} />
        <Route path="/endpoints" element={<Endpoints />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/map" element={<IntelligenceMap />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </Router>
  )
}