import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Printer, ArrowRight, Sparkles, Database, FileText } from 'lucide-react';
import { useReceiptStore } from '../store/useReceiptStore';

export const IntroView: React.FC<{ onBegin: () => void }> = ({ onBegin }) => {
  const receipts = useReceiptStore((state) => state.receipts);
  const isLoading = useReceiptStore((state) => state.isLoading);
  const [printedCount, setPrintedCount] = useState(0);

  useEffect(() => {
    if (receipts.length === 0) return;
    const target = receipts.length;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setPrintedCount(target);
        clearInterval(timer);
      } else {
        setPrintedCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [receipts]);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center font-mono relative overflow-hidden">
      {/* Background Animated Thermal Lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto space-y-6 z-10"
      >
        {/* Animated Printer Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5 shadow-2xl mx-auto">
            <div className="w-full h-full bg-[var(--bg-desk)] rounded-[14px] flex items-center justify-center text-amber-400">
              <Printer className="w-10 h-10 animate-bounce" />
            </div>
          </div>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
            LIVE PRINT
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="font-serif font-black text-4xl md:text-5xl text-[var(--text-main)] tracking-tight leading-tight">
            Your Life, In Receipts
          </h1>
          <p className="font-sans text-sm md:text-base text-[var(--text-muted)] max-w-md mx-auto">
            A living thermal-paper printout of 11 years. Turning raw telemetry data into hidden insights, connected moments, and personal narrative arcs.
          </p>
        </div>

        {/* Live Count Box */}
        <div className="receipt-paper p-5 rounded-lg torn-both shadow-2xl max-w-md mx-auto text-left space-y-3 border border-amber-500/30">
          <div className="flex items-center justify-between border-b border-dashed border-[var(--border-receipt)] pb-2 text-xs text-[var(--ink-secondary)]">
            <span className="flex items-center gap-1.5 font-bold uppercase">
              <Database className="w-3.5 h-3.5 text-amber-600" /> DATASET BUFFER
            </span>
            <span>2013 — 2024</span>
          </div>

          <div className="flex items-center justify-between text-xl md:text-2xl font-bold font-mono text-[var(--ink-primary)]">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" /> RECEIPT ROLLS:
            </span>
            <span className="text-amber-600">
              {isLoading ? 'INDEXING...' : printedCount.toLocaleString()}
            </span>
          </div>

          <div className="text-[11px] text-[var(--ink-faded)] space-y-1">
            <div className="flex justify-between">
              <span>Included Telemetry Types:</span>
              <span className="font-semibold text-[var(--ink-primary)]">9 Categories</span>
            </div>
            <div className="flex justify-between">
              <span>Detected Life Eras:</span>
              <span className="font-semibold text-[var(--ink-primary)]">5 Chapters</span>
            </div>
          </div>
        </div>

        {/* Call to Begin Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onBegin}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 text-black font-extrabold font-mono text-base md:text-lg shadow-2xl flex items-center gap-3 mx-auto hover:brightness-110 transition-all cursor-pointer"
        >
          <span>UNROLL THE STORY</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <p className="text-[11px] text-[var(--text-muted)] font-mono">
          Press Ctrl+K anytime for global search • Built with React 19, D3, Tailwind v4 & Zustand
        </p>
      </motion.div>
    </div>
  );
};
