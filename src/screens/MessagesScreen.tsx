import React, { useEffect, useState, useContext } from 'react';
import { FlatList, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { fetchMessages } from '../api/messagesApi';
import instance from '../api/axiosInstance';
import MessageItem from '../components/MessageItem';
import CliqCategoryPrompt from '../components/CliqCategoryPrompt';
import { AuthContext } from '../auth/authContext';

type Message = {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
};

type ParsingResult = {
  actionRequired: boolean;
  senderCategoryConfirmed: boolean;
  parsed: {
    source: string;
    merchant: string;
  } | null;
};

export default function MessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [parsedMessageIds, setParsedMessageIds] = useState<Set<number>>(new Set());
  const [parsingResult, setParsingResult] = useState<ParsingResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const expenseRes = await instance.get('/api/categories?type=expense');
        const incomeRes = await instance.get('/api/categories?type=income');
        const allCategories = [...expenseRes.data, ...incomeRes.data];
        const uniqueCategories = Array.from(
          new Map(allCategories.map((cat) => [cat.name, cat])).values()
        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    handleFetchMessages();
  }, []);

  const handleFetchMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchMessages();
      setMessages(data);
      setParsingResult(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length === 0) return;

    const toParse = messages.find(
      (msg) => msg.content.includes('كليك') && !parsedMessageIds.has(msg.id)
    );

    if (toParse) {
      setParsedMessageIds((prev) => new Set(prev).add(toParse.id));
      parseMessage(toParse.content);
    }
  }, [messages]);

  const parseMessage = async (text: string) => {
    setParsingResult(null);
    setSelectedCategory(null);
    try {
      const response = await instance.post('/api/parse-sms', { content: text });
      setParsingResult(response.data);
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  };

  useEffect(() => {
    if (
      parsingResult?.actionRequired ||
      (parsingResult?.parsed?.source?.toLowerCase() === 'cliq' &&
        !parsingResult?.senderCategoryConfirmed)
    ) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [parsingResult]);

  const saveCategoryMapping = async () => {
    if (!selectedCategory || !parsingResult?.parsed) return;
    try {
      await instance.post('/api/sender-category', {
        sender: parsingResult.parsed.merchant,
        categoryId: selectedCategory,
      });
      setParsingResult(null);
      setSelectedCategory(null);
      await handleFetchMessages();
    } catch (error) {
      console.error('Failed to save sender category:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} size='large' />;
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MessageItem message={item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No messages found.</Text>}
      />

      <CliqCategoryPrompt
        visible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
          setParsingResult(null);
          setSelectedCategory(null);
        }}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSave={saveCategoryMapping}
        sender={parsingResult?.parsed?.merchant || ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
});
