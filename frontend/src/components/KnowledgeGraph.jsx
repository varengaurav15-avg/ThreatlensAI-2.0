import { useState, useMemo } from 'react';

const SEV_COLOR = { CRITICAL: '#ffb4ab', HIGH: '#f97316', MEDIUM: '#ffa502', LOW: '#2ed573' };
const sevCol = s => SEV_COLOR[s?.toUpperCase()] || '#64748b';

export default function KnowledgeGraph({ threats = [], C }) {
  const [hovered, setHovered] = useState(null);

  const W = 720, H = 380;
  const CX = W / 2, CY = H / 2;

  const { threatNodes, mitreNodes, edges } = useMemo(() => {
    const top = threats.slice(0, 14);

    // Collect unique MITRE tags across all shown threats
    const mitreSet = new Set();
    top.forEach(t => {
      try { JSON.parse(t.mitre_tags || '[]').forEach(tag => mitreSet.add(tag)); } catch {}
    });
    const mitreTags = Array.from(mitreSet).slice(0, 7);

    const threatNodes = top.map((t, i) => {
      const angle = (i / top.length) * Math.PI * 2 - Math.PI / 2;
      const r = 148;
      return {
        id:        `t-${t.id}`,
        type:      'threat',
        label:     t.cve ? t.cve.slice(-8) : (t.title || '').slice(0, 10),
        tooltip:   t.title || t.cve || 'Unknown',
        severity:  t.severity,
        x:         CX + r * Math.cos(angle),
        y:         CY + r * Math.sin(angle),
        mitreTags: (() => { try { return JSON.parse(t.mitre_tags || '[]'); } catch { return []; } })(),
      };
    });

    const mitreNodes = mitreTags.map((tag, i) => {
      const angle = (i / mitreTags.length) * Math.PI * 2 - Math.PI / 4;
      const r = 62;
      return { id: `m-${tag}`, type: 'mitre', label: tag, tooltip: `MITRE ${tag}`, x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
    });

    const edges = [];
    threatNodes.forEach(tn => {
      tn.mitreTags.forEach(tag => {
        const mn = mitreNodes.find(m => m.label === tag);
        if (mn) edges.push({ from: tn, to: mn, severity: tn.severity });
      });
    });

    return { threatNodes, mitreNodes, edges };
  }, [threats]);

  if (threats.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
        Loading threat graph…
      </div>
    );
  }

  const allNodes = [...threatNodes, ...mitreNodes];

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', display: 'block' }}>

        {/* Faint concentric reference circles */}
        {[62, 148].map(r => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none"
            stroke={C.outlineVariant} strokeWidth={0.4} strokeDasharray="3 4" strokeOpacity={0.35} />
        ))}

        {/* Edges */}
        {edges.map((e, i) => {
          const active = hovered === e.from.id || hovered === e.to.id;
          return (
            <line key={i}
              x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y}
              stroke={sevCol(e.severity)}
              strokeWidth={active ? 1.5 : 0.6}
              strokeOpacity={hovered ? (active ? 0.75 : 0.06) : 0.18}
              style={{ transition: 'stroke-opacity 0.18s, stroke-width 0.18s' }}
            />
          );
        })}

        {/* Threat nodes */}
        {threatNodes.map(n => {
          const active = hovered === n.id;
          const col = sevCol(n.severity);
          return (
            <g key={n.id}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={n.x} cy={n.y} r={active ? 18 : 15}
                fill={col + (active ? '22' : '12')}
                stroke={col}
                strokeWidth={active ? 1.5 : 0.8}
                strokeOpacity={active ? 1 : 0.55}
                style={{ transition: 'all 0.15s' }}
              />
              <text x={n.x} y={n.y + 0.5} textAnchor="middle" dominantBaseline="middle"
                fill={col} fontSize={7.5}
                fontFamily="'JetBrains Mono', monospace" opacity={0.9}
              >
                {n.label.length > 10 ? n.label.slice(0, 9) + '…' : n.label}
              </text>
            </g>
          );
        })}

        {/* MITRE nodes */}
        {mitreNodes.map(n => {
          const active = hovered === n.id;
          return (
            <g key={n.id}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={n.x} cy={n.y} r={active ? 24 : 21}
                fill={C.primary + (active ? '18' : '0d')}
                stroke={C.primary}
                strokeWidth={active ? 1.5 : 0.8}
                strokeDasharray="3 2"
                style={{ transition: 'all 0.15s' }}
              />
              <text x={n.x} y={n.y + 0.5} textAnchor="middle" dominantBaseline="middle"
                fill={C.primary} fontSize={8.5}
                fontFamily="'JetBrains Mono', monospace"
              >
                {n.label}
              </text>
            </g>
          );
        })}

        {/* Centre — AI Brain */}
        <circle cx={CX} cy={CY} r={7}
          fill={C.primary + '20'} stroke={C.primary} strokeWidth={1} strokeDasharray="2 2" />
        <text x={CX} y={CY + 0.5} textAnchor="middle" dominantBaseline="middle"
          fill={C.primary} fontSize={6.5}
          fontFamily="'DM Sans', sans-serif" fontWeight="700">AI</text>

        {/* Hover tooltip */}
        {hovered && (() => {
          const n = allNodes.find(x => x.id === hovered);
          if (!n) return null;
          const text = n.tooltip.length > 44 ? n.tooltip.slice(0, 43) + '…' : n.tooltip;
          const tw = Math.max(text.length * 5.2, 90);
          const tx = Math.min(Math.max(n.x - tw / 2, 4), W - tw - 4);
          const ty = n.y < 50 ? n.y + 26 : n.y - 36;
          return (
            <g style={{ pointerEvents: 'none' }}>
              <rect x={tx} y={ty} width={tw} height={22} rx={3}
                fill={C.surfaceContainerHigh} stroke={C.goldBorder} strokeWidth={0.6} opacity={0.97} />
              <text x={tx + tw / 2} y={ty + 11} textAnchor="middle" dominantBaseline="middle"
                fill={C.onSurface} fontSize={9} fontFamily="'DM Sans', sans-serif">
                {text}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 6, flexWrap: 'wrap' }}>
        {[
          { color: C.primary,          label: 'MITRE ATT&CK',  dashed: true },
          { color: SEV_COLOR.CRITICAL,  label: 'Critical' },
          { color: SEV_COLOR.HIGH,      label: 'High' },
          { color: SEV_COLOR.MEDIUM,    label: 'Medium' },
          { color: SEV_COLOR.LOW,       label: 'Low' },
        ].map(({ color, label, dashed }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width={11} height={11}>
              <circle cx={5.5} cy={5.5} r={4.5}
                fill={color + '18'} stroke={color} strokeWidth={0.9}
                strokeDasharray={dashed ? '2 1' : undefined} />
            </svg>
            <span style={{ color: C.onSurfaceVariant, fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
