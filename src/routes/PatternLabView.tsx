import React from 'react';
import { BarChart3, Clock, TrendingUp, Sparkles, MapPin, DollarSign } from 'lucide-react';
import { useReceiptStore } from '../store/useReceiptStore';

function getHeatmapColor(count: number, maxCount: number): string {
  if (count <= 0) return '#27272a';
  const ratio = Math.min(1, count / (maxCount || 1));
  const hue = Math.round(280 - ratio * 240); // Purple -> Amber -> Red
  const lightness = Math.round(35 + ratio * 35);
  return `hsl(${hue}, 85%, ${lightness}%)`;
}

export const PatternLabView: React.FC = () => {
  const computed = useReceiptStore((state) => state.computed);

  const heatmap = computed?.heatmap;
  const interestStream = computed?.interestStream;
  const moodTimeline = computed?.moodTimeline;
  const spending = computed?.spending;
  const constellation = computed?.constellation;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-mono space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b border-neutral-800 pb-4">
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
      <div className="bg-[var(--bg-desk-secondary)] p-6 rounded-xl border border-neutral-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              1. Hour of Day (00..23) × Category Heatmap
            </h3>
          </div>
          <span className="text-xs text-neutral-400">24 × 9 Matrix</span>
        </div>

        <div className="overflow-x-auto">
          <svg width="700" height="240" className="mx-auto block font-mono text-[10px]">
            {/* Hour Labels */}
            {Array.from({ length: 24 }).map((_, h) => (
              <text key={h} x={50 + h * 26} y="20" fill="#a1a1aa" textAnchor="middle">
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
                <text x="40" y="12" fill="#e4e4e7" textAnchor="end" className="capitalize font-bold">
                  {cat}
                </text>
                {Array.from({ length: 24 }).map((_, h) => {
                  const cell = heatmap?.cells.find((c) => c.hour === h && c.category === cat);
                  const count = cell?.count || 0;
                  const fill = getHeatmapColor(count, heatmap?.maxCount || 100);

                  return (
                    <rect
                      key={h}
                      x={50 + h * 26 - 10}
                      y={2}
                      width={22}
                      height={16}
                      rx={2}
                      fill={fill}
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

        <div className="bg-amber-500/10 p-3 rounded border border-amber-500/20 text-xs text-amber-300 font-serif italic">
          💡 Insight Caption: "{heatmap?.insight || 'Computing heatmap...'}"
        </div>
      </div>

      {/* 2. Chapter Interest Shift Stream */}
      <div className="bg-[var(--bg-desk-secondary)] p-6 rounded-xl border border-neutral-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              2. Chapter-by-Chapter Interest Shift Stream
            </h3>
          </div>
          <span className="text-xs text-neutral-400">5 Eras Evolution</span>
        </div>

        <div className="overflow-x-auto">
          <svg width="700" height="200" className="mx-auto block font-mono text-[10px]">
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
                  <text x={x + barWidth / 2} y="180" fill="#a1a1aa" textAnchor="middle" className="font-bold">
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

        <div className="bg-purple-500/10 p-3 rounded border border-purple-500/20 text-xs text-purple-300 font-serif italic">
          💡 Insight Caption: "{interestStream?.insight}"
        </div>
      </div>

      {/* 3. Mood Line Timeline */}
      <div className="bg-[var(--bg-desk-secondary)] p-6 rounded-xl border border-neutral-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              3. Lifetime Mood Score Timeline
            </h3>
          </div>
          <span className="text-xs text-neutral-400">Moving Average</span>
        </div>

        <div className="overflow-x-auto">
          <svg width="700" height="180" className="mx-auto block font-mono text-[10px]">
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

        <div className="bg-indigo-500/10 p-3 rounded border border-indigo-500/20 text-xs text-indigo-300 font-serif italic">
          💡 Insight Caption: "{moodTimeline?.insight}"
        </div>
      </div>

      {/* 4. Spending by Category over Time */}
      <div className="bg-[var(--bg-desk-secondary)] p-6 rounded-xl border border-neutral-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              4. Annual Expenditure Curve (₹ INR)
            </h3>
          </div>
          <span className="text-xs text-neutral-400">Financial Growth</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {spending?.points.map((pt) => (
            <div key={pt.period} className="bg-neutral-900 p-3 rounded border border-neutral-800 space-y-1">
              <div className="text-[10px] text-neutral-400 font-bold">{pt.period}</div>
              <div className="text-base font-bold text-emerald-400">₹{pt.totalSpent.toLocaleString()}</div>
              <div className="text-[10px] text-neutral-500 truncate">
                Top: {Object.keys(pt.categories)[0] || 'Expenses'}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-500/10 p-3 rounded border border-emerald-500/20 text-xs text-emerald-300 font-serif italic">
          💡 Insight Caption: "{spending?.insight}"
        </div>
      </div>

      {/* 5. Constellation Graph */}
      <div className="bg-[var(--bg-desk-secondary)] p-6 rounded-xl border border-neutral-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-pink-500" />
            <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
              5. Recurring Places & Artists Constellation Graph
            </h3>
          </div>
          <span className="text-xs text-neutral-400">Graph Gravity Nodes</span>
        </div>

        <div className="overflow-x-auto">
          <svg width="500" height="380" className="mx-auto block font-mono text-[10px]">
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
                  stroke="#52525b"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
              );
            })}

            {/* Draw Nodes */}
            {constellation?.nodes.map((node) => {
              const fill = node.category === 'artist' ? '#8b5cf6' : node.category === 'merchant' ? '#10b981' : '#f59e0b';
              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  <circle r={node.val / 2} fill={fill} opacity="0.85" className="hover:opacity-100 cursor-pointer" />
                  <text y={node.val / 2 + 10} fill="#e4e4e7" textAnchor="middle" className="font-bold text-[9px]">
                    {node.name.length > 15 ? node.name.slice(0, 14) + '…' : node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="bg-pink-500/10 p-3 rounded border border-pink-500/20 text-xs text-pink-300 font-serif italic">
          💡 Insight Caption: "{constellation?.insight}"
        </div>
      </div>
    </div>
  );
};
