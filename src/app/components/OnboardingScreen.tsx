import { motion } from 'motion/react';
import { ACTIVITY_COLORS, ACTIVITY_ICONS, type ActivityType } from './types';

const activities: ActivityType[] = ['Pilates', 'Lagree', 'Yoga', 'Spin', 'Boxing'];

interface Props {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: Props) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--primary)', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Top decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10" style={{ background: 'var(--accent)' }} />
        <div className="absolute top-1/3 -left-24 w-64 h-64 rounded-full opacity-5" style={{ background: '#4A7C59' }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-20 pb-8 relative z-10">
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8"
          style={{ background: 'var(--accent)' }}
        >
          <span style={{ fontSize: 36 }}>✦</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          style={{ fontFamily: 'DM Serif Display, serif', color: '#F7F5F2', fontSize: 40, textAlign: 'center', lineHeight: 1.15, marginBottom: 16 }}
        >
          Your wellness,<br />tracked beautifully.
        </motion.h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          style={{ color: '#7A9E87', textAlign: 'center', fontSize: 17, lineHeight: 1.6, maxWidth: 300 }}
        >
          Track your studio packages, attendance streaks, and the real cost per class across all your activities.
        </motion.p>

        {/* Activity pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mt-10"
        >
          {activities.map((a, i) => (
            <motion.div
              key={a}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: 'rgba(247, 245, 242, 0.08)', border: '1px solid rgba(247,245,242,0.12)', color: '#F7F5F2' }}
            >
              <span>{ACTIVITY_ICONS[a]}</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{a}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature list */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 w-full max-w-sm space-y-3"
        >
          {[
            { icon: '📦', text: 'Track packages & remaining classes' },
            { icon: '🔥', text: 'Build attendance streaks' },
            { icon: '💰', text: 'See your real cost per class' },
            { icon: '📅', text: 'Calendar history & insights' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(247,245,242,0.06)' }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ color: '#D4CFC8', fontSize: 15 }}>{text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="px-6 pb-12"
      >
        <button
          onClick={onComplete}
          className="w-full py-4 rounded-2xl transition-all active:scale-98"
          style={{ background: 'var(--accent)', color: '#FFFFFF', fontSize: 17, fontWeight: 600, letterSpacing: 0.2 }}
        >
          Get Started
        </button>
        <p style={{ color: '#7A9E87', textAlign: 'center', fontSize: 13, marginTop: 14 }}>
          No account needed · All data stays on your device
        </p>
      </motion.div>
    </div>
  );
}
