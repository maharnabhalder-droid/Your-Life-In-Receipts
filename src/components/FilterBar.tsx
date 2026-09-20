import React from 'react';
import { Filter, X, Calendar } from 'lucide-react';
import { useReceiptStore } from '../store/useReceiptStore';
import { Mood, ReceiptType } from '../types/receipt';

const typeIcons: Record<ReceiptType, string> = {
  music: '🎵',
  purchase: '🛍️',
  place: '📍',
  movie: '🍿',
  event: '🎉',
  message: '💬',
  note: '📝',
  search: '🔍',
  photo: '📸',
};

const allTypes: ReceiptType[] = [
  'music',
  'purchase',
  'place',
  'movie',
  'event',
  'message',
  'note',
  'search',
  'photo',
];

const allMoods: Mood[] = [
  'melancholic',
  'introspective',
  'driven',
  'restless',
  'focused',
  'balanced',
];

export const FilterBar: React.FC = () => {
  const selectedTypes = useReceiptStore((state) => state.selectedTypes);
  const toggleTypeFilter = useReceiptStore((state) => state.toggleTypeFilter);
  const clearTypeFilters = useReceiptStore((state) => state.clearTypeFilters);

  const selectedMoods = useReceiptStore((state) => state.selectedMoods);
  const toggleMoodFilter = useReceiptStore((state) => state.toggleMoodFilter);

  const dateRange = useReceiptStore((state) => state.dateRange);
  const setDateRange = useReceiptStore((state) => state.setDateRange);

  const searchQuery = useReceiptStore((state) => state.searchQuery);
  const setSearchQuery = useReceiptStore((state) => state.setSearchQuery);

  const filteredCount = useReceiptStore((state) => state.filteredReceipts.length);
  const totalCount = useReceiptStore((state) => state.receipts.length);

  return (
    <div className="bg-[var(--bg-desk-secondary)] border-b border-neutral-800 px-3 py-2.5 md:px-4 sticky top-12 z-30 shadow-inner font-mono text-xs text-[var(--text-main)] space-y-2">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Type Filter Pills (Horizontal Scrollable on Mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3 h-3 text-amber-500" /> TYPE:
          </span>

          {allTypes.map((t) => {
            const isActive = selectedTypes.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleTypeFilter(t)}
                className={`px-2 py-1 rounded border text-[11px] font-medium transition-all flex items-center gap-1 shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-black border-amber-400 font-bold shadow'
                    : 'bg-neutral-800/70 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                }`}
              >
                <span>{typeIcons[t]}</span>
                <span className="capitalize">{t}</span>
              </button>
            );
          })}

          {selectedTypes.length > 0 && (
            <button
              onClick={clearTypeFilters}
              className="text-[10px] text-red-400 hover:text-red-300 underline ml-1 flex items-center gap-0.5 shrink-0"
            >
              <X className="w-3 h-3" /> Clear ({selectedTypes.length})
            </button>
          )}
        </div>

        {/* Date Range Scrubber */}
        <div className="flex items-center gap-1.5 bg-neutral-900/90 px-2 py-1 rounded border border-neutral-700 text-[10px] sm:text-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <input
            type="date"
            value={dateRange[0]}
            onChange={(e) => setDateRange([e.target.value, dateRange[1]])}
            className="bg-transparent text-[10px] sm:text-[11px] text-neutral-200 focus:outline-none cursor-pointer max-w-[100px] sm:max-w-none"
          />
          <span className="text-neutral-500">to</span>
          <input
            type="date"
            value={dateRange[1]}
            onChange={(e) => setDateRange([dateRange[0], e.target.value])}
            className="bg-transparent text-[10px] sm:text-[11px] text-neutral-200 focus:outline-none cursor-pointer max-w-[100px] sm:max-w-none"
          />
        </div>
      </div>

      {/* Mood Filters & Active Search Badge */}
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] border-t border-neutral-800/50">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          <span className="text-[var(--text-muted)] font-bold shrink-0">MOOD:</span>
          {allMoods.map((m) => {
            const isActive = selectedMoods.includes(m);
            return (
              <button
                key={m}
                onClick={() => toggleMoodFilter(m)}
                className={`px-1.5 py-0.5 rounded border capitalize transition-all shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white border-purple-400 font-bold'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>

        <div className="text-[var(--text-muted)] font-mono">
          Showing <span className="font-bold text-amber-400">{filteredCount}</span> of {totalCount} receipts
          {searchQuery && (
            <span className="ml-2 bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
              Query: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="ml-1 text-red-400 font-bold">×</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
