import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Card, FAB } from 'react-native-paper';
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
  const budgetRemaining = budgetData ? (budgetData.budget.amount - currentExpenses) : null;

  const QuickActionCard = ({ icon, title, subtitle, onPress, color = '#FF6384' }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#888',
  },
  metricsContainer: {
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metricText: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  quickActionContainer: {
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6384',
  },
});
