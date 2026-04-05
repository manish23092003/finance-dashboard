import { Request, Response, NextFunction } from 'express';
/**
 * Custom application error with HTTP status code.
 * Throw this in services/controllers for predictable error responses.
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
/**
 * Centralized Error Handler Middleware.
 * Must be registered LAST in the Express middleware chain.
 *
 * - AppError → returns the specified status code and message
 * - Unknown Error → returns 500 with a generic message (no stack leak)
 *
 * Always returns the standard envelope: { success: false, error: "..." }
 */
export declare const errorHandler: (err: Error, _req: Request, res: Response, _next: NextFunction) => void;
