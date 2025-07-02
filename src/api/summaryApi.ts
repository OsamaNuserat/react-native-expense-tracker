import instance from './axiosInstance';
import { MonthlySummary } from '../types';

export const fetchExpensesSummary = async (): Promise<MonthlySummary[]> => {
  try {
    console.log('📊 Fetching expenses summary...');
    const { data } = await instance.get('/api/summary/expenses', {
      params: {
        period: 'month' // Request monthly breakdown
      }
    });
    console.log('📊 Expenses summary response:', data);
    
    // Your API returns structured analytics, transform to monthly format
    if (data.totalAmount !== undefined) {
      // Single period response - convert to monthly format
      const currentMonth = new Date().toISOString().slice(0, 7);
      return [{
        month: currentMonth,
        total: data.totalAmount
      }];
    }
    
    return data;
  } catch (error: any) {
    console.warn('📊 Summary expenses API failed:', error.response?.status, error.message);
    // No fallback needed since we're now using the correct endpoint
    return [];
  }
};

export const fetchIncomesSummary = async (): Promise<MonthlySummary[]> => {
  try {
    console.log('📊 Fetching incomes summary...');
    const { data } = await instance.get('/api/summary/incomes');
    console.log('📊 Incomes summary response:', data);
    return data;
  } catch (error: any) {
    console.warn('📊 Summary incomes API failed:', error.response?.status, error.message);
    // No fallback needed since we're now using the correct endpoint
    return [];
  }
};
