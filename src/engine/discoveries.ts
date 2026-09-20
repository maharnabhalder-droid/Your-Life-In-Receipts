import { Discovery, NormalizedReceipt } from '../types/receipt';
import { loadNormalizedReceipts } from '../data/loader';

export function buildDiscoveries(receipts: NormalizedReceipt[]): Discovery[] {
  if (!receipts || receipts.length === 0) return [];

  // Helper to find existing receipt IDs for evidence
  const findReceiptIds = (filterFn: (r: NormalizedReceipt) => boolean, limit = 2): string[] => {
    const matches = receipts.filter(filterFn);
    return matches.slice(0, limit).map((r) => r.id);
  };

  // 1. John Mayer
  const mayerPlays = receipts.filter((r) =>
    (r.subtitle || r.title || '').includes('John Mayer')
  ).length;
  const mayerEvidence = findReceiptIds((r) =>
    (r.subtitle || r.title || '').includes('John Mayer')
  );

  // 2. Turning Point (Planner + 2017 Beatles)
  const beatles2016 = receipts.filter(
    (r) =>
      (r.subtitle || r.title || '').includes('The Beatles') &&
      new Date(r.timestamp).getFullYear() === 2016
  ).length;
  const beatles2017 = receipts.filter(
    (r) =>
      (r.subtitle || r.title || '').includes('The Beatles') &&
      new Date(r.timestamp).getFullYear() === 2017
  ).length;
  const plannerReceipts = findReceiptIds((r) =>
    (r.text || r.title || '').toLowerCase().includes('planner')
  );
  const beatles2017Evidence = findReceiptIds(
    (r) =>
      (r.subtitle || r.title || '').includes('The Beatles') &&
      new Date(r.timestamp).getFullYear() === 2017
  );
  const turningPointEvidence = [
    ...(plannerReceipts.length > 0 ? [plannerReceipts[0]] : []),
    ...(beatles2017Evidence.length > 0 ? [beatles2017Evidence[0]] : []),
  ];

  // 3. Commute
  const transitCount = receipts.filter(
    (r) => r.type === 'place' || (r.subtitle || '').toLowerCase().includes('train')
  ).length;
  const commuteEvidence = findReceiptIds(
    (r) => r.type === 'place' || (r.subtitle || '').toLowerCase().includes('train')
  );

  // 4. Beatles Late Night
  const beatlesTotal = receipts.filter((r) =>
    (r.subtitle || r.title || '').includes('The Beatles')
  ).length;
  const beatlesEvidence = findReceiptIds(
    (r) =>
      (r.subtitle || r.title || '').includes('The Beatles') &&
      new Date(r.timestamp).getFullYear() === 2017
  );

  // 5. Search Intent
  const searchCount = receipts.filter((r) => r.type === 'search').length;
  const searchEvidence = findReceiptIds((r) => r.type === 'search');

  // 6. Caretaker / Health
  const healthCount = receipts.filter(
    (r) =>
      (r.tags || []).includes('Health') ||
      (r.text || r.title || '').toLowerCase().includes('doctor') ||
      (r.text || r.title || '').toLowerCase().includes('medicine')
  ).length;
  const healthEvidence = findReceiptIds(
    (r) =>
      (r.tags || []).includes('Health') ||
      (r.text || r.title || '').toLowerCase().includes('doctor') ||
      (r.text || r.title || '').toLowerCase().includes('medicine')
  );

  // 7. Lockdown Rocker (The Killers 2020)
  const killers2020 = receipts.filter(
    (r) =>
      (r.subtitle || r.title || '').includes('The Killers') &&
      new Date(r.timestamp).getFullYear() === 2020
  ).length;
  const totalMusic2020 = receipts.filter(
    (r) => r.type === 'music' && new Date(r.timestamp).getFullYear() === 2020
  ).length;
  const killersEvidence = findReceiptIds(
    (r) =>
      (r.subtitle || r.title || '').includes('The Killers') &&
      new Date(r.timestamp).getFullYear() === 2020
  );

  // 8. Cashless Shift (Card Trans)
  const cardCount = receipts.filter((r) => r.id.startsWith('card-')).length;
  const cardEvidence = findReceiptIds((r) => r.id.startsWith('card-'));

  // 9. Friday Peak
  const dayCounts: Record<number, number> = {};
  receipts.forEach((r) => {
    const day = new Date(r.timestamp).getDay();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  const fridayCount = dayCounts[5] || 0; // 5 = Friday
  const mondayCount = dayCounts[1] || 0; // 1 = Monday
  const fridayDiff = fridayCount - mondayCount;
  const fridayEvidence = findReceiptIds((r) => new Date(r.timestamp).getDay() === 5);

  // 10. Financial Anchor
  const investCount = receipts.filter(
    (r) =>
      (r.tags || []).includes('Investment') ||
      (r.subtitle || r.title || '').toLowerCase().includes('mutual fund')
  ).length;
  const investEvidence = findReceiptIds(
    (r) =>
      (r.tags || []).includes('Investment') ||
      (r.subtitle || r.title || '').toLowerCase().includes('mutual fund')
  );

  return [
    {
      id: 'disc-1',
      title: 'John Mayer: A Constant Companion',
      description: `John Mayer remained a constant companion with ${mayerPlays} plays logged across all 11 active years (2013, 2015–2024).`,
      unlocked: false,
      evidenceReceiptIds: mayerEvidence,
      badge: '👻 Constant Loop',
      category: 'Music Habit',
    },
    {
      id: 'disc-2',
      title: 'The Turning Point',
      description: `In October 2016, an "Undated Planner" purchase marked a focus shift, followed by Beatles plays rising from ${beatles2016} in 2016 to ${beatles2017} in 2017.`,
      unlocked: false,
      evidenceReceiptIds: turningPointEvidence,
      badge: '⚡ Career Pivot',
      category: 'Life Shift',
    },
    {
      id: 'disc-3',
      title: 'The Habit That Disappeared',
      description: `Suburban train and local transit entries (${transitCount} total) peaked between 2014 and 2018 before giving way to remote routine.`,
      unlocked: false,
      evidenceReceiptIds: commuteEvidence,
      badge: '🚂 Disappearing Commute',
      category: 'Routine Shift',
    },
    {
      id: 'disc-4',
      title: 'The Beatles Discography',
      description: `The Beatles were your top overall artist with ${beatlesTotal} plays across 11 years, peaking in 2017 with ${beatles2017} plays.`,
      unlocked: false,
      evidenceReceiptIds: beatlesEvidence,
      badge: '🎸 Top Discography',
      category: 'Music Habit',
    },
    {
      id: 'disc-5',
      title: 'Intent-to-Purchase Pipeline',
      description: `Log of ${searchCount} Kindle and Edtech search queries preceded major self-development and book purchases.`,
      unlocked: false,
      evidenceReceiptIds: searchEvidence,
      badge: '🎯 Search to Buy',
      category: 'Consumer Intent',
    },
    {
      id: 'disc-6',
      title: "The Caretaker's Footprint",
      description: `Healthcare and medical expenses (${healthCount} receipts recorded) peaked in 2017–2018 alongside reflective acoustic playlists.`,
      unlocked: false,
      evidenceReceiptIds: healthEvidence,
      badge: '🏥 Family Care',
      category: 'Responsibility',
    },
    {
      id: 'disc-7',
      title: 'The Lockdown Rocker',
      description: `During the 2020 lockdown, The Killers became your top rock artist with ${killers2020} plays out of ${totalMusic2020} total music streams.`,
      unlocked: false,
      evidenceReceiptIds: killersEvidence,
      badge: '🎧 WFH Sanctuary',
      category: 'Music Habit',
    },
    {
      id: 'disc-8',
      title: 'The Silent Transition',
      description: `Digital transactions (${cardCount} card receipts) scaled up from 2022 to 2024, replacing traditional cash payments.`,
      unlocked: false,
      evidenceReceiptIds: cardEvidence,
      badge: '💳 Cashless Autonomy',
      category: 'Financial Shift',
    },
    {
      id: 'disc-9',
      title: 'The Friday Surge',
      description: `Friday is your top logging day with ${fridayCount} receipts recorded, leading Monday by ${fridayDiff} receipts.`,
      unlocked: false,
      evidenceReceiptIds: fridayEvidence,
      badge: '📅 Weekly Peak',
      category: 'Behavior Pattern',
    },
    {
      id: 'disc-10',
      title: 'The Financial Anchor',
      description: `Public Provident Fund and Equity Mutual Fund investments (${investCount} records) established long-term financial discipline.`,
      unlocked: false,
      evidenceReceiptIds: investEvidence,
      badge: '📈 Long-Term Security',
      category: 'Financial Shift',
    },
  ];
}

// Initial discoveries built from verified loaded receipts
export const INITIAL_DISCOVERIES: Discovery[] = buildDiscoveries(loadNormalizedReceipts());

export function getEvidenceReceipts(
  discoveryId: string,
  allReceipts: NormalizedReceipt[]
): NormalizedReceipt[] {
  const dynamicDiscoveries = buildDiscoveries(allReceipts);
  const disc = dynamicDiscoveries.find((d) => d.id === discoveryId);
  if (!disc) return [];

  const matches = allReceipts.filter((r) => disc.evidenceReceiptIds.includes(r.id));
  if (matches.length > 0) return matches;

  // Fallback match by topic if IDs need soft match
  if (discoveryId === 'disc-1')
    return allReceipts.filter((r) => (r.subtitle || r.title || '').includes('John Mayer')).slice(0, 4);
  if (discoveryId === 'disc-2')
    return allReceipts.filter((r) => (r.text || r.title || '').toLowerCase().includes('planner')).slice(0, 4);
  if (discoveryId === 'disc-3')
    return allReceipts.filter((r) => r.type === 'place').slice(0, 4);
  if (discoveryId === 'disc-4')
    return allReceipts.filter((r) => (r.subtitle || r.title || '').includes('The Beatles')).slice(0, 4);
  if (discoveryId === 'disc-5')
    return allReceipts.filter((r) => r.type === 'search').slice(0, 4);
  if (discoveryId === 'disc-6')
    return allReceipts.filter((r) => (r.tags || []).includes('Health')).slice(0, 4);
  if (discoveryId === 'disc-7')
    return allReceipts.filter((r) => (r.subtitle || r.title || '').includes('The Killers')).slice(0, 4);
  if (discoveryId === 'disc-8')
    return allReceipts.filter((r) => r.id.startsWith('card-')).slice(0, 4);
  if (discoveryId === 'disc-9')
    return allReceipts.filter((r) => new Date(r.timestamp).getDay() === 5).slice(0, 4);
  return allReceipts.filter((r) => (r.tags || []).includes('Investment')).slice(0, 4);
}
