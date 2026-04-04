import { z } from 'zod';

// ─── Create User (Admin) ────────────────────────────────────────────────────
export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase, one lowercase, and one digit'
    ),
  role: z.enum(['ADMIN', 'ANALYST', 'VIEWER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, ANALYST, or VIEWER' }),
  }),
});

// ─── Change User Role ───────────────────────────────────────────────────────
export const changeRoleSchema = z.object({
  role: z.enum(['ADMIN', 'ANALYST', 'VIEWER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, ANALYST, or VIEWER' }),
  }),
});

// ─── Toggle User Active Status ──────────────────────────────────────────────
export const toggleStatusSchema = z.object({
  isActive: z.boolean({
    required_error: 'isActive is required',
    invalid_type_error: 'isActive must be a boolean',
  }),
});

export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
export type ToggleStatusInput = z.infer<typeof toggleStatusSchema>;
