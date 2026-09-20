import rawDataset from './normalized_dataset.json';
import { NormalizedReceipt, NormalizedReceiptSchema } from '../types/receipt';

let cachedReceipts: NormalizedReceipt[] | null = null;

export function loadNormalizedReceipts(): NormalizedReceipt[] {
  if (cachedReceipts) return cachedReceipts;

  try {
    const parsed = rawDataset.map((item, index) => {
      const result = NormalizedReceiptSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Zod Schema Validation Failure at index ${index} (ID: ${(item as any)?.id}): ${result.error.message}`
        );
      }
      return result.data;
    });
    cachedReceipts = parsed;
    return parsed;
  } catch (error) {
    console.error('CRITICAL: Data schema validation error in loader:', error);
    throw new Error(`Data Validation Failed: ${(error as Error).message}`);
  }
}
