"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.changeRole = changeRole;
exports.toggleStatus = toggleStatus;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const SALT_ROUNDS = 12;
/**
 * Strip passwordHash from user objects.
 */
function sanitizeUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
// ─── Service Methods ────────────────────────────────────────────────────────
/**
 * Create a new user (admin only).
 * Hashes the password with bcrypt before storing.
 */
async function createUser(dto) {
    // Check for duplicate email
    const existing = await prisma_1.default.user.findUnique({ where: { email: dto.email } });
    if (existing) {
        throw new error_middleware_1.AppError('A user with this email already exists.', 409);
    }
    const passwordHash = await bcryptjs_1.default.hash(dto.password, SALT_ROUNDS);
    const user = await prisma_1.default.user.create({
        data: {
            name: dto.name,
            email: dto.email,
            passwordHash,
            role: dto.role,
        },
    });
    return sanitizeUser(user);
}
/**
 * Get all users (admin only).
 * Returns users without their passwordHash.
 */
async function getAllUsers() {
    const users = await prisma_1.default.user.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return users.map(sanitizeUser);
}
/**
 * Get a single user by ID (admin only).
 */
async function getUserById(userId) {
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new error_middleware_1.AppError('User not found.', 404);
    }
    return sanitizeUser(user);
}
/**
 * Change a user's role (admin only).
 * Prevents an admin from changing their own role to avoid lockout.
 */
async function changeRole(targetUserId, newRole, requestingUserId) {
    // Prevent self-role-change to avoid admin lockout
    if (targetUserId === requestingUserId) {
        throw new error_middleware_1.AppError('You cannot change your own role.', 400);
    }
    const user = await prisma_1.default.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
        throw new error_middleware_1.AppError('User not found.', 404);
    }
    const updated = await prisma_1.default.user.update({
        where: { id: targetUserId },
        data: { role: newRole },
    });
    return sanitizeUser(updated);
}
/**
 * Toggle a user's active status (admin only).
 * Prevents an admin from deactivating their own account.
 */
async function toggleStatus(targetUserId, isActive, requestingUserId) {
    // Prevent self-deactivation
    if (targetUserId === requestingUserId && !isActive) {
        throw new error_middleware_1.AppError('You cannot deactivate your own account.', 400);
    }
    const user = await prisma_1.default.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
        throw new error_middleware_1.AppError('User not found.', 404);
    }
    const updated = await prisma_1.default.user.update({
        where: { id: targetUserId },
        data: { isActive },
    });
    return sanitizeUser(updated);
}
//# sourceMappingURL=user.service.js.map