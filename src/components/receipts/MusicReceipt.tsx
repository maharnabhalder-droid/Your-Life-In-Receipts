import React from 'react';
import { Music, Disc } from 'lucide-react';
import { NormalizedReceipt } from '../../types/receipt';
import { ReceiptBase } from './ReceiptBase';

export const MusicReceipt: React.FC<{ receipt: NormalizedReceipt }> = ({ receipt }) => {
  const msPlayed = receipt.meta?.ms_played || 210000;
  const minutes = Math.floor(msPlayed / 60000);
  const seconds = Math.floor((msPlayed % 60000) / 1000);

  // Generate synthetic barcode-style waveform bars
  const waveformBars = Array.from({ length: 32 }, (_, i) => {
    const h = 20 + Math.sin(i * 0.5 + receipt.title.length) * 15 + ((i * 7) % 25);
    return Math.max(10, Math.min(45, h));
  });

  return (
    <ReceiptBase
      receipt={receipt}
      stampText={receipt.meta?.skipped ? 'SKIPPED' : 'PLAYED'}
      stampColorClass={receipt.meta?.skipped ? 'text-red-500 border-red-500' : 'text-purple-600 border-purple-600'}
      badgeIcon={<Music className="w-3.5 h-3.5 text-purple-500" />}
    >
      <div>
        <h3 className="font-bold text-sm md:text-base text-[var(--ink-primary)] leading-tight">
          {receipt.title}
        </h3>
        <p className="text-xs text-[var(--ink-secondary)] flex items-center gap-1 mt-0.5">
          <Disc className="w-3 h-3 text-purple-400 inline" />
          {receipt.subtitle || 'Artist'} {receipt.meta?.album ? `• ${receipt.meta.album}` : ''}
        </p>
      </div>

      <div className="bg-[var(--paper-bg-alt)] p-2.5 rounded border border-[var(--border-receipt)] space-y-1.5">
        <div className="flex justify-between text-[11px] text-[var(--ink-secondary)]">
          <span>Platform: {receipt.meta?.platform || 'Spotify'}</span>
          <span>Duration: {minutes}:{seconds.toString().padStart(2, '0')}</span>
        </div>

        {/* Barcode-style Waveform Stub */}
        <div className="flex items-end justify-between h-8 pt-1 px-1 gap-[2px] opacity-80">
          {waveformBars.map((height, i) => (
            <div
              key={i}
              className="w-1 bg-[var(--ink-primary)] rounded-t-sm"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      <p className="text-[11px] text-[var(--ink-faded)] italic">
        "{receipt.text}"
      </p>
    </ReceiptBase>
  );
};
