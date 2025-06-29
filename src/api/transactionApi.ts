import instance from './axiosInstance';
import { Expense, Income } from '../types';

// This would need to be implemented in the backend
export const fetchExpenses = async (): Promise<Expense[]> => {
  const { data } = await instance.get('/api/expenses');
  return data;
};

export const fetchIncomes = async (): Promise<Income[]> => {
  const { data } = await instance.get('/api/incomes');
  return data;
};

export const createExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<Expense> => {
  const { data } = await instance.post('/api/expenses', expense);
  return data;
};

export const createIncome = async (income: Omit<Income, 'id' | 'userId' | 'createdAt'>): Promise<Income> => {
  const { data } = await instance.post('/api/incomes', income);
  return data;
};

export const updateExpense = async (id: number, expense: Partial<Omit<Expense, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  await instance.put(`/api/expenses/${id}`, expense);
};

export const updateIncome = async (id: number, income: Partial<Omit<Income, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  await instance.put(`/api/incomes/${id}`, income);
};

export const deleteExpense = async (id: number): Promise<void> => {
  await instance.delete(`/api/expenses/${id}`);
};

export const deleteIncome = async (id: number): Promise<void> => {
  await instance.delete(`/api/incomes/${id}`);
};

export const createTransactionFromMessage = async (messageId: string, categoryId: number): Promise<any> => {
  // This endpoint would handle creating an expense/income record from a categorized message
  const { data } = await instance.post('/api/transactions', {
    messageId,
    categoryId,
  });
  return data;
};
