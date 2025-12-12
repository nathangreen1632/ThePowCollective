import React from 'react';
import { useTheme } from '../hooks/useTheme';

export default function SnowflakeThemeToggle(): React.ReactElement {
  const { mode, theme, cycleMode } = useTheme();

  const label = mode === 'system' ? `Theme: system (${theme})` : `Theme: ${mode}`;

  return (
    <button
      type="button"
      onClick={cycleMode}
      aria-label={label}
      aria-pressed={theme === 'dark'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--pow-border)] bg-[var(--pow-surface-alt)] text-[var(--pow-text)] shadow-md hover:bg-[var(--pow-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pow-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pow-bg)]"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        role="text"
        aria-hidden="true"
      >
        <path
          d="M12 2v20M5 5l14 14M5 19L19 5M4 12h16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    </button>
  );
}
