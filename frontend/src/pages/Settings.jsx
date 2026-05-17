import { useState, useEffect } from 'react';
import { api } from '../api/index';
import Layout, { C, Icon, toast } from '../components/Layout';

const TABS = ['monitoring', 'response', 'ai', 'notifications', 'api keys'];

function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
      background: on ? C.primary : C.surfaceContainerHigh, position: 'relative',
      transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 22 : 3, width: 18, height: 18,
        borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
      }} />
    </button>
  );
}

function Row({ label, desc, on, onToggle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 0', borderBottom: `1px solid ${C.outlineVariant}15`,
    }}>
      <div>
        <div style={{ fontSize: 14, color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: C.onSurfaceVariant, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{desc}</div>}
      </div>
      <Toggle on={on} onChange={onToggle} />
    </div>
  );
}

const API_KEY_META = [
  { key: 'NVD_API_KEY',              label: 'NVD API Key',              desc: 'National Vulnerability Database — CVE ingestion', url: 'https://nvd.nist.gov/developers/request-an-api-key' },
  { key: 'OTX_API_KEY',              label: 'AlienVault OTX Key',       desc: 'Open Threat Exchange — pulse & indicator feeds',  url: 'https://otx.alienvault.com/api' },
  { key: 'ABUSEIPDB_API_KEY',        label: 'AbuseIPDB API Key',        desc: 'IP reputation & blacklist data',                  url: 'https://www.abuseipdb.com/account/api' },
  { key: 'VIRUSTOTAL_API_KEY',       label: 'VirusTotal API Key',       desc: 'File & URL scanning, hash lookups',               url: 'https://www.virustotal.com/gui/my-apikey' },
  { key: 'HYBRID_ANALYSIS_API_KEY',  label: 'Hybrid Analysis Key',      desc: 'CrowdStrike sandbox — file detonation',           url: 'https://www.hybrid-analysis.com/my-account?tab=api' },
  { key: 'OPENAI_API_KEY',           label: 'OpenAI API Key',           desc: 'GPT-4o for AI summaries & morning briefs',        url: 'https://platform.openai.com/api-keys' },
];

export default function Settings() {
  const [cfg, setCfg] = useState(null);
  const [keys, setKeys] = useState({});
  const [tab, setTab] = useState('monitoring');
  const [saving, setSaving] = useState(false);
  const [savingKeys, setSavingKeys] = useState(false);
  const [showKey, setShowKey] = useState({});

  useEffect(() => {
    api.getConfig().then(r => setCfg(r.data)).catch(() => setCfg({
      process: true, network: true, filesystem: true, logs: true,
      responseMode: 'conservative', aiEnabled: true, apiKey: '',
      startOnBoot: false,
      notifications: { desktop: true, tray: true, sound: false },
    }));
    api.getApiKeys().then(r => setKeys(r.data)).catch(() => setKeys({}));
  }, []);

  const toggle = (key, sub) => {
    if (sub) setCfg(c => ({ ...c, [key]: { ...c[key], [sub]: !c[key][sub] } }));
    else setCfg(c => ({ ...c, [key]: !c[key] }));
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      await api.saveConfig(cfg);
      toast('Settings saved successfully', 'success');
    } catch {
      toast('Could not reach backend — settings not saved', 'error');
    }
    setSaving(false);
  };

  const saveKeys = async () => {
    setSavingKeys(true);
    try {
      await api.saveApiKeys(keys);
      toast('API keys saved and loaded', 'success');
    } catch {
      toast('Could not save API keys — backend offline?', 'error');
    }
    setSavingKeys(false);
  };

  const resetConfig = () => {
    api.getConfig().then(r => setCfg(r.data)).catch(() => {});
    toast('Settings reset to last saved state', 'info');
  };

  if (!cfg) return (
    <Layout searchPlaceholder="Settings">
      <div style={{ padding: 40, color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Loading settings…</div>
    </Layout>
  );

  return (
    <Layout searchPlaceholder="Search settings...">
      <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ color: C.onSurface, fontFamily: "'Newsreader', serif", fontSize: 44, fontWeight: 400, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            Settings
          </h2>
          <p style={{ color: C.secondary, fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.65, margin: 0 }}>
            Configure monitoring behaviour, integrations, and API credentials.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 28, background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`, borderRadius: 4, padding: 4 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '10px 0', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: tab === t ? C.surfaceContainerHigh : 'transparent',
              color: tab === t ? C.primary : C.onSurfaceVariant,
              fontFamily: "'DM Sans', sans-serif", fontWeight: tab === t ? 700 : 500, fontSize: 11,
              letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.15s',
            }}>{t}</button>
          ))}
        </div>

        {/* Content Panel */}
        <div style={{ background: C.surfaceContainer, border: `1px solid ${C.goldBorder}`, borderRadius: 4, padding: '4px 28px 20px' }}>

          {/* ── MONITORING ── */}
          {tab === 'monitoring' && <>
            <Row label="Process Monitoring" desc="Track running processes and child spawns for suspicious behaviour" on={cfg.process} onToggle={() => toggle('process')} />
            <Row label="Network Monitoring" desc="Monitor outbound connections and DNS queries to known malicious IPs" on={cfg.network} onToggle={() => toggle('network')} />
            <Row label="Filesystem Watching" desc="Alert on rapid file changes in protected folders (ransomware detection)" on={cfg.filesystem} onToggle={() => toggle('filesystem')} />
            <Row label="System Log Analysis" desc="Parse Windows Event Logs for failed logins and privilege escalation" on={cfg.logs} onToggle={() => toggle('logs')} />
          </>}

          {/* ── RESPONSE ── */}
          {tab === 'response' && <>
            <div style={{ padding: '20px 0', borderBottom: `1px solid ${C.outlineVariant}15` }}>
              <div style={{ fontSize: 14, color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginBottom: 16 }}>Response Mode</div>
              {[
                { id: 'conservative', label: 'Conservative', desc: 'Alert only — no automatic actions taken' },
                { id: 'moderate',     label: 'Moderate',     desc: 'Block network on high-severity threats' },
                { id: 'aggressive',   label: 'Aggressive',   desc: 'Auto-isolate machines on CRITICAL incidents' },
              ].map(m => (
                <label key={m.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, cursor: 'pointer' }}>
                  <input type="radio" name="mode" checked={cfg.responseMode === m.id}
                    onChange={() => setCfg(c => ({ ...c, responseMode: m.id }))}
                    style={{ accentColor: C.primary, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 14, color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{m.label}</div>
                    <div style={{ fontSize: 12, color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif" }}>{m.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            <Row label="Start on Boot" desc="Launch ThreatLens AI automatically when Windows starts" on={cfg.startOnBoot} onToggle={() => toggle('startOnBoot')} />
          </>}

          {/* ── AI ── */}
          {tab === 'ai' && <>
            <Row label="Enable AI Features" desc="Use GPT-4o for threat summaries, verdicts, and daily briefs" on={cfg.aiEnabled} onToggle={() => toggle('aiEnabled')} />
            <div style={{ padding: '20px 0' }}>
              <div style={{ fontSize: 14, color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginBottom: 6 }}>OpenAI API Key</div>
              <div style={{ fontSize: 12, color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
                Required for AI summaries and the daily brief. Get yours at{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: C.primary, textDecoration: 'none' }}>platform.openai.com</a>
              </div>
              <input
                type="password"
                value={cfg.apiKey || ''}
                onChange={e => setCfg(c => ({ ...c, apiKey: e.target.value }))}
                placeholder="sk-..."
                style={{
                  width: '100%', padding: '12px 16px',
                  background: C.surface, border: `1px solid ${C.outlineVariant}50`,
                  borderRadius: 4, color: C.onSurface, fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace", outline: 'none',
                }}
              />
            </div>
          </>}

          {/* ── NOTIFICATIONS ── */}
          {tab === 'notifications' && <>
            <Row label="Desktop Notifications" desc="Windows toast notifications for new incidents" on={cfg.notifications?.desktop} onToggle={() => toggle('notifications', 'desktop')} />
            <Row label="Tray Alerts" desc="Show alerts in the Windows system tray icon" on={cfg.notifications?.tray} onToggle={() => toggle('notifications', 'tray')} />
            <Row label="Sound Alerts" desc="Play a sound when CRITICAL incidents are detected" on={cfg.notifications?.sound} onToggle={() => toggle('notifications', 'sound')} />
          </>}

          {/* ── API KEYS ── */}
          {tab === 'api keys' && <>
            <div style={{ padding: '20px 0 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Icon name="key" size={18} style={{ color: C.primary }} />
                <span style={{ color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500 }}>
                  Threat Intelligence API Keys
                </span>
              </div>
              <p style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontSize: 13, margin: '4px 0 0' }}>
                Keys are stored locally in the backend <code style={{ color: C.primary, fontSize: 12 }}>.env</code> file. They never leave your machine.
              </p>
            </div>
            {API_KEY_META.map(meta => {
              const val = keys[meta.key] || '';
              const masked = showKey[meta.key] ? val : (val ? '•'.repeat(Math.min(val.length, 40)) : '');
              const hasKey = val.length > 0;
              return (
                <div key={meta.key} style={{ padding: '16px 0', borderBottom: `1px solid ${C.outlineVariant}15` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, color: C.onSurface, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{meta.label}</span>
                        <span style={{
                          padding: '1px 8px', borderRadius: 2, fontSize: 9, fontWeight: 700,
                          letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif",
                          background: hasKey ? '#2ed57315' : C.error + '15',
                          color: hasKey ? '#2ed573' : C.error,
                          border: `1px solid ${hasKey ? '#2ed57333' : C.error + '33'}`,
                        }}>{hasKey ? 'CONFIGURED' : 'NOT SET'}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                        {meta.desc} · <a href={meta.url} target="_blank" rel="noreferrer" style={{ color: C.primary, textDecoration: 'none', fontSize: 11 }}>Get key →</a>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type={showKey[meta.key] ? 'text' : 'password'}
                      value={keys[meta.key] || ''}
                      onChange={e => setKeys(k => ({ ...k, [meta.key]: e.target.value }))}
                      placeholder={`Paste your ${meta.label}...`}
                      style={{
                        flex: 1, padding: '10px 14px',
                        background: C.surface, border: `1px solid ${C.outlineVariant}50`,
                        borderRadius: 4, color: C.onSurface, fontSize: 12,
                        fontFamily: "'JetBrains Mono', monospace", outline: 'none',
                      }}
                    />
                    <button
                      onClick={() => setShowKey(s => ({ ...s, [meta.key]: !s[meta.key] }))}
                      style={{
                        background: 'transparent', border: `1px solid ${C.outlineVariant}30`,
                        borderRadius: 4, padding: '0 10px', cursor: 'pointer', color: C.onSurfaceVariant,
                        display: 'flex', alignItems: 'center',
                      }}
                      title={showKey[meta.key] ? 'Hide key' : 'Show key'}
                    >
                      <Icon name={showKey[meta.key] ? 'visibility_off' : 'visibility'} size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
            <div style={{ padding: '20px 0 4px' }}>
              <button onClick={saveKeys} disabled={savingKeys} style={{
                width: '100%', padding: 12, background: C.primaryContainer,
                color: C.onPrimary, border: `1px solid ${C.primary}4d`, borderRadius: 4,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
                letterSpacing: '0.1em', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: savingKeys ? 0.7 : 1, transition: 'opacity 0.2s',
              }}>
                <Icon name="save" size={16} />
                {savingKeys ? 'SAVING...' : 'SAVE ALL API KEYS'}
              </button>
            </div>
          </>}
        </div>

        {/* Action buttons (for non-API-keys tabs) */}
        {tab !== 'api keys' && (
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={saveConfig} disabled={saving} style={{
              padding: '12px 28px', background: C.primaryContainer,
              color: C.onPrimary, border: `1px solid ${C.primary}4d`, borderRadius: 4,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
              letterSpacing: '0.1em', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1,
            }}>
              <Icon name="save" size={16} />
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
            <button onClick={resetConfig} style={{
              padding: '12px 20px', background: 'transparent',
              border: `1px solid ${C.outlineVariant}30`, borderRadius: 4,
              color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer',
            }}>RESET</button>
          </div>
        )}
      </div>
    </Layout>
  );
}
