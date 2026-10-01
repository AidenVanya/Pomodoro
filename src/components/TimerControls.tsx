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
    FOCUS:
      'bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 hover:from-rose-600 hover:via-rose-700 hover:to-pink-700 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35',
    SHORT_BREAK:
      'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35',
    LONG_BREAK:
      'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35',
  }[mode];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-6 mt-1 sm:mt-3 md:mt-4 shrink-0">
      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        title="Sıfırla (Kısayol: R)"
        aria-label="Zamanlayıcıyı Sıfırla"
        className="group relative flex items-center justify-center p-2.5 sm:p-3.5 md:p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700/80 border border-zinc-200/80 dark:border-white/10 text-zinc-600 dark:text-zinc-300 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-900 cursor-pointer hover:scale-105 active:scale-95 shadow-xs hover:shadow-sm backdrop-blur-md"
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
        className={`relative flex items-center justify-center gap-2 sm:gap-2.5 px-6 py-2.5 sm:px-9 sm:py-3.5 md:px-11 md:py-4 rounded-2xl font-medium text-sm sm:text-base md:text-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-900 border-t border-white/20 select-none ${modeButtonColor}`}
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
        className="group relative flex items-center justify-center p-2.5 sm:p-3.5 md:p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700/80 border border-zinc-200/80 dark:border-white/10 text-zinc-600 dark:text-zinc-300 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-900 cursor-pointer hover:scale-105 active:scale-95 shadow-xs hover:shadow-sm backdrop-blur-md"
      >
        <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 transition-transform group-hover:translate-x-0.5" />
        <span className="sr-only">Atla</span>
      </button>
    </div>
  );
};
