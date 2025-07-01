import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import StatsScreen from '../screens/StatsScreen';
import MoreScreen from '../screens/MoreScreen';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF6384',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'apps';

          if (route.name === 'Overview') iconName = 'grid-outline';
          else if (route.name === 'Transactions') iconName = 'wallet-outline';
          else if (route.name === 'Analytics') iconName = 'analytics-outline';
          else if (route.name === 'More') iconName = 'ellipsis-horizontal';

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Overview" 
        component={HomeScreen} 
        options={{ title: 'Overview' }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsScreen} 
        options={{ title: 'Transactions' }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={StatsScreen} 
        options={{ title: 'Analytics' }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreScreen} 
        options={{ title: 'More' }}
      />
    </Tab.Navigator>
  );
}
