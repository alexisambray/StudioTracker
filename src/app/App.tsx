import '../styles/fonts.css';
import { useState } from 'react';
import { useStore } from './components/useStore';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HomeScreen } from './components/HomeScreen';
import { AddPackageScreen } from './components/AddPackageScreen';
import { LogClassScreen } from './components/LogClassScreen';
import { EditClassScreen } from './components/EditClassScreen';
import { PackageDetailsScreen } from './components/PackageDetailsScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { BottomNav } from './components/BottomNav';
import type { Screen } from './components/types';

export default function App() {
  const store = useStore();
  const [screen, setScreen] = useState<Screen>(store.onboarded ? 'home' : 'onboarding');
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>();
  const [selectedLogId, setSelectedLogId] = useState<string | undefined>();
  const availablePackages = store.packages.filter(pkg => !pkg.archivedAt);

  function navigate(s: Screen, data?: unknown) {
    if (s === 'package-details' && typeof data === 'string') {
      setSelectedPackageId(data);
    }
    if (s === 'edit-class' && typeof data === 'string') {
      setSelectedLogId(data);
    }
    setScreen(s);
  }

  const showNav = !['onboarding', 'add-package', 'log-class', 'edit-class'].includes(screen);

  return (
    <div
      className="size-full overflow-auto"
      style={{ maxWidth: 430, margin: '0 auto', position: 'relative', fontFamily: 'DM Sans, sans-serif' }}
    >
      {screen === 'onboarding' && (
        <OnboardingScreen onComplete={() => { store.completeOnboarding(); setScreen('home'); }} />
      )}

      {screen === 'home' && (
        <HomeScreen
          packages={availablePackages}
          logs={store.logs}
          onNavigate={navigate}
          onEditLog={(id) => navigate('edit-class', id)}
        />
      )}

      {screen === 'add-package' && (
        <AddPackageScreen
          onAdd={(pkg) => { store.addPackage(pkg); navigate('package-details', pkg.id); }}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'log-class' && (
        <LogClassScreen
          packages={availablePackages}
          onLog={(log) => { store.addLog(log); }}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'edit-class' && selectedLogId && (
        <EditClassScreen
          log={store.logs.find(log => log.id === selectedLogId)}
          packages={store.packages}
          onSave={(log) => { store.updateLog(log); setScreen('home'); }}
          onDelete={(id) => { store.removeLog(id); setScreen('home'); }}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'package-details' && (
        <PackageDetailsScreen
          packages={availablePackages}
          logs={store.logs}
          selectedId={selectedPackageId}
          onArchive={store.archivePackage}
          onEditLog={(id) => navigate('edit-class', id)}
          onBack={() => setScreen('home')}
          onLogClass={() => setScreen('log-class')}
        />
      )}

      {screen === 'calendar' && (
        <CalendarScreen
          logs={store.logs}
          onBack={() => setScreen('home')}
          onEditLog={(id) => navigate('edit-class', id)}
          onClearLogs={store.clearLogs}
        />
      )}

      {screen === 'insights' && (
        <InsightsScreen
          packages={store.packages}
          logs={store.logs}
          onBack={() => setScreen('home')}
        />
      )}

      {showNav && (
        <BottomNav current={screen} onNavigate={navigate} />
      )}
    </div>
  );
}
