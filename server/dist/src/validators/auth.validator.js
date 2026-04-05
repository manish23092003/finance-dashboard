"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// ─── Register ────────────────────────────────────────────────────────────────
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters')
        .trim(),
    email: zod_1.z
        .string()
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be at most 128 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one digit'),
    role: zod_1.z
        .enum(['ADMIN', 'ANALYST', 'VIEWER'], {
        errorMap: () => ({ message: 'Role must be ADMIN, ANALYST, or VIEWER' }),
    })
        .optional()
        .default('VIEWER'),
});
// ─── Login ───────────────────────────────────────────────────────────────────
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    password: zod_1.z
        .string()
        .min(1, 'Password is required'),
});
//# sourceMappingURL=auth.validator.js.map