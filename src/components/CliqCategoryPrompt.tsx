import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Modal, Portal, Button } from 'react-native-paper';

interface Category {
  id: number;
  name: string;
}

interface Props {
  visible: boolean;
  onDismiss: () => void;
  categories: Category[];
  selectedCategory: number | null;
  setSelectedCategory: (catId: number) => void;
  onSave: () => void;
  sender: string;
}

export default function CliqCategoryPrompt({
  visible,
  onDismiss,
  categories,
  selectedCategory,
  setSelectedCategory,
  onSave,
  sender,
}: Props) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Text style={styles.title}>Select category for: {sender}</Text>
        <View style={styles.categoryList}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.categoryItem,
                selectedCategory === cat.id && styles.selectedCategory,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.selectedCategoryText,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          mode="contained"
          onPress={onSave}
          disabled={selectedCategory === null}
          style={styles.saveButton}
        >
          Save Category
        </Button>
        <Button onPress={onDismiss} style={styles.cancelButton}>
          Cancel
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: 16,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#eee',
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  categoryText: {
    color: '#333',
  },
  selectedCategory: {
    backgroundColor: '#6699ff',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 10,
  },
  cancelButton: {
    marginTop: 10,
  },
});
