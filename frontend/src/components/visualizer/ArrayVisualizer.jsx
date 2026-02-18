import { useMemo } from 'react';

// ─── AlgoMaster-style color palette ───
const COLORS = {
  default: '#fbbf24',        // golden yellow (primary tile color)
  comparing: '#60a5fa',      // blue
  swapping: '#ef4444',       // red
  sorted: '#22c55e',         // green
  pivot: '#f97316',          // orange
  found: '#22d3ee',          // cyan
  eliminated: 'rgba(255,255,255,0.08)',
  range: 'rgba(34,197,94,0.15)',
  checked: 'rgba(255,255,255,0.1)',
  minIndex: '#f472b6',       // pink
};

const TILE_BG = {
  default: 'rgba(251,191,36,0.12)',
  comparing: 'rgba(96,165,250,0.12)',
  swapping: 'rgba(239,68,68,0.12)',
  sorted: 'rgba(34,197,94,0.12)',
  pivot: 'rgba(249,115,22,0.12)',
  found: 'rgba(34,211,238,0.12)',
  eliminated: 'rgba(255,255,255,0.02)',
  checked: 'rgba(255,255,255,0.04)',
  minIndex: 'rgba(244,114,182,0.12)',
};

export default function ArrayVisualizer({ step, algorithmId }) {
  if (!step || !step.array) return null;
  const { array, highlights = [], sorted = [], swapping, comparing, found, left, right, mid, eliminated = [], checked = [], pivot, partitionBoundary, minIndex, windowStart, windowEnd } = step;

  const isSearchAlgo = algorithmId?.includes('search');
  const isTwoPointers = algorithmId === 'two-pointers';
  const isSlidingWindow = algorithmId === 'sliding-window';

  const getState = (index) => {
    if (found !== undefined && found === index) return 'found';
    if (swapping && highlights.includes(index)) return 'swapping';
    if (comparing && highlights.includes(index)) return 'comparing';
    if (pivot !== undefined && pivot === index) return 'pivot';
    if (minIndex !== undefined && minIndex === index) return 'minIndex';
    if (highlights.includes(index)) return 'comparing';
    if (sorted.includes(index)) return 'sorted';
    if (eliminated.includes(index)) return 'eliminated';
    if (checked.includes(index)) return 'checked';
    return 'default';
  };

  // Compute tile size based on array length
  const tileSize = Math.max(36, Math.min(64, Math.floor(680 / array.length) - 6));
  const fontSize = tileSize > 44 ? 16 : tileSize > 36 ? 14 : 12;

  // Determine active pointers to show
  const pointers = [];
  if (isSearchAlgo || isTwoPointers) {
    if (left !== undefined) pointers.push({ idx: left, label: 'left', color: '#22c55e' });
    if (right !== undefined) pointers.push({ idx: right, label: 'right', color: '#ef4444' });
    if (mid !== undefined) pointers.push({ idx: mid, label: 'mid', color: '#22d3ee' });
  }
  if (isSlidingWindow && windowStart !== undefined && windowEnd !== undefined) {
    pointers.push({ idx: windowStart, label: 'start', color: '#22c55e' });
    pointers.push({ idx: windowEnd, label: 'end', color: '#ef4444' });
  }
  if (swapping && highlights.length === 2) {
    pointers.push({ idx: highlights[0], label: 'swap', color: '#ef4444' });
    pointers.push({ idx: highlights[1], label: 'swap', color: '#ef4444' });
  }

  return (
    <div className="av-container">
      {/* Search/Window range highlight */}
      {(isSearchAlgo || isSlidingWindow) && left !== undefined && right !== undefined && (
        <div className="av-range-bar" style={{
          left: `calc(${left} * (${tileSize}px + 6px))`,
          width: `calc(${(right - left + 1)} * (${tileSize}px + 6px) - 6px)`,
        }}>
          <span className="av-range-label">
            {isSlidingWindow ? 'Window' : 'Search Range'}
          </span>
        </div>
      )}

      {/* Index row */}
      <div className="av-row av-indices" style={{ gap: 6 }}>
        {array.map((_, i) => (
          <div key={i} className="av-index" style={{ width: tileSize }}>
            {i}
          </div>
        ))}
      </div>

      {/* Tile row */}
      <div className="av-row av-tiles" style={{ gap: 6 }}>
        {array.map((val, i) => {
          const state = getState(i);
          const color = COLORS[state];
          const bg = TILE_BG[state];
          return (
            <div
              key={i}
              className={`av-tile ${state !== 'default' ? 'av-tile-active' : ''}`}
              style={{
                width: tileSize,
                height: tileSize,
                '--tile-color': color,
                '--tile-bg': bg,
                fontSize,
              }}
            >
              {val}
            </div>
          );
        })}
      </div>

      {/* Pointer labels row */}
      {pointers.length > 0 && (
        <div className="av-row av-pointers" style={{ gap: 6 }}>
          {array.map((_, i) => {
            const ptr = pointers.find(p => p.idx === i);
            return (
              <div key={i} style={{ width: tileSize, textAlign: 'center' }}>
                {ptr && (
                  <div className="av-pointer" style={{ color: ptr.color }}>
                    <span className="av-pointer-arrow">▲</span>
                    <span className="av-pointer-label">{ptr.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="av-legend">
        {!isSearchAlgo && (
          <>
            <LegendItem color={COLORS.default} label="Default" />
            <LegendItem color={COLORS.comparing} label="Comparing" />
            <LegendItem color={COLORS.swapping} label="Swapping" />
            <LegendItem color={COLORS.sorted} label="Sorted" />
            {algorithmId === 'quick-sort' && <LegendItem color={COLORS.pivot} label="Pivot" />}
          </>
        )}
        {isSearchAlgo && (
          <>
            <LegendItem color={COLORS.default} label="Unchecked" />
            <LegendItem color={COLORS.comparing} label="Checking" />
            <LegendItem color={COLORS.found} label="Found" />
            <LegendItem color={COLORS.eliminated} label="Eliminated" />
          </>
        )}
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="av-legend-item">
      <div className="av-legend-dot" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}
