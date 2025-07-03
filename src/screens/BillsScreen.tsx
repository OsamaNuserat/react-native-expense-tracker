import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, FAB, Chip, Button, SegmentedButtons } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import {
  fetchBills,
  fetchBillsDashboard,
  markBillAsPaid,
  sendBillReminder,
  deleteBill
} from '../api/billsApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Bill, BillsDashboard } from '../types';
import AddBillModal from '../components/AddBillModal';

const BILL_COLORS = {
  WEEKLY: '#4ECDC4',
  MONTHLY: '#45B7D1', 
  QUARTERLY: '#96CEB4',
  YEARLY: '#A29BFE',
  CUSTOM: '#DDA0DD'
};

const PRIORITY_COLORS = {
  overdue: '#FF6B6B',
  dueToday: '#FFEAA7',
  dueSoon: '#FD79A8',
  upcoming: '#74B9FF'
};

export default function BillsScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editBill, setEditBill] = useState<Bill | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'overdue'>('all');

  const { data: billsData, isLoading: billsLoading, refetch: refetchBills, error: billsError } = useQuery({
    queryKey: ['bills', activeFilter],
    queryFn: () => {
      const params: any = {};
      if (activeFilter === 'upcoming') {
        params.upcoming = true;
      } else if (activeFilter === 'overdue') {
        params.isOverdue = true;
      }
      return fetchBills(params);
    },
  });

  const { data: dashboard, isLoading: dashboardLoading, refetch: refetchDashboard } = useQuery({
    queryKey: ['bills-dashboard'],
    queryFn: fetchBillsDashboard,
  });

  React.useEffect(() => {
    if (billsError) {
      console.error('Error fetching bills:', billsError);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: billsError?.message?.includes('Invalid bill ID') 
          ? 'Invalid bill data detected. Please contact support.'
          : 'Failed to load bills. Please try again.',
      });
    }
  }, [billsError]);

  const markAsPaidMutation = useMutation({
    mutationFn: ({ billId, amount }: { billId: number; amount: number }) =>
      markBillAsPaid(billId, { amount }),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Bill marked as paid successfully',
      });
      refetchBills();
      refetchDashboard();
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
    mutationFn: (billId: number) => sendBillReminder(billId),
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
    mutationFn: (billId: number) => deleteBill(billId),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Bill deleted successfully',
      });
      refetchBills();
      refetchDashboard();
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete bill',
      });
    },
  });

  const onRefresh = async () => {
    await Promise.all([refetchBills(), refetchDashboard()]);
  };

  const getBillPriority = (bill: Bill): keyof typeof PRIORITY_COLORS => {
    if (bill.isOverdue) return 'overdue';
    
    const daysUntilDue = Math.ceil((new Date(bill.nextDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue === 0) return 'dueToday';
    if (daysUntilDue <= 3) return 'dueSoon';
    return 'upcoming';
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

  const BillCard = ({ bill }: { bill: Bill }) => {
    const priority = getBillPriority(bill);
    const color = PRIORITY_COLORS[priority];
    const frequencyColor = BILL_COLORS[bill.frequency];

    const handleEditBill = () => {
      setEditBill(bill);
      setIsAddModalVisible(true);
    };

    const handleMarkAsPaid = () => {
      if (bill.amount) {
        markAsPaidMutation.mutate({ billId: bill.id, amount: bill.amount });
      }
    };

    return (
      <TouchableOpacity 
        style={styles.billCard}
        onPress={() => {
          // Navigate to bill details
          console.log('Navigate to bill detail:', bill.id);
        }}
        onLongPress={handleEditBill}
        delayLongPress={500}
      >
        <Card style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
          <Card.Content>
            {/* Header */}
            <View style={styles.billHeader}>
              <View style={styles.billTitleRow}>
                <Icon name={getBillIcon(bill.name)} size={24} color={color} />
                <View style={styles.billInfo}>
                  <Text style={styles.billTitle} numberOfLines={1}>{bill.name}</Text>
                  <Text style={styles.billPayee} numberOfLines={1}>{bill.payee}</Text>
                </View>
                <View style={styles.billActions}>
                  <Chip 
                    style={[styles.frequencyChip, { backgroundColor: frequencyColor }]}
                    textStyle={styles.chipText}
                    compact
                  >
                    {bill.frequency}
                  </Chip>
                </View>
              </View>
            </View>

            {/* Amount and Due Date */}
            <View style={styles.billDetails}>
              <View style={styles.amountSection}>
                <Text style={styles.amountLabel}>Amount</Text>
                <Text style={styles.amount}>
                  {bill.amount ? formatCurrency(bill.amount) : 'Variable'}
                </Text>
              </View>
              <View style={styles.dueDateSection}>
                <Text style={styles.dueDateLabel}>Due Date</Text>
                <Text style={[styles.dueDate, { color }]}>
                  {formatDate(bill.nextDueDate)}
                </Text>
                {bill.isOverdue && (
                  <Text style={styles.overdueText}>
                    {bill.overdueByDays} day{bill.overdueByDays > 1 ? 's' : ''} overdue
                  </Text>
                )}
              </View>
            </View>

            {/* Category */}
            {bill.category && (
              <View style={styles.categorySection}>
                <Icon name="folder-outline" size={16} color="#888" />
                <Text style={styles.categoryText}>{bill.category.name}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={() => sendReminderMutation.mutate(bill.id)}
                style={styles.actionButton}
                textColor="#4ECDC4"
                loading={sendReminderMutation.isPending}
                disabled={sendReminderMutation.isPending}
              >
                Remind
              </Button>
              {bill.amount && !bill.isOverdue && (
                <Button
                  mode="contained"
                  onPress={handleMarkAsPaid}
                  style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                  loading={markAsPaidMutation.isPending}
                  disabled={markAsPaidMutation.isPending}
                >
                  Pay
                </Button>
              )}
              {bill.isOverdue && bill.amount && (
                <Button
                  mode="contained"
                  onPress={handleMarkAsPaid}
                  style={[styles.actionButton, { backgroundColor: '#FF6B6B' }]}
                  loading={markAsPaidMutation.isPending}
                  disabled={markAsPaidMutation.isPending}
                >
                  Pay Now
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const DashboardCard = ({ dashboard }: { dashboard: BillsDashboard }) => (
    <Card style={styles.dashboardCard}>
      <Card.Content>
        <Text style={styles.dashboardTitle}>Bills Overview</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{dashboard.activeBills}</Text>
            <Text style={styles.statLabel}>Active Bills</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#FF6B6B' }]}>
              {dashboard.overdueBills.count}
            </Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#FFEAA7' }]}>
              {dashboard.dueThisWeek.count}
            </Text>
            <Text style={styles.statLabel}>Due This Week</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {formatCurrency(dashboard.totalPaidThisMonth)}
            </Text>
            <Text style={styles.statLabel}>Paid This Month</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const bills = billsData?.bills || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={billsLoading || dashboardLoading} 
            onRefresh={onRefresh}
            tintColor="#FF6384"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bills</Text>
          <Text style={styles.headerSubtitle}>Track and manage your recurring bills</Text>
        </View>

        {/* Dashboard */}
        {dashboard && <DashboardCard dashboard={dashboard} />}

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <SegmentedButtons
            value={activeFilter}
            onValueChange={(value) => setActiveFilter(value as typeof activeFilter)}
            buttons={[
              {
                value: 'all',
                label: 'All',
                icon: 'list',
              },
              {
                value: 'upcoming',
                label: 'Upcoming',
                icon: 'calendar',
              },
              {
                value: 'overdue',
                label: 'Overdue',
                icon: 'alert-circle',
              },
            ]}
            style={styles.segmentedButtons}
            theme={{ colors: { onSurface: '#FFF', outline: '#666' } }}
          />
        </View>

        {/* Bills List */}
        <View style={styles.billsList}>
          {bills.length > 0 ? (
            bills.map(bill => (
              <BillCard key={bill.id} bill={bill} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="receipt-outline" size={64} color="#888" />
              <Text style={styles.emptyTitle}>No Bills Found</Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === 'all' 
                  ? 'Add your first bill to get started'
                  : `No ${activeFilter} bills at the moment`
                }
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Bill FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setIsAddModalVisible(true)}
        color="#FFF"
      />

      {/* Add/Edit Bill Modal */}
      <AddBillModal
        visible={isAddModalVisible}
        onDismiss={() => {
          setIsAddModalVisible(false);
          setEditBill(null);
        }}
        editBill={editBill}
        onSuccess={() => {
          setIsAddModalVisible(false);
          setEditBill(null);
          refetchBills();
          refetchDashboard();
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
  },
  dashboardCard: {
    backgroundColor: '#2A2A2A',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  segmentedButtons: {
    backgroundColor: '#2A2A2A',
  },
  billsList: {
    paddingHorizontal: 20,
  },
  billCard: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
  },
  billHeader: {
    marginBottom: 16,
  },
  billTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  billInfo: {
    flex: 1,
  },
  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  billPayee: {
    fontSize: 14,
    color: '#AAA',
  },
  billActions: {
    alignItems: 'flex-end',
  },
  frequencyChip: {
    borderRadius: 12,
  },
  chipText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  billDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountSection: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dueDateSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dueDateLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  overdueText: {
    fontSize: 10,
    color: '#FF6B6B',
    marginTop: 2,
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4ECDC4',
  },
});
