import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';
import type { DashboardMetrics, Role } from '../types/dto';

// ─── Types for raw query results ────────────────────────────────────────────

interface MonthlyTrendRow {
  month: string;
  type: string;
  total: number;
}

// ─── Service Methods ────────────────────────────────────────────────────────

/**
 * Get aggregated dashboard metrics using Prisma aggregate & groupBy.
 * NO records are fetched into memory — all computation is done at the DB level.
 *
 * Metrics:
 *   1. Total Income
 *   2. Total Expense
 *   3. Net Balance (Income - Expense)
 *   4. Record Count
 *   5. Top 3 Spending Categories
 *   6. Month-over-Month Trends (last 12 months)
 *
 * Scope:
 *   - ADMIN: aggregates across ALL records
 *   - ANALYST/VIEWER: aggregates only their own records
 */
export async function getDashboardMetrics(
  userId: string,
  role: Role
): Promise<DashboardMetrics> {
  const where: Prisma.FinancialRecordWhereInput =
    role === 'ADMIN' ? {} : { userId };

  const [incomeAgg, expenseAgg, recordCount] = await Promise.all([
    prisma.financialRecord.aggregate({
      where: { ...where, type: 'INCOME' },
      _sum: { amount: true },
    }),
    prisma.financialRecord.aggregate({
      where: { ...where, type: 'EXPENSE' },
      _sum: { amount: true },
    }),
    prisma.financialRecord.count({ where }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount || 0);
  const totalExpense = Number(expenseAgg._sum.amount || 0);

  const netBalance = totalIncome - totalExpense;

  const topCategoriesRaw = await prisma.financialRecord.groupBy({
    by: ['category'],
    where: { ...where, type: 'EXPENSE' },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: 3,
  });

  const topCategories = topCategoriesRaw.map((c) => ({
    category: c.category,
    total: Number(c._sum.amount || 0),
  }));

  /**
   * SQLite lacks native date-truncation functions like date_trunc.
   * To achieve month-over-month aggregation, we must cast the epoch milliseconds 
   * to seconds and run a strftime unixepoch conversion natively during the query.
   */
  let monthlyTrendsRaw: MonthlyTrendRow[];

  if (role === 'ADMIN') {
    monthlyTrendsRaw = await prisma.$queryRaw<MonthlyTrendRow[]>`
      SELECT 
        strftime('%Y-%m', datetime(date / 1000, 'unixepoch')) as month,
        type,
        SUM(CAST(amount AS REAL)) as total
      FROM FinancialRecord
      GROUP BY month, type
      ORDER BY month ASC
    `;
  } else {
    monthlyTrendsRaw = await prisma.$queryRaw<MonthlyTrendRow[]>`
      SELECT 
        strftime('%Y-%m', datetime(date / 1000, 'unixepoch')) as month,
        type,
        SUM(CAST(amount AS REAL)) as total
      FROM FinancialRecord
      WHERE userId = ${userId}
      GROUP BY month, type
      ORDER BY month ASC
    `;
  }

  /**
   * Recharts requires a unified dataset object where X-axis metrics (income/expense) 
   * are siblings under the same month node. We pivot the flat SQL rows here to satisfy that requirement.
   */
  const trendMap = new Map<string, { income: number; expense: number }>();

  for (const row of monthlyTrendsRaw) {
    const existing = trendMap.get(row.month) || { income: 0, expense: 0 };
    if (row.type === 'INCOME') {
      existing.income = Number(row.total);
    } else {
      existing.expense = Number(row.total);
    }
    trendMap.set(row.month, existing);
  }

  const monthlyTrends = Array.from(trendMap.entries())
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  /**
   * Forecast Engine: 3-Month Simple Moving Average (SMA)
   * 
   * To prevent short-term volatility (like an irregular quarterly bonus) from destroying
   * our next-month forecast, we implement an unweighted 3-month SMA. By slicing the last 
   * 3 chronological periods and computing `Σ(amount) / n`, we smooth out outliers and 
   * provide a highly stable macroeconomic projection for the dashboard UI.
   */
  let projectedIncome = 0;
  let projectedExpense = 0;

  if (monthlyTrends.length > 0) {
    const monthsToConsider = monthlyTrends.slice(-3);
    const sumIncome = monthsToConsider.reduce((sum, m) => sum + m.income, 0);
    const sumExpense = monthsToConsider.reduce((sum, m) => sum + m.expense, 0);
    
    projectedIncome = sumIncome / monthsToConsider.length;
    projectedExpense = sumExpense / monthsToConsider.length;
  }

  return {
    totalIncome,
    totalExpense,
    netBalance,
    recordCount,
    topCategories,
    monthlyTrends,
    projectedIncome,
    projectedExpense,
  };
}
