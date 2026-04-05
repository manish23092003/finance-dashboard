import { Request, Response, NextFunction } from 'express';
/**
 * User Controller — admin-only user management.
 * All routes using this controller should have ADMIN RBAC middleware applied.
 */
/**
 * POST /api/admin/users
 * Create a new user.
 */
export declare function createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/admin/users
 * Get all users.
 */
export declare function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/admin/users/:id
 * Get a single user by ID.
 */
export declare function getUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * PATCH /api/admin/users/:id/role
 * Change a user's role.
 */
export declare function changeRole(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * PATCH /api/admin/users/:id/status
 * Toggle a user's active status.
 */
export declare function toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
