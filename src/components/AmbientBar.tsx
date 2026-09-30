import React, { useRef, useState, useEffect } from 'react';
import type { AmbientSoundType } from '../types/pomodoro';
import { CloudRain, Waves, Coffee, VolumeX, Volume2 } from 'lucide-react';

interface AmbientBarProps {
  currentSound: AmbientSoundType;
  volume: number;
  onSelectSound: (sound: AmbientSoundType) => void;
  onVolumeChange: (volume: number) => void;
}

export const AmbientBar: React.FC<AmbientBarProps> = ({
  currentSound,
  volume,
  onSelectSound,
  onVolumeChange,
}) => {
  const options: { id: AmbientSoundType; label: string; icon: React.ReactNode }[] = [
    { id: 'none', label: 'Kapalı', icon: <VolumeX className="w-3.5 h-3.5" /> },
    { id: 'rain', label: 'Yağmur', icon: <CloudRain className="w-3.5 h-3.5" /> },
    { id: 'white-noise', label: 'Akarsu / Doğa', icon: <Waves className="w-3.5 h-3.5" /> },
    { id: 'cafe', label: 'Kafe Ortamı', icon: <Coffee className="w-3.5 h-3.5" /> },
  ];

  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const updateIndicator = () => {
    const activeBtn = buttonRefs.current[currentSound];
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
  }, [currentSound]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [currentSound]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 p-1 sm:p-1.5 px-2.5 sm:px-4 rounded-2xl bg-zinc-100/90 dark:bg-zinc-800/60 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-700/50 shadow-xs sm:shadow-sm max-w-fit mx-auto mt-2 sm:mt-5 shrink-0 select-none">
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium pl-1 mr-0.5">
        <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">Ortam Sesi:</span>
      </div>

      {/* Segmented slider track */}
      <div className="relative flex items-center p-0.5 rounded-xl bg-zinc-200/60 dark:bg-zinc-900/60">
        {/* Animated Sliding Pill (Beyaz kayan zemin) */}
        <div
          className="absolute top-0.5 bottom-0.5 rounded-lg bg-white dark:bg-zinc-700 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity,
          }}
        />

        {options.map((opt) => {
          const isActive = currentSound === opt.id;
          return (
            <button
              key={opt.id}
              ref={(el) => {
                buttonRefs.current[opt.id] = el;
              }}
              type="button"
              onClick={() => onSelectSound(opt.id)}
              className={`relative z-10 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors duration-200 cursor-pointer ${
                isActive
                  ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="shrink-0">{opt.icon}</span>
              <span className="hidden sm:inline">{opt.label}</span>
              {isActive && opt.id !== 'none' && (
                <span className="flex items-center gap-0.5 ml-0.5 sm:ml-1" aria-hidden="true">
                  <span className="w-0.5 h-2 bg-rose-500 dark:bg-rose-400 rounded-full animate-pulse" />
                  <span className="w-0.5 h-3 bg-rose-500 dark:bg-rose-400 rounded-full animate-pulse delay-75" />
                  <span className="w-0.5 h-1.5 bg-rose-500 dark:bg-rose-400 rounded-full animate-pulse delay-150" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {currentSound !== 'none' && (
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-200">
          <input
            type="range"
            min="5"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
            aria-label="Arka Plan Ses Düzeyi"
            className="w-12 sm:w-20 h-1 sm:h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-200"
          />
          <span className="text-[10px] sm:text-xs font-mono text-zinc-500 dark:text-zinc-400">%{volume}</span>
        </div>
      )}
    </div>
  );
};
