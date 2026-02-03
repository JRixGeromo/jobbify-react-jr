import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const environment = import.meta.env.MODE;
const redirectUrl = import.meta.env.VITE_REDIRECT_URL;
export const supabaseStorageURL = import.meta.env.VITE_SUPABASE_STORAGE_URL;

if (!supabaseStorageURL) {
  throw new Error(
    'Environment variable VITE_SUPABASE_STORAGE_URL is not defined.'
  );
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

// Auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.email);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});

// Add environment-specific logging
if (environment !== 'production') {
  console.log('Current environment:', environment);
  console.log('Redirect URL:', redirectUrl);
}
