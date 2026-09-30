import { useEffect, useState } from 'react';
import type { AppTheme } from '../types/pomodoro';

export function useTheme(initialTheme: AppTheme = 'system') {
  const [theme, setTheme] = useState<AppTheme>(initialTheme);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (initialTheme === 'dark') return true;
    if (initialTheme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;

    const computeIsDark = () => {
      if (theme === 'dark') return true;
      if (theme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const dark = computeIsDark();
    setIsDark(dark);

    if (dark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => {
        const d = mediaQuery.matches;
        setIsDark(d);
        if (d) {
          root.classList.add('dark');
          root.style.colorScheme = 'dark';
        } else {
          root.classList.remove('dark');
          root.style.colorScheme = 'light';
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const toggleTheme = (): AppTheme => {
    // If currently dark, always switch directly to light
    const nextTheme: AppTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
    return nextTheme;
  };

  return { theme, setTheme, isDark, toggleTheme };
}
