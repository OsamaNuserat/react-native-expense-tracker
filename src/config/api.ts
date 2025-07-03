// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: 'http://192.168.15.249:3000',
  
  ENDPOINTS: {
    PARSE_SMS: '/api/parse-sms',
    EXPENSES: '/api/expenses',
    INCOMES: '/api/incomes',
    CATEGORIES: '/api/categories',
    BUDGET: '/api/budget',
    MESSAGES: '/api/messages',
    NOTIFICATIONS: '/api/notifications',
    SUMMARY: '/api/summary',
    RECURRING_PAYMENTS: '/api/recurring-payments',
    BILLS: '/api/bills',
    SUMMARY_EXPENSES: '/api/summary/expenses',
    SUMMARY_INCOMES: '/api/summary/incomes',
    EXPENSES_BY_CATEGORY: '/api/summary/expenses/by-category',
    INCOMES_BY_CATEGORY: '/api/summary/incomes/by-category',
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      ME: '/api/auth/me',
    }
  }
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
