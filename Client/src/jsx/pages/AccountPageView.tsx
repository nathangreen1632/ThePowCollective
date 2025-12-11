import React from 'react';

export default function AccountPageView(): React.ReactElement {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--pow-muted)]">
          Account
        </p>
        <h1 className="text-xl font-semibold tracking-tight">
          Your PowCollective
        </h1>
        <p className="text-sm text-[var(--pow-muted)]">
          Optional accounts let you favorite resorts and backcountry zones, save filters, and unlock future pro alerts.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)] space-y-2">
        <h2 className="text-sm font-semibold tracking-tight">
          Sign in or create an account
        </h2>
        <p className="text-xs text-[var(--pow-muted)]">
          Authentication flow placeholder. This will eventually handle email-based sign-in and store your favorites and alert preferences.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--pow-border)] bg-[var(--pow-surface)] p-4 shadow-[0_12px_30px_var(--pow-card-shadow)] space-y-2">
        <h2 className="text-sm font-semibold tracking-tight">
          Favorites and alerts
        </h2>
        <p className="text-xs text-[var(--pow-muted)]">
          Soon you&apos;ll be able to star your go-to mountains, set safe-drive-distance limits, and get notified when storms line up with your preferences.
        </p>
      </section>
    </section>
  );
}
