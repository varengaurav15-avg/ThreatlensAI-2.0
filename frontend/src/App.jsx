import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'

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

  return done
    ? <Dashboard />
    : <Onboarding onComplete={() => window.location.reload()} />
}