"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
/**
 * Custom application error with HTTP status code.
 * Throw this in services/controllers for predictable error responses.
 */
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
/**
 * Centralized Error Handler Middleware.
 * Must be registered LAST in the Express middleware chain.
 *
 * - AppError → returns the specified status code and message
 * - Unknown Error → returns 500 with a generic message (no stack leak)
 *
 * Always returns the standard envelope: { success: false, error: "..." }
 */
const errorHandler = (err, _req, res, _next) => {
    // Log all errors in development
    if (process.env.NODE_ENV === 'development') {
        console.error('🔥 Error:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
        });
    }
    // Known operational error
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
        return;
    }
    // Prisma known errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaError = err;
        if (prismaError.code === 'P2002') {
            res.status(409).json({
                success: false,
                error: 'A record with this value already exists.',
            });
            return;
        }
        if (prismaError.code === 'P2025') {
            res.status(404).json({
                success: false,
                error: 'Record not found.',
            });
            return;
        }
    }
    // Unknown error — never leak internals
    res.status(500).json({
        success: false,
        error: 'An unexpected internal server error occurred.',
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map