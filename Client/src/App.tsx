// Client/src/App.tsx
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './AppRoutes';
import AppShell from './ui/layout/AppShell';
import Navbar from './common/Navbar';
import Footer from './common/Footer';

export default function App(): React.ReactElement {
  const element = useRoutes(routes);

  return (
    <div className="min-h-screen bg-[var(--pow-bg)] text-[var(--pow-text)] flex">
      <Navbar />
      <div className="flex flex-1 flex-col">
        <AppShell>{element}</AppShell>
        <Footer />
      </div>
    </div>
  );
}
