// Client/src/jsx/pages/HomePageView.tsx
import React from 'react';
import UsaMap from '../../components/maps/UsaMap';

export default function HomePage(): React.ReactElement {
  return (
    <section className="space-y-8 w-full h-full">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Chase powder with confidence.
        </h1>
        <p className="text-sm text-[var(--pow-muted)]">
          Click Colorado to drill into resort-level snow totals. More states coming soon.
        </p>
      </header>

      <div className="mt-6 w-full flex justify-center">
        <UsaMap />
      </div>
    </section>
  );
}
