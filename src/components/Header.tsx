import React from 'react';
import { Settings, BarChart2, Sun, Moon, Hourglass } from 'lucide-react';

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
    <header className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto flex items-center justify-between pt-[max(0.6rem,env(safe-area-inset-top))] pb-1 sm:pb-3 px-3 sm:px-6 md:px-8 shrink-0 select-none relative z-20">
      {/* Left: Tasks Button */}
      <button
        type="button"
        onClick={onOpenTasks}
        title="Görevler Listesi"
        aria-label="Görevler Listesi"
        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400/60 text-amber-200 hover:text-amber-100 transition-all cursor-pointer text-xs font-chronos font-semibold shadow-xs"
      >
        <Hourglass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Görevler</span>
        {uncompletedTasksCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black text-[10px] font-bold shadow-xs">
            {uncompletedTasksCount}
          </span>
        )}
      </button>

      {/* Center: Mythical Chronos Title Branding */}
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-chronos-deco font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-emerald-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
          CHRONOS
        </h1>
        <span className="text-[9px] sm:text-[10px] font-chronos tracking-[0.25em] text-amber-400/80 uppercase">
          Titan of Time
        </span>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Open Stats Modal Button */}
        <button
          type="button"
          onClick={onOpenStats}
          title="Odaklanma İstatistikleri"
          aria-label="İstatistikler"
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400/60 text-amber-200 hover:text-amber-100 transition-all cursor-pointer text-xs font-chronos font-medium shadow-xs"
        >
          <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">İstatistik</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={isDark ? 'Aydınlık Moda Geç' : 'Chronos Karanlık Moda Geç'}
          aria-label={isDark ? 'Aydınlık Moda Geç' : 'Chronos Karanlık Moda Geç'}
          className="p-1.5 sm:p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400/60 text-amber-300 hover:text-amber-100 transition-all cursor-pointer shadow-xs"
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
          )}
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          title="Uygulama Ayarları"
          aria-label="Uygulama Ayarları"
          className="p-1.5 sm:p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400/60 text-amber-300 hover:text-amber-100 transition-all cursor-pointer shadow-xs"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </header>
  );
};
