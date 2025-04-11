import React from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useHabitStore } from '@/store/habit-store';
import { Archive, ArrowLeft } from 'lucide-react-native';
import HabitCard from '@/components/HabitCard';
import EmptyState from '@/components/EmptyState';

export default function ArchivedHabitsScreen() {
  const { habits, updateHabit, deleteHabit } = useHabitStore();
  const archivedHabits = habits.filter(habit => habit.archived);

  const handleUnarchive = (habitId: string) => {
    updateHabit(habitId, { archived: false });
  };

  const handleDelete = (habitId: string) => {
    deleteHabit(habitId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{
          title: 'Archived Habits',
          headerLeft: () => (
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color={colors.text} />
            </Pressable>
          ),
        }}
      />

      {archivedHabits.length > 0 ? (
        <FlatList
          data={archivedHabits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              isCompleted={false}
              onPress={() => handleUnarchive(item.id)}
              onLongPress={() => handleDelete(item.id)}
            />
          )}
        />
      ) : (
        <EmptyState
          title="No Archived Habits"
          message="You don't have any archived habits. When you archive a habit, it will appear here."
          buttonText="Go Back"
          onButtonPress={() => router.back()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  listContent: {
    padding: 16,
  },
});