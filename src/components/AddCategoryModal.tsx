import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Card, Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { Category } from '../types';

interface AddCategoryModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (category: Omit<Category, 'id' | 'userId' | 'createdAt'>) => void;
  initialData?: Category | null;
  isEditing?: boolean;
}

export default function AddCategoryModal({ 
  visible, 
  onDismiss, 
  onSubmit, 
  initialData, 
  isEditing = false 
}: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setKeywords(initialData.keywords || '');
      setType(initialData.type);
    } else {
      setName('');
      setKeywords('');
      setType('EXPENSE');
    }
  }, [initialData, visible]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    onSubmit({
      name: name.trim(),
      keywords: keywords.trim(),
      type,
    });
    
    // Reset form
    setName('');
    setKeywords('');
    setType('EXPENSE');
  };

  const handleCancel = () => {
    setName('');
    setKeywords('');
    setType('EXPENSE');
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modal}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </Text>

            <TextInput
              label="Category Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Groceries, Transport, Salary"
              theme={{
                colors: {
                  primary: '#FF6384',
                  background: '#2A2A2A',
                  surface: '#2A2A2A',
                  onSurface: '#FFF',
                }
              }}
            />

            <TextInput
              label="Keywords (optional)"
              value={keywords}
              onChangeText={setKeywords}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., grocery,food,supermarket"
              multiline
              numberOfLines={2}
              theme={{
                colors: {
                  primary: '#FF6384',
                  background: '#2A2A2A',
                  surface: '#2A2A2A',
                  onSurface: '#FFF',
                }
              }}
            />

            <Text variant="bodyMedium" style={styles.label}>
              Category Type
            </Text>
            <SegmentedButtons
              value={type}
              onValueChange={(value) => setType(value as 'EXPENSE' | 'INCOME')}
              buttons={[
                {
                  value: 'EXPENSE',
                  label: 'Expense',
                  icon: 'minus-circle',
                },
                {
                  value: 'INCOME',
                  label: 'Income',
                  icon: 'plus-circle',
                },
              ]}
              style={styles.segmentedButtons}
            />

            <View style={styles.buttonContainer}>
              <Button 
                mode="outlined" 
                onPress={handleCancel}
                style={styles.button}
                textColor="#FFF"
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleSubmit}
                style={[styles.button, styles.submitButton]}
                disabled={!name.trim()}
              >
                {isEditing ? 'Update' : 'Create'}
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
  },
  card: {
    backgroundColor: '#2A2A2A',
  },
  title: {
    color: '#FFF',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#2A2A2A',
  },
  label: {
    color: '#FFF',
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 0.48,
  },
  submitButton: {
    backgroundColor: '#FF6384',
  },
});
