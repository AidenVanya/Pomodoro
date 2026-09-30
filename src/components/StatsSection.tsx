import React from 'react';
import type { PomodoroStats } from '../types/pomodoro';
import { formatDurationHuman, getTodayKey } from '../utils/formatters';
import { Flame, Clock, CheckCircle, Trophy, BarChart2 } from 'lucide-react';

interface StatsSectionProps {
  stats: PomodoroStats;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const todayKey = getTodayKey();
  const todayData = stats.dailyHistory[todayKey] || { sessions: 0, minutes: 0 };

  // Generate last 7 days keys for mini activity chart
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
    <section className="w-full max-w-xl mx-auto mt-6 p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-rose-500" />
          <span>Odaklanma İstatistikleri</span>
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Bugün: {todayData.sessions} seans ({todayData.minutes} dk)
        </span>
      </div>

      {/* Grid of Key Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {/* Total Focus Time */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex flex-col">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            <span>Toplam Süre</span>
          </div>
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-auto">
            {formatDurationHuman(stats.totalFocusMinutes)}
          </span>
        </div>

        {/* Total Sessions */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex flex-col">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Seanslar</span>
          </div>
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-auto">
            {stats.totalSessions} <span className="text-xs font-normal text-zinc-500">adet</span>
          </span>
        </div>

        {/* Daily Streak */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex flex-col">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Seri</span>
          </div>
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-auto">
            {stats.streakDays} <span className="text-xs font-normal text-zinc-500">gün</span>
          </span>
        </div>

        {/* Completed Tasks */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex flex-col">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Bugün Seans</span>
          </div>
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-auto">
            {todayData.sessions} <span className="text-xs font-normal text-zinc-500">seans</span>
          </span>
        </div>
      </div>

      {/* Mini 7-Day Activity Bar Chart */}
      <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-3">
          Son 7 Günlük Aktivite
        </span>
        <div className="flex items-end justify-between gap-2 h-24 pt-2">
          {last7Days.map((day) => {
            const heightPercent = Math.max(8, Math.round((day.sessionCount / maxSessionsInChart) * 100));

            return (
              <div key={day.key} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] text-zinc-400 font-mono">
                  {day.sessionCount > 0 ? day.sessionCount : ''}
                </span>
                <div
                  className="w-full max-w-[28px] rounded-t-md transition-all duration-500"
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
    </section>
  );
};
