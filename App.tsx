import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppTabs from './src/navigation/AppTabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync } from './src/utils/notification';
import { Button, View } from 'react-native';
import * as Notifications from 'expo-notifications';



export default function App() {
const notificationListener = useRef<any>(null);
const responseListener = useRef<any>(null);


  useEffect(() => {
    const setupNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      const jwt = await AsyncStorage.getItem('token');
      if (token && jwt) {
        await fetch('http://0.0.0.0:3000/api/notifications/save-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ token }),
        });
        console.log('Token saved:', token);
      }
    };

    setupNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const logTokenManually = async () => {
    const token = await registerForPushNotificationsAsync();
    console.log('Expo Push Token:', token);
  };

  return (
    <NavigationContainer>
      <AppTabs />
      <View style={{ position: 'absolute', bottom: 40, left: 20, right: 20 }}>
        <Button title="Log Expo Push Token" onPress={logTokenManually} />
      </View>
    </NavigationContainer>
  );
}
