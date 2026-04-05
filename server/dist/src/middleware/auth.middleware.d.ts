import { Request, Response, NextFunction } from 'express';
/**
 * JWT Authentication Middleware.
 * Verifies the Bearer token from the Authorization header and attaches
 * the decoded user payload to `req.user`.
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
