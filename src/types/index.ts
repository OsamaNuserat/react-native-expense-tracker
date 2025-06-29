export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ShortcutInstructions: undefined;
  Messages: undefined;
  CliqCategory: { messageId: string };
  Stats: undefined;
  MessageDetails: { id: string };
  Transactions: undefined;
  Categories: undefined;
  BudgetSettings: undefined;
  Settings: undefined;
};

export interface User {
  id: number;
  email: string;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface Category {
  id: number;
  name: string;
  keywords: string;
  type: 'EXPENSE' | 'INCOME';
  userId: number;
  createdAt: string;
}

export interface Message {
  id: number;
  content: string;
  userId: number;
  createdAt: string;
  parsedData?: ParsedMessage | null;
}

export interface ParsedMessage {
  originalMessage: string;
  timestamp: string;
  amount: number;
  merchant: string | null;
  category: string;
  type: 'expense' | 'income' | 'unknown';
  source: string | null;
}

export interface MessageParseResponse {
  actionRequired: boolean;
  message: {
    id: number;
    content: string;
    createdAt: string;
  };
  transaction?: {
    id?: number;
    type: string;
    amount: number;
    merchant: string | null;
    category: string;
    timestamp: string;
  };
}

export interface Transaction {
  id: number;
  amount: number;
  merchant: string | null;
  categoryId: number;
  userId: number;
  createdAt: string;
  category?: Category;
}

export interface Expense extends Transaction {}
export interface Income extends Transaction {}

export interface SurvivalBudget {
  id: number;
  userId: number;
  amount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSummary {
  budget: SurvivalBudget;
  totalWeeks: number;
  weeklyBudget: number;
  currentWeek: {
    start: string;
    end: string;
    spent: number;
    remaining: number;
  };
}

export interface MonthlySummary {
  month: string;
  total: number;
}

export interface CategorySummary {
  category: string;
  total: number;
}
