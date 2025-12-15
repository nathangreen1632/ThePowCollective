import React from 'react';
import { getResortBySlug } from '../../helpers/resort.helpers';
import ClusterGauge, { type ClusterBucket } from '../../components/ClusterGauge';

type ResortPageViewProps = {
  resortSlug: string;
};

function severityForBucket(bucket: ClusterBucket): ClusterBucket['severity'] {
  if (bucket.windMph >= 40 || bucket.snowfallIn >= 0.2) return 'stormy';
  if (bucket.snowfallIn >= 0.05) return 'good';
  return 'calm';
}

export default function ResortPageView({
                                         resortSlug
                                       }: Readonly<ResortPageViewProps>): React.ReactElement {
  const resort = getResortBySlug(resortSlug);

  const bucketsBase: Omit<ClusterBucket, 'severity'>[] = [
    {
      label: 'Past 15 min',
      tempF: 18,
      snowfallIn: 0.05,
      windMph: 12
    },
    {
      label: 'Now',
      tempF: 20,
      snowfallIn: 0.08,
      windMph: 18
    },
    {
      label: 'Next 15 min',
      tempF: 21,
      snowfallIn: 0.12,
      windMph: 24
    }
  ];

  const buckets: ClusterBucket[] = bucketsBase.map(b => {
    const withSeverity: ClusterBucket = { ...b, severity: 'calm' };
    withSeverity.severity = severityForBucket(withSeverity);
    return withSeverity;
  });

  if (!resort) {
    return (
      <section className="space-y-4">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--pow-muted)]">
            Resort
          </p>
          <h1 className="text-xl font-semibold tracking-tight">
            Resort not found
          </h1>
        </header>
        <p className="text-sm text-[var(--pow-muted)]">
          This resort is not yet part of the PowCollective Colorado pilot.
        </p>
      </section>
    );
  }

  const elevationTopFeet = Math.round(resort.elevationTopM * 3.28084);
  const elevationBaseFeet = Math.round(resort.elevationBaseM * 3.28084);
  const verticalDropFeet = Math.round(resort.verticalDropM * 3.28084);

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--pow-muted)]">
          Resort
        </p>
        <h1 className="text-xl font-semibold tracking-tight">
          {resort.name}
        </h1>
        <p className="text-sm text-[var(--pow-muted)]">
          Real-time clusters, avalanche awareness, and local happenings for this mountain.
        </p>
      </header>

      <ClusterGauge buckets={buckets} />

      <div className="grid gap-4">
        <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
          <h2 className="mb-1 text-sm font-semibold tracking-tight">
            Mountain stats
          </h2>
          <p className="text-xs text-[var(--pow-muted)]">
            Top {elevationTopFeet.toLocaleString()} ft • Base {elevationBaseFeet.toLocaleString()} ft • Vertical drop {verticalDropFeet.toLocaleString()} ft.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
          <h2 className="mb-2 text-sm font-semibold tracking-tight">
            Snowfall and forecast
          </h2>
          <p className="text-xs text-[var(--pow-muted)]">
            This card will soon show reported vs modeled snowfall in inches for 24/48/72 hours and a 3–5 day outlook (extended to 14 days), powered by the PowCollective API.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
          <h2 className="mb-2 text-sm font-semibold tracking-tight">
            Avalanche and backcountry
          </h2>
          <p className="text-xs text-[var(--pow-muted)]">
            Danger ratings by elevation band, avalanche problems, and travel advice for nearby backcountry zones will be rendered here, sourced from official avalanche centers.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
          <h2 className="mb-2 text-sm font-semibold tracking-tight">
            Local events
          </h2>
          <p className="text-xs text-[var(--pow-muted)]">
            Upcoming resort and town events near {resort.name}, including demos, concerts, and rail jams, will be pulled from event feeds here.
          </p>
        </section>
      </div>
    </section>
  );
}
