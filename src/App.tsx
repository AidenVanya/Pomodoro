import { useState, useEffect } from 'react';
import { usePomodoro } from './hooks/usePomodoro';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { TaskModal } from './components/TaskModal';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import { AmbientBar } from './components/AmbientBar';
import { startAmbientSound, setAmbientVolume, stopAmbientSound } from './utils/audio';

export function App() {
  const {
    status,
    mode,
    round,
    remainingSeconds,
    totalDurationSeconds,
    settings,
    stats,
    tasks,
    activeTaskId,
    toggle,
    reset,
    skip,
    switchMode,
    updateSettings,
    updateTasks,
    selectActiveTask,
  } = usePomodoro();

  const { setTheme, isDark, toggleTheme } = useTheme(settings.theme);

  // Pop up modal states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Directly toggle between light and dark
  const handleToggleTheme = () => {
    const nextTheme = toggleTheme();
    updateSettings({ theme: nextTheme });
  };

  // Keyboard shortcuts (Space: Toggle, R: Reset, S: Skip) - disabled when any modal is open
  const isAnyModalOpen = isSettingsOpen || isTaskModalOpen || isStatsModalOpen;
  useKeyboardShortcuts({
    onToggle: toggle,
    onReset: reset,
    onSkip: skip,
    isEnabled: !isAnyModalOpen,
  });

  // Ambient sound sync
  useEffect(() => {
    if (settings.ambientSound !== 'none') {
      startAmbientSound(settings.ambientSound, settings.ambientVolume);
    } else {
      stopAmbientSound();
    }

    return () => {
      stopAmbientSound();
    };
  }, [settings.ambientSound]);

  const handleAmbientVolumeChange = (newVolume: number) => {
    updateSettings({ ambientVolume: newVolume });
    setAmbientVolume(newVolume);
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;
  const uncompletedTasksCount = tasks.filter((t) => !t.isCompleted).length;

  // Background tint classes according to mode
  const bgModeGlow = {
    FOCUS: 'from-rose-500/5 via-rose-500/2 to-transparent dark:from-rose-950/20 dark:via-rose-950/5',
    SHORT_BREAK: 'from-emerald-500/5 via-emerald-500/2 to-transparent dark:from-emerald-950/20 dark:via-emerald-950/5',
    LONG_BREAK: 'from-sky-500/5 via-sky-500/2 to-transparent dark:from-sky-950/20 dark:via-sky-950/5',
  }[mode];

  return (
    <div className="h-screen h-dvh max-h-dvh w-full bg-stone-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-500 relative overflow-hidden select-none touch-manipulation">
      {/* Dynamic Background Atmosphere Glow */}
      <div
        className={`pointer-events-none fixed inset-0 bg-radial-[at_50%_25%] ${bgModeGlow} transition-colors duration-700`}
        aria-hidden="true"
      />

      {/* Top Header with Safe Area Inset */}
      <Header
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onOpenTasks={() => setIsTaskModalOpen(true)}
        uncompletedTasksCount={uncompletedTasksCount}
      />

      {/* Pure Zen Center: Responsive for both mobile and desktop screens */}
      <main className="flex-1 w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-6 flex flex-col items-center justify-evenly relative z-10 py-1 sm:py-3 md:py-4 overflow-hidden">
        {/* Mode Selector */}
        <ModeSelector
          currentMode={mode}
          onSelectMode={switchMode}
          round={round}
          maxRounds={settings.longBreakInterval}
        />

        {/* Circular Timer Display */}
        <TimerDisplay
          remainingSeconds={remainingSeconds}
          totalDurationSeconds={totalDurationSeconds}
          mode={mode}
          status={status}
          activeTask={activeTask}
          onOpenTasks={() => setIsTaskModalOpen(true)}
        />

        {/* Controls */}
        <TimerControls
          status={status}
          mode={mode}
          onToggle={toggle}
          onReset={reset}
          onSkip={skip}
        />

        {/* Compact Ambient Sound Bar */}
        <AmbientBar
          currentSound={settings.ambientSound}
          volume={settings.ambientVolume}
          onSelectSound={(sound) => updateSettings({ ambientSound: sound })}
          onVolumeChange={handleAmbientVolumeChange}
        />
      </main>

      {/* Minimal Footer with Bottom Safe Area on Mobile, Full Shortcuts Bar on Desktop */}
      <footer className="w-full pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1 sm:pt-3 text-center text-xs text-zinc-400 dark:text-zinc-500 relative z-10 shrink-0">
        <p className="hidden sm:flex items-center justify-center gap-3">
          <span className="font-medium text-zinc-500 dark:text-zinc-400">Kısayollar:</span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] shadow-xs border border-zinc-300/80 dark:border-zinc-700">
              Space
            </kbd>
            <span>Başlat / Duraklat</span>
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] shadow-xs border border-zinc-300/80 dark:border-zinc-700">
              R
            </kbd>
            <span>Sıfırla</span>
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] shadow-xs border border-zinc-300/80 dark:border-zinc-700">
              S
            </kbd>
            <span>Seansı Atla</span>
          </span>
        </p>
        <p className="sm:hidden text-[10px] text-zinc-400 dark:text-zinc-600 font-light tracking-wider">
          ZEN POMODORO
        </p>
      </footer>

      {/* Popups & Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        tasks={tasks}
        activeTaskId={activeTaskId}
        onSelectActiveTask={selectActiveTask}
        onUpdateTasks={updateTasks}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          updateSettings(newSettings);
          if (newSettings.theme) {
            setTheme(newSettings.theme);
          }
        }}
      />
    </div>
  );
}

export default App;
