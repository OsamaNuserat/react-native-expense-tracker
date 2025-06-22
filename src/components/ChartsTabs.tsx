import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import PieChart from 'react-native-pie-chart';

import { fetchExpensesSummary, fetchIncomesSummary, fetchExpensesByCategory } from '../api/api';

const chartSize = 250;
const baseColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

type MonthlySummary = { month: string; total: number };
type CategorySummary = { category: string; total: number };

function LegendMonthly({ data }: { data: MonthlySummary[] }) {
    return (
        <View style={styles.legendContainer}>
            {data.map((item, i) => (
                <View key={item.month} style={styles.legendItem}>
                    <View style={[styles.legendColorBox, { backgroundColor: baseColors[i % baseColors.length] }]} />
                    <Text>
                        {new Date(item.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </Text>
                </View>
            ))}
        </View>
    );
}

function LegendCategory({ data }: { data: CategorySummary[] }) {
    return (
        <View style={styles.legendContainer}>
            {data.map((item, i) => (
                <View key={item.category} style={styles.legendItem}>
                    <View style={[styles.legendColorBox, { backgroundColor: baseColors[i % baseColors.length] }]} />
                    <Text>{item.category}</Text>
                </View>
            ))}
        </View>
    );
}

export function ExpensesTab() {
    const { data, isLoading, isError } = useQuery<MonthlySummary[]>({
        queryKey: ['expensesSummary'],
        queryFn: fetchExpensesSummary,
    });

    if (isLoading) return <Text style={styles.status}>Loading expenses…</Text>;
    if (isError || !data) return <Text style={styles.status}>Error loading expenses.</Text>;

    const filtered = data.filter((d) => typeof d.total === 'number' && d.total > 0);
    if (filtered.length === 0) return <Text>No expense data available.</Text>;

    const series = filtered.map((d, i) => ({
        value: d.total,
        color: baseColors[i % baseColors.length],
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>Monthly Expenses</Text>
            <PieChart widthAndHeight={chartSize} series={series} />
            <LegendMonthly data={filtered} />
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.month}
                renderItem={({ item }) => (
                    <Text style={styles.item}>
                        {new Date(item.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} –{' '}
                        {item.total.toFixed(2)} JOD
                    </Text>
                )}
            />
        </View>
    );
}

export function IncomesTab() {
    const { data, isLoading, isError } = useQuery<MonthlySummary[]>({
        queryKey: ['incomesSummary'],
        queryFn: fetchIncomesSummary,
    });

    if (isLoading) return <Text style={styles.status}>Loading incomes…</Text>;
    if (isError || !data) return <Text style={styles.status}>Error loading incomes.</Text>;

    const filtered = data.filter((d) => typeof d.total === 'number' && d.total > 0);
    if (filtered.length === 0) return <Text>No income data available.</Text>;

    const series = filtered.map((d, i) => ({
        value: d.total,
        color: baseColors[i % baseColors.length],
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>Monthly Incomes</Text>
            <PieChart widthAndHeight={chartSize} series={series} />
            <LegendMonthly data={filtered} />
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.month}
                renderItem={({ item }) => (
                    <Text style={styles.item}>
                        {new Date(item.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} –{' '}
                        {item.total.toFixed(2)} JOD
                    </Text>
                )}
            />
        </View>
    );
}

export function ByCategoryTab() {
    const { data, isLoading, isError } = useQuery<CategorySummary[]>({
        queryKey: ['byCategory'],
        queryFn: fetchExpensesByCategory,
    });

    if (isLoading) return <Text style={styles.status}>Loading categories…</Text>;
    if (isError || !data) return <Text style={styles.status}>Error loading categories.</Text>;

    const filtered = data.filter((d) => typeof d.total === 'number' && d.total > 0);
    if (filtered.length === 0) return <Text>No expense data available.</Text>;

    const series = filtered.map((d, i) => ({
        value: d.total,
        color: baseColors[i % baseColors.length],
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>Expenses by Category</Text>
            <PieChart widthAndHeight={chartSize} series={series} />
            <LegendCategory data={filtered} />
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.category}
                renderItem={({ item }) => (
                    <Text style={styles.item}>
                        {item.category}: {item.total.toFixed(2)} JOD
                    </Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12 },
    chartTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 12, textAlign: 'center' },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 16,
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 6 },
    legendColorBox: { width: 16, height: 16, borderRadius: 4, marginRight: 6 },
    item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    status: { marginTop: 50, textAlign: 'center', fontSize: 16 },
});
