import React, { useEffect, useState } from 'react';
import ClusterGauge from '../../components/ClusterGauge';
import type { ClusterBucket, ConditionsSnapshot } from '../../types/conditions.types';
import type { ResortSummary } from '../../types/resort.types';
import { fetchResort } from '../../api/resorts';
import { fetchConditionsForResort } from '../../api/conditions';

type ResortPageViewProps = {
  resortSlug: string;
};

function buildFallbackBuckets(): ClusterBucket[] {
  const base: Omit<ClusterBucket, 'severity'>[] = [
    {
      label: 'Past 15 min',
      tempF: 18,
      snowfallIn: 0.05,
      windMph: 12,
    },
    {
      label: 'Now',
      tempF: 20,
      snowfallIn: 0.08,
      windMph: 18,
    },
    {
      label: 'Next 15 min',
      tempF: 21,
      snowfallIn: 0.12,
      windMph: 24,
    },
  ];

  return base.map(bucket => {
    const result: ClusterBucket = {
      ...bucket,
      severity: 'calm',
    };

    if (result.windMph >= 40 || result.snowfallIn >= 0.2) {
      result.severity = 'stormy';
    } else if (result.snowfallIn >= 0.05) {
      result.severity = 'good';
    }

    return result;
  });
}

function formatUpdatedAt(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatFixed(value: number, decimals: number): string {
  const factor = Math.pow(10, decimals);
  return String(Math.round(value * factor) / factor);
}

export default function ResortPageView({
                                         resortSlug,
                                       }: Readonly<ResortPageViewProps>): React.ReactElement {
  const [resort, setResort] = useState<ResortSummary | null>(null);
  const [conditions, setConditions] = useState<ConditionsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resortSlug) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [resortData, conditionsData] = await Promise.all([
          fetchResort(resortSlug),
          fetchConditionsForResort(resortSlug),
        ]);

        if (!cancelled) {
          setResort(resortData);
          setConditions(conditionsData);
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load resort conditions right now.');
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
  }, [resortSlug]);

  if (loading) {
    return (
      <section className="space-y-4">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--pow-muted)]">
            Resort
          </p>
          <h1 className="text-xl font-semibold tracking-tight">Loading resort…</h1>
        </header>
        <p className="text-sm text-[var(--pow-muted)]">
          Pulling live snow and weather conditions.
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--pow-muted)]">
            Resort
          </p>
          <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
        </header>
        <p className="text-sm text-[var(--pow-danger)]">{error}</p>
      </section>
    );
  }

  if (!resort) {
    return (
      <section className="space-y-4">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--pow-muted)]">
            Resort
          </p>
          <h1 className="text-xl font-semibold tracking-tight">Resort not found</h1>
        </header>
        <p className="text-sm text-[var(--pow-muted)]">
          This resort is not yet part of the PowCollective pilot.
        </p>
      </section>
    );
  }

  let buckets: ClusterBucket[] = buildFallbackBuckets();

  if (conditions && conditions.clusterBuckets.length > 0) {
    buckets = conditions.clusterBuckets;
  }

  const top = resort.elevationTopFt.toLocaleString();
  const base = resort.elevationBaseFt.toLocaleString();
  const vertical = resort.verticalDropFt.toLocaleString();

  const snowfall24 = conditions ? conditions.snowfall24hIn : null;
  const snowfall48 = conditions ? conditions.snowfall48hIn : null;
  const snowfall72 = conditions ? conditions.snowfall72hIn : null;
  const snowBaseDepth = conditions ? conditions.snowDepthBaseIn : null;
  const snowSummitDepth = conditions ? conditions.snowDepthSummitIn : null;
  const shortText = conditions ? conditions.shortText : null;

  const updatedAt = conditions ? formatUpdatedAt(conditions.generatedAtIso) : '';
  const nowTemp = conditions ? `${formatFixed(conditions.tempF, 0)}°F` : '';
  const nowFeels = conditions ? `${formatFixed(conditions.feelsLikeF, 0)}°F` : '';
  const nowWind = conditions ? `${formatFixed(conditions.windMph, 0)} mph` : '';
  const nowGust = conditions ? `${formatFixed(conditions.gustMph, 0)} mph` : '';
  const nowVisibility = conditions ? `${formatFixed(conditions.visibilityMiles, 1)} mi` : '';

  return (
    <div className="min-h-screen bg-[var(--pow-bg)] text-[var(--pow-text)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--pow-muted)]">
          Resort
        </p>
        <h1 className="text-xl font-semibold tracking-tight">{resort.name}</h1>
        <p className="text-sm text-[var(--pow-muted)]">
          Real-time clusters, avalanche awareness, and local happenings for this mountain.
        </p>
      </header>

      <div className="grid gap-4">
        <section
          aria-label="Right now conditions"
          className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="mb-1 text-sm font-semibold tracking-tight">Right now</h2>
              {updatedAt ? (
                <p className="text-xs text-[var(--pow-muted)]">Updated {updatedAt}</p>
              ) : null}
            </div>
          </div>

          {conditions ? (
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
              <div className="rounded-xl border border-[var(--pow-border)] bg-[var(--pow-surface-alt)] px-3 py-2">
                <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--pow-muted)] text-center">
                  Temp
                </dt>
                <dd className="mt-1 font-semibold text-center">{nowTemp}</dd>
              </div>

              <div className="rounded-xl border border-[var(--pow-border)] bg-[var(--pow-surface-alt)] px-3 py-2">
                <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--pow-muted)] text-center">
                  Feels like
                </dt>
                <dd className="mt-1 font-semibold text-center">{nowFeels}</dd>
              </div>

              <div className="rounded-xl border border-[var(--pow-border)] bg-[var(--pow-surface-alt)] px-3 py-2">
                <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--pow-muted)] text-center">
                  Wind
                </dt>
                <dd className="mt-1 font-semibold text-center">{nowWind}</dd>
              </div>

              <div className="rounded-xl border border-[var(--pow-border)] bg-[var(--pow-surface-alt)] px-3 py-2">
                <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--pow-muted)] text-center">
                  Gust
                </dt>
                <dd className="mt-1 font-semibold text-center">{nowGust}</dd>
              </div>

              <div className="rounded-xl border border-[var(--pow-border)] bg-[var(--pow-surface-alt)] px-3 py-2">
                <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--pow-muted)] text-center">
                  Visibility
                </dt>
                <dd className="mt-1 font-semibold text-center">{nowVisibility}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-xs text-[var(--pow-muted)]">
              Live “right now” conditions will appear here as soon as the feed is available.
            </p>
          )}
        </section>

        <ClusterGauge buckets={buckets} />

        <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
          <h2 className="mb-1 text-sm font-semibold tracking-tight">Mountain stats</h2>
          <p className="text-xs text-[var(--pow-muted)]">
            Top {top} ft • Base {base} ft • Vertical drop {vertical} ft.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)] space-y-1">
          <h2 className="text-sm font-semibold tracking-tight">Snowfall and forecast</h2>
          {conditions ? (
            <>
              <p className="text-xs text-[var(--pow-muted)]">
                Last 24 hours: {snowfall24} in • 48 hours: {snowfall48} in • 72 hours:{' '}
                {snowfall72} in.
              </p>
              <p className="text-xs text-[var(--pow-muted)]">
                Base depth: {snowBaseDepth} in • Summit depth: {snowSummitDepth} in.
              </p>
              <p className="text-xs text-[var(--pow-muted)]">{shortText}</p>
            </>
          ) : (
            <p className="text-xs text-[var(--pow-muted)]">
              Live snowfall and forecast details will appear here as soon as conditions data is
              available.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
          <h2 className="mb-2 text-sm font-semibold tracking-tight">Avalanche and backcountry</h2>
          <p className="text-xs text-[var(--pow-muted)]">
            Danger ratings by elevation band, avalanche problems, and travel advice for nearby
            backcountry zones will be rendered here, sourced from official avalanche centers.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
          <h2 className="mb-2 text-sm font-semibold tracking-tight">Local events</h2>
          <p className="text-xs text-[var(--pow-muted)]">
            Upcoming resort and town events near {resort.name}, including demos, concerts, and rail
            jams, will be pulled from event feeds here.
          </p>
        </section>
      </div>
    </section>
      </div>
    </div>
  );
}
