import { Request, Response, NextFunction } from 'express';
/**
 * Record Controller — thin HTTP adapter for record service.
 * Extracts authenticated user context from req.user and query/body data,
 * then delegates to the service layer.
 */
/**
 * GET /api/records
 * Get paginated records with optional filters.
 */
export declare function getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/records/categories
 * Get distinct categories for filter dropdowns.
 */
export declare function getCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/records/:id
 * Get a single record by ID.
 */
export declare function getById(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * POST /api/records
 * Create a new financial record.
 */
export declare function create(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * PUT /api/records/:id
 * Update an existing financial record.
 */
export declare function update(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * DELETE /api/records/:id
 * Delete a financial record (admin only, enforced by RBAC middleware).
 */
export declare function remove(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * GET /api/records/export
 * Export all matching records as a CSV file.
 * Respects RBAC (ADMIN gets all, others get own) and query filters.
 */
export declare function exportCSV(req: Request, res: Response, next: NextFunction): Promise<void>;
