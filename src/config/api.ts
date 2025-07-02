// Centralized API configuration
export const API_CONFIG = {
  // Production URL
  // BASE_URL: 'https://expense-tracker-q432.onrender.com',
  
  // Local development server (commented out)
  BASE_URL: 'http://192.168.15.249:3000',
  
  // API endpoints
  ENDPOINTS: {
    PARSE_SMS: '/api/parse-sms',
    // Summary-based endpoints (aligned with backend structure)
    EXPENSES: '/api/summary/expenses',
    INCOMES: '/api/summary/incomes',
    EXPENSES_BY_CATEGORY: '/api/summary/expenses-by-category',
    INCOMES_BY_CATEGORY: '/api/summary/incomes-by-category',
    CATEGORIES: '/api/categories',
    BUDGET: '/api/budget',
    MESSAGES: '/api/messages',
    NOTIFICATIONS: '/api/notifications',
    SUMMARY: '/api/summary',
    RECURRING_PAYMENTS: '/api/recurring-payments',
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
