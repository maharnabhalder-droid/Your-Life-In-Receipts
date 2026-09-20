import { describe, it, expect } from 'vitest';
import { detectChapters } from '../src/engine/chapters';
import { calculateConnections } from '../src/engine/connections';
import { computeHeatmap } from '../src/engine/patterns';
import { NormalizedReceipt } from '../src/types/receipt';

const sampleReceipts: NormalizedReceipt[] = [
  {
    id: 'music-1',
    type: 'music',
    timestamp: '2014-05-10T02:00:00.000Z',
    title: 'Say It, Just Say It',
    subtitle: 'The Mowgli\'s',
    tags: ['music', 'spotify', 'train'],
    amount: 0,
    mood: 'melancholic',
    text: 'Played on spotify player',
  },
  {
    id: 'daily-1',
    type: 'place',
    timestamp: '2014-05-10T02:30:00.000Z',
    title: 'Place 2 to Place 5',
    subtitle: 'Transportation • Train',
    tags: ['Transportation', 'train'],
    amount: 30,
    mood: 'melancholic',
    text: 'Train journey',
  },
  {
    id: 'music-2',
    type: 'music',
    timestamp: '2017-08-15T02:15:00.000Z',
    title: 'A Hard Day\'s Night',
    subtitle: 'The Beatles',
    tags: ['music', 'rock'],
    amount: 0,
    mood: 'introspective',
    text: 'Late night Beatles stream',
  },
];

describe('Data Engine Unit Tests', () => {
  it('should detect 5 distinct life chapters', () => {
    const chapters = detectChapters(sampleReceipts);
    expect(chapters).toHaveLength(5);
    expect(chapters[0].persona).toBe('The Dreaming Commuter');
    expect(chapters[1].persona).toBe('The Nocturnal Scholar');
  });

  it('should score high thread connections for time-proximate receipts', () => {
    const { connections } = calculateConnections(sampleReceipts);
    expect(connections.length).toBeGreaterThan(0);
    const link = connections[0];
    expect(link.score).toBeGreaterThanOrEqual(0.4);
  });

  it('should compute 24x9 heatmap grid', () => {
    const heatmap = computeHeatmap(sampleReceipts);
    expect(heatmap.cells).toHaveLength(24 * 9);
    expect(heatmap.insight).toContain('Peak activity spike');
  });
});
