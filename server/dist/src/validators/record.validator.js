"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordQuerySchema = exports.updateRecordSchema = exports.createRecordSchema = void 0;
const zod_1 = require("zod");
// ─── Create Record ──────────────────────────────────────────────────────────
exports.createRecordSchema = zod_1.z.object({
    amount: zod_1.z
        .number({ invalid_type_error: 'Amount must be a number' })
        .positive('Amount must be positive')
        .max(999_999_999.99, 'Amount exceeds maximum allowed value'),
    type: zod_1.z.enum(['INCOME', 'EXPENSE'], {
        errorMap: () => ({ message: 'Type must be INCOME or EXPENSE' }),
    }),
    category: zod_1.z
        .string()
        .min(1, 'Category is required')
        .max(100, 'Category must be at most 100 characters')
        .trim(),
    date: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format. Use ISO 8601 (e.g., 2026-01-15 or 2026-01-15T00:00:00Z)'),
    notes: zod_1.z
        .string()
        .max(500, 'Notes must be at most 500 characters')
        .optional()
        .default(''),
});
// ─── Update Record (all fields optional) ────────────────────────────────────
exports.updateRecordSchema = zod_1.z.object({
    amount: zod_1.z
        .number({ invalid_type_error: 'Amount must be a number' })
        .positive('Amount must be positive')
        .max(999_999_999.99, 'Amount exceeds maximum allowed value')
        .optional(),
    type: zod_1.z
        .enum(['INCOME', 'EXPENSE'], {
        errorMap: () => ({ message: 'Type must be INCOME or EXPENSE' }),
    })
        .optional(),
    category: zod_1.z
        .string()
        .min(1, 'Category is required')
        .max(100, 'Category must be at most 100 characters')
        .trim()
        .optional(),
    date: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
        .optional(),
    notes: zod_1.z
        .string()
        .max(500, 'Notes must be at most 500 characters')
        .optional(),
});
// ─── Query Params (all strings from URL, transform to proper types) ─────────
exports.recordQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .regex(/^\d+$/, 'Page must be a positive integer')
        .transform(Number)
        .pipe(zod_1.z.number().int().positive())
        .optional()
        .default('1'),
    limit: zod_1.z
        .string()
        .regex(/^\d+$/, 'Limit must be a positive integer')
        .transform(Number)
        .pipe(zod_1.z.number().int().positive().max(100, 'Limit cannot exceed 100'))
        .optional()
        .default('10'),
    dateFrom: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid dateFrom format')
        .optional(),
    dateTo: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid dateTo format')
        .optional(),
    category: zod_1.z.string().optional(),
    type: zod_1.z
        .enum(['INCOME', 'EXPENSE'])
        .optional(),
});
//# sourceMappingURL=record.validator.js.map