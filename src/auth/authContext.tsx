import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/api'

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [userToken, setUserToken] = useState<string | null>(null);

const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post('/auth/login', { email, password });
    const token = response.data.token;
    if (token) {
      await AsyncStorage.setItem('token', token);
      setUserToken(token);
    }
    console.log('Login successful:', response.data);
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUserToken(null);
  };

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
      throw error;
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
    <AuthContext.Provider value={{ userToken, loginUser, logout, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};
