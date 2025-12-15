import React from 'react';

export type ClusterBucket = {
  label: string;
  tempF: number;
  snowfallIn: number;
  windMph: number;
  severity: 'calm' | 'good' | 'stormy';
};

type ClusterGaugeProps = {
  buckets: ClusterBucket[];
};

function severityLabel(severity: ClusterBucket['severity']): string {
  if (severity === 'calm') return 'Calm';
  if (severity === 'good') return 'Snowy';
  return 'Stormy';
}

function severityClassName(severity: ClusterBucket['severity']): string {
  if (severity === 'stormy') {
    return 'mt-2 rounded-full bg-[var(--pow-danger-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--pow-danger)]';
  }

  if (severity === 'good') {
    return 'mt-2 rounded-full bg-[var(--pow-accent-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--pow-accent)]';
  }

  return 'mt-2 rounded-full bg-[var(--pow-success-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--pow-success)]';
}

export default function ClusterGauge({ buckets }: Readonly<ClusterGaugeProps>): React.ReactElement {
  return (
    <section
      aria-label="Short-term snow and weather cluster"
      className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]"
    >
      <h2 className="mb-3 text-sm font-semibold tracking-tight">
        Next 30 minutes at a glance
      </h2>
      <div className="grid grid-cols-3 gap-3 text-xs">
        {buckets.map(bucket => (
          <div
            key={bucket.label}
            className="flex flex-col items-center rounded-xl bg-[var(--pow-surface-alt)] px-2 py-3"
          >
            <span className="mb-1 text-[10px] uppercase tracking-wide text-[var(--pow-muted)]">
              {bucket.label}
            </span>
            <span className="text-sm font-semibold">
              {Math.round(bucket.tempF)}°F
            </span>
            <span className="mt-1 text-[10px] text-[var(--pow-muted)]">
              {bucket.snowfallIn.toFixed(2)} in snow
            </span>
            <span className="text-[10px] text-[var(--pow-muted)]">
              {Math.round(bucket.windMph)} mph wind
            </span>
            <span className={severityClassName(bucket.severity)}>
              {severityLabel(bucket.severity)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
