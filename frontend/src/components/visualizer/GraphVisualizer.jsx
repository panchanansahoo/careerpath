import { useMemo } from 'react';

const NODE_RADIUS = 22;
const COLORS = {
  unvisited: 'rgba(255,255,255,0.12)',
  visiting: '#fbbf24',
  visited: '#22c55e',
  current: '#8b5cf6',
  exploring: '#22d3ee',
  edgeDefault: 'rgba(255,255,255,0.1)',
  edgeActive: '#8b5cf670',
  textDefault: 'rgba(255,255,255,0.5)',
};

export default function GraphVisualizer({ step }) {
  if (!step || !step.nodes) return null;
  const { nodes, edges, visited = [], current, exploring, queue, order = [] } = step;

  // Force-layout positions (pre-computed for default 7-node graph)
  const positions = useMemo(() => {
    const n = nodes.length;
    if (n <= 7) {
      // Aesthetic hand-tuned positions for 7-node graph
      const layouts = {
        7: [
          { x: 350, y: 60 },   // 0 (root)
          { x: 200, y: 160 },  // 1
          { x: 500, y: 160 },  // 2
          { x: 120, y: 280 },  // 3
          { x: 280, y: 280 },  // 4
          { x: 420, y: 280 },  // 5
          { x: 580, y: 280 },  // 6
        ],
      };
      if (layouts[n]) return layouts[n];
    }
    // Circular fallback
    const cx = 350, cy = 180, r = 140;
    return nodes.map((_, i) => ({
      x: cx + r * Math.cos((2 * Math.PI * i) / n - Math.PI / 2),
      y: cy + r * Math.sin((2 * Math.PI * i) / n - Math.PI / 2),
    }));
  }, [nodes]);

  const getNodeColor = (node) => {
    if (node === current) return COLORS.current;
    if (node === exploring) return COLORS.exploring;
    if (visited.includes(node)) return COLORS.visited;
    return COLORS.unvisited;
  };

  const getNodeGlow = (node) => {
    if (node === current) return `0 0 20px ${COLORS.current}80`;
    if (node === exploring) return `0 0 16px ${COLORS.exploring}60`;
    return 'none';
  };

  const isEdgeActive = (u, v) => {
    if (current !== null && exploring !== undefined) {
      return (u === current && v === exploring) || (v === current && u === exploring);
    }
    return false;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
      {/* Graph SVG */}
      <svg width="700" height="360" viewBox="0 0 700 360" style={{ maxWidth: '100%' }}>
        {/* Edges */}
        {edges.map(([u, v], i) => {
          const p1 = positions[u];
          const p2 = positions[v];
          if (!p1 || !p2) return null;
          const active = isEdgeActive(u, v);
          return (
            <line key={i}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={active ? COLORS.exploring : (visited.includes(u) && visited.includes(v)) ? COLORS.edgeActive : COLORS.edgeDefault}
              strokeWidth={active ? 3 : 2}
              strokeLinecap="round"
              style={{ transition: 'all 0.3s ease' }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos = positions[i];
          if (!pos) return null;
          const color = getNodeColor(node);
          const isActive = node === current || node === exploring;
          return (
            <g key={node} style={{ transition: 'all 0.3s ease' }}>
              {/* Glow ring */}
              {isActive && (
                <circle cx={pos.x} cy={pos.y} r={NODE_RADIUS + 6}
                  fill="none" stroke={color} strokeWidth={2} opacity={0.3}
                  style={{ animation: 'pulse 1.5s ease infinite' }}
                />
              )}
              {/* Node circle */}
              <circle cx={pos.x} cy={pos.y} r={NODE_RADIUS}
                fill={`${color}25`}
                stroke={color}
                strokeWidth={2.5}
                style={{ filter: isActive ? `drop-shadow(0 0 8px ${color}80)` : 'none', transition: 'all 0.3s ease' }}
              />
              {/* Node label */}
              <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="central"
                fill={isActive || visited.includes(node) ? '#fff' : COLORS.textDefault}
                fontSize={14} fontWeight={700} fontFamily="system-ui"
              >{node}</text>
              {/* Visit order badge */}
              {order.includes(node) && (
                <g>
                  <circle cx={pos.x + NODE_RADIUS - 2} cy={pos.y - NODE_RADIUS + 2} r={9}
                    fill="#1e1b4b" stroke={COLORS.visited} strokeWidth={1.5}
                  />
                  <text x={pos.x + NODE_RADIUS - 2} y={pos.y - NODE_RADIUS + 3} textAnchor="middle" dominantBaseline="central"
                    fill={COLORS.visited} fontSize={8} fontWeight={800} fontFamily="system-ui"
                  >{order.indexOf(node) + 1}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Queue / Stack indicator */}
      {queue && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase' }}>Queue:</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {queue.length === 0 ? (
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>empty</span>
            ) : queue.map((node, i) => (
              <span key={i} style={{
                padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                background: 'rgba(139,92,246,0.15)', color: '#c084fc',
                border: '1px solid rgba(139,92,246,0.2)',
              }}>{node}</span>
            ))}
          </div>
        </div>
      )}

      {/* Traversal order */}
      {order.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase' }}>Order:</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {order.map((node, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{
                  padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                  background: 'rgba(34,197,94,0.12)', color: '#4ade80',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}>{node}</span>
                {i < order.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>→</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <LegendItem color={COLORS.unvisited} label="Unvisited" />
        <LegendItem color={COLORS.current} label="Current" />
        <LegendItem color={COLORS.exploring} label="Exploring" />
        <LegendItem color={COLORS.visited} label="Visited" />
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
      `}</style>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: `${color}40`, border: `2px solid ${color}` }} />
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{label}</span>
    </div>
  );
}
