import React from 'react';
import type { TimerMode, TimerStatus } from '../types/pomodoro';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface TimerControlsProps {
  status: TimerStatus;
  mode: TimerMode;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  status,
  mode,
  onToggle,
  onReset,
  onSkip,
}) => {
  const isRunning = status === 'RUNNING';

  const modeButtonColor = {
    FOCUS: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30',
    SHORT_BREAK: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30',
    LONG_BREAK: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/30',
  }[mode];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-6 mt-1 sm:mt-3 md:mt-4 shrink-0">
      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        title="Sıfırla (Kısayol: R)"
        aria-label="Zamanlayıcıyı Sıfırla"
        className="group relative flex items-center justify-center p-2.5 sm:p-3.5 md:p-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-600 dark:text-zinc-300 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-900 cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
      >
        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 transition-transform group-hover:-rotate-45" />
        <span className="sr-only">Sıfırla</span>
      </button>

      {/* Primary Start / Pause Button */}
      <button
        type="button"
        onClick={onToggle}
        title={isRunning ? 'Duraklat (Kısayol: Boşluk)' : 'Başlat (Kısayol: Boşluk)'}
        aria-label={isRunning ? 'Zamanlayıcıyı Duraklat' : 'Zamanlayıcıyı Başlat'}
        className={`flex items-center justify-center gap-2 sm:gap-2.5 px-6 py-2.5 sm:px-9 sm:py-3.5 md:px-11 md:py-4 rounded-2xl font-medium text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-900 ${modeButtonColor}`}
      >
        {isRunning ? (
          <>
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span>Duraklat</span>
            <span className="hidden md:inline-block ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/20 text-white/90">
              Space
            </span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
            <span>{status === 'PAUSED' ? 'Devam Et' : 'Başlat'}</span>
            <span className="hidden md:inline-block ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/20 text-white/90">
              Space
            </span>
          </>
        )}
      </button>

      {/* Skip Button */}
      <button
        type="button"
        onClick={onSkip}
        title="Seansı Atla (Kısayol: S)"
        aria-label="Sonraki Seansa Geç"
        className="group relative flex items-center justify-center p-2.5 sm:p-3.5 md:p-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-600 dark:text-zinc-300 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-900 cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
      >
        <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 transition-transform group-hover:translate-x-0.5" />
        <span className="sr-only">Atla</span>
      </button>
    </div>
  );
};
