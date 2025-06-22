// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import CategoryBreakdown from '../components/CategoryBreakdown';

const screenWidth = Dimensions.get('window').width;

const data = [
  { name: 'Car', amount: 49, color: '#FF6384', legendFontColor: '#FFF', legendFontSize: 14 },
  { name: 'Other', amount: 25.7, color: '#FFCD56', legendFontColor: '#FFF', legendFontSize: 14 },
  { name: 'Social Life', amount: 17.6, color: '#FF9F40', legendFontColor: '#FFF', legendFontSize: 14 },
  { name: 'Food', amount: 6.45, color: '#FFE600', legendFontColor: '#FFF', legendFontSize: 14 },
  { name: 'Cloud & Domain', amount: 6.3, color: '#00C49F', legendFontColor: '#FFF', legendFontSize: 14 },
  { name: 'Groceries', amount: 1.4, color: '#4BC0C0', legendFontColor: '#FFF', legendFontSize: 14 },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Income JD 102.457</Text>
        <Text style={styles.summaryText}>Exp. JD 106.450</Text>
      </View>

      <PieChart
        data={data}
        width={screenWidth - 20}
        height={220}
        chartConfig={chartConfig}
        accessor={'amount'}
        backgroundColor={'transparent'}
        paddingLeft={'10'}
        center={[0, 0]}
        absolute
      />

      <CategoryBreakdown />
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#1E1E1E',
  backgroundGradientTo: '#1E1E1E',
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});