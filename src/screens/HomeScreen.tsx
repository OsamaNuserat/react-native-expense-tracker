import React from 'react';
import { View, FlatList, StyleSheet, Text, Button, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { fetchExpensesSummary, fetchIncomesSummary, fetchExpensesByCategory } from '../api/api';

import type { RootStackParamList } from '../types/index';

type MonthlySummary = { month: string; total: number };
type CategorySummary = { category: string; total: number };
type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeNavigationProp>();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'expenses', title: 'Expenses' },
        { key: 'incomes', title: 'Incomes' },
        { key: 'byCategory', title: 'By Category' },
    ]);

    const {
        data: expenses,
        isLoading: loadingExpenses,
        isError: errorExpenses,
        refetch: refetchExpenses,
    } = useQuery<MonthlySummary[]>({
        queryKey: ['expensesSummary'],
        queryFn: fetchExpensesSummary,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });

    const {
        data: incomes,
        isLoading: loadingIncomes,
        isError: errorIncomes,
        refetch: refetchIncomes,
    } = useQuery<MonthlySummary[]>({
        queryKey: ['incomesSummary'],
        queryFn: fetchIncomesSummary,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });

    const {
        data: byCategory,
        isLoading: loadingByCat,
        isError: errorByCat,
        refetch: refetchByCat,
    } = useQuery<CategorySummary[]>({
        queryKey: ['byCategory'],
        queryFn: fetchExpensesByCategory,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });

    const renderExpenses = () => {
        if (loadingExpenses) return <Text style={styles.status}>Loading expenses…</Text>;
        if (errorExpenses) return <Text style={styles.status}>Error loading expenses.</Text>;
        return (
            <FlatList
                data={expenses ?? []}
                keyExtractor={(item, index) => `${item.month}-${index}`}
                renderItem={({ item }) => (
                    <Text style={styles.item}>
                        {new Date(item.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}:{' '}
                        {item.total.toFixed(2)} JOD
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
                keyExtractor={(item, index) => `${item.month}-${index}`}
                renderItem={({ item }) => (
                    <Text style={styles.item}>
                        {new Date(item.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}:{' '}
                        {item.total.toFixed(2)} JOD
                    </Text>
                )}
                refreshing={loadingIncomes}
                onRefresh={refetchIncomes}
            />
        );
    };

    const renderByCategory = () => {
        if (loadingByCat) return <Text style={styles.status}>Loading categories…</Text>;
        if (errorByCat) return <Text style={styles.status}>Error loading categories.</Text>;
        return (
            <FlatList
                data={byCategory ?? []}
                keyExtractor={(item, index) => `${item.category}-${index}`}
                renderItem={({ item }) => (
                    <Text style={styles.item}>
                        {item.category}: {item.total.toFixed(2)} JOD
                    </Text>
                )}
                refreshing={loadingByCat}
                onRefresh={refetchByCat}
            />
        );
    };

    const renderScene = SceneMap({
        expenses: renderExpenses,
        incomes: renderIncomes,
        byCategory: renderByCategory,
    });

    return (
        <View style={styles.container}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: '#007AFF' }}
                        style={{ backgroundColor: 'white' }}
                        activeColor='black'
                        inactiveColor='black'
                    />
                )}
            />

            {/* Optional action buttons */}
            <View style={styles.actions}>
                <Button title='View Parsed Messages' onPress={() => navigation.navigate('Messages')} color='#007AFF' />
                <View style={{ height: 10 }} />
                <Button
                    title='Shortcut Instructions'
                    onPress={() => navigation.navigate('ShortcutInstructions')}
                    color='#007AFF'
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50 },
    item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    status: { marginTop: 50, textAlign: 'center' },
    actions: { padding: 15 },
});
