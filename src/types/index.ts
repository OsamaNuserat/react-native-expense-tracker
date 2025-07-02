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
  RecurringPayments: undefined;
  Settings: undefined;
  SpendingAdvisor: undefined;
  FinancialGoals: undefined;
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

export interface FinancialGoal {
  id: number;
  title: string;
  description?: string;
  goalType: GoalType;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  priority: GoalPriority;
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: string;
  categoryId?: number;
  autoContribute: boolean;
  monthlyTarget?: number;
  reminderEnabled: boolean;
  reminderDay?: number;
  metadata?: any;
  progress: number;
  remaining: number;
  daysLeft?: number;
  category?: Category;
  transactions?: GoalTransaction[];
  milestones?: GoalMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface GoalTransaction {
  id: number;
  goalId: number;
  amount: number;
  type: TransactionType;
  description?: string;
  source?: string;
  linkedExpenseId?: number;
  linkedIncomeId?: number;
  createdAt: string;
}

export interface GoalMilestone {
  id: number;
  goalId: number;
  title: string;
  description?: string;
  targetAmount: number;
  isReached: boolean;
  reachedAt?: string;
  rewardText?: string;
  createdAt: string;
}

export interface FinancialGoalsStats {
  total: number;
  active: number;
  completed: number;
  inactive: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  totalRemaining: number;
  averageProgress: number;
  goalsByType: Record<string, number>;
  goalsByPriority: Record<string, number>;
  totalTransactions: number;
  recentActivity: any[];
}

export type GoalType = 
  | 'EMERGENCY_FUND'
  | 'VACATION'
  | 'CAR_PURCHASE'
  | 'HOUSE_DOWN_PAYMENT'
  | 'DEBT_PAYOFF'
  | 'WEDDING'
  | 'EDUCATION'
  | 'RETIREMENT'
  | 'INVESTMENT'
  | 'HOME_IMPROVEMENT'
  | 'BUSINESS'
  | 'GADGET'
  | 'CUSTOM';

export type GoalPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TransactionType = 'CONTRIBUTION' | 'WITHDRAWAL' | 'ADJUSTMENT';
