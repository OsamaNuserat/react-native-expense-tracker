import instance from './axiosInstance';
import { MonthlySummary } from '../types';

export const fetchExpensesSummary = async (): Promise<MonthlySummary[]> => {
  try {
    console.log('📊 Fetching expenses summary...');
    const { data } = await instance.get('/api/summary/expenses');
    console.log('📊 Expenses summary response:', data);
    return data;
  } catch (error: any) {
    console.info('📊 Summary expenses API not available, trying /api/expenses...');
    try {
      // Fallback to try direct expenses endpoint
      const { data } = await instance.get('/api/expenses');
      console.log('📊 Direct expenses response:', data);
      
      // Transform data to monthly summary format
      const monthlyTotals: { [key: string]: number } = {};
      
      data.forEach((expense: any) => {
        const month = expense.createdAt?.slice(0, 7) || new Date().toISOString().slice(0, 7);
        monthlyTotals[month] = (monthlyTotals[month] || 0) + (expense.amount || 0);
      });
      
      const monthlySummary = Object.entries(monthlyTotals).map(([month, total]) => ({
        month,
        total
      }));
      
      console.log('📊 Transformed expenses summary:', monthlySummary);
      return monthlySummary;
    } catch (directError: any) {
      console.warn('📊 Both summary and direct expenses API failed:', directError.message);
      return [];
    }
  }
};

export const fetchIncomesSummary = async (): Promise<MonthlySummary[]> => {
  try {
    console.log('📊 Fetching incomes summary...');
    const { data } = await instance.get('/api/summary/incomes');
    console.log('📊 Incomes summary response:', data);
    return data;
  } catch (error: any) {
    console.info('📊 Summary incomes API not available, trying /api/incomes...');
    try {
      // Fallback to try direct incomes endpoint
      const { data } = await instance.get('/api/incomes');
      console.log('📊 Direct incomes response:', data);
      
      // Transform data to monthly summary format
      const monthlyTotals: { [key: string]: number } = {};
      
      data.forEach((income: any) => {
        const month = income.createdAt?.slice(0, 7) || new Date().toISOString().slice(0, 7);
        monthlyTotals[month] = (monthlyTotals[month] || 0) + (income.amount || 0);
      });
      
      const monthlySummary = Object.entries(monthlyTotals).map(([month, total]) => ({
        month,
        total
      }));
      
      console.log('📊 Transformed incomes summary:', monthlySummary);
      return monthlySummary;
    } catch (directError: any) {
      console.warn('📊 Both summary and direct incomes API failed:', directError.message);
      return [];
    }
  }
};
