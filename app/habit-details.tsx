import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { colors, categoryColors } from '@/constants/colors';
import { useHabitStore } from '@/store/habit-store';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  BarChart2,
  Flame,
  Award
} from 'lucide-react-native';
import HabitForm from '@/components/HabitForm';

export default function HabitDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showEdit, setShowEdit] = useState(false);
  
  const { 
    habits, 
    logs, 
    updateHabit, 
    deleteHabit, 
    getHabitLogs,
    getHabitStreak,
    getLongestStreak,
    getCompletionRate
  } = useHabitStore();
  
  const habit = habits.find(h => h.id === id);
  
  if (!habit) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Habit Not Found' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Habit not found</Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
  
  const habitLogs = getHabitLogs(habit.id);
  const streak = getHabitStreak(habit.id);
  const longestStreak = getLongestStreak(habit.id);
  const completionRate = getCompletionRate(habit.id);
  
  // Sort logs by date (newest first)
  const sortedLogs = [...habitLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleUpdateHabit = (habitData: Omit<typeof habit, 'id' | 'createdAt'>) => {
    updateHabit(habit.id, habitData);
    setShowEdit(false);
  };
  
  const handleDeleteHabit = () => {
    deleteHabit(habit.id);
    router.back();
  };
  
  const getFrequencyText = () => {
    switch (habit.frequency) {
      case 'daily':
        return 'Every day';
      case 'weekly':
        if (habit.frequencyDays && habit.frequencyDays.length > 0) {
          const days = habit.frequencyDays.map(day => 
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
          ).join(', ');
          return `Weekly on ${days}`;
        }
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'custom':
        if (habit.frequencyDays && habit.frequencyDays.length > 0) {
          const days = habit.frequencyDays.map(day => 
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
          ).join(', ');
          return `Custom: ${days}`;
        }
        return 'Custom schedule';
      default:
        return 'Not specified';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{
          title: '',
          headerLeft: () => (
            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.headerButtonPressed,
              ]}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color={colors.text} />
            </Pressable>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.headerButtonPressed,
                ]}
                onPress={() => setShowEdit(true)}
              >
                <Edit size={20} color={colors.text} />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.headerButton,
                  styles.deleteButton,
                  pressed && styles.headerButtonPressed,
                ]}
                onPress={handleDeleteHabit}
              >
                <Trash2 size={20} color={colors.danger} />
              </Pressable>
            </View>
          ),
        }}
      />
      
      {showEdit ? (
        <HabitForm
          initialValues={habit}
          onSubmit={handleUpdateHabit}
          onCancel={() => setShowEdit(false)}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View 
              style={[
                styles.categoryBadge, 
                { backgroundColor: categoryColors[habit.category] }
              ]}
            >
              <Text style={styles.categoryText}>
                {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
              </Text>
            </View>
            <Text style={styles.title}>{habit.name}</Text>
            {habit.description ? (
              <Text style={styles.description}>{habit.description}</Text>
            ) : null}
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.primaryLight }]}>
                <Flame size={20} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.secondaryLight }]}>
                <Award size={20} color={colors.secondary} />
              </View>
              <Text style={styles.statValue}>{longestStreak}</Text>
              <Text style={styles.statLabel}>Longest Streak</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFF5E6' }]}>
                <BarChart2 size={20} color="#FFAA5B" />
              </View>
              <Text style={styles.statValue}>{Math.round(completionRate)}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Calendar size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Frequency</Text>
                <Text style={styles.infoValue}>{getFrequencyText()}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Clock size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Created</Text>
                <Text style={styles.infoValue}>
                  {new Date(habit.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>History</Text>
            
            {sortedLogs.length > 0 ? (
              sortedLogs.map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logDate}>
                    <Text style={styles.logDateText}>
                      {new Date(log.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  
                  <View style={styles.logStatus}>
                    {log.completed ? (
                      <View style={styles.logCompleted}>
                        <CheckCircle size={20} color={colors.success} />
                        <Text style={styles.logCompletedText}>Completed</Text>
                      </View>
                    ) : (
                      <View style={styles.logMissed}>
                        <XCircle size={20} color={colors.danger} />
                        <Text style={styles.logMissedText}>Missed</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noLogsText}>No history available yet</Text>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.textLight,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerButtonPressed: {
    backgroundColor: colors.borderLight,
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  deleteButton: {
    marginLeft: 8,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
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
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  logDate: {
    flex: 1,
  },
  logDateText: {
    fontSize: 16,
    color: colors.text,
  },
  logStatus: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logCompletedText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
  },
  logMissed: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logMissedText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.danger,
    fontWeight: '500',
  },
  noLogsText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: 20,
  },
});