import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { colors, categoryColors } from '@/constants/colors';
import { Habit, HabitCategory, HabitFrequency } from '@/types/habit';
import { 
  Heart, 
  Dumbbell, 
  Clock, 
  Brain, 
  BookOpen, 
  DollarSign, 
  Users, 
  Tag 
} from 'lucide-react-native';

interface HabitFormProps {
  initialValues?: Partial<Habit>;
  onSubmit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const CATEGORIES: { value: HabitCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'health', label: 'Health', icon: <Heart size={20} color={categoryColors.health} /> },
  { value: 'fitness', label: 'Fitness', icon: <Dumbbell size={20} color={categoryColors.fitness} /> },
  { value: 'productivity', label: 'Productivity', icon: <Clock size={20} color={categoryColors.productivity} /> },
  { value: 'mindfulness', label: 'Mindfulness', icon: <Brain size={20} color={categoryColors.mindfulness} /> },
  { value: 'learning', label: 'Learning', icon: <BookOpen size={20} color={categoryColors.learning} /> },
  { value: 'finance', label: 'Finance', icon: <DollarSign size={20} color={categoryColors.finance} /> },
  { value: 'social', label: 'Social', icon: <Users size={20} color={categoryColors.social} /> },
  { value: 'other', label: 'Other', icon: <Tag size={20} color={categoryColors.other} /> },
];

const FREQUENCIES: { value: HabitFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export default function HabitForm({ initialValues, onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [category, setCategory] = useState<HabitCategory>(initialValues?.category || 'other');
  const [frequency, setFrequency] = useState<HabitFrequency>(initialValues?.frequency || 'daily');
  const [frequencyDays, setFrequencyDays] = useState<number[]>(initialValues?.frequencyDays || [1, 2, 3, 4, 5]); // Mon-Fri by default
  const [reminder, setReminder] = useState(initialValues?.reminder || '');

  const handleSubmit = () => {
    if (!name.trim()) {
      // Show error or validation message
      return;
    }

    onSubmit({
      name,
      description,
      category,
      frequency,
      frequencyDays: frequency === 'weekly' || frequency === 'custom' ? frequencyDays : undefined,
      reminder,
      color: categoryColors[category],
    });
  };

  const toggleDay = (day: number) => {
    if (frequencyDays.includes(day)) {
      setFrequencyDays(frequencyDays.filter(d => d !== day));
    } else {
      setFrequencyDays([...frequencyDays, day].sort());
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.label}>Habit Name*</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter habit name"
          placeholderTextColor={colors.textExtraLight}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description (optional)"
          placeholderTextColor={colors.textExtraLight}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.value}
              style={[
                styles.categoryButton,
                category === cat.value && styles.categoryButtonSelected,
                { borderColor: categoryColors[cat.value] }
              ]}
              onPress={() => setCategory(cat.value)}
            >
              <View style={styles.categoryIcon}>{cat.icon}</View>
              <Text
                style={[
                  styles.categoryText,
                  category === cat.value && styles.categoryTextSelected,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Frequency</Text>
        <View style={styles.frequencyContainer}>
          {FREQUENCIES.map((freq) => (
            <Pressable
              key={freq.value}
              style={[
                styles.frequencyButton,
                frequency === freq.value && styles.frequencyButtonSelected,
              ]}
              onPress={() => setFrequency(freq.value)}
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequency === freq.value && styles.frequencyTextSelected,
                ]}
              >
                {freq.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {(frequency === 'weekly' || frequency === 'custom') && (
          <>
            <Text style={styles.label}>Days of Week</Text>
            <View style={styles.daysContainer}>
              {DAYS_OF_WEEK.map((day) => (
                <Pressable
                  key={day.value}
                  style={[
                    styles.dayButton,
                    frequencyDays.includes(day.value) && styles.dayButtonSelected,
                  ]}
                  onPress={() => toggleDay(day.value)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      frequencyDays.includes(day.value) && styles.dayTextSelected,
                    ]}
                  >
                    {day.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <View style={styles.buttonContainer}>
          <Pressable style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {initialValues?.id ? 'Update' : 'Create'} Habit
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    padding: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textLight,
  },
  categoryTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  frequencyButton: {
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    padding: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  frequencyButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  frequencyText: {
    fontSize: 14,
    color: colors.textLight,
  },
  frequencyTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    padding: 10,
    width: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: colors.textLight,
  },
  dayTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  submitButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});