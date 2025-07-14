import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetContact() {
  const URL = `${HOST_API}/api/contact`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      contact: data?.contacts || [],
      contactLoading: isLoading,
      contactError: error,
      contactValidating: isValidating,
      contactEmpty: !isLoading && !data?.contacts?.length,
      mutate,
    }),
    [data?.contacts, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
