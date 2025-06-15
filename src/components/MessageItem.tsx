import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  message: {
    id: number;
    content: string;
    createdAt: string;
    userId: number;
  };
};

export default function MessageItem({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>{message.content}</Text>
      {message.createdAt ? (
        <Text style={styles.date}>{new Date(message.createdAt).toLocaleString()}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  content: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
