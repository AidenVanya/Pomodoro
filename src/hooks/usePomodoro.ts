import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import type {
  DailyStat,
  PomodoroSettings,
  PomodoroStats,
  Task,
  TimerMode,
  TimerStatus,
} from '../types/pomodoro';
import { playAlertSound } from '../utils/audio';
import { formatTime, getTodayKey, getYesterdayKey } from '../utils/formatters';
import { sendPomodoroNotification } from '../utils/notifications';
import {
  getStoredActiveTaskId,
  getStoredSettings,
  getStoredStats,
  getStoredTasks,
  saveStoredActiveTaskId,
  saveStoredSettings,
  saveStoredStats,
  saveStoredTasks,
} from '../utils/storage';

export function usePomodoro() {
  // Settings & Stats
  const [settings, setSettings] = useState<PomodoroSettings>(getStoredSettings);
  const [stats, setStats] = useState<PomodoroStats>(getStoredStats);
  const [tasks, setTasks] = useState<Task[]>(getStoredTasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(getStoredActiveTaskId);

  // Timer Core States
  const [mode, setMode] = useState<TimerMode>('FOCUS');
  const [status, setStatus] = useState<TimerStatus>('IDLE');
  const [round, setRound] = useState<number>(1);

  // Time in seconds remaining for current mode
  const getModeDurationSeconds = useCallback(
    (targetMode: TimerMode, currentSettings: PomodoroSettings): number => {
      switch (targetMode) {
        case 'FOCUS':
          return currentSettings.focusDuration * 60;
        case 'SHORT_BREAK':
          return currentSettings.shortBreakDuration * 60;
        case 'LONG_BREAK':
          return currentSettings.longBreakDuration * 60;
      }
    },
    []
  );

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    getModeDurationSeconds('FOCUS', settings)
  );

  // References to guarantee drift-free timing
  const targetEndTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Keep references to latest settings and values for callbacks
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const modeRef = useRef(mode);
  modeRef.current = mode;

  const roundRef = useRef(round);
  roundRef.current = round;

  const activeTaskIdRef = useRef(activeTaskId);
  activeTaskIdRef.current = activeTaskId;

  // Persist settings
  const updateSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveStoredSettings(updated);
      return updated;
    });
  }, []);

  // Update remaining seconds when settings change if timer is IDLE
  useEffect(() => {
    if (status === 'IDLE') {
      setRemainingSeconds(getModeDurationSeconds(mode, settings));
    }
  }, [settings, mode, status, getModeDurationSeconds]);

  // Persist tasks
  const updateTasks = useCallback((updater: (prev: Task[]) => Task[]) => {
    setTasks((prev) => {
      const nextTasks = updater(prev);
      saveStoredTasks(nextTasks);
      return nextTasks;
    });
  }, []);

  // Set active task
  const handleSelectActiveTask = useCallback((id: string | null) => {
    setActiveTaskId(id);
    saveStoredActiveTaskId(id);
  }, []);

  // Handle completion of a session
  const handleSessionComplete = useCallback(() => {
    const currentMode = modeRef.current;
    const currentRound = roundRef.current;
    const currentSettings = settingsRef.current;
    const currentActiveTaskId = activeTaskIdRef.current;

    // 1. Play alert sound
    if (currentSettings.soundEnabled) {
      playAlertSound(currentSettings.soundTheme, currentSettings.soundVolume);
    }

    // 2. Notifications & Confetti
    if (currentMode === 'FOCUS') {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fb7185', '#fda4af', '#facc15', '#38bdf8'],
        });
      } catch {
        // Safe fallback
      }

      if (currentSettings.notificationsEnabled) {
        sendPomodoroNotification(
          'Odaklanma Seansı Bitti! 🎉',
          'Tebrikler! Şimdi zihnini dinlendirmek için güzel bir mola ver.'
        );
      }

      // Update statistics
      setStats((prev) => {
        const today = getTodayKey();
        const yesterday = getYesterdayKey();

        const currentTodayStat: DailyStat = prev.dailyHistory[today] || { sessions: 0, minutes: 0 };
        const newDailyHistory = {
          ...prev.dailyHistory,
          [today]: {
            sessions: currentTodayStat.sessions + 1,
            minutes: currentTodayStat.minutes + currentSettings.focusDuration,
          },
        };

        // Calculate streak
        let streak = prev.streakDays;
        if (prev.lastActiveDate === yesterday) {
          streak += 1;
        } else if (prev.lastActiveDate !== today) {
          streak = 1;
        }

        const nextStats: PomodoroStats = {
          ...prev,
          totalSessions: prev.totalSessions + 1,
          totalFocusMinutes: prev.totalFocusMinutes + currentSettings.focusDuration,
          dailyHistory: newDailyHistory,
          streakDays: Math.max(1, streak),
          lastActiveDate: today,
        };

        saveStoredStats(nextStats);
        return nextStats;
      });

      // Increment completed pomodoros for active task if exists
      if (currentActiveTaskId) {
        updateTasks((prevList) =>
          prevList.map((t) =>
            t.id === currentActiveTaskId
              ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
              : t
          )
        );
      }

      // Transition to next break mode
      if (currentRound >= currentSettings.longBreakInterval) {
        setMode('LONG_BREAK');
        setRound(1);
        const nextSec = currentSettings.longBreakDuration * 60;
        setRemainingSeconds(nextSec);

        if (currentSettings.autoStartBreaks) {
          targetEndTimeRef.current = Date.now() + nextSec * 1000;
          setStatus('RUNNING');
        } else {
          targetEndTimeRef.current = null;
          setStatus('IDLE');
        }
      } else {
        setMode('SHORT_BREAK');
        const nextSec = currentSettings.shortBreakDuration * 60;
        setRemainingSeconds(nextSec);

        if (currentSettings.autoStartBreaks) {
          targetEndTimeRef.current = Date.now() + nextSec * 1000;
          setStatus('RUNNING');
        } else {
          targetEndTimeRef.current = null;
          setStatus('IDLE');
        }
      }
    } else {
      // Break completed (SHORT_BREAK or LONG_BREAK)
      if (currentSettings.notificationsEnabled) {
        sendPomodoroNotification(
          'Mola Bitti! ⚡',
          'Molan sona erdi. Yeni bir seansa hazır mısın?'
        );
      }

      if (currentMode === 'SHORT_BREAK') {
        setRound((r) => r + 1);
      }

      setMode('FOCUS');
      const nextSec = currentSettings.focusDuration * 60;
      setRemainingSeconds(nextSec);

      if (currentSettings.autoStartPomodoros) {
        targetEndTimeRef.current = Date.now() + nextSec * 1000;
        setStatus('RUNNING');
      } else {
        targetEndTimeRef.current = null;
        setStatus('IDLE');
      }
    }
  }, [updateTasks]);

  // Main drift-free tick loop
  useEffect(() => {
    if (status === 'RUNNING') {
      const tick = () => {
        if (!targetEndTimeRef.current) return;
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((targetEndTimeRef.current - now) / 1000));

        setRemainingSeconds(diff);

        if (diff <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          handleSessionComplete();
        }
      };

      // Run every 200ms to guarantee zero latency and immediate updates
      intervalRef.current = window.setInterval(tick, 200);

      // Re-synchronize immediately when browser tab regains visibility/focus
      const handleVisibilityChange = () => {
        if (!document.hidden && status === 'RUNNING') {
          tick();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [status, handleSessionComplete]);

  // Actions
  const start = useCallback(() => {
    if (status === 'RUNNING') return;

    const currentRemaining = remainingSeconds > 0
      ? remainingSeconds
      : getModeDurationSeconds(mode, settings);

    targetEndTimeRef.current = Date.now() + currentRemaining * 1000;
    setRemainingSeconds(currentRemaining);
    setStatus('RUNNING');
  }, [status, remainingSeconds, mode, settings, getModeDurationSeconds]);

  const pause = useCallback(() => {
    if (status !== 'RUNNING') return;

    if (targetEndTimeRef.current) {
      const diff = Math.max(0, Math.ceil((targetEndTimeRef.current - Date.now()) / 1000));
      setRemainingSeconds(diff);
      targetEndTimeRef.current = null;
    }
    setStatus('PAUSED');
  }, [status]);

  const toggle = useCallback(() => {
    if (status === 'RUNNING') {
      pause();
    } else {
      start();
    }
  }, [status, pause, start]);

  const reset = useCallback(() => {
    targetEndTimeRef.current = null;
    setStatus('IDLE');
    setRemainingSeconds(getModeDurationSeconds(mode, settings));
  }, [mode, settings, getModeDurationSeconds]);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      targetEndTimeRef.current = null;
      setMode(newMode);
      setStatus('IDLE');
      setRemainingSeconds(getModeDurationSeconds(newMode, settings));
    },
    [settings, getModeDurationSeconds]
  );

  const skip = useCallback(() => {
    if (mode === 'FOCUS') {
      if (round >= settings.longBreakInterval) {
        switchMode('LONG_BREAK');
        setRound(1);
      } else {
        switchMode('SHORT_BREAK');
      }
    } else {
      if (mode === 'SHORT_BREAK') {
        setRound((r) => r + 1);
      }
      switchMode('FOCUS');
    }
  }, [mode, round, settings.longBreakInterval, switchMode]);

  // Dynamic tab title sync
  useEffect(() => {
    const formatted = formatTime(remainingSeconds);
    let modeText = 'Odaklan';
    if (mode === 'SHORT_BREAK') modeText = 'Kısa Mola';
    if (mode === 'LONG_BREAK') modeText = 'Uzun Mola';

    if (status === 'RUNNING') {
      document.title = `${formatted} • ${modeText} | Pomodoro`;
    } else if (status === 'PAUSED') {
      document.title = `[Duraklatıldı] ${formatted} • ${modeText} | Pomodoro`;
    } else {
      document.title = 'Pomodoro - Zen Odaklanma Zamanlayıcısı';
    }
  }, [remainingSeconds, mode, status]);

  // Total duration in seconds for progress calculation
  const totalDurationSeconds = getModeDurationSeconds(mode, settings);
  const progressRatio = totalDurationSeconds > 0
    ? Math.max(0, Math.min(1, (totalDurationSeconds - remainingSeconds) / totalDurationSeconds))
    : 0;

  return {
    status,
    mode,
    round,
    remainingSeconds,
    totalDurationSeconds,
    progressRatio,
    settings,
    stats,
    tasks,
    activeTaskId,
    start,
    pause,
    toggle,
    reset,
    skip,
    switchMode,
    updateSettings,
    updateTasks,
    selectActiveTask: handleSelectActiveTask,
    setStats,
  };
}
