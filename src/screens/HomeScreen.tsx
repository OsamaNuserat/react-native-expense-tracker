import React from 'react';
import { View, FlatList, StyleSheet, Text, Button, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { fetchMessages, fetchExpensesSummary, fetchIncomesSummary } from '../api/api';
import type { RootStackParamList } from '../types/index';

type Message = { id: number; content: string; userId: number; createdAt: string };
type MonthlySummary = { month: string; total: number };

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'messages', title: 'Messages' },
    { key: 'expenses', title: 'Expenses' },
    { key: 'incomes', title: 'Incomes' },
  ]);

  const {
    data: messages,
    isLoading: loadingMessages,
    isError: errorMessages,
    refetch: refetchMessages,
  } = useQuery<Message[]>({ queryKey: ['messages'], queryFn: fetchMessages });

  const {
    data: expenses,
    isLoading: loadingExpenses,
    isError: errorExpenses,
    refetch: refetchExpenses,
  } = useQuery<MonthlySummary[]>({
    queryKey: ['expensesSummary'],
    queryFn: fetchExpensesSummary,
  });

  const {
    data: incomes,
    isLoading: loadingIncomes,
    isError: errorIncomes,
    refetch: refetchIncomes,
  } = useQuery<MonthlySummary[]>({
    queryKey: ['incomesSummary'],
    queryFn: fetchIncomesSummary,
  });

  const renderMessages = () => {
    if (loadingMessages) return <Text style={styles.status}>Loading messages...</Text>;
    if (errorMessages) return <Text style={styles.status}>Error loading messages.</Text>;
    return (
      <FlatList
        data={messages ?? []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.content}</Text>}
        refreshing={loadingMessages}
        onRefresh={refetchMessages}
      />
    );
  };

  const renderExpenses = () => {
    if (loadingExpenses) return <Text style={styles.status}>Loading expenses…</Text>;
    if (errorExpenses) return <Text style={styles.status}>Error loading expenses.</Text>;
    return (
      <FlatList
        data={expenses ?? []}
        keyExtractor={(item) => item.month}               // ← use month as key
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {new Date(item.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}: {item.total.toFixed(2)} JOD
          </Text>
        )}
        refreshing={loadingExpenses}
        onRefresh={refetchExpenses}
      />
    );
  };

  const renderIncomes = () => {
    if (loadingIncomes) return <Text style={styles.status}>Loading incomes…</Text>;
    if (errorIncomes) return <Text style={styles.status}>Error loading incomes.</Text>;
    return (
      <FlatList
        data={incomes ?? []}
        keyExtractor={(item) => item.month}               // ← and here
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {new Date(item.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}: {item.total.toFixed(2)} JOD
          </Text>
        )}
        refreshing={loadingIncomes}
        onRefresh={refetchIncomes}
      />
    );
  };

  const renderScene = SceneMap({
    messages: renderMessages,
    expenses: renderExpenses,
    incomes: renderIncomes,
  });

  return (
    <View style={styles.container}>
      <Button
        title="View Shortcut Setup"
        onPress={() => navigation.navigate('ShortcutInstructions')}
        color="#007AFF"
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar
            {...(props as any)}
            indicatorStyle={{ backgroundColor: '#007AFF' }}
            style={{ backgroundColor: 'white' }}
            renderLabel={({ route, focused }: { route: { title: string }; focused: boolean }) => (
              <Text style={{ color: focused ? '#007AFF' : '#999', fontWeight: 'bold' }}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  status: { marginTop: 50, textAlign: 'center' },
});
