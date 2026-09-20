import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { Search, Music, ShoppingBag, MapPin, Film, Sparkles, Sun, Moon } from 'lucide-react';
import { useReceiptStore } from '../store/useReceiptStore';
import { useTheme } from '../theme/ThemeContext';
import { ReceiptType } from '../types/receipt';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setRoute: (route: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, setRoute }) => {
  const { theme, toggleTheme } = useTheme();
  const receipts = useReceiptStore((state) => state.receipts);
  const setSearchQuery = useReceiptStore((state) => state.setSearchQuery);
  const toggleTypeFilter = useReceiptStore((state) => state.toggleTypeFilter);
  const selectReceipt = useReceiptStore((state) => state.selectReceipt);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-[var(--bg-desk)] border border-neutral-700 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden font-mono text-sm text-[var(--text-main)]">
        <Command label="Global Command Palette">
          <div className="flex items-center px-3 border-b border-neutral-800">
            <Search className="w-4 h-4 text-neutral-400 mr-2" />
            <Command.Input
              placeholder="Search receipts by title, artist, place, keyword or tag..."
              className="w-full py-3 bg-transparent text-sm focus:outline-none placeholder:text-neutral-500"
              onValueChange={(val) => setSearchQuery(val)}
            />
            <kbd className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">ESC</kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="p-4 text-center text-xs text-neutral-400">
              No matching life receipts found.
            </Command.Empty>

            <Command.Group heading="QUICK NAVIGATE" className="text-[10px] text-neutral-500 font-bold px-2 py-1">
              <Command.Item
                onSelect={() => {
                  setRoute('/roll');
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer"
              >
                <span>📜 Jump to The Roll</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setRoute('/lab');
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer"
              >
                <span>📊 Open Pattern Lab Charts</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setRoute('/discoveries');
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer"
              >
                <span>🔍 View Discoveries Meter</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="FILTER BY CATEGORY" className="text-[10px] text-neutral-500 font-bold px-2 py-1">
              {[
                { type: 'music' as ReceiptType, label: 'Music Streams', icon: Music },
                { type: 'purchase' as ReceiptType, label: 'Purchases', icon: ShoppingBag },
                { type: 'place' as ReceiptType, label: 'Places & Transit', icon: MapPin },
                { type: 'movie' as ReceiptType, label: 'Movies & Cinema', icon: Film },
              ].map((cat) => {
                const Icon = cat.icon;
                return (
                  <Command.Item
                    key={cat.type}
                    onSelect={() => {
                      toggleTypeFilter(cat.type);
                      setRoute('/roll');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded hover:bg-neutral-800 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-amber-500" />
                      <span>{cat.label}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">Filter</span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            <Command.Group heading="RECENT MATCHING RECEIPTS" className="text-[10px] text-neutral-500 font-bold px-2 py-1">
              {receipts.slice(0, 5).map((r) => (
                <Command.Item
                  key={r.id}
                  onSelect={() => {
                    selectReceipt(r.id);
                    setRoute('/roll');
                    onClose();
                  }}
                  className="flex items-center justify-between p-2 rounded hover:bg-neutral-800 cursor-pointer text-xs"
                >
                  <div className="truncate max-w-[80%]">
                    <span className="font-bold text-amber-400">[{r.type.toUpperCase()}]</span> {r.title}
                    {r.subtitle && <span className="opacity-60 ml-1">({r.subtitle})</span>}
                  </div>
                  <span className="text-[10px] text-neutral-500">{new Date(r.timestamp).getFullYear()}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="THEME" className="text-[10px] text-neutral-500 font-bold px-2 py-1">
              <Command.Item
                onSelect={() => {
                  toggleTheme();
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded hover:bg-neutral-800 cursor-pointer text-xs"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                <span>Switch to {theme === 'dark' ? 'Day Desk (Light Mode)' : 'Night Shift (Dark Mode)'}</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>

        <div className="p-2 bg-neutral-900 border-t border-neutral-800 text-[10px] text-neutral-500 flex justify-between">
          <span>Navigate with ↑↓ • Select with ENTER</span>
          <button onClick={onClose} className="hover:text-white">Close Window</button>
        </div>
      </div>
    </div>
  );
};
