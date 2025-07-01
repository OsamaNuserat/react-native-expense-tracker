import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, IconButton, FAB, ActivityIndicator, Icon } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { 
  fetchRecurringPayments, 
  toggleRecurringPaymentStatus, 
  deleteRecurringPayment,
  RecurringPayment 
} from '../api/recurringPaymentApi';
import AddRecurringPaymentModal from '../components/AddRecurringPaymentModal';

export default function RecurringPaymentsScreen({ navigation }: any) {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const { data: recurringData, isLoading, error } = useQuery({
    queryKey: ['recurringPayments'],
    queryFn: () => fetchRecurringPayments(),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      toggleRecurringPaymentStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
      Toast.show({
        type: 'success',
        text1: 'Updated',
        text2: 'Payment status updated successfully',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update payment status',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteRecurringPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Recurring payment deleted successfully',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete payment',
      });
    },
  });

  const handleToggleStatus = (payment: RecurringPayment) => {
    toggleStatusMutation.mutate({
      id: payment.id,
      isActive: !payment.isActive,
    });
  };

  const handleDelete = (payment: RecurringPayment) => {
    deleteMutation.mutate(payment.id);
  };

  const getFrequencyText = (payment: RecurringPayment) => {
    if (payment.frequency === 'MONTHLY' && payment.dayOfMonth) {
      return `Due on the ${payment.dayOfMonth}th of each month`;
    }
    if (payment.frequency === 'WEEKLY') {
      return 'Due weekly';
    }
    return `Due ${payment.frequency.toLowerCase()}`;
  };

  const getPaymentIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('rent')) return 'home';
    if (lowerName.includes('car') || lowerName.includes('loan')) return 'directions-car';
    if (lowerName.includes('internet') || lowerName.includes('wifi')) return 'wifi';
    if (lowerName.includes('gym') || lowerName.includes('fitness')) return 'fitness-center';
    if (lowerName.includes('streaming') || lowerName.includes('netflix')) return 'play-circle';
    return 'payment';
  };

  const renderPaymentItem = (payment: RecurringPayment) => (
    <Card key={payment.id} style={styles.paymentCard}>
      <Card.Content>
        <View style={styles.paymentHeader}>
          <View style={styles.paymentInfo}>
            <View style={styles.iconContainer}>
              <Icon 
                source={getPaymentIcon(payment.name)} 
                size={24} 
                color="#FF6384" 
              />
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentName}>{payment.name}</Text>
              <Text style={styles.paymentDue}>{getFrequencyText(payment)}</Text>
              {payment.merchant && (
                <Text style={styles.paymentMerchant}>{payment.merchant}</Text>
              )}
            </View>
          </View>
          <View style={styles.paymentActions}>
            <Text style={styles.paymentAmount}>
              JD {payment.amount.toFixed(2)}
            </Text>
            <Switch
              value={payment.isActive}
              onValueChange={() => handleToggleStatus(payment)}
              trackColor={{ false: '#666', true: '#FF6384' }}
              thumbColor={payment.isActive ? '#FFF' : '#FFF'}
            />
          </View>
        </View>
        
        {payment.dueIn <= 7 && payment.isActive && (
          <View style={styles.dueWarning}>
            <Icon source="schedule" size={16} color="#FF9500" />
            <Text style={styles.dueWarningText}>
              Due in {payment.dueIn} day{payment.dueIn !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor="#FFF"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Recurring Payments</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6384" />
          <Text style={styles.loadingText}>Loading payments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor="#FFF"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Recurring Payments</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load payments</Text>
          <Button 
            mode="outlined" 
            onPress={() => queryClient.invalidateQueries({ queryKey: ['recurringPayments'] })}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const detectedPayments = recurringData?.detected || [];
  const userAddedPayments = recurringData?.userAdded || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor="#FFF"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Recurring Payments</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {detectedPayments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detected</Text>
            {detectedPayments.map(renderPaymentItem)}
          </View>
        )}

        {userAddedPayments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Added by you</Text>
            {userAddedPayments.map(renderPaymentItem)}
          </View>
        )}

        {detectedPayments.length === 0 && userAddedPayments.length === 0 && (
          <View style={styles.emptyContainer}>
            <Icon source="repeat" size={80} color="#666" />
            <Text style={styles.emptyTitle}>No Recurring Payments</Text>
            <Text style={styles.emptySubtitle}>
              Add your recurring payments to track them automatically
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <FAB
        icon="plus"
        label="Add Recurring Payment"
        style={styles.fab}
        onPress={() => setAddModalVisible(true)}
        customSize={56}
        mode="elevated"
      />

      <AddRecurringPaymentModal
        visible={addModalVisible}
        onDismiss={() => setAddModalVisible(false)}
        onSubmit={() => {
          setAddModalVisible(false);
          queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
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
    backgroundColor: '#1E1E1E',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  paymentCard: {
    backgroundColor: '#2A2A2A',
    marginBottom: 12,
    borderRadius: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 99, 132, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  paymentDue: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 2,
  },
  paymentMerchant: {
    fontSize: 12,
    color: '#888',
  },
  paymentActions: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  dueWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  dueWarningText: {
    fontSize: 14,
    color: '#FF9500',
    marginLeft: 6,
    fontWeight: '500',
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
    color: '#FF5722',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    borderColor: '#FF6384',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#AAA',
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    left: 16,
    backgroundColor: '#6C63FF',
  },
});
