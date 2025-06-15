import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { fetchMessages } from '../api/api';
import { AuthContext } from '../auth/authContext';
import type { RootStackParamList } from '../types/index';

type Message = {
  id: number;
  content: string;
  userId: number;
  createdAt: string;
};

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const { userToken } = useContext(AuthContext);
  const navigation = useNavigation<HomeNavigationProp>();

  const { data: messages, isLoading, isError, refetch } = useQuery<Message[], Error>({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    refetchInterval: 5000,
  });

  if (isLoading) return <Text style={styles.status}>Loading messages...</Text>;
  if (isError) return <Text style={styles.status}>Error loading messages.</Text>;

  return (
    <View style={styles.container}>
      <Button
        title="View Shortcut Setup"
        onPress={() => navigation.navigate('ShortcutInstructions')}
        color="#007AFF"
      />

      <FlatList
        data={messages ?? []}
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
  container: { flex: 1, padding: 10, paddingTop: 50 },
  label: { fontWeight: 'bold', marginBottom: 5, fontSize: 16 },
  tokenContainer: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 20,
  },
  tokenText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#444',
  },
  message: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  status: { marginTop: 50, textAlign: 'center' },
});
