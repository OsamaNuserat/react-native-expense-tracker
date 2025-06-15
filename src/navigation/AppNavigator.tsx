import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../auth/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ParseSMS from '../screens/Message';
import { AuthContext } from '../auth/authContext';
import RegisterScreen from '../auth/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {userToken ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
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
