import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

export const tokenStorage = {
  // Store tokens securely
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      console.log('💾 TokenStorage.setTokens:', {
        accessTokenLength: accessToken?.length || 0,
        refreshTokenLength: refreshToken?.length || 0,
        accessTokenStart: accessToken?.substring(0, 20) || 'null',
        refreshTokenStart: refreshToken?.substring(0, 20) || 'null'
      });
      
      await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken)
      ]);
      
      console.log('✅ Tokens stored successfully');
    } catch (error) {
      console.error('❌ Error storing tokens:', error);
      throw error;
    }
  },

  // Get access token
  async getAccessToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      console.log('🔑 TokenStorage.getAccessToken:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenStart: token?.substring(0, 20) || 'null'
      });
      return token;
    } catch (error) {
      console.error('❌ Error getting access token:', error);
      return null;
    }
  },

  // Get refresh token
  async getRefreshToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      console.log('🔄 TokenStorage.getRefreshToken:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenStart: token?.substring(0, 20) || 'null'
      });
      return token;
    } catch (error) {
      console.error('❌ Error getting refresh token:', error);
      return null;
    }
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
