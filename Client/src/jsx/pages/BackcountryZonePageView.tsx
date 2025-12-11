import React from 'react';

type BackcountryZonePageViewProps = {
  zoneId: string;
};

export default function BackcountryZonePageView({
                                                  zoneId,
                                                }: Readonly<BackcountryZonePageViewProps>): React.ReactElement {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--pow-muted)]">
          Backcountry zone
        </p>
        <h1 className="text-xl font-semibold tracking-tight">
          Zone {zoneId || 'loading'}
        </h1>
        <p className="text-sm text-[var(--pow-muted)]">
          Avalanche danger, problem types, and travel advice for this backcountry area.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--pow-danger-soft)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
        <h2 className="mb-2 text-sm font-semibold tracking-tight text-[var(--pow-danger)]">
          Safety first
        </h2>
        <p className="text-xs text-[var(--pow-muted)]">
          This section will always surface avalanche danger, problem types, and recommended travel practices for the zone. It does not replace formal avalanche education, a partner, or proper gear.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
        <h2 className="mb-2 text-sm font-semibold tracking-tight">
          Danger rating by elevation
        </h2>
        <p className="text-xs text-[var(--pow-muted)]">
          Forecast danger ratings for low, mid, and upper elevations will appear here, sourced from official avalanche centers.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
        <h2 className="mb-2 text-sm font-semibold tracking-tight">
          Avalanche problems and travel advice
        </h2>
        <p className="text-xs text-[var(--pow-muted)]">
          Problem types like slabs, persistent slabs, and wind slabs, plus practical travel advice, will be rendered here for quick, mobile-first reading before you go.
        </p>
      </section>
    </section>
  );
}
