import { motion } from 'motion/react';
import { Plus, Package, Pencil } from 'lucide-react';
import { ACTIVITY_COLORS, ACTIVITY_ICONS, formatPHP, type Package as Pkg, type ClassLog, type Screen, type ActivityType } from './types';

interface Props {
  packages: Pkg[];
  logs: ClassLog[];
  onNavigate: (screen: Screen, data?: unknown) => void;
  onEditLog: (id: string) => void;
}

function calcStreak(logs: ClassLog[]): number {
  if (!logs.length) return 0;
  const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let cursor = new Date(today);
  const logDates = new Set(sorted.map(l => l.date.slice(0, 10)));

  for (let i = 0; i < 365; i++) {
    const ds = cursor.toISOString().slice(0, 10);
    if (logDates.has(ds)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0) {
      // today has no class, check yesterday
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function totalSpend(packages: Pkg[]): number {
  return packages.reduce((sum, p) => sum + p.totalCost, 0);
}

function avgCostPerClass(packages: Pkg[], logs: ClassLog[]): string {
  const classesLogged = logs.length;
  if (!classesLogged) return '—';
  const spend = totalSpend(packages);
  return formatPHP(spend / classesLogged);
}

export function HomeScreen({ packages, logs, onNavigate, onEditLog }: Props) {
  const streak = calcStreak(logs);
  const totalClasses = logs.length;
  const costPerClass = avgCostPerClass(packages, logs);
  const activePackages = packages.filter(p => p.remainingClasses > 0);
  const recentLogs = logs.slice(0, 5);

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div className="px-6 pt-14 pb-6" style={{ background: 'var(--primary)' }}>
        <p style={{ color: '#7A9E87', fontSize: 14, marginBottom: 4 }}>{greeting}</p>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', color: '#F7F5F2', fontSize: 28, lineHeight: 1.2, marginBottom: 20 }}>
          Your Wellness<br />Dashboard
        </h1>

        {/* Stats summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="min-w-0 rounded-2xl p-3.5" style={{ background: 'rgba(247,245,242,0.08)' }}>
            <p style={{ color: '#C4603A', fontSize: 20, fontWeight: 700, marginBottom: 2 }}>
              {streak === 0 ? '—' : `${streak} ${streak === 1 ? 'day' : 'days'}`}
            </p>
            <p style={{ color: '#7A9E87', fontSize: 12 }}>Current streak</p>
          </div>
          <div className="min-w-0 rounded-2xl p-3.5" style={{ background: 'rgba(247,245,242,0.08)' }}>
            <p style={{ color: '#4A7C59', fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{totalClasses}</p>
            <p style={{ color: '#7A9E87', fontSize: 12 }}>
              {totalClasses === 1 ? 'Class logged' : 'Classes logged'}
            </p>
          </div>
          <div className="col-span-2 min-w-0 rounded-2xl px-4 py-3 flex items-center justify-between gap-4" style={{ background: 'rgba(247,245,242,0.08)' }}>
            <div className="min-w-0">
              <p style={{ color: '#7A9E87', fontSize: 12 }}>Cost per class so far</p>
              <p style={{ color: '#7A9E87', fontSize: 11, marginTop: 2 }}>Total spent ÷ classes attended</p>
            </div>
            <p
              className="shrink-0 text-right"
              style={{ color: '#D4A843', fontSize: 'clamp(20px, 6vw, 26px)', fontWeight: 700, lineHeight: 1.1 }}
            >
              {costPerClass}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('log-class')}
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span style={{ fontWeight: 600 }}>Log Class</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('add-package')}
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: 'var(--primary)', color: '#F7F5F2' }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Package size={20} />
            </div>
            <span style={{ fontWeight: 600 }}>Add Package</span>
          </motion.button>
        </div>

        {/* Active packages */}
        {activePackages.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--foreground)' }}>Active Packages</h2>
              <button
                onClick={() => onNavigate('package-details')}
                style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}
              >
                See all
              </button>
            </div>
            <div className="space-y-3">
              {activePackages.slice(0, 3).map((pkg) => {
                const colors = ACTIVITY_COLORS[pkg.activity];
                const pct = pkg.totalClasses > 0 ? (pkg.remainingClasses / pkg.totalClasses) * 100 : 0;
                const cpc = pkg.totalCost > 0 && pkg.totalClasses > 0
                  ? `${formatPHP(pkg.totalCost / pkg.totalClasses)}/class`
                  : '';
                return (
                  <motion.button
                    key={pkg.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('package-details', pkg.id)}
                    className="w-full text-left rounded-2xl p-4"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.light }}>
                          <span style={{ fontSize: 20 }}>{ACTIVITY_ICONS[pkg.activity]}</span>
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--foreground)' }}>{pkg.name}</p>
                          <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{pkg.studio}{pkg.location ? ` · ${pkg.location}` : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p style={{ fontWeight: 700, fontSize: 18, color: colors.bg }}>{pkg.remainingClasses}</p>
                        <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>left</p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: colors.bg }} />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{pkg.remainingClasses} of {pkg.totalClasses} remaining</span>
                      {cpc && <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{cpc}</span>}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state for packages */}
        {packages.length === 0 && (
          <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--card)', border: '1px dashed var(--border)' }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>📦</p>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>No packages yet</p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: 14, marginBottom: 16 }}>Add your first studio package to start tracking</p>
            <button
              onClick={() => onNavigate('add-package')}
              className="px-5 py-2.5 rounded-xl"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 14, fontWeight: 500 }}
            >
              Add Package
            </button>
          </div>
        )}

        {/* Recent activity */}
        {recentLogs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--foreground)' }}>Recent Classes</h2>
              <button onClick={() => onNavigate('calendar')} style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}>
                View all
              </button>
            </div>
            <div className="space-y-2">
              {recentLogs.map(log => {
                const colors = ACTIVITY_COLORS[log.activity];
                const date = new Date(log.date);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: colors.light }}>
                      <span>{ACTIVITY_ICONS[log.activity]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontWeight: 500, fontSize: 14 }}>{log.activity}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{log.studio}</p>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--muted-foreground)', flexShrink: 0 }}>{dateStr}</span>
                    <button
                      type="button"
                      aria-label={`Edit ${log.activity} class from ${dateStr}`}
                      title="Edit class"
                      onClick={() => onEditLog(log.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:bg-secondary"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
