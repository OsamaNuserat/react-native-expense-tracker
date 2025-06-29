import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

interface SummaryCardProps {
  title: string;
  amount: number;
  color: string;
}

export default function SummaryCard({ title, amount, color }: SummaryCardProps) {
  return (
    <Card style={[styles.card, { flex: 1, marginHorizontal: 5 }]}>
      <Card.Content>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.amount, { color }]}>
          JD {amount.toFixed(2)}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2A2A2A',
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
});