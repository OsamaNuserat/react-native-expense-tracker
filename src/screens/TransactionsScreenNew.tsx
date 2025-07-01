import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, SegmentedButtons, Chip, FAB, Searchbar } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';

import { fetchExpenses, fetchIncomes } from '../api/transactionApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Expense, Income } from '../types';

type Transaction = (Expense | Income) & { type: 'expense' | 'income' };

export default function TransactionsScreen() {
  const [selectedType, setSelectedType] = useState<'all' | 'expenses' | 'incomes'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: expenses, isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
  });

  const { data: incomes, isLoading: incomesLoading } = useQuery<Income[]>({
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
    let transactions = getAllTransactions();
    
    // Filter by type
    switch (selectedType) {
      case 'expenses':
        transactions = transactions.filter(t => t.type === 'expense');
        break;
      case 'incomes':
        transactions = transactions.filter(t => t.type === 'income');
        break;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      transactions = transactions.filter(t => 
        (t.merchant || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.amount.toString().includes(searchQuery)
      );
    }

    return transactions;
  };

  const calculateTotals = () => {
    const filtered = getFilteredTransactions();
    const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalIncomes = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    
    return { totalExpenses, totalIncomes, count: filtered.length };
  };

  const totals = calculateTotals();

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity>
      <Card style={styles.transactionCard}>
        <Card.Content>
          <View style={styles.transactionHeader}>
            <View style={styles.transactionInfo}>
              <View style={styles.merchantRow}>
                <Icon 
                  name={item.type === 'expense' ? 'arrow-down-circle' : 'arrow-up-circle'} 
                  size={20} 
                  color={item.type === 'expense' ? '#FF6384' : '#4CAF50'} 
                />
                <Text variant="titleMedium" style={styles.merchant}>
                  {item.merchant || 'Unknown Merchant'}
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.date}>
                {formatDate(item.createdAt)}
              </Text>
              {item.category?.name && (
                <Text variant="bodySmall" style={styles.description}>
                  {item.category.name}
                </Text>
              )}
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
                compact
              >
                {item.type.toUpperCase()}
              </Chip>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const filteredTransactions = getFilteredTransactions();

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search transactions..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={{ color: '#FFF' }}
        placeholderTextColor="#888"
      />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={selectedType}
          onValueChange={(value) => setSelectedType(value as typeof selectedType)}
          buttons={[
            {
              value: 'all',
              label: 'All',
              icon: 'swap-vertical',
            },
            {
              value: 'expenses',
              label: 'Expenses',
              icon: 'trending-down',
            },
            {
              value: 'incomes',
              label: 'Income',
              icon: 'trending-up',
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Summary Card */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.summaryTitle}>
            {selectedType === 'all' ? 'All Transactions' : 
             selectedType === 'expenses' ? 'Total Expenses' : 'Total Income'}
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Count</Text>
              <Text style={styles.summaryValue}>{totals.count}</Text>
            </View>
            {selectedType !== 'incomes' && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Expenses</Text>
                <Text style={[styles.summaryValue, { color: '#FF6384' }]}>
                  {formatCurrency(totals.totalExpenses)}
                </Text>
              </View>
            )}
            {selectedType !== 'expenses' && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Income</Text>
                <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                  {formatCurrency(totals.totalIncomes)}
                </Text>
              </View>
            )}
            {selectedType === 'all' && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Net</Text>
                <Text style={[
                  styles.summaryValue, 
                  { color: (totals.totalIncomes - totals.totalExpenses) >= 0 ? '#4CAF50' : '#FF6384' }
                ]}>
                  {formatCurrency(totals.totalIncomes - totals.totalExpenses)}
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="receipt-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No transactions found' : 'No transactions yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Add your first transaction to get started'}
            </Text>
          </View>
        }
      />

      {/* Add Transaction FAB */}
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
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  headerContainer: {
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#2A2A2A',
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: '#2A2A2A',
  },
  summaryCard: {
    backgroundColor: '#2A2A2A',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  transactionCard: {
    backgroundColor: '#2A2A2A',
    marginBottom: 8,
    borderRadius: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 16,
  },
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  merchant: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    color: '#888',
    fontSize: 12,
    marginBottom: 2,
  },
  description: {
    color: '#CCC',
    fontSize: 12,
    fontStyle: 'italic',
  },
  amountContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expenseAmount: {
    color: '#FF6384',
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  typeChip: {
    backgroundColor: 'transparent',
  },
  expenseChip: {
    borderColor: '#FF6384',
  },
  incomeChip: {
    borderColor: '#4CAF50',
  },
  chipText: {
    fontSize: 10,
    color: '#FFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6384',
  },
});
