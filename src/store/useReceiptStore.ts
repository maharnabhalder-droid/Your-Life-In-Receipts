import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loadNormalizedReceipts } from '../data/loader';
import { ComputedResults, runEngineWorker } from '../engine/worker-client';
import { Moment, NormalizedReceipt, ReceiptType } from '../types/receipt';

export interface ReceiptState {
  // Data & Results
  receipts: NormalizedReceipt[];
  filteredReceipts: NormalizedReceipt[];
  computed: ComputedResults | null;
  isLoading: boolean;

  // Filters & State
  searchQuery: string;
  selectedTypes: ReceiptType[];
  selectedMoods: string[];
  dateRange: [string, string]; // [minISO, maxISO]
  selectedReceiptId: string | null;
  activeMoment: Moment | null;
  isMomentDrawerOpen: boolean;

  // Unlocked Discoveries
  unlockedDiscoveryIds: string[];

  // Actions
  init: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  toggleTypeFilter: (type: ReceiptType) => void;
  clearTypeFilters: () => void;
  toggleMoodFilter: (mood: string) => void;
  setDateRange: (range: [string, string]) => void;
  selectReceipt: (id: string | null) => void;
  openMomentDrawer: (moment: Moment) => void;
  closeMomentDrawer: () => void;
  unlockDiscovery: (id: string) => void;
  surpriseMe: () => void;
  resetAllFilters: () => void;
  getFilteredReceipts: () => NormalizedReceipt[];
}

function computeFilteredReceipts(
  receipts: NormalizedReceipt[],
  searchQuery: string,
  selectedTypes: ReceiptType[],
  selectedMoods: string[],
  dateRange: [string, string]
): NormalizedReceipt[] {
  if (!receipts || receipts.length === 0) return [];

  const queryLower = searchQuery.toLowerCase().trim();
  const rawStartMs = new Date(dateRange[0]).getTime();
  const rawEndMs = new Date(dateRange[1]).getTime() + 86400000;

  const startMs = isNaN(rawStartMs) ? new Date('2013-01-01').getTime() : rawStartMs;
  const endMs = isNaN(rawEndMs) ? new Date('2024-12-31').getTime() + 86400000 : rawEndMs;

  const isDefaultDate = (dateRange[0] === '2013-01-01' || !dateRange[0]) && (dateRange[1] === '2024-12-31' || !dateRange[1]);

  if (!queryLower && selectedTypes.length === 0 && selectedMoods.length === 0 && isDefaultDate) {
    return receipts;
  }

  return receipts.filter((r) => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(r.type)) return false;
    if (selectedMoods.length > 0 && r.mood && !selectedMoods.includes(r.mood)) return false;

    const t = new Date(r.timestamp).getTime();
    if (t < startMs || t > endMs) return false;

    if (queryLower) {
      const matchTitle = r.title.toLowerCase().includes(queryLower);
      const matchSubtitle = (r.subtitle || '').toLowerCase().includes(queryLower);
      const matchText = (r.text || '').toLowerCase().includes(queryLower);
      const matchTags = r.tags.some((tag) => tag.toLowerCase().includes(queryLower));
      return matchTitle || matchSubtitle || matchText || matchTags;
    }

    return true;
  });
}

export const useReceiptStore = create<ReceiptState>()(
  persist(
    (set, get) => ({
      receipts: [],
      filteredReceipts: [],
      computed: null,
      isLoading: true,

      searchQuery: '',
      selectedTypes: [],
      selectedMoods: [],
      dateRange: ['2013-01-01', '2024-12-31'],
      selectedReceiptId: null,
      activeMoment: null,
      isMomentDrawerOpen: false,

      unlockedDiscoveryIds: ['disc-1', 'disc-2'], // Initial unlocked starters

      init: async () => {
        const data = await loadNormalizedReceipts();
        const filtered = computeFilteredReceipts(
          data,
          get().searchQuery,
          get().selectedTypes,
          get().selectedMoods,
          get().dateRange
        );

        set({ receipts: data, filteredReceipts: filtered, isLoading: true });

        const results = await runEngineWorker(data);
        set({ computed: results, isLoading: false });
      },

      setSearchQuery: (searchQuery) => {
        const filtered = computeFilteredReceipts(
          get().receipts,
          searchQuery,
          get().selectedTypes,
          get().selectedMoods,
          get().dateRange
        );
        set({ searchQuery, filteredReceipts: filtered });
      },

      toggleTypeFilter: (type) => {
        const current = get().selectedTypes;
        const next = current.includes(type)
          ? current.filter((t) => t !== type)
          : [...current, type];

        const filtered = computeFilteredReceipts(
          get().receipts,
          get().searchQuery,
          next,
          get().selectedMoods,
          get().dateRange
        );
        set({ selectedTypes: next, filteredReceipts: filtered });
      },

      clearTypeFilters: () => {
        const filtered = computeFilteredReceipts(
          get().receipts,
          get().searchQuery,
          [],
          get().selectedMoods,
          get().dateRange
        );
        set({ selectedTypes: [], filteredReceipts: filtered });
      },

      toggleMoodFilter: (mood) => {
        const current = get().selectedMoods;
        const next = current.includes(mood)
          ? current.filter((m) => m !== mood)
          : [...current, mood];

        const filtered = computeFilteredReceipts(
          get().receipts,
          get().searchQuery,
          get().selectedTypes,
          next,
          get().dateRange
        );
        set({ selectedMoods: next, filteredReceipts: filtered });
      },

      setDateRange: (dateRange) => {
        const filtered = computeFilteredReceipts(
          get().receipts,
          get().searchQuery,
          get().selectedTypes,
          get().selectedMoods,
          dateRange
        );
        set({ dateRange, filteredReceipts: filtered });
      },

      selectReceipt: async (id) => {
        set({ selectedReceiptId: id });
        if (id) {
          const receipts = get().receipts;
          const updated = await runEngineWorker(receipts, id);
          set({ computed: updated });
        }
      },

      openMomentDrawer: (activeMoment) => set({ activeMoment, isMomentDrawerOpen: true }),

      closeMomentDrawer: () => set({ isMomentDrawerOpen: false, activeMoment: null }),

      unlockDiscovery: (id) => {
        const current = get().unlockedDiscoveryIds;
        if (!current.includes(id)) {
          set({ unlockedDiscoveryIds: [...current, id] });
        }
      },

      surpriseMe: () => {
        const receipts = get().filteredReceipts;
        if (receipts.length === 0) return;
        const randomIndex = Math.floor(Math.random() * receipts.length);
        const target = receipts[randomIndex];
        set({ selectedReceiptId: target.id });

        const currentUnlocks = get().unlockedDiscoveryIds;
        const allDiscs = ['disc-1', 'disc-2', 'disc-3', 'disc-4', 'disc-5', 'disc-6', 'disc-7', 'disc-8', 'disc-9', 'disc-10'];
        const locked = allDiscs.filter((d) => !currentUnlocks.includes(d));
        if (locked.length > 0) {
          const newDisc = locked[Math.floor(Math.random() * locked.length)];
          set({ unlockedDiscoveryIds: [...currentUnlocks, newDisc] });
        }
      },

      resetAllFilters: () => {
        const filtered = computeFilteredReceipts(get().receipts, '', [], [], ['2013-01-01', '2024-12-31']);
        set({
          searchQuery: '',
          selectedTypes: [],
          selectedMoods: [],
          dateRange: ['2013-01-01', '2024-12-31'],
          filteredReceipts: filtered,
        });
      },

      getFilteredReceipts: () => get().filteredReceipts,
    }),
    {
      name: 'your-life-in-receipts-storage',
      partialize: (state) => ({
        unlockedDiscoveryIds: state.unlockedDiscoveryIds,
      }),
    }
  )
);
