import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api, socket } from '../api/index';
import { C, Icon, toast } from '../components/Layout';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// IntelligenceMap has a special full-screen layout so it manages its own nav
// instead of using the standard Layout wrapper (which adds a scrollable main area)

const NAV_ITEMS = [
  { path: '/overview',  label: 'Dashboard',     icon: 'dashboard' },
  { path: '/threats',   label: 'Global Threats', icon: 'public' },
  { path: '/endpoints', label: 'Endpoints',      icon: 'devices' },
  { path: '/incidents', label: 'Incidents',      icon: 'emergency_home' },
];

// Node positions with real Lat/Lng
const STATIC_NODES = [
  { id: 'apt29',    label: 'APT-29 [ORIGIN]',  lat: 55.75, lng: 37.61, type: 'hostile', detail: { srcIp: '185.220.101.42', protocol: 'TCP/443', target: 'US_EAST_PROD', associations: ['APT-29', 'CozyBear', 'CVE-2023-44487'] } },
  { id: 'us-east',  label: 'NODE_US_EAST',     lat: 38.90, lng: -77.03, type: 'asset',   detail: { srcIp: '10.0.4.15',       protocol: 'SMB/445',  target: 'SRV-DC-01',    associations: ['SolarWinds', 'CVE-2024-8931'] } },
  { id: 'relay-eu', label: 'RELAY_EU_01',      lat: 52.36, lng: 4.90,  type: 'relay',   detail: { srcIp: '31.220.4.11',     protocol: 'HTTPS',    target: 'EU_RELAY',     associations: ['TOR Exit', 'Bulletproof ISP'] } },
];

// Custom Leaflet Icons
const createIcon = (color) => L.divIcon({
  className: 'custom-icon',
  html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid ${color}80;box-shadow:0 0 16px ${color}60;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

export default function IntelligenceMap() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState('');
  const [selected, setSelected] = useState(STATIC_NODES[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const { data: mapNodesRaw } = useQuery({
    queryKey: ['threat-nodes'],
    queryFn: () => api.getMapNodes().then(r => r.data),
    refetchInterval: 60000,
  });
  const mapNodes = Array.isArray(mapNodesRaw) ? mapNodesRaw : [];

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toUTCString().slice(17, 22) + ' UTC');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = data => console.log('map: new_incident', data);
    socket.on('new_incident', handler);
    return () => socket.off('new_incident', handler);
  }, []);

  const nodeColor = type => type === 'hostile' ? C.error : type === 'asset' ? C.primary : C.tertiary;

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Sidebar */}
      <nav style={{
        position: 'fixed', left: 0, top: 0, width: 288, height: '100vh',
        background: C.surfaceContainerLow, borderRight: `1px solid ${C.outlineVariant}26`,
        display: 'flex', flexDirection: 'column', padding: '32px 16px', zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, padding: '0 8px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.surfaceContainerHigh, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="admin_panel_settings" size={20} fill style={{ color: C.primary }} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.primary, lineHeight: 1, fontFamily: "'Newsreader', serif" }}>ThreatLens</div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', fontWeight: 700, color: C.onSurfaceVariant, marginTop: 4, textTransform: 'uppercase' }}>V2.0 Command Center</div>
          </div>
        </div>
        <button onClick={() => toast('Use the New Analysis modal from the main sidebar (navigate to Dashboard first)', 'info')} style={{
          width: '100%', marginBottom: 32, background: C.primaryContainer, color: C.onPrimary,
          border: `1px solid ${C.primary}4d`, borderRadius: 4, padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 12, letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase',
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        }}>
          <Icon name="add" size={18} /> New Analysis
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: C.onSurfaceVariant + '80', textTransform: 'uppercase', padding: '0 8px', marginBottom: 4, marginTop: 8 }}>Core Systems</div>
          {NAV_ITEMS.map(item => {
            const active = pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderRadius: 4,
                  background: active ? `${C.primary}0d` : 'transparent',
                  borderRight: active ? `2px solid ${C.primary}` : '2px solid transparent',
                  color: active ? C.primary : C.onSurfaceVariant,
                  fontWeight: active ? 700 : 500, fontSize: 16, cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseOver={e => { if (!active) { e.currentTarget.style.background = C.surfaceContainerHigh; e.currentTarget.style.color = C.primary; } }}
                  onMouseOut={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.onSurfaceVariant; } }}
                >
                  <Icon name={item.icon} size={22} fill={active} style={{ color: 'inherit' }} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
        <div style={{ borderTop: `1px solid ${C.outlineVariant}26`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { label: 'Settings', icon: 'settings', action: () => navigate('/settings') },
            { label: 'Support', icon: 'contact_support', action: () => toast('Support: mrandmrsgauravai@gmail.com', 'info') },
          ].map(item => (
            <div key={item.label} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 4, color: C.onSurfaceVariant, fontSize: 15, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseOver={e => { e.currentTarget.style.background = C.surfaceContainerHigh; e.currentTarget.style.color = C.primary; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.onSurfaceVariant; }}
            >
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Map area (full height minus topbar) */}
      <div style={{ marginLeft: 288, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Topbar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40, height: 64,
          background: 'rgba(6,20,35,0.85)', backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${C.outlineVariant}26`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 500, color: C.primary, fontFamily: "'Newsreader', serif", whiteSpace: 'nowrap' }}>Intelligence Map</div>
            <div style={{ position: 'relative', maxWidth: 320, width: '100%' }}>
              <Icon name="search" size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.onSurfaceVariant }} />
              <input placeholder="Query entities, IPs, hashes..." style={{ width: '100%', background: C.surfaceContainerHigh, border: `1px solid ${C.outlineVariant}80`, borderRadius: 4, padding: '7px 12px 7px 32px', color: C.onSurface, fontSize: 13, outline: 'none', fontFamily: "'JetBrains Mono', monospace" }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: C.secondaryContainer + '33', border: `1px solid ${C.secondaryContainer}4d`, borderRadius: 20 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.primary, animation: 'pulse 2s infinite' }} />
              <span style={{ color: C.secondary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em' }}>LIVE</span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.onSurfaceVariant }}>{time}</span>
            {[
              { icon: 'notifications', action: () => toast('No new notifications', 'info') },
              { icon: 'account_circle', action: () => navigate('/settings') },
            ].map(({ icon, action }) => (
              <button key={icon} onClick={action} style={{ width: 32, height: 32, borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: C.onSurfaceVariant, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseOver={e => { e.currentTarget.style.background = C.surfaceContainer; e.currentTarget.style.color = C.primary; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.onSurfaceVariant; }}
              >
                <Icon name={icon} size={22} />
              </button>
            ))}
          </div>
        </header>

        {/* Map canvas */}
        <main style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
          
          <MapContainer center={[30, -10]} zoom={3} style={{ height: '100%', width: '100%', zIndex: 5 }} zoomControl={false} attributionControl={false}>
            {/* Esri World Imagery (Satellite) Map */}
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              opacity={0.7}
            />
            {/* Base Dark Labels over satellite */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
            />

            {/* Static Nodes */}
            {STATIC_NODES.filter(n => filterType === 'all' || n.type === filterType).map(n => {
              const nc = nodeColor(n.type);
              return (
                <Marker key={n.id} position={[n.lat, n.lng]} icon={createIcon(nc)} eventHandlers={{ click: () => setSelected(n) }}>
                  <Popup className="custom-popup" closeButton={false}>
                    <div style={{ background: C.surfaceContainerHigh, border: `1px solid ${nc}80`, padding: '4px 8px', borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: nc }}>
                      {n.label}
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Dynamic Map Nodes */}
            {(filterType === 'all' || filterType === 'hostile') && mapNodes.map((p, i) => (
              <Marker key={p.id || i} position={[p.lat || 0, p.lng || 0]} icon={createIcon(C.primary + 'a0')} eventHandlers={{
                click: () => setSelected({
                  id: p.id, type: 'hostile', label: p.title, 
                  detail: { srcIp: p.ip || 'Unknown IP', protocol: 'N/A', target: p.country || 'Global', associations: [p.source || 'Global Threat'] }
                })
              }} />
            ))}

            {/* Trajectories */}
            <Polyline positions={[ [55.75, 37.61], [52.36, 4.90] ]} color={C.error} weight={2} opacity={0.6} dashArray="5, 10" />
            <Polyline positions={[ [52.36, 4.90], [38.90, -77.03] ]} color={C.tertiary} weight={2} opacity={0.6} dashArray="5, 10" />
          </MapContainer>

          {/* Entity Inspection Panel */}
          {selected && (
            <aside style={{
              position: 'absolute', right: 24, top: 24, bottom: 24, width: 300, zIndex: 20,
              background: C.surfaceContainerLow + 'cc', backdropFilter: 'blur(24px)',
              border: `1px solid ${C.outlineVariant}15`, borderRadius: 4,
              display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              <div style={{ padding: '20px', borderBottom: `1px solid ${C.outlineVariant}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 500, margin: '0 0 4px' }}>Entity Inspection</h2>
                  <span style={{ color: C.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {selected.type === 'hostile' ? 'Hostile Vector' : selected.type === 'asset' ? 'Protected Asset' : 'Relay Node'}
                  </span>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.onSurfaceVariant }}
                  onMouseOver={e => e.currentTarget.style.color = C.primary}
                  onMouseOut={e => e.currentTarget.style.color = C.onSurfaceVariant}
                >
                  <Icon name="close" size={20} />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Status */}
                <div style={{ background: C.surfaceContainer + '80', border: `1px solid ${C.outlineVariant}1a`, borderRadius: 4, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Icon name={selected.type === 'hostile' ? 'warning' : 'info'} size={16} style={{ color: nodeColor(selected.type) }} />
                    <span style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500 }}>
                      {selected.type === 'hostile' ? 'Critical Breach' : selected.type === 'asset' ? 'Protected Node' : 'Relay Detected'}
                    </span>
                  </div>
                  <p style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                    {selected.type === 'hostile'
                      ? 'Unauthorized lateral movement detected originating from known hostile IP space.'
                      : selected.type === 'asset'
                      ? 'Managed asset currently under active monitoring. Anomalous traffic detected.'
                      : 'Intermediate relay node used for traffic obfuscation.'}
                  </p>
                </div>
                {/* Telemetry */}
                <div>
                  <div style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Telemetry</div>
                  {[
                    { label: 'Source IP', value: selected.detail.srcIp, color: nodeColor(selected.type) },
                    { label: 'Target',    value: selected.detail.target, color: C.primary },
                    { label: 'Protocol', value: selected.detail.protocol, color: C.onSurface },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.outlineVariant}1a` }}>
                      <span style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{label}</span>
                      <span style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{value}</span>
                    </div>
                  ))}
                </div>
                {/* Associations */}
                <div>
                  <div style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Known Associations</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selected.detail.associations.map(a => (
                      <span key={a} style={{
                        padding: '3px 10px', borderRadius: 2, border: `1px solid ${C.secondaryContainer}33`,
                        background: C.secondaryContainer + '1a', color: C.secondary,
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em',
                      }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: 20, borderTop: `1px solid ${C.outlineVariant}15` }}>
                <button onClick={() => {
                  toast(`Countermeasure initiated against ${selected.label} — blocking ${selected.detail.srcIp}`, 'warning');
                }} style={{
                  width: '100%', padding: '10px', background: 'transparent',
                  border: `1px solid ${C.primary}`, borderRadius: 4,
                  color: C.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                  fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <Icon name="policy" size={16} style={{ color: C.primary }} /> Initiate Countermeasure
                </button>
              </div>
            </aside>
          )}

          {/* Legend bar */}
          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 24, padding: '12px 24px',
            background: C.surfaceContainerHigh + 'e6', backdropFilter: 'blur(12px)',
            border: `1px solid ${C.outlineVariant}15`, borderRadius: 24, zIndex: 15,
          }}>
            {[['Hostile', C.error], ['Asset', C.primary], ['Relay', C.tertiary]].map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
              </div>
            ))}
            <div style={{ width: 1, height: 16, background: C.outlineVariant + '30' }} />
            <button onClick={() => {
              setShowFilters(f => !f);
              if (!showFilters) toast('Click a node type to filter the map', 'info');
            }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: showFilters ? C.primary + '1a' : 'transparent', border: showFilters ? `1px solid ${C.primary}33` : 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', color: C.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em' }}>
              <Icon name="filter_list" size={16} style={{ color: C.primary }} /> Filters
            </button>
          </div>
          {/* Filter dropdown */}
          {showFilters && (
            <div style={{
              position: 'absolute', bottom: 68, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 8, padding: '10px 20px',
              background: C.surfaceContainerHigh + 'e6', backdropFilter: 'blur(12px)',
              border: `1px solid ${C.outlineVariant}15`, borderRadius: 8, zIndex: 16,
            }}>
              {[{ label: 'All', val: 'all' }, { label: 'Hostile', val: 'hostile' }, { label: 'Assets', val: 'asset' }, { label: 'Relays', val: 'relay' }].map(f => (
                <button key={f.val} onClick={() => { setFilterType(f.val); toast(`Showing: ${f.label}`, 'info'); }} style={{
                  padding: '6px 14px', borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: filterType === f.val ? C.primary + '1a' : 'transparent',
                  color: filterType === f.val ? C.primary : C.onSurfaceVariant,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11,
                  letterSpacing: '0.08em', transition: 'all 0.15s',
                }}>{f.label}</button>
              ))}
            </div>
          )}
        </main>
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .leaflet-container { background: #0a0a0a; }
        .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; padding: 0 !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-popup-content { margin: 0 !important; }
        .custom-icon { border: none !important; background: transparent !important; }
      `}</style>
    </div>
  );
}
