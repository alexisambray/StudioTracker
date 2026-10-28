import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { ACTIVITY_COLORS, ACTIVITY_ICONS, type ActivityType, type ClassLog, type Package } from './types';

interface Props {
  packages: Package[];
  onLog: (log: ClassLog) => void;
  onBack: () => void;
}

const activities: ActivityType[] = ['Pilates', 'Lagree', 'Yoga', 'Spin', 'Boxing'];

export function LogClassScreen({ packages, onLog, onBack }: Props) {
  const [step, setStep] = useState<'activity' | 'details'>('activity');
  const [activity, setActivity] = useState<ActivityType | null>(null);
  const [packageId, setPackageId] = useState('');
  const [studio, setStudio] = useState('');
  const [location, setLocation] = useState('');
  const [instructor, setInstructor] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('55');
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours'>('minutes');
  const [logged, setLogged] = useState(false);

  const activityPackages = packages.filter(p => p.activity === activity && p.remainingClasses > 0);

  function handleActivitySelect(a: ActivityType) {
    setActivity(a);
    const pkgs = packages.filter(p => p.activity === a && p.remainingClasses > 0);
    setPackageId(pkgs[0]?.id ?? '');
    setStudio('');
    setLocation('');
    setStep('details');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activity || !instructor.trim()) return;
    const pkg = packageId ? packages.find(p => p.id === packageId) : undefined;
    if (packageId && !pkg) return;
    if (!pkg && !studio.trim()) return;
    const durationValue = parseFloat(duration);
    const log: ClassLog = {
      id: crypto.randomUUID(),
      packageId: pkg?.id,
      activity,
      date,
      studio: pkg?.studio ?? studio.trim(),
      location: pkg?.location ?? (location.trim() || undefined),
      instructor: instructor.trim(),
      notes: notes || undefined,
      duration: Number.isFinite(durationValue)
        ? Math.round(durationValue * (durationUnit === 'hours' ? 60 : 1))
        : undefined,
    };
    onLog(log);
    setLogged(true);
  }

  function changeDurationUnit(nextUnit: 'minutes' | 'hours') {
    if (nextUnit === durationUnit) return;

    const currentValue = parseFloat(duration);
    if (Number.isFinite(currentValue)) {
      const converted = nextUnit === 'hours'
        ? Math.round((currentValue / 60) * 100) / 100
        : Math.round(currentValue * 60);
      setDuration(String(converted));
    }
    setDurationUnit(nextUnit);
  }

  const colors = activity ? ACTIVITY_COLORS[activity] : null;

  if (logged) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: 'var(--background)', fontFamily: 'DM Sans, sans-serif' }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
          style={{ background: colors?.bg }}
        >
          <span style={{ fontSize: 44 }}>{activity ? ACTIVITY_ICONS[activity] : '✓'}</span>
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ fontFamily: 'DM Serif Display, serif', fontSize: 30, textAlign: 'center', marginBottom: 8 }}
        >
          Class Logged!
        </motion.h2>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{ color: 'var(--muted-foreground)', textAlign: 'center', marginBottom: 32 }}
        >
          Great work showing up for your {activity} class.
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onBack}
          className="px-8 py-3.5 rounded-2xl"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontWeight: 600 }}
        >
          Back to Dashboard
        </motion.button>
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    background: 'var(--card)',
    border: '1px solid var(--border)',
    color: 'var(--foreground)',
    fontSize: 16,
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--muted-foreground)',
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)', fontFamily: 'DM Sans, sans-serif' }}>
      <div className="px-6 pt-14 pb-6" style={{ background: 'var(--primary)' }}>
        <button
          onClick={step === 'details' ? () => setStep('activity') : onBack}
          className="flex items-center gap-1 mb-4"
          style={{ color: '#7A9E87', fontSize: 15 }}
        >
          <ChevronLeft size={20} /> Back
        </button>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', color: '#F7F5F2', fontSize: 28 }}>Log a Class</h1>
        <p style={{ color: '#7A9E87', fontSize: 14, marginTop: 4 }}>
          {step === 'activity' ? 'Select your activity' : `${activity} — Fill in the details`}
        </p>
      </div>

      {step === 'activity' ? (
        <div className="px-6 pt-6">
          <div className="grid grid-cols-1 gap-3">
            {activities.map(a => {
              const c = ACTIVITY_COLORS[a];
              const pkgCount = packages.filter(p => p.activity === a && p.remainingClasses > 0).length;
              return (
                <motion.button
                  key={a}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleActivitySelect(a)}
                  className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                  style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: c.light }}>
                    <span style={{ fontSize: 28 }}>{ACTIVITY_ICONS[a]}</span>
                  </div>
                  <div className="flex-1">
                    <p style={{ fontWeight: 600, fontSize: 17, color: 'var(--foreground)' }}>{a}</p>
                    <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
                      {pkgCount > 0 ? `${pkgCount} active package${pkgCount > 1 ? 's' : ''}` : 'No active packages'}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full" style={{ background: c.bg }} />
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-6 pt-6 space-y-5">
          {/* Package selector */}
          {activityPackages.length > 0 ? (
            <div>
              <label style={labelStyle}>Package</label>
              <div className="space-y-2">
                {activityPackages.map(pkg => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setPackageId(pkg.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{
                      background: packageId === pkg.id ? colors?.light : 'var(--card)',
                      border: `1.5px solid ${packageId === pkg.id ? colors?.bg : 'var(--border)'}`,
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: colors?.light }}>
                      <span style={{ fontSize: 16 }}>{ACTIVITY_ICONS[activity!]}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p style={{ fontWeight: 500, fontSize: 14, color: 'var(--foreground)' }}>{pkg.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
                        {pkg.studio}{pkg.location ? ` · ${pkg.location}` : ''} · {pkg.remainingClasses} classes left
                      </p>
                    </div>
                    {packageId === pkg.id && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: colors?.bg }}>
                        <span style={{ color: '#fff', fontSize: 12 }}>✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--muted)', borderRadius: 12 }}>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>No active {activity} packages. This class will be logged without a package.</p>
              </div>
              <div>
                <label style={labelStyle}>Studio Name</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Studio Move"
                  value={studio}
                  onChange={e => setStudio(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Location / Branch (optional)</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. BGC, Makati"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label style={labelStyle}>Instructor Name</label>
            <input
              style={inputStyle}
              placeholder="e.g. Coach Mia"
              value={instructor}
              onChange={e => setInstructor(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" style={inputStyle} value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Duration</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={durationUnit === 'hours' ? '0.25' : '1'}
                  step={durationUnit === 'hours' ? '0.25' : '1'}
                  style={{ ...inputStyle, minWidth: 0 }}
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder={durationUnit === 'hours' ? '1' : '55'}
                  required
                />
                <select
                  aria-label="Duration unit"
                  value={durationUnit}
                  onChange={e => changeDurationUnit(e.target.value as 'minutes' | 'hours')}
                  className="rounded-xl px-2"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                >
                  <option value="minutes">min</option>
                  <option value="hours">hr(s)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Notes (optional)</label>
            <textarea
              style={{ ...inputStyle, resize: 'none', height: 80 }}
              placeholder="How was the class?"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl mt-2"
            style={{ background: colors?.bg, color: colors?.text, fontSize: 17, fontWeight: 600 }}
          >
            Log {activity} Class
          </button>
        </form>
      )}
    </div>
  );
}
