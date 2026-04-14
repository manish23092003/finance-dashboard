import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { formatCurrency } from '../../lib/utils';
import { useThemeStore } from '../../context/themeStore';

const COLORS = ['#4F46E5', '#7C3AED', '#0EA5E9', '#10B981', '#F59E0B'];

interface Props {
  data: { category: string; total: number }[];
}

export default function CategoryPieChart({ data }: Props) {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-full">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-4 sm:mb-6">Top Spending Categories</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={4}
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#fff',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              borderRadius: '12px',
              color: isDark ? '#fff' : '#000',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
            }}
          />
          <Legend
            iconType="circle"
            formatter={(value: string) => (
              <span className={isDark ? "text-sm text-slate-300" : "text-sm text-slate-600"}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
