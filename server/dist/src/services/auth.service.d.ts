import type { RegisterDTO, LoginDTO, SafeUser } from '../types/dto';
/**
 * Register a new user.
 * Only ADMINs should call this (enforced via RBAC middleware on the route).
 */
export declare function register(dto: RegisterDTO): Promise<{
    user: SafeUser;
    token: string;
}>;
/**
 * Authenticate a user with email and password.
 * Returns a JWT token and the sanitized user profile.
 */
export declare function login(dto: LoginDTO): Promise<{
    user: SafeUser;
    token: string;
}>;
/**
 * Get the current user's profile by ID.
 */
export declare function getProfile(userId: string): Promise<SafeUser>;
