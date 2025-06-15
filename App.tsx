// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/auth/authContext';
import AppNavigator from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

// Import React Query stuff
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create the client
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
