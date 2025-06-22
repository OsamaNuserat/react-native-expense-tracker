import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../auth/LoginScreen';
import RegisterScreen from '../auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ShortcutInstructions from '../screens/ShortcutInstructions';
import MessagesScreen from '../screens/MessagesScreen';
import { RootStackParamList } from '../types';
import StatsScreen from '../screens/StatsScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    // force reload or navigate to login
  };

  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Home',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Button
                onPress={() => navigation.navigate('Messages')}
                title='Messages'
                color='#007bff'
              />
              <Button
                onPress={logout}
                title='Logout'
                color='#d9534f'
              />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name='ShortcutInstructions'
        component={ShortcutInstructions}
        options={{ title: 'Shortcut Instructions' }}
      />
      <Stack.Screen
        name='Messages'
        component={MessagesScreen}
        options={{ title: 'All Messages' }}
      />
    </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
});
