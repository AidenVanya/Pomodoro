export type TimerStatus = 'IDLE' | 'RUNNING' | 'PAUSED';

export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

export type SoundTheme = 'zen-bell' | 'singing-bowl' | 'digital' | 'marimba';

export type AmbientSoundType = 'none' | 'rain' | 'white-noise' | 'cafe';

export type AppTheme = 'system' | 'light' | 'dark' | 'sunset' | 'forest';

export interface PomodoroSettings {
  focusDuration: number; // in minutes (e.g. 25)
  shortBreakDuration: number; // in minutes (e.g. 5)
  longBreakDuration: number; // in minutes (e.g. 15)
  longBreakInterval: number; // rounds before long break (e.g. 4)
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  soundVolume: number; // 0 - 100
  soundTheme: SoundTheme;
  notificationsEnabled: boolean;
  ambientSound: AmbientSoundType;
  ambientVolume: number; // 0 - 100
  theme: AppTheme;
}

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  createdAt: number;
}

export interface DailyStat {
  sessions: number;
  minutes: number;
}

export interface PomodoroStats {
  totalSessions: number;
  totalFocusMinutes: number;
  completedTasks: number;
  dailyHistory: Record<string, DailyStat>; // Format: 'YYYY-MM-DD'
  streakDays: number;
  lastActiveDate: string; // Format: 'YYYY-MM-DD'
}
