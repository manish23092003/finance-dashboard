import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { createUserSchema, changeRoleSchema, toggleStatusSchema } from '../validators/user.validator';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate);
router.use(authorizeRoles('ADMIN'));

/**
 * GET /api/admin/users
 * Get all users.
 */
router.get('/', userController.getAllUsers);

/**
 * POST /api/admin/users
 * Create a new user.
 */
router.post(
  '/',
  validate(createUserSchema),
  userController.createUser
);

/**
 * GET /api/admin/users/:id
 * Get a single user by ID.
 */
router.get('/:id', userController.getUserById);

/**
 * PATCH /api/admin/users/:id/role
 * Change a user's role.
 */
router.patch(
  '/:id/role',
  validate(changeRoleSchema),
  userController.changeRole
);

/**
 * PATCH /api/admin/users/:id/status
 * Toggle a user's active/inactive status.
 */
router.patch(
  '/:id/status',
  validate(toggleStatusSchema),
  userController.toggleStatus
);

export default router;
