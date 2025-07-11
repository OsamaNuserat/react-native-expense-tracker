import instance from './axiosInstance';

export const saveExpoPushToken = async (token: string): Promise<void> => {
  await instance.post('/api/notifications/save-token', { token });
};

export const saveFCMToken = saveExpoPushToken;

export const sendNotification = async (notification: {
  title: string;
  body: string;
  data?: Record<string, string>;
}): Promise<void> => {
  await instance.post('/api/notifications/send', notification);
};
