import { Request, Response, NextFunction } from 'express';
import * as recordService from '../services/record.service';
import { toCSV } from '../utils/csv.util';
import type { Role } from '../types/dto';

/**
 * Record Controller — thin HTTP adapter for record service.
 * Extracts authenticated user context from req.user and query/body data,
 * then delegates to the service layer.
 */

/**
 * GET /api/records
 * Get paginated records with optional filters.
 */
export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await recordService.getAll(
      req.query as unknown as { page: number; limit: number; dateFrom?: string; dateTo?: string; category?: string; type?: 'INCOME' | 'EXPENSE' },
      req.user!.id,
      req.user!.role
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/records/categories
 * Get distinct categories for filter dropdowns.
 */
export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await recordService.getCategories(
      req.user!.id,
      req.user!.role
    );
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/records/:id
 * Get a single record by ID.
 */
export async function getById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const record = await recordService.getById(
      req.params.id,
      req.user!.id,
      req.user!.role
    );
    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/records
 * Create a new financial record.
 */
export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const record = await recordService.create(req.body, req.user!.id);
    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/records/:id
 * Update an existing financial record.
 */
export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const record = await recordService.update(
      req.params.id,
      req.body,
      req.user!.id,
      req.user!.role
    );
    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/records/:id
 * Delete a financial record (admin only, enforced by RBAC middleware).
 */
export async function remove(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await recordService.remove(req.params.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/records/export
 * Export all matching records as a CSV file.
 * Respects RBAC (ADMIN gets all, others get own) and query filters.
 */
export async function exportCSV(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const records = await recordService.getExportData(
      req.query as unknown as { page: number; limit: number; dateFrom?: string; dateTo?: string; category?: string; type?: 'INCOME' | 'EXPENSE' },
      req.user!.id,
      req.user!.role
    );

    const csv = toCSV(records, [
      { header: 'Date', accessor: (r) => new Date(r.date).toISOString().split('T')[0] },
      { header: 'Category', accessor: (r) => r.category },
      { header: 'Type', accessor: (r) => r.type },
      { header: 'Amount', accessor: (r) => r.amount.toFixed(2) },
      { header: 'Notes', accessor: (r) => r.notes },
      { header: 'User', accessor: (r) => r.user.name },
      { header: 'Email', accessor: (r) => r.user.email },
    ]);

    const timestamp = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="transactions_${timestamp}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
}
