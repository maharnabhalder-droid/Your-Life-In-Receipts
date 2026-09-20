import { Chapter, Moment, NormalizedReceipt, ThreadConnection } from '../types/receipt';
import { detectChapters } from './chapters';
import { calculateConnections } from './connections';
import { computeConstellation, computeHeatmap, computeInterestStream, computeMoodTimeline, computeSpendingOverTime } from './patterns';

export interface ComputedResults {
  chapters: Chapter[];
  connections: ThreadConnection[];
  moments: Moment[];
  heatmap: ReturnType<typeof computeHeatmap>;
  interestStream: ReturnType<typeof computeInterestStream>;
  moodTimeline: ReturnType<typeof computeMoodTimeline>;
  spending: ReturnType<typeof computeSpendingOverTime>;
  constellation: ReturnType<typeof computeConstellation>;
}

export function runEngineWorker(
  receipts: NormalizedReceipt[],
  activeReceiptId?: string
): Promise<ComputedResults> {
  return new Promise((resolve) => {
    if (typeof Worker !== 'undefined') {
      try {
        const worker = new Worker(new URL('./worker.ts', import.meta.url), {
          type: 'module',
        });

        worker.onmessage = (e: MessageEvent<{ type: string; payload: ComputedResults }>) => {
          if (e.data.type === 'COMPUTE_ALL_SUCCESS') {
            resolve(e.data.payload);
            worker.terminate();
          }
        };

        worker.postMessage({ type: 'COMPUTE_ALL', receipts, activeReceiptId });
        return;
      } catch (err) {
        console.warn('Worker initialization fallback to synchronous engine execution:', err);
      }
    }

    // Synchronous fallback
    const chapters = detectChapters(receipts);
    const { connections, moments } = calculateConnections(receipts, activeReceiptId);
    const heatmap = computeHeatmap(receipts);
    const interestStream = computeInterestStream(receipts);
    const moodTimeline = computeMoodTimeline(receipts);
    const spending = computeSpendingOverTime(receipts);
    const constellation = computeConstellation(receipts);

    resolve({
      chapters,
      connections,
      moments,
      heatmap,
      interestStream,
      moodTimeline,
      spending,
      constellation,
    });
  });
}
