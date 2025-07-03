import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../auth/LoginScreen';
import RegisterScreen from '../auth/RegisterScreen';
import ShortcutInstructions from '../screens/ShortcutInstructions';
import MessagesScreen from '../screens/MessagesScreen';
import CliqCategoryScreen from '../screens/CliqCategoryScreen';
import MessageDetails from '../screens/MessageDetails';
import CategoriesScreen from '../screens/CategoriesScreen';
import BudgetSettingsScreen from '../screens/BudgetSettingsScreen';
import RecurringPaymentsScreen from '../screens/RecurringPaymentsScreen';
import BillsScreen from '../screens/BillsScreen';
import BillDetailsScreen from '../screens/BillDetailsScreen';
import SpendingAdvisorScreen from '../screens/SpendingAdvisorScreen';
import FinancialGoalsDashboard from '../screens/FinancialGoalsDashboard';
import AppTabs from './AppTabs';

import { RootStackParamList } from '../types';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { userToken, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator>
            {userToken ? (
                // Authenticated user stack
                <Stack.Group>
                    <Stack.Screen 
                        name="Home" 
                        component={AppTabs} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen
                        name="ShortcutInstructions"
                        component={ShortcutInstructions}
                        options={{ title: 'Shortcut Instructions' }}
                    />
                    <Stack.Screen 
                        name="Messages" 
                        component={MessagesScreen} 
                        options={{ title: 'All Messages' }} 
                    />
                    <Stack.Screen 
                        name="MessageDetails" 
                        component={MessageDetails} 
                        options={{ title: 'Message Details' }} 
                    />
                    <Stack.Screen
                        name="CliqCategory"
                        component={CliqCategoryScreen}
                        options={{ title: 'Categorize CliQ Message' }}
                    />
                    <Stack.Screen
                        name="Categories"
                        component={CategoriesScreen}
                        options={{ title: 'Manage Categories' }}
                    />
                    <Stack.Screen
                        name="BudgetSettings"
                        component={BudgetSettingsScreen}
                        options={{ title: 'Budget Settings' }}
                    />
                    <Stack.Screen
                        name="RecurringPayments"
                        component={RecurringPaymentsScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Bills"
                        component={BillsScreen}
                        options={{ title: 'Bills & Reminders' }}
                    />
                    <Stack.Screen
                        name="BillDetails"
                        component={BillDetailsScreen}
                        options={{ title: 'Bill Details' }}
                    />
                    <Stack.Screen
                        name="SpendingAdvisor"
                        component={SpendingAdvisorScreen}
                        options={{ title: 'Spending Advisor' }}
                    />
                    <Stack.Screen
                        name="FinancialGoals"
                        component={FinancialGoalsDashboard}
                        options={{ title: 'Financial Goals' }}
                    />
                </Stack.Group>
            ) : (
                // Authentication stack
                <Stack.Group>
                    <Stack.Screen 
                        name="Login" 
                        component={LoginScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="Register" 
                        component={RegisterScreen} 
                        options={{ headerShown: false }} 
                    />
                </Stack.Group>
            )}
        </Stack.Navigator>
    );
}
