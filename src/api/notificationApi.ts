import instance from './axiosInstance';

export const saveFCMToken = async (token: string): Promise<void> => {
  await instance.post('/api/notifications/save-token', { token });
};

export const sendNotification = async (notification: {
  title: string;
  body: string;
  data?: Record<string, string>;
}): Promise<void> => {
  await instance.post('/api/notifications/send', notification);
};
