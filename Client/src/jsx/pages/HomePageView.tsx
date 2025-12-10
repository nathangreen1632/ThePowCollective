import React from 'react';

export default function HomePageView(): React.ReactElement {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Chase the storm, not the crowd.
        </h1>
        <p className="text-sm text-[var(--pow-muted)]">
          Start with Colorado, tap a state on the map, and drill into resorts to see real-time snow, avy danger, and local events.
        </p>
      </header>
      <div className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)]">
        <p className="text-xs text-[var(--pow-muted)]">
          Interactive map placeholder. In MVP, this will let you tap Colorado to explore resorts, conditions, and backcountry zones.
        </p>
      </div>
    </section>
  );
}
