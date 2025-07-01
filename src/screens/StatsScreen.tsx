import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Card, SegmentedButtons, Text } from 'react-native-paper';
import { ExpensesTab, IncomesTab, ByCategoryTab } from '../components/ChartsTabs';

const Tab = createMaterialTopTabNavigator();

export default function StatsScreen() {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  const TimeRangeSelector = () => (
    <Card style={styles.selectorCard}>
      <Card.Content>
        <Text style={styles.selectorTitle}>Time Range</Text>
        <SegmentedButtons
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as typeof timeRange)}
          buttons={[
            { value: 'month', label: 'This Month' },
            { value: 'quarter', label: '3 Months' },
            { value: 'year', label: 'This Year' },
          ]}
          style={styles.segmentedButtons}
        />
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.headerContainer} showsVerticalScrollIndicator={false}>
        <TimeRangeSelector />
      </ScrollView>
      
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
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen 
          name="Trends" 
          component={ExpensesTab} 
          options={{ title: 'Spending Trends' }}
        />
        <Tab.Screen 
          name="Categories" 
          component={ByCategoryTab} 
          options={{ title: 'By Category' }}
        />
        <Tab.Screen 
          name="Income" 
          component={IncomesTab} 
          options={{ title: 'Income Analysis' }}
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
  headerContainer: {
    padding: 16,
    maxHeight: 120,
  },
  selectorCard: {
    backgroundColor: '#2A2A2A',
    marginBottom: 8,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  segmentedButtons: {
    backgroundColor: '#1E1E1E',
  },
});
