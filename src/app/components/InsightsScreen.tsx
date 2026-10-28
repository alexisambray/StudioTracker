import { ChevronLeft } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { ACTIVITY_COLORS, formatPHP, type Package, type ClassLog, type ActivityType } from './types';

interface Props {
  packages: Package[];
  logs: ClassLog[];
  onBack: () => void;
}

const activities: ActivityType[] = ['Pilates', 'Lagree', 'Yoga', 'Spin', 'Boxing'];

export function InsightsScreen({ packages, logs, onBack }: Props) {
  // Classes by activity
  const byActivity = activities.map(a => ({
    name: a,
    count: logs.filter(l => l.activity === a).length,
    color: ACTIVITY_COLORS[a].bg,
  })).filter(d => d.count > 0);

  // Monthly trend (last 6 months)
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const count = logs.filter(l => {
      const ld = new Date(l.date);
      return ld.getFullYear() === d.getFullYear() && ld.getMonth() === d.getMonth();
    }).length;
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      classes: count,
    };
  });

  // Cost per class by activity
  const cpcData = activities.map(a => {
    const actPkgs = packages.filter(p => p.activity === a);
    const actLogs = logs.filter(l => l.activity === a);
    if (!actPkgs.length || !actLogs.length) return null;
    const totalCost = actPkgs.reduce((s, p) => s + p.totalCost, 0);
    return {
      name: a,
      cpc: parseFloat((totalCost / actLogs.length).toFixed(2)),
      color: ACTIVITY_COLORS[a].bg,
    };
  }).filter(Boolean) as { name: string; cpc: number; color: string }[];

  // Totals
  const totalInvested = packages.reduce((s, p) => s + p.totalCost, 0);
  const avgCpc = logs.length > 0 ? (totalInvested / logs.length).toFixed(2) : null;
  const mostActive = byActivity.sort((a, b) => b.count - a.count)[0];

  // Streak data
  const longestStreak = (() => {
    if (!logs.length) return 0;
    const dates = [...new Set(logs.map(l => l.date.slice(0, 10)))].sort();
    let max = 1, cur = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / 86400000;
      if (diff === 1) { cur++; max = Math.max(max, cur); }
      else cur = 1;
    }
    return max;
  })();

  const hasData = logs.length > 0;

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)', fontFamily: 'DM Sans, sans-serif' }}>
      <div className="px-6 pt-14 pb-6" style={{ background: 'var(--primary)' }}>
        <button onClick={onBack} className="flex items-center gap-1 mb-4" style={{ color: '#7A9E87', fontSize: 15 }}>
          <ChevronLeft size={20} /> Back
        </button>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', color: '#F7F5F2', fontSize: 28 }}>Insights</h1>
        <p style={{ color: '#7A9E87', fontSize: 14, marginTop: 4 }}>Your wellness at a glance</p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center px-8 pt-24">
          <p style={{ fontSize: 48, marginBottom: 16 }}>📊</p>
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>No data yet</p>
          <p style={{ color: 'var(--muted-foreground)', textAlign: 'center' }}>Log some classes to see your insights</p>
        </div>
      ) : (
        <div className="px-6 pt-5 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 30, fontWeight: 700, color: 'var(--accent)' }}>{logs.length}</p>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Total classes</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 30, fontWeight: 700, color: '#4A7C59' }}>{formatPHP(totalInvested)}</p>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Total invested</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 30, fontWeight: 700, color: '#D4A843' }}>{avgCpc ? formatPHP(Number(avgCpc)) : '—'}</p>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Avg per class</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 30, fontWeight: 700, color: '#2D5FA6' }}>{longestStreak}d</p>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Longest streak</p>
            </div>
          </div>

          {/* Favorite activity */}
          {mostActive && (
            <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: ACTIVITY_COLORS[mostActive.name as ActivityType].light }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: ACTIVITY_COLORS[mostActive.name as ActivityType].bg }}>
                <span style={{ fontSize: 28 }}>⭐</span>
              </div>
              <div>
                <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 2 }}>Most active discipline</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: ACTIVITY_COLORS[mostActive.name as ActivityType].bg }}>{mostActive.name}</p>
                <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{mostActive.count} classes logged</p>
              </div>
            </div>
          )}

          {/* Monthly trend */}
          <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Monthly Attendance</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13 }} />
                <Line type="monotone" dataKey="classes" stroke="#1A2E22" strokeWidth={2.5} dot={{ fill: '#1A2E22', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Classes by activity */}
          {byActivity.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Classes by Activity</p>
              <div className="flex gap-4 items-center">
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie data={byActivity} dataKey="count" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3}>
                      {byActivity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {byActivity.map(d => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        <span style={{ fontSize: 13, color: 'var(--foreground)' }}>{d.name}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cost per class by activity */}
          {cpcData.length > 1 && (
            <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Cost per Class</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={cpcData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${v}`} />
                  <Tooltip
                    formatter={(v) => [formatPHP(Number(v)), 'Per class']}
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13 }}
                  />
                  <Bar dataKey="cpc" radius={[6, 6, 0, 0]}>
                    {cpcData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
