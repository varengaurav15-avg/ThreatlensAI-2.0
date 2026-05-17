import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, socket } from "../api/index";

// ── FALLBACK DATA ────────────────────────────────────────────
const FALLBACK_ENDPOINTS = [
  { id:1, name:"DESKTOP-X",  os:"Windows 11",     ip:"192.168.1.42", status:"INCIDENT", lastSeen:"Just now",  incidents:2, agent:"v2.1.4", cpu:78, mem:62 },
  { id:2, name:"SERVER-01",  os:"Ubuntu 22.04",   ip:"192.168.1.10", status:"INCIDENT", lastSeen:"2 min ago", incidents:1, agent:"v2.1.4", cpu:91, mem:84 },
  { id:3, name:"LAPTOP-DEV", os:"macOS 14",       ip:"192.168.1.55", status:"HEALTHY",  lastSeen:"5 min ago", incidents:0, agent:"v2.1.4", cpu:34, mem:48 },
  { id:4, name:"WEB-SERVER", os:"Ubuntu 22.04",   ip:"192.168.1.20", status:"HEALTHY",  lastSeen:"1 min ago", incidents:0, agent:"v2.1.4", cpu:22, mem:31 },
  { id:5, name:"DB-SERVER",  os:"Windows Server", ip:"192.168.1.30", status:"WARNING",  lastSeen:"3 min ago", incidents:0, agent:"v2.1.3", cpu:55, mem:77 },
];
const FALLBACK_SOURCES = [
  { name:"NVD CVE API",      count:0, matched:0, status:"ACTIVE", interval:"15 min",    color:"#ecc155", lastSync:"--" },
  { name:"AlienVault OTX",   count:0, matched:0, status:"ACTIVE", interval:"30 min",    color:"#8b5cf6", lastSync:"--" },
  { name:"AbuseIPDB",        count:0, matched:0, status:"ACTIVE", interval:"20 min",    color:"#f97316", lastSync:"--" },
  { name:"RSS Feeds",        count:0, matched:0, status:"ACTIVE", interval:"60 min",    color:"#22c55e", lastSync:"--" },
  { name:"Endpoint Agents",  count:0, matched:0, status:"ACTIVE", interval:"Real-time", color:"#ec4899", lastSync:"Live" },
  { name:"EPSS API",         count:0, matched:0, status:"ACTIVE", interval:"Daily",     color:"#eab308", lastSync:"--" },
];

// ── DESIGN TOKENS ────────────────────────────────────────────
const C = {
  bg:         "#061423",
  surface:    "#0f1c2c",
  raised:     "#132030",
  border:     "#1e2b3b",
  borderHi:   "#283646",
  text:       "#d6e4f9",
  text2:      "#b6c6ed",
  text3:      "#9a907d",
  accent:     "#ecc155",
  accentDim:  "#b8922a",
  critical:   "#ff4757",
  high:       "#f97316",
  medium:     "#ffa502",
  low:        "#2ed573",
};

const SEV_COLOR = { CRITICAL: C.critical, HIGH: C.high, MEDIUM: C.medium, LOW: C.low };

// ── NAV ITEMS ────────────────────────────────────────────────
const NAV = [
  { id:"overview",  label:"Overview",      icon:"M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { id:"threats",   label:"Threats",       icon:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { id:"endpoints", label:"Endpoints",     icon:"M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 12H4v-2h11v2zm3-4H4v-2h14v2zm0-4H4V6h14v2z" },
  { id:"incidents", label:"Incidents",     icon:"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" },
  { id:"brief",     label:"AI Brief",      icon:"M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" },
  { id:"sources",   label:"Data Sources",  icon:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" },
  { id:"settings",  label:"Settings",      icon:"M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" },
];

// ── TINY UTILS ───────────────────────────────────────────────
function Icon({ d, size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d={d} />
    </svg>
  );
}

function Dot({ color, pulse = false, size = 7 }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: size, height: size, flexShrink: 0 }}>
      {pulse && <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, opacity: 0.35, animation: "ping 2s ease-in-out infinite" }} />}
      <span style={{ position: "relative", borderRadius: "50%", width: size, height: size, background: color, display: "block" }} />
    </span>
  );
}

function Chip({ label, color }) {
  const bg = color + "18";
  const bd = color + "35";
  return (
    <span style={{ background: bg, color, border: `1px solid ${bd}`, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, letterSpacing: "0.3px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center" }}>
      {label}
    </span>
  );
}

function SevBar({ pct, color }) {
  return (
    <div style={{ height: 3, background: C.border, borderRadius: 2, flex: 1 }}>
      <div style={{ height: "100%", width: `${Math.min(100, pct)}%`, background: color, borderRadius: 2, transition: "width 0.8s ease" }} />
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
        background: on ? C.accent : C.raised, position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: on ? 19 : 3, width: 16, height: 16,
        borderRadius: "50%", background: "#fff", transition: "left 0.2s",
      }} />
    </button>
  );
}

// ── SETTINGS ─────────────────────────────────────────────────
function Settings() {
  const [cfg, setCfg] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("monitoring");

  useEffect(() => {
    api.getConfig().then(r => setCfg(r.data)).catch(() => setCfg({
      process: true, network: true, filesystem: true, logs: true,
      responseMode: "conservative", aiEnabled: false, apiKey: "",
      startOnBoot: false,
      notifications: { desktop: true, tray: true, sound: false },
    }));
  }, []);

  const save = async () => {
    setSaving(true);
    try { await api.saveConfig(cfg); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    catch { alert("Could not reach backend."); }
    setSaving(false);
  };

  const toggle = (key, sub) => {
    if (sub) setCfg(c => ({ ...c, [key]: { ...c[key], [sub]: !c[key][sub] } }));
    else setCfg(c => ({ ...c, [key]: !c[key] }));
  };

  if (!cfg) return <div style={{ padding: 40, color: C.text3, fontSize: 13 }}>Loading…</div>;

  const TABS = ["monitoring", "response", "ai", "notifications"];
  const Row = ({ label, desc, on, onToggle }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
      <div>
        <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: C.text3, marginTop: 3 }}>{desc}</div>}
      </div>
      <Toggle on={on} onChange={onToggle} />
    </div>
  );

  return (
    <div style={{ padding: "36px 40px", maxWidth: 680 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: "-0.4px" }}>Settings</div>
        <div style={{ fontSize: 13, color: C.text3, marginTop: 6 }}>Configure monitoring behaviour and integrations</div>
      </div>

      <div style={{ display: "flex", gap: 2, marginBottom: 28, background: C.surface, borderRadius: 8, padding: 4 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer",
            background: tab === t ? C.raised : "transparent",
            color: tab === t ? C.text : C.text3,
            fontSize: 12, fontWeight: tab === t ? 600 : 400, fontFamily: "inherit",
            textTransform: "capitalize", transition: "all 0.15s",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "4px 24px 12px" }}>
        {tab === "monitoring" && <>
          <Row label="Process Monitoring"  desc="Track running processes and child spawns"         on={cfg.process}    onToggle={() => toggle("process")} />
          <Row label="Network Monitoring"  desc="Monitor outbound connections and DNS queries"     on={cfg.network}    onToggle={() => toggle("network")} />
          <Row label="Filesystem Watching" desc="Alert on changes in protected folders"            on={cfg.filesystem} onToggle={() => toggle("filesystem")} />
          <Row label="Log Analysis"        desc="Parse Windows Event Logs for suspicious entries"  on={cfg.logs}       onToggle={() => toggle("logs")} />
        </>}

        {tab === "response" && <>
          <div style={{ padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 14 }}>Response Mode</div>
            {[
              { id: "conservative", label: "Conservative", desc: "Alert only — no automatic actions" },
              { id: "moderate",     label: "Moderate",     desc: "Block network on high-severity threats" },
              { id: "aggressive",   label: "Aggressive",   desc: "Auto-isolate machines on CRITICAL incidents" },
            ].map(m => (
              <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, cursor: "pointer" }}>
                <input type="radio" name="mode" checked={cfg.responseMode === m.id}
                  onChange={() => setCfg(c => ({ ...c, responseMode: m.id }))} style={{ accentColor: C.accent }} />
                <div>
                  <span style={{ fontSize: 13, color: C.text }}>{m.label}</span>
                  <span style={{ fontSize: 12, color: C.text3, marginLeft: 8 }}>{m.desc}</span>
                </div>
              </label>
            ))}
          </div>
          <Row label="Start on Boot" desc="Launch ThreatLens AI with Windows" on={cfg.startOnBoot} onToggle={() => toggle("startOnBoot")} />
        </>}

        {tab === "ai" && <>
          <div style={{ padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
            <Row label="Enable AI Features" desc="Use GPT-4o for threat summaries and daily briefs" on={cfg.aiEnabled} onToggle={() => toggle("aiEnabled")} />
          </div>
          <div style={{ padding: "20px 0" }}>
            <div style={{ fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 6 }}>OpenAI API Key</div>
            <div style={{ fontSize: 12, color: C.text3, marginBottom: 12 }}>Required for AI summaries and the daily brief. Get yours at platform.openai.com</div>
            <input
              type="password"
              value={cfg.apiKey || ""}
              onChange={e => setCfg(c => ({ ...c, apiKey: e.target.value }))}
              placeholder="sk-..."
              style={{
                width: "100%", padding: "10px 14px",
                background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: 8, color: C.text, fontSize: 13, fontFamily: "monospace",
                outline: "none",
              }}
            />
          </div>
        </>}

        {tab === "notifications" && <>
          <Row label="Desktop Notifications" desc="Windows toast notifications for new incidents"  on={cfg.notifications?.desktop} onToggle={() => toggle("notifications", "desktop")} />
          <Row label="Tray Alerts"           desc="Alerts in the Windows system tray"             on={cfg.notifications?.tray}    onToggle={() => toggle("notifications", "tray")} />
          <Row label="Sound Alerts"          desc="Play a sound on CRITICAL incidents"            on={cfg.notifications?.sound}   onToggle={() => toggle("notifications", "sound")} />
        </>}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button onClick={save} disabled={saving} style={{
          background: C.accent, border: "none", borderRadius: 8, padding: "10px 24px",
          color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          opacity: saving ? 0.7 : 1, transition: "opacity 0.2s",
        }}>
          {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
        </button>
        <button onClick={() => api.getConfig().then(r => setCfg(r.data))} style={{
          background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8,
          padding: "10px 20px", color: C.text3, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
        }}>Reset</button>
      </div>
    </div>
  );
}

// ── SANDBOX BUTTON ───────────────────────────────────────────
function SandboxButton({ filePath }) {
  const [state, setState] = useState("idle");   // idle | loading | done | error
  const [report, setReport] = useState(null);
  const [jobId, setJobId]   = useState(null);

  // Extract file path from raw_data (which is a JSON-encoded string)
  const extractPath = (raw) => {
    if (!raw) return null;
    // raw_data is stored as a JSON string — parse it first to get the path field
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (parsed?.path) return parsed.path;
    } catch {}
    // Fallback: regex match, handling both single and double-escaped backslashes
    const normalised = typeof raw === "string" ? raw.replace(/\\\\/g, "\\") : raw;
    const m = normalised.match(/[A-Z]:[\\\/][^\s"']+\.(exe|dll|bat|cmd|ps1|vbs|msi|scr|pif|lnk)/i);
    return m ? m[0] : null;
  };

  const path = extractPath(filePath);
  if (!path) return null;

  const poll = async (jid) => {
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 15000));
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/sandbox/result/${jid}`);
        const data = await res.json();
        if (data.state === "complete") { setReport(data); setState("done"); return; }
        if (data.error) { setState("error"); return; }
      } catch { setState("error"); return; }
    }
    setState("error");
  };

  const analyze = async () => {
    setState("loading");
    try {
      const res  = await fetch("http://127.0.0.1:8000/api/sandbox/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_path: path }),
      });
      const data = await res.json();
      if (data.error) { setState("error"); return; }
      setJobId(data.job_id);
      poll(data.job_id);
    } catch { setState("error"); }
  };

  const VERDICT_COLOR = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#eab308", LOW: "#22c55e" };

  if (state === "done" && report) {
    const vc = VERDICT_COLOR[report.verdict] || "#8899aa";
    return (
      <div style={{ background: vc + "10", border: `1px solid ${vc}30`, borderRadius: 10, padding: "14px 16px", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ color: vc, fontWeight: 700, fontSize: 13 }}>{report.verdict}</span>
          <span style={{ color: "#8899aa", fontSize: 12 }}>Hybrid Analysis Sandbox</span>
          <span style={{ color: "#8899aa", fontSize: 12 }}>·</span>
          <span style={{ color: "#8899aa", fontSize: 12 }}>{report.av_detect}% AV detection</span>
          <a href={report.analysis_url} target="_blank" rel="noreferrer"
            style={{ marginLeft: "auto", color: C.accent, fontSize: 12, textDecoration: "none" }}>
            Full report →
          </a>
        </div>
        {report.signatures?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {report.signatures.slice(0, 5).map((s, i) => (
              <span key={i} style={{ background: vc + "15", color: vc, border: `1px solid ${vc}25`,
                borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>{s}</span>
            ))}
          </div>
        )}
        {report.domains?.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 11, color: "#8899aa" }}>
            Contacted: {report.domains.slice(0, 3).join(", ")}
          </div>
        )}
      </div>
    );
  }

  return (
    <button onClick={analyze} disabled={state === "loading"} style={{
      background: "#f97316" + "14", border: "1px solid #f9731630",
      color: "#f97316", padding: "7px 14px", borderRadius: 8,
      fontSize: 12, fontWeight: 500, cursor: state === "loading" ? "wait" : "pointer",
      marginBottom: 8, opacity: state === "loading" ? 0.7 : 1,
    }}>
      {state === "loading" ? "Analyzing... (2-5 min)" : state === "error" ? "Analysis failed — retry" : "Analyze in Sandbox"}
    </button>
  );
}

// ── MAIN DASHBOARD ───────────────────────────────────────────
export default function Dashboard() {
  const qc = useQueryClient();

  const { data: threats = [] } = useQuery({
    queryKey: ["threats"],
    queryFn: () => api.getThreats().then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: incidents = [] } = useQuery({
    queryKey: ["incidents"],
    queryFn: () => api.getIncidents().then(r => r.data),
    refetchInterval: 10000,
  });

  const { data: stats = {} } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.getStats().then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: sourcesData = [] } = useQuery({
    queryKey: ["sources"],
    queryFn: () => api.getSources().then(r => r.data),
    refetchInterval: 60000,
  });

  const { data: briefData = {} } = useQuery({
    queryKey: ["brief"],
    queryFn: () => api.getBrief().then(r => r.data),
  });

  const { data: endpointsData = [] } = useQuery({
    queryKey: ["endpoints"],
    queryFn: () => api.getEndpoints().then(r => r.data),
    refetchInterval: 10000,
  });

  useEffect(() => {
    socket.on("new_incident", (data) => {
      qc.invalidateQueries(["threats"]);
      qc.invalidateQueries(["incidents"]);
      qc.invalidateQueries(["stats"]);
      qc.invalidateQueries(["endpoints"]);
      window.electronAPI?.notify("ThreatLens Alert", data?.title || "New incident detected");
    });
    return () => socket.off("new_incident");
  }, []);

  const SOURCES   = sourcesData.length > 0 ? sourcesData : FALLBACK_SOURCES;
  const ENDPOINTS = endpointsData.length > 0 ? endpointsData : FALLBACK_ENDPOINTS;

  const [tab, setTab]         = useState("overview");
  const [expanded, setExpanded] = useState(null);
  const [sevFilter, setSevFilter] = useState("ALL");
  const [originFilter, setOriginFilter] = useState("ALL");
  const [search, setSearch]   = useState("");
  const [briefTab, setBriefTab] = useState(0);

  const critCount     = stats.critical ?? threats.filter(t => t.severity === "CRITICAL" && !t.resolved).length;
  const epCount       = stats.endpoint ?? threats.filter(t => t.origin === "ENDPOINT" && !t.resolved).length;
  const resolvedCount = stats.resolved ?? threats.filter(t => t.resolved).length;
  const totalCount    = stats.total    ?? threats.length;

  const filteredThreats = threats.filter(t => {
    const s = sevFilter === "ALL"    || t.severity === sevFilter;
    const o = originFilter === "ALL" || t.origin === originFilter;
    const q = !search || t.title?.toLowerCase().includes(search.toLowerCase()) || t.cve?.toLowerCase().includes(search.toLowerCase());
    return s && o && q;
  });

  const parseMitre = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try { return JSON.parse(tags); } catch { return []; }
  };

  const navBadge = (id) => {
    if (id === "threats")   return threats.filter(t => !t.resolved && t.origin === "GLOBAL").length || null;
    if (id === "incidents") return epCount || null;
    return null;
  };

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        @keyframes ping { 0%,100% { opacity: 0.35; } 50% { opacity: 0; transform: scale(1.8); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
        .nav-item { transition: background 0.15s, color 0.15s; cursor: pointer; border: none; background: none; width: 100%; text-align: left; }
        .nav-item:hover .nav-text { color: ${C.text} !important; }
        .nav-item:hover .nav-icon { opacity: 0.7; }
        .threat-row { transition: background 0.12s; cursor: pointer; }
        .threat-row:hover { background: ${C.raised} !important; }
        .btn-ghost { transition: background 0.15s, color 0.15s; cursor: pointer; border: none; font-family: inherit; }
        .btn-ghost:hover { background: ${C.raised} !important; }
        input { outline: none; }
        input::placeholder { color: ${C.text3}; }
        button { font-family: inherit; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 220, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #b8922a, #ecc155)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "-0.3px" }}>ThreatLens</div>
              <div style={{ fontSize: 10, color: C.text3, letterSpacing: "0.5px", marginTop: 1 }}>AI Platform</div>
            </div>
          </div>

          {/* Status */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <Dot color={C.low} pulse size={7} />
            <span style={{ fontSize: 12, color: C.text3 }}>All systems live</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "0 12px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(n => {
            const active = tab === n.id;
            const badge  = navBadge(n.id);
            return (
              <button key={n.id} className="nav-item" onClick={() => { setTab(n.id); setExpanded(null); }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8,
                  background: active ? C.bg : "transparent",
                  borderLeft: `2px solid ${active ? C.accent : "transparent"}`,
                }}>
                  <Icon d={n.icon} size={15} color={active ? C.accent : C.text3} />
                  <span className="nav-text" style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? C.text : C.text3, flex: 1 }}>
                    {n.label}
                  </span>
                  {badge > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.critical, background: C.critical + "18", borderRadius: 20, padding: "1px 7px" }}>
                      {badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 14px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, background: `linear-gradient(135deg, ${C.accentDim}, ${C.accent})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              S
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>SOC Analyst</div>
              <div style={{ fontSize: 11, color: C.text3 }}>Tier 2</div>
            </div>
            <Dot color={C.low} size={6} style={{ marginLeft: "auto" }} />
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <header style={{ height: 56, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 32px", gap: 16, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.text, letterSpacing: "-0.2px" }}>
              {NAV.find(n => n.id === tab)?.label}
            </span>
            <span style={{ fontSize: 12, color: C.text3, marginLeft: 12 }}>
              {tab === "overview"  && "Unified threat landscape"}
              {tab === "threats"   && `${filteredThreats.length} threats`}
              {tab === "endpoints" && `${ENDPOINTS.length} machines monitored`}
              {tab === "incidents" && `${epCount} active`}
              {tab === "brief"     && "AI-generated daily report"}
              {tab === "sources"   && `${SOURCES.length} active feeds`}
              {tab === "settings"  && "Preferences"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {epCount > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: C.critical + "12", border: `1px solid ${C.critical}30`, borderRadius: 8, padding: "6px 12px" }}>
                <Dot color={C.critical} pulse size={6} />
                <span style={{ fontSize: 12, color: C.critical, fontWeight: 600 }}>{epCount} live incident{epCount > 1 ? "s" : ""}</span>
              </div>
            )}
            <div style={{ fontSize: 12, color: C.text3, fontVariantNumeric: "tabular-nums" }}>
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <div className="fade-up" style={{ padding: "32px 40px" }}>

              {/* Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
                {[
                  { label: "Critical threats", value: critCount,     sub: "unresolved",     color: C.critical },
                  { label: "Live incidents",    value: epCount,       sub: "on endpoints",   color: C.high },
                  { label: "CVEs ingested",     value: totalCount,    sub: "all sources",    color: C.accent },
                  { label: "Resolved today",    value: resolvedCount, sub: "last 24 hours",  color: C.low },
                ].map((m, i) => (
                  <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "22px 24px" }}>
                    <div style={{ fontSize: 12, color: C.text3, marginBottom: 14, fontWeight: 500 }}>{m.label}</div>
                    <div style={{ fontSize: 40, fontWeight: 800, color: m.color, letterSpacing: "-1px", lineHeight: 1, marginBottom: 6 }}>{m.value}</div>
                    <div style={{ fontSize: 12, color: C.text3 }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

                {/* Priority queue */}
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Top threats</span>
                    <button onClick={() => setTab("threats")} className="btn-ghost" style={{ fontSize: 12, color: C.accent, padding: "4px 10px", borderRadius: 6, background: "transparent" }}>
                      See all →
                    </button>
                  </div>

                  {threats.filter(t => !t.resolved).length === 0 ? (
                    <div style={{ padding: "48px 24px", textAlign: "center", color: C.text3, fontSize: 13 }}>
                      Syncing threat feeds — data appears within 30 seconds…
                    </div>
                  ) : (
                    threats.filter(t => !t.resolved).slice(0, 6).map((t, i) => {
                      const sev   = t.severity || "MEDIUM";
                      const color = SEV_COLOR[sev] || C.accent;
                      const score = Math.round(t.priority_score ?? 0);
                      return (
                        <div key={i} className="threat-row" style={{
                          display: "flex", alignItems: "center", gap: 14,
                          padding: "14px 24px",
                          background: C.surface,
                          borderBottom: `1px solid ${C.border}`,
                          borderLeft: `3px solid ${color}`,
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              {t.cve && <span style={{ fontSize: 11, color: C.accent, fontWeight: 600 }}>{t.cve}</span>}
                              <span style={{ fontSize: 11, color: C.text3 }}>{t.source || "—"}</span>
                            </div>
                          </div>
                          <Chip label={sev} color={color} />
                          <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 28, textAlign: "right" }}>{score}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* Severity breakdown */}
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 18 }}>By severity</div>
                    {[
                      { label: "Critical", key: "CRITICAL", color: C.critical },
                      { label: "High",     key: "HIGH",     color: C.high },
                      { label: "Medium",   key: "MEDIUM",   color: C.medium },
                      { label: "Low",      key: "LOW",      color: C.low },
                    ].map((b) => {
                      const count = threats.filter(t => t.severity === b.key).length;
                      const pct   = threats.length > 0 ? (count / threats.length) * 100 : 0;
                      return (
                        <div key={b.key} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: C.text2 }}>{b.label}</span>
                            <span style={{ fontSize: 12, color: b.color, fontWeight: 700 }}>{count}</span>
                          </div>
                          <SevBar pct={pct} color={b.color} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Source status */}
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Data sources</span>
                    </div>
                    {SOURCES.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", borderBottom: i < SOURCES.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <Dot color={C.low} size={6} />
                        <span style={{ fontSize: 12, color: C.text2, flex: 1 }}>{s.name}</span>
                        <span style={{ fontSize: 12, color: C.text3 }}>{s.lastSync || "--"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ THREATS ══ */}
          {tab === "threats" && (
            <div className="fade-up" style={{ padding: "32px 40px" }}>

              {/* Filters */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map(f => (
                    <button key={f} onClick={() => setSevFilter(f)} style={{
                      padding: "6px 14px", borderRadius: 7, border: `1px solid ${sevFilter === f ? (SEV_COLOR[f] || C.accent) : C.border}`,
                      background: sevFilter === f ? (SEV_COLOR[f] || C.accent) + "18" : "transparent",
                      color: sevFilter === f ? (SEV_COLOR[f] || C.accent) : C.text3,
                      fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                    }}>{f}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["ALL", "GLOBAL", "ENDPOINT"].map(f => (
                    <button key={f} onClick={() => setOriginFilter(f)} style={{
                      padding: "6px 14px", borderRadius: 7, border: `1px solid ${originFilter === f ? C.accent : C.border}`,
                      background: originFilter === f ? C.accent + "18" : "transparent",
                      color: originFilter === f ? C.accent : C.text3,
                      fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                    }}>{f}</button>
                  ))}
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search CVE or title…"
                    style={{
                      background: C.surface, border: `1px solid ${C.border}`,
                      borderRadius: 8, padding: "8px 14px", color: C.text,
                      fontSize: 13, width: 260, fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              {/* Threat list */}
              {filteredThreats.length === 0 ? (
                <div style={{ textAlign: "center", padding: "64px 0", color: C.text3, fontSize: 13 }}>
                  {threats.length === 0
                    ? "Syncing from NVD, OTX and AbuseIPDB — threats appear shortly."
                    : "No threats match your current filters."}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {filteredThreats.map(t => {
                    const sev       = t.severity || "MEDIUM";
                    const color     = SEV_COLOR[sev] || C.accent;
                    const score     = Math.round(t.priority_score ?? 0);
                    const mitre     = parseMitre(t.mitre_tags);
                    const isOpen    = expanded === t.id;
                    return (
                      <div key={t.id} style={{ borderRadius: isOpen ? "12px 12px 0 0" : 12, overflow: "hidden" }}>
                        <div
                          className="threat-row"
                          onClick={() => setExpanded(isOpen ? null : t.id)}
                          style={{
                            display: "flex", alignItems: "center", gap: 14,
                            padding: "16px 20px",
                            background: isOpen ? C.raised : C.surface,
                            border: `1px solid ${isOpen ? C.borderHi : C.border}`,
                            borderLeft: `3px solid ${color}`,
                            borderBottom: isOpen ? "none" : undefined,
                            opacity: t.resolved ? 0.4 : 1,
                          }}
                        >
                          {/* Score */}
                          <div style={{ width: 36, textAlign: "center", flexShrink: 0 }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
                            <div style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>score</div>
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5, flexWrap: "wrap" }}>
                              {t.cve && <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>{t.cve}</span>}
                              <Chip label={sev}    color={color} />
                              <Chip label={t.origin === "ENDPOINT" ? "ENDPOINT" : "GLOBAL"} color={t.origin === "ENDPOINT" ? "#ec4899" : C.accent} />
                              {t.asset_match && <Chip label="Asset match" color={C.low} />}
                              {t.resolved    && <Chip label="Resolved"    color={C.low} />}
                              <span style={{ fontSize: 11, color: C.text3, marginLeft: "auto" }}>
                                {t.created_at?.slice(0, 10) || "—"}
                              </span>
                            </div>
                            <div style={{ fontSize: 14, color: C.text, fontWeight: 500, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {t.title}
                            </div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: C.text3 }}>{t.source || "—"}</span>
                              {mitre.slice(0, 3).map((m, mi) => (
                                <span key={mi} style={{ fontSize: 11, color: C.text3, background: C.raised, borderRadius: 4, padding: "1px 7px" }}>{m}</span>
                              ))}
                              {t.epss_score > 0 && (
                                <span style={{ fontSize: 11, color: C.text3, marginLeft: "auto" }}>
                                  EPSS {(t.epss_score * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                          </div>

                          <svg width="16" height="16" viewBox="0 0 24 24" fill={C.text3} style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                            <path d="M7 10l5 5 5-5z" />
                          </svg>
                        </div>

                        {/* Expanded detail */}
                        {isOpen && (
                          <div className="fade-up" style={{
                            background: C.bg, border: `1px solid ${C.borderHi}`,
                            borderTop: "none", borderRadius: "0 0 12px 12px",
                            padding: "20px 20px 24px 20px",
                          }}>
                            <div style={{ fontSize: 12, color: "#8b5cf6", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 10 }}>AI SUMMARY</div>
                            <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.8, marginBottom: 20 }}>
                              {t.ai_summary || "AI summary not yet generated for this threat."}
                            </p>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <button onClick={() => window.electronAPI?.notify("ThreatLens — Escalation", t.title || "Threat escalated")} style={{
                                background: C.critical + "14", border: `1px solid ${C.critical}30`,
                                color: C.critical, padding: "8px 16px", borderRadius: 8,
                                fontSize: 12, fontWeight: 500, cursor: "pointer",
                              }}>Escalate</button>
                              <button onClick={() => api.resolveThreat(t.id).then(() => qc.invalidateQueries(["threats"]))} style={{
                                background: C.low + "14", border: `1px solid ${C.low}30`,
                                color: C.low, padding: "8px 16px", borderRadius: 8,
                                fontSize: 12, fontWeight: 500, cursor: "pointer",
                              }}>Mark resolved</button>
                              {t.cve && (
                                <button onClick={() => window.open("https://nvd.nist.gov/vuln/detail/" + t.cve, "_blank")} style={{
                                  background: C.accent + "14", border: `1px solid ${C.accent}30`,
                                  color: C.accent, padding: "8px 16px", borderRadius: 8,
                                  fontSize: 12, fontWeight: 500, cursor: "pointer",
                                }}>View in NVD →</button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══ ENDPOINTS ══ */}
          {tab === "endpoints" && (
            <div className="fade-up" style={{ padding: "32px 40px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Machines online",   value: ENDPOINTS.length,                                         color: C.accent },
                  { label: "Active incidents",   value: ENDPOINTS.filter(e => e.status === "INCIDENT").length,   color: C.critical },
                  { label: "Agent coverage",     value: "100%",                                                   color: C.low },
                ].map((m, i) => (
                  <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "22px 24px" }}>
                    <div style={{ fontSize: 12, color: C.text3, marginBottom: 12, fontWeight: 500 }}>{m.label}</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: m.color, letterSpacing: "-0.5px" }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ENDPOINTS.map((ep, i) => {
                  const sc = ep.status === "INCIDENT" ? C.critical : ep.status === "WARNING" ? C.high : C.low;
                  return (
                    <div key={i} style={{
                      background: C.surface, border: `1px solid ${ep.status === "INCIDENT" ? C.critical + "30" : C.border}`,
                      borderLeft: `3px solid ${sc}`, borderRadius: 12, padding: "18px 24px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{ep.name}</span>
                            <Chip label={ep.status}   color={sc} />
                            {ep.incidents > 0 && <Chip label={`${ep.incidents} incident${ep.incidents > 1 ? "s" : ""}`} color={C.critical} />}
                          </div>
                          <div style={{ display: "flex", gap: 16 }}>
                            <span style={{ fontSize: 12, color: C.text2 }}>{ep.os}</span>
                            <span style={{ fontSize: 12, color: C.text3 }}>{ep.ip}</span>
                            <span style={{ fontSize: 12, color: C.text3 }}>Agent {ep.agent}</span>
                            <span style={{ fontSize: 12, color: C.text3 }}>Last seen {ep.lastSeen}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 24, flexShrink: 0 }}>
                          {[["CPU", ep.cpu], ["MEM", ep.mem]].map(([l, v]) => (
                            <div key={l} style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 11, color: C.text3, marginBottom: 4 }}>{l}</div>
                              <div style={{ fontSize: 16, fontWeight: 700, color: v > 80 ? C.critical : v > 60 ? C.high : C.low }}>{v}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {ep.status === "INCIDENT" && (
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
                          <button onClick={() => setTab("incidents")} style={{ background: C.critical + "14", border: `1px solid ${C.critical}30`, color: C.critical, padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>View incidents</button>
                          <button style={{ background: C.raised, border: `1px solid ${C.border}`, color: C.text3, padding: "7px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>Isolate machine</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ INCIDENTS ══ */}
          {tab === "incidents" && (
            <div className="fade-up" style={{ padding: "32px 40px" }}>
              {incidents.length === 0 && threats.filter(t => t.origin === "ENDPOINT").length === 0 ? (
                <div style={{ textAlign: "center", padding: "64px 0", color: C.text3, fontSize: 13 }}>
                  No endpoint incidents detected. The agent will report here when it finds something.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {(incidents.length > 0 ? incidents : threats.filter(t => t.origin === "ENDPOINT")).map((t, i) => {
                    const mitre = parseMitre(t.mitre_tags);
                    return (
                      <div key={i} style={{
                        background: C.surface,
                        border: `1px solid ${t.resolved ? C.border : C.critical + "28"}`,
                        borderLeft: `3px solid ${t.resolved ? C.border : C.critical}`,
                        borderRadius: 12, padding: "20px 24px",
                        opacity: t.resolved ? 0.45 : 1,
                      }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t.title}</span>
                              {t.machine && <Chip label={t.machine} color="#ec4899" />}
                              {!t.resolved && (
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
                                  <Dot color={C.critical} pulse size={6} />
                                  <span style={{ fontSize: 11, color: C.critical, fontWeight: 600 }}>Active</span>
                                </div>
                              )}
                            </div>
                            <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.7, marginBottom: 16 }}>
                              {t.ai_summary || "Processing incident…"}
                            </p>
                            {mitre.length > 0 && (
                              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                                {mitre.map((m, mi) => (
                                  <span key={mi} style={{ fontSize: 11, color: C.text3, background: C.raised, borderRadius: 4, padding: "2px 8px" }}>{m}</span>
                                ))}
                              </div>
                            )}
                            <SandboxButton filePath={t.raw_data} />
                            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                              <button onClick={() => alert("Playbook: Isolate machine → Run AV scan → Patch CVE → Rotate credentials → Review logs.")} style={{ background: "#8b5cf614", border: "1px solid #8b5cf630", color: "#8b5cf6", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                                View playbook
                              </button>
                              <button onClick={() => api.resolveThreat(t.id).then(() => qc.invalidateQueries(["incidents"]))} style={{ background: C.low + "14", border: `1px solid ${C.low}30`, color: C.low, padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                                Mark resolved
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══ AI BRIEF ══ */}
          {tab === "brief" && (
            <div className="fade-up" style={{ padding: "32px 40px", maxWidth: 800 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>Morning Brief</div>
                    <div style={{ fontSize: 12, color: C.text3 }}>
                      {briefData.generated_at ? new Date(briefData.generated_at).toLocaleString() : "Generating…"}
                    </div>
                  </div>
                  <Chip label="Fresh" color={C.low} />
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
                  {["Overview", "Global threats", "Endpoint incidents", "Recommendations"].map((s, i) => (
                    <button key={i} onClick={() => setBriefTab(i)} style={{
                      padding: "12px 20px", background: "none", border: "none",
                      borderBottom: briefTab === i ? `2px solid ${C.accent}` : "2px solid transparent",
                      color: briefTab === i ? C.text : C.text3,
                      fontSize: 13, fontWeight: briefTab === i ? 600 : 400, cursor: "pointer",
                      marginBottom: -1, transition: "color 0.15s",
                    }}>{s}</button>
                  ))}
                </div>

                {/* Content */}
                <div style={{ padding: 28 }}>
                  {briefTab === 0 && (
                    <div>
                      <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.9 }}>
                        {briefData.brief || "Brief is being generated. Ensure the backend is running and your OpenAI API key is set in Settings → AI."}
                      </p>
                    </div>
                  )}

                  {briefTab === 1 && (
                    <div>
                      <p style={{ fontSize: 13, color: C.text3, marginBottom: 20 }}>
                        {threats.filter(t => t.origin === "GLOBAL").length} global CVEs ingested · sorted by priority score
                      </p>
                      {threats.filter(t => t.origin === "GLOBAL").slice(0, 5).map((t, i) => {
                        const sev = t.severity || "MEDIUM";
                        return (
                          <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                            <div style={{ width: 4, background: SEV_COLOR[sev] || C.accent, borderRadius: 2, flexShrink: 0 }} />
                            <div>
                              <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                                {t.cve && <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>{t.cve}</span>}
                                <Chip label={sev} color={SEV_COLOR[sev] || C.accent} />
                              </div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>{t.title}</div>
                              <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.7 }}>{t.ai_summary || "Processing…"}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {briefTab === 2 && (
                    <div>
                      <p style={{ fontSize: 13, color: C.text3, marginBottom: 20 }}>
                        {incidents.length || threats.filter(t => t.origin === "ENDPOINT").length} endpoint incidents — review and clear after forensics
                      </p>
                      {(incidents.length > 0 ? incidents : threats.filter(t => t.origin === "ENDPOINT")).map((t, i) => (
                        <div key={i} style={{ padding: 16, background: C.raised, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 12 }}>
                          <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                            {t.machine && <Chip label={t.machine} color="#ec4899" />}
                            <span style={{ fontSize: 11, color: C.text3, marginLeft: "auto" }}>{t.created_at?.slice(0, 10) || "—"}</span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{t.title}</div>
                          <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.7 }}>{t.ai_summary || "Processing…"}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {briefTab === 3 && (
                    <div>
                      {[
                        {
                          phase: "Immediate — today",
                          items: ["Patch all CRITICAL CVEs matching your asset profile", "Isolate any machines with active endpoint incidents", "Rotate credentials on affected systems"],
                        },
                        {
                          phase: "This week",
                          items: ["Review EPSS scores for all HIGH severity CVEs", "Run full endpoint scan with updated YARA signatures", "Audit CI/CD pipeline access logs"],
                        },
                        {
                          phase: "Ongoing",
                          items: ["Schedule weekly EPSS score reviews", "Enable real-time alerts for CRITICAL incidents", "Keep asset inventory updated with software versions"],
                        },
                      ].map((section, si) => (
                        <div key={si} style={{ marginBottom: 24 }}>
                          <div style={{ fontSize: 11, color: C.text3, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 12 }}>{section.phase}</div>
                          {section.items.map((item, ii) => (
                            <div key={ii} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                              <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent, flexShrink: 0, marginTop: 7 }} />
                              <span style={{ fontSize: 13, color: C.text2, lineHeight: 1.6 }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer actions */}
                <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
                  <button onClick={() => navigator.clipboard.writeText(briefData?.brief || "No brief available")} style={{ background: C.raised, border: `1px solid ${C.border}`, color: C.text3, padding: "8px 16px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
                    Copy brief
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(briefData?.brief || "").then(() => alert("Copied — paste into team chat or email."))} style={{ background: C.raised, border: `1px solid ${C.border}`, color: C.text3, padding: "8px 16px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
                    Share with team
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ DATA SOURCES ══ */}
          {tab === "sources" && (
            <div className="fade-up" style={{ padding: "32px 40px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                {SOURCES.map((s, i) => (
                  <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${s.color || C.accent}`, borderRadius: 12, padding: "20px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{s.name}</span>
                      <Dot color={C.low} size={7} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                      {[["Today", s.count], ["Matched", s.matched], ["Every", s.interval]].map(([l, v]) => (
                        <div key={l} style={{ background: C.raised, borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: 10, color: C.text3, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
                          <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: C.text3 }}>Last sync: {s.lastSync || "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ SETTINGS ══ */}
          {tab === "settings" && <Settings />}

        </main>
      </div>
    </div>
  );
}
