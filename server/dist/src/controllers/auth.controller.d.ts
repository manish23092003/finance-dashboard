import { Request, Response, NextFunction } from 'express';
/**
 * Auth Controller — thin layer between HTTP and business logic.
 * Parses request data, delegates to the auth service, and formats responses.
 */
/**
 * POST /api/auth/register
 * Register a new user (admin-only, enforced by RBAC middleware on route).
 */
export declare function register(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * POST /api/auth/login
 * Authenticate a user and return a JWT.
 */
export declare function login(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/auth/me
 * Get the authenticated user's profile.
 */
export declare function getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
