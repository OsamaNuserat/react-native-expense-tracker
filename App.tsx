import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/auth/authContext';
import { registerForPushNotificationsAsync } from './src/utils/notification';
import { saveFCMToken } from './src/api/notificationApi';
import { useAuth } from './src/hooks/useAuth';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);
  const { userToken } = useAuth();

  useEffect(() => {
    const setupNotifications = async () => {
      if (!userToken) return;
      
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await saveFCMToken(token);
          console.log('✅ FCM Token saved:', token);
        }
      } catch (error) {
        console.error('❌ Error setting up notifications:', error);
      }
    };

    setupNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('✅ Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('✅ Notification response data:', data);

      if (data?.messageId && navigationRef.current) {
        navigationRef.current.navigate('CliqCategory', { messageId: data.messageId });
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [userToken]);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <AuthProvider>
          <AppContent />
          <Toast />
        </AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
