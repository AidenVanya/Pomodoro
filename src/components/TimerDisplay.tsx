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

  // Endpoint glowing bead coordinates inside the -rotate-90 coordinate space
  const progressAngle = (1 - remainingRatio) * 2 * Math.PI;
  const dotX = center + radius * Math.cos(progressAngle);
  const dotY = center + radius * Math.sin(progressAngle);

  // Mode-based color configurations
  const modeStyles = {
    FOCUS: {
      gradientId: 'gradient-focus',
      auraBg: 'bg-gradient-to-tr from-rose-500/40 via-pink-500/25 to-amber-500/20',
      track: 'stroke-rose-950/5 dark:stroke-white/5',
      glow: 'shadow-rose-500/15 dark:shadow-rose-500/20',
      bgBadge: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-300/40 dark:border-rose-500/20',
      label: 'Odaklanma Zamanı',
      activeLabel: 'Derin Odak',
    },
    SHORT_BREAK: {
      gradientId: 'gradient-short-break',
      auraBg: 'bg-gradient-to-tr from-emerald-500/40 via-teal-500/25 to-cyan-500/20',
      track: 'stroke-emerald-950/5 dark:stroke-white/5',
      glow: 'shadow-emerald-500/15 dark:shadow-emerald-500/20',
      bgBadge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-300/40 dark:border-emerald-500/20',
      label: 'Kısa Mola',
      activeLabel: 'Nefes Al ve Dinlen',
    },
    LONG_BREAK: {
      gradientId: 'gradient-long-break',
      auraBg: 'bg-gradient-to-tr from-sky-500/40 via-blue-500/25 to-indigo-500/20',
      track: 'stroke-sky-950/5 dark:stroke-white/5',
      glow: 'shadow-sky-500/15 dark:shadow-sky-500/20',
      bgBadge: 'bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-300/40 dark:border-sky-500/20',
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
      {/* Dynamic Ambient Breathing Aura Behind Timer */}
      <div
        className={`absolute -inset-4 sm:-inset-10 rounded-full blur-2xl sm:blur-3xl transition-all duration-700 pointer-events-none ${
          status === 'RUNNING'
            ? 'animate-pulse-glow opacity-70 dark:opacity-60 scale-105'
            : 'opacity-25 dark:opacity-20 scale-95'
        } ${modeStyles.auraBg}`}
        aria-hidden="true"
      />

      {/* Outer subtle glow wrapper with dynamic viewport constraints */}
      <div
        className={`relative flex items-center justify-center rounded-full p-2 sm:p-4 md:p-5 transition-all duration-500 shadow-xl sm:shadow-2xl w-[min(74vw,34dvh)] h-[min(74vw,34dvh)] sm:w-[330px] sm:h-[330px] md:w-[360px] md:h-[360px] max-w-[380px] max-h-[380px] min-w-[220px] min-h-[220px] aspect-square bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/60 dark:border-white/10 ${modeStyles.glow}`}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full transform -rotate-90"
          aria-hidden="true"
        >
          {/* Gradient definitions and glow filter */}
          <defs>
            <linearGradient id="gradient-focus" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="60%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>

            <linearGradient id="gradient-short-break" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            <linearGradient id="gradient-long-break" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="60%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            <filter id="timerGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            strokeWidth={strokeWidth}
            className={`${modeStyles.track} transition-colors duration-500`}
          />

          {/* Animated Progress Ring with Vibrant Gradient */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke={`url(#${modeStyles.gradientId})`}
            filter={status === 'RUNNING' ? 'url(#timerGlow)' : undefined}
            className="timer-ring"
          />

          {/* Glowing Head Bead */}
          {remainingRatio > 0.008 && remainingRatio < 0.995 && (
            <circle
              cx={dotX}
              cy={dotY}
              r={strokeWidth / 2 - 0.5}
              className="fill-white transition-all duration-150 drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
            />
          )}
        </svg>

        {/* Central Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 sm:p-6">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide uppercase border mb-1 sm:mb-2 backdrop-blur-md shadow-xs transition-all duration-300 ${modeStyles.bgBadge}`}
          >
            {getStatusText()}
          </span>

          {/* Large Countdown Display */}
          <span
            className="text-[2.75rem] leading-none sm:text-6xl md:text-7xl font-mono font-light tracking-tighter text-zinc-900 dark:text-zinc-50 tabular-nums transition-colors drop-shadow-sm my-0.5"
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
                className="flex items-center justify-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-200 bg-white/80 dark:bg-zinc-800/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-200/80 dark:border-white/10 shadow-xs hover:scale-102 hover:border-zinc-300 dark:hover:border-zinc-500 transition-all cursor-pointer truncate max-w-full"
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
