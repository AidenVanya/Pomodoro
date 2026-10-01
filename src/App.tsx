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
import { PullToRefreshIndicator } from './components/PullToRefreshIndicator';
import { SplashScreen } from './components/SplashScreen';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import { usePwaInstall } from './hooks/usePwaInstall';
import { startAmbientSound, setAmbientVolume, stopAmbientSound } from './utils/audio';
import { Share, X as CloseIcon, Download } from 'lucide-react';

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

  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // Browser PWA installation
  const { isInstallable, installApp, showIOSPrompt, setShowIOSPrompt } = usePwaInstall();

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
  const isAnyModalOpen = isSettingsOpen || isTaskModalOpen || isStatsModalOpen || showIOSPrompt;
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

  // Custom touch pull-to-refresh on mobile
  const { pullDistance, isRefreshing, threshold } = usePullToRefresh();

  // Dynamic Theme Base Background and Text colors
  const themeBaseClass = {
    chronos: 'bg-[#06090d] text-amber-100',
    light: 'bg-[#faf8f5] text-stone-800',
    dark: 'bg-[#0c0d12] text-zinc-100',
    sunset: 'bg-[#0f0c1b] text-purple-100',
    forest: 'bg-[#08120d] text-emerald-100',
    system: isDark ? 'bg-[#06090d] text-amber-100' : 'bg-[#faf8f5] text-stone-800',
  }[settings.theme] || 'bg-[#06090d] text-amber-100';

  // Background tint classes according to mode and theme (Chronos gold & underworld emerald)
  const isChronos = settings.theme === 'chronos' || settings.theme === 'system';
  const bgModeGlow = {
    FOCUS: isChronos
      ? 'from-amber-600/20 via-emerald-950/25 to-transparent'
      : isDark
      ? 'from-rose-500/20 via-rose-950/15 to-transparent'
      : 'from-rose-400/20 via-rose-100/25 to-transparent',
    SHORT_BREAK: isChronos
      ? 'from-emerald-600/25 via-teal-950/25 to-transparent'
      : isDark
      ? 'from-emerald-500/20 via-emerald-950/15 to-transparent'
      : 'from-emerald-400/20 via-emerald-100/25 to-transparent',
    LONG_BREAK: isChronos
      ? 'from-sky-600/25 via-indigo-950/25 to-transparent'
      : isDark
      ? 'from-sky-500/20 via-sky-950/15 to-transparent'
      : 'from-sky-400/20 via-sky-100/25 to-transparent',
  }[mode];

  return (
    <div className={`min-h-screen min-h-dvh w-full flex flex-col justify-between transition-colors duration-500 relative select-none touch-pan-y ${themeBaseClass}`}>
      {/* Cinematic Splash Screen with Official Chronos Logo */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Mobile Pull-to-Refresh Indicator */}
      <PullToRefreshIndicator
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
        threshold={threshold}
      />

      {/* Floating Cosmic Time Shards & Stardust in the Void (Chronos aesthetic) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 opacity-40">
        <div className="absolute top-[12%] left-[8%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-time-particle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[28%] right-[12%] w-2 h-2 bg-emerald-400 rounded-full animate-time-particle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[65%] left-[15%] w-1 h-1 bg-yellow-300 rounded-full animate-time-particle" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[75%] right-[20%] w-2 h-2 bg-amber-300 rounded-full animate-time-particle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[45%] left-[85%] w-1.5 h-1.5 bg-emerald-300 rounded-full animate-time-particle" style={{ animationDelay: '3s' }} />
      </div>

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
        isInstallable={isInstallable}
        onInstallApp={installApp}
      />

      {/* Pure Zen Center: Responsive for both mobile and desktop screens */}
      <main className="flex-1 w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-6 flex flex-col items-center justify-evenly relative z-10 py-1 sm:py-2 md:py-3">
        {/* Mode Selector */}
        <ModeSelector
          currentMode={mode}
          onSelectMode={switchMode}
          round={round}
          maxRounds={settings.longBreakInterval}
        />

        {/* Circular Timer Display with Rotating Gears and Golden Hourglass */}
        <TimerDisplay
          remainingSeconds={remainingSeconds}
          totalDurationSeconds={totalDurationSeconds}
          mode={mode}
          status={status}
          activeTask={activeTask}
          onOpenTasks={() => setIsTaskModalOpen(true)}
          initialVisualMode={settings.timerVisualMode || 'combined'}
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

      {/* Minimal Footer with Chronos Time Proverb */}
      <footer className="w-full pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1 sm:pt-2 px-3 text-center text-xs text-amber-400/60 relative z-10 shrink-0 font-chronos">
        <p className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs tracking-wider opacity-80 px-2">
          <span>⏳</span>
          <span className="italic">"Zaman, ölümlülerin en kıymetli hazinesidir; her saniye bir zaferdir."</span>
          <span>⚜</span>
        </p>

        <p className="hidden sm:flex items-center justify-center gap-3 mt-1 text-[11px] text-amber-500/50">
          <span className="font-semibold text-amber-400/70">Kısayollar:</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono text-[10px] border border-amber-500/30">
              Space
            </kbd>
            <span>Dondur / Başlat</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono text-[10px] border border-amber-500/30">
              R
            </kbd>
            <span>Geri Al</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono text-[10px] border border-amber-500/30">
              S
            </kbd>
            <span>İleri Sar</span>
          </span>
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

      {/* iOS Installation Instruction Modal */}
      {showIOSPrompt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowIOSPrompt(false)}
        >
          <div
            className="w-full max-w-sm bg-[#0a0e14] text-amber-100 rounded-3xl border border-amber-500/40 p-6 shadow-2xl relative font-chronos"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowIOSPrompt(false)}
              aria-label="Kapat"
              className="absolute top-4 right-4 p-1.5 rounded-xl text-amber-400/60 hover:text-amber-200 hover:bg-amber-500/10 transition-colors cursor-pointer"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
                <Download className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-amber-200 mb-2">
                Uygulamayı iPhone'a Yükleyin
              </h3>

              <p className="text-xs text-amber-300/80 leading-relaxed mb-5">
                Chronos'u tarayıcı çubuğu olmadan tam ekran bir uygulama olarak kullanmak için:
              </p>

              <div className="w-full space-y-3 text-left text-xs bg-black/50 p-4 rounded-2xl border border-amber-500/20 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                  <span>Safari'nin alt menüsündeki <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-amber-300"><Share className="w-3 h-3 inline mr-1" />Paylaş</span> butonuna dokunun.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                  <span>Aşağı kaydırıp <strong className="text-amber-200">"Ana Ekrana Ekle"</strong> seçeneğini seçin.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSPrompt(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold text-xs transition-colors cursor-pointer"
              >
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
