import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import type {
  CreateRecordDTO,
  UpdateRecordDTO,
  RecordQueryDTO,
  PaginatedResponse,
  Role,
} from '../types/dto';

// ─── Helpers ────────────────────────────────────────────────────────────────

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
  user: { id: string; name: string; email: string };
}

/**
 * Build Prisma `where` clause based on role, ownership, and filters.
 */
export function buildWhereClause(
  query: RecordQueryDTO,
  userId: string,
  role: Role
) {
  const where: Record<string, unknown> = {};

  // Role-based scoping: non-ADMINs only see their own records
  if (role !== 'ADMIN') {
    where.userId = userId;
  }

  // Date range filter
  if (query.dateFrom || query.dateTo) {
    const dateFilter: Record<string, Date> = {};
    if (query.dateFrom) dateFilter.gte = new Date(query.dateFrom);
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
export async function getAll(
  query: RecordQueryDTO,
  userId: string,
  role: Role
): Promise<PaginatedResponse<RecordWithUser>> {
  const where = buildWhereClause(query, userId, role);

  const [records, total] = await Promise.all([
    prisma.financialRecord.findMany({
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
    prisma.financialRecord.count({ where }),
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
export async function getById(
  recordId: string,
  userId: string,
  role: Role
): Promise<RecordWithUser> {
  const record = await prisma.financialRecord.findUnique({
    where: { id: recordId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!record) {
    throw new AppError('Financial record not found.', 404);
  }

  // Ownership check for non-ADMINs
  if (role !== 'ADMIN' && record.userId !== userId) {
    throw new AppError('You do not have access to this record.', 403);
  }

  return { ...record, amount: Number(record.amount) };
}

/**
 * Create a new financial record.
 * The userId is inferred from the authenticated user's token.
 */
export async function create(
  dto: CreateRecordDTO,
  userId: string
): Promise<RecordWithUser> {
  const record = await prisma.financialRecord.create({
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
export async function update(
  recordId: string,
  dto: UpdateRecordDTO,
  userId: string,
  role: Role
): Promise<RecordWithUser> {
  // First verify the record exists
  const existing = await prisma.financialRecord.findUnique({
    where: { id: recordId },
  });

  if (!existing) {
    throw new AppError('Financial record not found.', 404);
  }

  // Ownership check for ANALYST
  if (role === 'ANALYST' && existing.userId !== userId) {
    throw new AppError('You can only update your own records.', 403);
  }

  // Build update data (only include fields that are provided)
  const updateData: Record<string, unknown> = {};
  if (dto.amount !== undefined) updateData.amount = dto.amount;
  if (dto.type !== undefined) updateData.type = dto.type;
  if (dto.category !== undefined) updateData.category = dto.category;
  if (dto.date !== undefined) updateData.date = new Date(dto.date);
  if (dto.notes !== undefined) updateData.notes = dto.notes;

  const record = await prisma.financialRecord.update({
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
export async function remove(recordId: string): Promise<{ id: string }> {
  const existing = await prisma.financialRecord.findUnique({
    where: { id: recordId },
  });

  if (!existing) {
    throw new AppError('Financial record not found.', 404);
  }

  await prisma.financialRecord.delete({ where: { id: recordId } });

  return { id: recordId };
}

/**
 * Get all distinct categories (for filter dropdowns).
 */
export async function getCategories(
  userId: string,
  role: Role
): Promise<string[]> {
  const where = role !== 'ADMIN' ? { userId } : {};

  const results = await prisma.financialRecord.findMany({
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
export async function getExportData(
  query: RecordQueryDTO,
  userId: string,
  role: Role
) {
  const where = buildWhereClause(query, userId, role);

  const records = await prisma.financialRecord.findMany({
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
