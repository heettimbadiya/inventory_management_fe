import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from '../utils/axios';
import axiosInstance from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetContact() {
  const URL = `${HOST_API}/api/contact`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      contact: data?.data || [],
      contactLoading: isLoading,
      contactError: error,
      contactValidating: isValidating,
      contactEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetContactById(id) {
  const URL = id ? `${HOST_API}/api/contact/${id}` : null;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      contact: data?.data || null,
      contactLoading: isLoading,
      contactError: error,
      contactValidating: isValidating,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export async function updateContactStage(id, stage) {
  return axiosInstance.put(`/api/contact/${id}`, { stage });
}
