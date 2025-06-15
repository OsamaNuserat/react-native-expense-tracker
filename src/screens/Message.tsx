import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import axios from '../api/api'; 

export default function MessagesScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Loading messages...</Text>;
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.messageContainer}>
          <Text style={styles.content}>{item.content}</Text>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>No messages found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  content: {
    fontSize: 16,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  loadingText: {
    marginTop: 20,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
});
