import React from 'react';
import { Settings, BarChart2, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenTasks: () => void;
  uncompletedTasksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onOpenSettings,
  onOpenStats,
  onOpenTasks,
  uncompletedTasksCount,
}) => {
  return (
    <header className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto flex items-center justify-between pt-[max(0.6rem,env(safe-area-inset-top))] pb-1 sm:pb-3 md:pb-4 px-3 sm:px-6 md:px-8 shrink-0 select-none">
      {/* Left Action: Görevler */}
      <button
        type="button"
        onClick={onOpenTasks}
        title="Görevler"
        aria-label="Görevler Listesi"
        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer text-xs font-medium shadow-xs"
      >
        <span>Görevler</span>
        {uncompletedTasksCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-xs">
            {uncompletedTasksCount}
          </span>
        )}
      </button>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Open Stats Modal Button */}
        <button
          type="button"
          onClick={onOpenStats}
          title="İstatistikler"
          aria-label="İstatistikler"
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer text-xs font-medium shadow-xs"
        >
          <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 dark:text-zinc-400" />
          <span className="hidden sm:inline">İstatistik</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={isDark ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
          aria-label={isDark ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
          className="p-1.5 sm:p-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
          ) : (
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
          )}
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          title="Ayarlar"
          aria-label="Uygulama Ayarları"
          className="p-1.5 sm:p-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </header>
  );
};
