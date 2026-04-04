import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { env } from '../config/env';
import { AppError } from '../middleware/error.middleware';
import type { RegisterDTO, LoginDTO, SafeUser } from '../types/dto';

const SALT_ROUNDS = 12;
const JWT_EXPIRY = '24h';

/**
 * Strip passwordHash from user object before returning to client.
 */
function sanitizeUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  passwordHash?: string;
}): SafeUser {
  const { passwordHash: _, ...safe } = user as typeof user & { passwordHash: string };
  return safe as SafeUser;
}

/**
 * Generate a signed JWT for an authenticated user.
 */
function generateToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

// ─── Service Methods ────────────────────────────────────────────────────────

/**
 * Register a new user.
 * Only ADMINs should call this (enforced via RBAC middleware on the route).
 */
export async function register(dto: RegisterDTO): Promise<{ user: SafeUser; token: string }> {
  // Check for duplicate email
  const existing = await prisma.user.findUnique({ where: { email: dto.email } });
  if (existing) {
    throw new AppError('A user with this email already exists.', 409);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
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
export async function login(dto: LoginDTO): Promise<{ user: SafeUser; token: string }> {
  // Find user by email
  const user = await prisma.user.findUnique({ where: { email: dto.email } });
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Check if account is active
  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Contact an administrator.', 403);
  }

  // Verify password
  const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
}

/**
 * Get the current user's profile by ID.
 */
export async function getProfile(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return sanitizeUser(user);
}
