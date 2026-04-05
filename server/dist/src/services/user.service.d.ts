import type { SafeUser, Role } from '../types/dto';
/**
 * Create a new user (admin only).
 * Hashes the password with bcrypt before storing.
 */
export declare function createUser(dto: {
    name: string;
    email: string;
    password: string;
    role: Role;
}): Promise<SafeUser>;
/**
 * Get all users (admin only).
 * Returns users without their passwordHash.
 */
export declare function getAllUsers(): Promise<SafeUser[]>;
/**
 * Get a single user by ID (admin only).
 */
export declare function getUserById(userId: string): Promise<SafeUser>;
/**
 * Change a user's role (admin only).
 * Prevents an admin from changing their own role to avoid lockout.
 */
export declare function changeRole(targetUserId: string, newRole: Role, requestingUserId: string): Promise<SafeUser>;
/**
 * Toggle a user's active status (admin only).
 * Prevents an admin from deactivating their own account.
 */
export declare function toggleStatus(targetUserId: string, isActive: boolean, requestingUserId: string): Promise<SafeUser>;
