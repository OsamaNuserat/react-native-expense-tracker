import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, TextInput, Button, Card, Chip, SegmentedButtons } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { createBill, updateBill } from '../api/billsApi';
import { fetchCategories } from '../api/categoryApi';
import { Bill, BillFrequency, CreateBillRequest, UpdateBillRequest, Category } from '../types';

interface AddBillModalProps {
  visible: boolean;
  onDismiss: () => void;
  editBill?: Bill | null;
  onSuccess: () => void;
}

export default function AddBillModal({ 
  visible, 
  onDismiss, 
  editBill,
  onSuccess 
}: AddBillModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<CreateBillRequest>>({
    name: '',
    description: '',
    payee: '',
    amount: undefined,
    isFixedAmount: true,
    categoryId: undefined,
    dueDate: '',
    frequency: 'MONTHLY',
    dayOfMonth: 1,
    dayOfWeek: 1,
    autoReminder: true,
    reminderDays: [7, 3, 1],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', 'EXPENSE'],
    queryFn: () => fetchCategories('EXPENSE'),
    enabled: visible,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateBillRequest) => createBill(data),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Bill created successfully',
      });
      resetForm();
      onSuccess();
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create bill',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBillRequest }) => 
      updateBill(id, data),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Bill updated successfully',
      });
      resetForm();
      onSuccess();
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update bill',
      });
    },
  });

  useEffect(() => {
    if (editBill && visible) {
      setFormData({
        name: editBill.name,
        description: editBill.description || '',
        payee: editBill.payee,
        amount: editBill.amount,
        isFixedAmount: editBill.isFixedAmount,
        categoryId: editBill.categoryId,
        dueDate: editBill.dueDate.split('T')[0], // Convert to date string
        frequency: editBill.frequency,
        dayOfMonth: editBill.dayOfMonth,
        dayOfWeek: editBill.dayOfWeek,
        autoReminder: editBill.autoReminder,
        reminderDays: editBill.reminderDays,
      });
    } else if (!editBill && visible) {
      resetForm();
    }
  }, [editBill, visible]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      payee: '',
      amount: undefined,
      isFixedAmount: true,
      categoryId: undefined,
      dueDate: '',
      frequency: 'MONTHLY',
      dayOfMonth: 1,
      dayOfWeek: 1,
      autoReminder: true,
      reminderDays: [7, 3, 1],
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.payee || !formData.dueDate || !formData.frequency) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    if (formData.isFixedAmount && (!formData.amount || formData.amount <= 0)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid amount for fixed bills',
      });
      return;
    }

    const billData = {
      ...formData,
      amount: formData.isFixedAmount ? formData.amount : undefined,
    } as CreateBillRequest;

    if (editBill) {
      updateMutation.mutate({ id: editBill.id, data: billData });
    } else {
      createMutation.mutate(billData);
    }
  };

  const handleDismiss = () => {
    resetForm();
    onDismiss();
  };

  const frequencyOptions = [
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'QUARTERLY', label: 'Quarterly' },
    { value: 'YEARLY', label: 'Yearly' },
  ];

  const reminderOptions = [1, 3, 7, 14, 30];

  // Generate day options for monthly bills
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  const weekDayOptions = [
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
    { value: 7, label: 'Sun' },
  ];

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={styles.modal}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>
              {editBill ? 'Edit Bill' : 'Add New Bill'}
            </Text>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              <View style={styles.field}>
                <Text style={styles.label}>Bill Name *</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="e.g., Electric Bill, Rent"
                  placeholderTextColor="#666"
                  style={styles.input}
                  mode="outlined"
                  theme={{ colors: { outline: '#444', onSurface: '#FFF' } }}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Payee *</Text>
                <TextInput
                  value={formData.payee}
                  onChangeText={(text) => setFormData({ ...formData, payee: text })}
                  placeholder="e.g., Electric Company, Landlord"
                  placeholderTextColor="#666"
                  style={styles.input}
                  mode="outlined"
                  theme={{ colors: { outline: '#444', onSurface: '#FFF' } }}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Amount Type</Text>
                <SegmentedButtons
                  value={formData.isFixedAmount ? 'fixed' : 'variable'}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    isFixedAmount: value === 'fixed'
                  })}
                  buttons={[
                    { value: 'fixed', label: 'Fixed Amount' },
                    { value: 'variable', label: 'Variable' },
                  ]}
                  style={styles.segmentedButtons}
                  theme={{ colors: { onSurface: '#FFF', outline: '#666' } }}
                />
              </View>

              {formData.isFixedAmount && (
                <View style={styles.field}>
                  <Text style={styles.label}>Amount (JOD) *</Text>
                  <TextInput
                    value={formData.amount?.toString() || ''}
                    onChangeText={(text) => setFormData({ 
                      ...formData, 
                      amount: parseFloat(text) || undefined 
                    })}
                    placeholder="0.00"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { outline: '#444', onSurface: '#FFF' } }}
                  />
                </View>
              )}

              <View style={styles.field}>
                <Text style={styles.label}>Category</Text>
                {categoriesLoading ? (
                  <Text style={styles.loadingText}>Loading categories...</Text>
                ) : (
                  <View style={styles.categoryContainer}>
                    {categories?.map((category: Category) => (
                      <Chip
                        key={category.id}
                        selected={formData.categoryId === category.id}
                        onPress={() => setFormData({ ...formData, categoryId: category.id })}
                        style={[
                          styles.categoryChip,
                          formData.categoryId === category.id && styles.selectedChip
                        ]}
                        textStyle={[
                          styles.chipText,
                          formData.categoryId === category.id && styles.selectedChipText
                        ]}
                      >
                        {category.name}
                      </Chip>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Due Date *</Text>
                <TextInput
                  value={formData.dueDate}
                  onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#666"
                  style={styles.input}
                  mode="outlined"
                  theme={{ colors: { outline: '#444', onSurface: '#FFF' } }}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Frequency *</Text>
                <SegmentedButtons
                  value={formData.frequency || 'MONTHLY'}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    frequency: value as BillFrequency
                  })}
                  buttons={frequencyOptions}
                  style={styles.segmentedButtons}
                  theme={{ colors: { onSurface: '#FFF', outline: '#666' } }}
                />
              </View>

              {formData.frequency === 'MONTHLY' && (
                <View style={styles.field}>
                  <Text style={styles.label}>Day of Month</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.daySelector}
                  >
                    {dayOptions.map((day) => (
                      <Chip
                        key={day}
                        selected={formData.dayOfMonth === day}
                        onPress={() => setFormData({ ...formData, dayOfMonth: day })}
                        style={[
                          styles.dayChip,
                          formData.dayOfMonth === day && styles.selectedChip
                        ]}
                        textStyle={[
                          styles.chipText,
                          formData.dayOfMonth === day && styles.selectedChipText
                        ]}
                      >
                        {day}
                      </Chip>
                    ))}
                  </ScrollView>
                </View>
              )}

              {formData.frequency === 'WEEKLY' && (
                <View style={styles.field}>
                  <Text style={styles.label}>Day of Week</Text>
                  <View style={styles.weekDayContainer}>
                    {weekDayOptions.map((day) => (
                      <Chip
                        key={day.value}
                        selected={formData.dayOfWeek === day.value}
                        onPress={() => setFormData({ ...formData, dayOfWeek: day.value })}
                        style={[
                          styles.weekDayChip,
                          formData.dayOfWeek === day.value && styles.selectedChip
                        ]}
                        textStyle={[
                          styles.chipText,
                          formData.dayOfWeek === day.value && styles.selectedChipText
                        ]}
                      >
                        {day.label}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.field}>
                <Text style={styles.label}>Reminder Days Before Due</Text>
                <View style={styles.reminderContainer}>
                  {reminderOptions.map((days) => (
                    <Chip
                      key={days}
                      selected={formData.reminderDays?.includes(days)}
                      onPress={() => {
                        const currentReminders = formData.reminderDays || [];
                        const newReminders = currentReminders.includes(days)
                          ? currentReminders.filter(d => d !== days)
                          : [...currentReminders, days].sort((a, b) => b - a);
                        setFormData({ ...formData, reminderDays: newReminders });
                      }}
                      style={[
                        styles.reminderChip,
                        formData.reminderDays?.includes(days) && styles.selectedChip
                      ]}
                      textStyle={[
                        styles.chipText,
                        formData.reminderDays?.includes(days) && styles.selectedChipText
                      ]}
                    >
                      {days} day{days > 1 ? 's' : ''}
                    </Chip>
                  ))}
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Additional notes about this bill"
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={3}
                  style={styles.input}
                  mode="outlined"
                  theme={{ colors: { outline: '#444', onSurface: '#FFF' } }}
                />
              </View>
            </ScrollView>

            <View style={styles.actions}>
              <Button
                mode="outlined"
                onPress={handleDismiss}
                style={styles.cancelButton}
                textColor="#FFF"
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                loading={createMutation.isPending || updateMutation.isPending}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editBill ? 'Update Bill' : 'Add Bill'}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    maxHeight: '90%',
  },
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    maxHeight: 400,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
  },
  segmentedButtons: {
    backgroundColor: '#333',
  },
  loadingText: {
    color: '#888',
    textAlign: 'center',
    padding: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#444',
    borderColor: '#666',
  },
  selectedChip: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  chipText: {
    color: '#FFF',
    fontSize: 12,
  },
  selectedChipText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  daySelector: {
    flexDirection: 'row',
  },
  dayChip: {
    backgroundColor: '#444',
    borderColor: '#666',
    marginRight: 8,
  },
  weekDayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weekDayChip: {
    backgroundColor: '#444',
    borderColor: '#666',
  },
  reminderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reminderChip: {
    backgroundColor: '#444',
    borderColor: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#666',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#4ECDC4',
  },
});
