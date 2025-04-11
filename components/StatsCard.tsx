import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '@/constants/colors';
import { Flame, Award, BarChart2 } from 'lucide-react-native';

interface StatsCardProps {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  completedToday: number;
  totalToday: number;
}

export default function StatsCard({
  currentStreak,
  longestStreak,
  completionRate,
  completedToday,
  totalToday,
}: StatsCardProps) {
  const formattedCompletionRate = Math.round(completionRate);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Stats</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
            <Flame size={20} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: colors.secondaryLight }]}>
            <Award size={20} color={colors.secondary} />
          </View>
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFF5E6' }]}>
            <BarChart2 size={20} color="#FFAA5B" />
          </View>
          <Text style={styles.statValue}>{formattedCompletionRate}%</Text>
          <Text style={styles.statLabel}>Completion</Text>
        </View>
      </View>

      <View style={styles.todayContainer}>
        <Text style={styles.todayText}>
          Today: {completedToday} of {totalToday} completed
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${totalToday > 0 ? (completedToday / totalToday) * 100 : 0}%`,
                backgroundColor: totalToday > 0 && completedToday === totalToday ? colors.success : colors.primary,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
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
  todayContainer: {
    marginTop: 8,
  },
  todayText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});