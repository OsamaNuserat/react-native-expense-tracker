import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, FAB, Button, TextInput, Chip } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryApi';
import { Category } from '../types';
import AddCategoryModal from '../components/AddCategoryModal';

export default function CategoriesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { 
    data: categories, 
    isLoading 
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Category created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setModalVisible(false);
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create category',
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<Category>) => 
      updateCategory(id, data),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Category updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
      setModalVisible(false);
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update category',
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Category deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete category',
      });
    },
  });

  const handleCreateCategory = (categoryData: Omit<Category, 'id' | 'userId' | 'createdAt'>) => {
    createCategoryMutation.mutate(categoryData);
  };

  const handleUpdateCategory = (categoryData: Omit<Category, 'id' | 'userId' | 'createdAt'>) => {
    if (!editingCategory) return;
    updateCategoryMutation.mutate({ 
      id: editingCategory.id, 
      ...categoryData 
    });
  };

  const handleDeleteCategory = (id: number) => {
    deleteCategoryMutation.mutate(id);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setModalVisible(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setModalVisible(true);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <Card style={styles.categoryCard}>
      <Card.Content>
        <View style={styles.categoryHeader}>
          <Text variant="titleMedium" style={styles.categoryName}>
            {item.name}
          </Text>
          <Chip 
            mode="outlined" 
            style={[
              styles.typeChip,
              item.type === 'EXPENSE' ? styles.expenseChip : styles.incomeChip
            ]}
          >
            {item.type}
          </Chip>
        </View>
        
        {item.keywords && (
          <Text variant="bodySmall" style={styles.keywords}>
            Keywords: {item.keywords}
          </Text>
        )}

        <View style={styles.actionButtons}>
          <Button 
            mode="outlined" 
            onPress={() => handleEditCategory(item)}
            style={styles.actionButton}
          >
            Edit
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => handleDeleteCategory(item.id)}
            style={styles.actionButton}
            textColor="#d32f2f"
          >
            Delete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={categories || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategoryItem}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No categories found</Text>
              <Text style={styles.emptySubtext}>
                Create your first category to start organizing your transactions
              </Text>
            </Card.Content>
          </Card>
        }
        style={styles.list}
      />

      <AddCategoryModal
        visible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
          setEditingCategory(null);
        }}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        initialData={editingCategory}
        isEditing={!!editingCategory}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddCategory}
        label="Add Category"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  list: {
    flex: 1,
    padding: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
  },
  categoryCard: {
    backgroundColor: '#2A2A2A',
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    color: '#FFF',
    flex: 1,
  },
  typeChip: {
    marginLeft: 8,
  },
  expenseChip: {
    backgroundColor: '#FF5722',
  },
  incomeChip: {
    backgroundColor: '#4CAF50',
  },
  keywords: {
    color: '#AAA',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
  },
  emptyCard: {
    backgroundColor: '#2A2A2A',
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6384',
  },
});
