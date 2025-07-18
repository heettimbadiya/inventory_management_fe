import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from '../utils/axios';
import axiosInstance from '../utils/axios';
import { HOST_API } from '../config-global';

export function useGetProject() {
  const URL = `${HOST_API}/api/project`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      projects: data?.data || [],
      projectLoading: isLoading,
      projectError: error,
      projectValidating: isValidating,
      projectEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetProjectById(id) {
  const URL = id ? `${HOST_API}/api/project/${id}` : null;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      project: data?.data || null,
      projectLoading: isLoading,
      projectError: error,
      projectValidating: isValidating,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export async function updateProject(id, payload) {
  return axiosInstance.put(`/api/project/${id}`, payload);
}
