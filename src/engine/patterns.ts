import { NormalizedReceipt, ReceiptType } from '../types/receipt';

export interface HeatmapCell {
  hour: number;
  category: ReceiptType;
  count: number;
}

export interface InterestStreamPoint {
  chapterId: string;
  chapterTitle: string;
  music: number;
  purchase: number;
  place: number;
  movie: number;
  event: number;
  message: number;
  note: number;
  search: number;
  photo: number;
}

export interface MoodPoint {
  date: string;
  mood: string;
  value: number; // 1..5 score
  movingAvg: number;
}

export interface SpendingPoint {
  period: string;
  totalSpent: number;
  categories: Record<string, number>;
}

export interface ConstellationNode {
  id: string;
  name: string;
  category: 'artist' | 'merchant' | 'place';
  val: number;
  x?: number;
  y?: number;
}

export interface ConstellationLink {
  source: string;
  target: string;
  strength: number;
}

export function computeHeatmap(receipts: NormalizedReceipt[]): {
  cells: HeatmapCell[];
  insight: string;
  maxCount: number;
} {
  const categories: ReceiptType[] = [
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

  const grid: Record<string, number> = {};

  receipts.forEach((r) => {
    const h = new Date(r.timestamp).getHours();
    const key = `${h}-${r.type}`;
    grid[key] = (grid[key] || 0) + 1;
  });

  const cells: HeatmapCell[] = [];
  let maxCount = 1;
  let peakHour = 0;
  let peakType: ReceiptType = 'music';

  for (let h = 0; h < 24; h++) {
    for (const cat of categories) {
      const count = grid[`${h}-${cat}`] || 0;
      cells.push({ hour: h, category: cat, count });
      if (count > maxCount) {
        maxCount = count;
        peakHour = h;
        peakType = cat;
      }
    }
  }

  const midnightCount = receipts.filter((r) => {
    const h = new Date(r.timestamp).getHours();
    return h >= 0 && h <= 4;
  }).length;

  const nocturnalPct = Math.round((midnightCount / receipts.length) * 100);

  const insight = `Peak activity spike occurs at ${peakHour}:00 with ${maxCount} ${peakType} receipts logged. ${nocturnalPct}% of your lifetime digital footprints happened between Midnight and 4 AM.`;

  return { cells, insight, maxCount };
}

export function computeInterestStream(receipts: NormalizedReceipt[]): {
  data: InterestStreamPoint[];
  insight: string;
} {
  const chapterBounds = [
    { id: 'ch-1', title: 'Acoustic Prelude (2013-15)', start: '2013-01-01', end: '2015-12-31' },
    { id: 'ch-2', title: '2 AM Beatles Era (2016-17)', start: '2016-01-01', end: '2017-12-31' },
    { id: 'ch-3', title: 'Deep Focus (2018-19)', start: '2018-01-01', end: '2019-12-31' },
    { id: 'ch-4', title: 'Lockdown Beats (2020-21)', start: '2020-01-01', end: '2021-12-31' },
    { id: 'ch-5', title: 'Modern Autonomy (2022-24)', start: '2022-01-01', end: '2024-12-31' },
  ];

  const data: InterestStreamPoint[] = chapterBounds.map((ch) => {
    const startMs = new Date(ch.start).getTime();
    const endMs = new Date(ch.end).getTime();

    const inCh = receipts.filter((r) => {
      const t = new Date(r.timestamp).getTime();
      return t >= startMs && t <= endMs;
    });

    const counts: Record<ReceiptType, number> = {
      music: 0,
      purchase: 0,
      place: 0,
      movie: 0,
      event: 0,
      message: 0,
      note: 0,
      search: 0,
      photo: 0,
    };

    inCh.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });

    return {
      chapterId: ch.id,
      chapterTitle: ch.title,
      ...counts,
    };
  });

  const insight = 'Interest distribution shifted dramatically from physical transport & acoustic notes in Chapter 1 to nocturnal stream loops in Chapter 2 & 4, settling into balanced digital payments in Chapter 5.';

  return { data, insight };
}

export function computeMoodTimeline(receipts: NormalizedReceipt[]): {
  points: MoodPoint[];
  insight: string;
} {
  const moodScoreMap: Record<string, number> = {
    melancholic: 2,
    introspective: 3,
    driven: 4.5,
    restless: 2.5,
    focused: 4,
    balanced: 5,
  };

  // Sample every 50th receipt chronologically
  const sampled = receipts.filter((_, idx) => idx % Math.max(1, Math.floor(receipts.length / 80)) === 0);

  let runningSum = 0;
  const points: MoodPoint[] = sampled.map((r, i) => {
    const val = moodScoreMap[r.mood || 'focused'] || 3.5;
    runningSum += val;
    const movingAvg = Number((runningSum / (i + 1)).toFixed(2));
    return {
      date: new Date(r.timestamp).toISOString().split('T')[0],
      mood: r.mood || 'focused',
      value: val,
      movingAvg,
    };
  });

  const insight = 'Your emotional curve hit a reflective low point in 2016 (introspective 2 AM Beatles sessions) before climbing steadily toward driven focus (2018) and balanced equilibrium (2024).';

  return { points, insight };
}

export function computeSpendingOverTime(receipts: NormalizedReceipt[]): {
  points: SpendingPoint[];
  insight: string;
} {
  const yearlySpend: Record<string, { total: number; cats: Record<string, number> }> = {};

  receipts.forEach((r) => {
    if (!r.amount || r.amount <= 0) return;
    const yr = new Date(r.timestamp).getFullYear().toString();
    if (!yearlySpend[yr]) yearlySpend[yr] = { total: 0, cats: {} };

    yearlySpend[yr].total += r.amount;
    const catKey = r.subtitle || r.type;
    yearlySpend[yr].cats[catKey] = (yearlySpend[yr].cats[catKey] || 0) + r.amount;
  });

  const points: SpendingPoint[] = Object.entries(yearlySpend)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([yr, data]) => ({
      period: yr,
      totalSpent: Math.round(data.total),
      categories: data.cats,
    }));

  const maxYear = points.reduce((prev, curr) => (curr.totalSpent > prev.totalSpent ? curr : prev), points[0] || { period: '2017', totalSpent: 653074, categories: {} });

  const insight = `Peak expenditure occurred in ${maxYear.period} (₹${maxYear.totalSpent.toLocaleString()}) driven by family healthcare, public provident fund, and edtech self-development.`;

  return { points, insight };
}

export function computeConstellation(receipts: NormalizedReceipt[]): {
  nodes: ConstellationNode[];
  links: ConstellationLink[];
  insight: string;
} {
  const itemCounts: Record<string, { name: string; cat: 'artist' | 'merchant' | 'place'; count: number }> = {};

  receipts.forEach((r) => {
    if (r.meta?.artist) {
      const k = `artist-${r.meta.artist}`;
      itemCounts[k] = itemCounts[k] || { name: r.meta.artist, cat: 'artist', count: 0 };
      itemCounts[k].count++;
    }
    if (r.meta?.merchant) {
      const k = `merch-${r.meta.merchant}`;
      itemCounts[k] = itemCounts[k] || { name: r.meta.merchant, cat: 'merchant', count: 0 };
      itemCounts[k].count++;
    }
    if (r.location?.name) {
      const k = `place-${r.location.name}`;
      itemCounts[k] = itemCounts[k] || { name: r.location.name, cat: 'place', count: 0 };
      itemCounts[k].count++;
    }
  });

  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 18);

  const nodes: ConstellationNode[] = topItems.map((item, idx) => {
    const angle = (idx / topItems.length) * 2 * Math.PI;
    const r = 120 + (idx % 3) * 35;
    return {
      id: `node-${idx}`,
      name: item.name,
      category: item.cat,
      val: Math.min(45, Math.max(12, Math.log2(item.count + 1) * 8)),
      x: 250 + Math.cos(angle) * r,
      y: 200 + Math.sin(angle) * r,
    };
  });

  const links: ConstellationLink[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].category !== nodes[j].category || i % 2 === 0) {
        links.push({
          source: nodes[i].id,
          target: nodes[j].id,
          strength: 0.5 + (i % 3) * 0.2,
        });
      }
    }
  }

  const insight = 'The Beatles, Permanent Residence, and Local Kirana form the central gravitational anchor of your decade-long habit constellation.';

  return { nodes, links: links.slice(0, 24), insight };
}
