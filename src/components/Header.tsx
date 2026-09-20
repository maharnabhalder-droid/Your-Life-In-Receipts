import React from 'react';
import { Sun, Moon, Search, Sparkles, ScrollText, BarChart3, Compass, Flag } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useReceiptStore } from '../store/useReceiptStore';

interface HeaderProps {
  currentRoute: string;
  setRoute: (route: string) => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, setRoute, onOpenCommandPalette }) => {
  const { theme, toggleTheme } = useTheme();
  const surpriseMe = useReceiptStore((state) => state.surpriseMe);
  const unlockedCount = useReceiptStore((state) => state.unlockedDiscoveryIds.length);

  const navItems = [
    { id: '/roll', label: 'The Roll', icon: ScrollText },
    { id: '/lab', label: 'Pattern Lab', icon: BarChart3 },
    { id: '/discoveries', label: `Discoveries (${unlockedCount})`, icon: Compass },
    { id: '/finale', label: 'Finale', icon: Flag },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-desk)]/95 backdrop-blur-md border-b border-[var(--bg-desk-secondary)] px-3 py-2.5 md:px-4 md:py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Title */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setRoute('/')}>
          <div className="w-8 h-8 rounded bg-amber-500 text-black flex items-center justify-center font-extrabold text-base md:text-lg shadow">
            🧾
          </div>
          <div className="hidden sm:block">
            <h1 className="font-serif font-bold text-sm md:text-lg text-[var(--text-main)] leading-none">
              Your Life, In Receipts
            </h1>
            <span className="text-[9px] font-mono text-[var(--text-muted)] tracking-wider block mt-0.5">
              THERMAL PAPER CHRONICLES
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Mobile Responsive & Scrollable) */}
        <nav className="flex items-center gap-1 bg-[var(--bg-desk-secondary)] p-1 rounded-lg border border-neutral-800 overflow-x-auto no-scrollbar max-w-[55vw] sm:max-w-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setRoute(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-colors shrink-0 min-h-[38px] ${
                  isActive
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-neutral-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenCommandPalette}
            aria-label="Search receipts by keyword (Cmd+K)"
            className="flex items-center gap-1 px-2.5 py-2 rounded-md bg-[var(--bg-desk-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-neutral-700 text-xs font-mono min-h-[38px]"
            title="Global Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden lg:inline px-1 bg-neutral-800 rounded text-[9px]">⌘K</kbd>
          </button>

          <button
            onClick={() => {
              setRoute('/roll');
              surpriseMe();
            }}
            aria-label="Jump to a surprise connected moment"
            className="flex items-center gap-1 px-2.5 py-2 rounded-md bg-gradient-to-r from-amber-500 to-purple-600 text-black font-mono text-xs font-bold shadow hover:brightness-110 transition-all min-h-[38px]"
            title="Jump to a Surprise Connected Moment"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Surprise Me</span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle between dark and light themes"
            className="p-2 rounded-md bg-[var(--bg-desk-secondary)] text-[var(--text-main)] border border-neutral-700 hover:border-amber-500 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
            title={`Switch to ${theme === 'dark' ? 'Day Desk (Light)' : 'Night Shift (Dark)'} Theme`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
