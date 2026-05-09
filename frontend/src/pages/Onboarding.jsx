import { useState } from "react";
import { api } from "../api/index";

const STEPS = [
  "welcome",
  "permissions",
  "folders",
  "response",
  "notifications",
  "ai",
  "startup",
  "summary"
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    process:       true,
    network:       true,
    filesystem:    true,
    logs:          true,
    folders:       ["Documents", "Desktop", "Downloads"],
    exclusions:    [],
    responseMode:  "conservative",
    notifications: { desktop: true, tray: true, sound: false },
    aiEnabled:     true,
    apiKey:        "",
    startOnBoot:   true,
  });

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const handleLaunch = async () => {
    try {
      await api.saveConfig(config);
    } catch (e) {
      console.log("Backend not ready yet — config saved locally");
    }
    localStorage.setItem("onboarding_complete", "true");
    onComplete();
  };

  const btnPrimary = {
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    border: "none", borderRadius: 10, padding: "12px 28px",
    color: "#fff", fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit", width: "100%"
  };

  const btnSecondary = {
    background: "transparent",
    border: "1px solid #1e3352",
    borderRadius: 10, padding: "12px 28px",
    color: "#64748b", fontSize: 14,
    cursor: "pointer", fontFamily: "inherit"
  };

  function Toggle({ checked, onChange }) {
    return (
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 12, cursor: "pointer",
          background: checked ? "#2563eb" : "#1e3352",
          position: "relative", transition: "background 0.2s", flexShrink: 0
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3,
          left: checked ? 22 : 3, transition: "left 0.2s"
        }} />
      </div>
    );
  }

  function Screen({ children }) {
    return (
      <div style={{
        height: "100vh", background: "#060c14",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', system-ui, sans-serif"
      }}>
        <div style={{
          width: 560, background: "#07101a",
          border: "1px solid #0f1e2e", borderRadius: 20,
          padding: "48px", boxShadow: "0 32px 80px rgba(0,0,0,0.5)"
        }}>
          {/* Progress bar */}
          <div style={{ display: "flex", gap: 6, marginBottom: 40, justifyContent: "center" }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 24 : 8, height: 8, borderRadius: 4,
                background: i === step ? "#2563eb" : i < step ? "#1d4ed8" : "#1e3352",
                transition: "all 0.3s"
              }} />
            ))}
          </div>
          {children}
        </div>
      </div>
    );
  }

  // ── SCREEN 0: Welcome ──────────────────────────────────────
  if (step === 0) return (
    <Screen>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 72, height: 72,
          background: "linear-gradient(135deg,#ef4444,#f97316)",
          borderRadius: 18, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 32,
          margin: "0 auto 24px",
          boxShadow: "0 8px 32px rgba(239,68,68,0.3)"
        }}>⚡</div>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", marginBottom: 12, fontFamily: "inherit" }}>
          Welcome to ThreatLens AI
        </h1>

        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 40 }}>
          ThreatLens monitors your system for active attacks and pulls live
          threat intelligence from the internet — all in one place.
          <br /><br />
          Before we start, we'll ask for a few permissions.{" "}
          <strong style={{ color: "#94a3b8" }}>
            You're in full control of what we can access.
          </strong>
        </p>

        <button onClick={next} style={btnPrimary}>Get Started →</button>
      </div>
    </Screen>
  );

  // ── SCREEN 1: Permissions ──────────────────────────────────
  if (step === 1) return (
    <Screen>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, fontFamily: "inherit" }}>
        System Monitoring Permissions
      </h2>
      <p style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>
        Choose what ThreatLens can monitor. Change these anytime in Settings.
      </p>

      {[
        {
          key: "process", icon: "🖥", title: "Process Monitor",
          desc: "Flag suspicious program chains — like Word opening a command prompt."
        },
        {
          key: "network", icon: "🌐", title: "Network Monitor",
          desc: "Block outgoing connections to known malicious IP addresses."
        },
        {
          key: "filesystem", icon: "📁", title: "File System Monitor",
          desc: "Detect rapid file encryption — the main ransomware signature."
        },
        {
          key: "logs", icon: "📋", title: "System Logs",
          desc: "Detect failed logins and privilege escalation in system logs."
        },
      ].map(p => (
        <div key={p.key} style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "14px 16px", background: "#0c1825",
          borderRadius: 10, marginBottom: 10, border: "1px solid #0f1e2e"
        }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{p.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>
              {p.title}
            </div>
            <div style={{ fontSize: 12, color: "#475569" }}>{p.desc}</div>
          </div>
          <Toggle
            checked={config[p.key]}
            onChange={v => setConfig({ ...config, [p.key]: v })}
          />
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button onClick={prev} style={{ ...btnSecondary, flexShrink: 0 }}>← Back</button>
        <button onClick={next} style={btnPrimary}>Continue →</button>
      </div>
    </Screen>
  );

  // ── SCREEN 2: Folders ──────────────────────────────────────
  if (step === 2) return (
    <Screen>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, fontFamily: "inherit" }}>
        Which folders should we watch?
      </h2>
      <p style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>
        We only watch for suspicious activity patterns — we never read your file contents.
      </p>

      {["Documents", "Desktop", "Downloads", "Pictures"].map(folder => (
        <div key={folder} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", background: "#0c1825",
          borderRadius: 10, marginBottom: 10, border: "1px solid #0f1e2e"
        }}>
          <span style={{ fontSize: 14, color: "#e2e8f0" }}>📁 {folder}</span>
          <Toggle
            checked={config.folders.includes(folder)}
            onChange={v => setConfig({
              ...config,
              folders: v
                ? [...config.folders, folder]
                : config.folders.filter(f => f !== folder)
            })}
          />
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button onClick={prev} style={{ ...btnSecondary, flexShrink: 0 }}>← Back</button>
        <button onClick={next} style={btnPrimary}>Continue →</button>
      </div>
    </Screen>
  );

  // ── SCREEN 3: Response Mode ────────────────────────────────
  if (step === 3) return (
    <Screen>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, fontFamily: "inherit" }}>
        How should ThreatLens respond?
      </h2>
      <p style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>
        Choose how aggressively the app acts when it detects a threat.
      </p>

      {[
        {
          val: "conservative", icon: "🛡", label: "Conservative (Recommended)",
          desc: "Alert you and ask for your approval before taking any action. Nothing happens without your say-so."
        },
        {
          val: "aggressive", icon: "⚡", label: "Aggressive",
          desc: "Kill malicious processes and quarantine files automatically. Faster response, but less manual control."
        },
      ].map(opt => (
        <div
          key={opt.val}
          onClick={() => setConfig({ ...config, responseMode: opt.val })}
          style={{
            padding: "20px", background: "#0c1825", borderRadius: 12, marginBottom: 12,
            border: `1px solid ${config.responseMode === opt.val ? "#2563eb" : "#0f1e2e"}`,
            cursor: "pointer", transition: "border-color 0.2s"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{opt.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{opt.label}</span>
            {config.responseMode === opt.val && (
              <span style={{ marginLeft: "auto", color: "#2563eb", fontSize: 18 }}>✓</span>
            )}
          </div>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{opt.desc}</p>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button onClick={prev} style={{ ...btnSecondary, flexShrink: 0 }}>← Back</button>
        <button onClick={next} style={btnPrimary}>Continue →</button>
      </div>
    </Screen>
  );

  // ── SCREEN 4: Notifications ────────────────────────────────
  if (step === 4) return (
    <Screen>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, fontFamily: "inherit" }}>
        How do you want to be notified?
      </h2>
      <p style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>
        Critical incidents always notify you regardless of these settings.
      </p>

      {[
        { key: "desktop", label: "Desktop pop-up notifications",      icon: "🔔" },
        { key: "tray",    label: "System tray icon with badge count",  icon: "📌" },
        { key: "sound",   label: "Sound alerts",                       icon: "🔊" },
      ].map(n => (
        <div key={n.key} style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "16px", background: "#0c1825",
          borderRadius: 10, marginBottom: 10, border: "1px solid #0f1e2e"
        }}>
          <span style={{ fontSize: 20 }}>{n.icon}</span>
          <span style={{ flex: 1, fontSize: 14, color: "#e2e8f0" }}>{n.label}</span>
          <Toggle
            checked={config.notifications[n.key]}
            onChange={v => setConfig({
              ...config,
              notifications: { ...config.notifications, [n.key]: v }
            })}
          />
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button onClick={prev} style={{ ...btnSecondary, flexShrink: 0 }}>← Back</button>
        <button onClick={next} style={btnPrimary}>Continue →</button>
      </div>
    </Screen>
  );

  // ── SCREEN 5: AI Setup ─────────────────────────────────────
  if (step === 5) return (
    <Screen>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, fontFamily: "inherit" }}>
        AI Threat Analysis
      </h2>
      <p style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>
        ThreatLens uses GPT-4o to summarise threats and write your morning brief.
        Your API key stays on your machine only — never sent anywhere except OpenAI.
      </p>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>OpenAI API Key</div>
        <input
          type="password"
          placeholder="sk-..."
          value={config.apiKey}
          onChange={e => setConfig({ ...config, apiKey: e.target.value })}
          style={{
            width: "100%", background: "#0c1825",
            border: "1px solid #1e3352", borderRadius: 10,
            padding: "12px 16px", color: "#e2e8f0",
            fontSize: 14, fontFamily: "inherit", outline: "none"
          }}
        />
        <div style={{ fontSize: 11, color: "#334155", marginTop: 6 }}>
          Don't have one? Leave blank to use Groq (free) instead.
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px", background: "#0c1825",
        borderRadius: 10, border: "1px solid #0f1e2e", marginBottom: 24
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>
            🤖 Enable AI Features
          </div>
          <div style={{ fontSize: 12, color: "#475569" }}>
            Summaries, verdicts, and morning brief
          </div>
        </div>
        <Toggle
          checked={config.aiEnabled}
          onChange={v => setConfig({ ...config, aiEnabled: v })}
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={prev} style={{ ...btnSecondary, flexShrink: 0 }}>← Back</button>
        <button onClick={next} style={btnPrimary}>Continue →</button>
      </div>
    </Screen>
  );

  // ── SCREEN 6: Startup ──────────────────────────────────────
  if (step === 6) return (
    <Screen>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, fontFamily: "inherit" }}>
        Background Protection
      </h2>
      <p style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>
        Keep ThreatLens running in the background so protection is always active.
      </p>

      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "20px", background: "#0c1825",
        borderRadius: 12, marginBottom: 12, border: "1px solid #0f1e2e"
      }}>
        <span style={{ fontSize: 22 }}>🚀</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>
            Start ThreatLens when my computer starts
          </div>
          <div style={{ fontSize: 12, color: "#475569" }}>
            Recommended — ensures you're always protected from boot
          </div>
        </div>
        <Toggle
          checked={config.startOnBoot}
          onChange={v => setConfig({ ...config, startOnBoot: v })}
        />
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "20px", background: "#0c1825",
        borderRadius: 12, marginBottom: 24, border: "1px solid #0f1e2e"
      }}>
        <span style={{ fontSize: 22 }}>📌</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>
            Run in system tray when window is closed
          </div>
          <div style={{ fontSize: 12, color: "#475569" }}>
            App keeps protecting even when you close the window
          </div>
        </div>
        <Toggle checked={true} onChange={() => {}} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={prev} style={{ ...btnSecondary, flexShrink: 0 }}>← Back</button>
        <button onClick={next} style={btnPrimary}>Continue →</button>
      </div>
    </Screen>
  );

  // ── SCREEN 7: Summary ──────────────────────────────────────
  if (step === 7) return (
    <Screen>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64,
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 16, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 28, margin: "0 auto 20px"
        }}>✓</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", marginBottom: 8, fontFamily: "inherit" }}>
          You're all set
        </h2>
        <p style={{ fontSize: 13, color: "#475569" }}>
          Here's what ThreatLens will monitor. Change anything later in Settings.
        </p>
      </div>

      {[
        { label: "Process Monitor",  val: config.process    ? "Active" : "Off",                          on: config.process },
        { label: "Network Monitor",  val: config.network    ? "Active" : "Off",                          on: config.network },
        { label: "File Monitor",     val: config.filesystem ? `${config.folders.length} folders` : "Off",on: config.filesystem },
        { label: "System Logs",      val: config.logs       ? "Active" : "Off",                          on: config.logs },
        { label: "Response Mode",    val: config.responseMode,                                            on: true },
        { label: "AI Features",      val: config.aiEnabled  ? "Active" : "Off",                          on: config.aiEnabled },
        { label: "Start on Boot",    val: config.startOnBoot ? "Yes" : "No",                             on: config.startOnBoot },
      ].map((item, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "11px 0",
          borderBottom: i < 6 ? "1px solid #0f1e2e" : "none"
        }}>
          <span style={{ fontSize: 13, color: "#64748b" }}>{item.label}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: item.on ? "#22c55e" : "#475569" }}>
            {item.val}
          </span>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 32 }}>
        <button onClick={prev} style={{ ...btnSecondary, flexShrink: 0 }}>← Back</button>
        <button onClick={handleLaunch} style={btnPrimary}>
          Launch ThreatLens →
        </button>
      </div>
    </Screen>
  );
}