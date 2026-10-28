export type ActivityType = 'Pilates' | 'Lagree' | 'Yoga' | 'Spin' | 'Boxing';

export const ACTIVITY_COLORS: Record<ActivityType, { bg: string; text: string; light: string; dot: string }> = {
  Pilates: { bg: '#4A7C59', text: '#FFFFFF', light: '#E8F2EC', dot: '#4A7C59' },
  Lagree: { bg: '#C4603A', text: '#FFFFFF', light: '#FAE9E3', dot: '#C4603A' },
  Yoga: { bg: '#8B5E9A', text: '#FFFFFF', light: '#F2EBF5', dot: '#8B5E9A' },
  Spin: { bg: '#D4A843', text: '#FFFFFF', light: '#FBF3DC', dot: '#D4A843' },
  Boxing: { bg: '#2D5FA6', text: '#FFFFFF', light: '#E4ECF8', dot: '#2D5FA6' },
};

export const ACTIVITY_ICONS: Record<ActivityType, string> = {
  Pilates: '🧘',
  Lagree: '💪',
  Yoga: '🌿',
  Spin: '🚴',
  Boxing: '🥊',
};

const PHP_CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPHP(value: number): string {
  return PHP_CURRENCY_FORMATTER.format(value);
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} min`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hourLabel = `${hours} ${hours === 1 ? 'hr' : 'hrs'}`;

  return minutes > 0 ? `${hourLabel} ${minutes} min` : hourLabel;
}

export interface Package {
  id: string;
  activity: ActivityType;
  name: string;
  totalClasses: number;
  remainingClasses: number;
  totalCost: number;
  purchaseDate: string;
  expiryDate?: string;
  studio: string;
  location?: string;
  archivedAt?: string;
}

export interface ClassLog {
  id: string;
  packageId?: string;
  activity: ActivityType;
  date: string;
  studio: string;
  location?: string;
  instructor?: string;
  notes?: string;
  duration?: number;
}

export type Screen =
  | 'onboarding'
  | 'home'
  | 'add-package'
  | 'log-class'
  | 'edit-class'
  | 'package-details'
  | 'calendar'
  | 'insights';
