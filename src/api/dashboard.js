import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetDashboard() {
  const URL = `${HOST_API}/api/dashboard`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      dashboard: data?.data || {},
      dashboardLoading: isLoading,
      dashboardError: error,
      dashboardValidating: isValidating,
      dashboardEmpty: !isLoading && !data?.data,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
} 