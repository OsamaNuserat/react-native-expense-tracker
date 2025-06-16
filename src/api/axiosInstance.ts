import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    baseURL: 'http://192.168.15.249:3000',
    // baseURL: 'https://expense-tracker-q432.onrender.com',
    timeout: 10000,
});

instance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default instance;
