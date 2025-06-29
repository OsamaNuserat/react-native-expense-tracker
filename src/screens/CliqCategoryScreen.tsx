import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { fetchMessageById, categorizeMessage } from '../api/messagesApi';
import { fetchCategories } from '../api/categoryApi';
import { Message, Category } from '../types';

export default function CliqCategoryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { messageId } = route.params as { messageId: string };
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { 
    data: message, 
    isLoading: messageLoading 
  } = useQuery<Message>({
    queryKey: ['message', messageId],
    queryFn: () => fetchMessageById(messageId),
    enabled: !!messageId,
  });

  const { 
    data: categories 
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

  const handleCategorize = async () => {
    if (!selectedCategory) return;

    try {
      await categorizeMessage(messageId, selectedCategory);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Transaction categorized successfully',
      });
      
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to categorize transaction',
      });
    }
  };

  if (messageLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading message...</Text>
      </View>
    );
  }

  if (!message) {
    return (
      <View style={styles.container}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.errorTitle}>Message Not Found</Text>
            <Text style={styles.errorText}>
              The requested message could not be found.
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const parsedData = message.parsedData;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      {/* Message Content */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>Message Content</Text>
          <Text style={styles.messageContent}>{message.content}</Text>
        </Card.Content>
      </Card>

      {/* Parsed Information */}
      {parsedData && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Transaction Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Chip 
                style={[
                  styles.detailChip,
                  parsedData.type === 'income' ? styles.incomeChip : styles.expenseChip
                ]}
                textStyle={styles.chipText}
              >
                {parsedData.type === 'income' ? '+' : '-'}JD {parsedData.amount}
              </Chip>
            </View>

            {parsedData.merchant && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Merchant:</Text>
                <Text style={styles.detailValue}>{parsedData.merchant}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Current Category:</Text>
              <Chip style={styles.categoryChip} textStyle={styles.chipText}>
                {parsedData.category}
              </Chip>
            </View>

            {parsedData.source && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Source:</Text>
                <Chip style={styles.sourceChip} textStyle={styles.chipText}>
                  {parsedData.source}
                </Chip>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Category Selection */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>Select New Category</Text>
          
          <View style={styles.categoryGrid}>
            {categories?.map((category) => (
              <Button
                key={category.id}
                mode={selectedCategory === category.id ? 'contained' : 'outlined'}
                onPress={() => setSelectedCategory(category.id)}
                style={styles.categoryButton}
                textColor={selectedCategory === category.id ? '#FFF' : '#FFF'}
              >
                {category.name}
              </Button>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={handleCategorize}
            disabled={!selectedCategory}
            style={styles.saveButton}
            buttonColor="#4CAF50"
          >
            Save Category
          </Button>
        </Card.Content>
      </Card>
      </ScrollView>
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
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#2A2A2A',
    marginBottom: 15,
  },
  cardTitle: {
    color: '#FFF',
    marginBottom: 15,
  },
  messageContent: {
    color: '#FFF',
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    color: '#AAA',
    fontSize: 16,
    width: 100,
  },
  detailValue: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
  detailChip: {
    backgroundColor: '#1E1E1E',
  },
  incomeChip: {
    borderColor: '#4CAF50',
  },
  expenseChip: {
    borderColor: '#FF5722',
  },
  categoryChip: {
    borderColor: '#FF6384',
    backgroundColor: '#1E1E1E',
  },
  sourceChip: {
    borderColor: '#36A2EB',
    backgroundColor: '#1E1E1E',
  },
  chipText: {
    color: '#FFF',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    margin: 5,
    borderColor: '#FFF',
  },
  saveButton: {
    marginTop: 10,
  },
  errorCard: {
    backgroundColor: '#2A2A2A',
    margin: 20,
  },
  errorTitle: {
    color: '#FF5722',
    marginBottom: 10,
  },
  errorText: {
    color: '#FFF',
  },
});
