import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetProject() {
  const URL = `${HOST_API}/api/project`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      projects: data.data || [],
      projectLoading: isLoading,
      projectError: error,
      projectValidating: isValidating,
      projectEmpty: !isLoading && !data?.projects?.length,
      mutate,
    }),
    [data?.projects, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
