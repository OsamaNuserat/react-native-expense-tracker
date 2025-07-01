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
import { useQuery, useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { fetchCategories } from '../api/categoryApi';
import { createRecurringPayment, CreateRecurringPaymentData } from '../api/recurringPaymentApi';

interface AddRecurringPaymentModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: () => void;
}

export default function AddRecurringPaymentModal({ 
  visible, 
  onDismiss, 
  onSubmit 
}: AddRecurringPaymentModalProps) {
  const [formData, setFormData] = useState<Partial<CreateRecurringPaymentData>>({
    name: '',
    description: '',
    amount: 0,
    categoryId: undefined,
    frequency: 'MONTHLY',
    dayOfMonth: 1,
    merchant: '',
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', 'EXPENSE'],
    queryFn: () => fetchCategories('EXPENSE'),
    enabled: visible,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateRecurringPaymentData) => createRecurringPayment(data),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: ' ',
      });
      resetForm();
      onSubmit();
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create recurring payment',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      amount: 0,
      categoryId: undefined,
      frequency: 'MONTHLY',
      dayOfMonth: 1,
      merchant: '',
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.amount || !formData.categoryId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    createMutation.mutate(formData as CreateRecurringPaymentData);
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

  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text style={styles.title}>Add Recurring Payment</Text>
              <IconButton
                icon="close"
                size={24}
                iconColor="#FFF"
                onPress={handleDismiss}
              />
            </View>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              <View style={styles.field}>
                <Text style={styles.label}>Payment Name *</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="e.g., Rent, Gym Membership"
                  placeholderTextColor="#666"
                  style={styles.input}
                  mode="outlined"
                  theme={{ colors: { outline: '#444', onSurface: '#FFF' } }}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Amount (JD) *</Text>
                <TextInput
                  value={formData.amount?.toString() || ''}
                  onChangeText={(text) => setFormData({ ...formData, amount: parseFloat(text) || 0 })}
                  placeholder="0.00"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                  theme={{ colors: { outline: '#444', onSurface: '#FFF' } }}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Category *</Text>
                {categoriesLoading ? (
                  <ActivityIndicator color="#FF6384" style={{ marginVertical: 16 }} />
                ) : (
                  <View style={styles.categoryContainer}>
                    {categories?.map((category) => (
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
                <Text style={styles.label}>Frequency *</Text>
                <SegmentedButtons
                  value={formData.frequency || 'MONTHLY'}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    frequency: value as 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
                  })}
                  buttons={frequencyOptions}
                  style={styles.segmentedButtons}
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

              <View style={styles.field}>
                <Text style={styles.label}>Merchant (Optional)</Text>
                <TextInput
                  value={formData.merchant}
                  onChangeText={(text) => setFormData({ ...formData, merchant: text })}
                  placeholder="e.g., Fitness Plus, ABC Bank"
                  placeholderTextColor="#666"
                  style={styles.input}
                  mode="outlined"
                  theme={{ colors: { outline: '#444', onSurface: '#FFF' } }}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Additional notes about this payment"
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
                loading={createMutation.isPending}
                disabled={createMutation.isPending}
                style={styles.submitButton}
                buttonColor="#FF6384"
              >
                Create Payment
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  form: {
    maxHeight: 400,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E1E1E',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#1E1E1E',
    borderColor: '#444',
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: '#FF6384',
    borderColor: '#FF6384',
  },
  chipText: {
    color: '#FFF',
    fontSize: 14,
  },
  selectedChipText: {
    color: '#FFF',
    fontWeight: '600',
  },
  segmentedButtons: {
    backgroundColor: '#1E1E1E',
  },
  daySelector: {
    flexDirection: 'row',
  },
  dayChip: {
    backgroundColor: '#1E1E1E',
    borderColor: '#444',
    borderWidth: 1,
    marginRight: 8,
    minWidth: 40,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#666',
  },
  submitButton: {
    flex: 1,
  },
});
