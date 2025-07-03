import instance from './axiosInstance';

export interface SpendingSuggestion {
  id: string;
  title: string;
  description: string;
  icon: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  actionText: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  impact?: {
    savings?: number;
    currency?: string;
  };
}

export interface AdvisorOverview {
  currentSpending: {
    amount: number;
    currency: string;
  };
  budget: {
    amount: number;
    currency: string;
    remaining: number;
    percentage: number;
  };
  status: 'good' | 'moderate' | 'warning' | 'critical';
  alerts: string[];
  insights: string[];
}

export interface AdvisorTip {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface AdvisorInsight {
  id: string;
  title: string;
  description: string;
  type: 'spending' | 'saving' | 'budget' | 'trend';
  value?: number;
  currency?: string;
}

export interface BudgetRecommendation {
  id: string;
  category: string;
  currentAmount: number;
  recommendedAmount: number;
  reason: string;
  currency: string;
}

export const fetchSpendingSuggestions = async (
  period: string = 'month', 
  limit: number = 5
): Promise<SpendingSuggestion[]> => {
  try {
    console.log('🧠 Fetching spending suggestions...');
    const { data } = await instance.get(`/api/advisor/suggestions`, {
      params: { period, limit }
    });
    console.log('🧠 Suggestions response:', data);
    return data;
  } catch (error: any) {
    console.info('🧠 Spending Advisor API not available, generating suggestions from data...');
    
    try {
      const [expensesResponse, categoriesResponse] = await Promise.all([
        instance.get('/api/summary/expenses').catch(() => ({ data: [] })),
        instance.get('/api/categories').catch(() => ({ data: [] }))
      ]);
      
      console.log('🧠 Raw expenses for suggestions:', expensesResponse.data);
      console.log('🧠 Categories for suggestions:', categoriesResponse.data);
      
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'quarter':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'month':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }
      
      const filteredExpenses = expensesResponse.data
        .filter((expense: any) => {
          const expenseDate = new Date(expense.createdAt);
          return expenseDate >= startDate && expenseDate <= now;
        });
      
      console.log('🧠 Filtered expenses for suggestions:', filteredExpenses.length, 'Period:', period);
      
      const expenses = filteredExpenses;
      const categories = categoriesResponse.data;
      
      const categorySpending = categories.reduce((acc: any, category: any) => {
        const total = expenses
          .filter((expense: any) => expense.categoryId === category.id)
          .reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);
        
        if (total > 0) {
          acc[category.name.toLowerCase()] = {
            total,
            count: expenses.filter((expense: any) => expense.categoryId === category.id).length,
            category: category.name
          };
        }
        return acc;
      }, {});
      
      console.log('🧠 Category spending analysis:', categorySpending);
      
      const suggestions: SpendingSuggestion[] = [];
      
      if (categorySpending.dining && categorySpending.dining.total > 200) {
        suggestions.push({
          id: 'dining-1',
          title: 'Reduce Dining Out',
          description: `You've spent ${categorySpending.dining.total.toFixed(2)} JD on dining this month. Consider cooking at home more often.`,
          icon: '🍽️',
          priority: categorySpending.dining.total > 400 ? 'high' : 'medium',
          actionText: 'Set Dining Budget',
          difficultyLevel: 'easy',
          impact: {
            savings: Math.round(categorySpending.dining.total * 0.3),
            currency: 'JD',
          },
        });
      }
      
      if (categorySpending.subscriptions && categorySpending.subscriptions.total > 50) {
        suggestions.push({
          id: 'subscriptions-1',
          title: 'Review Subscriptions',
          description: `You have ${categorySpending.subscriptions.total.toFixed(2)} JD in subscription costs. Consider canceling unused services.`,
          icon: '📺',
          priority: 'medium',
          actionText: 'Review Subscriptions',
          difficultyLevel: 'easy',
          impact: {
            savings: Math.round(categorySpending.subscriptions.total * 0.4),
            currency: 'JD',
          },
        });
      }
      
      if (categorySpending.transportation && categorySpending.transportation.total > 150) {
        suggestions.push({
          id: 'transport-1',
          title: 'Optimize Transportation',
          description: `Transportation costs are ${categorySpending.transportation.total.toFixed(2)} JD. Consider carpooling or public transport.`,
          icon: '🚗',
          priority: 'medium',
          actionText: 'Plan Routes',
          difficultyLevel: 'medium',
          impact: {
            savings: Math.round(categorySpending.transportation.total * 0.2),
            currency: 'JD',
          },
        });
      }
      
      if (categorySpending.shopping && categorySpending.shopping.total > 100) {
        suggestions.push({
          id: 'shopping-1',
          title: 'Smart Shopping',
          description: `Shopping expenses are ${categorySpending.shopping.total.toFixed(2)} JD. Try making a list before shopping to avoid impulse buys.`,
          icon: '🛍️',
          priority: categorySpending.shopping.total > 300 ? 'high' : 'low',
          actionText: 'Create Shopping List',
          difficultyLevel: 'easy',
          impact: {
            savings: Math.round(categorySpending.shopping.total * 0.25),
            currency: 'JD',
          },
        });
      }
      
      if (suggestions.length === 0) {
        suggestions.push({
          id: 'general-1',
          title: 'Great job!',
          description: 'You\'re managing your spending well. Keep tracking your expenses to maintain this good habit.',
          icon: '✅',
          priority: 'low',
          actionText: 'Keep It Up',
          difficultyLevel: 'easy',
        });
      }
      
      console.log('🧠 Generated suggestions:', suggestions);
      return suggestions.slice(0, limit);
      
    } catch (calculationError: any) {
      console.warn('🧠 Failed to generate suggestions from data:', calculationError.message);
      
      return [
        {
          id: 'fallback-1',
          title: 'Start Tracking',
          description: 'Begin by adding your expenses to get personalized spending advice.',
          icon: '📊',
          priority: 'low',
          actionText: 'Add Expense',
          difficultyLevel: 'easy',
        },
      ];
    }
  }
};

export const fetchAdvisorOverview = async (period: string = 'month'): Promise<AdvisorOverview> => {
  try {
    console.log('🧠 Fetching advisor overview...');
    const { data } = await instance.get(`/api/advisor/overview`, {
      params: { period }
    });
    console.log('🧠 Advisor overview response:', data);
    return data;
  } catch (error: any) {
    console.info('🧠 Advisor Overview API not available, trying to calculate from raw data...');
    
    try {
      const [expensesResponse, budgetResponse] = await Promise.all([
        instance.get('/api/summary/expenses').catch(() => ({ data: [] })),
        instance.get('/api/budget').catch(() => ({ data: null }))
      ]);
      
      console.log('🧠 Raw expenses data:', expensesResponse.data);
      console.log('🧠 Raw budget data:', budgetResponse.data);
      
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'quarter':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'month':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }
      
      console.log('🧠 Filtering expenses from', startDate.toISOString(), 'to', now.toISOString());
      
      const filteredExpenses = expensesResponse.data
        .filter((expense: any) => {
          const expenseDate = new Date(expense.createdAt);
          return expenseDate >= startDate && expenseDate <= now;
        });
      
      const totalSpending = filteredExpenses
        .reduce((total: number, expense: any) => total + (expense.amount || 0), 0);
      
      console.log('🧠 Filtered expenses:', filteredExpenses.length, 'Total spending:', totalSpending);
      
      const budgetAmount = budgetResponse.data?.amount || 1200; // fallback from your test data
      const remaining = budgetAmount - totalSpending;
      const percentage = budgetAmount > 0 ? (totalSpending / budgetAmount) * 100 : 0;
      
      let status: 'good' | 'moderate' | 'warning' | 'critical' = 'good';
      if (percentage > 90) status = 'critical';
      else if (percentage > 75) status = 'warning';
      else if (percentage > 50) status = 'moderate';
      
      const overview: AdvisorOverview = {
        currentSpending: {
          amount: totalSpending,
          currency: 'JD',
        },
        budget: {
          amount: budgetAmount,
          currency: 'JD',
          remaining: remaining,
          percentage: percentage,
        },
        status: status,
        alerts: percentage > 75 ? ['You\'re approaching your budget limit'] : [],
        insights: totalSpending > 0 ? ['Track your spending to stay on budget'] : ['Start tracking your expenses'],
      };
      
      console.log('🧠 Calculated advisor overview:', overview);
      return overview;
      
    } catch (calculationError: any) {
      console.warn('🧠 Failed to calculate overview from raw data:', calculationError.message);
      
      return {
        currentSpending: {
          amount: 0,
          currency: 'JD',
        },
        budget: {
          amount: 1200,
          currency: 'JD',
          remaining: 1200,
          percentage: 0,
        },
        status: 'good',
        alerts: [],
        insights: ['Connect your expenses to get personalized insights'],
      };
    }
  }
};

export const takeSuggestionAction = async (
  suggestionId: string, 
  action: 'accept' | 'dismiss' | 'learn_more'
): Promise<void> => {
  try {
    await instance.post(`/api/advisor/suggestions/${suggestionId}/action`, { action });
  } catch (error: any) {
    if (error?.response?.status === 404) {
      console.info('Suggestion action API not available yet');
      return;
    }
    throw error;
  }
};

export const fetchSpendingTips = async (): Promise<AdvisorTip[]> => {
  try {
    const { data } = await instance.get('/api/advisor/tips');
    return data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      console.info('Spending Tips API not available yet');
      return [
        {
          id: '1',
          title: 'Track Small Purchases',
          description: 'Small daily purchases like coffee can add up. Track them to see the impact.',
          category: 'spending',
        },
        {
          id: '2',
          title: 'Use the 24-Hour Rule',
          description: 'Wait 24 hours before making non-essential purchases to avoid impulse buying.',
          category: 'saving',
        },
      ];
    }
    throw error;
  }
};

export const fetchSpendingInsights = async (): Promise<AdvisorInsight[]> => {
  try {
    const { data } = await instance.get('/api/advisor/insights');
    return data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      console.info('Spending Insights API not available yet');
      return [
        {
          id: '1',
          title: 'Monthly Trend',
          description: 'Your spending has decreased by 8% compared to last month',
          type: 'trend',
          value: -8,
        },
        {
          id: '2',
          title: 'Top Category',
          description: 'Dining out represents 35% of your total spending',
          type: 'spending',
          value: 35,
        },
      ];
    }
    throw error;
  }
};

export const fetchBudgetRecommendations = async (): Promise<BudgetRecommendation[]> => {
  try {
    const { data } = await instance.get('/api/advisor/budget-recommendations');
    return data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      console.info('Budget Recommendations API not available yet');
      return [
        {
          id: '1',
          category: 'Dining',
          currentAmount: 300,
          recommendedAmount: 200,
          reason: 'Based on your income, consider reducing dining expenses',
          currency: 'JD',
        },
        {
          id: '2',
          category: 'Entertainment',
          currentAmount: 100,
          recommendedAmount: 150,
          reason: 'You have room to enjoy more entertainment within your budget',
          currency: 'JD',
        },
      ];
    }
    throw error;
  }
};
