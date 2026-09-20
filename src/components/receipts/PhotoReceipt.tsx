import React from 'react';
import { Camera, Image } from 'lucide-react';
import { NormalizedReceipt } from '../../types/receipt';
import { ReceiptBase } from './ReceiptBase';

export const PhotoReceipt: React.FC<{ receipt: NormalizedReceipt }> = ({ receipt }) => {
  return (
    <ReceiptBase
      receipt={receipt}
      stampText="SNAPSHOT"
      stampColorClass="text-teal-600 border-teal-600"
      badgeIcon={<Camera className="w-3.5 h-3.5 text-teal-500" />}
    >
      <div className="bg-[var(--paper-bg-alt)] p-3 rounded border border-[var(--border-receipt)] text-center space-y-2">
        <div className="h-24 bg-neutral-800 rounded flex flex-col items-center justify-center text-neutral-400 gap-1 border border-neutral-700">
          <Image className="w-8 h-8 opacity-60 text-teal-400" />
          <span className="text-[10px] font-mono">[ Printed Photo Stub ]</span>
        </div>
        <div className="text-xs font-bold text-[var(--ink-primary)]">{receipt.title}</div>
        <div className="text-[10px] text-[var(--ink-secondary)] flex justify-around border-t border-dashed border-[var(--border-receipt)] pt-1.5">
          <span>{receipt.meta?.exposure || '1/250s'}</span>
          <span>{receipt.meta?.iso || 'ISO 400'}</span>
          <span>{receipt.meta?.focalLength || '35mm'}</span>
        </div>
      </div>
    </ReceiptBase>
  );
};
