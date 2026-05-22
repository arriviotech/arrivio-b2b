import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.',
    'Run with: doppler run -- npm run dev'
  );
}

const customStorage = {
  getItem: (key) => {
    const rememberMe = localStorage.getItem('arrivio_remember_me') === 'true';
    const storage = rememberMe ? localStorage : sessionStorage;
    return storage.getItem(key);
  },
  setItem: (key, value) => {
    const rememberMe = localStorage.getItem('arrivio_remember_me') === 'true';
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(key, value);
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
};

function createUnconfiguredSupabaseClient() {
  const err = () =>
    new Error("Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");

  const builder = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "then") {
          return (resolve) => resolve({ data: null, error: err() });
        }
        if (prop === "single") {
          return () => builder;
        }
        return () => builder;
      },
    }
  );

  return {
    from() {
      return builder;
    },
  };
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: customStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      })
    : createUnconfiguredSupabaseClient();
