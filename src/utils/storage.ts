import type { PomodoroSettings, PomodoroStats, Task } from '../types/pomodoro';

const STORAGE_KEYS = {
  SETTINGS: 'pomodoro_settings_v1',
  TASKS: 'pomodoro_tasks_v1',
  ACTIVE_TASK_ID: 'pomodoro_active_task_id_v1',
  STATS: 'pomodoro_stats_v1',
} as const;

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  soundVolume: 80,
  soundTheme: 'chronos-bell',
  notificationsEnabled: false,
  ambientSound: 'none',
  ambientVolume: 40,
  theme: 'chronos',
  timerVisualMode: 'combined',
};

export const DEFAULT_STATS: PomodoroStats = {
  totalSessions: 0,
  totalFocusMinutes: 0,
  completedTasks: 0,
  dailyHistory: {},
  streakDays: 0,
  lastActiveDate: '',
};

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'İlk Pomodoro seansını tamamla',
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    isCompleted: false,
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: 'Önemli projeye odaklan',
    estimatedPomodoros: 4,
    completedPomodoros: 0,
    isCompleted: false,
    createdAt: Date.now() + 1,
  },
];

export function getStoredSettings(): PomodoroSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: PomodoroSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
}

export function getStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return INITIAL_TASKS;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return INITIAL_TASKS;
  }
}

export function saveStoredTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

export function getStoredActiveTaskId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TASK_ID);
  } catch {
    return null;
  }
}

export function saveStoredActiveTaskId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TASK_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TASK_ID);
    }
  } catch (error) {
    console.error('Failed to save active task ID:', error);
  }
}

export function getStoredStats(): PomodoroStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch (error) {
    console.error('Failed to load stats from localStorage:', error);
    return DEFAULT_STATS;
  }
}

export function saveStoredStats(stats: PomodoroStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats to localStorage:', error);
  }
}
