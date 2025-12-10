// Client/src/common/Footer.tsx
import React from 'react';

export default function Footer(): React.ReactElement {
  return (
    <footer className="mt-auto border-t border-[var(--pow-border)] bg-[var(--pow-surface)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-[11px] text-[var(--pow-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          Know the snow before you go. Always wear a helmet and bring proper avy gear beyond resort boundaries.
        </p>
        <p className="text-[10px]">
          Avalanche information is sourced from official forecast centers and does not replace formal training.
        </p>
      </div>
    </footer>
  );
}
