import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useHabitStore } from '@/store/habit-store';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/HabitCard';
import EmptyState from '@/components/EmptyState';
import HabitForm from '@/components/HabitForm';
import HabitOptions from '@/components/HabitOptions';
import DateSelector from '@/components/DateSelector';
import StatsCard from '@/components/StatsCard';

export default function HabitsScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  const { 
    habits, 
    logs, 
    addHabit, 
    updateHabit, 
    deleteHabit, 
    archiveHabit,
    toggleHabitCompletion,
    getHabitsByDate,
    getCompletedHabitsByDate,
    getHabitStats
  } = useHabitStore();

  const dateString = selectedDate.toISOString().split('T')[0];
  const habitsForDate = getHabitsByDate(dateString);
  const completedHabitIds = getCompletedHabitsByDate(dateString);
  const stats = getHabitStats();

  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    addHabit(habitData);
    setShowAddHabit(false);
  };

  const handleUpdateHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    if (selectedHabit) {
      updateHabit(selectedHabit.id, habitData);
      setSelectedHabit(null);
      setEditMode(false);
    }
  };

  const handleToggleCompletion = (habit: Habit) => {
    toggleHabitCompletion(habit.id, dateString);
  };

  const handleHabitOptions = (habit: Habit) => {
    setSelectedHabit(habit);
    setShowOptions(true);
  };

  const handleEditHabit = () => {
    setShowOptions(false);
    setEditMode(true);
  };

  const handleDeleteHabit = () => {
    if (selectedHabit) {
      deleteHabit(selectedHabit.id);
      setShowOptions(false);
      setSelectedHabit(null);
    }
  };

  const handleArchiveHabit = () => {
    if (selectedHabit) {
      archiveHabit(selectedHabit.id);
      setShowOptions(false);
      setSelectedHabit(null);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{
          headerTitle: 'My Habits',
          headerRight: () => (
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              onPress={() => setShowAddHabit(true)}
            >
              <Plus size={20} color={colors.background} />
            </Pressable>
          ),
        }}
      />

      <DateSelector 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />

      {habitsForDate.length > 0 ? (
        <>
          {isToday(selectedDate) && (
            <StatsCard
              currentStreak={stats.currentStreak}
              longestStreak={stats.longestStreak}
              completionRate={stats.completionRate}
              completedToday={completedHabitIds.length}
              totalToday={habitsForDate.length}
            />
          )}

          <FlatList
            data={habitsForDate}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <HabitCard
                habit={item}
                isCompleted={completedHabitIds.includes(item.id)}
                onPress={() => handleToggleCompletion(item)}
                onOptionsPress={() => handleHabitOptions(item)}
              />
            )}
          />
        </>
      ) : (
        <EmptyState
          title="No habits for this day"
          message={
            isToday(selectedDate)
              ? "You don't have any habits scheduled for today. Add your first habit to get started!"
              : "You don't have any habits scheduled for this day. Add a new habit or select a different date."
          }
          buttonText="Add Habit"
          onButtonPress={() => setShowAddHabit(true)}
        />
      )}

      {/* Add/Edit Habit Modal */}
      <Modal
        visible={showAddHabit || editMode}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowAddHabit(false);
          setEditMode(false);
          setSelectedHabit(null);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editMode ? 'Edit Habit' : 'Add New Habit'}
            </Text>
          </View>
          <HabitForm
            initialValues={editMode ? selectedHabit || undefined : undefined}
            onSubmit={editMode ? handleUpdateHabit : handleAddHabit}
            onCancel={() => {
              setShowAddHabit(false);
              setEditMode(false);
              setSelectedHabit(null);
            }}
          />
        </SafeAreaView>
      </Modal>

      {/* Habit Options Modal */}
      <HabitOptions
        visible={showOptions}
        onClose={() => {
          setShowOptions(false);
          setSelectedHabit(null);
        }}
        onEdit={handleEditHabit}
        onDelete={handleDeleteHabit}
        onArchive={handleArchiveHabit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  listContent: {
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
});