import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import type { SafeUser, Role } from '../types/dto';

const SALT_ROUNDS = 12;

/**
 * Strip passwordHash from user objects.
 */
function sanitizeUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
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
export async function createUser(dto: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): Promise<SafeUser> {
  // Check for duplicate email
  const existing = await prisma.user.findUnique({ where: { email: dto.email } });
  if (existing) {
    throw new AppError('A user with this email already exists.', 409);
  }

  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

  const user = await prisma.user.create({
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
export async function getAllUsers(): Promise<SafeUser[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return users.map(sanitizeUser);
}

/**
 * Get a single user by ID (admin only).
 */
export async function getUserById(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return sanitizeUser(user);
}

/**
 * Change a user's role (admin only).
 * Prevents an admin from changing their own role to avoid lockout.
 */
export async function changeRole(
  targetUserId: string,
  newRole: Role,
  requestingUserId: string
): Promise<SafeUser> {
  // Prevent self-role-change to avoid admin lockout
  if (targetUserId === requestingUserId) {
    throw new AppError('You cannot change your own role.', 400);
  }

  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  });

  return sanitizeUser(updated);
}

/**
 * Toggle a user's active status (admin only).
 * Prevents an admin from deactivating their own account.
 */
export async function toggleStatus(
  targetUserId: string,
  isActive: boolean,
  requestingUserId: string
): Promise<SafeUser> {
  // Prevent self-deactivation
  if (targetUserId === requestingUserId && !isActive) {
    throw new AppError('You cannot deactivate your own account.', 400);
  }

  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { isActive },
  });

  return sanitizeUser(updated);
}
