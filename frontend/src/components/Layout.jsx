import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, socket } from '../api/index';

// ── DESIGN TOKENS ─────────────────────────────────────────────
export const C = {
  bg:                    '#061423',
  surface:               '#061423',
  surfaceContainerLow:   '#0f1c2c',
  surfaceContainer:      '#132030',
  surfaceContainerHigh:  '#1e2b3b',
  surfaceContainerHighest:'#283646',
  surfaceBright:         '#2d3a4a',
  surfaceDim:            '#061423',
  primary:               '#ecc155',
  primaryContainer:      '#b8922a',
  onPrimary:             '#3e2e00',
  error:                 '#ffb4ab',
  errorContainer:        '#93000a',
  tertiary:              '#b0c9e6',
  secondary:             '#b6c6ed',
  secondaryContainer:    '#374767',
  outline:               '#9a907d',
  outlineVariant:        '#4e4636',
  onSurface:             '#d6e4f9',
  onSurfaceVariant:      '#d1c5b0',
  card:                  '#112240',
  goldBorder:            'rgba(184,146,42,0.15)',
};

// ── ICON ──────────────────────────────────────────────────────
export function Icon({ name, size = 24, fill = false, style = {} }) {
  return (
    <span className="material-symbols-outlined" style={{
      fontSize: size, lineHeight: 1, display: 'inline-flex', alignItems: 'center',
      fontVariationSettings: fill
        ? "'FILL' 1,'wght' 300,'GRAD' 0,'opsz' 24"
        : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24",
      ...style,
    }}>{name}</span>
  );
}

// ── TOAST helper (call from any page) ─────────────────────────
export function toast(msg, type = 'success') {
  window.dispatchEvent(new CustomEvent('tl:toast', { detail: { msg, type } }));
}

// ── NAV ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { path: '/overview',  label: 'Dashboard',     icon: 'dashboard' },
  { path: '/threats',   label: 'Global Threats', icon: 'public' },
  { path: '/endpoints', label: 'Endpoints',      icon: 'devices' },
  { path: '/incidents', label: 'Incidents',      icon: 'emergency_home' },
  { path: '/map',       label: 'Intel Map',      icon: 'explore' },
];

// ── NEW ANALYSIS MODAL ────────────────────────────────────────
function NewAnalysisModal({ onClose }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('cve');
  const [cveInput, setCveInput] = useState('');
  const [epInput, setEpInput] = useState('');
  const [fileInput, setFileInput] = useState('');
  const [sandboxStatus, setSandboxStatus] = useState(null);

  const handleCveSearch = () => {
    if (!cveInput.trim()) return;
    sessionStorage.setItem('tl_threat_search', cveInput.trim());
    onClose(); navigate('/threats');
  };
  const handleEndpointScan = () => {
    if (!epInput.trim()) return;
    sessionStorage.setItem('tl_ep_filter', epInput.trim());
    onClose(); navigate('/endpoints');
  };
  const handleSandbox = async () => {
    if (!fileInput.trim()) return;
    setSandboxStatus('loading');
    try {
      await api.startSandbox(fileInput.trim());
      setSandboxStatus('done');
      setTimeout(() => { onClose(); navigate('/incidents'); }, 1800);
    } catch {
      setSandboxStatus('error');
    }
  };

  const TABS = [
    { id: 'cve',     label: 'CVE Lookup',    icon: 'bug_report' },
    { id: 'ep',      label: 'Endpoint Scan', icon: 'devices' },
    { id: 'sandbox', label: 'File Sandbox',  icon: 'science' },
  ];

  const inp = {
    background: C.surfaceContainer, border: `1px solid ${C.outlineVariant}50`,
    borderRadius: 4, padding: '12px 16px', color: C.onSurface, width: '100%',
    fontFamily: "'JetBrains Mono',monospace", fontSize: 13, outline: 'none',
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(6,20,35,0.88)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:520, background:C.surfaceContainer, border:`1px solid ${C.goldBorder}`, borderRadius:8, overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,0.7)' }}>
        <div style={{ padding:'24px 28px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <Icon name="add_circle" size={18} style={{ color:C.primary }} />
              <span style={{ color:C.primary, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase' }}>New Analysis</span>
            </div>
            <h2 style={{ color:C.onSurface, fontFamily:"'Newsreader',serif", fontSize:24, fontWeight:400, margin:0 }}>What do you want to investigate?</h2>
          </div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', cursor:'pointer', color:C.onSurfaceVariant, padding:4, marginTop:-4 }}>
            <Icon name="close" size={22} />
          </button>
        </div>
        <div style={{ display:'flex', gap:4, padding:'20px 28px 0' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1, padding:'10px 6px', border:'none', borderRadius:'4px 4px 0 0', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:6,
              background: tab === t.id ? C.surfaceContainerHigh : 'transparent',
              color: tab === t.id ? C.primary : C.onSurfaceVariant,
              fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:10, letterSpacing:'0.1em', transition:'all 0.15s',
            }}>
              <Icon name={t.icon} size={14} style={{ color:'inherit' }} />{t.label.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ background:C.surfaceContainerHigh, padding:28, display:'flex', flexDirection:'column', gap:14 }}>
          {tab === 'cve' && <>
            <p style={{ color:C.onSurfaceVariant, fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.6, margin:0 }}>Search by CVE ID, keyword, or component name. Press Enter or click Search.</p>
            <input autoFocus value={cveInput} onChange={e => setCveInput(e.target.value)} onKeyDown={e => e.key==='Enter' && handleCveSearch()} placeholder="e.g. CVE-2024-8931  or  nginx" style={inp} />
            <button onClick={handleCveSearch} style={{ padding:12, background:C.primaryContainer, color:C.onPrimary, border:`1px solid ${C.primary}4d`, borderRadius:4, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, letterSpacing:'0.1em', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Icon name="search" size={16} /> SEARCH THREAT DATABASE
            </button>
          </>}
          {tab === 'ep' && <>
            <p style={{ color:C.onSurfaceVariant, fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.6, margin:0 }}>Trigger an on-demand scan for a specific endpoint by hostname or IP address.</p>
            <input autoFocus value={epInput} onChange={e => setEpInput(e.target.value)} onKeyDown={e => e.key==='Enter' && handleEndpointScan()} placeholder="e.g. SRV-DC-01  or  10.0.4.15" style={inp} />
            <button onClick={handleEndpointScan} style={{ padding:12, background:C.primaryContainer, color:C.onPrimary, border:`1px solid ${C.primary}4d`, borderRadius:4, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, letterSpacing:'0.1em', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Icon name="radar" size={16} /> INITIATE ENDPOINT SCAN
            </button>
          </>}
          {tab === 'sandbox' && <>
            <p style={{ color:C.onSurfaceVariant, fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.6, margin:0 }}>Submit a local file path for behavioural detonation in the sandbox environment.</p>
            <input autoFocus value={fileInput} onChange={e => setFileInput(e.target.value)} onKeyDown={e => e.key==='Enter' && handleSandbox()} placeholder="e.g. C:\Users\user\Downloads\file.exe" style={inp} />
            {sandboxStatus === 'loading' && <div style={{ color:C.primary, fontFamily:"'JetBrains Mono',monospace", fontSize:12, textAlign:'center' }}>Detonating sample…</div>}
            {sandboxStatus === 'done'    && <div style={{ color:'#2ed573', fontFamily:"'JetBrains Mono',monospace", fontSize:12, textAlign:'center' }}>✓ Submitted — redirecting to Incidents…</div>}
            {sandboxStatus === 'error'   && <div style={{ color:C.error,   fontFamily:"'JetBrains Mono',monospace", fontSize:12, textAlign:'center' }}>Error — check the file path and try again.</div>}
            {!sandboxStatus && (
              <button onClick={handleSandbox} style={{ padding:12, background:C.errorContainer, color:C.error, border:`1px solid ${C.error}4d`, borderRadius:4, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, letterSpacing:'0.1em', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <Icon name="science" size={16} /> SUBMIT TO SANDBOX
              </button>
            )}
          </>}
        </div>
      </div>
    </div>
  );
}

// ── PROFILE DROPDOWN ──────────────────────────────────────────
function ProfileDropdown({ onClose }) {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem('tl_profile') || '{}');
  const name = stored.name || 'Varun';
  const email = stored.email || 'mrandmrsgauravai@gmail.com';
  const initials = name.slice(0,1).toUpperCase();

  const handleSignOut = () => {
    localStorage.removeItem('onboarding_complete');
    onClose();
    window.location.reload();
  };

  return (
    <div style={{ position:'fixed', top:56, right:16, width:260, zIndex:150, background:C.surfaceContainerHigh, border:`1px solid ${C.outlineVariant}30`, borderRadius:8, boxShadow:'0 8px 32px rgba(0,0,0,0.6)', overflow:'hidden' }}>
      <div style={{ padding:'18px 20px 14px', borderBottom:`1px solid ${C.outlineVariant}20` }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:'50%', background:C.primaryContainer, color:C.onPrimary, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:18, flexShrink:0 }}>{initials}</div>
          <div style={{ minWidth:0 }}>
            <div style={{ color:C.onSurface, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, marginBottom:2 }}>{name}</div>
            <div style={{ color:C.onSurfaceVariant, fontFamily:"'JetBrains Mono',monospace", fontSize:9, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{email}</div>
          </div>
        </div>
        <div style={{ marginTop:10, padding:'3px 8px', background:C.primary+'1a', border:`1px solid ${C.goldBorder}`, borderRadius:20, display:'inline-flex', alignItems:'center', gap:6 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#2ed573' }} />
          <span style={{ color:C.primary, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:9, letterSpacing:'0.1em' }}>SESSION ACTIVE</span>
        </div>
      </div>
      {[
        { label:'Account Settings', icon:'manage_accounts', action: () => { onClose(); navigate('/settings'); } },
        { label:'Configuration',    icon:'tune',            action: () => { onClose(); navigate('/settings'); } },
        { label:'Keyboard Shortcuts',icon:'keyboard',       action: () => toast('Shortcuts: Ctrl+K Search • Ctrl+N New Analysis • G+T Threats', 'info') },
      ].map(item => (
        <button key={item.label} onClick={item.action} style={{ width:'100%', padding:'11px 20px', background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:10, color:C.onSurfaceVariant, fontFamily:"'DM Sans',sans-serif", fontSize:13, textAlign:'left', transition:'all 0.15s' }}
          onMouseOver={e => { e.currentTarget.style.background=C.surfaceContainerHighest; e.currentTarget.style.color=C.primary; }}
          onMouseOut={e =>  { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.onSurfaceVariant; }}>
          <Icon name={item.icon} size={17} style={{ color:'inherit' }} />{item.label}
        </button>
      ))}
      <div style={{ borderTop:`1px solid ${C.outlineVariant}20` }}>
        <button onClick={handleSignOut} style={{ width:'100%', padding:'11px 20px', background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:10, color:C.error, fontFamily:"'DM Sans',sans-serif", fontSize:13, textAlign:'left', transition:'background 0.15s' }}
          onMouseOver={e => e.currentTarget.style.background = C.errorContainer+'40'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
          <Icon name="logout" size={17} style={{ color:C.error }} />Sign Out
        </button>
      </div>
    </div>
  );
}

// ── NOTIFICATIONS PANEL ───────────────────────────────────────
function NotifPanel({ events, onClose, onClear }) {
  const navigate = useNavigate();
  const sevColor = s => s==='CRITICAL' ? C.error : s==='HIGH' ? '#f97316' : C.primary;

  return (
    <div style={{ position:'fixed', top:56, right:52, width:310, zIndex:150, background:C.surfaceContainerHigh, border:`1px solid ${C.outlineVariant}30`, borderRadius:8, boxShadow:'0 8px 32px rgba(0,0,0,0.6)', overflow:'hidden' }}>
      <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.outlineVariant}20`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ color:C.onSurface, fontFamily:"'Newsreader',serif", fontSize:17 }}>Notifications</span>
        {events.length > 0 && (
          <button onClick={onClear} style={{ background:'transparent', border:'none', cursor:'pointer', color:C.onSurfaceVariant, fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'0.1em' }}>CLEAR</button>
        )}
      </div>
      <div style={{ maxHeight:320, overflowY:'auto' }}>
        {events.length === 0
          ? <div style={{ padding:24, textAlign:'center', color:C.onSurfaceVariant, fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>No new notifications</div>
          : events.map((ev, i) => (
            <div key={i} onClick={() => { onClose(); navigate('/incidents'); }} style={{ padding:'12px 18px', borderBottom:`1px solid ${C.outlineVariant}1a`, cursor:'pointer', transition:'background 0.15s' }}
              onMouseOver={e => e.currentTarget.style.background=C.surfaceContainerHighest}
              onMouseOut={e =>  e.currentTarget.style.background='transparent'}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <span style={{ color:sevColor(ev.severity), fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:9, letterSpacing:'0.1em' }}>{ev.severity||'ALERT'}</span>
                <span style={{ color:C.onSurfaceVariant, fontFamily:"'JetBrains Mono',monospace", fontSize:9 }}>LIVE</span>
              </div>
              <div style={{ color:C.onSurface, fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>{ev.title||'New incident detected'}</div>
            </div>
          ))
        }
      </div>
      <div style={{ padding:'10px 18px', borderTop:`1px solid ${C.outlineVariant}20` }}>
        <button onClick={() => { onClose(); navigate('/incidents'); }} style={{ width:'100%', padding:9, background:'transparent', border:`1px solid ${C.outlineVariant}30`, borderRadius:4, color:C.onSurface, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:10, letterSpacing:'0.1em', cursor:'pointer' }}>
          VIEW ALL INCIDENTS
        </button>
      </div>
    </div>
  );
}

// ── TOAST RENDERER ────────────────────────────────────────────
function ToastRenderer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const handler = e => {
      const id = Date.now() + Math.random();
      setToasts(t => [...t, { id, ...e.detail }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
    };
    window.addEventListener('tl:toast', handler);
    return () => window.removeEventListener('tl:toast', handler);
  }, []);
  const bg    = t => t==='error' ? C.errorContainer : t==='warning' ? '#7a4a00' : t==='info' ? C.secondaryContainer : '#0d3d1f';
  const color = t => t==='error' ? C.error : t==='warning' ? '#f97316' : t==='info' ? C.secondary : '#2ed573';
  const icn   = t => t==='error' ? 'error' : t==='warning' ? 'warning' : 'check_circle';
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:300, display:'flex', flexDirection:'column', gap:8, pointerEvents:'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ padding:'12px 18px', borderRadius:6, background:bg(t.type), border:`1px solid ${color(t.type)}40`, color:color(t.type), fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, boxShadow:'0 4px 16px rgba(0,0,0,0.4)', animation:'slideIn 0.2s ease', display:'flex', alignItems:'center', gap:8, maxWidth:380 }}>
          <Icon name={icn(t.type)} size={17} style={{ color:'inherit', flexShrink:0 }} />{t.msg}
        </div>
      ))}
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────
function Sidebar({ onNewAnalysis }) {
  const { pathname } = useLocation();
  return (
    <nav style={{ position:'fixed', left:0, top:0, width:288, height:'100vh', background:C.surfaceContainerLow, borderRight:`1px solid ${C.outlineVariant}26`, display:'flex', flexDirection:'column', padding:'28px 16px', zIndex:50, fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28, padding:'0 8px' }}>
        <div style={{ width:40, height:40, borderRadius:'50%', background:C.surfaceContainerHigh, border:`1px solid ${C.goldBorder}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon name="admin_panel_settings" size={20} fill style={{ color:C.primary }} />
        </div>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:C.primary, lineHeight:1, fontFamily:"'Newsreader',serif" }}>ThreatLens</div>
          <div style={{ fontSize:10, letterSpacing:'0.12em', fontWeight:700, color:C.onSurfaceVariant, marginTop:4, textTransform:'uppercase' }}>V2.0 Command Center</div>
        </div>
      </div>
      <button onClick={onNewAnalysis} style={{ width:'100%', marginBottom:24, background:C.primaryContainer, color:C.onPrimary, border:`1px solid ${C.primary}4d`, borderRadius:4, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:12, letterSpacing:'0.1em', fontWeight:700, textTransform:'uppercase', cursor:'pointer', transition:'background 0.15s' }}
        onMouseOver={e => e.currentTarget.style.background=C.primary}
        onMouseOut={e => e.currentTarget.style.background=C.primaryContainer}>
        <Icon name="add" size={18} /> New Analysis
      </button>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.path || (pathname==='/' && item.path==='/overview');
          return (
            <Link key={item.path} to={item.path} style={{ textDecoration:'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderRadius:4, background: active ? `${C.primary}0d` : 'transparent', borderRight: active ? `2px solid ${C.primary}` : '2px solid transparent', color: active ? C.primary : C.onSurfaceVariant, fontWeight: active ? 700 : 500, fontSize:15, cursor:'pointer', transition:'all 0.15s' }}
                onMouseOver={e => { if(!active){ e.currentTarget.style.background=C.surfaceContainerHigh; e.currentTarget.style.color=C.primary; }}}
                onMouseOut={e =>  { if(!active){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.onSurfaceVariant; }}}>
                <Icon name={item.icon} size={21} fill={active} style={{ color:'inherit' }} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
      <div style={{ borderTop:`1px solid ${C.outlineVariant}26`, paddingTop:12 }}>
        <Link to="/settings" style={{ textDecoration:'none' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', borderRadius:4, color:C.onSurfaceVariant, fontSize:14, cursor:'pointer', transition:'all 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.background=C.surfaceContainerHigh; e.currentTarget.style.color=C.primary; }}
            onMouseOut={e =>  { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.onSurfaceVariant; }}>
            <Icon name="settings" size={19} /><span>Settings</span>
          </div>
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', borderRadius:4, color:C.onSurfaceVariant, fontSize:14, cursor:'pointer', transition:'all 0.15s' }}
          onMouseOver={e => { e.currentTarget.style.background=C.surfaceContainerHigh; e.currentTarget.style.color=C.primary; }}
          onMouseOut={e =>  { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.onSurfaceVariant; }}>
          <Icon name="contact_support" size={19} /><span>Support</span>
        </div>
      </div>
    </nav>
  );
}

// ── TOP BAR ───────────────────────────────────────────────────
function TopBar({ placeholder, notifCount, onNotif, onProfile, showProfile }) {
  const [time, setTime] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const tick = () => { const n = new Date(); setTime(n.toUTCString().slice(17,22) + ' UTC'); };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSearch = e => {
    if (e.key === 'Enter' && search.trim()) {
      sessionStorage.setItem('tl_threat_search', search.trim());
      navigate('/threats');
    }
  };

  return (
    <header style={{ flexShrink:0, height:64, zIndex:40, background:'rgba(6,20,35,0.92)', backdropFilter:'blur(12px)', borderBottom:`1px solid ${C.outlineVariant}26`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ display:'flex', alignItems:'center', gap:20, flex:1 }}>
        <div style={{ fontSize:18, fontWeight:500, color:C.primary, fontFamily:"'Newsreader',serif", whiteSpace:'nowrap' }}>ThreatLens V2.0</div>
        <div style={{ position:'relative', maxWidth:360, width:'100%' }}>
          <Icon name="search" size={16} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:C.onSurfaceVariant }} />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch}
            placeholder={placeholder || 'Search threats, assets, CVEs... (Enter)'}
            style={{ width:'100%', background:C.surfaceContainer, border:`1px solid ${C.outlineVariant}80`, borderRadius:4, padding:'7px 12px 7px 32px', color:C.onSurface, fontSize:13, outline:'none', fontFamily:"'JetBrains Mono',monospace" }}
            onFocus={e => e.target.style.borderColor=C.primary+'80'}
            onBlur={e =>  e.target.style.borderColor=C.outlineVariant+'80'}
          />
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, paddingRight:16, borderRight:`1px solid ${C.outlineVariant}26` }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.onSurfaceVariant }}>System: Nominal</span>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.primary }}>{time}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          {/* Bell */}
          <button onClick={onNotif} style={{ width:34, height:34, borderRadius:'50%', background:'transparent', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:C.onSurfaceVariant, position:'relative', transition:'all 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.background=C.surfaceContainer; e.currentTarget.style.color=C.primary; }}
            onMouseOut={e =>  { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.onSurfaceVariant; }}>
            <Icon name="notifications" size={21} />
            {notifCount > 0 && <span style={{ position:'absolute', top:4, right:4, width:15, height:15, borderRadius:'50%', background:C.error, border:`2px solid ${C.bg}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:8, fontWeight:700 }}>{notifCount > 9 ? '9+' : notifCount}</span>}
          </button>
          {/* Profile */}
          <button onClick={onProfile} style={{ width:34, height:34, borderRadius:'50%', background: showProfile ? C.primaryContainer : C.surfaceContainerHigh, border:`1px solid ${showProfile ? C.primary+'60' : C.outlineVariant+'30'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color: showProfile ? C.onPrimary : C.primary, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, transition:'all 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.background=C.primaryContainer; e.currentTarget.style.color=C.onPrimary; }}
            onMouseOut={e =>  { e.currentTarget.style.background=showProfile ? C.primaryContainer : C.surfaceContainerHigh; e.currentTarget.style.color=showProfile ? C.onPrimary : C.primary; }}>
            V
          </button>
        </div>
      </div>
    </header>
  );
}

// ── LAYOUT WRAPPER ────────────────────────────────────────────
export default function Layout({ children, searchPlaceholder }) {
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);
  const [showProfile,     setShowProfile]     = useState(false);
  const [showNotifs,      setShowNotifs]      = useState(false);
  const [notifCount,      setNotifCount]      = useState(0);
  const [liveEvents,      setLiveEvents]      = useState([]);

  useEffect(() => {
    const handler = data => {
      setLiveEvents(prev => [data, ...prev].slice(0, 15));
      setNotifCount(n => n + 1);
    };
    socket.on('new_incident', handler);
    return () => socket.off('new_incident', handler);
  }, []);

  const closeAll = () => { setShowProfile(false); setShowNotifs(false); };

  return (
    <div style={{ height:'100vh', overflow:'hidden', display:'flex', background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>
      <Sidebar onNewAnalysis={() => { closeAll(); setShowNewAnalysis(true); }} />
      <div style={{ marginLeft:288, flex:1, height:'100vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <TopBar
          placeholder={searchPlaceholder}
          notifCount={notifCount}
          showProfile={showProfile}
          onProfile={() => { setShowProfile(p => !p); setShowNotifs(false); }}
          onNotif={() => { setShowNotifs(n => !n); setShowProfile(false); if (!showNotifs) setNotifCount(0); }}
        />
        {/* THIS IS THE SCROLL CONTAINER */}
        <main style={{ flex:1, overflowY:'auto', overflowX:'hidden' }}>
          {children}
        </main>
      </div>

      {showNewAnalysis && <NewAnalysisModal onClose={() => setShowNewAnalysis(false)} />}
      {showProfile && (
        <div style={{ position:'fixed', inset:0, zIndex:140 }} onClick={() => setShowProfile(false)}>
          <div onClick={e => e.stopPropagation()}><ProfileDropdown onClose={() => setShowProfile(false)} /></div>
        </div>
      )}
      {showNotifs && (
        <div style={{ position:'fixed', inset:0, zIndex:140 }} onClick={() => setShowNotifs(false)}>
          <div onClick={e => e.stopPropagation()}><NotifPanel events={liveEvents} onClose={() => setShowNotifs(false)} onClear={() => { setLiveEvents([]); setNotifCount(0); }} /></div>
        </div>
      )}

      <ToastRenderer />
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(16px) } to { opacity:1; transform:translateX(0) } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.outlineVariant}80; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.outlineVariant}; }
      `}</style>
    </div>
  );
}
