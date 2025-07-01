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

// Get personalized spending suggestions
export const fetchSpendingSuggestions = async (
  period: string = 'month', 
  limit: number = 5
): Promise<SpendingSuggestion[]> => {
  try {
    const { data } = await instance.get(`/api/advisor/suggestions`, {
      params: { period, limit }
    });
    return data;
  } catch (error: any) {
    // Handle 404 or other errors gracefully
    console.info('Spending Advisor API not available, using mock data');
    // Return mock data for development
    return [
      {
        id: '1',
        title: 'Reduce Dining Out',
        description: 'You\'ve spent 40% more on restaurants this month. Consider cooking at home to save money.',
        icon: '🍽️',
        priority: 'high',
        actionText: 'Set Dining Budget',
        difficultyLevel: 'easy',
        impact: {
          savings: 250,
          currency: 'JD',
        },
      },
      {
        id: '2',
        title: 'Review Subscriptions',
        description: 'You have multiple streaming services. Consider canceling unused subscriptions.',
        icon: '📺',
        priority: 'medium',
        actionText: 'Review Subscriptions',
        difficultyLevel: 'easy',
        impact: {
          savings: 50,
          currency: 'JD',
        },
      },
      {
        id: '3',
        title: 'Optimize Transportation',
        description: 'Gas expenses are above average. Consider carpooling or public transport.',
        icon: '🚗',
        priority: 'medium',
        actionText: 'Plan Routes',
        difficultyLevel: 'medium',
        impact: {
          savings: 80,
          currency: 'JD',
        },
      },
    ];
  }
};

// Get spending overview and dashboard data
export const fetchAdvisorOverview = async (period: string = 'month'): Promise<AdvisorOverview> => {
  try {
    const { data } = await instance.get(`/api/advisor/overview`, {
      params: { period }
    });
    return data;
  } catch (error: any) {
    // Handle 404 or other errors gracefully
    console.info('Advisor Overview API not available, using mock data');
    // Return mock data for development
    return {
      currentSpending: {
        amount: 1250.50,
        currency: 'JD',
      },
      budget: {
        amount: 2000,
        currency: 'JD',
        remaining: 749.50,
        percentage: 62.5,
      },
      status: 'moderate',
      alerts: [
        'You\'re 15% over your dining budget',
        'Subscription costs increased this month',
      ],
      insights: [
        'You saved 12% compared to last month',
        'Weekend spending is higher than weekdays',
      ],
    };
  }
};

// Take action on a suggestion
export const takeSuggestionAction = async (
  suggestionId: string, 
  action: 'accept' | 'dismiss' | 'learn_more'
): Promise<void> => {
  try {
    await instance.post(`/api/advisor/suggestions/${suggestionId}/action`, { action });
  } catch (error: any) {
    if (error?.response?.status === 404) {
      console.info('Suggestion action API not available yet');
      return; // Mock success for development
    }
    throw error;
  }
};

// Get contextual spending tips
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

// Get detailed spending insights
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

// Get budget recommendations
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
