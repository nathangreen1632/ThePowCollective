// Client/src/common/Footer.tsx
import React from 'react';

export default function Footer(): React.ReactElement {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--pow-border)] bg-[var(--pow-surface)]">
      <div className="mx-auto max-w-7xl gap-2 px-4 py-3 text-[11px] text-[var(--pow-muted)] text-center">

        © {currentYear}{" || "}
        <a
          href="https://www.oneguyproductions.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          One Guy Productions
        </a>{" || "}
        All rights reserved.
      </div>
    </footer>
  );
}
