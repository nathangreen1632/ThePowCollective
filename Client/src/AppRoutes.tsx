import type { RouteObject } from 'react-router-dom';
import HomePage from './jsx/pages/HomePageView';
import StateOverviewPage from './pages/StateOverviewPage';
import ResortPage from './pages/ResortPage';
import BackcountryZonePage from './pages/BackcountryZonePage';
import AccountPage from './pages/AccountPage';

export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/states/:stateCode', element: <StateOverviewPage /> },
  { path: '/resort/:resortSlug', element: <ResortPage /> },
  { path: '/backcountry/:zoneId', element: <BackcountryZonePage /> },
  { path: '/account', element: <AccountPage /> }
];
