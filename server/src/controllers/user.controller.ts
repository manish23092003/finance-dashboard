import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import type { Role } from '../types/dto';

/**
 * User Controller — admin-only user management.
 * All routes using this controller should have ADMIN RBAC middleware applied.
 */

/**
 * POST /api/admin/users
 * Create a new user.
 */
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/users
 * Get all users.
 */
export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/users/:id
 * Get a single user by ID.
 */
export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.getUserById(req.params.id as string);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/users/:id/role
 * Change a user's role.
 */
export async function changeRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.changeRole(
      req.params.id as string,
      req.body.role as Role,
      req.user!.id
    );
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/users/:id/status
 * Toggle a user's active status.
 */
export async function toggleStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.toggleStatus(
      req.params.id as string,
      req.body.isActive,
      req.user!.id
    );
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
