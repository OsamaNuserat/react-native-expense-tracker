// Centralized API configuration
export const API_CONFIG = {
  // Use local development server
  BASE_URL: 'http://192.168.15.249:3000',
  
  // Production URL (commented out)
  // BASE_URL: 'https://expense-tracker-q432.onrender.com',
  
  // API endpoints
  ENDPOINTS: {
    PARSE_SMS: '/api/parse-sms',
    EXPENSES: '/api/expenses',
    INCOMES: '/api/incomes',
    CATEGORIES: '/api/categories',
    BUDGET: '/api/budget',
    MESSAGES: '/api/messages',
    NOTIFICATIONS: '/api/notifications',
    SUMMARY: '/api/summary',
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
