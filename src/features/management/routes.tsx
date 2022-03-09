import * as React from 'react';

const ProfilePage = React.lazy(() => import('./pages/profile'));
const MyAppsPage = React.lazy(() => import('./pages/my-apps'));
const MyCompanyPage = React.lazy(() => import('./pages/my-company'));

export const managementRoutes = [
  {
    path: '/my-apps',
    exact: true,
    private: true,
    Component: MyAppsPage,
  },
  {
    path: '/my-profile',
    exact: false,
    private: true,
    Component: ProfilePage,
  },
  {
    path: '/my-company',
    exact: false,
    private: true,
    Component: MyCompanyPage,
  },
];
