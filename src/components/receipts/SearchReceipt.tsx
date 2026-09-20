import React from 'react';
import { Terminal, Search } from 'lucide-react';
import { NormalizedReceipt } from '../../types/receipt';
import { ReceiptBase } from './ReceiptBase';

export const SearchReceipt: React.FC<{ receipt: NormalizedReceipt }> = ({ receipt }) => {
  return (
    <ReceiptBase
      receipt={receipt}
      stampText="QUERY"
      stampColorClass="text-orange-600 border-orange-600"
      badgeIcon={<Search className="w-3.5 h-3.5 text-orange-500" />}
    >
      <div className="bg-neutral-900 text-emerald-400 font-mono text-xs p-3 rounded border border-neutral-700 space-y-1">
        <div className="flex items-center gap-1.5 opacity-60 text-[10px]">
          <Terminal className="w-3 h-3 text-emerald-400" />
          <span>search_history.log --query</span>
        </div>
        <div className="text-sm font-bold text-white pt-1">
          $&gt; {receipt.title}
        </div>
        <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-800">
          Result: Intent logged • {receipt.subtitle || 'Kindle / Search Engine'}
        </div>
      </div>
    </ReceiptBase>
  );
};
