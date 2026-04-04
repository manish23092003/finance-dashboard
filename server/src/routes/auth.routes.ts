import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user. Only ADMINs can create new accounts.
 */
router.post(
  '/register',
  authenticate,
  authorizeRoles('ADMIN'),
  validate(registerSchema),
  authController.register
);

/**
 * POST /api/auth/login
 * Authenticate and receive a JWT.
 * Public endpoint — no auth required.
 */
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

/**
 * GET /api/auth/me
 * Get the current authenticated user's profile.
 */
router.get(
  '/me',
  authenticate,
  authController.getProfile
);

export default router;
