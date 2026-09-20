import rawDataset from './normalized_dataset.json';
import { NormalizedReceipt, NormalizedReceiptSchema } from '../types/receipt';

let cachedReceipts: NormalizedReceipt[] | null = null;

export function loadNormalizedReceipts(): NormalizedReceipt[] {
  if (cachedReceipts) return cachedReceipts;

  try {
    const parsed = rawDataset.map((item) => NormalizedReceiptSchema.parse(item));
    cachedReceipts = parsed;
    return parsed;
  } catch (error) {
    console.error('Failed to validate receipts with Zod schema:', error);
    // Fallback if parsing fails on any single record
    cachedReceipts = rawDataset as NormalizedReceipt[];
    return cachedReceipts;
  }
}
