import { useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { ACTIVITY_COLORS, ACTIVITY_ICONS, formatDuration, type ClassLog, type ActivityType } from './types';

interface Props {
  logs: ClassLog[];
  onBack: () => void;
  onEditLog: (id: string) => void;
  onClearLogs: () => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarScreen({ logs, onBack, onEditLog, onClearLogs }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const logsByDate = logs.reduce<Record<string, ClassLog[]>>((acc, log) => {
    const d = log.date.slice(0, 10);
    if (!acc[d]) acc[d] = [];
    acc[d].push(log);
    return acc;
  }, {});

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const selectedLogs = selectedDate ? (logsByDate[selectedDate] ?? []) : [];

  const totalThisMonth = Object.entries(logsByDate).reduce((sum, [date, logs]) => {
    const d = new Date(date);
    if (d.getFullYear() === year && d.getMonth() === month) return sum + logs.length;
    return sum;
  }, 0);

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)', fontFamily: 'DM Sans, sans-serif' }}>
      <div className="px-6 pt-14 pb-4" style={{ background: 'var(--primary)' }}>
        <button onClick={onBack} className="flex items-center gap-1 mb-4" style={{ color: '#7A9E87', fontSize: 15 }}>
          <ChevronLeft size={20} /> Back
        </button>
        <div className="flex items-center justify-between">
          <h1 style={{ fontFamily: 'DM Serif Display, serif', color: '#F7F5F2', fontSize: 28 }}>History</h1>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <ChevronLeft size={18} color="#F7F5F2" />
            </button>
            <span style={{ color: '#F7F5F2', fontSize: 15, fontWeight: 500, minWidth: 120, textAlign: 'center' }}>
              {MONTHS[month]} {year}
            </span>
            <button onClick={nextMonth} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <ChevronRight size={18} color="#F7F5F2" />
            </button>
          </div>
        </div>
        <p style={{ color: '#7A9E87', fontSize: 14, marginTop: 8 }}>
          {totalThisMonth} {totalThisMonth === 1 ? 'class' : 'classes'} this month
        </p>
      </div>

      <div className="px-6 pt-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', paddingBottom: 6 }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayLogs = logsByDate[dateStr] ?? [];
            const isToday = dateStr === today.toISOString().slice(0, 10);
            const isSelected = dateStr === selectedDate;
            const hasLogs = dayLogs.length > 0;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className="flex flex-col items-center justify-start pt-1 pb-1 rounded-xl transition-all"
                style={{
                  minHeight: 52,
                  background: isSelected ? 'var(--primary)' : isToday ? 'var(--secondary)' : 'transparent',
                  border: isToday && !isSelected ? '1.5px solid var(--primary)' : '1.5px solid transparent',
                }}
              >
                <span style={{
                  fontSize: 14,
                  fontWeight: isToday ? 700 : 400,
                  color: isSelected ? '#F7F5F2' : isToday ? 'var(--primary)' : 'var(--foreground)',
                  marginBottom: 2,
                }}>
                  {day}
                </span>
                {hasLogs && (
                  <div className="flex flex-wrap justify-center gap-0.5 px-1">
                    {dayLogs.slice(0, 3).map((log, idx) => (
                      <div
                        key={idx}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isSelected ? 'rgba(255,255,255,0.7)' : ACTIVITY_COLORS[log.activity].bg }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day detail */}
        {selectedDate && selectedLogs.length > 0 && (
          <div className="mt-6">
            <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 10, color: 'var(--foreground)' }}>
              {new Date(selectedDate + 'T12:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <div className="space-y-2">
              {selectedLogs.map(log => {
                const colors = ACTIVITY_COLORS[log.activity];
                return (
                  <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.light }}>
                      <span style={{ fontSize: 20 }}>{ACTIVITY_ICONS[log.activity]}</span>
                    </div>
                    <div className="flex-1">
                      <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--foreground)' }}>{log.activity}</p>
                      <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
                        {log.studio}{log.location ? ` · ${log.location}` : ''}{log.duration ? ` · ${formatDuration(log.duration)}` : ''}
                      </p>
                      {log.instructor && <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>with {log.instructor}</p>}
                    </div>
                    {log.notes && <p style={{ fontSize: 12, color: 'var(--muted-foreground)', maxWidth: 100, textAlign: 'right' }}>{log.notes}</p>}
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
                );
              })}
            </div>
          </div>
        )}

        {selectedDate && selectedLogs.length === 0 && (
          <div className="mt-6 p-4 rounded-2xl text-center" style={{ background: 'var(--muted)' }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>No classes on this day</p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Activity Legend</p>
          <div className="flex flex-wrap gap-3">
            {(['Pilates', 'Lagree', 'Yoga', 'Spin', 'Boxing'] as ActivityType[]).map(a => (
              <div key={a} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: ACTIVITY_COLORS[a].bg }} />
                <span style={{ fontSize: 13, color: 'var(--foreground)' }}>{a}</span>
              </div>
            ))}
          </div>
        </div>

        {logs.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear all class history? Package credits used by these classes will be restored.')) {
                onClearLogs();
                setSelectedDate(null);
              }
            }}
            className="mt-4 w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-red-50"
            style={{ color: 'var(--destructive)', border: '1px solid color-mix(in srgb, var(--destructive) 25%, transparent)', fontSize: 14, fontWeight: 600 }}
          >
            <Trash2 size={16} />
            Clear all class history
          </button>
        )}
      </div>
    </div>
  );
}
