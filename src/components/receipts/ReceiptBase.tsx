import React from 'react';
import { Mood, NormalizedReceipt } from '../../types/receipt';
import { useReceiptStore } from '../../store/useReceiptStore';

interface ReceiptBaseProps {
  receipt: NormalizedReceipt;
  children: React.ReactNode;
  stampText?: string;
  stampColorClass?: string;
  badgeIcon?: React.ReactNode;
  tornStyle?: 'top' | 'bottom' | 'both' | 'none';
  onClick?: () => void;
}

const moodColors: Record<Mood, string> = {
  melancholic: 'bg-indigo-100 text-indigo-950 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700/50',
  introspective: 'bg-purple-100 text-purple-950 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700/50',
  driven: 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/50',
  restless: 'bg-red-100 text-red-950 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700/50',
  focused: 'bg-blue-100 text-blue-950 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700/50',
  balanced: 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700/50',
};

export const ReceiptBase: React.FC<ReceiptBaseProps> = ({
  receipt,
  children,
  stampText,
  stampColorClass = 'text-amber-600 border-amber-600',
  badgeIcon,
  tornStyle = 'both',
  onClick,
}) => {
  const selectedReceiptId = useReceiptStore((state) => state.selectedReceiptId);
  const selectReceipt = useReceiptStore((state) => state.selectReceipt);
  const isSelected = selectedReceiptId === receipt.id;

  const dateFormatted = new Date(receipt.timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const tornClasses =
    tornStyle === 'both'
      ? 'torn-both'
      : tornStyle === 'top'
      ? 'torn-top'
      : tornStyle === 'bottom'
      ? 'torn-bottom'
      : '';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectReceipt(isSelected ? null : receipt.id);
    if (onClick) onClick();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${receipt.type.toUpperCase()} Receipt #${receipt.id.slice(-6)}: ${receipt.title}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
      className={`relative cursor-pointer transition-all duration-200 py-1 max-w-lg mx-auto focus:outline-none focus:ring-2 focus:ring-amber-500 rounded ${
        isSelected ? 'ring-2 ring-amber-400 scale-[1.02] z-20' : 'hover:scale-[1.01] hover:shadow-2xl'
      }`}
    >
      <div className={`receipt-paper p-5 md:p-6 rounded-sm ${tornClasses} font-mono text-xs md:text-sm shadow-xl transition-colors`}>
        {/* Header Header Bar */}
        <div className="flex items-center justify-between border-b border-dashed border-[var(--border-receipt)] pb-3 mb-3 text-[var(--ink-secondary)]">
          <div className="flex items-center gap-2">
            {badgeIcon}
            <span className="font-bold tracking-wider uppercase text-[10px] md:text-xs">
              {receipt.type} RECEIPT #{receipt.id.slice(-6)}
            </span>
          </div>
          <span className="text-[10px] md:text-xs opacity-75">{dateFormatted}</span>
        </div>

        {/* Rubber Stamp Overlay */}
        {stampText && (
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <span className={`rubber-stamp ${stampColorClass}`}>{stampText}</span>
          </div>
        )}

        {/* Main Custom Receipt Content */}
        <div className="py-2 space-y-3">{children}</div>

        {/* Footer Bar: Tags, Mood, Amount */}
        <div className="mt-4 pt-3 border-t border-dashed border-[var(--border-receipt)] flex flex-wrap items-center justify-between gap-2 text-[10px] md:text-xs text-[var(--ink-faded)]">
          <div className="flex items-center gap-1.5 flex-wrap">
            {receipt.mood && (
              <span className={`px-2 py-0.5 rounded border text-[10px] capitalize font-medium ${moodColors[receipt.mood]}`}>
                {receipt.mood}
              </span>
            )}
            {receipt.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="bg-[var(--paper-bg-alt)] text-[var(--ink-secondary)] px-1.5 py-0.5 rounded border border-[var(--border-receipt)]">
                #{tag}
              </span>
            ))}
          </div>

          {receipt.amount && receipt.amount > 0 ? (
            <div className="font-bold text-sm md:text-base text-[var(--ink-primary)]">
              ₹{receipt.amount.toLocaleString()}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
