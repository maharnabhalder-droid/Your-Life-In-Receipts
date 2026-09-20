import React from 'react';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { NormalizedReceipt } from '../../types/receipt';
import { ReceiptBase } from './ReceiptBase';

export const PurchaseReceipt: React.FC<{ receipt: NormalizedReceipt }> = ({ receipt }) => {
  const isFraud = receipt.meta?.isFraud;
  const subtotal = (receipt.amount || 100) * 0.82;
  const tax = (receipt.amount || 100) * 0.18;

  return (
    <ReceiptBase
      receipt={receipt}
      stampText={isFraud ? 'ALERT' : 'PAID'}
      stampColorClass={isFraud ? 'text-red-600 border-red-600 animate-pulse' : 'text-emerald-600 border-emerald-600'}
      badgeIcon={<ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />}
    >
      <div>
        <h3 className="font-bold text-sm md:text-base text-[var(--ink-primary)] leading-tight">
          {receipt.title}
        </h3>
        <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
          {receipt.subtitle || 'General Purchase'}
        </p>
      </div>

      <div className="border-t border-b border-dashed border-[var(--border-receipt)] py-2 space-y-1 text-[11px] text-[var(--ink-secondary)]">
        <div className="flex justify-between">
          <span>1x {receipt.title}</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between opacity-75">
          <span>GST / Tax (18%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-[var(--ink-primary)] pt-1 border-t border-dotted border-[var(--border-receipt)]">
          <span>TOTAL AMOUNT</span>
          <span>₹{(receipt.amount || 0).toLocaleString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-[var(--ink-faded)]">
        <span className="flex items-center gap-1">
          <CreditCard className="w-3 h-3 text-emerald-500" />
          {receipt.meta?.mode || `Card **** ${receipt.meta?.ccLast4 || '4021'}`}
        </span>
        <span>Auth: #{receipt.id.slice(-4).toUpperCase()}</span>
      </div>
    </ReceiptBase>
  );
};
