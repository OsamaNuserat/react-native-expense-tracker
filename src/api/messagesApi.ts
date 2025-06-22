import instance from './axiosInstance';

export const fetchMessages = async (): Promise<
  { id: number; content: string; userId: number; createdAt: string }[]
> => {
  const { data } = await instance.get('/api/messages');
  return data;
};
