import { Router } from 'express';
import * as recordController from '../controllers/record.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createRecordSchema,
  updateRecordSchema,
  recordQuerySchema,
} from '../validators/record.validator';

const router = Router();

// All record routes require authentication
router.use(authenticate);

/**
 * GET /api/records
 * Get paginated records with optional filters.
 * All authenticated roles can access (scoped by role in service).
 */
router.get(
  '/',
  validate(recordQuerySchema, 'query'),
  recordController.getAll
);

/**
 * GET /api/records/categories
 * Get distinct categories for filter dropdowns.
 * Must be defined BEFORE /:id to avoid route conflict.
 */
router.get(
  '/categories',
  recordController.getCategories
);

/**
 * GET /api/records/export
 * Export all matching records as a downloadable CSV file.
 * Must be defined BEFORE /:id to avoid route conflict.
 */
router.get(
  '/export',
  recordController.exportCSV
);

/**
 * GET /api/records/:id
 * Get a single record by ID.
 * All authenticated roles can access (ownership check in service).
 */
router.get(
  '/:id',
  recordController.getById
);

/**
 * POST /api/records
 * Create a new financial record.
 * ADMIN and ANALYST only (VIEWER cannot create).
 */
router.post(
  '/',
  authorizeRoles('ADMIN', 'ANALYST'),
  validate(createRecordSchema),
  recordController.create
);

/**
 * PUT /api/records/:id
 * Update an existing financial record.
 * ADMIN and ANALYST only (ANALYST has ownership check in service).
 */
router.put(
  '/:id',
  authorizeRoles('ADMIN', 'ANALYST'),
  validate(updateRecordSchema),
  recordController.update
);

/**
 * DELETE /api/records/:id
 * Delete a financial record.
 * ADMIN only.
 */
router.delete(
  '/:id',
  authorizeRoles('ADMIN'),
  recordController.remove
);

export default router;
