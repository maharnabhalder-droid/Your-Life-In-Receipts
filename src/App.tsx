import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { MomentDrawer } from './components/MomentDrawer';
import { TechBackgroundCanvas } from './components/TechBackgroundCanvas';
import { IntroView } from './routes/IntroView';
import { RollView } from './routes/RollView';
import { PatternLabView } from './routes/PatternLabView';
import { DiscoveriesView } from './routes/DiscoveriesView';
import { FinaleView } from './routes/FinaleView';
import { useReceiptStore } from './store/useReceiptStore';

export const AppContent: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const initStore = useReceiptStore((state) => state.init);
  const isLoading = useReceiptStore((state) => state.isLoading);

  useEffect(() => {
    initStore();
  }, [initStore]);

  // Handle browser URL hash or search params routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentRoute(hash);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
  };

  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/':
        return <IntroView onBegin={() => navigateTo('/roll')} />;
      case '/roll':
        return <RollView />;
      case '/lab':
        return <PatternLabView />;
      case '/discoveries':
        return <DiscoveriesView setRoute={navigateTo} />;
      case '/finale':
        return <FinaleView />;
      default:
        return <RollView />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-desk)] text-[var(--text-main)] transition-colors duration-300 relative overflow-x-hidden">
      {/* Interactive Tech Telemetry & Grid Background */}
      <TechBackgroundCanvas />

      <div className="relative z-10">
        <Header
          currentRoute={currentRoute}
          setRoute={navigateTo}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {isLoading ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[var(--text-muted)] animate-pulse">
              PRINTING THERMAL RECEIPTS & COMPUTING CHAPTER ARCS...
            </span>
          </div>
        ) : (
          renderCurrentView()
        )}

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          setRoute={navigateTo}
        />

        <MomentDrawer />
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
