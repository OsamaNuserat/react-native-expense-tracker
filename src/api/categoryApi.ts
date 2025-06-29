import instance from './axiosInstance';
import { Category, CategorySummary } from '../types';

export const fetchCategories = async (type?: 'EXPENSE' | 'INCOME'): Promise<Category[]> => {
  const params = type ? `?type=${type}` : '';
  const { data } = await instance.get(`/api/categories${params}`);
  return data;
};

export const createCategory = async (category: Omit<Category, 'id' | 'userId' | 'createdAt'>): Promise<Category> => {
  const { data } = await instance.post('/api/categories', category);
  return data;
};

export const updateCategory = async (id: number, category: Partial<Omit<Category, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  await instance.put(`/api/categories/${id}`, category);
};

export const deleteCategory = async (id: number): Promise<void> => {
  await instance.delete(`/api/categories/${id}`);
};

export const fetchExpensesByCategory = async (): Promise<CategorySummary[]> => {
  const { data } = await instance.get('/api/summary/expenses/by-category');
  return data;
};

export const fetchIncomesByCategory = async (): Promise<CategorySummary[]> => {
  const { data } = await instance.get('/api/summary/incomes/by-category');
  return data;
};
