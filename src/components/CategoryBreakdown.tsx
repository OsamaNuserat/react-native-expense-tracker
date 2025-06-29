import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { CategorySummary } from '../types';

interface CategoryBreakdownProps {
  expenses?: CategorySummary[];
  incomes?: CategorySummary[];
}

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

export default function CategoryBreakdown({ expenses, incomes }: CategoryBreakdownProps) {
  const expenseItems = expenses || [];
  const incomeItems = incomes || [];

  if (expenseItems.length === 0 && incomeItems.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Category Breakdown</Text>
          <Text style={styles.noData}>No data available</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>Category Breakdown</Text>
        
        {expenseItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expenses</Text>
            {expenseItems.map((item, index) => (
              <View key={`expense-${index}`} style={styles.row}>
                <View style={[styles.colorDot, { backgroundColor: colors[index % colors.length] }]} />
                <Text style={styles.name}>{item.category}</Text>
                <Text style={styles.amount}>JD {item.total.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {incomeItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Income</Text>
            {incomeItems.map((item, index) => (
              <View key={`income-${index}`} style={styles.row}>
                <View style={[styles.colorDot, { backgroundColor: colors[(index + expenseItems.length) % colors.length] }]} />
                <Text style={styles.name}>{item.category}</Text>
                <Text style={[styles.amount, { color: '#4CAF50' }]}>JD {item.total.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2A2A2A',
    marginBottom: 15,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#AAA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  name: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  amount: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: '600',
  },
  noData: {
    color: '#AAA',
    textAlign: 'center',
    marginTop: 20,
  },
});
