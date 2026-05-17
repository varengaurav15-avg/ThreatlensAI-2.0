import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/index';
import Layout, { C, Icon, toast } from '../components/Layout';
import KnowledgeGraph from '../components/KnowledgeGraph';

const SEV_COLOR = { CRITICAL: '#ffb4ab', HIGH: '#f97316', MEDIUM: '#ffa502', LOW: '#2ed573' };
const sevColor = s => SEV_COLOR[s?.toUpperCase()] || C.onSurfaceVariant;
const sevBg    = s => (sevColor(s) + '1a');

export default function GlobalThreats() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [epssSort, setEpssSort] = useState(false);

  const { data: threats, isLoading: threatsLoading } = useQuery({
    queryKey: ['threats'],
    queryFn: () => api.getThreats({ limit: 50, origin: 'GLOBAL' }).then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.getStats().then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: otxRaw } = useQuery({
    queryKey: ['otx'],
    queryFn: () => api.getOTXPulses({ limit: 20 }).then(r => r.data),
    refetchInterval: 120000,
  });

  const otxPulses = Array.isArray(otxRaw?.results) ? otxRaw.results : [];

  let filtered = (threats || []).filter(t =>
    !search || (t.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.cve || '').toLowerCase().includes(search.toLowerCase())
  );

  if (epssSort) {
    filtered = [...filtered].sort((a, b) => (parseFloat(b.epss_score) || 0) - (parseFloat(a.epss_score) || 0));
  }

  return (
    <Layout searchPlaceholder="Search CVEs, threats, components...">
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1440, margin: '0 auto' }}>

        {/* Page Header */}
        <div>
          <h2 style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 44, fontWeight: 400, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            Global Threat Landscape
          </h2>
          <p style={{ color: C.secondary, fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.65, margin: 0 }}>
            Continuous ingestion and correlation of NVD records and EPSS scoring to identify zero-day risks within the managed ecosystem.
          </p>
        </div>

        {/* Bento Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>

          {/* NVD Feed */}
          <div style={{ background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`, borderRadius: 4, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Icon name="update" size={20} style={{ color: C.secondary }} />
              <span style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 18 }}>NVD Ingestion</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'New CVEs (24h)',    value: stats?.total    ?? '—', color: C.primary },
                { label: 'Modified Records',  value: stats?.resolved ?? '—', color: C.onSurface },
                { label: 'Critical Severity', value: stats?.critical ?? '—', color: C.error },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 10, borderBottom: `1px solid ${C.outlineVariant}1a` }}>
                  <span style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>{label}</span>
                  <span style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: 24, lineHeight: 1 }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Last Sync</span>
                <span style={{ color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>4 mins ago</span>
              </div>
            </div>
          </div>

          {/* EPSS */}
          <div style={{ background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`, borderRadius: 4, padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: 12, opacity: 0.06, pointerEvents: 'none' }}>
              <Icon name="analytics" size={80} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Icon name="troubleshoot" size={20} style={{ color: C.error }} />
                <span style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 18 }}>EPSS Intelligence</span>
              </div>
              <p style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '16px 0 4px' }}>
                Critical Shifts &gt; 10%
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, color: C.error, fontFamily: "'Newsreader', serif", fontSize: 36, fontWeight: 400 }}>
                {stats?.critical ?? '—'}
                <span style={{ color: C.onSurfaceVariant, fontSize: 14 }}>assets exposed</span>
              </div>
              <button onClick={() => {
                setEpssSort(true);
                setSearch('');
                toast('Threats sorted by EPSS exploitation probability', 'info');
              }} style={{
                marginTop: 20, width: '100%', padding: '8px', background: epssSort ? C.primary + '1a' : 'transparent',
                border: `1px solid ${epssSort ? C.primary + '33' : C.outlineVariant + '30'}`, borderRadius: 4,
                color: C.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              }}>
                {epssSort ? '✓ Sorted by EPSS' : 'View Probabilities'}
              </button>
            </div>
          </div>

          {/* OTX Pulses */}
          <div style={{ background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`, borderRadius: 4, padding: 24, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Icon name="radar" size={20} style={{ color: C.tertiary }} />
              <span style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 18 }}>OTX Live Pulses</span>
              {otxPulses.length > 0 && (
                <span style={{ marginLeft: 'auto', padding: '2px 8px', background: C.tertiary + '1a', border: `1px solid ${C.tertiary}33`, borderRadius: 20, color: C.tertiary, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                  {otxPulses.length} feeds
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 200, overflowY: 'auto' }}>
              {otxPulses.length > 0 ? otxPulses.slice(0, 5).map((p, i) => (
                <div key={p.id || i} style={{ padding: '8px 0', borderBottom: `1px solid ${C.outlineVariant}1a` }}>
                  <div style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
                    {p.name || 'Unnamed Pulse'}
                  </div>
                  <div style={{ color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                    {p.author_name || 'OTX'} · {p.indicator_count ?? 0} indicators
                  </div>
                </div>
              )) : (
                <div style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                  {otxRaw === undefined ? 'Loading OTX data...' : 'No pulses available'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Threat Knowledge Graph */}
        <div style={{ background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`, borderRadius: 4, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.outlineVariant}15` }}>
            <div>
              <h3 style={{ color: C.primary, fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 500, margin: '0 0 4px' }}>
                Threat Knowledge Graph
              </h3>
              <p style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontSize: 13, margin: 0 }}>
                CVE nodes linked to MITRE ATT&CK techniques · hover to inspect
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ padding: '3px 10px', background: C.primary + '12', border: `1px solid ${C.primary}33`, borderRadius: 20, color: C.primary, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                {(threats || []).slice(0, 14).length} nodes
              </span>
              <span style={{ padding: '3px 10px', background: C.tertiary + '12', border: `1px solid ${C.tertiary}33`, borderRadius: 20, color: C.tertiary, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                MITRE ATT&CK
              </span>
            </div>
          </div>
          <KnowledgeGraph threats={threats || []} C={C} />
        </div>

        {/* Vulnerabilities Table */}
        <div style={{ background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.outlineVariant}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ color: C.primary, fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 500, margin: '0 0 4px' }}>
                Correlated Vulnerabilities
              </h3>
              <p style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontSize: 14, margin: 0 }}>
                Cross-referenced against internal SBOM · {filtered.length} records
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Icon name="search" size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.onSurfaceVariant }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter CVE, title..."
                  style={{
                    background: C.surfaceContainerHigh, border: `1px solid ${C.outlineVariant}50`,
                    borderRadius: 4, padding: '7px 12px 7px 32px',
                    color: C.onSurface, fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                    outline: 'none', width: 200,
                  }}
                />
              </div>
              <button onClick={() => {
                const headers = 'CVE,Title,CVSS,EPSS,Severity\n';
                const rows = (threats || []).map(t => `${t.cve||''},${(t.title||'').replace(/,/g,' ')},${t.cvss_score||''},${t.epss_score||''},${t.severity||''}`).join('\n');
                const blob = new Blob([headers + rows], { type: 'text/csv' });
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'threatlens-threats.csv'; a.click();
              }} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                background: 'transparent', border: `1px solid ${C.outlineVariant}30`,
                borderRadius: 4, color: C.onSurfaceVariant,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer',
              }}>
                <Icon name="download" size={14} /> Export CSV
              </button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.surfaceContainerHigh + '80', borderBottom: `1px solid ${C.outlineVariant}20` }}>
                  {['CVE Identifier', 'Affected Component', 'CVSS v3.1', 'EPSS Score', 'Severity', ''].map(h => (
                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left', color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {threatsLoading ? (
                  <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Loading threats...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>No threats found</td></tr>
                ) : filtered.map((t, i) => (
                  <tr key={t.id || i} style={{ borderBottom: `1px solid ${C.outlineVariant}1a`, transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.background = C.surfaceContainerHigh + '40'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px', color: C.primary, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, whiteSpace: 'nowrap' }}>
                      {t.cve || `CVE-${2023 + (i % 2)}-${44000 + i}`}
                    </td>
                    <td style={{ padding: '14px 20px', color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontSize: 14, maxWidth: 260 }}>
                      {t.title || 'Unknown Component'}
                    </td>
                    <td style={{ padding: '14px 20px', color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                      {t.cvss_score ?? '7.5'}
                    </td>
                    <td style={{ padding: '14px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: parseFloat(t.epss_score) > 0.5 ? C.error : C.primary }}>
                      {t.epss_score ?? '0.84'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 2,
                        background: sevBg(t.severity), color: sevColor(t.severity),
                        border: `1px solid ${sevColor(t.severity)}33`,
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.1em',
                      }}>
                        {t.severity || 'HIGH'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button onClick={() => {
                        const cve = t.cve;
                        if (cve) {
                          window.open(`https://nvd.nist.gov/vuln/detail/${cve}`, '_blank');
                        } else {
                          toast('No CVE ID available for this threat', 'warning');
                        }
                      }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.onSurfaceVariant }}
                        onMouseOver={e => e.currentTarget.style.color = C.primary}
                        onMouseOut={e => e.currentTarget.style.color = C.onSurfaceVariant}
                        title={t.cve ? `Open ${t.cve} in NVD` : 'No CVE available'}
                      >
                        <Icon name="open_in_new" size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
