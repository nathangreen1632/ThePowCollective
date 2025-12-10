// Client/src/ui/layout/AppShell.tsx
import React from 'react';

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Readonly<AppShellProps>): React.ReactElement {
  return (
    <main className="mx-auto max-w-7xl px-4 py-4">
      {children}
    </main>
  );
}
