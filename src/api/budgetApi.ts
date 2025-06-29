import instance from './axiosInstance';
import { SurvivalBudget, BudgetSummary } from '../types';

export const createSurvivalBudget = async (budget: {
  amount: number;
  startDate: string;
  endDate: string;
}): Promise<SurvivalBudget> => {
  const { data } = await instance.post('/api/budget/survival', budget);
  return data;
};

export const getSurvivalBudget = async (): Promise<BudgetSummary> => {
  const { data } = await instance.get('/api/budget/survival');
  return data;
};
