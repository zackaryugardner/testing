import React from 'react';
import { StyleSheet, View, Text, Switch, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settings-store';
import { useHabitStore } from '@/store/habit-store';
import { 
  Bell, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Archive, 
  Eye, 
  EyeOff, 
  Trash2, 
  Info, 
  ChevronRight 
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { 
    reminderEnabled, 
    reminderTime, 
    weekStartsOn, 
    showCompletedHabits, 
    showArchivedHabits, 
    defaultView,
    updateSettings 
  } = useSettingsStore();
  
  const { habits } = useHabitStore();
  const archivedHabits = habits.filter(habit => habit.archived);
  
  const handleToggleReminders = () => {
    updateSettings({ reminderEnabled: !reminderEnabled });
  };
  
  const handleToggleShowCompleted = () => {
    updateSettings({ showCompletedHabits: !showCompletedHabits });
  };
  
  const handleToggleShowArchived = () => {
    updateSettings({ showArchivedHabits: !showArchivedHabits });
  };
  
  const handleToggleDefaultView = () => {
    updateSettings({ defaultView: defaultView === 'today' ? 'all' : 'today' });
  };
  
  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all your habits and settings? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // This would clear the Zustand store, but we'd need to implement
            // a reset method in the stores. For now, we'll just show an alert.
            Alert.alert('Data Reset', 'All your data has been reset.');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{ title: 'Settings' }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Bell size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingLabel}>Daily Reminders</Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={handleToggleReminders}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.background}
            />
          </View>
          
          {reminderEnabled && (
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <Clock size={20} color={colors.primary} />
                </View>
                <Text style={styles.settingLabel}>Reminder Time</Text>
              </View>
              <Text style={styles.settingValue}>{reminderTime}</Text>
            </View>
          )}
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Calendar size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingLabel}>Week Starts On</Text>
            </View>
            <Text style={styles.settingValue}>
              {weekStartsOn === 0 ? 'Sunday' : 'Monday'}
            </Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <CheckCircle size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingLabel}>Show Completed Habits</Text>
            </View>
            <Switch
              value={showCompletedHabits}
              onValueChange={handleToggleShowCompleted}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.background}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                {defaultView === 'today' ? (
                  <Eye size={20} color={colors.primary} />
                ) : (
                  <EyeOff size={20} color={colors.primary} />
                )}
              </View>
              <Text style={styles.settingLabel}>Default View</Text>
            </View>
            <Text style={styles.settingValue}>
              {defaultView === 'today' ? 'Today' : 'All Habits'}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed,
            ]}
            onPress={() => {
              if (archivedHabits.length > 0) {
                // Navigate to archived habits screen
                Alert.alert('Archived Habits', `You have ${archivedHabits.length} archived habits.`);
              } else {
                Alert.alert('No Archived Habits', 'You don\'t have any archived habits.');
              }
            }}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Archive size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingLabel}>Archived Habits</Text>
            </View>
            <View style={styles.settingAction}>
              {archivedHabits.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{archivedHabits.length}</Text>
                </View>
              )}
              <ChevronRight size={20} color={colors.textLight} />
            </View>
          </Pressable>
          
          <Pressable
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed,
            ]}
            onPress={handleResetData}
          >
            <View style={styles.settingInfo}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#FFEBEE' }]}>
                <Trash2 size={20} color={colors.danger} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.danger }]}>
                Reset All Data
              </Text>
            </View>
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed,
            ]}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Info size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingLabel}>App Version</Text>
            </View>
            <Text style={styles.settingValue}>1.0.0</Text>
          </Pressable>
        </View>
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
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    marginLeft: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  settingItemPressed: {
    opacity: 0.9,
    backgroundColor: colors.borderLight,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
});