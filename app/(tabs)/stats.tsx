import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors, categoryColors } from '@/constants/colors';
import { useHabitStore } from '@/store/habit-store';
import { HabitCategory } from '@/types/habit';
import { Calendar, BarChart2, Award, Flame, CheckCircle } from 'lucide-react-native';

export default function StatsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  
  const { habits, getHabitStreak, getLongestStreak, getCompletionRate } = useHabitStore();
  
  const activeHabits = habits.filter(habit => !habit.archived);
  const filteredHabits = selectedCategory === 'all' 
    ? activeHabits 
    : activeHabits.filter(habit => habit.category === selectedCategory);
  
  const habitStats = filteredHabits.map(habit => ({
    ...habit,
    streak: getHabitStreak(habit.id),
    longestStreak: getLongestStreak(habit.id),
    completionRate: getCompletionRate(habit.id),
  }));
  
  // Sort by streak (descending)
  const sortedByStreak = [...habitStats].sort((a, b) => b.streak - a.streak);
  
  // Sort by completion rate (descending)
  const sortedByCompletion = [...habitStats].sort((a, b) => b.completionRate - a.completionRate);
  
  // Get top performers
  const topStreak = sortedByStreak.length > 0 ? sortedByStreak[0] : null;
  const topCompletion = sortedByCompletion.length > 0 ? sortedByCompletion[0] : null;
  
  // Calculate overall stats
  const totalHabits = filteredHabits.length;
  const averageCompletionRate = totalHabits > 0
    ? habitStats.reduce((sum, habit) => sum + habit.completionRate, 0) / totalHabits
    : 0;
  const highestStreak = habitStats.length > 0
    ? Math.max(...habitStats.map(habit => habit.streak))
    : 0;
  const highestLongestStreak = habitStats.length > 0
    ? Math.max(...habitStats.map(habit => habit.longestStreak))
    : 0;
  
  // Get unique categories from active habits
  const categories = ['all', ...new Set(activeHabits.map(habit => habit.category))];

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{ title: 'Statistics' }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected,
                category !== 'all' && { borderColor: categoryColors[category as HabitCategory] },
              ]}
              onPress={() => setSelectedCategory(category as HabitCategory | 'all')}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected,
                  category !== 'all' && { color: categoryColors[category as HabitCategory] },
                ]}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        
        {/* Overall Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Overall Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
                <CheckCircle size={20} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{Math.round(averageCompletionRate)}%</Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.secondaryLight }]}>
                <Flame size={20} color={colors.secondary} />
              </View>
              <Text style={styles.statValue}>{highestStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF5E6' }]}>
                <Award size={20} color="#FFAA5B" />
              </View>
              <Text style={styles.statValue}>{highestLongestStreak}</Text>
              <Text style={styles.statLabel}>Longest Streak</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: '#F7F7FC' }]}>
                <Calendar size={20} color={colors.textLight} />
              </View>
              <Text style={styles.statValue}>{totalHabits}</Text>
              <Text style={styles.statLabel}>Active Habits</Text>
            </View>
          </View>
        </View>
        
        {/* Top Performers */}
        {(topStreak || topCompletion) && (
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Top Performers</Text>
            
            {topStreak && (
              <View style={styles.topPerformerItem}>
                <View style={styles.topPerformerHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
                    <Flame size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.topPerformerTitle}>Longest Current Streak</Text>
                </View>
                
                <View style={styles.topPerformerContent}>
                  <Text style={styles.habitName}>{topStreak.name}</Text>
                  <Text style={styles.habitCategory}>
                    {topStreak.category.charAt(0).toUpperCase() + topStreak.category.slice(1)}
                  </Text>
                  <View style={styles.streakContainer}>
                    <Text style={styles.streakValue}>{topStreak.streak}</Text>
                    <Text style={styles.streakLabel}>
                      day{topStreak.streak !== 1 ? 's' : ''} streak
                    </Text>
                  </View>
                </View>
              </View>
            )}
            
            {topCompletion && (
              <View style={styles.topPerformerItem}>
                <View style={styles.topPerformerHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.secondaryLight }]}>
                    <BarChart2 size={20} color={colors.secondary} />
                  </View>
                  <Text style={styles.topPerformerTitle}>Highest Completion Rate</Text>
                </View>
                
                <View style={styles.topPerformerContent}>
                  <Text style={styles.habitName}>{topCompletion.name}</Text>
                  <Text style={styles.habitCategory}>
                    {topCompletion.category.charAt(0).toUpperCase() + topCompletion.category.slice(1)}
                  </Text>
                  <View style={styles.streakContainer}>
                    <Text style={styles.streakValue}>{Math.round(topCompletion.completionRate)}%</Text>
                    <Text style={styles.streakLabel}>completion rate</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
        
        {/* All Habits Stats */}
        {habitStats.length > 0 && (
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>All Habits</Text>
            
            {habitStats.map((habit) => (
              <View key={habit.id} style={styles.habitStatItem}>
                <View style={styles.habitStatHeader}>
                  <Text style={styles.habitStatName} numberOfLines={1}>
                    {habit.name}
                  </Text>
                  <Text style={[styles.habitStatCategory, { color: habit.color }]}>
                    {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                  </Text>
                </View>
                
                <View style={styles.habitStatDetails}>
                  <View style={styles.habitStatDetail}>
                    <Text style={styles.habitStatValue}>{Math.round(habit.completionRate)}%</Text>
                    <Text style={styles.habitStatLabel}>Completion</Text>
                  </View>
                  
                  <View style={styles.habitStatDetail}>
                    <Text style={styles.habitStatValue}>{habit.streak}</Text>
                    <Text style={styles.habitStatLabel}>Current Streak</Text>
                  </View>
                  
                  <View style={styles.habitStatDetail}>
                    <Text style={styles.habitStatValue}>{habit.longestStreak}</Text>
                    <Text style={styles.habitStatLabel}>Longest Streak</Text>
                  </View>
                </View>
                
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${habit.completionRate}%`, backgroundColor: habit.color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
        
        {habitStats.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <BarChart2 size={40} color={colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No stats available</Text>
            <Text style={styles.emptyMessage}>
              {selectedCategory === 'all'
                ? "You don't have any active habits yet. Add habits to see your statistics."
                : `You don't have any habits in the ${selectedCategory} category.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textLight,
  },
  categoryTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  topPerformerItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 16,
  },
  topPerformerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  topPerformerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  topPerformerContent: {
    paddingLeft: 52,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  habitCategory: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 6,
  },
  streakLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  habitStatItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  habitStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitStatName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  habitStatCategory: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  habitStatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  habitStatDetail: {
    alignItems: 'center',
    flex: 1,
  },
  habitStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  habitStatLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});