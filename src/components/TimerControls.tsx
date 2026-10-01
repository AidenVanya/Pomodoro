import React from 'react';
import type { TimerMode, TimerStatus } from '../types/pomodoro';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

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
      'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50',
    SHORT_BREAK:
      'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-stone-950 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50',
    LONG_BREAK:
      'bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50',
  }[mode];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-6 mt-1 sm:mt-3 md:mt-4 shrink-0">
      {/* Rewind Time (Reset) Button */}
      <button
        type="button"
        onClick={onReset}
        title="Zamanı Geri Al / Sıfırla (Kısayol: R)"
        aria-label="Zamanlayıcıyı Sıfırla"
        className="group relative flex items-center justify-center p-2.5 sm:p-3.5 md:p-4 rounded-2xl bg-black/50 hover:bg-black/80 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 hover:text-amber-100 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-xs backdrop-blur-md"
      >
        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-rotate-90 duration-300" />
        <span className="sr-only">Zamanı Sıfırla</span>
      </button>

      {/* Primary Toggle (Freeze / Unleash Time) Button */}
      <button
        type="button"
        onClick={onToggle}
        title={isRunning ? 'Zamanı Dondur (Kısayol: Boşluk)' : 'Zamanı Başlat (Kısayol: Boşluk)'}
        aria-label={isRunning ? 'Zamanı Dondur' : 'Zamanı Başlat'}
        className={`relative flex items-center justify-center gap-2 sm:gap-2.5 px-6 py-2.5 sm:px-9 sm:py-3.5 md:px-11 md:py-4 rounded-2xl font-chronos font-bold text-sm sm:text-base md:text-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 border-t border-white/40 select-none tracking-wide ${modeButtonColor}`}
      >
        {isRunning ? (
          <>
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span>Zamanı Dondur</span>
            <span className="hidden md:inline-block ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/20 text-black/90">
              Space
            </span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
            <span>{status === 'PAUSED' ? 'Zamanı Çöz' : 'Zamanı Başlat'}</span>
            <span className="hidden md:inline-block ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/20 text-black/90">
              Space
            </span>
          </>
        )}
      </button>

      {/* Fast Forward (Skip) Button */}
      <button
        type="button"
        onClick={onSkip}
        title="Zamanı İleri Sar / Seansı Atla (Kısayol: S)"
        aria-label="Sonraki Seansa Geç"
        className="group relative flex items-center justify-center p-2.5 sm:p-3.5 md:p-4 rounded-2xl bg-black/50 hover:bg-black/80 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 hover:text-amber-100 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-xs backdrop-blur-md"
      >
        <FastForward className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 duration-200" />
        <span className="sr-only">Seansı Atla</span>
      </button>
    </div>
  );
};
