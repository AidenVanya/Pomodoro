import React from 'react';
import type { Task, TimerMode, TimerStatus } from '../types/pomodoro';
import { formatTime } from '../utils/formatters';
import { Target, CheckCircle2 } from 'lucide-react';

interface TimerDisplayProps {
  remainingSeconds: number;
  totalDurationSeconds: number;
  mode: TimerMode;
  status: TimerStatus;
  activeTask: Task | null;
  onOpenTasks?: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  remainingSeconds,
  totalDurationSeconds,
  mode,
  status,
  activeTask,
  onOpenTasks,
}) => {
  // SVG Geometry constants
  const size = 320;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth - 6;
  const circumference = 2 * Math.PI * radius;

  // Fraction of remaining time (1 -> full ring, 0 -> empty ring)
  const remainingRatio =
    totalDurationSeconds > 0
      ? Math.max(0, Math.min(1, remainingSeconds / totalDurationSeconds))
      : 0;

  // Stroke offset so the ring shrinks as time elapses
  const strokeDashoffset = circumference * (1 - remainingRatio);

  // Mode-based color configurations
  const modeStyles = {
    FOCUS: {
      stroke: 'stroke-rose-500',
      track: 'stroke-rose-100 dark:stroke-rose-950/40',
      glow: 'shadow-rose-500/10 dark:shadow-rose-500/20',
      textAccent: 'text-rose-500 dark:text-rose-400',
      bgBadge: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-900',
      label: 'Odaklanma Zamanı',
      activeLabel: 'Derin Odak',
    },
    SHORT_BREAK: {
      stroke: 'stroke-emerald-500',
      track: 'stroke-emerald-100 dark:stroke-emerald-950/40',
      glow: 'shadow-emerald-500/10 dark:shadow-emerald-500/20',
      textAccent: 'text-emerald-500 dark:text-emerald-400',
      bgBadge: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
      label: 'Kısa Mola',
      activeLabel: 'Nefes Al ve Dinlen',
    },
    LONG_BREAK: {
      stroke: 'stroke-sky-500',
      track: 'stroke-sky-100 dark:stroke-sky-950/40',
      glow: 'shadow-sky-500/10 dark:shadow-sky-500/20',
      textAccent: 'text-sky-500 dark:text-sky-400',
      bgBadge: 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-300 border-sky-200 dark:border-sky-900',
      label: 'Uzun Mola',
      activeLabel: 'Yenilenme Zamanı',
    },
  }[mode];

  const getStatusText = () => {
    if (status === 'RUNNING') return modeStyles.activeLabel;
    if (status === 'PAUSED') return 'Duraklatıldı';
    return modeStyles.label;
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-1 sm:my-3 md:my-4 select-none shrink-0">
      {/* Outer subtle glow wrapper with dynamic viewport constraints on mobile and expansive scaling on desktop */}
      <div
        className={`relative flex items-center justify-center rounded-full p-2 sm:p-4 md:p-5 transition-all duration-500 shadow-xl sm:shadow-2xl w-[min(72vw,33dvh)] h-[min(72vw,33dvh)] sm:w-[330px] sm:h-[330px] md:w-[360px] md:h-[360px] max-w-[380px] max-h-[380px] min-w-[220px] min-h-[220px] aspect-square ${modeStyles.glow}`}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full transform -rotate-90"
          aria-hidden="true"
        >
          {/* Background Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            strokeWidth={strokeWidth}
            className={`${modeStyles.track} transition-colors duration-500`}
          />

          {/* Animated Progress Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${modeStyles.stroke} timer-ring`}
          />
        </svg>

        {/* Central Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 sm:p-6">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium tracking-wide uppercase border mb-1 sm:mb-2 transition-all duration-300 ${modeStyles.bgBadge}`}
          >
            {getStatusText()}
          </span>

          {/* Large Countdown Display */}
          <span
            className="text-[2.75rem] leading-none sm:text-6xl md:text-7xl font-mono font-light tracking-tighter text-zinc-800 dark:text-zinc-50 tabular-nums transition-colors drop-shadow-sm my-0.5"
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTime(remainingSeconds)}
          </span>

          {/* Active Task Indicator inside circle */}
          <div className="mt-3 max-w-[220px] truncate">
            {activeTask ? (
              <button
                type="button"
                onClick={onOpenTasks}
                title={`Aktif Görev: ${activeTask.title} (Görevleri açmak için tıkla)`}
                className="flex items-center justify-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-200 bg-white/80 dark:bg-zinc-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs hover:scale-102 hover:border-zinc-300 dark:hover:border-zinc-500 transition-all cursor-pointer truncate max-w-full"
              >
                {activeTask.isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <Target className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                )}
                <span className="truncate">{activeTask.title}</span>
                <span className="text-[10px] opacity-70 shrink-0 font-mono">
                  ({activeTask.completedPomodoros}/{activeTask.estimatedPomodoros} 🍅)
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenTasks}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors underline underline-offset-4 decoration-dotted cursor-pointer"
              >
                + Odaklanılacak görev seç
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
