import instance from './axiosInstance';

export type MonthlySummary = { month: string; total: number };

export const fetchExpensesSummary = async (): Promise<MonthlySummary[]> => {
  const { data } = await instance.get('/api/expenses/summary');
  return data;
};

export const fetchIncomesSummary = async (): Promise<MonthlySummary[]> => {
  const { data } = await instance.get('/api/incomes/summary');
  return data;
};
