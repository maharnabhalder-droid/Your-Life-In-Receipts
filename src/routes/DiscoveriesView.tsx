import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Lock, Unlock, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import { useReceiptStore } from '../store/useReceiptStore';
import { getEvidenceReceipts, INITIAL_DISCOVERIES } from '../engine/discoveries';

export const DiscoveriesView: React.FC<{ setRoute: (route: string) => void }> = ({ setRoute }) => {
  const receipts = useReceiptStore((state) => state.receipts);
  const unlockedIds = useReceiptStore((state) => state.unlockedDiscoveryIds);
  const unlockDiscovery = useReceiptStore((state) => state.unlockDiscovery);
  const selectReceipt = useReceiptStore((state) => state.selectReceipt);

  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);

  const totalDiscoveries = INITIAL_DISCOVERIES.length;
  const unlockedCount = unlockedIds.length;
  const progressPct = Math.round((unlockedCount / totalDiscoveries) * 100);

  const selectedDisc = INITIAL_DISCOVERIES.find((d) => d.id === activeEvidenceId);
  const evidenceReceipts = activeEvidenceId ? getEvidenceReceipts(activeEvidenceId, receipts) : [];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-mono space-y-8">
      {/* Header & Progress Bar */}
      <div className="bg-[var(--bg-desk-secondary)] p-6 rounded-xl border border-neutral-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-500" />
            <div>
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-[var(--text-main)]">
                Discoveries Meter
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Game-like unlock layer discovering hidden narrative arcs in your lifetime receipt roll.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-amber-400">{unlockedCount} / {totalDiscoveries}</span>
            <span className="block text-[10px] text-neutral-400 uppercase tracking-wider">UNLOCKED INSIGHTS</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-900 h-3 rounded-full overflow-hidden border border-neutral-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 h-full"
          />
        </div>
      </div>

      {/* Discovery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INITIAL_DISCOVERIES.map((disc) => {
          const isUnlocked = unlockedIds.includes(disc.id);
          const isSelected = activeEvidenceId === disc.id;

          return (
            <motion.div
              key={disc.id}
              whileHover={{ scale: 1.01 }}
              className={`p-5 rounded-lg border transition-all space-y-3 relative ${
                isUnlocked
                  ? isSelected
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-400'
                    : 'bg-[var(--bg-desk-secondary)] border-neutral-700 hover:border-amber-500/50'
                  : 'bg-neutral-900/50 border-neutral-800 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-800 text-amber-400 border border-neutral-700">
                  {disc.badge}
                </span>

                <div className="flex items-center gap-1.5">
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> UNLOCKED
                    </span>
                  ) : (
                    <button
                      onClick={() => unlockDiscovery(disc.id)}
                      className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
                    >
                      <Lock className="w-3 h-3" /> UNLOCK NOW
                    </button>
                  )}
                </div>
              </div>

              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                {disc.title}
              </h3>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {isUnlocked ? disc.description : '🔒 Explore the roll or click unlock to reveal this hidden discovery.'}
              </p>

              {isUnlocked && (
                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">{disc.category}</span>
                  <button
                    onClick={() => setActiveEvidenceId(isSelected ? null : disc.id)}
                    className="flex items-center gap-1 font-bold text-amber-400 hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {isSelected ? 'Hide Evidence' : 'Inspect Evidence Receipts'}
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Evidence Receipts Modal / Sub-section */}
      {selectedDisc && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--bg-desk-secondary)] p-6 rounded-xl border-2 border-amber-500/40 space-y-4 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
                Evidence Receipts for "{selectedDisc.title}"
              </h3>
            </div>
            <button
              onClick={() => setActiveEvidenceId(null)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {evidenceReceipts.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  selectReceipt(r.id);
                  setRoute('/roll');
                }}
                className="bg-neutral-900 p-3 rounded border border-neutral-700 hover:border-amber-400 cursor-pointer text-xs space-y-1"
              >
                <div className="flex justify-between font-bold text-amber-400">
                  <span>[{r.type.toUpperCase()}] {r.title}</span>
                  <span>{new Date(r.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="text-[11px] text-neutral-300 truncate">{r.text || r.subtitle}</div>
                <div className="text-[10px] text-amber-300 underline pt-1">
                  Click to jump to receipt in Roll →
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
