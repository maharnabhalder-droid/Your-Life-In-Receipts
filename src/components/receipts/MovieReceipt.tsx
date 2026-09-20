import React from 'react';
import { Film, Ticket } from 'lucide-react';
import { NormalizedReceipt } from '../../types/receipt';
import { ReceiptBase } from './ReceiptBase';

export const MovieReceipt: React.FC<{ receipt: NormalizedReceipt }> = ({ receipt }) => {
  return (
    <ReceiptBase
      receipt={receipt}
      stampText="ADMIT ONE"
      stampColorClass="text-red-600 border-red-600"
      badgeIcon={<Film className="w-3.5 h-3.5 text-red-500" />}
    >
      <div className="border-2 border-dashed border-[var(--border-receipt)] p-3 rounded-lg relative overflow-hidden bg-red-500/5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-sm md:text-base text-[var(--ink-primary)] leading-tight">
              {receipt.title}
            </h3>
            <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
              {receipt.subtitle || 'Movie & Entertainment Ticket'}
            </p>
          </div>
          <Ticket className="w-5 h-5 text-red-500 shrink-0" />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-dotted border-[var(--border-receipt)] text-[10px] text-[var(--ink-secondary)]">
          <div>
            <span className="block opacity-60">SCREEN</span>
            <span className="font-bold text-[var(--ink-primary)]">SCREEN 04</span>
          </div>
          <div>
            <span className="block opacity-60">SEAT</span>
            <span className="font-bold text-[var(--ink-primary)]">F-12</span>
          </div>
          <div>
            <span className="block opacity-60">TIME</span>
            <span className="font-bold text-[var(--ink-primary)]">21:30 PM</span>
          </div>
        </div>
      </div>
    </ReceiptBase>
  );
};
