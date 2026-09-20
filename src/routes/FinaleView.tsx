import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { toPng } from 'html-to-image';
import { Download, Sparkles, Award, Star, FileText } from 'lucide-react';
import { useReceiptStore } from '../store/useReceiptStore';

export const FinaleView: React.FC = () => {
  const receipts = useReceiptStore((state) => state.receipts);
  const computed = useReceiptStore((state) => state.computed);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const totalReceipts = receipts.length;
  const totalSpent = receipts.reduce((acc, r) => acc + (r.amount || 0), 0);
  const chapters = computed?.chapters || [];

  // Top artists, top merchant, top category computation
  const musicReceipts = receipts.filter((r) => r.type === 'music');
  const artistCounts: Record<string, number> = {};
  musicReceipts.forEach((r) => {
    if (r.subtitle) artistCounts[r.subtitle] = (artistCounts[r.subtitle] || 0) + 1;
  });
  const topArtist = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'The Beatles';

  const purchaseReceipts = receipts.filter((r) => r.type === 'purchase');
  const merchantCounts: Record<string, number> = {};
  purchaseReceipts.forEach((r) => {
    merchantCounts[r.title] = (merchantCounts[r.title] || 0) + 1;
  });
  const topMerchant = Object.entries(merchantCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Local Store';

  const nocturnalCount = receipts.filter((r) => {
    const h = new Date(r.timestamp).getHours();
    return h >= 0 && h <= 4;
  }).length;
  const nocturnalPct = receipts.length > 0 ? ((nocturnalCount / receipts.length) * 100).toFixed(1) : '16.9';

  const handleExportImage = async () => {
    if (!receiptRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(receiptRef.current, { cacheBust: true, quality: 0.95 });
      const link = document.createElement('a');
      link.download = 'The-Receipt-of-You.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export summary receipt as image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-mono space-y-8 text-center">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="font-serif font-black text-3xl md:text-4xl text-[var(--text-main)]">
          The Receipt of You
        </h2>
        <p className="text-xs md:text-sm text-[var(--text-muted)] max-w-md mx-auto">
          Your decade-long life summary printed on a single master thermal receipt.
        </p>

        <button
          onClick={handleExportImage}
          disabled={isExporting}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-black font-extrabold text-sm shadow-xl flex items-center gap-2 mx-auto hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'GENERATING IMAGE...' : 'EXPORT MASTER RECEIPT AS PNG'}</span>
        </button>
      </div>

      {/* The Master Summary Receipt */}
      <div ref={receiptRef} className="max-w-lg mx-auto p-2">
        <div className="receipt-paper p-6 md:p-8 rounded-sm torn-both shadow-2xl space-y-6 text-left border-2 border-amber-500/40">
          {/* Header Stamp */}
          <div className="text-center border-b-2 border-dashed border-[var(--border-receipt)] pb-4 space-y-1">
            <span className="rubber-stamp text-amber-600 border-amber-600 text-xs">OFFICIAL LIFETIME STATEMENT</span>
            <h1 className="font-serif font-bold text-2xl text-[var(--ink-primary)] pt-2">
              THE RECEIPT OF YOU
            </h1>
            <p className="text-[11px] text-[var(--ink-faded)]">
              Issued for: Personal Data Telemetry • 2013 – 2024
            </p>
          </div>

          {/* Grand Totals */}
          <div className="bg-[var(--paper-bg-alt)] p-4 rounded border border-[var(--border-receipt)] space-y-2 text-xs text-[var(--ink-secondary)]">
            <div className="flex justify-between font-bold text-sm text-[var(--ink-primary)]">
              <span>TOTAL LOGGED FOOTPRINTS</span>
              <span>{totalReceipts.toLocaleString()} Receipts</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-emerald-600">
              <span>TOTAL ESTIMATED SPEND</span>
              <span>₹{Math.round(totalSpent).toLocaleString()}</span>
            </div>
            <div className="flex justify-between opacity-80 pt-1 border-t border-dotted border-[var(--border-receipt)]">
              <span>ACTIVE SPAN</span>
              <span>11.5 Years (4,178 Days)</span>
            </div>
          </div>

          {/* Top Categories & Items */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-[var(--ink-primary)] uppercase tracking-wider border-b border-dashed border-[var(--border-receipt)] pb-1">
              ★ TOP LIFETIME ANCHORS
            </h3>
            <div className="space-y-1.5 text-[var(--ink-secondary)]">
              <div className="flex justify-between">
                <span>Top Music Artist:</span>
                <span className="font-bold text-[var(--ink-primary)]">{topArtist}</span>
              </div>
              <div className="flex justify-between">
                <span>Top Merchant Store:</span>
                <span className="font-bold text-[var(--ink-primary)]">{topMerchant}</span>
              </div>
              <div className="flex justify-between">
                <span>Late-Night Ratio (00:00–04:00 AM):</span>
                <span className="font-bold text-[var(--ink-primary)]">{nocturnalPct}%</span>
              </div>
            </div>
          </div>

          {/* The 5 Life Chapters */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-[var(--ink-primary)] uppercase tracking-wider border-b border-dashed border-[var(--border-receipt)] pb-1">
              📖 YOUR 5 LIFE CHAPTERS
            </h3>
            <div className="space-y-2">
              {chapters.map((ch, idx) => (
                <div key={ch.id} className="bg-[var(--paper-bg-alt)] p-2.5 rounded border border-[var(--border-receipt)] space-y-1">
                  <div className="flex justify-between font-bold text-[var(--ink-primary)]">
                    <span>Ch {idx + 1}: {ch.title}</span>
                    <span className="text-[10px] text-amber-600 uppercase">{ch.dominantMood}</span>
                  </div>
                  <div className="text-[10px] text-[var(--ink-faded)] italic">"{ch.persona}"</div>
                </div>
              ))}
            </div>
          </div>

          {/* Closing Master Insight */}
          <div className="border-t-2 border-dashed border-[var(--border-receipt)] pt-4 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase">
              <Sparkles className="w-4 h-4" /> CLOSING MASTER INSIGHT
            </div>
            <p className="font-serif italic text-sm text-[var(--ink-primary)] leading-relaxed">
              "You did not just live a decade; you authored a continuous, resilient quiet masterpiece. From student train commutes and Beatles streams to family care and digital autonomy—every receipt was proof of your growth."
            </p>
          </div>

          {/* Barcode & Footer */}
          <div className="text-center pt-3 border-t border-dotted border-[var(--border-receipt)] space-y-2">
            <div className="font-mono text-2xl tracking-[0.3em] font-bold opacity-80 text-[var(--ink-primary)]">
              ||| | |||| | |||||| || | |||
            </div>
            <div className="text-[9px] text-[var(--ink-faded)]">
              YOUR LIFE IN RECEIPTS • MASTER CERTIFICATE #2024-LIFETIME
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
