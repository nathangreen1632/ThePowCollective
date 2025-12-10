import React from 'react';
import ClusterGauge, {type ClusterBucket} from '../../components/ClusterGauge';

type ResortPageViewProps = {
  resortSlug: string;
};

function humanizeResortSlug(slug: string): string {
  if (!slug) return 'Unknown resort';
  return slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function ResortPageView({
                                         resortSlug,
                                       }: Readonly<ResortPageViewProps>): React.ReactElement {
  const name = humanizeResortSlug(resortSlug);

  const sampleBuckets: ClusterBucket[] = [
    {
      label: 'Past 15 min',
      tempC: -7,
      snowfallMm: 0.8,
      windKph: 14,
      severity: 'good',
    },
    {
      label: 'Now',
      tempC: -6,
      snowfallMm: 1.2,
      windKph: 18,
      severity: 'good',
    },
    {
      label: 'Next 15 min',
      tempC: -5,
      snowfallMm: 1.5,
      windKph: 22,
      severity: 'stormy',
    },
  ];

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--pow-muted)]">
          Resort
        </p>
        <h1 className="text-xl font-semibold tracking-tight">{name}</h1>
        <p className="text-sm text-[var(--pow-muted)]">
          Real-time conditions, avalanche awareness, and local happenings for this mountain.
        </p>
      </header>

      <ClusterGauge buckets={sampleBuckets} />

      <div className="grid gap-4">
        <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
          <h2 className="mb-2 text-sm font-semibold tracking-tight">
            Snowfall and forecast
          </h2>
          <p className="text-xs text-[var(--pow-muted)]">
            This card will show reported vs modeled snowfall for 24/48/72 hours, plus a 3–5 day outlook extended to 14 days.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
          <h2 className="mb-2 text-sm font-semibold tracking-tight">
            Avalanche and backcountry
          </h2>
          <p className="text-xs text-[var(--pow-muted)]">
            Danger ratings by elevation band, avalanche problems, and travel advice for nearby backcountry zones will appear here.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
          <h2 className="mb-2 text-sm font-semibold tracking-tight">
            Local events
          </h2>
          <p className="text-xs text-[var(--pow-muted)]">
            Upcoming resort and town events near {name}, including demos, concerts, and rail jams, will be pulled from event feeds here.
          </p>
        </section>
      </div>
    </section>
  );
}
