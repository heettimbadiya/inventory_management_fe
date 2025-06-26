import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetClient() {
  const URL = `${HOST_API}/api/client`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      client: data?.data || [],
      clientLoading: isLoading,
      clientError: error,
      clientValidating: isValidating,
      clientEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
