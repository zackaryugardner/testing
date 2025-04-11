import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitLog, HabitCategory, HabitFrequency } from '@/types/habit';
import { categoryColors } from '@/constants/colors';

interface HabitState {
  habits: Habit[];
  logs: HabitLog[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => string;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  archiveHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string, date: string, notes?: string) => void;
  getHabitLogs: (habitId: string) => HabitLog[];
  getHabitsByDate: (date: string) => Habit[];
  getCompletedHabitsByDate: (date: string) => string[];
  getHabitStreak: (habitId: string) => number;
  getLongestStreak: (habitId: string) => number;
  getCompletionRate: (habitId: string) => number;
  getHabitStats: () => {
    totalHabits: number;
    completedToday: number;
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
  };
}

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Helper function to check if a habit should be tracked on a specific date
const shouldTrackOnDate = (habit: Habit, dateStr: string) => {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday

  switch (habit.frequency) {
    case 'daily':
      return true;
    case 'weekly':
      // If frequencyDays is defined, check if the current day is included
      if (habit.frequencyDays && habit.frequencyDays.length > 0) {
        return habit.frequencyDays.includes(dayOfWeek);
      }
      // Default to Monday if no specific days are set
      return dayOfWeek === 1;
    case 'monthly':
      // Track on the same day of month as when the habit was created
      const createdDate = new Date(habit.createdAt);
      return date.getDate() === createdDate.getDate();
    case 'custom':
      // For custom frequency, check if frequencyDays is defined
      if (habit.frequencyDays && habit.frequencyDays.length > 0) {
        return habit.frequencyDays.includes(dayOfWeek);
      }
      return true;
    default:
      return true;
  }
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      logs: [],

      addHabit: (habitData) => {
        const id = generateId();
        const now = new Date().toISOString();
        
        const newHabit: Habit = {
          id,
          ...habitData,
          createdAt: now,
          color: habitData.color || categoryColors[habitData.category],
        };

        set((state) => ({
          habits: [...state.habits, newHabit],
        }));

        return id;
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit
          ),
        }));
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
          logs: state.logs.filter((log) => log.habitId !== id),
        }));
      },

      archiveHabit: (id) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, archived: true } : habit
          ),
        }));
      },

      toggleHabitCompletion: (habitId, date, notes) => {
        const { logs } = get();
        const existingLog = logs.find(
          (log) => log.habitId === habitId && log.date === date
        );

        if (existingLog) {
          // Toggle the existing log
          set((state) => ({
            logs: state.logs.map((log) =>
              log.id === existingLog.id
                ? {
                    ...log,
                    completed: !log.completed,
                    notes: notes || log.notes,
                    timestamp: new Date().toISOString(),
                  }
                : log
            ),
          }));
        } else {
          // Create a new log
          const newLog: HabitLog = {
            id: generateId(),
            habitId,
            date,
            completed: true,
            notes,
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            logs: [...state.logs, newLog],
          }));
        }
      },

      getHabitLogs: (habitId) => {
        return get().logs.filter((log) => log.habitId === habitId);
      },

      getHabitsByDate: (date) => {
        return get().habits.filter(
          (habit) => !habit.archived && shouldTrackOnDate(habit, date)
        );
      },

      getCompletedHabitsByDate: (date) => {
        const { logs } = get();
        return logs
          .filter((log) => log.date === date && log.completed)
          .map((log) => log.habitId);
      },

      getHabitStreak: (habitId) => {
        const { logs, habits } = get();
        const habit = habits.find((h) => h.id === habitId);
        
        if (!habit) return 0;
        
        const habitLogs = logs
          .filter((log) => log.habitId === habitId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (habitLogs.length === 0) return 0;
        
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let currentDate = new Date(today);
        
        // Check if the most recent log is from today and is completed
        const todayLog = habitLogs.find(
          (log) => log.date === getTodayDate()
        );
        
        if (todayLog && !todayLog.completed) {
          return 0; // Streak breaks if today's habit is marked as not completed
        }
        
        // If today's habit should be tracked but isn't completed yet, don't count today
        if (!todayLog && shouldTrackOnDate(habit, getTodayDate())) {
          currentDate.setDate(currentDate.getDate() - 1);
        }
        
        while (true) {
          const dateStr = currentDate.toISOString().split('T')[0];
          
          // Check if this habit should be tracked on this date
          if (shouldTrackOnDate(habit, dateStr)) {
            const log = habitLogs.find((log) => log.date === dateStr);
            
            // If there's a log and it's completed, increment streak
            if (log && log.completed) {
              streak++;
            } else {
              break; // Streak ends
            }
          }
          
          // Move to the previous day
          currentDate.setDate(currentDate.getDate() - 1);
        }
        
        return streak;
      },

      getLongestStreak: (habitId) => {
        const { logs, habits } = get();
        const habit = habits.find((h) => h.id === habitId);
        
        if (!habit) return 0;
        
        const habitLogs = logs
          .filter((log) => log.habitId === habitId && log.completed)
          .map((log) => log.date)
          .sort();
        
        if (habitLogs.length === 0) return 0;
        
        let longestStreak = 0;
        let currentStreak = 0;
        let previousDate: Date | null = null;
        
        for (const dateStr of habitLogs) {
          const currentDate = new Date(dateStr);
          
          if (!previousDate) {
            currentStreak = 1;
          } else {
            const diffTime = currentDate.getTime() - previousDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            
            if (diffDays === 1) {
              currentStreak++;
            } else {
              currentStreak = 1;
            }
          }
          
          longestStreak = Math.max(longestStreak, currentStreak);
          previousDate = currentDate;
        }
        
        return longestStreak;
      },

      getCompletionRate: (habitId) => {
        const { logs, habits } = get();
        const habit = habits.find((h) => h.id === habitId);
        
        if (!habit) return 0;
        
        // Get all dates since habit creation where the habit should be tracked
        const createdAt = new Date(habit.createdAt);
        const today = new Date();
        let totalDays = 0;
        let completedDays = 0;
        
        for (let d = new Date(createdAt); d <= today; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          
          if (shouldTrackOnDate(habit, dateStr)) {
            totalDays++;
            
            const log = logs.find(
              (log) => log.habitId === habitId && log.date === dateStr
            );
            
            if (log && log.completed) {
              completedDays++;
            }
          }
        }
        
        return totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
      },

      getHabitStats: () => {
        const { habits, logs } = get();
        const activeHabits = habits.filter((habit) => !habit.archived);
        const today = getTodayDate();
        const todayHabits = activeHabits.filter((habit) => 
          shouldTrackOnDate(habit, today)
        );
        
        const completedToday = logs.filter(
          (log) => log.date === today && log.completed
        ).length;
        
        // Calculate overall completion rate
        let totalTrackableDays = 0;
        let totalCompletedDays = 0;
        
        activeHabits.forEach((habit) => {
          const createdAt = new Date(habit.createdAt);
          const todayDate = new Date();
          
          for (let d = new Date(createdAt); d <= todayDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            
            if (shouldTrackOnDate(habit, dateStr)) {
              totalTrackableDays++;
              
              const log = logs.find(
                (log) => log.habitId === habit.id && log.date === dateStr && log.completed
              );
              
              if (log) {
                totalCompletedDays++;
              }
            }
          }
        });
        
        // Calculate current streak across all habits
        const streaks = activeHabits.map((habit) => get().getHabitStreak(habit.id));
        const currentStreak = streaks.length > 0 ? Math.max(...streaks) : 0;
        
        // Calculate longest streak across all habits
        const longestStreaks = activeHabits.map((habit) => get().getLongestStreak(habit.id));
        const longestStreak = longestStreaks.length > 0 ? Math.max(...longestStreaks) : 0;
        
        return {
          totalHabits: activeHabits.length,
          completedToday,
          currentStreak,
          longestStreak,
          completionRate: totalTrackableDays > 0 
            ? (totalCompletedDays / totalTrackableDays) * 100 
            : 0,
        };
      },
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);