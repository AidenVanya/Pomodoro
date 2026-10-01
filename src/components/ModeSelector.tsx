import React, { useRef, useState, useEffect } from 'react';
import type { TimerMode } from '../types/pomodoro';
import { Sparkles, Shield, Moon } from 'lucide-react';

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
  const modes: { id: TimerMode; label: string; subLabel: string; icon: React.ReactNode }[] = [
    {
      id: 'FOCUS',
      label: 'Zaman Bükümü',
      subLabel: 'Odak',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'SHORT_BREAK',
      label: 'Ateşkes',
      subLabel: 'Kısa Mola',
      icon: <Shield className="w-3.5 h-3.5" />,
    },
    {
      id: 'LONG_BREAK',
      label: 'Titan Uykusu',
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

      {/* Rounds indicator */}
      <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-chronos font-medium text-amber-300/80">
        <span className="text-[11px] sm:text-xs tracking-wider">DÖNGÜ {round} / {maxRounds}</span>
        <div className="flex items-center gap-1.5 ml-0.5" aria-label={`Döngü ${round} / ${maxRounds}`}>
          {Array.from({ length: maxRounds }).map((_, index) => {
            const isCompleted = index + 1 < round;
            const isCurrent = index + 1 === round;

            let dotColor = 'bg-amber-950/60 border border-amber-500/30';
            if (isCompleted || isCurrent) {
              if (currentMode === 'FOCUS') dotColor = 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-xs shadow-amber-500/80 border-amber-300';
              else if (currentMode === 'SHORT_BREAK') dotColor = 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-xs shadow-emerald-500/80 border-emerald-300';
              else dotColor = 'bg-gradient-to-r from-sky-400 to-indigo-400 shadow-xs shadow-sky-500/80 border-sky-300';
            }

            return (
              <span
                key={index}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${dotColor} ${
                  isCurrent ? 'ring-2 ring-offset-1 ring-amber-400 ring-offset-black scale-125' : ''
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
