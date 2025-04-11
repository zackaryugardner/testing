import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const dates = getDatesForWeek(selectedDate);
  
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthYear}>
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
      </View>
      
      <View style={styles.dateSelector}>
        <Pressable
          style={({ pressed }) => [
            styles.arrowButton,
            pressed && styles.arrowButtonPressed,
          ]}
          onPress={handlePrevDay}
        >
          <ChevronLeft size={20} color={colors.textLight} />
        </Pressable>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datesContainer}
        >
          {dates.map((date) => (
            <Pressable
              key={date.toISOString()}
              style={({ pressed }) => [
                styles.dateButton,
                isSelected(date) && styles.selectedDateButton,
                pressed && styles.dateButtonPressed,
              ]}
              onPress={() => onDateChange(date)}
            >
              <Text style={[styles.dayName, isSelected(date) && styles.selectedDayName]}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <Text style={[styles.dayNumber, isSelected(date) && styles.selectedDayNumber]}>
                {date.getDate()}
              </Text>
              {isToday(date) && <View style={styles.todayIndicator} />}
            </Pressable>
          ))}
        </ScrollView>
        
        <Pressable
          style={({ pressed }) => [
            styles.arrowButton,
            pressed && styles.arrowButtonPressed,
          ]}
          onPress={handleNextDay}
        >
          <ChevronRight size={20} color={colors.textLight} />
        </Pressable>
      </View>
    </View>
  );
}

// Helper function to get dates for the current week
function getDatesForWeek(currentDate: Date) {
  const dates = [];
  const startDate = new Date(currentDate);
  
  // Go back 3 days
  startDate.setDate(currentDate.getDate() - 3);
  
  // Generate 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  
  return dates;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    padding: 8,
    borderRadius: 20,
  },
  arrowButtonPressed: {
    backgroundColor: colors.borderLight,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 64,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  selectedDateButton: {
    backgroundColor: colors.primaryLight,
  },
  dateButtonPressed: {
    opacity: 0.8,
  },
  dayName: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  selectedDayName: {
    color: colors.primary,
    fontWeight: '500',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  selectedDayNumber: {
    color: colors.primary,
  },
  todayIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
});