import React from 'react';
import type { PomodoroStats } from '../types/pomodoro';
import { formatDurationHuman, getTodayKey } from '../utils/formatters';
import { X, Flame, Clock, CheckCircle, Trophy, Hourglass } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0a0e14] text-amber-100 rounded-2xl sm:rounded-3xl border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[85dvh] m-auto font-chronos"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 sm:py-4 border-b border-amber-500/20 bg-black/40">
          <div className="flex items-center gap-2 min-w-0">
            <Hourglass className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <h2 id="stats-modal-title" className="text-base sm:text-lg font-bold text-amber-200 truncate">
              Zamanın Kayıtları (İstatistik)
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="p-1.5 rounded-xl text-amber-400/60 hover:text-amber-200 hover:bg-amber-500/10 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 flex flex-col">
              <div className="flex items-center gap-1.5 text-amber-400/70 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Toplam Süre</span>
              </div>
              <span className="text-base font-bold text-amber-100 mt-auto">
                {formatDurationHuman(stats.totalFocusMinutes)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 flex flex-col">
              <div className="flex items-center gap-1.5 text-amber-400/70 text-xs mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Seanslar</span>
              </div>
              <span className="text-base font-bold text-amber-100 mt-auto">
                {stats.totalSessions} <span className="text-xs font-normal text-amber-400/60">adet</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 flex flex-col">
              <div className="flex items-center gap-1.5 text-amber-400/70 text-xs mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Seri</span>
              </div>
              <span className="text-base font-bold text-amber-100 mt-auto">
                {stats.streakDays} <span className="text-xs font-normal text-amber-400/60">gün</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 flex flex-col">
              <div className="flex items-center gap-1.5 text-emerald-400/80 text-xs mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bugün</span>
              </div>
              <span className="text-base font-bold text-amber-100 mt-auto">
                {todayData.sessions} <span className="text-xs font-normal text-amber-400/60">seans</span>
              </span>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="pt-4 border-t border-amber-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-amber-400/80">
                Son 7 Günlük Zaman Akışı
              </span>
              <span className="text-xs text-amber-300/60 font-mono">
                Bugün: {todayData.minutes} dk
              </span>
            </div>

            <div className="flex items-end justify-between gap-2 h-28 pt-2">
              {last7Days.map((day) => {
                const heightPercent = Math.max(8, Math.round((day.sessionCount / maxSessionsInChart) * 100));

                return (
                  <div key={day.key} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] text-amber-300/70 font-mono">
                      {day.sessionCount > 0 ? day.sessionCount : ''}
                    </span>
                    <div
                      className="w-full max-w-[32px] rounded-t-lg transition-all duration-500 border-t border-x border-amber-400/40"
                      style={{
                        height: `${heightPercent}%`,
                        background: day.isToday
                          ? 'linear-gradient(to top, #d97706, #fbbf24)'
                          : day.sessionCount > 0
                          ? 'linear-gradient(to top, #78350f, #d97706)'
                          : 'rgba(217, 119, 6, 0.1)',
                      }}
                      title={`${day.key}: ${day.sessionCount} seans`}
                    />
                    <span
                      className={`text-[11px] ${
                        day.isToday
                          ? 'font-bold text-amber-300'
                          : 'text-amber-400/60'
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
        <div className="p-4 border-t border-amber-500/20 bg-black/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
