import { useState, useEffect } from 'react';
import { DARK_MODE_CONFIG } from '@/config';

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DARK_MODE_CONFIG.STORAGE_KEY);
      if (stored) {
        return stored === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem(DARK_MODE_CONFIG.STORAGE_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(DARK_MODE_CONFIG.STORAGE_KEY, 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return { isDark, toggle, setIsDark };
}
