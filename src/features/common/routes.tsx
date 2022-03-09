import * as React from 'react';

const ChartPage = React.lazy(() => import('./pages/chart'));
const HomePage = React.lazy(() => import('./pages/home'));
const SearchPage = React.lazy(() => import('./pages/search'));
const DetailsPage = React.lazy(() => import('./pages/details'));
const NotFoundPage = React.lazy(() => import('./pages/not-found'));
const AppVersionPage = React.lazy(() => import('./pages/app-version'));

export const commonRoutes = [
  {
    path: '/details/:appId/:appVersion',
    exact: true,
    private: false,
    Component: AppVersionPage,
  },
  {
    path: '/details/:safeName',
    exact: true,
    private: false,
    Component: DetailsPage,
  },
  {
    path: '/browse',
    exact: false,
    //   private: true,
    Component: SearchPage,
  },
  {
    path: '/chart',
    exact: true,
    private: true,
    Component: ChartPage,
  },
  {
    path: '/',
    exact: true,
    Component: HomePage,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
];
