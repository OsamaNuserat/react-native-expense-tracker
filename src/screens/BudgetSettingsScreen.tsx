import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, TextInput, Button, Chip } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { getSurvivalBudget, createSurvivalBudget } from '../api/budgetApi';
import { BudgetSummary } from '../types';

export default function BudgetSettingsScreen() {
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const queryClient = useQueryClient();

  const { 
    data: budget, 
    isLoading 
  } = useQuery<BudgetSummary>({
    queryKey: ['budget'],
    queryFn: getSurvivalBudget,
  });

  const createBudgetMutation = useMutation({
    mutationFn: createSurvivalBudget,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Budget created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      setAmount('');
      setStartDate('');
      setEndDate('');
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create budget',
      });
    },
  });

  const handleCreateBudget = () => {
    if (!amount || !startDate || !endDate) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    createBudgetMutation.mutate({
      amount: parseFloat(amount),
      startDate,
      endDate,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} JOD`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      {/* Current Budget Info */}
      {budget && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Current Budget</Text>
            
            <View style={styles.budgetInfo}>
              <View style={styles.budgetRow}>
                <Text style={styles.label}>Total Budget:</Text>
                <Text style={styles.value}>{formatCurrency(budget.budget.amount)}</Text>
              </View>
              
              <View style={styles.budgetRow}>
                <Text style={styles.label}>Period:</Text>
                <Text style={styles.value}>
                  {formatDate(budget.budget.startDate)} - {formatDate(budget.budget.endDate)}
                </Text>
              </View>
              
              <View style={styles.budgetRow}>
                <Text style={styles.label}>Weekly Budget:</Text>
                <Text style={styles.value}>{formatCurrency(budget.weeklyBudget)}</Text>
              </View>
              
              <View style={styles.budgetRow}>
                <Text style={styles.label}>This Week Spent:</Text>
                <Text style={[styles.value, styles.spent]}>
                  {formatCurrency(budget.currentWeek.spent)}
                </Text>
              </View>
              
              <View style={styles.budgetRow}>
                <Text style={styles.label}>Remaining:</Text>
                <Text style={[
                  styles.value, 
                  budget.currentWeek.remaining >= 0 ? styles.positive : styles.negative
                ]}>
                  {formatCurrency(budget.currentWeek.remaining)}
                </Text>
              </View>
            </View>
            
            <View style={styles.statusContainer}>
              <Chip 
                icon={budget.currentWeek.remaining >= 0 ? 'check-circle' : 'alert-circle'}
                style={[
                  styles.statusChip,
                  budget.currentWeek.remaining >= 0 ? styles.onTrack : styles.overBudget
                ]}
              >
                {budget.currentWeek.remaining >= 0 ? 'On Track' : 'Over Budget'}
              </Chip>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Create New Budget */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            {budget ? 'Update Budget' : 'Create Budget'}
          </Text>
          <Text style={styles.subtitle}>
            Set up your survival budget to track weekly spending
          </Text>

          <TextInput
            label="Budget Amount (JOD)"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., 500"
            keyboardType="decimal-pad"
            theme={{
              colors: {
                primary: '#FF6384',
                background: '#2A2A2A',
                surface: '#2A2A2A',
                onSurface: '#FFF',
              }
            }}
          />

          <TextInput
            label="Start Date"
            value={startDate}
            onChangeText={setStartDate}
            mode="outlined"
            style={styles.input}
            placeholder="YYYY-MM-DD"
            theme={{
              colors: {
                primary: '#FF6384',
                background: '#2A2A2A',
                surface: '#2A2A2A',
                onSurface: '#FFF',
              }
            }}
          />

          <TextInput
            label="End Date"
            value={endDate}
            onChangeText={setEndDate}
            mode="outlined"
            style={styles.input}
            placeholder="YYYY-MM-DD"
            theme={{
              colors: {
                primary: '#FF6384',
                background: '#2A2A2A',
                surface: '#2A2A2A',
                onSurface: '#FFF',
              }
            }}
          />

          <Button 
            mode="contained" 
            onPress={handleCreateBudget}
            style={styles.submitButton}
            loading={createBudgetMutation.isPending}
            disabled={!amount || !startDate || !endDate}
          >
            {budget ? 'Update Budget' : 'Create Budget'}
          </Button>
        </Card.Content>
      </Card>

      {!budget && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.helpTitle}>How it works</Text>
            <Text style={styles.helpText}>
              • Set a total budget amount for a specific period{'\n'}
              • Budget is automatically divided into weekly amounts{'\n'}
              • Track your spending against weekly targets{'\n'}
              • Get alerts when you're approaching limits
            </Text>
          </Card.Content>
        </Card>
      )}
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
    padding: 15,
  },
  card: {
    backgroundColor: '#2A2A2A',
    marginBottom: 15,
  },
  cardTitle: {
    color: '#FFF',
    marginBottom: 15,
  },
  subtitle: {
    color: '#AAA',
    marginBottom: 20,
  },
  budgetInfo: {
    marginBottom: 20,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#AAA',
    fontSize: 16,
  },
  value: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spent: {
    color: '#FF6384',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  statusChip: {
    paddingHorizontal: 16,
  },
  onTrack: {
    backgroundColor: '#4CAF50',
  },
  overBudget: {
    backgroundColor: '#F44336',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#2A2A2A',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#FF6384',
  },
  helpTitle: {
    color: '#FFF',
    marginBottom: 12,
  },
  helpText: {
    color: '#AAA',
    lineHeight: 20,
  },
});
