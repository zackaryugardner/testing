import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Habit } from '@/types/habit';
import { colors } from '@/constants/colors';
import { CheckCircle, Circle, MoreVertical } from 'lucide-react-native';
import { useHabitStore } from '@/store/habit-store';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  onOptionsPress?: () => void;
}

export default function HabitCard({
  habit,
  isCompleted,
  onPress,
  onLongPress,
  onOptionsPress,
}: HabitCardProps) {
  const getHabitStreak = useHabitStore((state) => state.getHabitStreak);
  const streak = getHabitStreak(habit.id);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.leftSection}>
        <Pressable
          onPress={onPress}
          style={[
            styles.checkContainer,
            { backgroundColor: isCompleted ? habit.color || colors.primary : 'transparent' },
          ]}
        >
          {isCompleted ? (
            <CheckCircle size={24} color={colors.background} />
          ) : (
            <Circle size={24} color={habit.color || colors.primary} />
          )}
        </Pressable>
      </View>
      
      <View style={styles.middleSection}>
        <Text style={styles.title} numberOfLines={1}>
          {habit.name}
        </Text>
        {habit.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {habit.description}
          </Text>
        ) : null}
        {streak > 0 && (
          <View style={styles.streakContainer}>
            <Text style={styles.streakText}>
              {streak} day{streak !== 1 ? 's' : ''} streak
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.rightSection}>
        {onOptionsPress && (
          <Pressable
            onPress={onOptionsPress}
            style={({ pressed }) => [
              styles.optionsButton,
              pressed && styles.optionsPressed,
            ]}
          >
            <MoreVertical size={20} color={colors.textLight} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  leftSection: {
    marginRight: 16,
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  middleSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 12,
    color: colors.textExtraLight,
    fontWeight: '500',
  },
  rightSection: {
    marginLeft: 8,
  },
  optionsButton: {
    padding: 4,
  },
  optionsPressed: {
    opacity: 0.7,
  },
});