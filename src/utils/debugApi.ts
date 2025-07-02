// Debug API endpoints to see what's available
import axiosInstance from '../api/axiosInstance';

export const debugApiEndpoints = async () => {
  console.log('🔍 === API ENDPOINT DEBUG TEST ===');
  
  const endpointsToTest = [
    '/api/expenses',
    '/api/incomes', 
    '/api/categories',
    '/api/budget',
    '/api/summary/expenses',
    '/api/summary/incomes',
    '/api/advisor/overview',
    '/api/advisor/suggestions'
  ];
  
  for (const endpoint of endpointsToTest) {
    try {
      console.log(`🧪 Testing ${endpoint}...`);
      const response = await axiosInstance.get(endpoint);
      console.log(`✅ ${endpoint}:`, {
        status: response.status,
        dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
        count: Array.isArray(response.data) ? response.data.length : 'N/A',
        sample: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : response.data
      });
    } catch (error: any) {
      console.log(`❌ ${endpoint}:`, {
        status: error.response?.status || 'Network Error',
        message: error.response?.data?.message || error.message
      });
    }
  }
  
  console.log('🔍 === END API DEBUG ===');
};

// Test with current user authentication
export const testUserEndpoints = async () => {
  console.log('👤 === USER DATA TEST ===');
  
  try {
    // Test user-specific endpoints
    const userEndpoints = [
      '/api/user/expenses',
      '/api/user/incomes',
      '/api/user/categories',
      '/api/user/budget'
    ];
    
    for (const endpoint of userEndpoints) {
      try {
        const response = await axiosInstance.get(endpoint);
        console.log(`✅ ${endpoint}:`, response.data);
      } catch (error: any) {
        console.log(`❌ ${endpoint}:`, error.response?.status, error.response?.data);
      }
    }
  } catch (error) {
    console.error('👤 User endpoints test failed:', error);
  }
  
  console.log('👤 === END USER TEST ===');
};
