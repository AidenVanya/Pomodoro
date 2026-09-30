import React, { useState, useEffect } from 'react';
import type { PomodoroSettings, SoundTheme } from '../types/pomodoro';
import { playAlertSound } from '../utils/audio';
import { isNotificationSupported, requestNotificationPermission } from '../utils/notifications';
import { X, Volume2, Bell, Sliders, Clock, PlayCircle, Keyboard, Sun, Moon, Laptop, Palette } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  onUpdateSettings: (newSettings: Partial<PomodoroSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<PomodoroSettings>(settings);
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission | 'unsupported'>(
    () => {
      if (!isNotificationSupported()) return 'unsupported';
      return Notification.permission;
    }
  );

  // Sync when opened
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
      if (isNotificationSupported()) {
        setNotificationStatus(Notification.permission);
      }
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onClose();
  };

  const handleTestSound = () => {
    playAlertSound(localSettings.soundTheme, localSettings.soundVolume);
  };

  const handleRequestNotification = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setLocalSettings((prev) => ({ ...prev, notificationsEnabled: true }));
      setNotificationStatus('granted');
    } else {
      setLocalSettings((prev) => ({ ...prev, notificationsEnabled: false }));
      setNotificationStatus(Notification.permission);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[88dvh] m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-rose-500" />
            <h2 id="settings-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Ayarlar
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Durations section */}
          <div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-zinc-500" />
              <span>Süreler (Dakika)</span>
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Odaklanma
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={localSettings.focusDuration}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      focusDuration: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-mono text-center"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Kısa Mola
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.shortBreakDuration}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      shortBreakDuration: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-mono text-center"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Uzun Mola
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={localSettings.longBreakDuration}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      longBreakDuration: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-mono text-center"
                />
              </div>
            </div>

            {/* Long Break Interval */}
            <div className="mt-3 flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                Uzun Mola Sıklığı (Döngü sayısı):
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={localSettings.longBreakInterval}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      longBreakInterval: Math.max(2, parseInt(e.target.value) || 4),
                    }))
                  }
                  className="w-16 px-2.5 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-mono text-center text-xs"
                />
                <span className="text-xs text-zinc-500">döngü</span>
              </div>
            </div>
          </div>

          {/* Automation section */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-3">
              <PlayCircle className="w-4 h-4 text-zinc-500" />
              <span>Otomatik Geçişler</span>
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium block">
                    Otomatik Mola Başlat
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Odaklanma bittiğinde molayı beklemeden başlat
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.autoStartBreaks}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      autoStartBreaks: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-rose-600 rounded-md focus:ring-rose-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium block">
                    Otomatik Odaklanma Başlat
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Mola bittiğinde yeni odaklanma seansını başlat
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.autoStartPomodoros}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      autoStartPomodoros: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-rose-600 rounded-md focus:ring-rose-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Sound & Notifications */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-zinc-500" />
              <span>Ses ve Bildirimler</span>
            </h3>

            {/* Sound toggle & Theme */}
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  Bitiş Zil Sesi
                </span>
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      soundEnabled: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-rose-600 rounded-md focus:ring-rose-500 cursor-pointer"
                />
              </label>

              {localSettings.soundEnabled && (
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Ses Tonu:
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={localSettings.soundTheme}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            soundTheme: e.target.value as SoundTheme,
                          }))
                        }
                        className="px-3 py-1.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none"
                      >
                        <option value="zen-bell">Zen Çanı (Gong)</option>
                        <option value="singing-bowl">Tibet Kasesi</option>
                        <option value="digital">Dijital Çan</option>
                        <option value="marimba">Akustik Marimba</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleTestSound}
                        className="px-2.5 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 cursor-pointer"
                      >
                        Dene
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                      <span>Ses Düzeyi</span>
                      <span>%{localSettings.soundVolume}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={localSettings.soundVolume}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          soundVolume: parseInt(e.target.value),
                        }))
                      }
                      className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* Notification toggle */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="flex items-center gap-1.5 font-medium text-zinc-800 dark:text-zinc-200">
                    <Bell className="w-4 h-4 text-zinc-500" />
                    <span>Masaüstü Bildirimleri</span>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {notificationStatus === 'unsupported'
                      ? 'Tarayıcınız bildirimleri desteklemiyor.'
                      : notificationStatus === 'granted'
                      ? 'Bildirim izni verildi.'
                      : notificationStatus === 'denied'
                      ? 'Bildirim izni tarayıcı ayarlarından engellendi.'
                      : 'Süre bittiğinde masaüstü uyarısı alın'}
                  </span>
                </div>

                {notificationStatus === 'granted' ? (
                  <input
                    type="checkbox"
                    checked={localSettings.notificationsEnabled}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        notificationsEnabled: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-rose-600 rounded-md focus:ring-rose-500 cursor-pointer"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestNotification}
                    disabled={notificationStatus === 'unsupported' || notificationStatus === 'denied'}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-medium cursor-pointer"
                  >
                    İzin Ver
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Theme Appearance Section */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-zinc-500" />
              <span>Görünüm / Tema</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLocalSettings((prev) => ({ ...prev, theme: 'light' }))}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                  localSettings.theme === 'light'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20'
                    : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Sun className="w-4 h-4 mb-1 text-amber-500" />
                <span>Aydınlık</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalSettings((prev) => ({ ...prev, theme: 'dark' }))}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                  localSettings.theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Moon className="w-4 h-4 mb-1 text-indigo-500" />
                <span>Karanlık</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalSettings((prev) => ({ ...prev, theme: 'system' }))}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                  localSettings.theme === 'system'
                    ? 'border-zinc-500 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ring-2 ring-zinc-500/20'
                    : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Laptop className="w-4 h-4 mb-1 text-zinc-500" />
                <span>Sistem</span>
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Cheatsheet */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-2">
              <Keyboard className="w-4 h-4 text-zinc-500" />
              <span>Klavye Kısayolları</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-center border border-zinc-100 dark:border-zinc-800">
                <kbd className="font-mono font-bold bg-white dark:bg-zinc-700 px-2 py-0.5 rounded shadow-xs border border-zinc-200 dark:border-zinc-600">
                  Space
                </kbd>
                <p className="mt-1 text-zinc-500">Başlat / Duraklat</p>
              </div>
              <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-center border border-zinc-100 dark:border-zinc-800">
                <kbd className="font-mono font-bold bg-white dark:bg-zinc-700 px-2 py-0.5 rounded shadow-xs border border-zinc-200 dark:border-zinc-600">
                  R
                </kbd>
                <p className="mt-1 text-zinc-500">Sıfırla</p>
              </div>
              <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-center border border-zinc-100 dark:border-zinc-800">
                <kbd className="font-mono font-bold bg-white dark:bg-zinc-700 px-2 py-0.5 rounded shadow-xs border border-zinc-200 dark:border-zinc-600">
                  S
                </kbd>
                <p className="mt-1 text-zinc-500">Seansı Atla</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-medium transition-colors cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium shadow-sm transition-colors cursor-pointer"
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};
