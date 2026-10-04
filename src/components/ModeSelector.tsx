import React, { useRef, useState, useEffect } from 'react';
import type { TimerMode, TimerStatus } from '../types/pomodoro';
import { Sparkles, Shield, Moon } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: TimerMode;
  status?: TimerStatus;
  onSelectMode: (mode: TimerMode) => void;
  round: number;
  maxRounds: number;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  status = 'IDLE',
  onSelectMode,
  round,
  maxRounds,
}) => {
  const modes: { id: TimerMode; label: string; subLabel: string; icon: React.ReactNode }[] = [
    {
      id: 'FOCUS',
      label: 'Çalışma',
      subLabel: 'Çalışma',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'SHORT_BREAK',
      label: 'Kısa Mola',
      subLabel: 'Mola',
      icon: <Shield className="w-3.5 h-3.5" />,
    },
    {
      id: 'LONG_BREAK',
      label: 'Uzun Mola',
      subLabel: 'Uzun Mola',
      icon: <Moon className="w-3.5 h-3.5" />,
    },
  ];

  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const updateIndicator = () => {
    const activeBtn = buttonRefs.current[currentMode];
    if (activeBtn && activeBtn.offsetWidth > 0) {
      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        opacity: 1,
      });
    }
  };

  useEffect(() => {
    updateIndicator();
    const frameId = requestAnimationFrame(updateIndicator);
    return () => cancelAnimationFrame(frameId);
  }, [currentMode]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [currentMode]);

  const activeModeBg = {
    FOCUS: 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 shadow-md shadow-amber-500/30 text-white',
    SHORT_BREAK: 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/30 text-white',
    LONG_BREAK: 'bg-gradient-to-r from-sky-600 to-indigo-600 shadow-md shadow-sky-500/30 text-white',
  }[currentMode];

  const modeBadgeStyles = {
    FOCUS: {
      badgeBorder: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/15 text-amber-300',
      label: 'Çalışma',
      activeLabel: 'Çalışma Zamanı',
      pausedLabel: 'Zaman Duraklatıldı',
    },
    SHORT_BREAK: {
      badgeBorder: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/15 text-emerald-300',
      label: 'Kısa Mola',
      activeLabel: 'Mola Zamanı',
      pausedLabel: 'Zaman Duraklatıldı',
    },
    LONG_BREAK: {
      badgeBorder: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/15 text-sky-300',
      label: 'Uzun Mola',
      activeLabel: 'Uzun Mola Zamanı',
      pausedLabel: 'Zaman Duraklatıldı',
    },
  }[currentMode];

  const getStatusText = () => {
    if (status === 'RUNNING') return modeBadgeStyles.activeLabel;
    if (status === 'PAUSED') return modeBadgeStyles.pausedLabel;
    return modeBadgeStyles.label;
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-2.5 shrink-0 select-none">
      {/* Segmented Mode Track with Sliding Pill */}
      <div
        role="tablist"
        aria-label="Pomodoro Zamanlayıcı Modları"
        className="relative inline-flex p-1 rounded-2xl bg-black/40 backdrop-blur-xl border border-amber-500/30 shadow-xs sm:shadow-sm"
      >
        {/* Animated Sliding Pill */}
        <div
          className={`absolute top-1 bottom-1 rounded-xl shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none ${activeModeBg}`}
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity,
          }}
        />

        {modes.map((m) => {
          const isActive = currentMode === m.id;

          return (
            <button
              key={m.id}
              ref={(el) => {
                buttonRefs.current[m.id] = el;
              }}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectMode(m.id)}
              className={`relative z-10 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-chronos font-medium rounded-xl transition-colors duration-200 focus:outline-none cursor-pointer ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-amber-200/70 hover:text-amber-100'
              }`}
            >
              <span className="shrink-0">{m.icon}</span>
              <span className="hidden sm:inline">{m.label}</span>
              <span className="sm:hidden">{m.subLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Rounds indicator with solid bars (no hollow/empty hoops) */}
      <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-chronos font-medium text-amber-300/80">
        <span className="text-[11px] sm:text-xs tracking-wider">DÖNGÜ {round} / {maxRounds}</span>
        <div className="flex items-center gap-1.5 ml-0.5" aria-label={`Döngü ${round} / ${maxRounds}`}>
          {Array.from({ length: maxRounds }).map((_, index) => {
            const isCompleted = index + 1 < round;
            const isCurrent = index + 1 === round;

            return (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'w-4 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    : isCompleted
                    ? 'w-2.5 bg-amber-500/70'
                    : 'w-2 bg-amber-500/20'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile-only Mode Status Pill (Under DÖNGÜ indicator - Hidden on desktop) */}
      <div className="flex sm:hidden items-center justify-center mt-0.5">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-chronos font-bold tracking-widest uppercase border backdrop-blur-md shadow-xs transition-all duration-300 ${modeBadgeStyles.badgeBorder} ${modeBadgeStyles.badgeBg}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse opacity-90" />
          <span>{getStatusText()}</span>
        </div>
      </div>
    </div>
  );
};
