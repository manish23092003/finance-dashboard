import { TrendingUp, TrendingDown, IndianRupee, FileText, Wand2 } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { formatCurrency } from '../lib/utils';
import MetricCard from '../components/MetricCard';
import TrendLineChart from '../components/charts/TrendLineChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import Spinner from '../components/ui/Spinner';

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <Spinner />;
  if (!data) return null;

  const chartData: any[] = [...data.monthlyTrends];
  
  if (chartData.length > 0) {
    const lastPoint = chartData[chartData.length - 1];
    chartData[chartData.length - 1] = {
      ...lastPoint,
      projectedIncome: lastPoint.income,
      projectedExpense: lastPoint.expense,
    };

    const [yearStr, monthStr] = lastPoint.month.split('-');
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    const nextMonth = `${year}-${month.toString().padStart(2, '0')}`;

    chartData.push({
      month: nextMonth,
      projectedIncome: data.projectedIncome,
      projectedExpense: data.projectedExpense,
    });
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Your financial overview at a glance</p>
      </div>

      {chartData.length > 0 && (
        <div className="mb-8 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Next Month Projection</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">(3-Month Moving Average)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl p-5 shadow-sm border border-emerald-100 dark:border-emerald-500/20">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Projected Income</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {formatCurrency(data.projectedIncome)}
              </p>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl p-5 shadow-sm border border-rose-100 dark:border-rose-500/20">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Projected Expense</p>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">
                {formatCurrency(data.projectedExpense)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-children">
        <MetricCard
          label="Total Income"
          value={formatCurrency(data.totalIncome)}
          icon={TrendingUp}
          variant="emerald"
        />
        <MetricCard
          label="Total Expense"
          value={formatCurrency(data.totalExpense)}
          icon={TrendingDown}
          variant="rose"
        />
        <MetricCard
          label="Net Balance"
          value={formatCurrency(data.netBalance)}
          icon={IndianRupee}
          variant="indigo"
        />
        <MetricCard
          label="Total Records"
          value={data.recordCount.toLocaleString()}
          icon={FileText}
          variant="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendLineChart data={chartData} />
        </div>
        <div>
          <CategoryPieChart data={data.topCategories} />
        </div>
      </div>
    </div>
  );
}
