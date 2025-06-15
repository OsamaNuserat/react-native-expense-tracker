import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/auth/authContext';
import AppNavigator from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
          <Toast />
        </QueryClientProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
