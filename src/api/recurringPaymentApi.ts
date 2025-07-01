import axiosInstance from './axiosInstance';
import { API_CONFIG } from '../config/api';

export interface RecurringPayment {
  id: number;
  name: string;
  description?: string;
  amount: number;
  category: {
    id: number;
    name: string;
    type: string;
  };
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  dayOfMonth?: number;
  dayOfWeek?: number;
  isActive: boolean;
  isAutoDetected: boolean;
  merchant?: string;
  nextDue: string;
  dueIn: number;
  reminders?: {
    enabled: boolean;
    daysBefore: number[];
  };
  createdAt: string;
}

export interface RecurringPaymentsResponse {
  detected: RecurringPayment[];
  userAdded: RecurringPayment[];
  total: number;
  active: number;
}

export interface CreateRecurringPaymentData {
  name: string;
  description?: string;
  amount: number;
  categoryId: number;
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  dayOfMonth?: number;
  dayOfWeek?: number;
  merchant?: string;
  reminders?: {
    enabled: boolean;
    daysBefore: number[];
  };
}

export interface DetectedPattern {
  merchant: string;
  suggestedName: string;
  averageAmount: number;
  frequency: string;
  confidence: number;
  dayOfMonth?: number;
  transactionCount: number;
  categoryId: number;
}

export interface DetectionResponse {
  detectedPatterns: DetectedPattern[];
  total: number;
}

export interface UpcomingPaymentsResponse {
  upcomingPayments: RecurringPayment[];
  total: number;
}

// Get all recurring payments
export const fetchRecurringPayments = async (active?: boolean): Promise<RecurringPaymentsResponse> => {
  const params = active !== undefined ? { active } : undefined;
  const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.RECURRING_PAYMENTS, { params });
  return response.data;
};

// Create a new recurring payment
export const createRecurringPayment = async (data: CreateRecurringPaymentData): Promise<{ success: boolean; recurringPayment: RecurringPayment }> => {
  const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.RECURRING_PAYMENTS, data);
  return response.data;
};

// Update a recurring payment
export const updateRecurringPayment = async (id: number, data: Partial<CreateRecurringPaymentData>): Promise<{ success: boolean; recurringPayment: RecurringPayment }> => {
  const response = await axiosInstance.put(`${API_CONFIG.ENDPOINTS.RECURRING_PAYMENTS}/${id}`, data);
  return response.data;
};

// Delete a recurring payment
export const deleteRecurringPayment = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.RECURRING_PAYMENTS}/${id}`);
  return response.data;
};

// Get upcoming payments
export const fetchUpcomingPayments = async (days: number = 30): Promise<UpcomingPaymentsResponse> => {
  const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.RECURRING_PAYMENTS}/upcoming`, { 
    params: { days } 
  });
  return response.data;
};

// Detect recurring patterns from transaction history
export const detectRecurringPayments = async (): Promise<DetectionResponse> => {
  const response = await axiosInstance.post(`${API_CONFIG.ENDPOINTS.RECURRING_PAYMENTS}/detect`);
  return response.data;
};

// Create recurring payment from detected pattern
export const createFromDetection = async (data: {
  merchant: string;
  amount: number;
  categoryId: number;
  frequency: string;
  dayOfMonth?: number;
  name: string;
}): Promise<{ success: boolean; recurringPayment: RecurringPayment }> => {
  const response = await axiosInstance.post(`${API_CONFIG.ENDPOINTS.RECURRING_PAYMENTS}/create-from-detection`, data);
  return response.data;
};

// Toggle active status
export const toggleRecurringPaymentStatus = async (id: number, isActive: boolean): Promise<{ success: boolean; recurringPayment: RecurringPayment }> => {
  const response = await axiosInstance.put(`${API_CONFIG.ENDPOINTS.RECURRING_PAYMENTS}/${id}`, { isActive });
  return response.data;
};
