import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Card, FAB, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { getFinancialGoals, getFinancialGoalsStats } from '../api/financialGoalsApi';
import { formatCurrency } from '../utils/formatters';
import { FinancialGoal, GoalType, GoalPriority } from '../types';
import CreateGoalModal from '../components/CreateGoalModal';

const { width } = Dimensions.get('window');

const GOAL_TYPE_ICONS: Record<GoalType, string> = {
  EMERGENCY_FUND: 'shield-checkmark',
  VACATION: 'airplane',
  CAR_PURCHASE: 'car',
  HOUSE_DOWN_PAYMENT: 'home',
  DEBT_PAYOFF: 'card',
  WEDDING: 'heart',
  EDUCATION: 'school',
  RETIREMENT: 'time',
  INVESTMENT: 'trending-up',
  HOME_IMPROVEMENT: 'hammer',
  BUSINESS: 'briefcase',
  GADGET: 'phone-portrait',
  CUSTOM: 'star'
};

const GOAL_TYPE_COLORS: Record<GoalType, string> = {
  EMERGENCY_FUND: '#FF6B6B',
  VACATION: '#4ECDC4',
  CAR_PURCHASE: '#45B7D1',
  HOUSE_DOWN_PAYMENT: '#96CEB4',
  DEBT_PAYOFF: '#FFEAA7',
  WEDDING: '#FD79A8',
  EDUCATION: '#74B9FF',
  RETIREMENT: '#A29BFE',
  INVESTMENT: '#00B894',
  HOME_IMPROVEMENT: '#FDCB6E',
  BUSINESS: '#6C5CE7',
  GADGET: '#00CEC9',
  CUSTOM: '#DDA0DD'
};

const PRIORITY_COLORS: Record<GoalPriority, string> = {
  LOW: '#74B9FF',
  MEDIUM: '#FDCB6E',
  HIGH: '#FF7675',
  URGENT: '#E84393'
};

export default function FinancialGoalsDashboard() {
  const navigation = useNavigation();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editGoal, setEditGoal] = useState<FinancialGoal | null>(null);

  const { data: goals, isLoading: goalsLoading, refetch: refetchGoals } = useQuery({
    queryKey: ['financialGoals'],
    queryFn: getFinancialGoals,
  });

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['financialGoalsStats'],
    queryFn: getFinancialGoalsStats,
  });

  const onRefresh = async () => {
    await Promise.all([refetchGoals(), refetchStats()]);
  };

  const activeGoals = goals?.filter(goal => goal.isActive && !goal.isCompleted) || [];
  const completedGoals = goals?.filter(goal => goal.isCompleted) || [];

  const GoalCard = ({ goal }: { goal: FinancialGoal }) => {
    const progressPercentage = goal.progress / 100;
    const color = GOAL_TYPE_COLORS[goal.goalType];
    const icon = GOAL_TYPE_ICONS[goal.goalType];
    const priorityColor = PRIORITY_COLORS[goal.priority];

    const handleEditGoal = () => {
      if (goal.isActive && !goal.isCompleted) {
        setEditGoal(goal);
        setIsCreateModalVisible(true);
      }
    };

    return (
      <TouchableOpacity 
        style={styles.goalCard}
        onPress={() => {
          // navigation.navigate('GoalDetail', { goalId: goal.id });
          console.log('Navigate to goal detail:', goal.id);
        }}
        onLongPress={handleEditGoal}
        delayLongPress={500}
      >
        <Card style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
          <Card.Content>
            {/* Header */}
            <View style={styles.goalHeader}>
              <View style={styles.goalTitleRow}>
                <Icon name={icon} size={24} color={color} />
                <Text style={styles.goalTitle} numberOfLines={1}>{goal.title}</Text>
                <View style={styles.goalActions}>
                  <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
                    <Text style={styles.priorityText}>{goal.priority}</Text>
                  </View>
                  {goal.isActive && !goal.isCompleted && (
                    <TouchableOpacity onPress={handleEditGoal} style={styles.editButton}>
                      <Icon name="pencil" size={16} color="#4ECDC4" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {goal.description && (
                <Text style={styles.goalDescription} numberOfLines={2}>
                  {goal.description}
                </Text>
              )}
            </View>

            {/* Progress */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>
                  {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(goal.progress)}%
                </Text>
              </View>
              <ProgressBar 
                progress={Math.min(progressPercentage, 1)} 
                color={color}
                style={styles.progressBar}
              />
              <View style={styles.progressFooter}>
                <Text style={styles.remainingText}>
                  {formatCurrency(goal.remaining)} remaining
                </Text>
                {goal.daysLeft && goal.daysLeft > 0 && (
                  <Text style={styles.timeLeft}>
                    {goal.daysLeft} days left
                  </Text>
                )}
              </View>
            </View>

            {/* Monthly Target */}
            {goal.monthlyTarget && (
              <View style={styles.monthlyTarget}>
                <Icon name="calendar-outline" size={16} color="#888" />
                <Text style={styles.monthlyTargetText}>
                  Monthly target: {formatCurrency(goal.monthlyTarget)}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const StatsCard = ({ title, value, subtitle, icon, color }: any) => (
    <Card style={styles.statsCard}>
      <Card.Content style={styles.statsContent}>
        <Icon name={icon} size={36} color={color} />
        <View style={styles.statsText}>
          <Text style={styles.statsValue}>{value}</Text>
          <Text style={styles.statsTitle}>{title}</Text>
          {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={goalsLoading || statsLoading} 
            onRefresh={onRefresh}
            tintColor="#FF6384"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Financial Goals</Text>
          <Text style={styles.headerSubtitle}>Track and achieve your financial dreams</Text>
        </View>

        {/* Statistics Overview */}
        {stats && (
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <StatsCard
                title="Active Goals"
                value={stats.active}
                icon="flag"
                color="#4ECDC4"
              />
              <StatsCard
                title="Completed"
                value={stats.completed}
                icon="checkmark-circle"
                color="#00B894"
              />
            </View>
            <View style={styles.statsGrid}>
              <StatsCard
                title="Total Progress"
                value={`${Math.round(stats.averageProgress)}%`}
                subtitle={formatCurrency(stats.totalCurrentAmount)}
                icon="trending-up"
                color="#74B9FF"
              />
              <StatsCard
                title="Remaining"
                value={formatCurrency(stats.totalRemaining)}
                subtitle={`of ${formatCurrency(stats.totalTargetAmount)}`}
                icon="target"
                color="#FDCB6E"
              />
            </View>
          </View>
        )}

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Goals</Text>
              <Text style={styles.sectionHint}>Tap the edit icon to modify goals</Text>
            </View>
            {activeGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </View>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed Goals 🎉</Text>
            {completedGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {(!goals || goals.length === 0) && !goalsLoading && (
          <View style={styles.emptyState}>
            <Icon name="flag-outline" size={64} color="#888" />
            <Text style={styles.emptyTitle}>No Financial Goals Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start your financial journey by creating your first goal
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Create Goal FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setIsCreateModalVisible(true)}
        color="#FFF"
      />

      {/* Create Goal Modal */}
      <CreateGoalModal
        visible={isCreateModalVisible}
        onDismiss={() => {
          setIsCreateModalVisible(false);
          setEditGoal(null);
        }}
        editGoal={editGoal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    minHeight: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    minHeight: 80,
    justifyContent: 'center',
  },
  statsText: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  statsValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  statsTitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
    fontWeight: '500',
  },
  statsSubtitle: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    fontWeight: '400',
  },
  goalCard: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
  },
  goalHeader: {
    marginBottom: 16,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  goalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  goalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  goalDescription: {
    fontSize: 14,
    color: '#AAA',
    lineHeight: 20,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  remainingText: {
    fontSize: 12,
    color: '#888',
  },
  timeLeft: {
    fontSize: 12,
    color: '#FDCB6E',
    fontWeight: '500',
  },
  monthlyTarget: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  monthlyTargetText: {
    fontSize: 12,
    color: '#888',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4ECDC4',
  },
});
