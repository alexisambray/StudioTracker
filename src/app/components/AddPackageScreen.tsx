import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { ACTIVITY_COLORS, ACTIVITY_ICONS, formatPHP, type ActivityType, type Package } from './types';

const activities: ActivityType[] = ['Pilates', 'Lagree', 'Yoga', 'Spin', 'Boxing'];

interface Props {
  onAdd: (pkg: Package) => void;
  onBack: () => void;
}

export function AddPackageScreen({ onAdd, onBack }: Props) {
  const [activity, setActivity] = useState<ActivityType>('Pilates');
  const [studio, setStudio] = useState('');
  const [location, setLocation] = useState('');
  const [totalClasses, setTotalClasses] = useState('10');
  const [totalCost, setTotalCost] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState('');

  const colors = ACTIVITY_COLORS[activity];
  const cpc = totalCost && totalClasses
    ? formatPHP(parseFloat(totalCost) / parseInt(totalClasses))
    : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!studio || !location || !totalClasses || !totalCost) return;
    const classCount = parseInt(totalClasses);
    const pkg: Package = {
      id: crypto.randomUUID(),
      activity,
      name: `${activity} ${classCount}-Class Pack`,
      studio,
      location,
      totalClasses: classCount,
      remainingClasses: classCount,
      totalCost: parseFloat(totalCost),
      purchaseDate,
      expiryDate: expiryDate || undefined,
    };
    onAdd(pkg);
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
      {/* Header */}
      <div className="px-6 pt-14 pb-6" style={{ background: 'var(--primary)' }}>
        <button onClick={onBack} className="flex items-center gap-1 mb-4" style={{ color: '#7A9E87', fontSize: 15 }}>
          <ChevronLeft size={20} /> Back
        </button>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', color: '#F7F5F2', fontSize: 28 }}>Add Package</h1>
        <p style={{ color: '#7A9E87', fontSize: 14, marginTop: 4 }}>Track a new studio package</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 pt-6 space-y-5">
        {/* Activity selector */}
        <div>
          <label style={labelStyle}>Activity</label>
          <div className="flex gap-2 flex-wrap">
            {activities.map(a => {
              const c = ACTIVITY_COLORS[a];
              const selected = a === activity;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setActivity(a)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
                  style={{
                    background: selected ? c.bg : 'var(--card)',
                    color: selected ? c.text : 'var(--foreground)',
                    border: `1.5px solid ${selected ? c.bg : 'var(--border)'}`,
                    fontWeight: selected ? 600 : 400,
                    fontSize: 14,
                  }}
                >
                  <span>{ACTIVITY_ICONS[a]}</span>
                  {a}
                </button>
              );
            })}
          </div>
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
          <label style={labelStyle}>Location / Branch</label>
          <input
            style={inputStyle}
            placeholder="e.g. BGC, Makati"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Total Classes</label>
            <input
              type="number"
              min="1"
              style={inputStyle}
              value={totalClasses}
              onChange={e => setTotalClasses(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Total Cost (PHP)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              style={inputStyle}
              placeholder="0.00"
              value={totalCost}
              onChange={e => setTotalCost(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Cost per class preview */}
        {cpc && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: colors.light }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.bg }}>
              <span style={{ color: '#fff', fontWeight: 700 }}>₱</span>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: colors.bg }}>{cpc}<span style={{ fontSize: 13, fontWeight: 400 }}> per class</span></p>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Based on {totalClasses} classes at {formatPHP(parseFloat(totalCost))}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Purchase Date</label>
            <input
              type="date"
              style={inputStyle}
              value={purchaseDate}
              onChange={e => setPurchaseDate(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Expiry Date</label>
            <input
              type="date"
              style={inputStyle}
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl mt-4"
          style={{ background: colors.bg, color: colors.text, fontSize: 17, fontWeight: 600 }}
        >
          Add {activity} Package
        </button>
      </form>
    </div>
  );
}
