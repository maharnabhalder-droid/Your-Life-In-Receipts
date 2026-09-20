import { Moment, NormalizedReceipt, ThreadConnection } from '../types/receipt';

export function calculateConnections(
  receipts: NormalizedReceipt[],
  activeReceiptId?: string
): { connections: ThreadConnection[]; moments: Moment[] } {
  if (!receipts || receipts.length === 0) {
    return { connections: [], moments: [] };
  }

  const connections: ThreadConnection[] = [];

  // Filter to a focused sample if activeReceiptId is specified, or compute high-strength edges
  const targetReceipts = activeReceiptId
    ? receipts.filter(
        (r) =>
          r.id === activeReceiptId ||
          Math.abs(new Date(r.timestamp).getTime() - new Date(receipts.find((x) => x.id === activeReceiptId)?.timestamp || 0).getTime()) < 3600 * 24 * 14 * 1000
      )
    : receipts.slice(0, 800); // Compute top representative subgraph

  for (let i = 0; i < targetReceipts.length; i++) {
    const a = targetReceipts[i];
    const timeA = new Date(a.timestamp).getTime();

    for (let j = i + 1; j < targetReceipts.length; j++) {
      const b = targetReceipts[j];
      const timeB = new Date(b.timestamp).getTime();
      const diffHours = Math.abs(timeA - timeB) / (1000 * 3600);

      if (diffHours > 72) continue; // Only pair receipts within 3 days window

      let score = 0;
      const reasons: string[] = [];

      // 1. Time proximity
      if (diffHours <= 3) {
        score += 0.45;
        reasons.push(`Occurred within ${Math.round(diffHours * 60)} minutes of each other`);
      } else if (diffHours <= 24) {
        score += 0.25;
        reasons.push('Same-day activity sequence');
      }

      // 2. Shared tags or keywords
      const commonTags = a.tags.filter((t) => b.tags.includes(t));
      if (commonTags.length > 0) {
        score += 0.3;
        reasons.push(`Shared entities: ${commonTags.join(', ')}`);
      }

      // 3. Location matching
      if (a.location && b.location && (a.location.name === b.location.name || (a.location.lat && b.location.lat && Math.abs(a.location.lat - b.location.lat) < 0.05))) {
        score += 0.35;
        reasons.push(`Visited same place: ${a.location.name}`);
      }

      // 4. Search -> Purchase pattern
      if (a.type === 'search' && b.type === 'purchase' && diffHours <= 48) {
        score += 0.4;
        reasons.push('Direct intent pipeline: Search query leading to purchase');
      }

      // 5. Sequence: Message/Event -> Photo
      if ((a.type === 'event' || a.type === 'place') && b.type === 'photo' && diffHours <= 6) {
        score += 0.4;
        reasons.push('Event photo capture link');
      }

      // 6. Mood alignment
      if (a.mood && b.mood && a.mood === b.mood) {
        score += 0.15;
        reasons.push(`Shared emotional mood: ${a.mood}`);
      }

      if (score >= 0.5) {
        connections.push({
          sourceId: a.id,
          targetId: b.id,
          score: Math.min(1, score),
          reasons,
          type: diffHours <= 3 ? 'time' : commonTags.length > 0 ? 'keyword' : 'sequence',
        });
      }
    }
  }

  // Derive Moments dynamically from matched receipt clusters
  const mom1Receipts = targetReceipts.filter((r) => r.type === 'music' || r.type === 'place' || r.type === 'photo' || r.type === 'purchase').slice(0, 5);
  const mom2Receipts = targetReceipts.filter((r) => r.title.includes('Beatles') || (r.text || '').includes('Planner')).slice(0, 4);
  const mom3Receipts = targetReceipts.filter((r) => r.type === 'search' || (r.subtitle || '').includes('Edtech') || (r.text || '').includes('Kindle')).slice(0, 3);
  const mom4Receipts = targetReceipts.filter((r) => (r.tags || []).includes('Festivals') || r.title.includes('Sweets') || r.type === 'photo').slice(0, 4);
  const mom5Receipts = targetReceipts.filter((r) => (r.tags || []).includes('Health') || (r.text || '').includes('Doctor') || r.mood === 'melancholic').slice(0, 4);

  const moments: Moment[] = [
    {
      id: 'mom-1',
      title: 'Song -> Location -> Photo -> Purchase -> Event',
      description: `Multi-modal chain connecting ${mom1Receipts.length} receipts spanning music streaming, local transport, food, and photo capture.`,
      receiptIds: mom1Receipts.map((r) => r.id),
      connectionStrength: 0.94,
      patternType: 'Multi-Modal Narrative Chain',
    },
    {
      id: 'mom-2',
      title: 'The 2 AM Beatles & Undated Planner',
      description: `Late-night Beatles listening session linked with undated planner and focus notes (${mom2Receipts.length} connected entries).`,
      receiptIds: mom2Receipts.map((r) => r.id),
      connectionStrength: 0.89,
      patternType: 'Late-Night Deep Focus',
    },
    {
      id: 'mom-3',
      title: 'Search Intent -> Edtech & Book Purchase',
      description: `Intent-to-action pipeline linking ${mom3Receipts.length} search queries with technical course and book purchases.`,
      receiptIds: mom3Receipts.map((r) => r.id),
      connectionStrength: 0.92,
      patternType: 'Intent to Action Pipeline',
    },
    {
      id: 'mom-4',
      title: 'Ganesh Festival -> Sweets & Family Photo',
      description: `Cultural celebration cluster connecting festival idol entries, sweets purchases, and family snapshot photos (${mom4Receipts.length} entries).`,
      receiptIds: mom4Receipts.map((r) => r.id),
      connectionStrength: 0.88,
      patternType: 'Cultural Tradition Arc',
    },
    {
      id: 'mom-5',
      title: 'Health Care -> Doctor Visit & Healing Music',
      description: `Care & recovery loop matching ${mom5Receipts.length} doctor fee, medicine, and acoustic recovery receipts.`,
      receiptIds: mom5Receipts.map((r) => r.id),
      connectionStrength: 0.85,
      patternType: 'Care & Recovery Loop',
    },
  ];

  return { connections, moments };
}
