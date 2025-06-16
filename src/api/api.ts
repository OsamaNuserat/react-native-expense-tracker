import instance from './axiosInstance';

export const fetchMessages = async (): Promise<
    { id: number; content: string; userId: number; createdAt: string }[]
> => {
    const { data } = await instance.get('/api/messages');
    return data;
};

export type MonthlySummary = { month: string; total: number };

export const fetchExpensesSummary = async (): Promise<MonthlySummary[]> => {
    const { data } = await instance.get<MonthlySummary[]>('/api/expenses/summary');
    return data;
};

export const fetchIncomesSummary = async (): Promise<MonthlySummary[]> => {
    const { data } = await instance.get<MonthlySummary[]>('/api/incomes/summary');
    return data;
};

export type CategorySummary = { category: string; total: number };

export const fetchExpensesByCategory = async (): Promise<CategorySummary[]> => {
    const { data } = await instance.get<CategorySummary[]>('/api/expenses/by-category');
    return data;
};

export const fetchIncomesByCategory = async (): Promise<CategorySummary[]> => {
    const { data } = await instance.get<CategorySummary[]>('/api/incomes/by-category');
    return data;
};

export default instance;
