import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'pow-theme-mode';
const DEFAULT_MODE: ThemeMode = 'dark';

function getWin(): Window | undefined {
  return typeof globalThis === 'undefined' ? undefined : globalThis.window;
}

function getStoredMode(): ThemeMode {
  const win = getWin();
  if (!win) return DEFAULT_MODE;

  const stored = win.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  return DEFAULT_MODE;
}

function applyMode(mode: ThemeMode) {
  const win = getWin();
  if (!win) return;

  win.document.documentElement.dataset.theme = mode;
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => getStoredMode());

  useEffect(() => {
    applyMode(mode);

    const win = getWin();
    if (win) win.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  function cycleMode() {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return { mode, theme: mode, setMode, cycleMode };
}
