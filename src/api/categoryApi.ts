import instance from './axiosInstance';

export type CategorySummary = { category: string; total: number };

export const fetchExpensesByCategory = async (): Promise<CategorySummary[]> => {
  const { data } = await instance.get('/api/expenses/by-category');
  return data;
};

export const fetchIncomesByCategory = async (): Promise<CategorySummary[]> => {
  const { data } = await instance.get('/api/incomes/by-category');
  return data;
};
