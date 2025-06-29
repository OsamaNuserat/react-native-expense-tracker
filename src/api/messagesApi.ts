import instance from './axiosInstance';
import { Message, MessageParseResponse } from '../types';
import { createTransactionFromMessage } from './transactionApi';

export const fetchMessages = async (): Promise<Message[]> => {
  const { data } = await instance.get('/api/messages');
  return data;
};

export const fetchMessageById = async (id: string): Promise<Message> => {
  const { data } = await instance.get(`/api/messages/${id}`);
  return data;
};

export const parseSmsMessage = async (content: string, timestamp?: string): Promise<MessageParseResponse> => {
  const { data } = await instance.post('/api/messages/parse-sms', { content, timestamp });
  return data;
};

export const categorizeMessage = async (messageId: string, categoryId: number): Promise<any> => {
  return await createTransactionFromMessage(messageId, categoryId);
};
