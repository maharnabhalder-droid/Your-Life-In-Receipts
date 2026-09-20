import React from 'react';
import { motion } from 'motion/react';
import { Network, Sparkles, ArrowRight, Zap, Share2 } from 'lucide-react';
import { useReceiptStore } from '../store/useReceiptStore';

export const ThreadsView: React.FC = () => {
  const computed = useReceiptStore((state) => state.computed);
  const receipts = useReceiptStore((state) => state.receipts);
  const openMomentDrawer = useReceiptStore((state) => state.openMomentDrawer);
  const selectReceipt = useReceiptStore((state) => state.selectReceipt);

  const moments = computed?.moments || [];
  const connections = computed?.connections || [];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-mono space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <Network className="w-6 h-6 text-purple-400" />
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-[var(--text-main)]">
            Thread Graph & Narrative Moments
          </h2>
        </div>
        <p className="text-xs md:text-sm text-[var(--text-muted)] max-w-xl">
          Discover hidden cross-domain threads connecting music plays, transport logs, searches, purchases, and festival photo captures.
        </p>
      </div>

      {/* Curated Moments List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> CURATED LIFE MOMENTS ({moments.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moments.map((mom) => (
            <motion.div
              key={mom.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => openMomentDrawer(mom)}
              className="receipt-paper p-5 rounded-lg border-2 border-purple-500/30 shadow-xl cursor-pointer hover:border-purple-500 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {mom.patternType}
                </span>
                <span className="text-xs font-bold text-amber-600">
                  {Math.round(mom.connectionStrength * 100)}% Strength
                </span>
              </div>

              <h4 className="font-serif font-bold text-base text-[var(--ink-primary)]">
                {mom.title}
              </h4>

              <p className="text-xs text-[var(--ink-secondary)] italic">
                "{mom.description}"
              </p>

              <div className="pt-2 border-t border-dashed border-[var(--border-receipt)] flex items-center justify-between text-[11px] text-[var(--ink-faded)]">
                <span>{mom.receiptIds.length} Connected Receipts</span>
                <span className="flex items-center gap-1 font-bold text-[var(--ink-primary)]">
                  Inspect Moment <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Thread Connections List */}
      <div className="space-y-4 pt-4 border-t border-neutral-800">
        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-4 h-4" /> TOP STITCHED THREAD EDGES ({connections.length})
        </h3>

        <div className="bg-[var(--bg-desk-secondary)] p-4 rounded-xl border border-neutral-800 space-y-3 max-h-96 overflow-y-auto">
          {connections.slice(0, 15).map((conn, idx) => {
            const source = receipts.find((r) => r.id === conn.sourceId);
            const target = receipts.find((r) => r.id === conn.targetId);
            if (!source || !target) return null;

            return (
              <div
                key={idx}
                onClick={() => selectReceipt(source.id)}
                className="bg-neutral-900/90 p-3 rounded border border-neutral-800 hover:border-amber-500/50 cursor-pointer text-xs space-y-1 transition-all"
              >
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">[{source.type.toUpperCase()}] {source.title}</span>
                    <Share2 className="w-3 h-3 text-neutral-500" />
                    <span className="text-purple-400">[{target.type.toUpperCase()}] {target.title}</span>
                  </div>
                  <span className="text-amber-500">{Math.round(conn.score * 100)}%</span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  {conn.reasons.join(' • ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
