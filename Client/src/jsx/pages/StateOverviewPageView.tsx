import React from 'react';
import { Link } from 'react-router-dom';

type StateOverviewPageViewProps = {
  stateCode: string;
};

export default function StateOverviewPageView({
                                                stateCode,
                                              }: Readonly<StateOverviewPageViewProps>): React.ReactElement {
  const normalizedCode = stateCode.toUpperCase();

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--pow-muted)]">
          State overview
        </p>
        <h1 className="text-xl font-semibold tracking-tight">
          {normalizedCode === 'CO' ? 'Colorado' : normalizedCode} resorts
        </h1>
        <p className="text-sm text-[var(--pow-muted)]">
          Choose a resort to see real-time snow, short-term clusters, avalanche danger, and local events.
        </p>
      </header>

      <div className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)] space-y-3">
        <p className="text-xs text-[var(--pow-muted)]">
          Resort list placeholder. This will be populated from the PowCollective API for major Epic and Ikon resorts in {normalizedCode}.
        </p>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <Link
            to="/resort/arapahoe-basin"
            className="flex items-center justify-between rounded-xl bg-[var(--pow-surface-alt)] px-3 py-2 text-xs hover:bg-[var(--pow-accent-soft)]"
          >
            <span className="font-medium">Arapahoe Basin</span>
            <span className="text-[10px] text-[var(--pow-muted)]">Sample resort</span>
          </Link>
          <Link
            to="/resort/breckenridge"
            className="flex items-center justify-between rounded-xl bg-[var(--pow-surface-alt)] px-3 py-2 text-xs hover:bg-[var(--pow-accent-soft)]"
          >
            <span className="font-medium">Breckenridge</span>
            <span className="text-[10px] text-[var(--pow-muted)]">Sample resort</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
