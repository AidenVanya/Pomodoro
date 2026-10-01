import React, { useRef, useState, useEffect } from 'react';
import type { TimerMode } from '../types/pomodoro';
import { Sparkles, Coffee, Armchair } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onSelectMode: (mode: TimerMode) => void;
  round: number;
  maxRounds: number;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  round,
  maxRounds,
}) => {
  const modes: { id: TimerMode; label: string; icon: React.ReactNode }[] = [
    {
      id: 'FOCUS',
      label: 'Odaklan',
      icon: <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
    },
    {
      id: 'SHORT_BREAK',
      label: 'Kısa Mola',
      icon: <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
    },
    {
      id: 'LONG_BREAK',
      label: 'Uzun Mola',
      icon: <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
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
    FOCUS: 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-md shadow-rose-500/30 text-white',
    SHORT_BREAK: 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/30 text-white',
    LONG_BREAK: 'bg-gradient-to-r from-sky-500 to-indigo-600 shadow-md shadow-sky-500/30 text-white',
  }[currentMode];

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-2.5 shrink-0 select-none">
      {/* Segmented Mode Track with Sliding Pill */}
      <div
        role="tablist"
        aria-label="Pomodoro Zamanlayıcı Modları"
        className="relative inline-flex p-1 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 shadow-xs sm:shadow-sm"
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

        {modes.map((mode) => {
          const isActive = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              ref={(el) => {
                buttonRefs.current[mode.id] = el;
              }}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectMode(mode.id)}
              className={`relative z-10 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-xl transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-900 cursor-pointer ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <span className="shrink-0">{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Rounds indicator */}
      <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <span className="text-[11px] sm:text-xs">Döngü {round} / {maxRounds}</span>
        <div className="flex items-center gap-1.5 ml-0.5" aria-label={`Döngü ${round} / ${maxRounds}`}>
          {Array.from({ length: maxRounds }).map((_, index) => {
            const isCompleted = index + 1 < round;
            const isCurrent = index + 1 === round;

            let dotColor = 'bg-zinc-300 dark:bg-zinc-700/80';
            if (isCompleted || isCurrent) {
              if (currentMode === 'FOCUS') dotColor = 'bg-rose-500 shadow-xs shadow-rose-500/50';
              else if (currentMode === 'SHORT_BREAK') dotColor = 'bg-emerald-500 shadow-xs shadow-emerald-500/50';
              else dotColor = 'bg-sky-500 shadow-xs shadow-sky-500/50';
            }

            return (
              <span
                key={index}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${dotColor} ${
                  isCurrent ? 'ring-2 ring-offset-1 ring-zinc-400 dark:ring-zinc-500 dark:ring-offset-zinc-900 scale-125' : ''
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
