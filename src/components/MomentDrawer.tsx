import React from 'react';
import { Drawer } from 'vaul';
import { X, Sparkles, Link, Zap } from 'lucide-react';
import { useReceiptStore } from '../store/useReceiptStore';

export const MomentDrawer: React.FC = () => {
  const isOpen = useReceiptStore((state) => state.isMomentDrawerOpen);
  const activeMoment = useReceiptStore((state) => state.activeMoment);
  const closeDrawer = useReceiptStore((state) => state.closeMomentDrawer);

  const selectedReceiptId = useReceiptStore((state) => state.selectedReceiptId);
  const receipts = useReceiptStore((state) => state.receipts);
  const computed = useReceiptStore((state) => state.computed);

  const selectedReceipt = receipts.find((r) => r.id === selectedReceiptId);
  const activeConnections = computed?.connections.filter(
    (c) => c.sourceId === selectedReceiptId || c.targetId === selectedReceiptId
  ) || [];

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Drawer.Content className="bg-[var(--bg-desk)] border-t-2 border-amber-500 rounded-t-2xl fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto font-mono text-[var(--text-main)] shadow-2xl p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Drawer Drag Handle */}
            <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mb-2" />

            <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <Drawer.Title className="font-serif font-bold text-lg md:text-xl text-[var(--text-main)]">
                    {activeMoment?.title || 'Connected Moment'}
                  </Drawer.Title>
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                    {activeMoment?.patternType || 'Thread Connection Logic'}
                  </span>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-md text-neutral-400 hover:text-white bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Moment Description & Strength */}
            <div className="bg-[var(--bg-desk-secondary)] p-4 rounded-lg border border-neutral-800 space-y-2">
              <p className="font-serif italic text-sm text-neutral-200">
                "{activeMoment?.description || 'These life receipts share strong temporal, spatial, and semantic affinity.'}"
              </p>
              {activeMoment && (
                <div className="flex items-center gap-2 text-xs pt-1">
                  <span className="text-neutral-400">Connection Strength:</span>
                  <div className="flex-1 bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-purple-500 h-full"
                      style={{ width: `${Math.round(activeMoment.connectionStrength * 100)}%` }}
                    />
                  </div>
                  <span className="font-bold text-amber-400">
                    {Math.round(activeMoment.connectionStrength * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Connection Rationale Details */}
            {selectedReceipt && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> WHY THEY ARE CONNECTED TO #{selectedReceipt.id.slice(-6)}
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeConnections.length > 0 ? (
                    activeConnections.map((c, i) => {
                      const otherId = c.sourceId === selectedReceiptId ? c.targetId : c.sourceId;
                      const otherReceipt = receipts.find((r) => r.id === otherId);
                      if (!otherReceipt) return null;

                      return (
                        <div key={i} className="bg-neutral-900 p-3 rounded border border-neutral-800 text-xs space-y-1">
                          <div className="flex justify-between font-bold text-amber-300">
                            <span>Link to [{otherReceipt.type.toUpperCase()}] {otherReceipt.title}</span>
                            <span>Score: {Math.round(c.score * 100)}%</span>
                          </div>
                          <ul className="list-disc list-inside text-[11px] text-neutral-400 space-y-0.5">
                            {c.reasons.map((r, idx) => (
                              <li key={idx}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-neutral-400 italic bg-neutral-900 p-3 rounded border border-neutral-800">
                      Receipt selected. Scroll through the Roll to see stitched thread connections highlighted on related receipts.
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={closeDrawer}
                className="px-4 py-2 rounded bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
              >
                Continue Exploring The Roll
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
