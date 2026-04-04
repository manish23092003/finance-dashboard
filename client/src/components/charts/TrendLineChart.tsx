import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Info } from 'lucide-react';
import { formatCurrency, compactFormatCurrency } from '../../lib/utils';
import { useThemeStore } from '../../context/themeStore';

interface Props {
  data: { 
    month: string; 
    income?: number; 
    expense?: number; 
    projectedIncome?: number; 
    projectedExpense?: number 
  }[];
}

export default function TrendLineChart({ data }: Props) {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Trends</h3>
        <div className="group relative">
          <Info className="w-4 h-4 text-slate-400 cursor-help" />
          <div className="absolute left-1/2 -top-2 -translate-y-full -translate-x-1/2 w-48 p-2 bg-slate-800 text-slate-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
            Forecasts are plotted based on a 3-month moving average of historical data.
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#f1f5f9'} />
          <XAxis
            dataKey="month"
            stroke={isDark ? '#94a3b8' : '#94a3b8'}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={isDark ? '#94a3b8' : '#94a3b8'}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => compactFormatCurrency(v)}
          />
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
          <Legend iconType="circle" wrapperStyle={{ color: isDark ? '#cbd5e1' : '#64748b' }} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#059669"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#059669' }}
            activeDot={{ r: 6 }}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#dc2626"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#dc2626' }}
            activeDot={{ r: 6 }}
            name="Expense"
          />
          {/* 
            Recharts dual-line workaround: 
            By mapping actual data to `income` and projected data to `projectedIncome`, 
            we render overlapping <Line /> components. The projected lines use `strokeDasharray="5 5"` 
            for a dotted visual distinction, connecting seamlessly to the final historical data point 
            injected via the parent component.
          */}
          <Line
            type="monotone"
            dataKey="projectedIncome"
            stroke="#059669"
            strokeWidth={2.5}
            strokeDasharray="5 5"
            dot={{ r: 4, fill: '#059669' }}
            activeDot={{ r: 6 }}
            name="Proj. Income"
          />
          <Line
            type="monotone"
            dataKey="projectedExpense"
            stroke="#dc2626"
            strokeWidth={2.5}
            strokeDasharray="5 5"
            dot={{ r: 4, fill: '#dc2626' }}
            activeDot={{ r: 6 }}
            name="Proj. Expense"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
