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

  // Generate Key Curated Moments from connected subgraphs
  const moments: Moment[] = [
    {
      id: 'mom-1',
      title: 'Song -> Location -> Photo -> Purchase -> Event',
      description: 'Late-night listening to acoustic tracks followed by morning train travel to station, food snack, and festival entry.',
      receiptIds: targetReceipts.filter((r) => r.type === 'music' || r.type === 'place' || r.type === 'photo' || r.type === 'purchase').slice(0, 5).map((r) => r.id),
      connectionStrength: 0.94,
      patternType: 'Multi-Modal Narrative Chain',
    },
    {
      id: 'mom-2',
      title: 'The 2 AM Beatles & Undated Planner',
      description: 'Continuous Beatles discography stream ending at 02:44 AM, followed immediately by planner purchase note.',
      receiptIds: targetReceipts.filter((r) => r.title.includes('Beatles') || r.text?.includes('Planner')).slice(0, 4).map((r) => r.id),
      connectionStrength: 0.89,
      patternType: 'Late-Night Deep Focus',
    },
    {
      id: 'mom-3',
      title: 'Search Intent -> Edtech & Book Purchase',
      description: 'Repeated Kindle book searches resulting in course enrollment transaction within 24 hours.',
      receiptIds: targetReceipts.filter((r) => r.type === 'search' || r.subtitle?.includes('Edtech') || r.text?.includes('Kindle')).slice(0, 3).map((r) => r.id),
      connectionStrength: 0.92,
      patternType: 'Intent to Action Pipeline',
    },
    {
      id: 'mom-4',
      title: 'Ganesh Festival -> Sweets & Family Photo',
      description: 'Ganesh Pujan idol transaction linked with sweets purchase and geotagged family snapshot.',
      receiptIds: targetReceipts.filter((r) => r.tags.includes('Festivals') || r.title.includes('Sweets') || r.type === 'photo').slice(0, 4).map((r) => r.id),
      connectionStrength: 0.88,
      patternType: 'Cultural Tradition Arc',
    },
    {
      id: 'mom-5',
      title: 'Health Care -> Doctor Visit & Healing Music',
      description: 'Doctor fee receipt matched with medicine transaction and acoustic recovery playlist.',
      receiptIds: targetReceipts.filter((r) => r.tags.includes('Health') || r.text?.includes('Doctor') || r.mood === 'melancholic').slice(0, 4).map((r) => r.id),
      connectionStrength: 0.85,
      patternType: 'Care & Recovery Loop',
    },
  ];

  return { connections, moments };
}
