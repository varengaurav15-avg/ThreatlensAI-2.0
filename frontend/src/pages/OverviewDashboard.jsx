import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { api, socket } from '../api/index';
import Layout, { C, Icon, toast } from '../components/Layout';

function KpiCard({ label, value, icon, iconColor, badge, badgeColor, badgeBg }) {
  return (
    <div style={{
      background: '#112240', border: `1px solid ${C.goldBorder}`,
      borderRadius: 4, padding: 24, display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: 11, textTransform: 'uppercase' }}>
          {label}
        </span>
        <Icon name={icon} size={22} style={{ color: iconColor }} />
      </div>
      <div>
        <div style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 36, fontWeight: 400, lineHeight: 1.1 }}>
          {value}
        </div>
        {badge && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              padding: '2px 8px', borderRadius: 2,
              border: `1px solid ${badgeColor}33`,
              background: badgeBg, color: badgeColor,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              {badge}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ severity, title, time, meta }) {
  const color = severity === 'CRITICAL' ? C.error
    : severity === 'HIGH' ? '#f97316'
    : severity === 'MEDIUM' ? '#ffa502'
    : C.tertiary;
  const icon = severity === 'CRITICAL' ? 'policy'
    : severity === 'HIGH' ? 'warning'
    : 'info';
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 4, flexShrink: 0,
        background: color + '1a', border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={16} style={{ color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <span style={{ color, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {severity || 'INFO'}
          </span>
          <span style={{ color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, flexShrink: 0, marginLeft: 8 }}>
            {time}
          </span>
        </div>
        <p style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.4, margin: 0, wordBreak: 'break-word' }}>
          {title}
        </p>
        {meta && (
          <span style={{ color: C.onSurfaceVariant + 'b3', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
            {meta}
          </span>
        )}
      </div>
    </div>
  );
}

const FALLBACK_ACTIVITY = [
  { id: 1, severity: 'CRITICAL', title: 'Unauthorized access attempt blocked on Core DB cluster', time: '14:02 UTC', meta: 'IP: 10.0.4.15' },
  { id: 2, severity: 'HIGH',     title: 'Memory dump detected on endpoint SRV-DC-02', time: '13:55 UTC', meta: 'SRV-DC-02' },
  { id: 3, severity: 'HIGH',     title: 'CVE-2024-8931 EPSS score elevated to 0.94', time: '13:41 UTC', meta: 'NVD Feed' },
  { id: 4, severity: 'MEDIUM',   title: 'Lateral movement attempt — SMB auth failures x12', time: '13:22 UTC', meta: 'Subnet VLAN-40' },
  { id: 5, severity: 'MEDIUM',   title: 'Suspicious PowerShell execution logged', time: '12:58 UTC', meta: 'WRK-EU-07' },
];

export default function OverviewDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [liveEvents, setLiveEvents] = useState([]);

  const handleIsolate = async () => {
    toast('Isolation command sent to critical endpoints', 'warning');
    await new Promise(r => setTimeout(r, 800));
    navigate('/endpoints');
  };

  const { data: stats }  = useQuery({ queryKey: ['stats'],  queryFn: () => api.getStats().then(r => r.data),       refetchInterval: 30000 });
  const { data: brief }  = useQuery({ queryKey: ['brief'],  queryFn: () => api.getBrief().then(r => r.data),       refetchInterval: 60000 });
  const { data: incidents } = useQuery({ queryKey: ['incidents'], queryFn: () => api.getIncidents().then(r => r.data), refetchInterval: 30000 });

  useEffect(() => {
    const handler = (data) => {
      setLiveEvents(prev => [data, ...prev].slice(0, 20));
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    };
    socket.on('new_incident', handler);
    return () => socket.off('new_incident', handler);
  }, [queryClient]);

  // Build activity list from live events + incidents, fall back to static
  const activityRaw = [
    ...liveEvents.map(e => ({ id: `live-${e.id || Date.now()}`, severity: e.severity, title: e.title, time: 'Live', meta: e.machine })),
    ...(incidents || []).slice(0, 8).map(inc => ({
      id: inc.id,
      severity: inc.severity,
      title: inc.title || 'Incident detected',
      time: inc.created_at ? new Date(inc.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' UTC' : '—',
      meta: inc.machine,
    })),
  ];
  const activity = activityRaw.length > 0 ? activityRaw.slice(0, 12) : FALLBACK_ACTIVITY;

  const total    = stats?.total    ?? '—';
  const critical = stats?.critical ?? '—';
  const online   = stats?.endpoint ?? '—';

  return (
    <Layout searchPlaceholder="Search threats, assets, CVEs...">
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1440, margin: '0 auto' }}>

        {/* AI Brief */}
        <section style={{
          background: '#112240', border: `1px solid ${C.goldBorder}`,
          borderRadius: 4, padding: 40, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 100% 0%, rgba(236,193,85,0.06) 0%, transparent 50%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Icon name="auto_awesome" size={18} style={{ color: C.primary }} />
                <span style={{ color: C.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: 11, textTransform: 'uppercase' }}>
                  AI Morning Brief
                </span>
              </div>
              <h2 style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 40, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 16px' }}>
                {brief?.title || 'Zero-Day Vulnerability Detected in European Region.'}
              </h2>
              <p style={{ color: C.secondary, fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.65, margin: 0 }}>
                {brief?.summary || 'Analysis indicates a newly disclosed vulnerability (CVE-2024-8931) is actively being exploited targeting financial infrastructure. Two of your critical endpoints show anomalous outbound traffic consistent with this pattern. Immediate patching is recommended.'}
              </p>
              <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                <button onClick={handleIsolate} style={{
                  padding: '10px 20px', background: C.primaryContainer, color: C.onPrimary,
                  border: `1px solid ${C.primary}4d`, borderRadius: 4,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <Icon name="shield" size={16} /> Isolate Endpoints
                </button>
                <button onClick={() => navigate('/threats')} style={{
                  padding: '10px 20px', background: 'transparent',
                  border: `1px solid ${C.primary}`, color: C.primary, borderRadius: 4,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}>
                  View Analysis
                </button>
              </div>
            </div>
            {/* Mini chart */}
            <div style={{
              width: 240, minHeight: 160, background: C.surfaceContainer,
              border: `1px solid ${C.goldBorder}`, borderRadius: 4,
              padding: 16, display: 'flex', flexDirection: 'column',
            }}>
              <span style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: 10, textTransform: 'uppercase', marginBottom: 12 }}>
                Threat Vector Probability
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6, marginTop: 8 }}>
                {[25, 50, 94, 35].map((h, i) => (
                  <div key={i} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {i === 2 && (
                      <span style={{ position: 'absolute', top: -20, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.error }}>94%</span>
                    )}
                    <div style={{
                      width: '100%', height: `${h}%`, minHeight: 8, borderRadius: '2px 2px 0 0',
                      background: i === 2 ? C.error + 'cc' : C.primary + (i === 1 ? '66' : '33'),
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* KPIs + Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 340px', gridTemplateRows: 'auto auto', gap: 24 }}>
          {/* KPIs */}
          <div style={{ gridColumn: '1', gridRow: '1' }}>
            <KpiCard label="Active Incidents" value={critical} icon="warning" iconColor={C.error}
              badge={`+3 vs yesterday`} badgeColor={C.error} badgeBg={C.error + '1a'} />
          </div>
          <div style={{ gridColumn: '2', gridRow: '1' }}>
            <KpiCard label="Threats Tracked" value={total} icon="bug_report" iconColor={C.primary}
              badge="-124 vs last week" badgeColor={C.primary} badgeBg={C.primary + '1a'} />
          </div>
          <div style={{ gridColumn: '3', gridRow: '1' }}>
            <KpiCard label="Endpoints Online" value={online} icon="monitor_heart" iconColor={C.tertiary}
              badge="Nominal" badgeColor={C.tertiary} badgeBg={C.tertiary + '1a'} />
          </div>

          {/* Activity Stream — spans vertically across 2 rows */}
          <div style={{
            gridColumn: '4', gridRow: '1 / 3', background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`,
            borderRadius: 8, display: 'flex', flexDirection: 'column',
            maxHeight: 600, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              padding: '20px', borderBottom: `1px solid ${C.outlineVariant}30`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
              background: C.surfaceContainerHigh,
            }}>
              <span style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 20, fontWeight: 500 }}>Activity Stream</span>
              {liveEvents.length > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.error, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.error, animation: 'pulse 1s infinite' }} />
                  LIVE
                </span>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20, wordBreak: 'break-word' }}>
              {activity.map((item, i) => (
                <ActivityItem key={item.id ?? i} {...item} />
              ))}
            </div>
            <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.outlineVariant}30`, flexShrink: 0, background: C.surfaceContainerHigh }}>
              <Link to="/incidents" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', padding: '10px', borderRadius: 4,
                  border: `1px solid ${C.outlineVariant}50`, background: 'transparent',
                  color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                  fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
                onMouseOver={e => e.currentTarget.style.background=C.surfaceContainerHighest}
                onMouseOut={e => e.currentTarget.style.background='transparent'}>
                  View All Incidents
                </button>
              </Link>
            </div>
          </div>

          {/* Map placeholder */}
          <div style={{
            gridColumn: '1 / 4', gridRow: '2', background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`,
            borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', minHeight: 320,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.goldBorder}` }}>
              <span style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 500 }}>Global Threat Distribution</span>
              <Link to="/map" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, color: C.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em' }}>
                View Full Map <Icon name="arrow_forward" size={16} style={{ color: C.primary }} />
              </Link>
            </div>
            <div style={{ flex: 1, background: C.surfaceContainer + '80', borderRadius: 2, border: `1px solid ${C.outlineVariant}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {/* Simple SVG world dots */}
              <svg viewBox="0 0 800 360" style={{ width: '100%', height: '100%', opacity: 0.4 }}>
                {[
                  [120, 140], [160, 120], [200, 150], [240, 130], [300, 160],
                  [350, 120], [380, 140], [420, 130], [460, 150], [500, 120],
                  [540, 100], [580, 130], [620, 110], [660, 120], [700, 140],
                  [140, 200], [200, 220], [260, 210], [320, 230], [380, 200],
                  [440, 220], [500, 210], [560, 230],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={2} fill={C.onSurfaceVariant} />
                ))}
                {/* Hotspot overlays from data */}
                {(incidents || []).slice(0, 6).map((_, i) => {
                  const positions = [[350, 140, C.error], [180, 160, C.error], [520, 120, C.primary], [270, 200, '#f97316'], [620, 130, C.primary], [440, 180, '#f97316']];
                  const [px, py, pc] = positions[i % positions.length];
                  return <circle key={`hot-${i}`} cx={px} cy={py} r={6} fill={pc} fillOpacity={0.7} />;
                })}
              </svg>
              {(!incidents || incidents.length === 0) && (
                <div style={{ position: 'absolute', fontFamily: "'JetBrains Mono', monospace", color: C.onSurfaceVariant + 'cc', fontSize: 13 }}>
                  Threat distribution map
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </Layout>
  );
}
