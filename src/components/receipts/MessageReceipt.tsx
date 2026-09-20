import React from 'react';
import { MessageSquare } from 'lucide-react';
import { NormalizedReceipt } from '../../types/receipt';
import { ReceiptBase } from './ReceiptBase';

export const MessageReceipt: React.FC<{ receipt: NormalizedReceipt }> = ({ receipt }) => {
  return (
    <ReceiptBase
      receipt={receipt}
      stampText="MEMO"
      stampColorClass="text-cyan-600 border-cyan-600"
      badgeIcon={<MessageSquare className="w-3.5 h-3.5 text-cyan-500" />}
    >
      <div className="bg-yellow-100/40 dark:bg-yellow-900/20 p-3 rounded border border-yellow-500/30 font-serif italic text-sm md:text-base text-[var(--ink-primary)]">
        "{receipt.title}"
        {receipt.text && <p className="text-xs font-mono not-italic mt-2 text-[var(--ink-secondary)]">{receipt.text}</p>}
      </div>
    </ReceiptBase>
  );
};
