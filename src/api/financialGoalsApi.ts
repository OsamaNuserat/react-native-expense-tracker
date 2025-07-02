import instance from './axiosInstance';
import { FinancialGoal, FinancialGoalsStats, GoalTransaction } from '../types';

export const getFinancialGoals = async (): Promise<FinancialGoal[]> => {
  try {
    const { data } = await instance.get('/api/financial-goals');
    return data.data || [];
  } catch (error: any) {
    console.error('Error fetching financial goals:', error);
    return [];
  }
};

export const getFinancialGoal = async (id: number): Promise<FinancialGoal | null> => {
  try {
    const { data } = await instance.get(`/api/financial-goals/${id}`);
    return data.data || null;
  } catch (error: any) {
    console.error('Error fetching financial goal:', error);
    return null;
  }
};

export const createFinancialGoal = async (goalData: Partial<FinancialGoal>): Promise<FinancialGoal | null> => {
  try {
    const { data } = await instance.post('/api/financial-goals', goalData);
    return data.data || null;
  } catch (error: any) {
    console.error('Error creating financial goal:', error);
    throw error;
  }
};

export const updateFinancialGoal = async (id: number, goalData: Partial<FinancialGoal>): Promise<FinancialGoal | null> => {
  try {
    const { data } = await instance.put(`/api/financial-goals/${id}`, goalData);
    return data.data || null;
  } catch (error: any) {
    console.error('Error updating financial goal:', error);
    throw error;
  }
};

export const contributeToGoal = async (id: number, amount: number, description?: string, source?: string): Promise<any> => {
  try {
    const { data } = await instance.post(`/api/financial-goals/${id}/contribute`, {
      amount,
      description,
      source
    });
    return data;
  } catch (error: any) {
    console.error('Error contributing to goal:', error);
    throw error;
  }
};

export const deleteFinancialGoal = async (id: number): Promise<boolean> => {
  try {
    await instance.delete(`/api/financial-goals/${id}`);
    return true;
  } catch (error: any) {
    console.error('Error deleting financial goal:', error);
    return false;
  }
};

export const getFinancialGoalsStats = async (): Promise<FinancialGoalsStats | null> => {
  try {
    const { data } = await instance.get('/api/financial-goals/stats');
    return data.data || null;
  } catch (error: any) {
    console.error('Error fetching financial goals stats:', error);
    return null;
  }
};
