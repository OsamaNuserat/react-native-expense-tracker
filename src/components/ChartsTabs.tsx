import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { fetchExpensesSummary, fetchIncomesSummary } from '../api/summaryApi';
import { fetchExpensesByCategory, fetchIncomesByCategory } from '../api/transactionApi';
import { MonthlySummary, CategorySummary } from '../types';

const screenWidth = Dimensions.get('window').width;
const chartSize = screenWidth - 40;
const baseColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const chartConfig = {
    backgroundGradientFrom: '#1E1E1E',
    backgroundGradientTo: '#1E1E1E',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

function LegendMonthly({ data }: { data: MonthlySummary[] }) {
    return (
        <View style={styles.legendContainer}>
            {data.map((item, i) => (
                <View key={item.month} style={styles.legendItem}>
                    <View style={[styles.legendColorBox, { backgroundColor: baseColors[i % baseColors.length] }]} />
                    <Text style={styles.legendText}>
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
                    <Text style={styles.legendText}>{item.category}</Text>
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
    if (filtered.length === 0) return <Text style={styles.status}>No expense data available.</Text>;

    const chartData = filtered.map((item, index) => ({
        name: new Date(item.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
        amount: item.total,
        color: baseColors[index % baseColors.length],
        legendFontColor: '#FFF',
        legendFontSize: 12,
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>Monthly Expenses</Text>
            <PieChart
                data={chartData}
                width={chartSize}
                height={220}
                chartConfig={chartConfig}
                accessor={'amount'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
                center={[10, 0]}
                absolute
            />
            <FlatList
                data={filtered}
                keyExtractor={(item, index) => `expense-${item.month}-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.itemText}>
                            {new Date(item.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </Text>
                        <Text style={styles.itemAmount}>
                            {item.total.toFixed(2)} JOD
                        </Text>
                    </View>
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
    if (filtered.length === 0) return <Text style={styles.status}>No income data available.</Text>;

    const chartData = filtered.map((item, index) => ({
        name: new Date(item.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
        amount: item.total,
        color: baseColors[index % baseColors.length],
        legendFontColor: '#FFF',
        legendFontSize: 12,
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>Monthly Incomes</Text>
            <PieChart
                data={chartData}
                width={chartSize}
                height={220}
                chartConfig={chartConfig}
                accessor={'amount'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
                center={[10, 0]}
                absolute
            />
            <FlatList
                data={filtered}
                keyExtractor={(item, index) => `income-${item.month}-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.itemText}>
                            {new Date(item.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </Text>
                        <Text style={[styles.itemAmount, { color: '#4CAF50' }]}>
                            {item.total.toFixed(2)} JOD
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

export function ByCategoryTab() {
    const { data, isLoading, isError } = useQuery<CategorySummary[]>({
        queryKey: ['expensesByCategory'],
        queryFn: () => fetchExpensesByCategory(),
    });

    if (isLoading) return <Text style={styles.status}>Loading categories…</Text>;
    if (isError || !data) return <Text style={styles.status}>Error loading categories.</Text>;

    const filtered = data.filter((d) => typeof d.total === 'number' && d.total > 0);
    if (filtered.length === 0) return <Text style={styles.status}>No expense data available.</Text>;

    const chartData = filtered.map((item, index) => ({
        name: item.category,
        amount: item.total,
        color: baseColors[index % baseColors.length],
        legendFontColor: '#FFF',
        legendFontSize: 12,
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>Expenses by Category</Text>
            <PieChart
                data={chartData}
                width={chartSize}
                height={220}
                chartConfig={chartConfig}
                accessor={'amount'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
                center={[10, 0]}
                absolute
            />
            <FlatList
                data={filtered}
                keyExtractor={(item, index) => `category-${item.category}-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.itemText}>{item.category}</Text>
                        <Text style={styles.itemAmount}>
                            {item.total.toFixed(2)} JOD
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 12,
        backgroundColor: '#1E1E1E',
    },
    chartTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginVertical: 12, 
        textAlign: 'center',
        color: '#FFF',
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 16,
    },
    legendItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginRight: 15, 
        marginBottom: 6 
    },
    legendColorBox: { 
        width: 16, 
        height: 16, 
        borderRadius: 4, 
        marginRight: 6 
    },
    legendText: {
        color: '#FFF',
        fontSize: 12,
    },
    listItem: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#333',
    },
    itemText: {
        color: '#FFF',
        fontSize: 16,
    },
    itemAmount: {
        color: '#FF5722',
        fontSize: 16,
        fontWeight: 'bold',
    },
    status: { 
        marginTop: 50, 
        textAlign: 'center', 
        fontSize: 16,
        color: '#FFF',
    },
});
