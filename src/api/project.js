import useSWR from 'swr';
import axios from 'axios';

export function useGetProject() {
  const fetcher = (url) => axios.get(url).then((res) => res.data.data || []);
  const { data, error, mutate, isLoading } = useSWR('/api/project', fetcher);
  return {
    projects: data || [],
    isLoading,
    error,
    mutate,
  };
} 