import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchMessages } from '../api/api'; // adjust import path

// Define your message type
type Message = {
  id: number;
  content: string;
  userId: number;
  createdAt: string;
};

export default function HomeScreen() {
  // Add refetchInterval to poll backend every 5 seconds
  const { data: messages, isLoading, isError, refetch } = useQuery<Message[], Error>({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    refetchInterval: 5000, // 5000 ms = 5 seconds
  });

  if (isLoading) return <Text style={styles.status}>Loading messages...</Text>;
  if (isError) return <Text style={styles.status}>Error loading messages.</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={messages ?? []} // fallback to empty array if undefined
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.message}>{item.content}</Text>}
        ListEmptyComponent={<Text>No messages found.</Text>}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  message: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  status: { marginTop: 50, textAlign: 'center' },
});
