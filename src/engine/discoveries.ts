import { Discovery, NormalizedReceipt } from '../types/receipt';

export const INITIAL_DISCOVERIES: Discovery[] = [
  {
    id: 'disc-1',
    title: 'Ghost Pattern Found',
    description: 'You listened to John Mayer 34 times in 2013, completely stopped by 2016, and returned to him 11 years later in 2024.',
    unlocked: false,
    evidenceReceiptIds: ['music-0', 'music-185'],
    badge: '👻 Nostalgia Loop',
    category: 'Music Habit',
  },
  {
    id: 'disc-2',
    title: 'The Turning Point',
    description: 'On October 27, 2016, an "Undated Planner" purchase coincided with an abrupt spike to 3,000+ yearly Beatles plays.',
    unlocked: false,
    evidenceReceiptIds: ['daily-346', 'music-6413'],
    badge: '⚡ Career Pivot',
    category: 'Life Shift',
  },
  {
    id: 'disc-3',
    title: 'The Habit That Disappeared',
    description: 'Daily local train station commutes ("Place 2 to Place 5") vanished after December 2018 as remote WFH work took over.',
    unlocked: false,
    evidenceReceiptIds: ['daily-1038', 'daily-1500'],
    badge: '🚂 Disappearing Commute',
    category: 'Routine Shift',
  },
  {
    id: 'disc-4',
    title: 'The 2 AM Beatles Obsession',
    description: 'In 2017, you played The Beatles 3,244 times, with 31% of plays occurring strictly between 00:00 AM and 04:00 AM.',
    unlocked: false,
    evidenceReceiptIds: ['music-12000', 'music-15000'],
    badge: '🎸 Nocturnal Obsession',
    category: 'Late Night',
  },
  {
    id: 'disc-5',
    title: 'Intent-to-Purchase Pipeline',
    description: 'You logged 9 Edtech & Kindle search lookups over 3 days before making an official course enrollment payment.',
    unlocked: false,
    evidenceReceiptIds: ['daily-200', 'daily-201'],
    badge: '🎯 Search to Buy',
    category: 'Consumer Intent',
  },
  {
    id: 'disc-6',
    title: "The Caretaker's Footprint",
    description: 'In mid-2018, family health expenditures (Doctor fees, Cataract Medicine) spiked alongside gentle acoustic playlists.',
    unlocked: false,
    evidenceReceiptIds: ['daily-1800', 'daily-1850'],
    badge: '🏥 Family Care',
    category: 'Responsibility',
  },
  {
    id: 'disc-7',
    title: 'The Lockdown Rocker',
    description: 'During 2020 lockdown, your top artist shifted from Beatles acoustic pop to high-energy rock by The Killers (2,054 plays).',
    unlocked: false,
    evidenceReceiptIds: ['music-80000', 'music-85000'],
    badge: '🎧 WFH Sanctuary',
    category: 'Music Habit',
  },
  {
    id: 'disc-8',
    title: 'The Silent Transition',
    description: 'Cash payments for local autos transitioned silently into 100% digital card transactions between 2022 and 2024.',
    unlocked: false,
    evidenceReceiptIds: ['card-295780', 'card-479675'],
    badge: '💳 Cashless Autonomy',
    category: 'Financial Shift',
  },
  {
    id: 'disc-9',
    title: 'The Friday Surge',
    description: 'Friday is your most active logging day of the week with 27,318 receipts recorded across 11 years.',
    unlocked: false,
    evidenceReceiptIds: ['music-500', 'card-100'],
    badge: '📅 Weekly Peak',
    category: 'Behavior Pattern',
  },
  {
    id: 'disc-10',
    title: 'The Financial Anchor',
    description: 'Regular Public Provident Fund and Equity Mutual Fund investments began in 2017 and remained unbroken through 2024.',
    unlocked: false,
    evidenceReceiptIds: ['daily-500', 'daily-900'],
    badge: '📈 Long-Term Security',
    category: 'Financial Shift',
  },
];

export function getEvidenceReceipts(
  discoveryId: string,
  allReceipts: NormalizedReceipt[]
): NormalizedReceipt[] {
  const disc = INITIAL_DISCOVERIES.find((d) => d.id === discoveryId);
  if (!disc) return [];

  // Match explicitly by ID or return fallback representative receipts matching the topic
  const exactMatches = allReceipts.filter((r) => disc.evidenceReceiptIds.includes(r.id));
  if (exactMatches.length > 0) return exactMatches;

  if (discoveryId === 'disc-1') return allReceipts.filter((r) => r.subtitle?.includes('John Mayer') || r.title.includes('John Mayer')).slice(0, 4);
  if (discoveryId === 'disc-2') return allReceipts.filter((r) => r.text?.includes('Planner') || r.title.includes('Beatles')).slice(0, 4);
  if (discoveryId === 'disc-3') return allReceipts.filter((r) => r.type === 'place' || r.subtitle?.includes('Train')).slice(0, 4);
  if (discoveryId === 'disc-4') return allReceipts.filter((r) => r.subtitle === 'The Beatles' && new Date(r.timestamp).getHours() <= 4).slice(0, 4);
  if (discoveryId === 'disc-5') return allReceipts.filter((r) => r.type === 'search' || r.subtitle?.includes('Edtech')).slice(0, 4);
  if (discoveryId === 'disc-6') return allReceipts.filter((r) => r.tags.includes('Health') || r.text?.includes('Doctor')).slice(0, 4);
  if (discoveryId === 'disc-7') return allReceipts.filter((r) => r.subtitle === 'The Killers').slice(0, 4);
  if (discoveryId === 'disc-8') return allReceipts.filter((r) => r.tags.includes('card')).slice(0, 4);
  if (discoveryId === 'disc-9') return allReceipts.filter((r) => new Date(r.timestamp).getDay() === 5).slice(0, 4);
  return allReceipts.filter((r) => r.tags.includes('Investment') || r.subtitle?.includes('Mutual fund')).slice(0, 4);
}
