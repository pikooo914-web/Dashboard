import { createClient } from '@supabase/supabase-js';

// Get keys from localStorage or window env if configured
const STORAGE_KEY_URL = 'cybertrack_supabase_url';
const STORAGE_KEY_ANON = 'cybertrack_supabase_anon_key';

export const getSupabaseCredentials = () => {
  const customUrl = localStorage.getItem(STORAGE_KEY_URL);
  const customKey = localStorage.getItem(STORAGE_KEY_ANON);

  const url = customUrl || (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const key = customKey || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  return { url, key, isConfigured: Boolean(url && key) };
};

export const saveSupabaseCredentials = (url: string, key: string) => {
  if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
  else localStorage.removeItem(STORAGE_KEY_URL);

  if (key) localStorage.setItem(STORAGE_KEY_ANON, key.trim());
  else localStorage.removeItem(STORAGE_KEY_ANON);
};

export const getSupabaseClient = () => {
  const { url, key, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;
  try {
    return createClient(url, key);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};
