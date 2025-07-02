import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Modal, Portal, Card, Button, TextInput, Chip } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';

import { createFinancialGoal, updateFinancialGoal } from '../api/financialGoalsApi';
import { formatCurrency } from '../utils/formatters';
import { GoalType, GoalPriority, FinancialGoal } from '../types';

interface CreateGoalModalProps {
  visible: boolean;
  onDismiss: () => void;
  editGoal?: FinancialGoal | null;
}

const GOAL_TYPES: { type: GoalType; label: string; icon: string; color: string }[] = [
  { type: 'EMERGENCY_FUND', label: 'Emergency Fund', icon: 'shield-checkmark', color: '#FF6B6B' },
  { type: 'VACATION', label: 'Vacation', icon: 'airplane', color: '#4ECDC4' },
  { type: 'CAR_PURCHASE', label: 'Car Purchase', icon: 'car', color: '#45B7D1' },
  { type: 'HOUSE_DOWN_PAYMENT', label: 'House Down Payment', icon: 'home', color: '#96CEB4' },
  { type: 'DEBT_PAYOFF', label: 'Debt Payoff', icon: 'card', color: '#FFEAA7' },
  { type: 'WEDDING', label: 'Wedding', icon: 'heart', color: '#FD79A8' },
  { type: 'EDUCATION', label: 'Education', icon: 'school', color: '#74B9FF' },
  { type: 'RETIREMENT', label: 'Retirement', icon: 'time', color: '#A29BFE' },
  { type: 'INVESTMENT', label: 'Investment', icon: 'trending-up', color: '#00B894' },
  { type: 'CUSTOM', label: 'Custom Goal', icon: 'star', color: '#DDA0DD' },
];

const PRIORITIES: { priority: GoalPriority; label: string; color: string }[] = [
  { priority: 'LOW', label: 'Low', color: '#74B9FF' },
  { priority: 'MEDIUM', label: 'Medium', color: '#FDCB6E' },
  { priority: 'HIGH', label: 'High', color: '#FF7675' },
  { priority: 'URGENT', label: 'Urgent', color: '#E84393' },
];

export default function CreateGoalModal({ visible, onDismiss, editGoal = null }: CreateGoalModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [monthlyTarget, setMonthlyTarget] = useState('');
  const [selectedGoalType, setSelectedGoalType] = useState<GoalType>('EMERGENCY_FUND');
  const [selectedPriority, setSelectedPriority] = useState<GoalPriority>('MEDIUM');

  const isEditMode = !!editGoal;

  // Effect to populate form when editing
  useEffect(() => {
    if (editGoal && visible) {
      setTitle(editGoal.title);
      setDescription(editGoal.description || '');
      setTargetAmount(editGoal.targetAmount.toString());
      setTargetDate(editGoal.targetDate ? editGoal.targetDate.split('T')[0] : '');
      setMonthlyTarget(editGoal.monthlyTarget?.toString() || '');
      setSelectedGoalType(editGoal.goalType);
      setSelectedPriority(editGoal.priority);
    } else if (!visible) {
      // Reset form when modal closes
      resetForm();
    }
  }, [editGoal, visible]);

  const createGoalMutation = useMutation({
    mutationFn: createFinancialGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialGoals'] });
      queryClient.invalidateQueries({ queryKey: ['financialGoalsStats'] });
      resetForm();
      onDismiss();
      Alert.alert('Success', 'Financial goal created successfully!');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create goal');
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, goalData }: { id: number; goalData: Partial<FinancialGoal> }) => 
      updateFinancialGoal(id, goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialGoals'] });
      queryClient.invalidateQueries({ queryKey: ['financialGoalsStats'] });
      resetForm();
      onDismiss();
      Alert.alert('Success', 'Financial goal updated successfully!');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update goal');
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTargetAmount('');
    setTargetDate('');
    setMonthlyTarget('');
    setSelectedGoalType('EMERGENCY_FUND');
    setSelectedPriority('MEDIUM');
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    const goalData = {
      title: title.trim(),
      description: description.trim() || undefined,
      goalType: selectedGoalType,
      targetAmount: parseFloat(targetAmount),
      targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
      priority: selectedPriority,
      monthlyTarget: monthlyTarget ? parseFloat(monthlyTarget) : undefined,
    };

    if (isEditMode && editGoal) {
      updateGoalMutation.mutate({ id: editGoal.id, goalData });
    } else {
      createGoalMutation.mutate(goalData);
    }
  };

  const selectedGoalTypeData = GOAL_TYPES.find(gt => gt.type === selectedGoalType);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text style={styles.title}>
                {isEditMode ? 'Edit Financial Goal' : 'Create Financial Goal'}
              </Text>
              <Icon 
                name="close" 
                size={24} 
                color="#888" 
                onPress={onDismiss}
                style={styles.closeButton}
              />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Goal Title */}
              <TextInput
                label="Goal Title"
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                style={styles.input}
                theme={{ 
                  colors: { 
                    primary: '#4ECDC4',
                    onSurface: '#FFF',
                    onSurfaceVariant: '#CCC',
                    outline: '#666'
                  } 
                }}
                textColor="#FFF"
                placeholder="e.g., Emergency Fund"
                placeholderTextColor="#999"
              />

              {/* Goal Type Selection */}
              <Text style={styles.sectionTitle}>Goal Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollView}>
                <View style={styles.chipContainer}>
                  {GOAL_TYPES.map((goalType) => (
                    <Chip
                      key={goalType.type}
                      selected={selectedGoalType === goalType.type}
                      onPress={() => setSelectedGoalType(goalType.type)}
                      style={[
                        styles.chip,
                        selectedGoalType === goalType.type && {
                          backgroundColor: goalType.color + '20',
                          borderColor: goalType.color,
                          borderWidth: 1,
                        }
                      ]}
                      textStyle={[
                        styles.chipText,
                        selectedGoalType === goalType.type && { color: goalType.color }
                      ]}
                      icon={() => (
                        <Icon 
                          name={goalType.icon} 
                          size={16} 
                          color={selectedGoalType === goalType.type ? goalType.color : '#888'} 
                        />
                      )}
                    >
                      {goalType.label}
                    </Chip>
                  ))}
                </View>
              </ScrollView>

              {/* Target Amount */}
              <TextInput
                label="Target Amount (JD)"
                value={targetAmount}
                onChangeText={setTargetAmount}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                theme={{ 
                  colors: { 
                    primary: '#4ECDC4',
                    onSurface: '#FFF',
                    onSurfaceVariant: '#CCC',
                    outline: '#666'
                  } 
                }}
                textColor="#FFF"
                placeholder="0.00"
                placeholderTextColor="#999"
              />

              {/* Description */}
              <TextInput
                label="Description (Optional)"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={3}
                theme={{ 
                  colors: { 
                    primary: '#4ECDC4',
                    onSurface: '#FFF',
                    onSurfaceVariant: '#CCC',
                    outline: '#666'
                  } 
                }}
                textColor="#FFF"
                placeholder="Describe your goal..."
                placeholderTextColor="#999"
              />

              {/* Target Date */}
              <TextInput
                label="Target Date (Optional)"
                value={targetDate}
                onChangeText={setTargetDate}
                mode="outlined"
                style={styles.input}
                theme={{ 
                  colors: { 
                    primary: '#4ECDC4',
                    onSurface: '#FFF',
                    onSurfaceVariant: '#CCC',
                    outline: '#666'
                  } 
                }}
                textColor="#FFF"
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
              />

              {/* Monthly Target */}
              <TextInput
                label="Monthly Target (Optional)"
                value={monthlyTarget}
                onChangeText={setMonthlyTarget}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                theme={{ 
                  colors: { 
                    primary: '#4ECDC4',
                    onSurface: '#FFF',
                    onSurfaceVariant: '#CCC',
                    outline: '#666'
                  } 
                }}
                textColor="#FFF"
                placeholder="How much to save monthly"
                placeholderTextColor="#999"
              />

              {/* Priority Selection */}
              <Text style={styles.sectionTitle}>Priority</Text>
              <View style={styles.priorityContainer}>
                {PRIORITIES.map((priority) => (
                  <Chip
                    key={priority.priority}
                    selected={selectedPriority === priority.priority}
                    onPress={() => setSelectedPriority(priority.priority)}
                    style={[
                      styles.chip,
                      selectedPriority === priority.priority && {
                        backgroundColor: priority.color + '20',
                        borderColor: priority.color,
                        borderWidth: 1,
                      }
                    ]}
                    textStyle={[
                      styles.chipText,
                      selectedPriority === priority.priority && { color: priority.color }
                    ]}
                  >
                    {priority.label}
                  </Chip>
                ))}
              </View>

              {/* Goal Preview */}
              {selectedGoalTypeData && targetAmount && (
                <Card style={styles.previewCard}>
                  <Card.Content>
                    <View style={styles.previewHeader}>
                      <Icon 
                        name={selectedGoalTypeData.icon} 
                        size={24} 
                        color={selectedGoalTypeData.color} 
                      />
                      <Text style={styles.previewTitle}>Goal Preview</Text>
                    </View>
                    <Text style={styles.previewText}>
                      {title || 'Your Goal'} - {formatCurrency(parseFloat(targetAmount) || 0)}
                    </Text>
                    {monthlyTarget && (
                      <Text style={styles.previewSubtext}>
                        Monthly target: {formatCurrency(parseFloat(monthlyTarget))}
                      </Text>
                    )}
                  </Card.Content>
                </Card>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <Button
                mode="outlined"
                onPress={onDismiss}
                style={[styles.button, styles.cancelButton]}
                textColor="#888"
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={[styles.button, styles.createButton]}
                loading={createGoalMutation.isPending || updateGoalMutation.isPending}
                disabled={createGoalMutation.isPending || updateGoalMutation.isPending}
              >
                {isEditMode ? 'Update Goal' : 'Create Goal'}
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
    maxHeight: '100%',
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
  closeButton: {
    padding: 4,
  },
  content: {
    maxHeight: 500,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
    marginTop: 8,
  },
  chipScrollView: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#333',
  },
  chipText: {
    color: '#888',
    fontSize: 12,
  },
  previewCard: {
    backgroundColor: '#333',
    marginTop: 16,
    marginBottom: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  previewText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  previewSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    borderColor: '#555',
  },
  createButton: {
    backgroundColor: '#4ECDC4',
  },
});
