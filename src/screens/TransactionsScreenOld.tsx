import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, SegmentedButtons, Chip } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';

import { fetchExpenses, fetchIncomes } from '../api/transactionApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Expense, Income } from '../types';

type Transaction = (Expense | Income) & { type: 'expense' | 'income' };

export default function TransactionsScreen() {
  const [selectedType, setSelectedType] = useState<'all' | 'expenses' | 'incomes'>('all');

  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
  });

  const { data: incomes } = useQuery<Income[]>({
    queryKey: ['incomes'],
    queryFn: fetchIncomes,
  });

  const getAllTransactions = (): Transaction[] => {
    const expenseTransactions: Transaction[] = (expenses || []).map(expense => ({
      ...expense,
      type: 'expense' as const,
    }));
    
    const incomeTransactions: Transaction[] = (incomes || []).map(income => ({
      ...income,
      type: 'income' as const,
    }));

    const allTransactions = [...expenseTransactions, ...incomeTransactions];
    return allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getFilteredTransactions = (): Transaction[] => {
    const allTransactions = getAllTransactions();
    
    switch (selectedType) {
      case 'expenses':
        return allTransactions.filter(t => t.type === 'expense');
      case 'incomes':
        return allTransactions.filter(t => t.type === 'income');
      default:
        return allTransactions;
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Card style={styles.transactionCard}>
      <Card.Content>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionInfo}>
            <Text variant="titleMedium" style={styles.merchant}>
              {item.merchant || 'Unknown Merchant'}
            </Text>
            <Text variant="bodySmall" style={styles.date}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={[
              styles.amount,
              item.type === 'expense' ? styles.expenseAmount : styles.incomeAmount
            ]}>
              {item.type === 'expense' ? '-' : '+'}{formatCurrency(item.amount)}
            </Text>
            <Chip 
              mode="outlined" 
              style={[
                styles.typeChip,
                item.type === 'expense' ? styles.expenseChip : styles.incomeChip
              ]}
              textStyle={styles.chipText}
            >
              {item.type.toUpperCase()}
            </Chip>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const filteredTransactions = getFilteredTransactions();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={selectedType}
          onValueChange={(value) => setSelectedType(value as typeof selectedType)}
          buttons={[
            {
              value: 'all',
              label: 'All',
            },
            {
              value: 'expenses',
              label: 'Expenses',
            },
            {
              value: 'incomes',
              label: 'Incomes',
            },
          ]}
        />
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={renderTransaction}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No transactions found</Text>
              <Text style={styles.emptySubtext}>
                Transactions will appear here when you parse messages or add manual entries
              </Text>
            </Card.Content>
          </Card>
        }
        style={styles.list}
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    padding: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 12,
  },
  transactionCard: {
    backgroundColor: '#2A2A2A',
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  merchant: {
    color: '#FFF',
    marginBottom: 4,
  },
  date: {
    color: '#AAA',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expenseAmount: {
    color: '#FF5722',
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  typeChip: {
    minWidth: 80,
  },
  expenseChip: {
    borderColor: '#FF5722',
  },
  incomeChip: {
    borderColor: '#4CAF50',
  },
  chipText: {
    fontSize: 10,
  },
  emptyCard: {
    backgroundColor: '#2A2A2A',
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 14,
  },
});
