import React, { useContext } from 'react';
import { Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../auth/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ParseSMS from '../screens/Message';
import ShortcutInstructions from '../screens/ShortcutInstructions';
import RegisterScreen from '../auth/RegisterScreen';
import { AuthContext } from '../auth/authContext';
import { RootStackParamList } from '../types/index';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { userToken, logout } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {userToken ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Home',
              headerRight: () => <Button onPress={logout} title="Logout" color="#d9534f" />,
            }}
          />
          <Stack.Screen
            name="ShortcutInstructions"
            component={ShortcutInstructions}
            options={{ title: 'Shortcut Setup' }}
          />
          <Stack.Screen name="ParseSMS" component={ParseSMS} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
