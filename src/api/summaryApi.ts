import { fetchExpenseSummary, fetchIncomeSummary } from './transactionApi';
import { MonthlySummary } from '../types';

export const fetchExpensesSummary = async (): Promise<MonthlySummary[]> => {
  try {
    const data = await fetchExpenseSummary();
    
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
    const data = await fetchIncomeSummary();
    
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (error: any) {
    return [];
  }
};
