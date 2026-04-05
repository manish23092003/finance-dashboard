import type { DashboardMetrics, Role } from '../types/dto';
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
export declare function getDashboardMetrics(userId: string, role: Role): Promise<DashboardMetrics>;
