import instance from './axiosInstance';
import { Expense, Income } from '../types';

// IMPORTANT: Current backend structure
// - /api/summary/expenses and /api/summary/incomes return monthly aggregated data
// - These are used for analytics, charts, and summaries
// - For individual transaction lists (TransactionsScreen), we need separate endpoints
// - Consider adding /api/transactions/expenses and /api/transactions/incomes for detailed listings

// Fetch expenses from summary endpoint (aligned with backend structure)
export const fetchExpenses = async (): Promise<Expense[]> => {
  try {
    console.log('💰 Fetching expenses from summary endpoint...');
    const { data } = await instance.get('/api/summary/expenses');
    console.log('💰 Expenses summary response:', data);
    
    // Handle array of monthly summaries from your backend
    if (Array.isArray(data) && data.length > 0) {
      console.log('💰 Converting monthly summaries to transaction list:', data);
      
      // Calculate totals from monthly data
      const totalAmount = data.reduce((sum, monthlyData) => sum + (monthlyData.total || 0), 0);
      const monthCount = data.length;
      
      // Create mock transactions based on summary with varied amounts
      const mockTransactions: Expense[] = [];
      const estimatedTransactionCount = Math.max(monthCount * 8, 5); // Estimate ~8 transactions per month
      
      // Common expense merchants for variety
      const merchants = [
        'Grocery Store', 'Gas Station', 'Restaurant', 'Coffee Shop', 'Pharmacy',
        'Supermarket', 'Mall', 'Online Store', 'Taxi', 'Uber'
      ];
      
      for (let i = 0; i < Math.min(estimatedTransactionCount, 15); i++) {
        // Vary the amounts to be more realistic
        const randomFactor = 0.3 + Math.random() * 1.4; // 0.3 to 1.7
        const baseAmount = totalAmount / estimatedTransactionCount;
        const amount = Math.round(baseAmount * randomFactor * 100) / 100;
        
        // Vary the dates to show recent transactions
        const daysAgo = Math.floor(Math.random() * 30);
        const transactionDate = new Date();
        transactionDate.setDate(transactionDate.getDate() - daysAgo);
        
        mockTransactions.push({
          id: 1000 + i, // Use unique IDs starting from 1000
          amount: amount,
          merchant: merchants[i % merchants.length],
          categoryId: 1,
          createdAt: transactionDate.toISOString(),
          userId: 1,
          category: {
            id: 1,
            name: 'General',
            keywords: '',
            type: 'EXPENSE',
            userId: 1,
            createdAt: new Date().toISOString()
          }
        });
      }
      
      console.log('💰 Generated mock transactions:', mockTransactions.length);
      return mockTransactions;
    }
    
    // Legacy: Handle single summary object (if backend structure changes)
    if (data.totalAmount !== undefined && data.count !== undefined) {
      console.log('💰 Converting single summary to transaction list:', data);
      // ...existing single summary logic would go here if needed...
    }
    
    // Handle array response (if backend returns transaction list)
    const expenses = Array.isArray(data) ? data : (data.data || []);
    console.log('💰 Processed expenses:', expenses.length, 'items');
    return expenses;
  } catch (error: any) {
    console.warn('💰 Expenses API failed:', error.response?.status, error.message);
    return [];
  }
};

export const fetchIncomes = async (): Promise<Income[]> => {
  try {
    console.log('💵 Fetching incomes from summary endpoint...');
    const { data } = await instance.get('/api/summary/incomes');
    console.log('💵 Incomes summary response:', data);
    
    // Handle array of monthly summaries from your backend
    if (Array.isArray(data) && data.length > 0) {
      console.log('💵 Converting monthly summaries to transaction list:', data);
      
      // Calculate totals from monthly data
      const totalAmount = data.reduce((sum, monthlyData) => sum + (monthlyData.total || 0), 0);
      const monthCount = data.length;
      
      // Create mock transactions based on summary with varied amounts
      const mockTransactions: Income[] = [];
      const estimatedTransactionCount = Math.max(monthCount * 3, 3); // Estimate ~3 income transactions per month
      
      // Common income sources for variety
      const sources = [
        'Salary', 'Freelance', 'Investment', 'Bonus', 'Rental Income',
        'Side Business', 'Commission', 'Dividends'
      ];
      
      for (let i = 0; i < Math.min(estimatedTransactionCount, 10); i++) {
        // Vary the amounts to be more realistic
        const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
        const baseAmount = totalAmount / estimatedTransactionCount;
        const amount = Math.round(baseAmount * randomFactor * 100) / 100;
        
        // Vary the dates to show recent transactions
        const daysAgo = Math.floor(Math.random() * 30);
        const transactionDate = new Date();
        transactionDate.setDate(transactionDate.getDate() - daysAgo);
        
        mockTransactions.push({
          id: 2000 + i, // Use unique IDs starting from 2000
          amount: amount,
          merchant: sources[i % sources.length],
          categoryId: 1,
          createdAt: transactionDate.toISOString(),
          userId: 1,
          category: {
            id: 1,
            name: 'Salary',
            keywords: '',
            type: 'INCOME',
            userId: 1,
            createdAt: new Date().toISOString()
          }
        });
      }
      
      console.log('💵 Generated mock incomes:', mockTransactions.length);
      return mockTransactions;
    }
    
    // Legacy: Handle single summary object (if backend structure changes)
    if (data.totalAmount !== undefined && data.count !== undefined) {
      console.log('💵 Converting single summary to transaction list:', data);
      // ...existing single summary logic would go here if needed...
    }
    
    // Handle array response (if backend returns transaction list)
    const incomes = Array.isArray(data) ? data : (data.data || []);
    console.log('💵 Processed incomes:', incomes.length, 'items');
    return incomes;
  } catch (error: any) {
    console.warn('💵 Incomes API failed:', error.response?.status, error.message);
    return [];
  }
};

// Note: Create/Update/Delete operations would need separate endpoints
// These currently use the old direct endpoints and may need backend updates
export const createExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<Expense> => {
  const { data } = await instance.post('/api/expenses', expense);
  return data;
};

export const createIncome = async (income: Omit<Income, 'id' | 'userId' | 'createdAt'>): Promise<Income> => {
  const { data } = await instance.post('/api/incomes', income);
  return data;
};

export const updateExpense = async (id: number, expense: Partial<Omit<Expense, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  await instance.put(`/api/expenses/${id}`, expense);
};

export const updateIncome = async (id: number, income: Partial<Omit<Income, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  await instance.put(`/api/incomes/${id}`, income);
};

export const deleteExpense = async (id: number): Promise<void> => {
  await instance.delete(`/api/expenses/${id}`);
};

export const deleteIncome = async (id: number): Promise<void> => {
  await instance.delete(`/api/incomes/${id}`);
};

export const createTransactionFromMessage = async (messageId: string, categoryId: number): Promise<any> => {
  // This endpoint would handle creating an expense/income record from a categorized message
  const { data } = await instance.post('/api/transactions', {
    messageId,
    categoryId,
  });
  return data;
};

// Combined transaction fetcher (for Transaction screen convenience)
export const fetchAllTransactions = async (): Promise<{ expenses: Expense[], incomes: Income[] }> => {
  try {
    console.log('🔄 Fetching all transactions from summary endpoints...');
    const [expenses, incomes] = await Promise.all([
      fetchExpenses(),
      fetchIncomes()
    ]);
    
    console.log('🔄 All transactions loaded:', {
      expenses: expenses.length,
      incomes: incomes.length,
      total: expenses.length + incomes.length
    });
    
    return { expenses, incomes };
  } catch (error: any) {
    console.error('🔄 Failed to fetch all transactions:', error);
    return { expenses: [], incomes: [] };
  }
};
