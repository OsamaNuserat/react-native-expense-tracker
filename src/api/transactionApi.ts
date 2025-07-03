import instance from './axiosInstance';
import { Expense, Income } from '../types';

export const fetchExpenses = async (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  merchant?: string;
}): Promise<Expense[]> => {
  try {
    const { data } = await instance.get('/api/expenses', { params });
    return data;
  } catch (error: any) {
    console.error('Failed to fetch expenses:', error);
    return [];
  }
};

export const fetchIncomes = async (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  source?: string;
}): Promise<Income[]> => {
  try {
    const { data } = await instance.get('/api/incomes', { params });
    return data;
  } catch (error: any) {
    console.error('Failed to fetch incomes:', error);
    return [];
  }
};

export const fetchExpenseById = async (id: number): Promise<Expense> => {
  const { data } = await instance.get(`/api/expenses/${id}`);
  return data;
};

export const fetchIncomeById = async (id: number): Promise<Income> => {
  const { data } = await instance.get(`/api/incomes/${id}`);
  return data;
};

export const createExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<Expense> => {
  const { data } = await instance.post('/api/expenses', expense);
  return data;
};

export const createIncome = async (income: Omit<Income, 'id' | 'userId' | 'createdAt'>): Promise<Income> => {
  const { data } = await instance.post('/api/incomes', {
    ...income,
    source: income.merchant
  });
  return data;
};

export const updateExpense = async (id: number, expense: Partial<Omit<Expense, 'id' | 'userId' | 'createdAt'>>): Promise<Expense> => {
  const { data } = await instance.put(`/api/expenses/${id}`, expense);
  return data;
};

export const updateIncome = async (id: number, income: Partial<Omit<Income, 'id' | 'userId' | 'createdAt'>>): Promise<Income> => {
  const { data } = await instance.put(`/api/incomes/${id}`, income);
  return data;
};

export const deleteExpense = async (id: number): Promise<void> => {
  await instance.delete(`/api/expenses/${id}`);
};

export const deleteIncome = async (id: number): Promise<void> => {
  await instance.delete(`/api/incomes/${id}`);
};

export const createTransactionFromMessage = async (messageId: string, categoryId: number): Promise<any> => {
  try {
    const [messageResponse, categoriesResponse] = await Promise.all([
      instance.get(`/api/messages/${messageId}`),
      instance.get('/api/categories')
    ]);
    
    const message = messageResponse.data;
    const categories = categoriesResponse.data;
    
    const category = categories.find((cat: any) => cat.id === categoryId);
    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }
    
    const isExpense = category.type === 'EXPENSE';
    
    if (isExpense) {
      const { data } = await instance.post('/api/expenses', {
        categoryId,
        amount: message.parsedData?.amount || 0,
        merchant: message.parsedData?.merchant || 'Unknown',
        createdAt: message.parsedData?.timestamp || message.createdAt
      });
      return data;
    } else {
      const { data } = await instance.post('/api/incomes', {
        categoryId,
        amount: message.parsedData?.amount || 0,
        source: message.parsedData?.source || message.parsedData?.merchant || 'Unknown',
        createdAt: message.parsedData?.timestamp || message.createdAt
      });
      return data;
    }
  } catch (error) {
    console.error('Failed to create transaction from message:', error);
    throw error;
  }
};

export const fetchAllTransactions = async (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  categoryId?: number;
}): Promise<{ expenses: Expense[], incomes: Income[] }> => {
  try {
    const [expenses, incomes] = await Promise.all([
      fetchExpenses(params),
      fetchIncomes(params)
    ]);
    
    return { expenses, incomes };
  } catch (error: any) {
    console.error('Failed to fetch all transactions:', error);
    return { expenses: [], incomes: [] };
  }
};

export const fetchExpenseSummary = async (params?: {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}): Promise<any> => {
  try {
    const { data } = await instance.get('/api/summary/expenses', { params });
    return data;
  } catch (error: any) {
    console.error('Failed to fetch expense summary:', error);
    return null;
  }
};

export const fetchIncomeSummary = async (params?: {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}): Promise<any> => {
  try {
    const { data } = await instance.get('/api/summary/incomes', { params });
    return data;
  } catch (error: any) {
    console.error('Failed to fetch income summary:', error);
    return null;
  }
};

export const fetchExpensesByCategory = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<any> => {
  try {
    const { data } = await instance.get('/api/summary/expenses/by-category', { params });
    return data;
  } catch (error: any) {
    console.error('Failed to fetch expenses by category:', error);
    return null;
  }
};

export const fetchIncomesByCategory = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<any> => {
  try {
    const { data } = await instance.get('/api/summary/incomes/by-category', { params });
    return data;
  } catch (error: any) {
    console.error('Failed to fetch incomes by category:', error);
    return null;
  }
};
