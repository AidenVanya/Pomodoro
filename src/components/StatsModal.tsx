import React from 'react';
import type { PomodoroStats } from '../types/pomodoro';
import { formatDurationHuman, getTodayKey } from '../utils/formatters';
import { X, Flame, Clock, CheckCircle, Trophy, BarChart2 } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PomodoroStats;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null;

  const todayKey = getTodayKey();
  const todayData = stats.dailyHistory[todayKey] || { sessions: 0, minutes: 0 };

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const key = `${year}-${month}-${day}`;
    const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
    const sessionCount = stats.dailyHistory[key]?.sessions || 0;
    return { key, dayName, sessionCount, isToday: key === todayKey };
  });

  const maxSessionsInChart = Math.max(1, ...last7Days.map((d) => d.sessionCount));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85dvh] m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-rose-500" />
            <h2 id="stats-modal-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Odaklanma İstatistikleri
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex flex-col">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>Toplam Süre</span>
              </div>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-auto">
                {formatDurationHuman(stats.totalFocusMinutes)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex flex-col">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Seanslar</span>
              </div>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-auto">
                {stats.totalSessions} <span className="text-xs font-normal text-zinc-500">adet</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex flex-col">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Seri</span>
              </div>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-auto">
                {stats.streakDays} <span className="text-xs font-normal text-zinc-500">gün</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex flex-col">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Bugün</span>
              </div>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-auto">
                {todayData.sessions} <span className="text-xs font-normal text-zinc-500">seans</span>
              </span>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Son 7 Günlük Aktivite
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Bugün: {todayData.minutes} dk
              </span>
            </div>

            <div className="flex items-end justify-between gap-2 h-28 pt-2">
              {last7Days.map((day) => {
                const heightPercent = Math.max(8, Math.round((day.sessionCount / maxSessionsInChart) * 100));

                return (
                  <div key={day.key} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {day.sessionCount > 0 ? day.sessionCount : ''}
                    </span>
                    <div
                      className="w-full max-w-[32px] rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: day.isToday
                          ? '#f43f5e'
                          : day.sessionCount > 0
                          ? '#fb7185'
                          : 'rgba(156, 163, 175, 0.2)',
                      }}
                      title={`${day.key}: ${day.sessionCount} seans`}
                    />
                    <span
                      className={`text-[11px] ${
                        day.isToday
                          ? 'font-bold text-rose-500'
                          : 'text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {day.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
