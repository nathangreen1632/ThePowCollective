import React from 'react';
import { Link, NavLink } from 'react-router-dom';

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Readonly<AppShellProps>): React.ReactElement {
  return (
    <div className="min-h-screen bg-[var(--pow-bg)] text-[var(--pow-text)]">
      <header className="sticky top-0 z-20 border-b border-[var(--pow-border)] bg-[var(--pow-surface)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" aria-label="PowCollective home" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[var(--pow-accent-soft)] flex items-center justify-center text-xs font-bold text-[var(--pow-accent)]">
              POW
            </div>
            <span className="text-sm font-semibold tracking-tight">
              PowCollective
            </span>
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-4 text-xs font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-[var(--pow-accent)] ${isActive ? 'text-[var(--pow-accent)]' : 'text-[var(--pow-muted)]'}`
              }
            >
              Map
            </NavLink>
            <NavLink
              to="/backcountry/overview"
              className={({ isActive }) =>
                `hover:text-[var(--pow-accent)] ${isActive ? 'text-[var(--pow-accent)]' : 'text-[var(--pow-muted)]'}`
              }
            >
              Backcountry
            </NavLink>
            <NavLink
              to="/account"
              className={({ isActive }) =>
                `hover:text-[var(--pow-accent)] ${isActive ? 'text-[var(--pow-accent)]' : 'text-[var(--pow-muted)]'}`
              }
            >
              Account
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-4">
        {children}
      </main>
      <footer className="mt-8 border-t border-[var(--pow-border)] bg-[var(--pow-surface)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 text-xs text-[var(--pow-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Know the snow before you go. Always wear a helmet and bring proper avy gear beyond resort boundaries.
          </p>
          <p className="text-[10px]">
            Avalanche information is sourced from official forecast centers and does not replace formal training.
          </p>
        </div>
      </footer>
    </div>
  );
}
