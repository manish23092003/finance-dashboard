"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getProfile = getProfile;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const env_1 = require("../config/env");
const error_middleware_1 = require("../middleware/error.middleware");
const SALT_ROUNDS = 12;
const JWT_EXPIRY = '24h';
/**
 * Strip passwordHash from user object before returning to client.
 */
function sanitizeUser(user) {
    const { passwordHash: _, ...safe } = user;
    return safe;
}
/**
 * Generate a signed JWT for an authenticated user.
 */
function generateToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });
}
// ─── Service Methods ────────────────────────────────────────────────────────
/**
 * Register a new user.
 * Only ADMINs should call this (enforced via RBAC middleware on the route).
 */
async function register(dto) {
    // Check for duplicate email
    const existing = await prisma_1.default.user.findUnique({ where: { email: dto.email } });
    if (existing) {
        throw new error_middleware_1.AppError('A user with this email already exists.', 409);
    }
    // Hash password
    const passwordHash = await bcryptjs_1.default.hash(dto.password, SALT_ROUNDS);
    // Create user
    const user = await prisma_1.default.user.create({
        data: {
            name: dto.name,
            email: dto.email,
            passwordHash,
            role: dto.role || 'VIEWER',
        },
    });
    const token = generateToken(user);
    return { user: sanitizeUser(user), token };
}
/**
 * Authenticate a user with email and password.
 * Returns a JWT token and the sanitized user profile.
 */
async function login(dto) {
    // Find user by email
    const user = await prisma_1.default.user.findUnique({ where: { email: dto.email } });
    if (!user) {
        throw new error_middleware_1.AppError('Invalid email or password.', 401);
    }
    // Check if account is active
    if (!user.isActive) {
        throw new error_middleware_1.AppError('Your account has been deactivated. Contact an administrator.', 403);
    }
    // Verify password
    const isMatch = await bcryptjs_1.default.compare(dto.password, user.passwordHash);
    if (!isMatch) {
        throw new error_middleware_1.AppError('Invalid email or password.', 401);
    }
    const token = generateToken(user);
    return { user: sanitizeUser(user), token };
}
/**
 * Get the current user's profile by ID.
 */
async function getProfile(userId) {
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new error_middleware_1.AppError('User not found.', 404);
    }
    return sanitizeUser(user);
}
//# sourceMappingURL=auth.service.js.map