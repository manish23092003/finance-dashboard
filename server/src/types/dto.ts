/**
 * Shared Data Transfer Object types used across controllers and services.
 * These mirror the Prisma schema but use plain TS types to decouple layers.
 */

// ─── Role & Record Type Literals ─────────────────────────────────────────────
export type Role = 'ADMIN' | 'ANALYST' | 'VIEWER';
export type RecordType = 'INCOME' | 'EXPENSE';

// ─── Auth DTOs ───────────────────────────────────────────────────────────────
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// ─── Financial Record DTOs ───────────────────────────────────────────────────
export interface CreateRecordDTO {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
}

export interface UpdateRecordDTO {
  amount?: number;
  type?: RecordType;
  category?: string;
  date?: string;
  notes?: string;
}

export interface RecordQueryDTO {
  page: number;
  limit: number;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  type?: RecordType;
}

// ─── User Admin DTOs ────────────────────────────────────────────────────────
export interface ChangeRoleDTO {
  role: Role;
}

export interface ToggleStatusDTO {
  isActive: boolean;
}

// ─── API Response Envelope ──────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  records: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Dashboard Metrics ──────────────────────────────────────────────────────
export interface DashboardMetrics {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  recordCount: number;
  topCategories: { category: string; total: number }[];
  monthlyTrends: { month: string; income: number; expense: number }[];
  projectedIncome: number;
  projectedExpense: number;
}

// ─── Sanitized User (no passwordHash) ───────────────────────────────────────
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
