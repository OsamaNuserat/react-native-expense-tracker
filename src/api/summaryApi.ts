import instance from './axiosInstance';
import { MonthlySummary } from '../types';

export const fetchExpensesSummary = async (): Promise<MonthlySummary[]> => {
  try {
    const { data } = await instance.get('/api/summary/expenses');
    
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (error: any) {
    return [];
  }
};

export const fetchIncomesSummary = async (): Promise<MonthlySummary[]> => {
  try {
    const { data } = await instance.get('/api/summary/incomes');
    
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (error: any) {
    return [];
  }
};
