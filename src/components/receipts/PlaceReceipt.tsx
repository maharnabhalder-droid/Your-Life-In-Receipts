import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { NormalizedReceipt } from '../../types/receipt';
import { ReceiptBase } from './ReceiptBase';

export const PlaceReceipt: React.FC<{ receipt: NormalizedReceipt }> = ({ receipt }) => {
  const locName = receipt.location?.name || receipt.title || 'Transit Locus';
  const lat = receipt.location?.lat || 19.076;
  const long = receipt.location?.long || 72.8777;

  return (
    <ReceiptBase
      receipt={receipt}
      stampText="VISITED"
      stampColorClass="text-amber-600 border-amber-600"
      badgeIcon={<MapPin className="w-3.5 h-3.5 text-amber-500" />}
    >
      <div>
        <h3 className="font-bold text-sm md:text-base text-[var(--ink-primary)] leading-tight flex items-center gap-1.5">
          <Navigation className="w-4 h-4 text-amber-500 shrink-0" />
          {locName}
        </h3>
        <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
          {receipt.subtitle || 'Location & Transit'}
        </p>
      </div>

      <div className="bg-[var(--paper-bg-alt)] p-2.5 rounded border border-[var(--border-receipt)] font-mono text-[11px] space-y-1">
        <div className="flex justify-between text-[var(--ink-secondary)]">
          <span>LAT: {lat.toFixed(4)}° N</span>
          <span>LONG: {long.toFixed(4)}° E</span>
        </div>
        <div className="text-[var(--ink-faded)] italic">
          Duration: ~45 mins stay • Mode: {receipt.tags.join(', ') || 'Local Transport'}
        </div>
      </div>

      <p className="text-[11px] text-[var(--ink-secondary)] font-mono bg-amber-500/10 p-2 rounded border border-amber-500/20">
        📍 "{receipt.text}"
      </p>
    </ReceiptBase>
  );
};
