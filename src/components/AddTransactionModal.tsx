import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { 
  Modal, 
  Portal, 
  Card, 
  Button, 
  TextInput, 
  SegmentedButtons,
  IconButton,
  Chip,
  ActivityIndicator
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { fetchCategories } from '../api/categoryApi';
import { createExpense, createIncome } from '../api/transactionApi';
import { Category } from '../types';

interface AddTransactionModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function AddTransactionModal({ 
  visible, 
  onDismiss 
}: AddTransactionModalProps) {
  const queryClient = useQueryClient();
  
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', type === 'expense' ? 'EXPENSE' : 'INCOME'],
    queryFn: () => fetchCategories(type === 'expense' ? 'EXPENSE' : 'INCOME'),
    enabled: visible,
  });

  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Expense added successfully!',
      });
      handleClose();
      // Refresh related queries
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expensesSummary'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to add expense',
      });
    },
  });

  const createIncomeMutation = useMutation({
    mutationFn: createIncome,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Income added successfully!',
      });
      handleClose();
      // Refresh related queries
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['incomesSummary'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to add income',
      });
    },
  });

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setMerchant('');
    setSelectedCategoryId(null);
    setType('expense');
    onDismiss();
  };

  const handleSubmit = () => {
    if (!amount || !description || !selectedCategoryId) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid amount',
      });
      return;
    }

    const transactionData = {
      amount: numericAmount,
      description,
      merchant: merchant || null,
      categoryId: selectedCategoryId,
      transactionDate: new Date().toISOString(),
    };

    if (type === 'expense') {
      createExpenseMutation.mutate(transactionData);
    } else {
      createIncomeMutation.mutate(transactionData);
    }
  };

  const isSubmitting = createExpenseMutation.isPending || createIncomeMutation.isPending;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text style={styles.title}>Add Transaction</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={handleClose}
                iconColor="#888"
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Transaction Type */}
              <Text style={styles.sectionLabel}>Transaction Type</Text>
              <SegmentedButtons
                value={type}
                onValueChange={(value) => {
                  setType(value as 'expense' | 'income');
                  setSelectedCategoryId(null); // Reset category when type changes
                }}
                buttons={[
                  {
                    value: 'expense',
                    label: 'Expense',
                    icon: 'arrow-down',
                  },
                  {
                    value: 'income',
                    label: 'Income',
                    icon: 'arrow-up',
                  },
                ]}
                style={styles.segmentedButtons}
              />

              {/* Amount */}
              <Text style={styles.sectionLabel}>Amount *</Text>
              <TextInput
                mode="outlined"
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
                style={styles.input}
                theme={{
                  colors: {
                    primary: type === 'expense' ? '#FF6384' : '#4CAF50',
                  },
                }}
                left={<TextInput.Icon icon="currency-usd" />}
              />

              {/* Description */}
              <Text style={styles.sectionLabel}>Description *</Text>
              <TextInput
                mode="outlined"
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                style={styles.input}
                theme={{
                  colors: {
                    primary: type === 'expense' ? '#FF6384' : '#4CAF50',
                  },
                }}
              />

              {/* Merchant */}
              <Text style={styles.sectionLabel}>Merchant/Source</Text>
              <TextInput
                mode="outlined"
                value={merchant}
                onChangeText={setMerchant}
                placeholder="Optional"
                style={styles.input}
                theme={{
                  colors: {
                    primary: type === 'expense' ? '#FF6384' : '#4CAF50',
                  },
                }}
                left={<TextInput.Icon icon="store" />}
              />

              {/* Category */}
              <Text style={styles.sectionLabel}>Category *</Text>
              {categoriesLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={type === 'expense' ? '#FF6384' : '#4CAF50'} />
                  <Text style={styles.loadingText}>Loading categories...</Text>
                </View>
              ) : (
                <View style={styles.categoriesContainer}>
                  {categories?.map((category: Category) => (
                    <Chip
                      key={category.id}
                      selected={selectedCategoryId === category.id}
                      onPress={() => setSelectedCategoryId(category.id)}
                      style={[
                        styles.categoryChip,
                        selectedCategoryId === category.id && {
                          backgroundColor: type === 'expense' ? '#FF6384' : '#4CAF50',
                        },
                      ]}
                      textStyle={[
                        styles.categoryChipText,
                        selectedCategoryId === category.id && { color: '#FFF' },
                      ]}
                    >
                      {category.name}
                    </Chip>
                  ))}
                </View>
              )}

              {/* Submit Button */}
              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={isSubmitting}
                loading={isSubmitting}
                style={[
                  styles.submitButton,
                  { backgroundColor: type === 'expense' ? '#FF6384' : '#4CAF50' },
                ]}
                contentStyle={styles.submitButtonContent}
              >
                {isSubmitting ? 'Adding...' : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
              </Button>
            </ScrollView>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    margin: 20,
  },
  card: {
    backgroundColor: '#2A2A2A',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 8,
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  input: {
    backgroundColor: '#333',
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#888',
    marginLeft: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: '#333',
  },
  categoryChipText: {
    color: '#FFF',
  },
  submitButton: {
    marginTop: 30,
    marginBottom: 10,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});
