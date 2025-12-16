import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchResorts } from '../../api/resorts';
import type { ResortSummary } from '../../types/resort.types';

type StateOverviewPageViewProps = {
  stateCode: string;
};

function titleForState(stateCode: string): string {
  const upper = stateCode.toUpperCase();

  if (upper === 'CO') return 'Colorado';
  if (upper === 'WA') return 'Washington';
  if (upper === 'OR') return 'Oregon';
  if (upper === 'CA') return 'California';
  if (upper === 'NV') return 'Nevada';
  if (upper === 'ID') return 'Idaho';
  if (upper === 'MT') return 'Montana';
  if (upper === 'WY') return 'Wyoming';
  if (upper === 'NM') return 'New Mexico';
  if (upper === 'ND') return 'North Dakota';
  if (upper === 'MN') return 'Minnesota';
  if (upper === 'WI') return 'Wisconsin';
  if (upper === 'MI') return 'Michigan';
  if (upper === 'OH') return 'Ohio';
  if (upper === 'PA') return 'Pennsylvania';
  if (upper === 'NY') return 'New York';
  if (upper === 'VT') return 'Vermont';
  if (upper === 'NH') return 'New Hampshire';
  if (upper === 'ME') return 'Maine';
  if (upper === 'MA') return 'Massachusetts';
  if (upper === 'CT') return 'Connecticut';
  if (upper === 'DE') return 'Delaware';
  if (upper === 'MD') return 'Maryland';
  if (upper === 'VA') return 'Virginia';
  if (upper === 'NC') return 'North Carolina';

  return upper;
}

function formatDriveTime(resort: ResortSummary): string {
  if (!resort.defaultDriveFromCityMinutes || !resort.defaultCity) return '';
  const minutes = resort.defaultDriveFromCityMinutes;

  if (minutes < 60) {
    return `${minutes} min from ${resort.defaultCity}`;
  }

  const hours = Math.round(minutes / 60);
  return `${hours} hr drive from ${resort.defaultCity}`;
}

function brandLabel(brand: ResortSummary['brand']): string {
  if (brand === 'epic') return 'Epic';
  if (brand === 'ikon') return 'Ikon';
  return 'Independent';
}

export default function StateOverviewPageView({
                                                stateCode
                                              }: Readonly<StateOverviewPageViewProps>): React.ReactElement {
  const [resorts, setResorts] = useState<ResortSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchResorts(stateCode.toLowerCase());

        if (!cancelled) {
          setResorts(data);
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load resorts right now.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [stateCode]);

  const title = titleForState(stateCode);

  let body: React.ReactNode;

  if (loading) {
    body = (
      <p className="text-xs text-[var(--pow-muted)]">
        Loading resorts for {title}…
      </p>
    );
  } else if (error) {
    body = (
      <p className="text-xs text-[var(--pow-danger)]">
        {error}
      </p>
    );
  } else if (resorts.length === 0) {
    body = (
      <p className="text-xs text-[var(--pow-muted)]">
        No resorts configured yet for this state. Colorado and select western states are part of the pilot.
      </p>
    );
  } else {
    body = (
      <ul className="space-y-2">
        {resorts.map(resort => {
          const drive = formatDriveTime(resort);

          return (
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
                    {drive ? ` • ${drive}` : ''}
                  </span>
                </div>
                <span className="text-[10px] text-[var(--pow-accent)]">
                  View conditions
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

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
        {body}
      </div>
    </section>
  );
}
