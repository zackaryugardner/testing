export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export type HabitCategory = 
  | 'health' 
  | 'fitness' 
  | 'productivity' 
  | 'mindfulness' 
  | 'learning' 
  | 'finance' 
  | 'social' 
  | 'other';

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  frequencyCount?: number; // For custom frequency (e.g., 3 times per week)
  frequencyDays?: number[]; // For custom days (0-6, where 0 is Sunday)
  createdAt: string;
  color?: string;
  icon?: string;
  reminder?: string; // Time for reminder in HH:MM format
  archived?: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  completed: boolean;
  notes?: string;
  timestamp: string; // ISO datetime string
}

export interface HabitWithLogs extends Habit {
  logs: HabitLog[];
  streak: number;
  longestStreak: number;
  completionRate: number;
}

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}