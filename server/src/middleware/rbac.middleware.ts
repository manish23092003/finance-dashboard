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
export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required before authorization check.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}.`,
      });
      return;
    }

    next();
  };
};
