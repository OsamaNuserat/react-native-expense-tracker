import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

import * as authApi from '../api/authApi';
import { tokenStorage } from '../utils/tokenStorage';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

interface AuthContextType {
  user: User | null;
  userToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => Promise<void>; // Keep old method for compatibility
  registerUser: (email: string, password: string) => Promise<void>; // Keep old method for compatibility
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: (logoutAll?: boolean) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userToken: null,
  isLoading: true,
  isAuthenticated: false,
  loginUser: async () => {},
  registerUser: async () => {},
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUserData: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!userToken && !!user;

  // Load stored authentication data on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      console.log('🔐 Loading stored authentication data...');
      try {
        const [accessToken, userData] = await Promise.all([
          tokenStorage.getAccessToken(),
          tokenStorage.getUserData()
        ]);

        console.log('🔑 Stored auth status:', {
          hasAccessToken: !!accessToken,
          hasUserData: !!userData,
          userId: userData?.id
        });

        if (accessToken && userData) {
          setUserToken(accessToken);
          setUser(userData);
          console.log('✅ Authentication loaded successfully');
        } else {
          console.log('❌ No valid stored authentication found');
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
        await tokenStorage.clearAll();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const handleAuthSuccess = async (authResponse: AuthResponse) => {
    const { user: userData, accessToken, refreshToken } = authResponse;
    
    // Store tokens and user data
    await Promise.all([
      tokenStorage.setTokens(accessToken, refreshToken),
      tokenStorage.setUserData(userData)
    ]);

    setUser(userData);
    setUserToken(accessToken);
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      await handleAuthSuccess(response);

      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'Successfully logged in',
      });
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 423) {
        errorMessage = 'Account is locked. Please try again later.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      }

      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(credentials);
      await handleAuthSuccess(response);

      Toast.show({
        type: 'success',
        text1: 'Account Created!',
        text2: 'Welcome to CLIQ Expense Tracker',
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed';
      
      if (error.response?.status === 400) {
        errorMessage = 'Password does not meet security requirements';
      } else if (error.response?.status === 409) {
        errorMessage = 'Email is already registered';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many registration attempts. Please try again later.';
      }

      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMessage,
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Legacy methods for compatibility
  const loginUser = async (email: string, password: string) => {
    await login({ email, password });
  };

  const registerUser = async (email: string, password: string) => {
    await register({ email, password });
  };

  const logout = async (logoutAll: boolean = false) => {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      
      if (refreshToken) {
        if (logoutAll) {
          await authApi.logoutAllDevices();
          Toast.show({
            type: 'success',
            text1: 'Logged out from all devices',
          });
        } else {
          await authApi.logout(refreshToken);
          Toast.show({
            type: 'success',
            text1: 'Logged out successfully',
          });
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still proceed with local logout even if server logout fails
    } finally {
      // Clear local storage
      await tokenStorage.clearAll();
      setUser(null);
      setUserToken(null);
    }
  };

  const refreshUserData = async () => {
    try {
      // Note: /api/auth/me endpoint doesn't exist on backend
      // For now, we'll keep the current user data as is
      console.log('refreshUserData: Using cached user data');
      // const userData = await authApi.getProfile();
      // setUser(userData);
      // await tokenStorage.setUserData(userData);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value: AuthContextType = {
    user,
    userToken,
    isLoading,
    isAuthenticated,
    loginUser, // Legacy compatibility
    registerUser, // Legacy compatibility
    login,
    register,
    logout,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
