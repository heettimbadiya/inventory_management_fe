import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetService() {
  const URL = `${HOST_API}/api/service`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      service: data?.data || [],
      serviceLoading: isLoading,
      serviceError: error,
      serviceValidating: isValidating,
      serviceEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
