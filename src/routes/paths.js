// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    client: {
      root: `${ROOTS.DASHBOARD}/client`,
      list: `${ROOTS.DASHBOARD}/client/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/client/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/client/new`,
    },
    leads: {
      root: `${ROOTS.DASHBOARD}/leads`,
      list: `${ROOTS.DASHBOARD}/leads/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/leads/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/leads/new`,
    },
    estimate: {
      root: `${ROOTS.DASHBOARD}/estimate`,
      list: `${ROOTS.DASHBOARD}/estimate/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/estimate/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/estimate/new`,
    },
    event: {
      root: `${ROOTS.DASHBOARD}/event`,
      list: `${ROOTS.DASHBOARD}/event/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/event/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/event/new`,
    },
    service: {
      root: `${ROOTS.DASHBOARD}/service`,
      list: `${ROOTS.DASHBOARD}/service/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/service/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/service/new`,
    },
    rental: {
      root: `${ROOTS.DASHBOARD}/rental`,
      list: `${ROOTS.DASHBOARD}/rental/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/rental/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/rental/new`,
    },
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
    contact: {
      root: `${ROOTS.DASHBOARD}/contact`,
      list: `${ROOTS.DASHBOARD}/contact/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/contact/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/contact/new`,
    },
    project: {
      root: `${ROOTS.DASHBOARD}/project`,
      list: `${ROOTS.DASHBOARD}/project/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/project/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/project/new`,
      view: (id) => `${ROOTS.DASHBOARD}/project/${id}/view`,
    },
  },
};
