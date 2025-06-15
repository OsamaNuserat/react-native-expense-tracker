import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/api'

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [userToken, setUserToken] = useState<string | null>(null);

  const login = async (token: string) => {
    await AsyncStorage.setItem('token', token);
    setUserToken(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUserToken(null);
  };

  // Add registerUser function here
  const registerUser = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/register', { email, password });
      const token = response.data.token;
      if (token) {
        await AsyncStorage.setItem('token', token);
        setUserToken(token);
      }
      console.log('Registered successfully', response.data);
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error; // Let the caller (RegisterScreen) handle the error
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) setUserToken(token);
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, login, logout, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};
