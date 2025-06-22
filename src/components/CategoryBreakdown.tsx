import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const categories = [
  { name: 'Car', amount: 49, color: '#FF6384' },
  { name: 'Other', amount: 25.7, color: '#FFCD56' },
  { name: 'Social Life', amount: 17.6, color: '#FF9F40' },
  { name: 'Food', amount: 6.45, color: '#FFE600' },
  { name: 'Cloud & Domain', amount: 6.3, color: '#00C49F' },
  { name: 'Groceries', amount: 1.4, color: '#4BC0C0' },
];

export default function CategoryBreakdown() {
  return (
    <View style={styles.container}>
      {categories.map((cat, index) => (
        <View key={index} style={styles.row}>
          <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
          <Text style={styles.name}>{cat.name}</Text>
          <Text style={styles.amount}>JD {cat.amount}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
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
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
