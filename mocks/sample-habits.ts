import { Habit } from '@/types/habit';
import { categoryColors } from '@/constants/colors';

// Generate a date string for a specific number of days ago
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const sampleHabits: Habit[] = [
  {
    id: '1',
    name: 'Morning Meditation',
    description: 'Start the day with 10 minutes of mindfulness meditation',
    category: 'mindfulness',
    frequency: 'daily',
    createdAt: daysAgo(30),
    color: categoryColors.mindfulness,
  },
  {
    id: '2',
    name: 'Drink Water',
    description: 'Drink at least 8 glasses of water throughout the day',
    category: 'health',
    frequency: 'daily',
    createdAt: daysAgo(45),
    color: categoryColors.health,
  },
  {
    id: '3',
    name: 'Exercise',
    description: 'At least 30 minutes of physical activity',
    category: 'fitness',
    frequency: 'weekly',
    frequencyDays: [1, 3, 5], // Monday, Wednesday, Friday
    createdAt: daysAgo(60),
    color: categoryColors.fitness,
  },
  {
    id: '4',
    name: 'Read a Book',
    description: 'Read at least 20 pages',
    category: 'learning',
    frequency: 'daily',
    createdAt: daysAgo(15),
    color: categoryColors.learning,
  },
  {
    id: '5',
    name: 'Budget Review',
    description: 'Review expenses and update budget',
    category: 'finance',
    frequency: 'weekly',
    frequencyDays: [0], // Sunday
    createdAt: daysAgo(90),
    color: categoryColors.finance,
  },
];

export default sampleHabits;