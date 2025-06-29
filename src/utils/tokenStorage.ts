import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

export const tokenStorage = {
  // Store tokens securely
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken)
    ]);
  },

  // Get access token
  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  // Get refresh token
  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  // Store user data
  async setUserData(userData: any): Promise<void> {
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
  },

  // Get user data
  async getUserData(): Promise<any | null> {
    const data = await SecureStore.getItemAsync(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Clear all tokens and user data
  async clearAll(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_DATA_KEY)
    ]);
  }
};
