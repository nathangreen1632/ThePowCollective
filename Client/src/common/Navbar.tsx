import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import SnowflakeThemeToggle from '../components/SnowflakeThemeToggle';

export default function Navbar(): React.ReactElement {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--pow-border)] bg-[var(--pow-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--pow-border)] px-4 py-4">
        <Link to="/" aria-label="PowCollective home" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--pow-accent-soft)] text-xs font-bold text-[var(--pow-accent)]">
            TPC
          </div>
          <span className="text-sm font-semibold tracking-tight">
            thePowCollective
          </span>
        </Link>
        <SnowflakeThemeToggle />
      </div>

      <nav aria-label="Primary" className="flex-1 space-y-1 px-4 py-4 text-sm">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 transition-colors hover:bg-[var(--pow-accent-soft)] hover:text-[var(--pow-accent)] ${
              isActive ? 'text-[var(--pow-accent)]' : 'text-[var(--pow-muted)]'
            }`
          }
        >
          Map
        </NavLink>

        <NavLink
          to="/backcountry/overview"
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 transition-colors hover:bg-[var(--pow-accent-soft)] hover:text-[var(--pow-accent)] ${
              isActive ? 'text-[var(--pow-accent)]' : 'text-[var(--pow-muted)]'
            }`
          }
        >
          Backcountry
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 transition-colors hover:bg-[var(--pow-accent-soft)] hover:text-[var(--pow-accent)] ${
              isActive ? 'text-[var(--pow-accent)]' : 'text-[var(--pow-muted)]'
            }`
          }
        >
          Account
        </NavLink>
      </nav>
    </aside>
  );
}
