import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { NormalizedReceipt } from '../../types/receipt';
import { ReceiptBase } from './ReceiptBase';

export const EventReceipt: React.FC<{ receipt: NormalizedReceipt }> = ({ receipt }) => {
  return (
    <ReceiptBase
      receipt={receipt}
      stampText="CONFIRMED"
      stampColorClass="text-pink-600 border-pink-600"
      badgeIcon={<Sparkles className="w-3.5 h-3.5 text-pink-500" />}
    >
      <div>
        <h3 className="font-bold text-sm md:text-base text-[var(--ink-primary)] leading-tight flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-pink-500 shrink-0" />
          {receipt.title}
        </h3>
        <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
          {receipt.subtitle || 'Festival / Event Milestone'}
        </p>
      </div>

      <div className="bg-pink-500/10 p-2.5 rounded border border-pink-500/20 text-[11px] text-[var(--ink-primary)] space-y-1">
        <div className="font-semibold text-pink-600">🎉 Event Celebration</div>
        <div>{receipt.text || 'Cultural event celebration and milestone entry.'}</div>
      </div>
    </ReceiptBase>
  );
};
