import { z } from 'zod';

// ─── Create Record ──────────────────────────────────────────────────────────
export const createRecordSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be positive')
    .max(999_999_999.99, 'Amount exceeds maximum allowed value'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    errorMap: () => ({ message: 'Type must be INCOME or EXPENSE' }),
  }),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be at most 100 characters')
    .trim(),
  date: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      'Invalid date format. Use ISO 8601 (e.g., 2026-01-15 or 2026-01-15T00:00:00Z)'
    ),
  notes: z
    .string()
    .max(500, 'Notes must be at most 500 characters')
    .optional()
    .default(''),
});

// ─── Update Record (all fields optional) ────────────────────────────────────
export const updateRecordSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be positive')
    .max(999_999_999.99, 'Amount exceeds maximum allowed value')
    .optional(),
  type: z
    .enum(['INCOME', 'EXPENSE'], {
      errorMap: () => ({ message: 'Type must be INCOME or EXPENSE' }),
    })
    .optional(),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be at most 100 characters')
    .trim()
    .optional(),
  date: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      'Invalid date format'
    )
    .optional(),
  notes: z
    .string()
    .max(500, 'Notes must be at most 500 characters')
    .optional(),
});

// ─── Query Params (all strings from URL, transform to proper types) ─────────
export const recordQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a positive integer')
    .transform(Number)
    .pipe(z.number().int().positive())
    .optional()
    .default('1'),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a positive integer')
    .transform(Number)
    .pipe(z.number().int().positive().max(100, 'Limit cannot exceed 100'))
    .optional()
    .default('10'),
  dateFrom: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      'Invalid dateFrom format'
    )
    .optional(),
  dateTo: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      'Invalid dateTo format'
    )
    .optional(),
  category: z.string().optional(),
  type: z
    .enum(['INCOME', 'EXPENSE'])
    .optional(),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type RecordQueryInput = z.infer<typeof recordQuerySchema>;
