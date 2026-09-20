import { Chapter, NormalizedReceipt } from '../types/receipt';

export function detectChapters(receipts: NormalizedReceipt[]): Chapter[] {
  if (!receipts || receipts.length === 0) return [];

  // Define chronological boundary dates for 5 life eras
  const eraDefinitions = [
    {
      id: 'ch-1',
      title: "The Commuter's Acoustic Prelude",
      startDate: '2013-07-01T00:00:00.000Z',
      endDate: '2015-12-31T23:59:59.000Z',
      persona: 'The Dreaming Commuter',
      defaultMood: 'melancholic' as const,
      narrative: 'Riding Mumbai suburban trains with acoustic playlists in ear. Idli breakfasts, modest student budgets, and quiet introspection.',
    },
    {
      id: 'ch-2',
      title: 'The 2 AM Beatles & Shift Era',
      startDate: '2016-01-01T00:00:00.000Z',
      endDate: '2017-12-31T23:59:59.000Z',
      persona: 'The Nocturnal Scholar',
      defaultMood: 'introspective' as const,
      narrative: 'Over 3,000 Beatles streams at 2 AM. Undated planners, late-night exam prep, doctor visits for family, and a pivotal career transition.',
    },
    {
      id: 'ch-3',
      title: 'Deep Focus & Family Anchors',
      startDate: '2018-01-01T00:00:00.000Z',
      endDate: '2019-12-31T23:59:59.000Z',
      persona: 'The Up-skilling Provider',
      defaultMood: 'driven' as const,
      narrative: 'HBR and Edtech subscriptions, family healthcare coverage, mutual fund SIP investments, and structured financial independence.',
    },
    {
      id: 'ch-4',
      title: 'The Sanctuary & Lockdown Beats',
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2021-12-31T23:59:59.000Z',
      persona: 'The Homebound Rocker',
      defaultMood: 'restless' as const,
      narrative: '24,000+ yearly streams dominated by The Killers. Midnight comfort food deliveries, continuous work-from-home, and digital solace.',
    },
    {
      id: 'ch-5',
      title: 'Digital Autonomy & Modern Tempo',
      startDate: '2022-01-01T00:00:00.000Z',
      endDate: '2024-12-31T23:59:59.000Z',
      persona: 'The Modern Autonomous',
      defaultMood: 'balanced' as const,
      narrative: 'Seamless card transactions, balanced multi-genre listening, travel excursions, and confident adult equilibrium.',
    },
  ];

  return eraDefinitions.map((era) => {
    const start = new Date(era.startDate).getTime();
    const end = new Date(era.endDate).getTime();

    const matched = receipts.filter((r) => {
      const t = new Date(r.timestamp).getTime();
      return t >= start && t <= end;
    });

    const receiptIds = matched.map((r) => r.id);

    // Compute top artist or merchant
    const counts: Record<string, number> = {};
    let totalSpent = 0;
    let nocturnalCount = 0;

    matched.forEach((r) => {
      if (r.amount) totalSpent += r.amount;

      const hour = new Date(r.timestamp).getHours();
      if (hour >= 0 && hour <= 4) nocturnalCount++;

      const key = r.subtitle || r.title;
      counts[key] = (counts[key] || 0) + 1;
    });

    const topItem = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'The Beatles';
    const nocturnalRatio = matched.length > 0 ? Math.round((nocturnalCount / matched.length) * 100) : 25;

    return {
      id: era.id,
      title: era.title,
      startDate: era.startDate,
      endDate: era.endDate,
      persona: era.persona,
      dominantMood: era.defaultMood,
      narrative: `${era.narrative} (Computed: ${matched.length} digital receipts, ₹${Math.round(totalSpent).toLocaleString()} logged, ${nocturnalRatio}% nocturnal activity).`,
      topStats: {
        totalReceipts: matched.length,
        topArtistOrMerchant: topItem,
        totalSpent: Math.round(totalSpent),
        nocturnalRatio,
      },
      receiptIds,
    };
  });
}
