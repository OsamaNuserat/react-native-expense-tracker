import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ExpensesTab, IncomesTab, ByCategoryTab } from '../components/ChartsTabs';

const Tab = createMaterialTopTabNavigator();

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#FF6384',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#1E1E1E',
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#FF6384',
          },
        }}
      >
        <Tab.Screen 
          name="Expenses" 
          component={ExpensesTab} 
          options={{ title: 'Monthly Expenses' }}
        />
        <Tab.Screen 
          name="Income" 
          component={IncomesTab} 
          options={{ title: 'Monthly Income' }}
        />
        <Tab.Screen 
          name="Categories" 
          component={ByCategoryTab} 
          options={{ title: 'By Category' }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
});
