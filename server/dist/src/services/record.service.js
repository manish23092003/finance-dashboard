"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhereClause = buildWhereClause;
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.getCategories = getCategories;
exports.getExportData = getExportData;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
/**
 * Build Prisma `where` clause based on role, ownership, and filters.
 */
function buildWhereClause(query, userId, role) {
    const where = {};
    // Role-based scoping: non-ADMINs only see their own records
    if (role !== 'ADMIN') {
        where.userId = userId;
    }
    // Date range filter
    if (query.dateFrom || query.dateTo) {
        const dateFilter = {};
        if (query.dateFrom)
            dateFilter.gte = new Date(query.dateFrom);
        if (query.dateTo) {
            // Include the full end date (set to end of day)
            const endDate = new Date(query.dateTo);
            endDate.setHours(23, 59, 59, 999);
            dateFilter.lte = endDate;
        }
        where.date = dateFilter;
    }
    // Category filter
    if (query.category) {
        where.category = query.category;
    }
    // Type filter
    if (query.type) {
        where.type = query.type;
    }
    return where;
}
// ─── Service Methods ────────────────────────────────────────────────────────
/**
 * Get paginated financial records with optional filters.
 * Non-ADMIN users can only see their own records.
 */
async function getAll(query, userId, role) {
    const where = buildWhereClause(query, userId, role);
    const [records, total] = await Promise.all([
        prisma_1.default.financialRecord.findMany({
            where,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
            orderBy: { date: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        }),
        prisma_1.default.financialRecord.count({ where }),
    ]);
    return {
        records: records.map((r) => ({
            ...r,
            amount: Number(r.amount), // Convert Prisma Decimal → JS number
        })),
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.ceil(total / query.limit),
        },
    };
}
/**
 * Get a single financial record by ID.
 * Non-ADMIN users can only access their own records.
 */
async function getById(recordId, userId, role) {
    const record = await prisma_1.default.financialRecord.findUnique({
        where: { id: recordId },
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
    });
    if (!record) {
        throw new error_middleware_1.AppError('Financial record not found.', 404);
    }
    // Ownership check for non-ADMINs
    if (role !== 'ADMIN' && record.userId !== userId) {
        throw new error_middleware_1.AppError('You do not have access to this record.', 403);
    }
    return { ...record, amount: Number(record.amount) };
}
/**
 * Create a new financial record.
 * The userId is inferred from the authenticated user's token.
 */
async function create(dto, userId) {
    const record = await prisma_1.default.financialRecord.create({
        data: {
            userId,
            amount: dto.amount,
            type: dto.type,
            category: dto.category,
            date: new Date(dto.date),
            notes: dto.notes || '',
        },
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
    });
    return { ...record, amount: Number(record.amount) };
}
/**
 * Update a financial record.
 * ANALYST: can only update their own records (ownership check).
 * ADMIN: can update any record.
 */
async function update(recordId, dto, userId, role) {
    // First verify the record exists
    const existing = await prisma_1.default.financialRecord.findUnique({
        where: { id: recordId },
    });
    if (!existing) {
        throw new error_middleware_1.AppError('Financial record not found.', 404);
    }
    // Ownership check for ANALYST
    if (role === 'ANALYST' && existing.userId !== userId) {
        throw new error_middleware_1.AppError('You can only update your own records.', 403);
    }
    // Build update data (only include fields that are provided)
    const updateData = {};
    if (dto.amount !== undefined)
        updateData.amount = dto.amount;
    if (dto.type !== undefined)
        updateData.type = dto.type;
    if (dto.category !== undefined)
        updateData.category = dto.category;
    if (dto.date !== undefined)
        updateData.date = new Date(dto.date);
    if (dto.notes !== undefined)
        updateData.notes = dto.notes;
    const record = await prisma_1.default.financialRecord.update({
        where: { id: recordId },
        data: updateData,
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
    });
    return { ...record, amount: Number(record.amount) };
}
/**
 * Delete a financial record.
 * Only ADMINs can delete records (enforced via RBAC middleware).
 */
async function remove(recordId) {
    const existing = await prisma_1.default.financialRecord.findUnique({
        where: { id: recordId },
    });
    if (!existing) {
        throw new error_middleware_1.AppError('Financial record not found.', 404);
    }
    await prisma_1.default.financialRecord.delete({ where: { id: recordId } });
    return { id: recordId };
}
/**
 * Get all distinct categories (for filter dropdowns).
 */
async function getCategories(userId, role) {
    const where = role !== 'ADMIN' ? { userId } : {};
    const results = await prisma_1.default.financialRecord.findMany({
        where,
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
    });
    return results.map((r) => r.category);
}
/**
 * Get all records for CSV export (no pagination).
 * Respects the same RBAC and filter rules as getAll.
 */
async function getExportData(query, userId, role) {
    const where = buildWhereClause(query, userId, role);
    const records = await prisma_1.default.financialRecord.findMany({
        where,
        orderBy: { date: 'desc' },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
        },
    });
    return records.map((r) => ({
        ...r,
        amount: Number(r.amount),
    }));
}
//# sourceMappingURL=record.service.js.map