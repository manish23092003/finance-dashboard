"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleStatusSchema = exports.changeRoleSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
// ─── Create User (Admin) ────────────────────────────────────────────────────
exports.createUserSchema = zod_1.z.object({
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
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password must be at most 128 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase, one lowercase, and one digit'),
    role: zod_1.z.enum(['ADMIN', 'ANALYST', 'VIEWER'], {
        errorMap: () => ({ message: 'Role must be ADMIN, ANALYST, or VIEWER' }),
    }),
});
// ─── Change User Role ───────────────────────────────────────────────────────
exports.changeRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['ADMIN', 'ANALYST', 'VIEWER'], {
        errorMap: () => ({ message: 'Role must be ADMIN, ANALYST, or VIEWER' }),
    }),
});
// ─── Toggle User Active Status ──────────────────────────────────────────────
exports.toggleStatusSchema = zod_1.z.object({
    isActive: zod_1.z.boolean({
        required_error: 'isActive is required',
        invalid_type_error: 'isActive must be a boolean',
    }),
});
//# sourceMappingURL=user.validator.js.map