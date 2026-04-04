export type Role = 'ADMIN' | 'ANALYST' | 'VIEWER';
export type RecordType = 'INCOME' | 'EXPENSE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialRecord {
  id: string;
  userId: string;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; email: string };
}

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

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedRecords {
  records: FinancialRecord[];
  pagination: PaginationInfo;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}
