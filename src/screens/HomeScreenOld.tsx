import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Card, Button, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { fetchExpensesSummary, fetchIncomesSummary } from '../api/summaryApi';
import { getSurvivalBudget } from '../api/budgetApi';
import { formatCurrency } from '../utils/formatters';

export default function HomeScreen() {
  const navigation = useNavigation();

  const { data: expensesSummary, isLoading: expensesLoading, refetch: refetchExpenses } = useQuery({
    queryKey: ['expensesSummary'],
    queryFn: fetchExpensesSummary,
  });

  const { data: incomesSummary, isLoading: incomesLoading, refetch: refetchIncomes } = useQuery({
    queryKey: ['incomesSummary'],
    queryFn: fetchIncomesSummary,
  });

  const { data: budgetData, isLoading: budgetLoading, refetch: refetchBudget } = useQuery({
    queryKey: ['survivalBudget'],
    queryFn: getSurvivalBudget,
    retry: false,
  });

  const onRefresh = async () => {
    await Promise.all([refetchExpenses(), refetchIncomes(), refetchBudget()]);
  };

  // Calculate current month totals
  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7); // YYYY-MM format
  
  const currentExpenses = expensesSummary?.find(item => 
    item.month.startsWith(currentMonth)
  )?.total || 0;
  
  const currentIncome = incomesSummary?.find(item => 
    item.month.startsWith(currentMonth)
  )?.total || 0;

  const balance = currentIncome - currentExpenses;
  const budgetRemaining = budgetData ? (budgetData.amount - currentExpenses) : null;

  const QuickActionCard = ({ icon, title, subtitle, onPress, color = '#FF6384' }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionCard}>
      <Card style={[styles.actionCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
        <Card.Content style={styles.actionContent}>
          <Icon name={icon} size={24} color={color} />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>{title}</Text>
            <Text style={styles.actionSubtitle}>{subtitle}</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#888" />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={expensesLoading || incomesLoading || budgetLoading} 
            onRefresh={onRefresh}
            tintColor="#FF6384"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.dateText}>
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

        {/* Key Metrics Cards */}
        <View style={styles.metricsContainer}>
          <Card style={[styles.metricCard, { backgroundColor: '#1A4D3A' }]}>
            <Card.Content style={styles.metricContent}>
              <Icon name="trending-up" size={32} color="#4CAF50" />
              <View style={styles.metricText}>
                <Text style={styles.metricLabel}>This Month Income</Text>
                <Text style={[styles.metricValue, { color: '#4CAF50' }]}>
                  {formatCurrency(currentIncome)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.metricCard, { backgroundColor: '#4D1A1A' }]}>
            <Card.Content style={styles.metricContent}>
              <Icon name="trending-down" size={32} color="#FF6384" />
              <View style={styles.metricText}>
                <Text style={styles.metricLabel}>This Month Expenses</Text>
                <Text style={[styles.metricValue, { color: '#FF6384' }]}>
                  {formatCurrency(currentExpenses)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.metricCard, { backgroundColor: balance >= 0 ? '#1A4D3A' : '#4D1A1A' }]}>
            <Card.Content style={styles.metricContent}>
              <Icon 
                name={balance >= 0 ? "wallet" : "warning"} 
                size={32} 
                color={balance >= 0 ? "#4CAF50" : "#FF6384"} 
              />
              <View style={styles.metricText}>
                <Text style={styles.metricLabel}>Net Balance</Text>
                <Text style={[
                  styles.metricValue, 
                  { color: balance >= 0 ? "#4CAF50" : "#FF6384" }
                ]}>
                  {formatCurrency(balance)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {budgetData && (
            <Card style={[
              styles.metricCard, 
              { backgroundColor: budgetRemaining && budgetRemaining > 0 ? '#1A3D4D' : '#4D1A1A' }
            ]}>
              <Card.Content style={styles.metricContent}>
                <Icon 
                  name="speedometer" 
                  size={32} 
                  color={budgetRemaining && budgetRemaining > 0 ? "#36A2EB" : "#FF6384"} 
                />
                <View style={styles.metricText}>
                  <Text style={styles.metricLabel}>Budget Remaining</Text>
                  <Text style={[
                    styles.metricValue, 
                    { color: budgetRemaining && budgetRemaining > 0 ? "#36A2EB" : "#FF6384" }
                  ]}>
                    {formatCurrency(budgetRemaining || 0)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <QuickActionCard
            icon="add-circle-outline"
            title="Add Transaction"
            subtitle="Record a new expense or income"
            onPress={() => {/* Navigate to add transaction */}}
            color="#FF6384"
          />
          
          <QuickActionCard
            icon="analytics-outline"
            title="View Analytics"
            subtitle="See detailed charts and insights"
            onPress={() => navigation.navigate('Analytics' as never)}
            color="#36A2EB"
          />
          
          <QuickActionCard
            icon="list-outline"
            title="All Transactions"
            subtitle="Browse your transaction history"
            onPress={() => navigation.navigate('Transactions' as never)}
            color="#FFCE56"
          />
          
          <QuickActionCard
            icon="repeat-outline"
            title="Recurring Payments"
            subtitle="Manage subscription and bills"
            onPress={() => navigation.navigate('More' as never)}
            color="#9966FF"
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Quick Add FAB */}
      <FAB
        icon="add"
        style={styles.fab}
        onPress={() => {/* Navigate to add transaction */}}
        color="#FFF"
      />
    </SafeAreaView>
  );
}
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