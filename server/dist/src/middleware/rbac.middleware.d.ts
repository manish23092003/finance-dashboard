import { Request, Response, NextFunction } from 'express';
import type { Role } from '../types/dto';
/**
 * Role-Based Access Control Middleware.
 * Returns a middleware that checks if the authenticated user's role
 * is included in the allowed roles list. Returns 403 if not.
 *
 * Must be used AFTER `authenticate` middleware.
 *
 * @example
 *   router.delete('/:id', authenticate, authorizeRoles('ADMIN'), controller.delete);
 */
export declare const authorizeRoles: (...allowedRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => void;
