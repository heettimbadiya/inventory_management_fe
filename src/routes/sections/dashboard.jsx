import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import ClientCreatePage from '../../pages/dashboard/client/create';
import ClientListPage from '../../pages/dashboard/client/list';
import ClientEditPage from '../../pages/dashboard/client/edit';
import EventListPage from '../../pages/dashboard/event/list';
import EventCreatePage from '../../pages/dashboard/event/create';
import EventEditPage from '../../pages/dashboard/event/edit';
import RentalListPage from '../../pages/dashboard/rental/list';
import RentalCreatePage from '../../pages/dashboard/rental/create';
import RentalEditPage from '../../pages/dashboard/rental/edit';
import ServiceListPage from '../../pages/dashboard/service/list.jsx';
import ServiceCreatePage from '../../pages/dashboard/service/create.jsx';
import ServiceEditPage from '../../pages/dashboard/service/edit.jsx';
import LeadsListPage from '../../pages/dashboard/leads/list.jsx';
import LeadsCreatePage from '../../pages/dashboard/leads/create.jsx';
import LeadsEditPage from '../../pages/dashboard/leads/edit.jsx';
import EstimateListView from '../../sections/estimate/view/estimate-list-view.jsx';
import EstimateCreateView from '../../sections/estimate/view/estimate-create-view.jsx';
import EstimateEditView from '../../sections/estimate/view/estimate-edit-view.jsx';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const PageThree = lazy(() => import('src/pages/dashboard/three'));
const PageFour = lazy(() => import('src/pages/dashboard/four'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'two', element: <PageTwo /> },
      { path: 'three', element: <PageThree /> },
      {
        path: 'client',
        children: [
          { element: <ClientListPage />, index: true },
          { path: 'list', element: <ClientListPage /> },
          { path: 'new', element: <ClientCreatePage /> },
          { path: ':id/edit', element: <ClientEditPage /> },
        ],
      },{
        path: 'leads',
        children: [
          { element: <LeadsListPage />, index: true },
          { path: 'list', element: <LeadsListPage /> },
          { path: 'new', element: <LeadsCreatePage /> },
          { path: ':id/edit', element: <LeadsEditPage /> },
        ],
      },
      {
        path: 'estimate',
        children: [
          { element: <EstimateListView />, index: true },
          { path: 'list', element: <EstimateListView /> },
          { path: 'new', element: <EstimateCreateView /> },
          { path: ':id/edit', element: <EstimateEditView /> },
        ],
      },     {
        path: 'event',
        children: [
          { element: <EventListPage />, index: true },
          { path: 'list', element: <EventListPage /> },
          { path: 'new', element: <EventCreatePage /> },
          { path: ':id/edit', element: <EventEditPage /> },
        ],
      },
      {
        path: 'rental',
        children: [
          { element: <RentalListPage />, index: true },
          { path: 'list', element: <RentalListPage /> },
          { path: 'new', element: <RentalCreatePage /> },
          { path: ':id/edit', element: <RentalEditPage /> },
        ],
      },{
        path: 'service',
        children: [
          { element: <ServiceListPage />, index: true },
          { path: 'list', element: <ServiceListPage /> },
          { path: 'new', element: <ServiceCreatePage /> },
          { path: ':id/edit', element: <ServiceEditPage /> },
        ],
      },
      {
        path: 'group',
        children: [
          { element: <PageFour />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
    ],
  },
];
