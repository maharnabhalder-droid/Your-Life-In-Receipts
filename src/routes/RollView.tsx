import React, { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useReceiptStore } from '../store/useReceiptStore';
import { ChapterReceipt } from '../components/receipts/ChapterReceipt';
import { MusicReceipt } from '../components/receipts/MusicReceipt';
import { PurchaseReceipt } from '../components/receipts/PurchaseReceipt';
import { PlaceReceipt } from '../components/receipts/PlaceReceipt';
import { MovieReceipt } from '../components/receipts/MovieReceipt';
import { EventReceipt } from '../components/receipts/EventReceipt';
import { MessageReceipt } from '../components/receipts/MessageReceipt';
import { SearchReceipt } from '../components/receipts/SearchReceipt';
import { PhotoReceipt } from '../components/receipts/PhotoReceipt';
import { NormalizedReceipt } from '../types/receipt';
import { RotateCcw } from 'lucide-react';
import { FilterBar } from '../components/FilterBar';

export const RollView: React.FC = () => {
  const filteredReceipts = useReceiptStore((state) => state.filteredReceipts);
  const computed = useReceiptStore((state) => state.computed);
  const selectedReceiptId = useReceiptStore((state) => state.selectedReceiptId);
  const openMomentDrawer = useReceiptStore((state) => state.openMomentDrawer);
  const resetAllFilters = useReceiptStore((state) => state.resetAllFilters);

  const chapters = computed?.chapters || [];

  // Stable virtual items list
  const virtualItemsList = useMemo(() => {
    const list: Array<{ type: 'chapter' | 'receipt'; data: any }> = [];
    const chapterReceiptSet = new Set<string>();

    chapters.forEach((ch) => {
      list.push({ type: 'chapter', data: ch });
      const chReceipts = filteredReceipts.filter((r) => ch.receiptIds.includes(r.id));
      chReceipts.forEach((r) => {
        chapterReceiptSet.add(r.id);
        list.push({ type: 'receipt', data: r });
      });
    });

    filteredReceipts.forEach((r) => {
      if (!chapterReceiptSet.has(r.id)) {
        list.push({ type: 'receipt', data: r });
      }
    });

    return list;
  }, [filteredReceipts, chapters]);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: virtualItemsList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => (virtualItemsList[index]?.type === 'chapter' ? 420 : 250),
    getItemKey: (index) => (virtualItemsList[index]?.type === 'chapter' ? `ch-${virtualItemsList[index].data.id}` : virtualItemsList[index].data.id),
    overscan: 6,
  });

  const renderReceiptComponent = (receipt: NormalizedReceipt) => {
    switch (receipt.type) {
      case 'music':
        return <MusicReceipt receipt={receipt} />;
      case 'purchase':
        return <PurchaseReceipt receipt={receipt} />;
      case 'place':
        return <PlaceReceipt receipt={receipt} />;
      case 'movie':
        return <MovieReceipt receipt={receipt} />;
      case 'event':
        return <EventReceipt receipt={receipt} />;
      case 'message':
        return <MessageReceipt receipt={receipt} />;
      case 'search':
        return <SearchReceipt receipt={receipt} />;
      case 'photo':
        return <PhotoReceipt receipt={receipt} />;
      default:
        return <PurchaseReceipt receipt={receipt} />;
    }
  };

  const activeConnections = useMemo(() => {
    if (!selectedReceiptId || !computed?.connections) return [];
    return computed.connections.filter(
      (c) => c.sourceId === selectedReceiptId || c.targetId === selectedReceiptId
    );
  }, [selectedReceiptId, computed?.connections]);

  const selectReceipt = useReceiptStore((state) => state.selectReceipt);

  return (
    <div className="flex flex-col min-h-screen">
      <FilterBar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-2 md:p-6">
        {filteredReceipts.length === 0 ? (
          <div className="text-center py-20 font-mono text-[var(--text-muted)] space-y-4 max-w-md mx-auto">
            <p className="text-lg font-serif text-[var(--text-main)] font-bold">No receipts match your active filters.</p>
            <p className="text-xs text-[var(--text-muted)]">Try clearing your search term, mood selections, or date scrubber range.</p>
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded shadow hover:bg-amber-400 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer min-h-[44px] min-w-[44px]"
            >
              <RotateCcw className="w-4 h-4" /> Reset All Filters
            </button>
          </div>
        ) : (
          <div
            ref={parentRef}
            className="h-[calc(100vh-140px)] overflow-y-auto px-2 space-y-2 relative no-scrollbar"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const item = virtualItemsList[virtualRow.index];
                if (!item) return null;

                const isConnectedToActive =
                  selectedReceiptId &&
                  item.type === 'receipt' &&
                  activeConnections.some((c) => c.sourceId === item.data.id || c.targetId === item.data.id);

                return (
                  <div
                    key={virtualRow.key}
                    ref={rowVirtualizer.measureElement}
                    data-index={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="pb-3"
                    onClick={() => {
                      if (item.type === 'receipt') {
                        selectReceipt(item.data.id);
                        const matchedMoment = computed?.moments.find(m => m.receiptIds.includes(item.data.id)) || {
                          id: `context-${item.data.id}`,
                          title: `Thread for ${item.data.title}`,
                          description: `Direct affinity links and sequence context for receipt #${item.data.id.slice(-6)}.`,
                          receiptIds: [item.data.id],
                          connectionStrength: 0.88,
                          patternType: 'Individual Receipt Thread'
                        };
                        openMomentDrawer(matchedMoment);
                      }
                    }}
                  >
                    {item.type === 'chapter' ? (
                      <ChapterReceipt chapter={item.data} />
                    ) : (
                      <div className={`transition-all duration-200 ${isConnectedToActive ? 'ring-2 ring-purple-500 rounded-lg p-1 bg-purple-500/10 shadow-lg' : ''}`}>
                        {renderReceiptComponent(item.data)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
