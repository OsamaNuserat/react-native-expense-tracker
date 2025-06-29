import React, { useState } from 'react';
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, FAB } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { fetchMessages, parseSmsMessage } from '../api/messagesApi';
import MessageItem from '../components/MessageItem';
import AddMessageModal from '../components/AddMessageModal';
import { Message } from '../types';

export default function MessagesScreen() {
  const [addMessageModalVisible, setAddMessageModalVisible] = useState(false);
  
  const queryClient = useQueryClient();

  const { 
    data: messages, 
    isLoading, 
    refetch,
    error 
  } = useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: fetchMessages,
  });

  const addMessageMutation = useMutation({
    mutationFn: ({ content, timestamp }: { content: string; timestamp?: string }) => 
      parseSmsMessage(content, timestamp),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Message added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add message',
      });
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleAddManualMessage = () => {
    setAddMessageModalVisible(true);
  };

  const handleSubmitMessage = (content: string, timestamp?: string) => {
    addMessageMutation.mutate({ content, timestamp });
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>
              Failed to load messages. Please try again.
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MessageItem message={item} />}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                {isLoading ? 'Loading messages...' : 'No messages found.'}
              </Text>
              <Text style={styles.emptySubtext}>
                Messages will appear here when you receive bank SMS notifications.
              </Text>
            </Card.Content>
          </Card>
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        style={styles.list}
      />

      <AddMessageModal
        visible={addMessageModalVisible}
        onDismiss={() => setAddMessageModalVisible(false)}
        onSubmit={handleSubmitMessage}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddManualMessage}
        label="Add Message"
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6384',
  },
});
