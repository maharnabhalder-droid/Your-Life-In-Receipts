import { NormalizedReceipt, NormalizedReceiptSchema } from '../types/receipt';

let cachedReceipts: NormalizedReceipt[] | null = null;

export async function loadNormalizedReceipts(): Promise<NormalizedReceipt[]> {
  if (cachedReceipts) return cachedReceipts;

  try {
    let rawDataset: any[];

    if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
      const res = await fetch('./data/normalized_dataset.json');
      if (!res.ok) {
        const fallbackRes = await fetch('/data/normalized_dataset.json');
        rawDataset = await fallbackRes.json();
      } else {
        rawDataset = await res.json();
      }
    } else {
      // Node / Vitest testing fallback
      const dynamicImport = new Function('moduleName', 'return import(moduleName)');
      const fs = await dynamicImport('fs');
      const path = await dynamicImport('path');
      const filePath = path.join(process.cwd(), 'src/data/normalized_dataset.json');
      rawDataset = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

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
