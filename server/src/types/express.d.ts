/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Augment Express Request to carry authenticated user payload
 * after JWT verification in auth middleware.
 */
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: 'ADMIN' | 'ANALYST' | 'VIEWER';
    };
  }
}
