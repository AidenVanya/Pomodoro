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
      {/* Brand */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
          <span className="text-sm sm:text-base select-none">🍅</span>
        </div>
        <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 m-0">
          Pomodoro <span className="font-light text-zinc-400 dark:text-zinc-500 text-[10px] sm:text-xs">Zen</span>
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Open Tasks Modal Button */}
        <button
          type="button"
          onClick={onOpenTasks}
          title="Görevler"
          aria-label="Görevler Listesi"
          className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-xs font-medium"
        >
          <span>Görevler</span>
          {uncompletedTasksCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {uncompletedTasksCount}
            </span>
          )}
        </button>

        {/* Open Stats Modal Button */}
        <button
          type="button"
          onClick={onOpenStats}
          title="İstatistikler"
          aria-label="İstatistikler"
          className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-xs font-medium"
        >
          <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
          <span className="hidden sm:inline">İstatistik</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={isDark ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
          aria-label={isDark ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
          className="p-1.5 sm:p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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
          className="p-1.5 sm:p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </header>
  );
};
