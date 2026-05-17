import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/index';
import Layout, { C, Icon, toast } from '../components/Layout';

const STATUS_COLOR = { HEALTHY: '#2ed573', WARNING: '#f97316', INCIDENT: '#ffb4ab' };
const statusColor = s => STATUS_COLOR[s?.toUpperCase()] || C.onSurfaceVariant;
const statusBg    = s => (statusColor(s) + '1a');

function StatCard({ label, value, icon, iconColor }) {
  return (
    <div style={{ background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`, borderRadius: 4, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Icon name={icon} size={20} style={{ color: iconColor }} />
        <span style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 36, fontWeight: 400 }}>{value}</div>
    </div>
  );
}

export default function Endpoints() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [contextMenu, setContextMenu] = useState(null); // { index, x, y }
  const [summaryModal, setSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState({ text: '', loading: false });

  const { data: endpoints, isLoading } = useQuery({
    queryKey: ['endpoints'],
    queryFn: () => api.getEndpoints().then(r => r.data),
    refetchInterval: 15000,
  });

  const list     = endpoints || [];
  const healthy  = list.filter(e => e.status?.toUpperCase() === 'HEALTHY').length;
  const warning  = list.filter(e => e.status?.toUpperCase() === 'WARNING').length;
  const incident = list.filter(e => e.status?.toUpperCase() === 'INCIDENT').length;

  // Filter logic
  const filtered = list.filter(ep => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'healthy') return ep.status?.toUpperCase() === 'HEALTHY';
    if (statusFilter === 'incident') return ep.status?.toUpperCase() === 'INCIDENT';
    return true;
  });

  // Export CSV
  const handleExport = () => {
    const headers = 'Hostname,OS,IP,CPU,Memory,Status,Agent,Last Seen\n';
    const rows = list.map(ep =>
      `${ep.name || ''},${ep.os || ''},${ep.ip || ''},${ep.cpu ?? ''}%,${ep.mem ?? ''}%,${ep.status || ''},${ep.agent || ''},${ep.lastSeen || ''}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'threatlens-endpoints.csv';
    a.click();
    toast('Endpoint report exported as CSV', 'success');
  };

  // Context menu actions
  const handleIsolate = (ep) => {
    toast(`Isolation command sent to ${ep.name || 'endpoint'}`, 'warning');
    setContextMenu(null);
  };

  const handleViewDetails = async (ep) => {
    setContextMenu(null);
    setSummaryModal(true);
    setSummaryData({ text: '', loading: true });
    try {
      const res = await api.getEndpointSummary();
      setSummaryData({ text: res.data.summary, loading: false });
    } catch (e) {
      setSummaryData({ text: 'Failed to generate AI summary. Check backend connection.', loading: false });
    }
  };

  return (
    <Layout searchPlaceholder="Search endpoints, IPs, hostnames...">
      {/* Close context menu on click outside */}
      {contextMenu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setContextMenu(null)} />
      )}
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1440, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 44, fontWeight: 400, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
              Endpoint Monitoring
            </h2>
            <p style={{ color: C.secondary, fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.65, margin: 0 }}>
              Real-time visibility into managed assets, system health metrics, and active threat containment status.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => {
              const next = statusFilter === 'all' ? 'healthy' : statusFilter === 'healthy' ? 'incident' : 'all';
              setStatusFilter(next);
              toast(`Showing: ${next === 'all' ? 'All endpoints' : next === 'healthy' ? 'Healthy only' : 'Incidents only'}`, 'info');
            }} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
              background: 'transparent', border: `1px solid ${C.outlineVariant}30`,
              borderRadius: 4, color: C.onSurface,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer',
            }}>
              <Icon name="filter_list" size={14} /> Filter: {statusFilter === 'all' ? 'All' : statusFilter === 'healthy' ? 'Healthy' : 'Incidents'}
            </button>
            <button onClick={handleExport} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
              background: 'transparent', border: `1px solid ${C.primary}`,
              borderRadius: 4, color: C.primary,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer',
            }}>
              <Icon name="download" size={14} /> Export Report
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <StatCard label="Total Endpoints" value={list.length || '—'} icon="devices" iconColor={C.tertiary} />
          <StatCard label="Healthy" value={list.length ? healthy : '—'} icon="check_circle" iconColor="#2ed573" />
          <StatCard label="Warning" value={list.length ? warning : '—'} icon="warning" iconColor="#f97316" />
          <StatCard label="Critical" value={list.length ? incident : '—'} icon="error" iconColor={C.error} />
        </div>

        {/* Table */}
        <div style={{ background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.outlineVariant}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 500 }}>Managed Assets</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { label: 'All Status', val: 'all' },
                { label: 'Healthy Only', val: 'healthy' },
                { label: 'Incidents', val: 'incident' },
              ].map(btn => (
                <button key={btn.val} onClick={() => setStatusFilter(btn.val)} style={{
                  padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: statusFilter === btn.val ? C.surfaceContainerHigh : 'transparent',
                  color: statusFilter === btn.val ? C.onSurface : C.onSurfaceVariant,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                  transition: 'all 0.15s',
                }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.surfaceContainerHigh + '80', borderBottom: `1px solid ${C.outlineVariant}15` }}>
                  {['Hostname', 'OS / Platform', 'IP Address', 'CPU', 'Memory', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Loading endpoints...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                    {list.length === 0 ? 'No endpoints found. Backend may be offline.' : 'No endpoints match the current filter.'}
                  </td></tr>
                ) : filtered.map((ep, i) => {
                  const sc = statusColor(ep.status);
                  const cpuHigh = parseFloat(ep.cpu) > 80;
                  const memHigh = parseFloat(ep.mem) > 85;
                  return (
                    <tr key={ep.id || ep.name || i}
                      style={{ borderBottom: `1px solid ${C.outlineVariant}1a`, transition: 'background 0.15s', position: 'relative' }}
                      onMouseOver={e => e.currentTarget.style.background = C.surfaceContainerHigh + '40'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px', color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>
                        {ep.name || ep.hostname || `EP-${i + 1}`}
                      </td>
                      <td style={{ padding: '12px 16px', color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Icon name="laptop_mac" size={14} style={{ color: C.onSurfaceVariant }} />
                          {ep.os || 'Unknown'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                        {ep.ip || '—'}
                      </td>
                      <td style={{ padding: '12px 16px', color: cpuHigh ? C.error : C.onSurface, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                        {ep.cpu != null ? `${ep.cpu}%` : '—'}
                      </td>
                      <td style={{ padding: '12px 16px', color: memHigh ? '#f97316' : C.onSurface, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                        {ep.mem != null ? `${ep.mem}%` : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px',
                          borderRadius: 20, background: statusBg(ep.status),
                          border: `1px solid ${sc}33`, color: sc,
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em',
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc, flexShrink: 0 }} />
                          {ep.status || 'UNKNOWN'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', position: 'relative' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setContextMenu(contextMenu?.index === i ? null : { index: i, x: e.clientX, y: e.clientY });
                          }}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.onSurfaceVariant }}
                          onMouseOver={e => e.currentTarget.style.color = C.primary}
                          onMouseOut={e => e.currentTarget.style.color = C.onSurfaceVariant}
                        >
                          <Icon name="more_vert" size={20} />
                        </button>
                        {/* Context menu */}
                        {contextMenu?.index === i && (
                          <div style={{
                            position: 'fixed', left: contextMenu.x - 160, top: contextMenu.y,
                            width: 180, zIndex: 100, background: C.surfaceContainerHigh,
                            border: `1px solid ${C.outlineVariant}30`, borderRadius: 8,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)', overflow: 'hidden',
                          }}>
                            {[
                              { label: 'View Details', icon: 'info', action: () => handleViewDetails(ep) },
                              { label: 'Isolate Machine', icon: 'shield', action: () => handleIsolate(ep), color: C.error },
                              { label: 'Run Scan', icon: 'radar', action: () => { toast(`Scan initiated on ${ep.name}`, 'info'); setContextMenu(null); } },
                            ].map(item => (
                              <button key={item.label} onClick={item.action} style={{
                                width: '100%', padding: '10px 14px', background: 'transparent',
                                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                                color: item.color || C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif",
                                fontSize: 13, textAlign: 'left', transition: 'background 0.15s',
                              }}
                                onMouseOver={e => e.currentTarget.style.background = C.surfaceContainerHighest}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <Icon name={item.icon} size={16} style={{ color: 'inherit' }} /> {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 16px', borderTop: `1px solid ${C.outlineVariant}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
              {isLoading ? 'Loading...' : `Showing ${filtered.length} of ${list.length} endpoints`}
            </span>
          </div>
        </div>
      </div>

      {/* AI Summary Modal */}
      {summaryModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div style={{ width: 500, background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`, borderRadius: 8, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.outlineVariant}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.surfaceContainerHigh }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="psychology" size={24} style={{ color: C.primary }} />
                <span style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 20 }}>AI Endpoint Summary</span>
              </div>
              <button onClick={() => setSummaryModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.onSurfaceVariant }}>
                <Icon name="close" size={24} />
              </button>
            </div>
            <div style={{ padding: 24, minHeight: 120 }}>
              {summaryData.loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: C.primary, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '20px 0' }}>
                  <Icon name="sync" size={24} style={{ animation: 'spin 1s linear infinite' }} />
                  Generating SOC analysis...
                </div>
              ) : (
                <p style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  {summaryData.text}
                </p>
              )}
            </div>
            <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.outlineVariant}20`, display: 'flex', justifyContent: 'flex-end', background: C.surfaceContainerLow }}>
              <button onClick={() => setSummaryModal(false)} style={{ padding: '8px 16px', background: C.primary, color: C.onPrimary, border: 'none', borderRadius: 4, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </Layout>
  );
}
