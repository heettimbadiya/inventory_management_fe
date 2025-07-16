import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from '../utils/axios';
import { HOST_API } from '../config-global';
import axiosInstance from '../utils/axios';

export function useGetInvoices() {
  const URL = `${HOST_API}/api/invoice`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      invoices: data?.data || [],
      invoiceLoading: isLoading,
      invoiceError: error,
      invoiceValidating: isValidating,
      invoiceEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

export function useGetInvoiceById(id) {
  const URL = id ? `${HOST_API}/api/invoice/${id}` : null;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      invoice: data?.data || null,
      invoiceLoading: isLoading,
      invoiceError: error,
      invoiceValidating: isValidating,
      mutate,
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

export async function createInvoice(payload) {
  return axiosInstance.post('/api/invoice', payload);
}

export async function updateInvoice(id, payload) {
  return axiosInstance.put(`/api/invoice/${id}`, payload);
}

export async function deleteInvoice(id) {
  return axiosInstance.delete(`/api/invoice/${id}`);
} 