import type { CreateRecordDTO, UpdateRecordDTO, RecordQueryDTO, PaginatedResponse, Role } from '../types/dto';
interface RecordWithUser {
    id: string;
    userId: string;
    amount: number;
    type: string;
    category: string;
    date: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
/**
 * Build Prisma `where` clause based on role, ownership, and filters.
 */
export declare function buildWhereClause(query: RecordQueryDTO, userId: string, role: Role): Record<string, unknown>;
/**
 * Get paginated financial records with optional filters.
 * Non-ADMIN users can only see their own records.
 */
export declare function getAll(query: RecordQueryDTO, userId: string, role: Role): Promise<PaginatedResponse<RecordWithUser>>;
/**
 * Get a single financial record by ID.
 * Non-ADMIN users can only access their own records.
 */
export declare function getById(recordId: string, userId: string, role: Role): Promise<RecordWithUser>;
/**
 * Create a new financial record.
 * The userId is inferred from the authenticated user's token.
 */
export declare function create(dto: CreateRecordDTO, userId: string): Promise<RecordWithUser>;
/**
 * Update a financial record.
 * ANALYST: can only update their own records (ownership check).
 * ADMIN: can update any record.
 */
export declare function update(recordId: string, dto: UpdateRecordDTO, userId: string, role: Role): Promise<RecordWithUser>;
/**
 * Delete a financial record.
 * Only ADMINs can delete records (enforced via RBAC middleware).
 */
export declare function remove(recordId: string): Promise<{
    id: string;
}>;
/**
 * Get all distinct categories (for filter dropdowns).
 */
export declare function getCategories(userId: string, role: Role): Promise<string[]>;
/**
 * Get all records for CSV export (no pagination).
 * Respects the same RBAC and filter rules as getAll.
 */
export declare function getExportData(query: RecordQueryDTO, userId: string, role: Role): Promise<{
    amount: number;
    user: {
        name: string;
        id: string;
        email: string;
    };
    type: string;
    date: Date;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    category: string;
    notes: string;
}[]>;
export {};
