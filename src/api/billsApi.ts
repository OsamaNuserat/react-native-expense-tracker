import axiosInstance from './axiosInstance';
import { API_CONFIG } from '../config/api';
import type {
  Bill,
  BillPayment,
  CreateBillRequest,
  UpdateBillRequest,
  BillsDashboard,
  BillsCalendarResponse
} from '../types';

const BILLS_ENDPOINT = '/api/bills';

export interface BillsResponse {
  bills: Bill[];
  pagination: {
    total: number;
    limit: number | null;
    offset: number;
    hasMore: boolean;
  };
}

export interface BillPaymentsResponse {
  payments: BillPayment[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const fetchBills = async (params: {
  isActive?: 'true' | 'false' | 'all';
  isOverdue?: boolean;
  upcoming?: boolean;
  limit?: number;
  offset?: number;
} = {}): Promise<BillsResponse> => {
  const response = await axiosInstance.get(BILLS_ENDPOINT, { params });
  return response.data;
};

export const fetchBillById = async (id: number): Promise<Bill> => {
  const response = await axiosInstance.get(`${BILLS_ENDPOINT}/${id}`);
  return response.data;
};

export const createBill = async (billData: CreateBillRequest): Promise<Bill> => {
  const response = await axiosInstance.post(BILLS_ENDPOINT, billData);
  return response.data;
};

export const updateBill = async (id: number, billData: UpdateBillRequest): Promise<Bill> => {
  const response = await axiosInstance.put(`${BILLS_ENDPOINT}/${id}`, billData);
  return response.data;
};

export const deleteBill = async (id: number): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`${BILLS_ENDPOINT}/${id}`);
  return response.data;
};

export const markBillAsPaid = async (
  id: number,
  paymentData: {
    amount: number;
    paidDate?: string;
    paymentMethod?: string;
    confirmationCode?: string;
    notes?: string;
  }
): Promise<{
  message: string;
  bill: Bill;
  payment: {
    amount: number;
    paidDate: string;
    wasOnTime: boolean;
    daysLate: number;
  };
}> => {
  const response = await axiosInstance.post(`${BILLS_ENDPOINT}/${id}/pay`, paymentData);
  return response.data;
};

export const fetchBillPayments = async (
  id: number,
  params: {
    limit?: number;
    offset?: number;
  } = {}
): Promise<BillPaymentsResponse> => {
  const response = await axiosInstance.get(`${BILLS_ENDPOINT}/${id}/payments`, { params });
  return response.data;
};

export const fetchUpcomingBills = async (days: number = 30): Promise<Bill[]> => {
  const response = await axiosInstance.get(`${BILLS_ENDPOINT}/upcoming`, {
    params: { days }
  });
  return response.data;
};

export const fetchOverdueBills = async (): Promise<Bill[]> => {
  const response = await axiosInstance.get(`${BILLS_ENDPOINT}/overdue`);
  return response.data;
};

export const sendBillReminder = async (id: number): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await axiosInstance.post(`${BILLS_ENDPOINT}/${id}/remind`);
  return response.data;
};

export const fetchBillsDashboard = async (): Promise<BillsDashboard> => {
  const response = await axiosInstance.get(`${BILLS_ENDPOINT}/dashboard`);
  return response.data;
};

export const fetchBillsCalendar = async (params: {
  startDate: string;
  endDate: string;
  view?: 'month' | 'week' | 'day';
}): Promise<BillsCalendarResponse> => {
  const response = await axiosInstance.get(`${BILLS_ENDPOINT}/calendar`, { params });
  return response.data;
};

export const exportBillsToCalendar = async (params: {
  months?: number;
  includeOverdue?: boolean;
}): Promise<Blob> => {
  const response = await axiosInstance.get(`${BILLS_ENDPOINT}/export/calendar`, {
    params,
    responseType: 'blob'
  });
  return response.data;
};
