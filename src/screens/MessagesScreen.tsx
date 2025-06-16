// src/screens/MessagesScreen.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import instance from '../api/axiosInstance';   // or '../api/api' if you point baseURL at /api
import MessageItem from '../components/MessageItem';

export default function MessagesScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance.get('/messages')
      .then((response) => setMessages(response.data))
      .catch((err) => console.error('Failed to fetch messages:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Loading messages...</Text>;
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <MessageItem message={item} />}
      ListEmptyComponent={<Text style={styles.emptyText}>No messages found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  loadingText: { marginTop: 20, textAlign: 'center' },
  emptyText:   { marginTop: 20, textAlign: 'center', color: '#666' },
});
