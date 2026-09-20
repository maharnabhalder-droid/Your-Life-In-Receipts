import { describe, it, expect } from 'vitest';
import { detectChapters } from '../src/engine/chapters';
import { calculateConnections } from '../src/engine/connections';
import {
  computeHeatmap,
  computeSpendingOverTime,
  computeConstellation,
  computeMoodTimeline,
  computeInterestStream,
} from '../src/engine/patterns';
import { buildDiscoveries } from '../src/engine/discoveries';
import { NormalizedReceipt } from '../src/types/receipt';

const sampleReceipts: NormalizedReceipt[] = [
  {
    id: 'music-1',
    type: 'music',
    timestamp: '2014-05-10T02:00:00.000Z',
    title: 'Say It, Just Say It',
    subtitle: "The Mowgli's",
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
    title: "A Hard Day's Night",
    subtitle: 'The Beatles',
    tags: ['music', 'rock'],
    amount: 0,
    mood: 'introspective',
    text: 'Late night Beatles stream',
    meta: { artist: 'The Beatles' },
  },
  {
    id: 'card-2017-1',
    type: 'purchase',
    timestamp: '2017-03-20T10:00:00.000Z',
    title: 'Undated Planner Purchase',
    subtitle: 'Stationery • Store',
    tags: ['purchase', 'stationery'],
    amount: 500000,
    mood: 'focused',
    text: 'Planner note purchase',
    meta: { merchant: 'Stationery Store' },
  },
  {
    id: 'card-2019-1',
    type: 'purchase',
    timestamp: '2019-06-12T14:00:00.000Z',
    title: 'HBR Subscription',
    subtitle: 'Education',
    tags: ['purchase'],
    amount: 1000,
    mood: 'focused',
    text: 'HBR print & digital sub',
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

  it('should compute spending over time and identify peak year', () => {
    const spending = computeSpendingOverTime(sampleReceipts);
    expect(spending.points.length).toBeGreaterThan(0);
    const peak2017 = spending.points.find((p) => p.period === '2017');
    expect(peak2017).toBeDefined();
    expect(peak2017?.totalSpent).toBe(500000);
    expect(spending.insight).toContain('2017');
  });

  it('should compute constellation nodes and links', () => {
    const constellation = computeConstellation(sampleReceipts);
    expect(constellation.nodes).toBeDefined();
    expect(constellation.links).toBeDefined();
    expect(Array.isArray(constellation.nodes)).toBe(true);
    expect(Array.isArray(constellation.links)).toBe(true);
  });

  it('should compute mood timeline with rolling window bounds', () => {
    const moodTimeline = computeMoodTimeline(sampleReceipts);
    expect(moodTimeline.points).toBeDefined();
    expect(moodTimeline.points.length).toBeGreaterThan(0);
    expect(moodTimeline.points[0]).toHaveProperty('movingAvg');
    expect(typeof moodTimeline.points[0].movingAvg).toBe('number');
  });

  it('should compute interest stream distribution across 5 chapters', () => {
    const interestStream = computeInterestStream(sampleReceipts);
    expect(interestStream.data).toHaveLength(5);
    expect(interestStream.data[0]).toHaveProperty('chapterId', 'ch-1');
    expect(interestStream.data[4]).toHaveProperty('chapterId', 'ch-5');
  });

  it('should build discoveries with unlock states and evidence arrays', () => {
    const discoveries = buildDiscoveries(sampleReceipts);
    expect(discoveries).toBeDefined();
    expect(Array.isArray(discoveries)).toBe(true);
    expect(discoveries.length).toBeGreaterThan(0);
    expect(discoveries[0]).toHaveProperty('id');
    expect(discoveries[0]).toHaveProperty('unlocked');
    expect(discoveries[0]).toHaveProperty('evidenceReceiptIds');
  });
});
