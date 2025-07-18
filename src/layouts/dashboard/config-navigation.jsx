import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';
import Iconify from '../../components/iconify/index.js';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  leads: <Iconify icon="mdi:leads" width={24}  />,
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'crm',
        items: [
          { title: 'dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
          // {
          //   title: 'client',
          //   path: paths.dashboard.client.list,
          //   icon: ICONS.user,
          // },{
          //   title: 'leads',
          //   path: paths.dashboard.leads.list,
          //   icon: ICONS.leads,
          // },
          {
            title: 'contact',
            path: paths.dashboard.contact.list,
            icon: ICONS.mail,
          },
          {
          title: 'Project',
            path: paths.dashboard.project.list,
            icon: ICONS.folder,
          },
          {
            title: 'Calendar',
            path: paths.dashboard.calendar,
            icon: ICONS.calendar,
          },
          {
            title: 'Kanban',
            path: paths.dashboard.kanban,
            icon: ICONS.kanban,
          },
          {
            title: 'Invoice',
            path: paths.dashboard.invoice.root,
            icon: ICONS.invoice,
          },
          // {
          //   title: 'Estimate',
          //   path: paths.dashboard.estimate.list,
          //   icon: ICONS.file,
          // },
          // {
          //   title: 'Event',
          //   path: paths.dashboard.event.list,
          //   icon: ICONS.tour,
          // },
          // {
          //   title: 'Service',
          //   path: paths.dashboard.service.list,
          //   icon: ICONS.analytics,
          // },
          // {
          //   title: 'Rental',
          //   path: paths.dashboard.rental.list,
          //   icon: ICONS.banking,
          // },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      // {
      //   subheader: 'management',
      //   items: [
      //     {
      //       title: 'user',
      //       path: paths.dashboard.group.root,
      //       icon: ICONS.user,
      //       children: [
      //         { title: 'four', path: paths.dashboard.group.root },
      //         { title: 'five', path: paths.dashboard.group.five },
      //         { title: 'six', path: paths.dashboard.group.six },
      //       ],
      //     },
      //   ],
      // },
    ],
    []
  );

  return data;
}
