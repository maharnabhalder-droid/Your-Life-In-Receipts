import React from 'react';
import { BarChart3, Clock, TrendingUp, Sparkles, MapPin, DollarSign } from 'lucide-react';
import { useReceiptStore } from '../store/useReceiptStore';
import { useTheme } from '../theme/ThemeContext';

function getHeatmapColor(count: number, maxCount: number, isDark: boolean): string {
  if (count <= 0) return isDark ? '#27272a' : '#e2e8f0';
  const ratio = Math.min(1, count / (maxCount || 1));
  const hue = Math.round(280 - ratio * 240); // Purple -> Amber -> Red
  const lightness = Math.round(35 + ratio * 35);
  return `hsl(${hue}, 85%, ${lightness}%)`;
}

export const PatternLabView: React.FC = () => {
  const computed = useReceiptStore((state) => state.computed);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedCell, setSelectedCell] = React.useState<{ cat: string; hour: number; count: number } | null>(null);

  const heatmap = computed?.heatmap;
  const interestStream = computed?.interestStream;
  const moodTimeline = computed?.moodTimeline;
  const spending = computed?.spending;
  const constellation = computed?.constellation;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-mono space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b border-[var(--border-receipt)] pb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-amber-500" />
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-[var(--text-main)]">
            Pattern Lab — Visual Analytics
          </h2>
        </div>
        <p className="text-xs md:text-sm text-[var(--text-muted)] max-w-xl">
          Custom D3 SVG visualizations computing habit heatmaps, interest shifts, emotional mood curves, lifetime spending, and habit constellations.
        </p>
      </div>

      {/* 1. Hour x Category Heatmap */}
      <div className="bg-[var(--bg-desk-secondary)] p-6 rounded-xl border border-[var(--border-receipt)] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border-receipt)] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              1. Hour of Day (00..23) × Category Heatmap
            </h3>
          </div>
          <span className="text-xs text-[var(--text-muted)]">24 × 9 Matrix</span>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 700 240" className="w-full h-auto max-w-full mx-auto block font-mono text-[10px]">
            {/* Hour Labels */}
            {Array.from({ length: 24 }).map((_, h) => (
              <text key={h} x={50 + h * 26} y="20" fill="currentColor" textAnchor="middle" className="text-[var(--text-muted)]">
                {h}h
              </text>
            ))}

            {/* Category Rows & Heatmap Cells */}
            {[
              'music',
              'purchase',
              'place',
              'movie',
              'event',
              'message',
              'note',
              'search',
              'photo',
            ].map((cat, rowIdx) => (
              <g key={cat} transform={`translate(0, ${40 + rowIdx * 20})`}>
                <text x="40" y="12" fill="currentColor" textAnchor="end" className="capitalize font-bold text-[var(--text-main)]">
                  {cat}
                </text>
                {Array.from({ length: 24 }).map((_, h) => {
                  const cell = heatmap?.cells.find((c) => c.hour === h && c.category === cat);
                  const count = cell?.count || 0;
                  const fill = getHeatmapColor(count, heatmap?.maxCount || 100, isDark);
                  const isSelected = selectedCell?.cat === cat && selectedCell?.hour === h;

                  return (
                    <rect
                      key={h}
                      x={50 + h * 26 - 10}
                      y={2}
                      width={22}
                      height={16}
                      rx={2}
                      fill={fill}
                      stroke={isSelected ? '#f59e0b' : 'none'}
                      strokeWidth={isSelected ? 2 : 0}
                      onClick={() => setSelectedCell({ cat, hour: h, count })}
                      className="transition-all hover:opacity-80 cursor-pointer"
                    >
                      <title>{`${cat} at ${h}:00 - ${count} receipts`}</title>
                    </rect>
                  );
                })}
              </g>
            ))}
          </svg>
        </div>

        {selectedCell && (
          <div className="bg-amber-500/20 border border-amber-500/40 p-2 rounded text-xs flex items-center justify-between text-amber-500 dark:text-amber-300 font-bold">
            <span>Tapped Matrix Cell: <span className="capitalize">{selectedCell.cat}</span> at {selectedCell.hour}:00 — <span className="text-[var(--text-main)]">{selectedCell.count} receipts</span></span>
            <button onClick={() => setSelectedCell(null)} className="text-red-400 font-bold ml-2">✕</button>
          </div>
        )}

        <div className="bg-amber-500/10 p-3 rounded border border-amber-500/20 text-xs text-amber-500 dark:text-amber-300 font-serif italic">
          💡 Insight Caption: "{heatmap?.insight || 'Computing heatmap...'}"
        </div>
      </div>

      {/* 2. Chapter Interest Shift Stream */}
      <div className="bg-[var(--bg-desk-secondary)] p-6 rounded-xl border border-[var(--border-receipt)] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border-receipt)] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              2. Chapter-by-Chapter Interest Shift Stream
            </h3>
          </div>
          <span className="text-xs text-[var(--text-muted)]">5 Eras Evolution</span>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 700 200" className="w-full h-auto max-w-full mx-auto block font-mono text-[10px]">
            {/* Render Stacked Bars per Chapter */}
            {interestStream?.data.map((ch, idx) => {
              const total = ch.music + ch.purchase + ch.place + ch.movie + ch.event + ch.message + ch.note + ch.search + ch.photo || 1;
              const x = 60 + idx * 130;
              const barWidth = 70;

              let currentY = 160;

              const layers = [
                { key: 'music', val: ch.music, color: '#8b5cf6' },
                { key: 'purchase', val: ch.purchase, color: '#10b981' },
                { key: 'place', val: ch.place, color: '#f59e0b' },
                { key: 'movie', val: ch.movie, color: '#ef4444' },
                { key: 'other', val: ch.event + ch.message + ch.note + ch.search + ch.photo, color: '#06b6d4' },
              ];

              return (
                <g key={ch.chapterId}>
                  <text x={x + barWidth / 2} y="180" fill="currentColor" textAnchor="middle" className="font-bold text-[var(--text-main)]">
                    Ch {idx + 1}
                  </text>

                  {layers.map((layer) => {
                    const h = (layer.val / total) * 120;
                    currentY -= h;
                    return (
                      <rect
                        key={layer.key}
                        x={x}
                        y={currentY}
                        width={barWidth}
                        height={h}
                        fill={layer.color}
                        rx={2}
                        className="opacity-90 hover:opacity-100"
                      >
                        <title>{`Ch ${idx + 1} ${layer.key}: ${layer.val}`}</title>
                      </rect>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="bg-purple-500/10 p-3 rounded border border-purple-500/20 text-xs text-purple-600 dark:text-purple-300 font-serif italic">
          💡 Insight Caption: "{interestStream?.insight}"
        </div>
      </div>

      {/* 3. Mood Line Timeline */}
      <div className="bg-[var(--bg-desk-secondary)] p-6 rounded-xl border border-[var(--border-receipt)] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border-receipt)] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              3. Lifetime Mood Score Timeline
            </h3>
          </div>
          <span className="text-xs text-[var(--text-muted)]">Moving Average</span>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 700 180" className="w-full h-auto max-w-full mx-auto block font-mono text-[10px]">
            {/* Draw Moving Average Path */}
            {moodTimeline?.points && moodTimeline.points.length > 1 && (
              <polyline
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                points={moodTimeline.points
                  .map((p, idx) => {
                    const x = 40 + (idx / moodTimeline.points.length) * 620;
                    const y = 150 - (p.movingAvg / 5) * 110;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {moodTimeline?.points.map((p, idx) => {
              const x = 40 + (idx / moodTimeline.points.length) * 620;
              const y = 150 - (p.value / 5) * 110;
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r={3}
                  fill="#a5b4fc"
                  className="hover:r-5 transition-all cursor-pointer"
                >
                  <title>{`${p.date}: ${p.mood} (${p.value}/5)`}</title>
                </circle>
              );
            })}
          </svg>
        </div>

        <div className="bg-indigo-500/10 p-3 rounded border border-indigo-500/20 text-xs text-indigo-600 dark:text-indigo-300 font-serif italic">
          💡 Insight Caption: "{moodTimeline?.insight}"
        </div>
      </div>

      {/* 4. Spending by Category over Time */}
      <div className="bg-[var(--bg-desk-secondary)] p-6 rounded-xl border border-[var(--border-receipt)] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border-receipt)] pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              4. Annual Expenditure Curve (₹ INR)
            </h3>
          </div>
          <span className="text-xs text-[var(--text-muted)]">Financial Growth</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {spending?.points.map((pt) => (
            <div key={pt.period} className="bg-[var(--bg-desk-secondary)] p-3 rounded border border-[var(--border-receipt)] text-[var(--text-main)] space-y-1">
              <div className="text-[10px] text-[var(--text-muted)] font-bold">{pt.period}</div>
              <div className="text-base font-bold text-emerald-500 dark:text-emerald-400">₹{pt.totalSpent.toLocaleString()}</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">
                Top: {Object.keys(pt.categories)[0] || 'Expenses'}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-500/10 p-3 rounded border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-300 font-serif italic">
          💡 Insight Caption: "{spending?.insight}"
        </div>
      </div>

      {/* 5. Constellation Graph */}
      <div className="bg-[var(--bg-desk-secondary)] p-6 rounded-xl border border-[var(--border-receipt)] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border-receipt)] pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-pink-500" />
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              5. Recurring Places & Artists Constellation Graph
            </h3>
          </div>
          <span className="text-xs text-[var(--text-muted)]">Graph Gravity Nodes</span>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 500 380" className="w-full h-auto max-w-md mx-auto block font-mono text-[10px]">
            {/* Draw Links */}
            {constellation?.links.map((link, i) => {
              const sourceNode = constellation.nodes.find((n) => n.id === link.source);
              const targetNode = constellation.nodes.find((n) => n.id === link.target);
              if (!sourceNode || !targetNode) return null;

              return (
                <line
                  key={i}
                  x1={sourceNode.x || 0}
                  y1={sourceNode.y || 0}
                  x2={targetNode.x || 0}
                  y2={targetNode.y || 0}
                  stroke={isDark ? '#52525b' : '#cbd5e1'}
                  strokeWidth="1"
                  strokeOpacity="0.6"
                />
              );
            })}

            {/* Draw Nodes */}
            {constellation?.nodes.map((node) => {
              const fill = node.category === 'artist' ? '#8b5cf6' : node.category === 'merchant' ? '#10b981' : '#f59e0b';
              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  <circle r={node.val / 2} fill={fill} opacity="0.85" className="hover:opacity-100 cursor-pointer" />
                  <text y={node.val / 2 + 10} fill="currentColor" textAnchor="middle" className="font-bold text-[9px] text-[var(--text-main)]">
                    {node.name.length > 15 ? node.name.slice(0, 14) + '…' : node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="bg-pink-500/10 p-3 rounded border border-pink-500/20 text-xs text-pink-600 dark:text-pink-300 font-serif italic">
          💡 Insight Caption: "{constellation?.insight}"
        </div>
      </div>
    </div>
  );
};

