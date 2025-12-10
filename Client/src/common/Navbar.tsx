// Client/src/common/Navbar.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar(): React.ReactElement {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--pow-border)] bg-[var(--pow-surface)]">
      <div className="border-b border-[var(--pow-border)] px-4 py-4">
        <Link to="/" aria-label="PowCollective home" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--pow-accent-soft)] text-xs font-bold text-[var(--pow-accent)]">
            TPC
          </div>
          <span className="text-sm font-semibold tracking-tight">
            thePowCollective
          </span>
        </Link>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex flex-1 flex-col gap-1 px-2 py-4 text-sm font-medium"
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 transition-colors hover:bg-[var(--pow-accent-soft)] hover:text-[var(--pow-accent)] ${
              isActive ? 'text-[var(--pow-accent)]' : 'text-[var(--pow-muted)]'
            }`
          }
        >
          Map
        </NavLink>

        <NavLink
          to="/backcountry/overview"
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 transition-colors hover:bg-[var(--pow-accent-soft)] hover:text-[var(--pow-accent)] ${
              isActive ? 'text-[var(--pow-accent)]' : 'text-[var(--pow-muted)]'
            }`
          }
        >
          Backcountry
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 transition-colors hover:bg-[var(--pow-accent-soft)] hover:text-[var(--pow-accent)] ${
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
