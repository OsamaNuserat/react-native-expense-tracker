import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
  // baseURL: 'http://192.168.1.14:3000',
  baseURL: 'https://expense-tracker-q432.onrender.com',
});

instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchMessages = async (): Promise<
  { id: number; content: string; userId: number; createdAt: string }[]
> => {
  const { data } = await instance.get('/api/messages');
  return data;
};

export default instance;
