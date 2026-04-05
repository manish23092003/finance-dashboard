import { Request, Response, NextFunction } from 'express';
/**
 * Dashboard Controller — returns aggregated financial metrics.
 */
/**
 * GET /api/dashboard
 * Get dashboard metrics (role-scoped: ADMIN sees all, others see own).
 */
export declare function getDashboardMetrics(req: Request, res: Response, next: NextFunction): Promise<void>;
