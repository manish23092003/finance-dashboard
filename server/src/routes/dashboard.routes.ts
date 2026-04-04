import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/dashboard
 * Get aggregated dashboard metrics.
 * All authenticated users can access (scoped by role in service).
 */
router.get(
  '/',
  authenticate,
  dashboardController.getDashboardMetrics
);

export default router;
