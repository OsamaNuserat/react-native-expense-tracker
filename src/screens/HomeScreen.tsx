import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Card } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { fetchExpensesByCategory, fetchIncomesByCategory } from '../api/categoryApi';
import { fetchExpensesSummary, fetchIncomesSummary } from '../api/summaryApi';
import { getSurvivalBudget } from '../api/budgetApi';
import CategoryBreakdown from '../components/CategoryBreakdown';
import SummaryCard from '../components/SummaryCard';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#1E1E1E',
  backgroundGradientTo: '#1E1E1E',
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

export default function HomeScreen() {
  const { data: expensesByCategory, isLoading: expensesLoading, refetch: refetchExpenses } = useQuery({
    queryKey: ['expensesByCategory'],
    queryFn: fetchExpensesByCategory,
  });

  const { data: incomesByCategory, isLoading: incomesLoading, refetch: refetchIncomes } = useQuery({
    queryKey: ['incomesByCategory'],
    queryFn: fetchIncomesByCategory,
  });

  const { data: expensesSummary, refetch: refetchExpensesSummary } = useQuery({
    queryKey: ['expensesSummary'],
    queryFn: fetchExpensesSummary,
  });

  const { data: incomesSummary, refetch: refetchIncomesSummary } = useQuery({
    queryKey: ['incomesSummary'],
    queryFn: fetchIncomesSummary,
  });

  const { data: budgetData, refetch: refetchBudget } = useQuery({
    queryKey: ['survivalBudget'],
    queryFn: getSurvivalBudget,
    retry: false, // Don't retry if no budget is set
  });

  const isRefreshing = expensesLoading || incomesLoading;

  const onRefresh = () => {
    refetchExpenses();
    refetchIncomes();
    refetchExpensesSummary();
    refetchIncomesSummary();
    refetchBudget();
  };

  // Calculate totals
  const totalExpenses = expensesSummary?.reduce((sum, item) => sum + item.total, 0) || 0;
  const totalIncomes = incomesSummary?.reduce((sum, item) => sum + item.total, 0) || 0;

  // Prepare pie chart data
  const pieChartData = expensesByCategory?.map((item, index) => ({
    name: item.category,
    amount: item.total,
    color: colors[index % colors.length],
    legendFontColor: '#FFF',
    legendFontSize: 14,
  })) || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
    >
      {/* Budget Summary Card */}
      {budgetData && (
        <Card style={styles.budgetCard}>
          <Card.Content>
            <Text style={styles.budgetTitle}>Weekly Budget</Text>
            <Text style={styles.budgetAmount}>
              JD {budgetData.currentWeek.remaining.toFixed(2)} remaining
            </Text>
            <Text style={styles.budgetSubtext}>
              Spent: JD {budgetData.currentWeek.spent.toFixed(2)} / JD {budgetData.weeklyBudget.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Income vs Expenses Summary */}
      <View style={styles.summaryContainer}>
        <SummaryCard 
          title="Income" 
          amount={totalIncomes} 
          color="#4CAF50"
        />
        <SummaryCard 
          title="Expenses" 
          amount={totalExpenses} 
          color="#FF5722"
        />
      </View>

      {/* Expenses Pie Chart */}
      {pieChartData.length > 0 && (
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>Expenses by Category</Text>
            <PieChart
              data={pieChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor={'amount'}
              backgroundColor={'transparent'}
              paddingLeft={'10'}
              center={[0, 0]}
              absolute
            />
          </Card.Content>
        </Card>
      )}

      {/* Category Breakdown */}
      <CategoryBreakdown 
        expenses={expensesByCategory} 
        incomes={incomesByCategory}
      />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  budgetCard: {
    marginBottom: 15,
    backgroundColor: '#2A2A2A',
  },
  budgetTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  budgetAmount: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  budgetSubtext: {
    color: '#AAA',
    fontSize: 14,
    marginTop: 5,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  chartCard: {
    marginBottom: 15,
    backgroundColor: '#2A2A2A',
  },
  chartTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});