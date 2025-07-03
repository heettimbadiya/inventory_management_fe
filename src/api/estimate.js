import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetEstimate() {
  const URL = `${HOST_API}/api/estimates`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      estimate: data?.data || [],
      estimateLoading: isLoading,
      estimateError: error,
      estimateValidating: isValidating,
      estimateEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
