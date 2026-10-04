import React from 'react';
import type { Task, TimerMode, TimerStatus, TimerVisualMode } from '../types/pomodoro';
import { formatTime } from '../utils/formatters';
import { Target, CheckCircle2 } from 'lucide-react';
import { ClockworkGears } from './ClockworkGears';
import { ChronosHourglass } from './ChronosHourglass';

interface TimerDisplayProps {
  remainingSeconds: number;
  totalDurationSeconds: number;
  mode: TimerMode;
  status: TimerStatus;
  activeTask: Task | null;
  onOpenTasks?: () => void;
  initialVisualMode?: TimerVisualMode;
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
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth - 14;
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

  // Chronos / Hades II Mode Color Palette
  const modeStyles = {
    FOCUS: {
      gradientId: 'gradient-chronos-gold',
      auraBg: 'bg-gradient-to-tr from-amber-600/35 via-emerald-600/20 to-yellow-500/25',
      track: 'stroke-amber-950/20 dark:stroke-amber-400/10',
      glow: 'shadow-amber-500/20 dark:shadow-amber-500/25',
      badgeBorder: 'border-amber-500/40 dark:border-amber-400/30',
      badgeBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
      label: 'Çalışma',
      activeLabel: 'Çalışma Zamanı',
      pausedLabel: 'Zaman Duraklatıldı',
    },
    SHORT_BREAK: {
      gradientId: 'gradient-chronos-emerald',
      auraBg: 'bg-gradient-to-tr from-emerald-600/35 via-teal-600/20 to-green-500/25',
      track: 'stroke-emerald-950/20 dark:stroke-emerald-400/10',
      glow: 'shadow-emerald-500/20 dark:shadow-emerald-500/25',
      badgeBorder: 'border-emerald-500/40 dark:border-emerald-400/30',
      badgeBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
      label: 'Kısa Mola',
      activeLabel: 'Mola Zamanı',
      pausedLabel: 'Zaman Duraklatıldı',
    },
    LONG_BREAK: {
      gradientId: 'gradient-chronos-sky',
      auraBg: 'bg-gradient-to-tr from-sky-600/35 via-indigo-600/20 to-blue-500/25',
      track: 'stroke-sky-950/20 dark:stroke-sky-400/10',
      glow: 'shadow-sky-500/20 dark:shadow-sky-500/25',
      badgeBorder: 'border-sky-500/40 dark:border-sky-400/30',
      badgeBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
      label: 'Uzun Mola',
      activeLabel: 'Uzun Mola Zamanı',
      pausedLabel: 'Zaman Duraklatıldı',
    },
  }[mode];

  const getStatusText = () => {
    if (status === 'RUNNING') return modeStyles.activeLabel;
    if (status === 'PAUSED') return modeStyles.pausedLabel;
    return modeStyles.label;
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-1 sm:my-3 select-none shrink-0 w-full max-w-sm sm:max-w-md mx-auto">
      {/* Dynamic Ambient Breathing Aura Behind Timer */}
      <div
        className={`absolute -inset-4 sm:-inset-8 rounded-full blur-2xl sm:blur-3xl transition-all duration-700 pointer-events-none ${
          status === 'RUNNING'
            ? 'animate-pulse-glow opacity-80 scale-105'
            : 'opacity-30 scale-95'
        } ${modeStyles.auraBg}`}
        aria-hidden="true"
      />

      {/* Outer subtle glow wrapper with dynamic constraints & clean overflow containment */}
      <div
        className={`relative flex items-center justify-center rounded-full overflow-hidden p-2 sm:p-4 transition-all duration-500 shadow-2xl w-[min(82vw,36dvh)] h-[min(82vw,36dvh)] sm:w-[350px] sm:h-[350px] md:w-[380px] md:h-[380px] max-w-[400px] max-h-[400px] min-w-[240px] min-h-[240px] aspect-square bg-[#070b10]/80 backdrop-blur-2xl border-2 border-amber-500/30 ${modeStyles.glow}`}
      >
        {/* ======================================================== */}
        {/* ROTATING CLOCKWORK GEARS: The Grand Wheel of Chronos     */}
        {/* ======================================================== */}
        <ClockworkGears
          status={status}
          mode={mode}
          remainingRatio={remainingRatio}
          className="absolute inset-0 w-full h-full"
        />

        {/* ======================================================== */}
        {/* CIRCULAR TIMER PROGRESS RING SVG                         */}
        {/* ======================================================== */}
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full transform -rotate-90 relative z-10"
          aria-hidden="true"
        >
          <defs>
            {/* Titan Gold Metallic Gradient */}
            <linearGradient id="gradient-chronos-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            {/* Witchfire Emerald Gradient */}
            <linearGradient id="gradient-chronos-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Celestial Sky Gradient */}
            <linearGradient id="gradient-chronos-sky" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>

            <filter id="timerRingGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Circle with Titan Gold Inscription */}
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
            stroke={`url(#${modeStyles.gradientId})`}
            filter={status === 'RUNNING' ? 'url(#timerRingGlow)' : undefined}
            className="timer-ring"
          />

          {/* Glowing Head Bead */}
          {remainingRatio > 0.008 && remainingRatio < 0.995 && (
            <circle
              cx={dotX}
              cy={dotY}
              r={strokeWidth / 2 + 1}
              className="fill-amber-100 drop-shadow-[0_0_8px_rgba(254,240,138,0.9)]"
            />
          )}
        </svg>

        {/* ======================================================== */}
        {/* CENTRAL CONTENT: The Monolithic Relic of Chronos          */}
        {/* Singular, harmonious, and exquisitely proportioned       */}
        {/* ======================================================== */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none select-none">
          {/* Status Label Pill (Crown of the Relic) */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-chronos font-bold tracking-widest uppercase border backdrop-blur-md shadow-xs transition-all duration-300 ${modeStyles.badgeBorder} ${modeStyles.badgeBg} mb-1 sm:mb-1.5`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse opacity-90" />
            <span>{getStatusText()}</span>
          </div>

          {/* Unified Relic: Slender Hourglass + Integrated Pedestal Time */}
          <div className="flex flex-col items-center justify-center">
            {/* The Hourglass of Chronos */}
            <ChronosHourglass
              remainingRatio={remainingRatio}
              status={status}
              mode={mode}
              size={56}
              className="opacity-95 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] transition-transform duration-300"
            />

            {/* Sculpted Pedestal: Time Display & Sacred Inscription */}
            <div className="flex flex-col items-center justify-center -mt-0.5 sm:mt-0">
              <span
                className="text-2xl sm:text-3xl md:text-4xl font-chronos font-bold tracking-tight text-amber-50 drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)] tabular-nums leading-none"
                aria-live="polite"
                aria-atomic="true"
              >
                {formatTime(remainingSeconds)}
              </span>

              {/* Delicate Titan Emblem Divider */}
              <div className="flex items-center gap-1.5 opacity-60 mt-1">
                <span className="w-4 sm:w-6 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
                <span className="text-[7.5px] sm:text-[8.5px] font-chronos tracking-[0.25em] text-amber-300 uppercase select-none">
                  ✦ CHRONOS ✦
                </span>
                <span className="w-4 sm:w-6 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ACTIVE TASK DOCKED CARD: Cleanly Positioned Below Dial   */}
      {/* ======================================================== */}
      <div className="mt-2.5 sm:mt-3.5 w-full max-w-[280px] sm:max-w-xs flex items-center justify-center">
        {activeTask ? (
          <button
            type="button"
            onClick={onOpenTasks}
            title={`Aktif Görev: ${activeTask.title} (Görevleri düzenlemek için tıkla)`}
            className="w-full flex items-center justify-between gap-2 text-xs text-amber-200 bg-black/60 hover:bg-black/80 backdrop-blur-xl px-3.5 py-1.5 sm:py-2 rounded-2xl border border-amber-500/30 hover:border-amber-400/60 shadow-md transition-all cursor-pointer font-chronos group"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {activeTask.isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Target className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              )}
              <span className="truncate font-medium text-amber-100">{activeTask.title}</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-amber-300 shrink-0 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/20">
              {activeTask.completedPomodoros}/{activeTask.estimatedPomodoros} ⏳
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenTasks}
            className="flex items-center gap-1.5 text-[11px] sm:text-xs font-chronos text-amber-300/70 hover:text-amber-200 px-3.5 py-1 rounded-full bg-black/40 hover:bg-black/60 border border-amber-500/20 hover:border-amber-400/40 transition-all cursor-pointer"
          >
            <span>+ Odaklanılacak görevi belirle</span>
          </button>
        )}
      </div>
    </div>
  );
};
