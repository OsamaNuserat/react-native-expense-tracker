import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, IconButton, Chip, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import {
  fetchBillById,
  fetchBillPayments,
  markBillAsPaid,
  sendBillReminder,
  deleteBill
} from '../api/billsApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Bill, BillPayment } from '../types';
import AddBillModal from '../components/AddBillModal';

interface BillDetailsRouteParams {
  billId: number;
}

export default function BillDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
  const { billId } = route.params as BillDetailsRouteParams;
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { data: bill, isLoading: billLoading, refetch: refetchBill } = useQuery({
    queryKey: ['bill', billId],
    queryFn: () => fetchBillById(billId),
  });

  const { data: paymentsData, isLoading: paymentsLoading, refetch: refetchPayments } = useQuery({
    queryKey: ['bill-payments', billId],
    queryFn: () => fetchBillPayments(billId),
  });

  const markAsPaidMutation = useMutation({
    mutationFn: (amount: number) => markBillAsPaid(billId, { amount }),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Bill marked as paid successfully',
      });
      refetchBill();
      refetchPayments();
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to mark bill as paid',
      });
    },
  });

  const sendReminderMutation = useMutation({
    mutationFn: () => sendBillReminder(billId),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Reminder Sent',
        text2: 'Bill reminder sent successfully',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send reminder',
      });
    },
  });

  const deleteBillMutation = useMutation({
    mutationFn: () => deleteBill(billId),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Bill deleted successfully',
      });
      navigation.goBack();
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete bill',
      });
    },
  });

  if (billLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Loading bill details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!bill) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color="#FF6B6B" />
          <Text style={styles.errorText}>Bill not found</Text>
          <Button mode="outlined" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const getBillStatusColor = () => {
    if (bill.isOverdue) return '#FF6B6B';
    
    const daysUntilDue = Math.ceil((new Date(bill.nextDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue === 0) return '#FFEAA7';
    if (daysUntilDue <= 3) return '#FD79A8';
    return '#74B9FF';
  };

  const getBillIcon = (billName: string): string => {
    const name = billName.toLowerCase();
    if (name.includes('electric') || name.includes('power')) return 'flash';
    if (name.includes('water')) return 'water';
    if (name.includes('internet') || name.includes('wifi')) return 'wifi';
    if (name.includes('rent')) return 'home';
    if (name.includes('car') || name.includes('insurance')) return 'car';
    if (name.includes('phone') || name.includes('mobile')) return 'phone-portrait';
    if (name.includes('gas')) return 'flame';
    if (name.includes('gym') || name.includes('fitness')) return 'fitness';
    return 'receipt';
  };

  const PaymentHistoryItem = ({ payment }: { payment: BillPayment }) => (
    <Card style={styles.paymentCard}>
      <Card.Content>
        <View style={styles.paymentHeader}>
          <View>
            <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
            <Text style={styles.paymentDate}>{formatDate(payment.paidDate)}</Text>
          </View>
          <View style={styles.paymentStatus}>
            <Chip
              style={[
                styles.statusChip,
                { backgroundColor: payment.wasOnTime ? '#4CAF50' : '#FF9500' }
              ]}
              textStyle={styles.statusText}
            >
              {payment.wasOnTime ? 'On Time' : `${payment.daysLate} days late`}
            </Chip>
          </View>
        </View>
        {payment.paymentMethod && (
          <Text style={styles.paymentMethod}>
            Payment Method: {payment.paymentMethod}
          </Text>
        )}
        {payment.confirmationCode && (
          <Text style={styles.confirmationCode}>
            Confirmation: {payment.confirmationCode}
          </Text>
        )}
        {payment.notes && (
          <Text style={styles.paymentNotes}>{payment.notes}</Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor="#FFF"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>{bill.name}</Text>
        <IconButton
          icon="pencil"
          size={24}
          iconColor="#FFF"
          onPress={() => setIsEditModalVisible(true)}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Bill Overview */}
        <Card style={[styles.card, { borderLeftColor: getBillStatusColor(), borderLeftWidth: 4 }]}>
          <Card.Content>
            <View style={styles.billOverview}>
              <View style={styles.billIconContainer}>
                <Icon name={getBillIcon(bill.name)} size={40} color={getBillStatusColor()} />
              </View>
              <View style={styles.billMainInfo}>
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billPayee}>{bill.payee}</Text>
                <Text style={styles.billDescription}>{bill.description}</Text>
              </View>
            </View>

            <View style={styles.billDetailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Amount</Text>
                <Text style={styles.detailValue}>
                  {bill.amount ? formatCurrency(bill.amount) : 'Variable'}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Next Due</Text>
                <Text style={[styles.detailValue, { color: getBillStatusColor() }]}>
                  {formatDate(bill.nextDueDate)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Frequency</Text>
                <Text style={styles.detailValue}>{bill.frequency}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>
                  {bill.category?.name || 'Uncategorized'}
                </Text>
              </View>
            </View>

            {bill.isOverdue && (
              <View style={styles.overdueWarning}>
                <Icon name="alert-circle" size={16} color="#FF6B6B" />
                <Text style={styles.overdueText}>
                  {bill.overdueByDays} day{bill.overdueByDays > 1 ? 's' : ''} overdue
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            mode="outlined"
            onPress={() => sendReminderMutation.mutate()}
            style={styles.actionButton}
            icon="bell"
            loading={sendReminderMutation.isPending}
          >
            Send Reminder
          </Button>
          
          {bill.amount && (
            <Button
              mode="contained"
              onPress={() => markAsPaidMutation.mutate(bill.amount!)}
              style={[styles.actionButton, { backgroundColor: getBillStatusColor() }]}
              icon="check"
              loading={markAsPaidMutation.isPending}
            >
              Mark as Paid
            </Button>
          )}
        </View>

        {/* Payment History */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Payment History</Text>
            {paymentsLoading ? (
              <ActivityIndicator style={styles.loadingIndicator} />
            ) : paymentsData?.payments && paymentsData.payments.length > 0 ? (
              paymentsData.payments.map((payment) => (
                <PaymentHistoryItem key={payment.id} payment={payment} />
              ))
            ) : (
              <View style={styles.emptyPayments}>
                <Icon name="receipt-outline" size={32} color="#888" />
                <Text style={styles.emptyText}>No payment history</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerCard}>
          <Card.Content>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <Button
              mode="outlined"
              onPress={() => deleteBillMutation.mutate()}
              style={styles.deleteButton}
              textColor="#FF6B6B"
              icon="delete"
              loading={deleteBillMutation.isPending}
            >
              Delete Bill
            </Button>
          </Card.Content>
        </Card>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Edit Bill Modal */}
      <AddBillModal
        visible={isEditModalVisible}
        onDismiss={() => setIsEditModalVisible(false)}
        editBill={bill}
        onSuccess={() => {
          setIsEditModalVisible(false);
          refetchBill();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#2A2A2A',
    marginBottom: 16,
    borderRadius: 12,
  },
  billOverview: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  billIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  billMainInfo: {
    flex: 1,
  },
  billName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  billPayee: {
    fontSize: 16,
    color: '#AAA',
    marginBottom: 4,
  },
  billDescription: {
    fontSize: 14,
    color: '#888',
  },
  billDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  overdueWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  overdueText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginLeft: 8,
    fontWeight: '500',
  },
  actionSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  loadingIndicator: {
    paddingVertical: 20,
  },
  paymentCard: {
    backgroundColor: '#333',
    marginBottom: 12,
    borderRadius: 8,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  paymentDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  paymentStatus: {
    alignItems: 'flex-end',
  },
  statusChip: {
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#AAA',
    marginBottom: 2,
  },
  confirmationCode: {
    fontSize: 12,
    color: '#AAA',
    marginBottom: 2,
  },
  paymentNotes: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  emptyPayments: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  dangerCard: {
    backgroundColor: '#2A2A2A',
    borderColor: '#FF6B6B',
    borderWidth: 1,
    marginBottom: 16,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: '#FF6B6B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#AAA',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
});
