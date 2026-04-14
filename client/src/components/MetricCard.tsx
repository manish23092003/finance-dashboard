import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

type ColorVariant = 'emerald' | 'rose' | 'indigo' | 'violet';

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  variant: ColorVariant;
}

const colors: Record<ColorVariant, { bg: string; icon: string }> = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'text-emerald-600 dark:text-emerald-400' },
  rose:    { bg: 'bg-rose-50 dark:bg-rose-500/10',    icon: 'text-rose-600 dark:text-rose-400' },
  indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-500/10',  icon: 'text-indigo-600 dark:text-indigo-400' },
  violet:  { bg: 'bg-violet-50 dark:bg-violet-500/10',  icon: 'text-violet-600 dark:text-violet-400' },
};

export default function MetricCard({ label, value, icon: Icon, variant }: MetricCardProps) {
  const c = colors[variant];
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800',
        'hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group'
      )}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={cn('p-2 sm:p-3 rounded-xl', c.bg)}>
          <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', c.icon)} />
        </div>
      </div>
      <p className="text-xs sm:text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">{value}</p>
    </div>
  );
}
