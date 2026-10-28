import { Home, Package, Calendar, BarChart2 } from 'lucide-react';
import type { Screen } from './types';

interface Props {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

const tabs: { screen: Screen; label: string; Icon: typeof Home }[] = [
  { screen: 'home', label: 'Home', Icon: Home },
  { screen: 'package-details', label: 'Packages', Icon: Package },
  { screen: 'calendar', label: 'History', Icon: Calendar },
  { screen: 'insights', label: 'Insights', Icon: BarChart2 },
];

export function BottomNav({ current, onNavigate }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 pb-6 pt-3"
      style={{
        background: 'var(--card)',
        borderTop: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {tabs.map(({ screen, label, Icon }) => {
        const active = current === screen || (screen === 'package-details' && current === 'add-package') || (screen === 'home' && current === 'log-class');
        return (
          <button
            key={screen}
            onClick={() => onNavigate(screen)}
            className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all"
            style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)' }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: 11, fontWeight: active ? 600 : 400 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
