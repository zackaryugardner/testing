import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  reminderEnabled: boolean;
  reminderTime: string; // HH:MM format
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
  showCompletedHabits: boolean;
  showArchivedHabits: boolean;
  defaultView: 'today' | 'all';
  
  updateSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      reminderEnabled: true,
      reminderTime: '20:00',
      weekStartsOn: 1, // Monday
      showCompletedHabits: true,
      showArchivedHabits: false,
      defaultView: 'today',
      
      updateSettings: (settings) => {
        set((state) => ({
          ...state,
          ...settings,
        }));
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);