import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, ProgressBar, Chip } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import {
  fetchSpendingSuggestions,
  fetchAdvisorOverview,
  takeSuggestionAction,
  SpendingSuggestion,
  AdvisorOverview,
} from '../api/advisorApi';

export default function SpendingAdvisorScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const queryClient = useQueryClient();

  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview, error: overviewError } = useQuery({
    queryKey: ['advisor-overview', selectedPeriod],
    queryFn: () => fetchAdvisorOverview(selectedPeriod),
    retry: false,
  });

  const { data: suggestions, isLoading: suggestionsLoading, refetch: refetchSuggestions, error: suggestionsError } = useQuery({
    queryKey: ['advisor-suggestions', selectedPeriod],
    queryFn: () => fetchSpendingSuggestions(selectedPeriod, 5),
    retry: false,
  });

  const actionMutation = useMutation({
    mutationFn: ({ suggestionId, action }: { suggestionId: string; action: 'accept' | 'dismiss' | 'learn_more' }) =>
      takeSuggestionAction(suggestionId, action),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Action Completed',
        text2: 'Your feedback has been recorded',
      });
      queryClient.invalidateQueries({ queryKey: ['advisor-suggestions'] });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to process action',
      });
    },
  });

  // Log errors for debugging
  React.useEffect(() => {
    if (overviewError && !overviewError.message?.includes?.('not available')) {
      console.error('Overview API Error:', overviewError);
    }
    if (suggestionsError && !suggestionsError.message?.includes?.('not available')) {
      console.error('Suggestions API Error:', suggestionsError);
    }
  }, [overviewError, suggestionsError]);

  const handleRefresh = async () => {
    await Promise.all([refetchOverview(), refetchSuggestions()]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#FF5722';
      case 'high': return '#FF9800';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#888';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#4CAF50';
      case 'moderate': return '#FFC107';
      case 'warning': return '#FF9800';
      case 'critical': return '#FF5722';
      default: return '#888';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'checkmark-circle';
      case 'medium': return 'time';
      case 'hard': return 'flash';
      default: return 'help-circle';
    }
  };

  const SpendingOverviewCard = () => (
    <Card style={styles.overviewCard}>
      <Card.Content>
        <Text style={styles.overviewTitle}>Spending Overview</Text>
        
        {overviewLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading overview...</Text>
          </View>
        ) : overview && overview.currentSpending && overview.budget ? (
          <>
            <View style={styles.spendingRow}>
              <View style={styles.spendingItem}>
                <Text style={styles.spendingLabel}>Current Spending</Text>
                <Text style={styles.spendingAmount}>
                  {overview.currentSpending.currency || 'JD'}{overview.currentSpending.amount?.toFixed(2) || '0.00'}
                </Text>
              </View>
              <View style={styles.spendingItem}>
                <Text style={styles.spendingLabel}>Budget Remaining</Text>
                <Text style={[styles.spendingAmount, { color: getStatusColor(overview.status || 'moderate') }]}>
                  {overview.budget.currency || 'JD'}{overview.budget.remaining?.toFixed(2) || '0.00'}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Budget Progress</Text>
              <ProgressBar 
                progress={(overview.budget.percentage || 0) / 100} 
                color={getStatusColor(overview.status || 'moderate')}
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {(overview.budget.percentage || 0).toFixed(1)}% used
              </Text>
            </View>

            <Chip 
              mode="outlined" 
              style={[styles.statusChip, { borderColor: getStatusColor(overview.status || 'moderate') }]}
              textStyle={{ color: getStatusColor(overview.status || 'moderate') }}
            >
              {(overview.status || 'moderate').toUpperCase()}
            </Chip>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Overview data not available</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const SuggestionCard = ({ suggestion }: { suggestion: SpendingSuggestion }) => (
    <Card style={styles.suggestionCard}>
      <Card.Content>
        <View style={styles.suggestionHeader}>
          <View style={styles.suggestionTitleRow}>
            <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
            <View style={styles.suggestionTitleContainer}>
              <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
              <View style={styles.badgeRow}>
                <Chip 
                  mode="outlined" 
                  compact 
                  style={[styles.priorityChip, { borderColor: getPriorityColor(suggestion.priority) }]}
                  textStyle={{ color: getPriorityColor(suggestion.priority), fontSize: 10 }}
                >
                  {suggestion.priority.toUpperCase()}
                </Chip>
                <Chip 
                  mode="outlined" 
                  compact 
                  style={styles.difficultyChip}
                  textStyle={{ color: '#CCC', fontSize: 10 }}
                  icon={() => <Icon name={getDifficultyIcon(suggestion.difficultyLevel)} size={12} color="#CCC" />}
                >
                  {suggestion.difficultyLevel}
                </Chip>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.suggestionDescription}>{suggestion.description}</Text>

        {suggestion.impact?.savings && (
          <View style={styles.savingsContainer}>
            <Icon name="trending-up" size={16} color="#4CAF50" />
            <Text style={styles.savingsText}>
              Potential savings: {suggestion.impact.currency || '$'}{suggestion.impact.savings.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <Button 
            mode="contained" 
            onPress={() => actionMutation.mutate({ suggestionId: suggestion.id, action: 'accept' })}
            style={styles.primaryButton}
            loading={actionMutation.isPending}
          >
            {suggestion.actionText}
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => actionMutation.mutate({ suggestionId: suggestion.id, action: 'learn_more' })}
            style={styles.secondaryButton}
          >
            Learn More
          </Button>
          <Button 
            mode="text" 
            onPress={() => actionMutation.mutate({ suggestionId: suggestion.id, action: 'dismiss' })}
            textColor="#888"
          >
            Dismiss
          </Button>
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
            refreshing={overviewLoading || suggestionsLoading} 
            onRefresh={handleRefresh}
            tintColor="#FF6384"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spending Advisor</Text>
          <Text style={styles.headerSubtitle}>
            AI-powered insights to optimize your spending
          </Text>
        </View>

        {/* Spending Overview */}
        <SpendingOverviewCard />

        {/* Suggestions Section */}
        <View style={styles.suggestionsSection}>
          <Text style={styles.sectionTitle}>Personalized Suggestions</Text>
          
          {Array.isArray(suggestions) && suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Icon name="checkmark-circle" size={48} color="#4CAF50" />
                <Text style={styles.emptyTitle}>
                  {suggestionsLoading ? 'Loading suggestions...' : 'Great job!'}
                </Text>
                <Text style={styles.emptyText}>
                  {suggestionsLoading 
                    ? 'Getting your personalized spending insights...'
                    : 'You\'re managing your spending well. Check back later for new suggestions.'
                  }
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  overviewCard: {
    backgroundColor: '#2A2A2A',
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 16,
  },
  spendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  spendingItem: {
    flex: 1,
  },
  spendingLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  spendingAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#CCC',
    textAlign: 'center',
  },
  statusChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
  },
  suggestionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  suggestionCard: {
    backgroundColor: '#2A2A2A',
    marginBottom: 16,
    borderRadius: 12,
  },
  suggestionHeader: {
    marginBottom: 12,
  },
  suggestionTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  suggestionIcon: {
    fontSize: 24,
  },
  suggestionTitleContainer: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    backgroundColor: 'transparent',
  },
  difficultyChip: {
    backgroundColor: 'transparent',
    borderColor: '#555',
  },
  suggestionDescription: {
    fontSize: 14,
    color: '#CCC',
    lineHeight: 20,
    marginBottom: 12,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    padding: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 6,
  },
  savingsText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#FF6384',
    flex: 1,
    minWidth: 120,
  },
  secondaryButton: {
    borderColor: '#FF6384',
    flex: 1,
    minWidth: 100,
  },
  emptyCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
