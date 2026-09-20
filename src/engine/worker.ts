import { detectChapters } from './chapters';
import { calculateConnections } from './connections';
import { computeConstellation, computeHeatmap, computeInterestStream, computeMoodTimeline, computeSpendingOverTime } from './patterns';
import { NormalizedReceipt } from '../types/receipt';

self.onmessage = (e: MessageEvent<{ type: string; receipts: NormalizedReceipt[]; activeReceiptId?: string }>) => {
  const { type, receipts, activeReceiptId } = e.data;

  if (type === 'COMPUTE_ALL') {
    const chapters = detectChapters(receipts);
    const { connections, moments } = calculateConnections(receipts, activeReceiptId);
    const heatmap = computeHeatmap(receipts);
    const interestStream = computeInterestStream(receipts);
    const moodTimeline = computeMoodTimeline(receipts);
    const spending = computeSpendingOverTime(receipts);
    const constellation = computeConstellation(receipts);

    self.postMessage({
      type: 'COMPUTE_ALL_SUCCESS',
      payload: {
        chapters,
        connections,
        moments,
        heatmap,
        interestStream,
        moodTimeline,
        spending,
        constellation,
      },
    });
  }
};
