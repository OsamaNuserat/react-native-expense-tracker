import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ActivityIndicator, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';

import { fetchMessageById } from '../api/messagesApi';
import { formatDate, formatCurrency } from '../utils/formatters';
import { Message } from '../types';

export default function MessageDetails() {
  const route = useRoute();
  const { id } = route.params as { id: string };

  const { 
    data: message, 
    isLoading, 
    error 
  } = useQuery<Message>({
    queryKey: ['message', id],
    queryFn: () => fetchMessageById(id),
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6384" />
        <Text style={styles.loadingText}>Loading message...</Text>
      </SafeAreaView>
    );
  }

  if (error || !message) {
    return (
      <SafeAreaView style={styles.container}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.errorTitle}>Message Not Found</Text>
            <Text style={styles.errorText}>
              The requested message could not be found or has been deleted.
            </Text>
          </Card.Content>
        </Card>
      </SafeAreaView>
    );
  }

  const parsedData = message.parsedData;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Message Content */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Message Content</Text>
            <Text style={styles.messageContent}>{message.content}</Text>
            <Text variant="bodySmall" style={styles.messageDate}>
              Received: {formatDate(message.createdAt)}
            </Text>
          </Card.Content>
        </Card>

        {/* Parsed Information */}
        {parsedData && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.cardTitle}>Transaction Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Chip 
                  mode="outlined" 
                  style={[
                    styles.typeChip,
                    parsedData.type === 'expense' ? styles.expenseChip : styles.incomeChip
                  ]}
                >
                  {parsedData.type.toUpperCase()}
                </Chip>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount:</Text>
                <Text style={[
                  styles.detailValue, 
                  styles.amountText,
                  parsedData.type === 'expense' ? styles.expenseAmount : styles.incomeAmount
                ]}>
                  {parsedData.type === 'expense' ? '-' : '+'}{formatCurrency(parsedData.amount)}
                </Text>
              </View>

              {parsedData.merchant && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Merchant:</Text>
                  <Text style={styles.detailValue}>{parsedData.merchant}</Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailValue}>{parsedData.category}</Text>
              </View>

              {parsedData.source && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Source:</Text>
                  <Chip mode="outlined" style={styles.sourceChip}>
                    {parsedData.source}
                  </Chip>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Timestamp:</Text>
                <Text style={styles.detailValue}>{formatDate(parsedData.timestamp)}</Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {!parsedData && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.noDataTitle}>No Transaction Data</Text>
              <Text style={styles.noDataText}>
                This message could not be parsed into transaction data. It may be a notification or 
                promotional message that doesn't contain financial information.
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#2A2A2A',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#FFF',
    marginBottom: 16,
  },
  messageContent: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  messageDate: {
    color: '#CCC',
    fontSize: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  detailLabel: {
    color: '#CCC',
    fontSize: 16,
    fontWeight: '500',
    minWidth: 80,
  },
  detailValue: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expenseAmount: {
    color: '#FF5722',
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  typeChip: {
    marginLeft: 8,
  },
  expenseChip: {
    borderColor: '#FF5722',
    backgroundColor: 'rgba(255, 87, 34, 0.1)',
  },
  incomeChip: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  sourceChip: {
    marginLeft: 8,
    backgroundColor: 'rgba(255, 99, 132, 0.1)',
    borderColor: '#FF6384',
  },
  errorCard: {
    backgroundColor: '#2A2A2A',
    margin: 20,
  },
  errorTitle: {
    color: '#FF5722',
    marginBottom: 10,
  },
  errorText: {
    color: '#FFF',
  },
  noDataTitle: {
    color: '#FFF',
    marginBottom: 12,
  },
  noDataText: {
    color: '#CCC',
    lineHeight: 20,
  },
});
