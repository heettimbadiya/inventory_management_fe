import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetEvent() {
  const URL = `${HOST_API}/api/event`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      event: data?.data || [],
      eventLoading: isLoading,
      eventError: error,
      eventValidating: isValidating,
      eventEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
