import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { tokenStorage } from '../utils/tokenStorage';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getAccessToken();
    console.log('🔑 Request interceptor:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPrefix: token?.substring(0, 20) + '...',
      url: config.url,
      headers: config.headers
    });
    
    if (token) {
      // Ensure Authorization header is properly set
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set:', config.headers.Authorization?.substring(0, 30) + '...');
    } else {
      console.warn('⚠️ No access token found for request to:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Successful API response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log('❌ API Error:', {
      url: originalRequest?.url,
      status: error.response?.status,
      data: error.response?.data,
      hasRetried: originalRequest?._retry
    });

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      console.log('🔄 401/403 error detected, attempting token refresh...');
      
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        console.log('🔄 Attempting token refresh:', {
          hasRefreshToken: !!refreshToken,
          refreshTokenLength: refreshToken?.length || 0,
          endpoint: `${API_CONFIG.BASE_URL}/api/auth/refresh`
        });
        
        if (!refreshToken) {
          console.error('❌ No refresh token available');
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint with explicit headers and config
        console.log('📡 Calling refresh endpoint with payload:', { refreshToken: refreshToken.substring(0, 20) + '...' });
        const response = await axios.post(`${API_CONFIG.BASE_URL}/api/auth/refresh`, 
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );

        console.log('📡 Refresh response:', {
          status: response.status,
          hasAccessToken: !!response.data?.accessToken,
          hasRefreshToken: !!response.data?.refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        console.log('✅ Token refresh successful - New token obtained');

        // Store new tokens
        await tokenStorage.setTokens(accessToken, newRefreshToken);

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError: any) {
        // Refresh failed, clear tokens and redirect to login
        console.error('❌ Token refresh failed:', refreshError.response?.data || refreshError.message);
        processQueue(refreshError, null);
        await tokenStorage.clearAll();
        
        console.error('Token refresh failed:', refreshError);
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle specific errors more gracefully
    const errorMessage = error.response?.data?.message || error.message;
    const errorData = typeof error.response?.data === 'string' ? error.response.data : '';
    const isNoActiveBudgetError = errorMessage === "No active budget";
    const isEndpointNotFoundError = errorData.includes("Cannot GET /api/summary/expenses") || 
                                   errorData.includes("Cannot GET /api/summary/incomes");
    
    if (isNoActiveBudgetError) {
      console.log('ℹ️ No active budget found - this is normal for new users');
    } else if (isEndpointNotFoundError) {
      console.log('ℹ️ Transaction endpoints not implemented yet - using mock data');
    } else {
      console.error('API Error:', error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

// Debug function to manually test tokens
export const debugTokens = async () => {
  console.log('🧪 === TOKEN DEBUG TEST ===');
  
  try {
    const accessToken = await tokenStorage.getAccessToken();
    const refreshToken = await tokenStorage.getRefreshToken();
    
    console.log('📋 Current tokens status:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenLength: accessToken?.length || 0,
      refreshTokenLength: refreshToken?.length || 0
    });

    if (accessToken) {
      // Test access token with a simple API call
      console.log('🧪 Testing access token with /api/summary/expenses...');
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/api/summary/expenses`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Access token is valid:', response.status);
      } catch (error: any) {
        console.log('❌ Access token test failed:', error.response?.status, error.response?.data);
        
        if (refreshToken && error.response?.status === 401) {
          console.log('🔄 Testing refresh token...');
          try {
            const refreshResponse = await axios.post(`${API_CONFIG.BASE_URL}/api/auth/refresh`, 
              { refreshToken },
              {
                headers: { 'Content-Type': 'application/json' }
              }
            );
            console.log('✅ Refresh token is valid:', refreshResponse.status);
          } catch (refreshError: any) {
            console.log('❌ Refresh token test failed:', refreshError.response?.status, refreshError.response?.data);
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Token debug test error:', error);
  }
  
  console.log('🧪 === END TOKEN DEBUG ===');
};

export default axiosInstance;
