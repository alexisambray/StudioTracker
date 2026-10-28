import { useState } from 'react';
import { ChevronLeft, Save, Trash2 } from 'lucide-react';
import {
  ACTIVITY_COLORS,
  ACTIVITY_ICONS,
  type ActivityType,
  type ClassLog,
  type Package,
} from './types';

const activities: ActivityType[] = ['Pilates', 'Lagree', 'Yoga', 'Spin', 'Boxing'];

interface Props {
  log?: ClassLog;
  packages: Package[];
  onSave: (log: ClassLog) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export function EditClassScreen({ log, packages, onSave, onDelete, onBack }: Props) {
  const initialUsesHours = Boolean(log?.duration && log.duration >= 60);
  const [activity, setActivity] = useState<ActivityType>(log?.activity ?? 'Pilates');
  const [packageId, setPackageId] = useState(log?.packageId ?? '');
  const [studio, setStudio] = useState(log?.studio ?? '');
  const [location, setLocation] = useState(log?.location ?? '');
  const [instructor, setInstructor] = useState(log?.instructor ?? '');
  const [date, setDate] = useState(log?.date.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours'>(initialUsesHours ? 'hours' : 'minutes');
  const [duration, setDuration] = useState(
    log?.duration
      ? String(initialUsesHours ? Math.round((log.duration / 60) * 100) / 100 : log.duration)
      : '55',
  );
  const [notes, setNotes] = useState(log?.notes ?? '');

  if (!log) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center" style={{ background: 'var(--background)' }}>
        <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Class not found</p>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: 24 }}>This class may already have been deleted.</p>
        <button onClick={onBack} className="px-6 py-3 rounded-xl" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const colors = ACTIVITY_COLORS[activity];
  const matchingPackages = packages.filter(pkg =>
    pkg.activity === activity
    && (!pkg.archivedAt || pkg.id === log.packageId)
    && (pkg.remainingClasses > 0 || pkg.id === log.packageId),
  );
  const selectedPackage = packages.find(pkg => pkg.id === packageId);

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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const durationValue = parseFloat(duration);
    if (!instructor.trim() || !Number.isFinite(durationValue)) return;
    if (!selectedPackage && !studio.trim()) return;

    onSave({
      ...log,
      activity,
      packageId: selectedPackage?.id,
      studio: selectedPackage?.studio ?? studio.trim(),
      location: selectedPackage?.location ?? (location.trim() || undefined),
      instructor: instructor.trim(),
      date,
      duration: Math.round(durationValue * (durationUnit === 'hours' ? 60 : 1)),
      notes: notes.trim() || undefined,
    });
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: 'var(--background)', fontFamily: 'DM Sans, sans-serif' }}>
      <div className="px-6 pt-14 pb-6" style={{ background: colors.bg }}>
        <button onClick={onBack} className="flex items-center gap-1 mb-4" style={{ color: 'rgba(255,255,255,0.78)', fontSize: 15 }}>
          <ChevronLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.16)' }}>
            <span style={{ fontSize: 22 }}>{ACTIVITY_ICONS[activity]}</span>
          </div>
          <div>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', color: '#FFFFFF', fontSize: 28 }}>Edit Class</h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14 }}>Correct or update your class details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 pt-6 space-y-5">
        <div>
          <label style={labelStyle}>Activity</label>
          <select
            value={activity}
            onChange={event => {
              setActivity(event.target.value as ActivityType);
              setPackageId('');
            }}
            style={inputStyle}
          >
            {activities.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Package</label>
          <select value={packageId} onChange={event => setPackageId(event.target.value)} style={inputStyle}>
            <option value="">No package</option>
            {matchingPackages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} · {pkg.remainingClasses} left
                {pkg.archivedAt ? ' · Archived' : ''}
              </option>
            ))}
          </select>
        </div>

        {selectedPackage ? (
          <div className="p-4 rounded-2xl" style={{ background: colors.light }}>
            <p style={{ fontWeight: 600, color: colors.bg }}>{selectedPackage.studio}</p>
            {selectedPackage.location && (
              <p style={{ color: 'var(--muted-foreground)', fontSize: 13, marginTop: 2 }}>{selectedPackage.location}</p>
            )}
          </div>
        ) : (
          <>
            <div>
              <label style={labelStyle}>Studio Name</label>
              <input style={inputStyle} value={studio} onChange={event => setStudio(event.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Location / Branch (optional)</label>
              <input style={inputStyle} value={location} onChange={event => setLocation(event.target.value)} />
            </div>
          </>
        )}

        <div>
          <label style={labelStyle}>Instructor Name</label>
          <input
            style={inputStyle}
            placeholder="e.g. Coach Mia"
            value={instructor}
            onChange={event => setInstructor(event.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" style={inputStyle} value={date} onChange={event => setDate(event.target.value)} required />
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
                onChange={event => setDuration(event.target.value)}
                required
              />
              <select
                aria-label="Duration unit"
                value={durationUnit}
                onChange={event => changeDurationUnit(event.target.value as 'minutes' | 'hours')}
                className="rounded-xl px-2"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)', fontSize: 14 }}
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
            style={{ ...inputStyle, resize: 'none', height: 88 }}
            value={notes}
            onChange={event => setNotes(event.target.value)}
            placeholder="How was the class?"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
          style={{ background: colors.bg, color: colors.text, fontWeight: 600, fontSize: 16 }}
        >
          <Save size={18} />
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Delete this logged class? Its package credit will be restored.')) {
              onDelete(log.id);
            }
          }}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
          style={{ color: 'var(--destructive)', border: '1px solid color-mix(in srgb, var(--destructive) 25%, transparent)', fontWeight: 600 }}
        >
          <Trash2 size={17} />
          Delete Class
        </button>
      </form>
    </div>
  );
}
