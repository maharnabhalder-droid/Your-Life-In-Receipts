import { z } from 'zod';

export const ReceiptTypeSchema = z.enum([
  'music',
  'purchase',
  'place',
  'movie',
  'event',
  'message',
  'note',
  'search',
  'photo',
]);

export type ReceiptType = z.infer<typeof ReceiptTypeSchema>;

export const MoodSchema = z.enum([
  'melancholic',
  'introspective',
  'driven',
  'restless',
  'focused',
  'balanced',
]);

export type Mood = z.infer<typeof MoodSchema>;

export const LocationSchema = z.object({
  name: z.string(),
  lat: z.number().optional(),
  long: z.number().optional(),
});

export const NormalizedReceiptSchema = z.object({
  id: z.string(),
  type: ReceiptTypeSchema,
  timestamp: z.string(), // ISO String
  title: z.string(),
  subtitle: z.string().optional(),
  tags: z.array(z.string()),
  location: LocationSchema.optional(),
  amount: z.number().optional().default(0),
  mood: MoodSchema.optional().default('focused'),
  text: z.string().optional(),
  meta: z.record(z.any()).optional().default({}),
});

export type NormalizedReceipt = z.infer<typeof NormalizedReceiptSchema>;

export interface Chapter {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  persona: string;
  dominantMood: Mood;
  narrative: string;
  topStats: {
    totalReceipts: number;
    topArtistOrMerchant: string;
    totalSpent: number;
    nocturnalRatio: number;
  };
  receiptIds: string[];
}

export interface ThreadConnection {
  sourceId: string;
  targetId: string;
  score: number; // 0..1
  reasons: string[];
  type: 'time' | 'place' | 'keyword' | 'mood' | 'search_purchase' | 'sequence';
}

export interface Moment {
  id: string;
  title: string;
  description: string;
  receiptIds: string[];
  connectionStrength: number;
  patternType: string;
}

export interface Discovery {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  evidenceReceiptIds: string[];
  badge: string;
  category: string;
}
