import instance from './axiosInstance';
import { MonthlySummary } from '../types';

export const fetchExpensesSummary = async (): Promise<MonthlySummary[]> => {
  const { data } = await instance.get('/api/summary/expenses');
  return data;
};

export const fetchIncomesSummary = async (): Promise<MonthlySummary[]> => {
  const { data } = await instance.get('/api/summary/incomes');
  return data;
};
