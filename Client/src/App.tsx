import React from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './AppRoutes';
import AppShell from './ui/layout/AppShell';

export default function App(): React.ReactElement {
  const element = useRoutes(routes);
  return <AppShell>{element}</AppShell>;
}
