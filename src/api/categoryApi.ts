import instance from './axiosInstance';
import { Category } from '../types';

export const fetchCategories = async (type?: 'EXPENSE' | 'INCOME'): Promise<Category[]> => {
  const params = type ? `?type=${type}` : '';
  const { data } = await instance.get(`/api/categories${params}`);
  return data;
};

export const fetchCategoryById = async (id: number): Promise<Category> => {
  const { data } = await instance.get(`/api/categories/${id}`);
  return data;
};

export const createCategory = async (category: Omit<Category, 'id' | 'userId' | 'createdAt'>): Promise<Category> => {
  const { data } = await instance.post('/api/categories', category);
  return data;
};

export const updateCategory = async (id: number, category: Partial<Omit<Category, 'id' | 'userId' | 'createdAt'>>): Promise<Category> => {
  const { data } = await instance.put(`/api/categories/${id}`, category);
  return data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await instance.delete(`/api/categories/${id}`);
};
