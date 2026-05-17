import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, socket } from '../api/index';
import Layout, { C, Icon, toast } from '../components/Layout';

const SEV_COLOR = { CRITICAL: '#ffb4ab', HIGH: '#f97316', MEDIUM: '#ffa502', LOW: '#2ed573' };
const sevColor = s => SEV_COLOR[s?.toUpperCase()] || C.onSurfaceVariant;

const PHASES = ['Isolate Host', 'Dump Memory', 'Kill Malicious PID', 'Restore Snapshot'];

export default function Incidents() {
  const queryClient = useQueryClient();
  const [liveCount, setLiveCount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [sevFilter, setSevFilter] = useState('ALL');
  const [timelineMode, setTimelineMode] = useState('live'); // 'tminus' | 'live'
  const [expandedReport, setExpandedReport] = useState(null);
  const [sandboxLoading, setSandboxLoading] = useState({});
  const [sandboxResult, setSandboxResult] = useState(null);

  const { data: incidents, isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => api.getIncidents().then(r => r.data),
    refetchInterval: 20000,
  });

  useEffect(() => {
    const handler = () => {
      setLiveCount(c => c + 1);
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    };
    socket.on('new_incident', handler);
    return () => socket.off('new_incident', handler);
  }, [queryClient]);

  const list = incidents || [];

  // Filter incidents by unresolved and severity
  const activeList = list.filter(inc => !inc.resolved);
  const filtered = sevFilter === 'ALL' ? activeList : activeList.filter(inc => inc.severity?.toUpperCase() === sevFilter);

  // Export CSV
  const handleExport = () => {
    const headers = 'ID,Title,Severity,Machine,Created At\n';
    const rows = list.map(inc =>
      `${inc.id || ''},${(inc.title || '').replace(/,/g, ' ')},${inc.severity || ''},${inc.machine || ''},${inc.created_at || ''}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'threatlens-incidents.csv';
    a.click();
    toast('Incidents exported as CSV', 'success');
  };

  return (
    <Layout searchPlaceholder="Search incidents, hashes, endpoints...">
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1440, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 44, fontWeight: 400, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
              Tactical Response
            </h2>
            <p style={{ color: C.secondary, fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.65, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              Active campaigns requiring immediate remediation
              {liveCount > 0 && (
                <span style={{ padding: '2px 8px', background: C.error + '1a', border: `1px solid ${C.error}33`, borderRadius: 20, color: C.error, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                  +{liveCount} new
                </span>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setShowFilter(f => !f)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
              background: showFilter ? C.surfaceContainerHigh : 'transparent',
              border: `1px solid ${showFilter ? C.primary + '60' : C.outlineVariant + '30'}`,
              borderRadius: 4, color: showFilter ? C.primary : C.onSurface,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer',
            }}>
              <Icon name="filter_list" size={14} /> Filter
            </button>
            <button onClick={handleExport} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
              background: 'transparent', border: `1px solid ${C.primary}`,
              borderRadius: 4, color: C.primary,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer',
            }}>
              <Icon name="download" size={14} /> Export
            </button>
          </div>
        </div>

        {/* Filter bar */}
        {showFilter && (
          <div style={{ display: 'flex', gap: 6, padding: '12px 16px', background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`, borderRadius: 4 }}>
            <span style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginRight: 8, display: 'flex', alignItems: 'center' }}>Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
              <button key={f} onClick={() => setSevFilter(f)} style={{
                padding: '5px 12px', borderRadius: 4, border: 'none', cursor: 'pointer',
                background: sevFilter === f ? (sevColor(f) + '1a') : 'transparent',
                color: sevFilter === f ? (f === 'ALL' ? C.primary : sevColor(f)) : C.onSurfaceVariant,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10,
                letterSpacing: '0.1em', transition: 'all 0.15s',
              }}>{f}</button>
            ))}
          </div>
        )}

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

          {/* Active Playbooks */}
          <section style={{ background: C.surfaceContainer, border: `1px solid ${C.outlineVariant}15`, borderRadius: 4, padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(236,193,85,0.03) 1px, transparent 0)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.outlineVariant}15` }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 500, margin: 0 }}>
                  <Icon name="view_timeline" size={22} style={{ color: C.primary }} />
                  Active AI Playbooks
                </h3>
                <span style={{ padding: '4px 12px', background: C.surfaceContainerHigh, border: `1px solid ${C.outlineVariant}30`, borderRadius: 20, color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                  {isLoading ? '…' : `${filtered.length} Operations`}
                </span>
              </div>

              {isLoading ? (
                <div style={{ padding: 24, textAlign: 'center', color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Loading incidents…</div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                  {list.length === 0 ? 'No active incidents' : 'No incidents match the current filter'}
                </div>
              ) : filtered.slice(0, 5).map((inc, i) => {
                const sc = sevColor(inc.severity);
                const phase = inc.phase ?? (i % 4);
                return (
                  <div key={inc.id || i} style={{
                    background: C.surface, border: `1px solid ${C.outlineVariant}1a`,
                    borderRadius: 4, padding: 16, marginBottom: 16, transition: 'border-color 0.15s',
                  }}
                    onMouseOver={e => e.currentTarget.style.borderColor = C.primary + '30'}
                    onMouseOut={e => e.currentTarget.style.borderColor = C.outlineVariant + '1a'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: 2, border: `1px solid ${sc}33`,
                            background: sc + '1a', color: sc,
                            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.1em',
                          }}>
                            {inc.severity || 'CRITICAL'}
                          </span>
                          <span style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>
                            {inc.title || 'Unnamed Incident'}
                          </span>
                        </div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                          <Icon name="desktop_windows" size={13} style={{ color: C.onSurfaceVariant }} />
                          {inc.machine || 'Unknown Host'}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                        <span style={{ display: 'block', color: C.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
                          Phase {phase + 1} / 4
                        </span>
                        <span style={{ color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                          {inc.created_at ? new Date(inc.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' UTC' : '—'}
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        {PHASES.map((p, pi) => (
                          <span key={p} style={{ color: pi === phase ? C.primary : C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {p}
                          </span>
                        ))}
                      </div>
                      <div style={{ height: 6, background: C.surfaceContainerHigh, borderRadius: 3, display: 'flex', overflow: 'hidden' }}>
                        {PHASES.map((_, pi) => (
                          <div key={pi} style={{
                            flex: 1, marginRight: pi < 3 ? 2 : 0,
                            background: pi < phase ? C.onSurfaceVariant + '4d'
                              : pi === phase ? C.primary
                              : 'transparent',
                            position: 'relative', overflow: 'hidden',
                          }}>
                            {pi === phase && (
                              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.2)', animation: 'pulse 1.5s infinite' }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button onClick={() => {
                        api.resolveThreat(inc.id).then(() => {
                          queryClient.invalidateQueries({ queryKey: ['incidents'] });
                          toast(`Incident "${inc.title}" resolved`, 'success');
                        });
                      }} style={{
                        padding: '6px 12px', background: '#2ed57314', border: '1px solid #2ed57330',
                        borderRadius: 4, color: '#2ed573', fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', cursor: 'pointer',
                      }}>RESOLVE</button>
                      <button onClick={() => toast(`Escalated: ${inc.title} — SOC team notified`, 'warning')} style={{
                        padding: '6px 12px', background: C.error + '14', border: `1px solid ${C.error}30`,
                        borderRadius: 4, color: C.error, fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', cursor: 'pointer',
                      }}>ESCALATE</button>
                      <button onClick={async () => {
                        setSandboxLoading(prev => ({ ...prev, [inc.id]: true }));
                        try {
                          const res = await api.analyzeThreatInSandbox(inc.id);
                          setSandboxResult({ ...res.data, title: inc.title, id: inc.id });
                          if (res.data.verdict === 'SAFE') {
                            toast(`Sandbox determined SAFE. Incident "${inc.title}" auto-resolved.`, 'success');
                            queryClient.invalidateQueries({ queryKey: ['incidents'] });
                          } else {
                            toast(`Sandbox detonation complete: MALICIOUS`, 'error');
                          }
                        } catch (err) {
                          toast('Sandbox analysis failed', 'error');
                        }
                        setSandboxLoading(prev => ({ ...prev, [inc.id]: false }));
                      }} style={{
                        padding: '6px 12px', background: C.surfaceContainerHigh, border: `1px solid ${C.outlineVariant}30`,
                        borderRadius: 4, color: C.primary, fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        {sandboxLoading[inc.id] ? <Icon name="sync" size={12} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                        ANALYSE IN SANDBOX
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Detonation / Sandbox results */}
          <section style={{ background: C.surfaceContainer, border: `1px solid ${C.outlineVariant}15`, borderRadius: 4, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.outlineVariant}15` }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 500, margin: 0 }}>
                <Icon name="science" size={22} style={{ color: C.error }} />
                Detonation
              </h3>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 }}>
              {/* Score ring */}
              <div style={{ position: 'relative', width: 120, height: 120 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke={C.surfaceContainerHigh} strokeWidth="2" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke={sandboxResult?.verdict === 'SAFE' ? '#2ed573' : C.error} strokeWidth="2" strokeDasharray={`${sandboxResult?.score || 0}, 100`} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: sandboxResult?.verdict === 'SAFE' ? '#2ed573' : C.error, fontFamily: "'Newsreader', serif", fontSize: 40, fontWeight: 400, lineHeight: 1 }}>{sandboxResult?.score || '--'}</span>
                  <span style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.1em' }}>/100</span>
                </div>
              </div>
              <div>
                <div style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{sandboxResult?.title || 'No Threat Selected'}</div>
                <div style={{ display: 'inline-block', padding: '4px 8px', background: C.surfaceContainerHigh, border: `1px solid ${C.outlineVariant}20`, borderRadius: 2, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: C.onSurfaceVariant, wordBreak: 'break-all' }}>
                  {sandboxResult ? `Analysis for ${sandboxResult.id}` : 'Click "Analyse in Sandbox"'}
                </div>
              </div>
            </div>
            {sandboxResult && (
              <>
                <div style={{ marginTop: 16 }}>
                  <div style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${C.outlineVariant}1a` }}>
                    Behavioral Explanations
                  </div>
                  <div style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>
                    {sandboxResult.explanation}
                  </div>
                </div>
                <button onClick={() => {
                  setExpandedReport(r => r ? null : 'open');
                }} style={{
                  marginTop: 12, width: '100%', padding: 10, background: 'transparent',
                  border: `1px solid ${C.outlineVariant}30`, borderRadius: 4,
                  color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                  fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                }}>
                  {expandedReport ? 'Collapse Report' : 'View Full Report'}
                </button>
                {expandedReport && (
                  <div style={{ marginTop: 12, padding: 16, background: C.surface, border: `1px solid ${C.outlineVariant}1a`, borderRadius: 4 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.onSurfaceVariant, lineHeight: 1.8 }}>
                      <div><span style={{ color: C.primary }}>Target:</span> {sandboxResult.title}</div>
                      <div><span style={{ color: C.primary }}>Verdict:</span> <span style={{ color: sandboxResult.verdict === 'SAFE' ? '#2ed573' : C.error }}>{sandboxResult.verdict}</span></div>
                      <div><span style={{ color: C.primary }}>MITRE:</span> {(sandboxResult.mitre_tags || []).join(', ') || 'None'}</div>
                      <div style={{ marginTop: 8, borderTop: `1px solid ${C.outlineVariant}15`, paddingTop: 8 }}>
                        <span style={{ color: C.primary }}>Indicators:</span>
                        {(sandboxResult.indicators || []).map((ind, i) => (
                          <div key={i} style={{ marginTop: 4 }}>{ind}</div>
                        ))}
                        {(!sandboxResult.indicators || sandboxResult.indicators.length === 0) && <div style={{ marginTop: 4 }}>None detected</div>}
                      </div>
                    </div>

                    {/* AI Remediation Playbook */}
                    {sandboxResult.playbook && sandboxResult.playbook.length > 0 && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.outlineVariant}20` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                          <Icon name="checklist" size={14} style={{ color: C.primary }} />
                          <span style={{ color: C.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            AI Remediation Playbook
                          </span>
                          <span style={{ marginLeft: 'auto', padding: '1px 6px', background: C.primary + '1a', border: `1px solid ${C.primary}33`, borderRadius: 10, color: C.primary, fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}>
                            {sandboxResult.playbook.length} steps
                          </span>
                        </div>
                        {sandboxResult.playbook.map((step, i) => (
                          <div key={i} style={{
                            display: 'flex', gap: 10, marginBottom: 8, padding: '9px 12px',
                            background: C.surfaceContainerHigh + '50', borderRadius: 3,
                            border: `1px solid ${C.outlineVariant}15`,
                          }}>
                            <span style={{
                              flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                              background: C.primary + '15', border: `1px solid ${C.primary}33`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: C.primary, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
                            }}>{i + 1}</span>
                            <span style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, paddingTop: 2 }}>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {/* Forensic Timeline */}
        <section style={{ background: C.surfaceContainer, border: `1px solid ${C.outlineVariant}15`, borderRadius: 4, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.outlineVariant}15` }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 500, margin: 0 }}>
              <Icon name="linear_scale" size={22} style={{ color: C.primary }} />
              Execution Timeline — {list[0]?.id ? `INC-${list[0].id}` : 'INC-2094'}
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: 'T-minus 1H', val: 'tminus' },
                { label: 'Live Data', val: 'live' },
              ].map(({ label, val }) => (
                <span key={val} onClick={() => { setTimelineMode(val); toast(`Timeline: ${label}`, 'info'); }} style={{
                  padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                  background: timelineMode === val ? C.primary + '1a' : C.surfaceContainerHigh,
                  border: `1px solid ${timelineMode === val ? C.primary + '33' : C.outlineVariant + '20'}`,
                  color: timelineMode === val ? C.primary : C.onSurface,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  transition: 'all 0.15s',
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', marginLeft: 16, paddingLeft: 32, borderLeft: `1px solid ${C.outlineVariant}30` }}>
            {[
              { time: list[0]?.created_at ? new Date(list[0].created_at).toISOString().slice(11, 19) + ' UTC' : '14:02:11 UTC', label: 'Initial Access', desc: 'Compromised credentials used via VPN endpoint.', meta: 'SRC: 198.51.100.42', color: C.onSurfaceVariant, active: false },
              { time: '14:05:44 UTC', label: 'Payload Dropped', desc: 'File written to C:\\Windows\\Temp\\updater.exe', meta: null, color: C.error, active: false },
              { time: '14:10:05 UTC — PRESENT', label: 'Lateral Movement', desc: 'Multiple SMB authentication attempts to internal subnets.', meta: 'Isolating Subnet VLAN-40', color: C.onSurface, active: true },
            ].map(({ time, label, desc, meta, color, active }, i) => (
              <div key={i} style={{ position: 'relative', paddingBottom: i < 2 ? 32 : 0 }}>
                <div style={{
                  position: 'absolute', left: -40, top: 4, width: 12, height: 12, borderRadius: '50%',
                  background: active ? C.primary : C.surface,
                  border: `2px solid ${active ? C.primary : (color === C.error ? C.error : C.onSurfaceVariant)}`,
                  boxShadow: active ? `0 0 12px ${C.primary}80` : 'none',
                  animation: active ? 'pulse 1.5s infinite' : 'none',
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ display: 'block', marginBottom: 4, color: C.primary, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{time}</span>
                    <h4 style={{ color, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, margin: '0 0 4px' }}>{label}</h4>
                    <p style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontSize: 13, margin: 0 }}>{desc}</p>
                  </div>
                  {meta && (
                    <div style={{ padding: '8px 12px', background: active ? C.primary + '1a' : C.surface, border: `1px solid ${active ? C.primary + '33' : C.outlineVariant + '1a'}`, borderRadius: 4 }}>
                      {active && <span style={{ display: 'block', color: C.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', marginBottom: 2 }}>Playbook Triggered</span>}
                      <span style={{ color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{meta}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </Layout>
  );
}
