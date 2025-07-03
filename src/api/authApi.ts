import axiosInstance from './axiosInstance';
import { AuthResponse, RefreshTokenResponse, LoginRequest, RegisterRequest } from '../types';

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/api/auth/register', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/api/auth/login', data);
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await axiosInstance.post('/api/auth/refresh', {
    refreshToken
  });
  return response.data;
};

export const logout = async (refreshToken: string): Promise<{ message: string }> => {
  const response = await axiosInstance.post('/api/auth/logout', {
    refreshToken
  });
  return response.data;
};

export const logoutAllDevices = async (): Promise<{ message: string }> => {
  const response = await axiosInstance.post('/api/auth/logout-all');
  return response.data;
};