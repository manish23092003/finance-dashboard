import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';

/**
 * Dashboard Controller — returns aggregated financial metrics.
 */

/**
 * GET /api/dashboard
 * Get dashboard metrics (role-scoped: ADMIN sees all, others see own).
 */
export async function getDashboardMetrics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const metrics = await dashboardService.getDashboardMetrics(
      req.user!.id,
      req.user!.role
    );
    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
}
