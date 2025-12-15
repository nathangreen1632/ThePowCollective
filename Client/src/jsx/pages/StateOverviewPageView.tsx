import React from 'react';
import { Link } from 'react-router-dom';
import { getResortsForStateSlug } from '../../helpers/resort.helpers';
import type { ResortSummary } from '../../types/resort.types';

type StateOverviewPageViewProps = {
  stateCode: string;
};

function titleForState(stateCode: string): string {
  const upper = stateCode.toUpperCase();
  if (upper === 'CO') return 'Colorado';
  return upper;
}

function formatDriveTime(minutes?: number): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min from Denver`;
  const hours = Math.round(minutes / 60);
  return `${hours} hr drive from Denver`;
}

function brandLabel(brand: ResortSummary['brand']): string {
  if (brand === 'epic') return 'Epic';
  if (brand === 'ikon') return 'Ikon';
  return 'Independent';
}

export default function StateOverviewPageView({
                                                stateCode
                                              }: Readonly<StateOverviewPageViewProps>): React.ReactElement {
  const resorts = getResortsForStateSlug(stateCode);
  const title = titleForState(stateCode);

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--pow-muted)]">
          State overview
        </p>
        <h1 className="text-xl font-semibold tracking-tight">
          {title} resorts
        </h1>
        <p className="text-sm text-[var(--pow-muted)]">
          Pick a mountain to see short-term clusters, avalanche danger, and what&apos;s happening on and off the hill.
        </p>
      </header>

      <div className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)] space-y-3">
        {resorts.length === 0 ? (
          <p className="text-xs text-[var(--pow-muted)]">
            No resorts configured yet for this state. Colorado is the pilot state for PowCollective.
          </p>
        ) : (
          <ul className="space-y-2">
            {resorts.map(resort => (
              <li key={resort.slug}>
                <Link
                  to={`/resort/${resort.slug}`}
                  className="flex items-center justify-between rounded-xl bg-[var(--pow-surface-alt)] px-3 py-2 text-xs hover:bg-[var(--pow-accent-soft)]"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-[var(--pow-text)]">
                      {resort.name}
                    </span>
                    <span className="text-[10px] text-[var(--pow-muted)]">
                      {brandLabel(resort.brand)} • {resort.size.toUpperCase()}
                      {resort.driveFromDenverMinutes
                        ? ` • ${formatDriveTime(resort.driveFromDenverMinutes)}`
                        : ''}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--pow-accent)]">
                    View conditions
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
