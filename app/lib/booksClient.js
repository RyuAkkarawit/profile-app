// Small client wrapper for Books API using AuthContext's fetchWithAuth
import { useContext, useCallback } from 'react';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function useBooksApi() {
  const { fetchWithAuth } = useAuth();

  const toQueryString = useCallback((obj = {}) => {
    const usp = new URLSearchParams();
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (typeof v === 'string' && v.trim() === '') return;
      usp.append(k, String(v));
    });
    return usp.toString();
  }, []);

  const list = useCallback(async (params = {}) => {
    const qs = toQueryString(params);
    const res = await fetchWithAuth(`/api/books${qs ? `?${qs}` : ''}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Failed to fetch books');
    return data;
  }, [fetchWithAuth, toQueryString]);

  const create = useCallback(async (payload) => {
    const res = await fetchWithAuth('/api/books', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.errors?.[0]?.msg || data?.error || 'Failed to create book');
    return data;
  }, [fetchWithAuth]);

  const getById = useCallback(async (id) => {
    const res = await fetchWithAuth(`/api/books/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Failed to fetch book');
    return data;
  }, [fetchWithAuth]);

  const update = useCallback(async (id, payload) => {
    const res = await fetchWithAuth(`/api/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.errors?.[0]?.msg || data?.error || 'Failed to update book');
    return data;
  }, [fetchWithAuth]);

  const remove = useCallback(async (id) => {
    const res = await fetchWithAuth(`/api/books/${id}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || 'Failed to delete book');
    return data;
  }, [fetchWithAuth]);

  const myBooks = useCallback(async (params = {}) => {
    const qs = toQueryString(params);
    const res = await fetchWithAuth(`/api/books/user/my-books${qs ? `?${qs}` : ''}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Failed to fetch user books');
    return data;
  }, [fetchWithAuth, toQueryString]);

  return { list, create, getById, update, remove, myBooks };
}
