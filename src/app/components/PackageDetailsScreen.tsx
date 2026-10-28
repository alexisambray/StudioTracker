import { useState } from 'react';
import { Archive, ChevronLeft, Pencil } from 'lucide-react';
import { motion } from 'motion/react';
import { ACTIVITY_COLORS, ACTIVITY_ICONS, formatDuration, formatPHP, type Package, type ClassLog } from './types';

interface Props {
  packages: Package[];
  logs: ClassLog[];
  selectedId?: string;
  onArchive: (id: string) => void;
  onEditLog: (id: string) => void;
  onBack: () => void;
  onLogClass: () => void;
}

export function PackageDetailsScreen({ packages, logs, selectedId, onArchive, onEditLog, onBack, onLogClass }: Props) {
  const [activeId, setActiveId] = useState<string | null>(selectedId || (packages[0]?.id ?? null));

  const pkg = packages.find(p => p.id === activeId) ?? packages[0];
  const pkgLogs = pkg ? logs.filter(l => l.packageId === pkg.id) : [];
  const colors = pkg ? ACTIVITY_COLORS[pkg.activity] : null;

  const cpc = pkg && pkg.totalClasses > 0
    ? (pkg.totalCost / pkg.totalClasses).toFixed(2)
    : null;

  const used = pkg ? pkg.totalClasses - pkg.remainingClasses : 0;
  const pct = pkg && pkg.totalClasses > 0 ? (pkg.remainingClasses / pkg.totalClasses) * 100 : 0;

  const daysLeft = pkg?.expiryDate
    ? Math.ceil((new Date(pkg.expiryDate).getTime() - Date.now()) / 86400000)
    : null;

  if (packages.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: 'var(--background)', fontFamily: 'DM Sans, sans-serif' }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>📦</p>
        <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No packages yet</p>
        <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', marginBottom: 24 }}>Add a package to start tracking your classes</p>
        <button onClick={onBack} className="px-6 py-3 rounded-xl" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontWeight: 600 }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div className="px-6 pt-14 pb-6" style={{ background: pkg ? colors?.bg : 'var(--primary)' }}>
        <button onClick={onBack} className="flex items-center gap-1 mb-4" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
          <ChevronLeft size={20} /> Back
        </button>
        {pkg && (
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 22 }}>{ACTIVITY_ICONS[pkg.activity]}</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{pkg.activity}</span>
              </div>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', color: '#FFFFFF', fontSize: 26, lineHeight: 1.2 }}>{pkg.name}</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 }}>{pkg.studio}{pkg.location ? ` · ${pkg.location}` : ''}</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Archive this package? Its class history and spending data will be kept.')) {
                  onArchive(pkg.id);
                  onBack();
                }
              }}
              aria-label="Archive package"
              title="Archive package"
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <Archive size={18} color="#fff" />
            </button>
          </div>
        )}
      </div>

      {/* Package tabs */}
      {packages.length > 1 && (
        <div className="px-6 pt-4 pb-2 flex gap-2 overflow-x-auto">
          {packages.map(p => {
            const c = ACTIVITY_COLORS[p.activity];
            return (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: activeId === p.id ? c.bg : 'var(--card)',
                  color: activeId === p.id ? '#fff' : 'var(--foreground)',
                  border: `1px solid ${activeId === p.id ? c.bg : 'var(--border)'}`,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <span>{ACTIVITY_ICONS[p.activity]}</span>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {pkg && (
        <div className="px-6 pt-4 space-y-4">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: colors?.bg }}>{pkg.remainingClasses}</p>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Classes remaining</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--foreground)' }}>{used}</p>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Classes used</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--foreground)' }}>{cpc ? formatPHP(Number(cpc)) : '—'}</p>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Per class</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: daysLeft != null && daysLeft < 7 ? '#d4183d' : 'var(--foreground)' }}>
                {daysLeft != null ? `${daysLeft}d` : '—'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Days until expiry</p>
            </div>
          </div>

          {/* Progress */}
          <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between mb-2">
              <span style={{ fontSize: 14, fontWeight: 500 }}>Package usage</span>
              <span style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>{used}/{pkg.totalClasses} classes</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: colors?.bg }}
                initial={{ width: 0 }}
                animate={{ width: `${100 - pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Purchased {new Date(pkg.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{formatPHP(pkg.totalCost)} total</span>
            </div>
          </div>

          {/* Log a class CTA */}
          {pkg.remainingClasses > 0 && (
            <button
              onClick={onLogClass}
              className="w-full py-4 rounded-2xl"
              style={{ background: colors?.bg, color: colors?.text, fontWeight: 600, fontSize: 16 }}
            >
              Log a {pkg.activity} Class
            </button>
          )}

          {/* Class history */}
          {pkgLogs.length > 0 && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: 'var(--foreground)' }}>Class History</h3>
              <div className="space-y-2">
                {pkgLogs.map(log => (
                  <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: colors?.light }}>
                      <span>{ACTIVITY_ICONS[log.activity]}</span>
                    </div>
                    <div className="flex-1">
                      <p style={{ fontWeight: 500, fontSize: 14 }}>{log.activity}</p>
                      {log.instructor && <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>with {log.instructor}</p>}
                      {log.notes && <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{log.notes}</p>}
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
                        {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      {log.duration && <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{formatDuration(log.duration)}</p>}
                    </div>
                    <button
                      type="button"
                      aria-label={`Edit ${log.activity} class`}
                      title="Edit class"
                      onClick={() => onEditLog(log.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:bg-secondary"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
