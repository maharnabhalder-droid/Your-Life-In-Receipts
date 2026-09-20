import React from 'react';
import { Bookmark, Sparkles, TrendingUp, Clock, Wallet } from 'lucide-react';
import { Chapter } from '../../types/receipt';

export const ChapterReceipt: React.FC<{ chapter: Chapter }> = ({ chapter }) => {
  const startDate = new Date(chapter.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const endDate = new Date(chapter.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="py-4 max-w-xl mx-auto z-10">
      <div className="receipt-paper p-6 md:p-8 rounded-md torn-both shadow-2xl border-2 border-amber-500/40 relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-widest px-3 py-0.5 rounded shadow">
          ★ CHAPTER ERA ★
        </div>

        <div className="flex items-center justify-between border-b-2 border-dashed border-[var(--border-receipt)] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500" />
            <span className="font-serif font-bold text-lg md:text-xl text-[var(--ink-primary)]">
              {chapter.title}
            </span>
          </div>
          <span className="text-xs font-mono bg-amber-500/10 px-2 py-1 rounded text-amber-600 border border-amber-500/20 font-semibold">
            {startDate} – {endDate}
          </span>
        </div>

        {/* Persona Banner */}
        <div className="bg-[var(--paper-bg-alt)] p-3 rounded border border-[var(--border-receipt)] mb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[var(--ink-faded)] uppercase tracking-wider block">PERSONA ARCHETYPE</span>
            <span className="font-serif font-bold text-base text-[var(--ink-primary)]">{chapter.persona}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[var(--ink-faded)] uppercase tracking-wider block">DOMINANT MOOD</span>
            <span className="font-mono text-xs font-bold uppercase text-amber-600 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {chapter.dominantMood}
            </span>
          </div>
        </div>

        {/* Narrative Copy */}
        <p className="font-serif italic text-sm md:text-base text-[var(--ink-primary)] leading-relaxed mb-5 border-l-2 border-amber-500 pl-3">
          "{chapter.narrative}"
        </p>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 border-t border-dashed border-[var(--border-receipt)] text-xs text-[var(--ink-secondary)] font-mono">
          <div className="bg-[var(--paper-bg-alt)] p-2 rounded text-center border border-[var(--border-receipt)]">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
            <span className="block text-[10px] opacity-75">FOOTPRINTS</span>
            <span className="font-bold text-[var(--ink-primary)]">{chapter.topStats.totalReceipts}</span>
          </div>
          <div className="bg-[var(--paper-bg-alt)] p-2 rounded text-center border border-[var(--border-receipt)]">
            <Sparkles className="w-3.5 h-3.5 text-purple-500 mx-auto mb-1" />
            <span className="block text-[10px] opacity-75">TOP ANCHOR</span>
            <span className="font-bold text-[var(--ink-primary)] truncate block">{chapter.topStats.topArtistOrMerchant}</span>
          </div>
          <div className="bg-[var(--paper-bg-alt)] p-2 rounded text-center border border-[var(--border-receipt)]">
            <Wallet className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-1" />
            <span className="block text-[10px] opacity-75">TOTAL SPENT</span>
            <span className="font-bold text-[var(--ink-primary)]">₹{chapter.topStats.totalSpent.toLocaleString()}</span>
          </div>
          <div className="bg-[var(--paper-bg-alt)] p-2 rounded text-center border border-[var(--border-receipt)]">
            <Clock className="w-3.5 h-3.5 text-red-500 mx-auto mb-1" />
            <span className="block text-[10px] opacity-75">NOCTURNAL</span>
            <span className="font-bold text-[var(--ink-primary)]">{chapter.topStats.nocturnalRatio}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
