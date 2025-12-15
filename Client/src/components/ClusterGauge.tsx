import React from 'react';

export type ClusterBucket = {
  label: string;
  tempC: number;
  snowfallMm: number;
  windKph: number;
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

function severityClass(severity: ClusterBucket['severity']): string {
  const base = 'mt-2 rounded-full px-2 py-1 text-[10px] font-semibold';
  if (severity === 'stormy') {
    return `${base} bg-[var(--pow-danger-soft)] text-[var(--pow-danger)]`;
  }
  if (severity === 'good') {
    return `${base} bg-[var(--pow-accent-soft)] text-[var(--pow-accent)]`;
  }
  return `${base} bg-[var(--pow-success-soft)] text-[var(--pow-success)]`;
}

function cToF(c: number): number {
  return c * (9 / 5) + 32;
}

function mmToIn(mm: number): number {
  return mm / 25.4;
}

function kphToMph(kph: number): number {
  return kph * 0.621371;
}

export default function ClusterGauge({
                                       buckets,
                                     }: Readonly<ClusterGaugeProps>): React.ReactElement {
  return (
    <section
      aria-label="Short-term snow and weather cluster"
      className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]"
    >
      <h2 className="mb-3 text-sm font-semibold tracking-tight">
        Next 30 minutes at a glance
      </h2>

      <div className="grid grid-cols-3 gap-3 text-xs">
        {buckets.map((bucket) => {
          const tempF = Math.round(cToF(bucket.tempC));
          const snowIn = mmToIn(bucket.snowfallMm);
          const windMph = Math.round(kphToMph(bucket.windKph));

          return (
            <div
              key={bucket.label}
              className="flex flex-col items-center rounded-xl bg-[var(--pow-surface-alt)] px-2 py-3"
            >
              <span className="mb-1 text-[10px] uppercase tracking-wide text-[var(--pow-muted)]">
                {bucket.label}
              </span>

              <span className="text-sm font-semibold">{tempF}°F</span>

              <span className="mt-1 text-[10px] text-[var(--pow-muted)]">
                {snowIn.toFixed(1)} in snow
              </span>

              <span className="text-[10px] text-[var(--pow-muted)]">
                {windMph} mph wind
              </span>

              <span className={severityClass(bucket.severity)}>
                {severityLabel(bucket.severity)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
